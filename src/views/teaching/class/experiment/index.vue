@@ -1,464 +1,13 @@
<template>
  <el-card>
    <el-button type="primary" @click="clickAddExperiment()" style="margin-bottom: 20px;">添加新实验</el-button>
    <el-table :data="showExperimentList" stripe style="width: 100%; min-height: 440px">
      <el-table-column prop="experimentId" label="实验序号" width="150" />
      <el-table-column prop="experimentName" label="实验名称" width="400" />
      <el-table-column prop="startTime" label="开始时间" width="200" />
      <el-table-column prop="endTime" label="结束时间" width="200" />
      <el-table-column prop="score" label="实验分值" width="120" />  
      <el-table-column label="实验指导书" width="200">
        <el-table-column prop="状态" label="状态" width="90">
          <template #default="scope">
            <el-tag v-if="scope.row.instructor != null">已上传</el-tag>
            <el-tag v-else type="info">未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作" width="140">
          <template #default="scope">
            <template v-if="scope.row.instructor != null">
              <el-button size="small" type="success" @click="clickViewInstructor(scope.$index, scope.row)">查看</el-button>
              <el-button size="small" type="warning" @click="clickModifyInstructor(scope.$index, scope.row)">修改</el-button>
            </template>
            <el-button v-else size="small" type="danger" @click="clickModifyInstructor(scope.$index, scope.row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="实验报告模板">
        <el-table-column prop="状态" label="状态" width="90">
          <template #default="scope">
            <el-tag v-if="scope.row.template != null">已上传</el-tag>
            <el-tag v-else type="info">未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作" width="140">
          <template #default="scope">
            <template v-if="scope.row.template != null">
              <el-button size="small" type="success" @click="clickViewTemplate(scope.$index, scope.row)">查看</el-button>
              <el-button size="small" type="warning" @click="clickModifyTemplate(scope.$index, scope.row)">修改</el-button>
            </template>
            <el-button v-else size="small" type="danger" @click="clickModifyTemplate(scope.$index, scope.row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="score" label="操作" fixed="right" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="clickDeleteExperiment(scope.$index, scope.row)">删除</el-button>
          <el-button link type="primary" size="small" @click="clickModifyExperiment(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>      
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="experimentList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- 删除的确认框 -->
  <el-dialog
    v-model="deleteDialogVisible"
    title="提示"
    width="30%"
    :before-close="handleClose"
  >
    <span>确定要删除 {{ currentExperiment.experimentName }} 吗</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="clickConfirmDeleteExperiment()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改实验的表单 -->
  <el-dialog v-model="modifyDialogVisible" title="实验信息修改">
    <el-form :model="form" :rules="rules">
      <el-form-item label="实验名称" prop="experimentName">
        <el-input v-model="form.experimentName" disabled />
      </el-form-item>
      <el-form-item label="实验开始时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="请选择实验开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="实验结束时间" prop="endTime">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="请选择实验结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="实验分值" prop="score">
        <el-input-number v-model="form.score" :min="1" :max="100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="clickConfirmModifyExperiment()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>  
  <el-dialog
    v-model="addDialogVisible"
    title="新增实验"
    :before-close="handleClose"
  >
    <el-table :data="addExperimentList" stripe style="width: 100%;" ref="multipleTableRef" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="experimentId" label="实验序号" width="100" />
      <el-table-column prop="experimentName" label="实验名称" />
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false; fileList.value = []">取消</el-button>
        <el-button type="primary" @click="clickConfirmAddExperiment()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogTableVisible" :title="dialogTitle">
    <el-upload
      class="upload-demo"
      drag
      :auto-upload="false"
      :on-change="onUploadChange"
      :on-remove="handleRemove"
      :file-list="fileList"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件或 <em>点击此处</em> 上传
      </div>
      <template #tip>
        <div class="el-upload__tip">
          仅支持上传单个文件，格式为pdf/word  
        </div>
      </template>
    </el-upload>
    
    <el-button type="primary" @click="confirmUpload">确认</el-button>
    
    <el-button type="info" @click="dialogTableVisible = false; fileList = []">取消</el-button>
  </el-dialog>
</template>

<script setup lang="ts" name="experiment">
import { ref, reactive } from 'vue'
import { Experiment } from '@/api/interface'
import { getOneCourseAllExperiments, modifyExperimentInCourse, deleteExperimentInCourse, getOneCourseExceptionExperiments, addExperimentInCourse, uploadExperimentInstructor, uploadExperimentTemplate } from '@/api/modules/experiment'
import type { FormRules } from 'element-plus'
import { ElMessage, ElTable } from 'element-plus'

