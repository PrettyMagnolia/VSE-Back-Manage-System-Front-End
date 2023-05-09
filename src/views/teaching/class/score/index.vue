<template>
  <div class="card content-box">
    <el-table :data="scoreTable" style="width: 100%">
      <!--展开列-->
      <el-table-column type="expand">
        <template #default="scope">
          <div>
            <el-table :data="scope.row.scoreList">
              <el-table-column prop="experimentName" label="实验名称" width="300">
              </el-table-column>
              <el-table-column prop="score" label="实验分数" width="180">
              </el-table-column>
              <el-table-column prop="maxScore" label="实验满分">
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <!--正常列-->
      <el-table-column prop="index" label="学生序号" width="180" />
      <el-table-column prop="studentId" label="学号" width="180" />
      <el-table-column prop="studentName" label="姓名" width="180" />
      <el-table-column prop="totalScore" label="总成绩" />
    </el-table>
  </div>
</template>

<script setup lang="ts" name="score">
import { ref, onMounted } from 'vue'
import { Score } from '@/api/interface'
import { coursescore } from "@/api/modules/score"

const courseId = 42041301
const scoreTable = ref<Score.StudentCourseTotalScore[]>([
  {
    index: 1,
    studentId: 2050865,
    studentName: '黄彦铭',
    totalScore: 80,
    scoreList: [
      {
        experimentName: '实验一',
        score: 10
      },
      {
        experimentName: '实验二',
        score: 10
      },
    ]
  }
])

onMounted(() => {
  //向后端请求该课程的成绩列表
  coursescore({ courseId: courseId })
    .then(res => {
      console.log('请求到的后端数据', res)
      scoreTable.value = res.data
    })
    .catch(err => {
      console.log(err)
    })
});
</script>

<style scoped></style>