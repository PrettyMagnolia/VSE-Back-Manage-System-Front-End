<template>
  <div class="card content-box">
    <el-table :data="scoreTable" style="width: 100%" v-loading="scoreTableLoading">
      <!--展开列-->
      <el-table-column type="expand">
        <template #default="scope">
          <div>
            <el-table :data="scope.row.scoreList">
              <el-table-column prop="experimentName" label="实验名称" width="350">
              </el-table-column>
              <el-table-column prop="score" label="实验分数" width="260">
              </el-table-column>
              <el-table-column prop="maxScore" label="实验满分">
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <!--正常列-->
      <el-table-column prop="index" label="学生序号" width="200" />
      <el-table-column prop="studentId" label="学号" width="250" />
      <el-table-column prop="studentName" label="姓名" width="300" />
      <el-table-column prop="totalScore" label="总成绩" />
    </el-table>
  </div>
</template>

<script setup lang="ts" name="score">
import { ref, onMounted } from 'vue'
import { Score } from '@/api/interface'
import { coursescore } from "@/api/modules/score"

const courseId = ref()
const scoreTableLoading = ref(false)
const scoreTable = ref<Score.StudentCourseTotalScore[]>([
  // {
  //   index: 1,
  //   studentId: 2050865,
  //   studentName: '黄彦铭',
  //   totalScore: 80,
  //   scoreList: [
  //     {
  //       experimentName: '实验一',
  //       score: 10
  //     },
  //     {
  //       experimentName: '实验二',
  //       score: 10
  //     },
  //   ]
  // }
])

onMounted(() => {
  scoreTableLoading.value = true

  //拿到courseId
  let url = window.location.href
  let match = url.match(/teaching\/(\d+)/);
  console.log(match[1])
  if (match) {
    courseId.value = parseInt(match[1])

  }

  //向后端请求该课程的成绩列表
  coursescore({ courseId: courseId.value })
    .then(res => {
      console.log('请求到的后端数据', res)
      scoreTable.value = res.data
      scoreTableLoading.value = false
    })
    .catch(err => {
      console.log(err)
      scoreTableLoading.value = false
    })
});
</script>

<style scoped></style>