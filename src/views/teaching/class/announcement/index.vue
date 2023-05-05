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
    <template>
      <el-button @click="cancelDelete">取消</el-button>
      <el-button type="danger" @click="deleteNotice">确定</el-button>
    </template>
  </el-dialog>

  <!--新增公告的弹出框-->
  <el-dialog v-model="dialogTableVisible" title="新增公告">
    <el-form :model="addNoticeForm" :rules="courseRules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="addNoticeForm.noticeTitle" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="addNoticeForm.publishTime" type="date" placeholder="选择日期" value-format="yyyy-MM-d" />
      </el-form-item>
      <el-form-item label="课程序号" prop="courseId">
        <el-input v-model="addNoticeForm.courseId" disabled />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <!-- 富文本输入公告内容
        <div id="editor-container">
          <Editor v-model="addNoticeForm.content" />
        </div> -->
        <el-input type="textarea" v-model="addNoticeForm.content" :rows="10" />
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
        <el-date-picker v-model="addNoticeForm.publishTime" type="date" placeholder="选择日期" value-format="yyyy-MM-d"
          :picker-options="{ firstDayOfWeek: 1 }" />
      </el-form-item>
      <el-form-item label="课程序号" prop="courseId">
        <el-input v-model="addNoticeForm.courseId" disabled />
      </el-form-item>
      <el-form-item label="公告序号" prop="noticeId">
        <el-input v-model="addNoticeForm.noticeId" disabled />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <!-- 富文本输入公告内容
        <div id="editor-container">
          <Editor v-model="addNoticeForm.content" />
        </div> -->
        <el-input type="textarea" v-model="addNoticeForm.content" :rows="10" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit">确认</el-button>
    <el-button @click="onCancel">取消</el-button>
  </el-dialog>
</template>

<script setup lang="ts" name="announcement">
/* eslint-disable */
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { Announcement } from '@/api/interface'
import { getAnnouncementsByCourseId, addAnnouncement, deleteAnnouncementsById } from "@/api/modules/Announcement"
import { ElMessage, ElForm, ElFormItem} from 'element-plus'
import Editor from '@wangeditor/editor'

const courseId = 42041301
const deleteNoticeId = ref(0)
const dialogTableVisible = ref(false)
const dialogDeleteVisible = ref(false)
const dialogModifyVisible = ref(false)
const showList = ref<Announcement.SingleAnnouncement[]>()
const addNoticeForm = ref({ noticeId: 0, courseId: courseId, noticeTitle: '', publishTime: new Date(), content: '' })

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
  title: string; time: Date; content: string
}) => {
  dialogModifyVisible.value = true
  addNoticeForm.value.noticeId = row.noticeId
  addNoticeForm.value.courseId = courseId
  addNoticeForm.value.content = row.content
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
  deleteAnnouncementsById(deleteNoticeId)
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
    noticeId: (0).toString(),
    noticeTitle: addNoticeForm.value.noticeTitle,
    publishTime: new Date(addNoticeForm.value.publishTime).toLocaleDateString(),
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
        message: '新增公告成功！',
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

</script>