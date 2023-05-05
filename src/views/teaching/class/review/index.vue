<template>
  <div class="card review-content-main">
    <el-row justify="start" align="middle" class="header">
      <el-col :span="7">
        <el-select
          v-model="currentExpId" placeholder="请选择实验项目" value-key="experimentId" @change="changeCurrentExperiment"
          style="width:300px;">
          <el-option
            v-for="item in experimentList" :key="item.experimentId" :label="item.experimentName"
            :value="item.experimentId">
            <span style="float: left">{{ item.experimentName }}</span>
            <span style=" float: right;color: var(--el-text-color-secondary);font-size: 13px;">
              {{ getExperimentState(item) }}
            </span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span>实验时间 : </span>
        <span class="small-grey">{{ currentExperiment?.startTime }} -- {{ currentExperiment?.endTime }}</span>
      </el-col>
      <el-col :span="3">
        <span>实验状态 : </span>
        <span class="small-grey">{{ currentExperiment == undefined ? '--' : getExperimentState(currentExperiment)
        }}</span>
      </el-col>
      <el-col :span="3">
        <span>已提交人数 : </span>
        <span class="small-grey">{{ currentExpIndex == undefined ? '--' : stumitedTotal }}</span>
      </el-col>
      <el-col :span="3">
        <span>实验分值 : </span>
        <span class="small-grey">{{ currentExpIndex == undefined ? '--' : currentExperiment?.score }}</span>
      </el-col>
    </el-row>
    <div style="height: 10px;" />
    <el-table :data="tableData" v-if="tableData != undefined" height="500" class="table" @row-click="handleRowClick">
      <el-table-column prop="schoolNumber" label="学号" width="100" />
      <el-table-column fixed prop="stuName" label="姓名" width="100" />
      <el-table-column prop="submitTime" label="最近提交时间" width="200" />
      <el-table-column prop="reportUrl" label="实验报告" width="300">
        <template #default="scope">
          <span v-if="scope.row.reportUrl == undefined">未提交</span>
          <el-space v-else wrap>
            <el-icon v-if="reportIsUpdate(scope.row.submitTime, scope.row.reviewTime)">
              <ArrowUpBold color="green" />
            </el-icon>
            <el-link type="success" target="_blank" :href="scope.row.reportUrl">
              {{ getReportName(scope.row.reportUrl) }}
            </el-link>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column prop="reviewTime" label="最近批阅时间" width="200" />
      <el-table-column prop="score" label="得分" width="100" />

      <el-table-column fixed="right" prop="score" label="评阅" width="200">
        <template #default="scope">

          <span v-if="scope.row.stuId == currentRow?.stuId && scope.row.reportId != undefined">
            <el-space wrap>
              <el-input
                size="small" type="number" step="0.01" :max="currentExperiment?.score" class="score-input"
                v-model="score">
                {{ scope.row.score }}
              </el-input>
              <el-button size="small" type="success" @click="giveScore(score, scope.row.reportId)">确定</el-button>
            </el-space>
          </span>
          <span v-else>
            <el-button size="small" type="success">打分</el-button>
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="评阅状态" width="150">
        <template #default="scope">
          <span v-if="scope.row.reportUrl == undefined">
            <el-tag size="small" type="info">未提交</el-tag>
          </span>
          <span v-else-if="scope.row.reportUrl && scope.row.score == undefined">
            <el-tag size="small" type="danger">未评阅</el-tag>
          </span>
          <span v-else-if="reportIsUpdate(scope.row.submitTime, scope.row.reviewTime)">
            <el-tag size="small" type="warning">报告更新</el-tag>
          </span>
          <span v-else-if="scope.row.score">
            <el-tag size="small" type="success">已评阅</el-tag>
          </span>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="review">
import { getCourseExperiments, getStudnetSubmit, giveReportScore } from '@/api/modules/review';
import { Review } from '@/api/interface';
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { currentTimeState } from '@/utils/util';
import { ElMessage } from 'element-plus';
const router = useRouter();
const routerName = router.currentRoute.value.name!.valueOf();
const courseId = (routerName as string)!.split('-')[0]

const currentExpId = ref<number>()
let experimentList = ref<Review.Experiment[]>([])
const currentExperiment = computed(() => {
  if (currentExpId.value == undefined) return undefined
  return experimentList.value.find(e => e.experimentId === currentExpId.value)
})

onMounted(async () => {
  const { data: temp } = await getCourseExperiments({ courseId: courseId });
  experimentList.value = temp;
})

interface expStuSub {
  experimentId: number,
  submit: Review.StudentSubmit[]
}

let stuSubmit = reactive<expStuSub[]>([]);
const currentExpIndex = ref<number>();

const changeCurrentExperiment = async (experimentId: number) => {
  const eId = experimentId;
  const index = stuSubmit.findIndex(s => s.experimentId === eId);
  if (index === -1) {
    const { data } = await getStudnetSubmit({ courseId: courseId, experimentId: eId.toString() });
    stuSubmit.push({ experimentId: eId, submit: data });
    currentExpIndex.value = stuSubmit.length - 1;
  } else {
    currentExpIndex.value = index;
  }
}

const tableData = computed(() => {
  if (currentExpIndex.value == undefined) return [];
  return stuSubmit[currentExpIndex.value].submit
})

const currentRow = ref<Review.StudentSubmit>()
const handleRowClick = (row: Review.StudentSubmit) => {
  currentRow.value = row;
}

const score = ref<number>()
// 打分
const giveScore = async (sc?: number, reportId?: number) => {
  if (sc == undefined || Number(sc) > Number(currentExperiment.value!.score)) {
    ElMessage({ type: 'warning', message: "超出最大分值" });
    score.value = 0;
    return;
  }
  const { data } = await giveReportScore({ score: Number(sc), reportId: reportId! });
  if (data == true) {
    stuSubmit[currentExpIndex.value!].submit.map((s, index) => {
      if (s.reportId === reportId) {
        stuSubmit[currentExpIndex.value!].submit[index].reviewTime = new Date().toLocaleString("zh-CN", { hour12: false });
        stuSubmit[currentExpIndex.value!].submit[index].score = Number(sc);
      }
    })
    score.value = 0;
    currentRow.value = undefined;
  }
}

// 报告是否已更新
const reportIsUpdate = (submitTime: string | undefined, reivewTime: string | undefined) => {
  if (submitTime == undefined || reivewTime == undefined) return false
  const sub = new Date(submitTime);
  const rev = new Date(reivewTime);
  if (sub.getTime() < rev.getTime()) return false;
  else return true;
}

// 预览实验报告,实验报告名
const getReportName = (reportUrl: string | undefined) => {
  if (reportUrl == undefined) return ' 未提交123 ';
  const arr = reportUrl.split('/');
  return arr[arr.length - 1];
}

// 提交人数
const stumitedTotal = computed(() => {
  if (currentExpIndex.value == undefined) { return ' -- ' }
  let total = 0;
  stuSubmit[currentExpIndex.value].submit.forEach((s) => { s.reportId && total++ });
  return total;
})

// 工具函数
const getExperimentState = (experiment: Review.Experiment) => {
  const start = new Date(experiment.startTime);
  const end = new Date(experiment.endTime);
  const index = currentTimeState(start, end);
  return ['未开始', '正在进行中', '已结束'].at(index + 1)
}
</script>

<style scoped>
.review-content-main {
  height: 100%;
}

.small-grey {
  font-size: small;
  color: gray;
}

.table {
  height: 100%;
}

.score-input {
  width: 50px;
}
</style>