<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="21">
        <el-form>
          <el-form-item label="课程名称 : " prop="name">
            <el-input v-model="input" placeholder="请输入课程名称" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="clickSearch">搜索</el-button>
        <!-- <el-button type="primary" @click="clickReset">重置</el-button> -->
      </el-col>
    </el-row>
  </el-card>

  <el-card>
    <el-button type="primary" @click="addCourse">新增课程</el-button>
    <el-table :data="showList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="courseId" label="课程序号" width="180" />
      <el-table-column prop="courseName" label="课程名称" width="180" />
      <el-table-column prop="year" label="开课学年" width="180" />
      <el-table-column prop="semester" label="开课学期" width="180" />
    </el-table>
    <!-- <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="showList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </el-card>

  <!-- <el-dialog v-model="dialogTableVisible" :title="dialogTitle">
    <el-upload
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </el-dialog> -->
</template>

<script setup lang="ts" name="course">
import { ref, onMounted } from 'vue'
import { CourseManagement } from '@/api/interface'
import { getCoursesByTeacher } from "@/api/modules/course"
const input = ref('')
const courseList = ref<CourseManagement.CourseInfo[]>([])
const showList = ref<CourseManagement.CourseInfo[]>([])
// const showList = [
//   {
//     'courseId': 42041301,
//     'courseName': '软件工程管理与经济',
//     'semester': '春季',
//     'year': 2023
//   }
// ]

onMounted(() => {
  // getAllExperiments().then(res => {
  //   console.log("所有的实验记录", res)
  //   experimentList.value = res.data
  //   showList.value = experimentList.value
  // })
  getCoursesByTeacher({'index':199})
  .then(res=>{
    showList.value = res.data
  })
  .catch(err=>{
    console.log(err)
  })
});

//新增课程
const addCourse = () => {
  console.log("新增课程")
}

// 搜索
const clickSearch = () => {
  console.log("输入的搜索内容是", input.value)
  //showList.value = experimentList.value.filter(item => item.experimentName.includes(input.value));
}
// const clickReset = () => {
//   console.log("重置")
//   //showList.value = experimentList.value;
//   input.value = ''
// }
</script>

<style scoped></style>