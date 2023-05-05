<!-- <template>
  <div class="card content-box">
    <span class="text"> 课程通知公告 🍓🍇🍈🍉</span>
    <p>发布课程通知等</p>
  </div>
</template> -->
<template>
  <el-card>
    <el-button type="primary" @click="clickAddNotice">新增公告</el-button>
    <el-table :data="showList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="noticeId" label="公告序号" width="220" />
      <el-table-column prop="title" label="公告标题" width="220" />
      <el-table-column prop="time" label="发布时间" width="220" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="clickeditNotice(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="clickdeleteNotice(scope.row.noticeId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!--删除公告的弹出框-->
  <el-dialog v-model="dialogDeleteVisible" title="确认删除" @close="cancelDelete">
    <span>您确定要删除这条公告吗？</span>
    <el-button @click="cancelDelete">取消</el-button>
    <el-button type="danger" @click="deleteNotice">确定</el-button>
  </el-dialog>

  <!--新增公告的弹出框-->
  <el-dialog v-model="dialogTableVisible" title="新增公告">
    <el-form :model="addNoticeForm" :rules="courseRules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="addNoticeForm.noticeTitle" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="addNoticeForm.publishTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
          format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="课程序号" prop="courseId">
        <el-input v-model="addNoticeForm.courseId" disabled />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <!-- 富文本输入公告内容 -->
        <div :class="['editor-box', disabled ? 'editor-disabled' : '']">
          <Toolbar class="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            v-if="!hideToolBar" />
          <Editor :style="{ height }" class="editor-content'" v-model="addNoticeForm.content"
            :defaultConfig="editorConfig" :mode="mode" @on-created="handleCreated" @on-blur="handleBlur" />
        </div>
        <!-- <el-input type="textarea" v-model="addNoticeForm.content" :rows="10" /> -->
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit">确认</el-button>
    <el-button @click="onCancel">取消</el-button>
  </el-dialog>

  <!--修改公告的弹出框-->
  <el-dialog v-model="dialogModifyVisible" title="修改公告">
    <el-form :model="addNoticeForm" :rules="courseRules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="addNoticeForm.noticeTitle" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="addNoticeForm.publishTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
          format="YYYY-MM-DD" :picker-options="{ firstDayOfWeek: 1 }" />
      </el-form-item>
      <el-form-item label="课程序号" prop="courseId">
        <el-input v-model="addNoticeForm.courseId" disabled />
      </el-form-item>
      <el-form-item label="公告序号" prop="noticeId">
        <el-input v-model="addNoticeForm.noticeId" disabled />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <!-- 富文本输入公告内容 -->
        <div :class="['editor-box', disabled ? 'editor-disabled' : '']">
          <Toolbar class="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            v-if="!hideToolBar" />
          <Editor :style="{ height }" class="editor-content'" v-model="addNoticeForm.content"
            :defaultConfig="editorConfig" :mode="mode" @on-created="handleCreated" @on-blur="handleBlur" />
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit">确认</el-button>
    <el-button @click="onCancel">取消</el-button>
  </el-dialog>
</template>

<script setup lang="ts" name="announcement">
/* eslint-disable */
import { ref, reactive, onMounted, watch } from 'vue'
import { FormInstance, FormRules, dayjs } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { Announcement } from '@/api/interface'
import { getAnnouncementsByCourseId, addAnnouncement, deleteAnnouncementsById } from "@/api/modules/Announcement"
import { ElMessage, ElForm, ElFormItem } from 'element-plus'

const router = useRouter();
const routerName = router.currentRoute.value.name!.valueOf();
const courseId = (routerName as string)!.split('-')[0]
const deleteNoticeId = ref(0)
const dialogTableVisible = ref(false)
const dialogDeleteVisible = ref(false)
const dialogModifyVisible = ref(false)
const showList = ref<Announcement.SingleAnnouncement[]>()
const addNoticeForm = ref({ noticeId: 0, courseId: courseId, noticeTitle: '', publishTime: '', content: '' })
addNoticeForm.value.publishTime = dayjs().format('YYYY-MM-DD')
console.log(addNoticeForm.value.publishTime)

const upload = ref<UploadInstance>()


const ruleFormRef = ref<FormInstance>()
const courseRules = reactive<FormRules>({
  noticeTitle: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
  ],
  publishTime: [
    { required: true, message: '请输入发布时间', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入公告内容，最多800字', trigger: 'blur' },
  ],
})

onMounted(() => {
  let noticeList = []
  console.log(courseId)
  //向后端拿到该教师的课程列表
  getAnnouncementsByCourseId({ 'courseId': courseId })
    .then(res => {
      noticeList = res.data
      console.log(res.data)
      showList.value = noticeList
      console.log(showList.value)
    })
    .catch(err => {
      console.log(err)
    })
});

//点击新增课程按钮
const clickAddNotice = () => {
  addNoticeForm.value.noticeId = 0
  dialogTableVisible.value = true
}
//点击修改课程按钮
const clickeditNotice = (row: {
  noticeId: number; courseId: number
  title: string; time: string; content: string
}) => {
  dialogModifyVisible.value = true
  addNoticeForm.value.noticeId = row.noticeId
  addNoticeForm.value.courseId = courseId
  addNoticeForm.value.content = row.content
  console.log(addNoticeForm.value.content)
  addNoticeForm.value.noticeTitle = row.title
  addNoticeForm.value.publishTime = row.time
}
//点击删除课程按钮
const clickdeleteNotice = (param: number) => {
  dialogDeleteVisible.value = true
  deleteNoticeId.value = param
}
//取消删除
const cancelDelete = () => {
  dialogDeleteVisible.value = false;
  deleteNoticeId.value = 0;
}
//确认删除
const deleteNotice = () => {
  deleteAnnouncementsById({ 'noticeId': deleteNoticeId.value })
    .then((res: any) => {
      console.log(res)
      ElMessage({
        message: '删除公告成功！',
        type: 'success',
      })

      //向后端拿到该教师的公告列表
      getAnnouncementsByCourseId({ 'courseId': courseId })
        .then(res => {
          showList.value = []
          showList.value = res.data
        })
        .catch((err: any) => {
          console.log(err)
        })

      dialogDeleteVisible.value = false
    })
    .catch((err: any) => {
      console.log(err)
      ElMessage.error('公告删除失败，请重试')
      dialogDeleteVisible.value = false
    })

}



//确认提交新增
const onSubmit = () => {

  let params = ref<Announcement.SingleAnnouncement>({
    // courseId: 0,
    courseId: (addNoticeForm.value.courseId).toString(),
    noticeId: (addNoticeForm.value.noticeId).toString(),
    noticeTitle: addNoticeForm.value.noticeTitle,
    publishTime: addNoticeForm.value.publishTime,
    content: addNoticeForm.value.content
  })

  /**先确认信息是否填写完整！ */
  if (params.value.noticeId == '' ||
    params.value.courseId == '' ||
    params.value.content == null ||
    params.value.publishTime == '' ||
    params.value.noticeTitle == '') {
    ElMessage({
      message: '表单未填写完整！',
      type: 'warning',
    })
    return;
  }

  console.log("要发出去的数据：", params)
  console.log(JSON.stringify(params));

  addAnnouncement(params.value)
    .then((res: any) => {
      console.log(res)
      ElMessage({
        message: '成功！',
        type: 'success',
      })

      //向后端拿到该教师的课程列表
      getAnnouncementsByCourseId({ 'courseId': courseId })
        .then(res => {
          showList.value = []
          showList.value = res.data
        })
        .catch((err: any) => {
          console.log(err)
        })

      dialogTableVisible.value = false
    })
    .catch((err: any) => {
      console.log(err)
      ElMessage.error('公告添加失败，请重试')
      dialogTableVisible.value = false
    })

}

const onCancel = () => {
  dialogTableVisible.value = false
}

import { nextTick, computed, shallowRef, onBeforeUnmount } from "vue";
import { IToolbarConfig, IEditorConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { uploadImg, uploadVideo } from "@/api/modules/upload";
import "@wangeditor/editor/dist/css/style.css";
import { useRouter } from 'vue-router'

// 富文本 DOM 元素
const editorRef = shallowRef();

// 实列化编辑器
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

// 接收父组件参数，并设置默认值
interface RichEditorProps {
  value: string; // 富文本值 ==> 必传
  toolbarConfig?: Partial<IToolbarConfig>; // 工具栏配置 ==> 非必传（默认为空）
  editorConfig?: Partial<IEditorConfig>; // 编辑器配置 ==> 非必传（默认为空）
  height?: string; // 富文本高度 ==> 非必传（默认为 500px）
  mode?: "default" | "simple"; // 富文本模式 ==> 非必传（默认为 default）
  hideToolBar?: boolean; // 是否隐藏工具栏 ==> 非必传（默认为false）
  disabled?: boolean; // 是否禁用编辑器 ==> 非必传（默认为false）
}
const props = withDefaults(defineProps<RichEditorProps>(), {
  toolbarConfig: () => {
    return {
      excludeKeys: []
    };
  },
  editorConfig: () => {
    return {
      placeholder: "请输入内容...",
      MENU_CONF: {}
    };
  },
  height: "500px",
  mode: "default",
  hideToolBar: false,
  disabled: false
});

// 判断当前富文本编辑器是否禁用
if (props.disabled) nextTick(() => editorRef.value.disable());

// 富文本的内容监听，触发父组件改变，实现双向数据绑定
type EmitProps = {
  (e: "update:value", val: string): void;
  (e: "check-validate"): void;
};
const emit = defineEmits<EmitProps>();
const valueHtml = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) val = "";
    emit("update:value", val);
  }
});

/**
 * @description 图片自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
props.editorConfig.MENU_CONF!["uploadImage"] = {
  async customUpload(file: File, insertFn: InsertFnTypeImg) {
    if (!uploadImgValidate(file)) return;
    let formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadImg(formData);
      insertFn(data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  }
};

// 图片上传前判断
const uploadImgValidate = (file: File): boolean => {
  console.log(file);
  return true;
};

/**
 * @description 视频自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
type InsertFnTypeVideo = (url: string, poster?: string) => void;
props.editorConfig.MENU_CONF!["uploadVideo"] = {
  async customUpload(file: File, insertFn: InsertFnTypeVideo) {
    if (!uploadVideoValidate(file)) return;
    let formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadVideo(formData);
      insertFn(data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  }
};

// 视频上传前判断
const uploadVideoValidate = (file: File): boolean => {
  console.log(file);
  return true;
};

// 编辑框失去焦点时触发
const handleBlur = () => {
  emit("check-validate");
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy();
});

defineExpose({
  editor: editorRef
});

</script>