const regex = /teaching\/(\d+)/;
const experimentList = ref<Experiment.CourseExperimentList[]>([]);
const showExperimentList = ref<Experiment.CourseExperimentList[]>([]);

const addExperimentList = ref<Experiment.ExperimentList[]>([]);

const currentPage = ref(1)
const pageSize = ref(10)
const courseId = ref(0)

const fileList = ref<File[]>([])

const currentExperiment = ref<Experiment.CourseExperimentList>();
const deleteDialogVisible = ref(false)

const modifyDialogVisible = ref(false)

const dialogTableVisible = ref(false)
const dialogTitle = ref("")

const form = reactive({
  experimentName: '',
  startTime: '',
  endTime: '',
  score: 0,
})

const currentExperimentId = ref(0);
const currentType = ref("");

const addDialogVisible = ref(false);

const rules = reactive<FormRules>({
  experimentName: [
    {
      type: 'string',
      required: true,
      trigger: 'change'
    }
  ],
  startTime: [
    {
      type: 'date',
      required: true,
      message: '开始时间是必须项',
      trigger: 'change'
    }
  ],
  endTime: [
    {
      type: 'date',
      required: true,
      message: '结束时间必须项',
      trigger: 'change'
    }
  ],
  score: [
    {
      type: 'number',
      message: '实验分值是必须项',
      required: true
    }
  ],
})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Experiment.ExperimentList[]>([])
const handleSelectionChange = (val: Experiment.ExperimentList[]) => {
  multipleSelection.value = val;
  console.log(multipleSelection.value);
}

let url = window.location.href
let match = url.match(regex);
if (match) {
  courseId.value = parseInt(match[1])
  console.log("课程序号为", courseId)
  getOneCourseAllExperiments(courseId.value).then(res => {
    console.log("当前课程中的实验为：", res.data)
    experimentList.value = res.data;
    experimentList.value.forEach(e => {
      console.log(typeof e.startTime);
      e.startTime = dateFormat(e.startTime);
      e.endTime = dateFormat(e.endTime);
    });
    showExperimentList.value = experimentList.value.slice(0 + pageSize.value * (currentPage.value - 1), pageSize.value + pageSize.value * (currentPage.value - 1));
  })
}

const formIncomplete = () => {
  ElMessage.error('请完善实验信息')
}

const dateFormat = (timestamp: string) => {
  if (timestamp == null) return "";
  const dateObj: Date = new Date(timestamp);

  // 获取年、月、日、小时、分钟和秒
  const year: number = dateObj.getFullYear();
  const month: number = dateObj.getMonth() + 1;
  const day: number = dateObj.getDate();
  const hours: number = dateObj.getHours();
  const minutes: number = dateObj.getMinutes();
  const seconds: number = dateObj.getSeconds();

  // 将年、月、日、小时、分钟和秒组合成所需的格式
  const dateStr: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return dateStr;

}

const clickAddExperiment = () => {
  console.log("添加新实验")
  getOneCourseExceptionExperiments(courseId.value).then(res => {
    console.log("当前没有选择实验有", res.data);
    addExperimentList.value = res.data;

  })
  addDialogVisible.value = true;

}

const clickDeleteExperiment = (index: number, row: Experiment.CourseExperimentList) => {
  deleteDialogVisible.value = true;
  currentExperiment.value = row;
}

const clickConfirmDeleteExperiment = () => {
  deleteDialogVisible.value = false;
  console.log("删除实验", currentExperiment.value)
  if (currentExperiment.value !== undefined) {
    deleteExperimentInCourse(courseId.value, currentExperiment.value.experimentId).then(res => {
      console.log(res);
      getOneCourseAllExperiments(courseId.value).then(res => {
        console.log("当前课程中的实验为：", res.data)
        experimentList.value = res.data;
        experimentList.value.forEach(e => {
          console.log(typeof e.startTime);
          e.startTime = dateFormat(e.startTime);
          e.endTime = dateFormat(e.endTime);
        });
      })
    })
  }
  
}

const clickModifyExperiment = (index: number, row: Experiment.CourseExperimentList) => {
  console.log("修改实验");
  modifyDialogVisible.value = true;
  currentExperiment.value = row;
  form.experimentName = row.experimentName;
  console.log(form);
  form.startTime = row.startTime;
  form.endTime = row.endTime;
  form.score = row.score;
}

