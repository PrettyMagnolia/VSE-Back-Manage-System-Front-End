<template>
  <!-- <div class="card content-box">
    <span class="text"> 课程人员管理 🍓🍇🍈🍉</span>
    <p>学生名单，增删学生等</p>
  </div> -->
  <!--显示学生列表-->
  <div>
    <el-button type="primary" @click="checkStudent()">添加学生</el-button>
    <el-table
      :data="showList.slice((studentPageParams.currentPage - 1) * studentPageParams.pageSize, studentPageParams.currentPage * studentPageParams.pageSize)"
      stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="school" label="学校" width="100" />
      <el-table-column prop="stuId" label="学号" width="100" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="100" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="danger" @click="removeStudent(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="studentPageParams.currentPage" v-model:page-size="studentPageParams.pageSize"
      :page-sizes="[10, 20, 50, 100]" :small="false" layout="total, sizes, prev, pager, next, jumper"
      :total="showList.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>

  <!--管理学生的弹出框-->
  <el-dialog v-model="dialogAddStudentVisible" title="添加学生" style="width: 900px;">
    <el-table
      :data="freeList.slice((addstudentPageParams.currentPage - 1) * addstudentPageParams.pageSize, addstudentPageParams.currentPage * addstudentPageParams.pageSize)"
      stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="school" label="学校" width="100" />
      <el-table-column prop="stuId" label="学号" width="100" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="100" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="danger" @click="addStudentToCourse(scope.row)">添加至课程</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="addstudentPageParams.currentPage"
      v-model:page-size="addstudentPageParams.pageSize" :page-sizes="[10, 20, 50, 100]" :small="false"
      layout="total, sizes, prev, pager, next, jumper" :total="freeList.length" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </el-dialog>
</template>

<script setup lang="ts" name="student">
import { ref, onMounted } from 'vue'
import { CourseManagement } from '@/api/interface'
import { getstudentsByCourseId, addStudent, getFreeStudent, deleteStudent } from "@/api/modules/student"

const courseId = ref({ courseId: "42041301" })
const dialogAddStudentVisible = ref(false)
// 用于导入的学生列表
// const studentList: object[] = []
const showList = ref<CourseManagement.CourseStudents[]>([])
const freeList = ref<CourseManagement.CourseStudents[]>([])
const addStudentForm = ref({ courseId: courseId.value.courseId, stuId: "", school: "", name: "" })
const deleteStudentForm = ref({ courseId: courseId.value.courseId, stuId: "", school: "", name: "" })

const studentPageParams = ref({
  currentPage: 1,
  pageSize: 20,
})
const addstudentPageParams = ref({
  currentPage: 1,
  pageSize: 20,
})

onMounted(() => {
  //向后端拿到该课程的学生列表
  getstudentsByCourseId(courseId.value)
    .then(res => {
      console.log(res.data)
      showList.value = res.data
      console.log(showList.value)
    })
    .catch(err => {
      console.log(err)
    })
});

//删除学生
const removeStudent = (row: CourseManagement.CourseStudents) => {
  deleteStudentForm.value.courseId = courseId.value.courseId
  deleteStudentForm.value.stuId = row.stuId
  deleteStudentForm.value.school = row.school
  deleteStudentForm.value.name = row.name
  deleteStudent(deleteStudentForm.value)
    .then(res => {
      console.log(res)
      getstudentsByCourseId(courseId.value)
        .then(res => {
          showList.value = res.data
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

//获得目前可以参加此课程的学生
const checkStudent = () => {
  getFreeStudent(courseId.value)
    .then(res => {
      freeList.value = res.data
      dialogAddStudentVisible.value = true
    })
    .catch(err => {
      console.log(err)
    })
}

//在学生预览中手动添加一名学生
const addStudentToCourse = (row: CourseManagement.CourseStudents) => {
  addStudentForm.value.courseId = courseId.value.courseId
  addStudentForm.value.stuId = row.stuId
  addStudentForm.value.school = row.school
  addStudentForm.value.name = row.name
  console.log("addStudentForm:", addStudentForm, addStudentForm.value)
  addStudent(addStudentForm.value)
    .then(res => {
      console.log(res)
      getstudentsByCourseId(courseId.value)
        .then(res => {
          showList.value = res.data
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
  console.log("showList:", showList.value)
  dialogAddStudentVisible.value = false
  //每次添加完学生，清空添加的表单
  addStudentForm.value = { courseId: courseId.value.courseId, stuId: "", school: "", name: "" }
}

//处理分页的回调函数
const handleSizeChange = (size: number) => {
  studentPageParams.value.pageSize = size
  addstudentPageParams.value.pageSize = size
}
const handleCurrentChange = (currentPage: number) => {
  studentPageParams.value.currentPage = currentPage
  addstudentPageParams.value.pageSize = currentPage
}
</script>

<style scoped></style>