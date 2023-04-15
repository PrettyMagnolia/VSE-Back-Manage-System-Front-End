<template>
  <el-card>
    <el-table :data="showList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="experimentId" label="实验序号" width="180" />
      <el-table-column prop="experimentName" label="实验名称" width="450" />
      
    </el-table>
  </el-card>
</template>

<script setup lang="ts" name="experiment">
import { onMounted } from 'vue'
import { getOneCourseAllExperiments } from '@/api/modules/experiment'
const regex = /teaching\/(\d+)/;

onMounted(() => {
  let url = window.location.href
  let match = url.match(regex);
  if (match) {
    let courseId = match[1];
    console.log("课程序号为", courseId)
    getOneCourseAllExperiments(parseInt(courseId)).then(res => {
      console.log("当前课程中的实验为：", res.data)
    })
  }
});

</script>

<style scoped></style>