const clickConfirmModifyExperiment = () => {
  console.log("确认修改实验", currentExperiment.value)
  if (form.startTime === null || form.endTime === null ||form.score === null) {
    formIncomplete();
    return;
  }
  if (currentExperiment.value !== undefined) {
    let ex = currentExperiment.value;
    modifyExperimentInCourse(courseId.value.toString(), ex.experimentId.toString(), form.startTime, form.endTime, form.score.toString()).then(res => {
      console.log(res);
      getOneCourseAllExperiments(courseId.value).then(res => {
        console.log("当前课程中的实验为：", res.data)
        experimentList.value = res.data;
        experimentList.value.forEach(e => {
          console.log(typeof e.startTime);
          e.startTime = dateFormat(e.startTime);
          e.endTime = dateFormat(e.endTime);
        });
        modifyDialogVisible.value = false;
      })
    })
  }
}

const clickConfirmAddExperiment = () => {
  console.log("确认添加实验");
  if (multipleSelection.value.length !== 0) {
    let experimentIdList = multipleSelection.value.map(obj => obj.experimentId.toString());
    addExperimentInCourse(courseId.value.toString(), experimentIdList).then(res => {
      console.log(res);
      getOneCourseAllExperiments(courseId.value).then(res => {
        console.log("当前课程中的实验为：", res.data)
        experimentList.value = res.data;
        experimentList.value.forEach(e => {
          console.log(typeof e.startTime);
          e.startTime = dateFormat(e.startTime);
          e.endTime = dateFormat(e.endTime);
        });
        modifyDialogVisible.value = false;
      })
      addDialogVisible.value = false;
    })
  }
}

const clickViewInstructor = (index: number, row: Experiment.CourseExperimentList) => {
  console.log("查看实验指导书", index, row)
  window.open(row.instructor, '_blank')
}

const clickModifyInstructor = (index: number, row: Experiment.ExperimentList) => {
  console.log("修改实验指导书", index, row)
  currentExperimentId.value = row.experimentId;
  currentType.value = "指导书";
  dialogTitle.value = row.experimentName + "  实验指导书"
  dialogTableVisible.value = true;
}

const clickViewTemplate = (index: number, row: Experiment.CourseExperimentList) => {
  console.log("查看实验报告模板", index, row)
  window.open(row.template, '_blank')
}

const clickModifyTemplate = (index: number, row: Experiment.ExperimentList) => {
  console.log("修改实验报告模板", index, row)
  currentExperimentId.value = row.experimentId;
  currentType.value = "模板";
  dialogTitle.value = row.experimentName + "  实验报告模板"
  dialogTableVisible.value = true;
}

// const clickCnacelAddExperiment = () => {
//   dialogTableVisible.value = false;
//   fileList.value.pop();
// }

const onUploadChange = (file: File) => {
  console.log("添加文件");
  fileList.value.push(file);
  console.log(fileList);
}

const handleRemove = () => {
  console.log("删除文件");
  fileList.value.pop();
  console.log(fileList);
}

const confirmUpload = () => {
  console.log("确认上传");
  if (currentType.value == "指导书") {
    uploadExperimentInstructor(fileList.value[0], courseId.value, Number(currentExperimentId.value))
    .then(res => {
      console.log(res);
      getOneCourseAllExperiments(courseId.value).then(res => {
        console.log("当前课程中的实验为：", res.data)
        experimentList.value = res.data;
        experimentList.value.forEach(e => {
          console.log(typeof e.startTime);
          e.startTime = dateFormat(e.startTime);
          e.endTime = dateFormat(e.endTime);
        });

        dialogTableVisible.value = false;
      })
    })
    .catch(err => {
      console.log(err);
    })
  } 
  else {
    uploadExperimentTemplate(fileList.value[0], courseId.value, Number(currentExperimentId.value))
    .then(res => {
      console.log(res);
      getOneCourseAllExperiments(courseId.value).then(res => {
        console.log("当前课程中的实验为：", res.data)
        experimentList.value = res.data;
        experimentList.value.forEach(e => {
          console.log(typeof e.startTime);
          e.startTime = dateFormat(e.startTime);
          e.endTime = dateFormat(e.endTime);
        });

        dialogTableVisible.value = false;
      })
    })
    .catch(err => {
      console.log(err);
    })
  }
  
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  showExperimentList.value = experimentList.value.slice(0 + pageSize.value * (currentPage.value - 1), pageSize.value + pageSize.value * (currentPage.value - 1));

}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  showExperimentList.value = experimentList.value.slice(0 + pageSize.value * (currentPage.value - 1), pageSize.value + pageSize.value * (currentPage.value - 1));
}

</script>

<style scoped></style>
