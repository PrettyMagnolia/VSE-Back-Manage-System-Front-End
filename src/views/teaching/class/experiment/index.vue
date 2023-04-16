<template>
  <el-card>
    <el-button type="primary" @click="clickModifyInstructor(scope.$index, scope.row)" style="margin-bottom: 20px;">添加新实验</el-button>
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
            <el-button type="primary" size="small" :disabled="scope.row.instructor == null" @click="clickModifyInstructor(scope.$index, scope.row)">查看</el-button>
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
            <el-button type="primary" size="small" :disabled="scope.row.template == null" @click="clickModifyInstructor(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="score" label="操作" fixed="right" width="120">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick">删除</el-button>
          <el-button link type="primary" size="small">编辑</el-button>
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
</template>

<script setup lang="ts" name="experiment">
import { ref, onMounted } from 'vue'
import { Experiment } from '@/api/interface'
import { getOneCourseAllExperiments } from '@/api/modules/experiment'

const regex = /teaching\/(\d+)/;
const experimentList = ref<Experiment.CourseExperimentList[]>([]);

const currentPage = ref(1)
const pageSize = ref(10)

onMounted(() => {
  let url = window.location.href
  let match = url.match(regex);
  if (match) {
    let courseId = match[1];
    console.log("课程序号为", courseId)
    getOneCourseAllExperiments(parseInt(courseId)).then(res => {
      console.log("当前课程中的实验为：", res.data)
      experimentList.value = res.data;
      experimentList.value.forEach(e => {
        console.log(typeof e.startTime);
        e.startTime = dateFormat(e.startTime);
        e.endTime = dateFormat(e.endTime);
      });
    })
  }
});

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
  const dateStr: string = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return dateStr;

}

</script>

<style scoped></style>