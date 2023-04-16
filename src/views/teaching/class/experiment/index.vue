<template>
  <el-card>
    <el-button type="primary" @click="clickAddExperiment()" style="margin-bottom: 20px;">添加新实验</el-button>
    <el-table :data="experimentList" stripe style="width: 100%; min-height: 440px">
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
        <el-table-column prop="操作" label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" :disabled="scope.row.instructor == null" @click="clickViewInstructor(scope.$index, scope.row)">查看</el-button>
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
        <el-table-column prop="操作" label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" :disabled="scope.row.template == null" @click="clickViewTemplate(scope.$index, scope.row)">查看</el-button>
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
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
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
</template>

<script setup lang="ts" name="experiment">
import { ref, reactive } from 'vue'
import { Experiment } from '@/api/interface'
import { getOneCourseAllExperiments, modifyExperimentInCourse, deleteExperimentInCourse } from '@/api/modules/experiment'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const regex = /teaching\/(\d+)/;
const experimentList = ref<Experiment.CourseExperimentList[]>([]);

const currentPage = ref(1)
const pageSize = ref(10)
const courseId = ref(0)

const currentExperiment = ref<Experiment.CourseExperimentList>();
const deleteDialogVisible = ref(false)

const modifyDialogVisible = ref(false)
const form = reactive({
  experimentName: '',
  startTime: '',
  endTime: '',
  score: 0,
})

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
  })
}

const formIncomplete = () => {
  ElMessage.error('请完善实验信息')
}

const dateFormat = (timestamp: string) => {
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

const clickViewInstructor = (index: number, row: Experiment.CourseExperimentList) => {
  console.log("查看实验指导书", index, row)
  window.open(row.instructor, '_blank')
}

const clickViewTemplate = (index: number, row: Experiment.CourseExperimentList) => {
  console.log("查看实验报告模板", index, row)
  window.open(row.template, '_blank')
}

</script>

<style scoped></style>