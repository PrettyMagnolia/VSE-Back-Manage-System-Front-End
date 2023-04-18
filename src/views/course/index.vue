<template>
  <!-- <el-card class="box-card">
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
        <el-button type="primary" @click="clickReset">重置</el-button>
      </el-col>
    </el-row>
  </el-card> -->

  <el-card>
    <el-button type="primary" @click="clickAddCourse">新增课程</el-button>
    <el-table :data="showList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="courseId" label="课程序号" width="220" />
      <el-table-column prop="courseName" label="课程名称" width="220" />
      <el-table-column prop="year" label="开课学年" width="220" />
      <el-table-column prop="semester" label="开课学期" width="220" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="viewStudents(scope.row)">查看学生</el-button>
        </template>
      </el-table-column>
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

  <!--新增课程的弹出框-->
  <el-dialog v-model="dialogTableVisible" title="新增课程">
    <el-form :model="addCourseForm" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="addCourseForm.courseName" />
      </el-form-item>
      <el-form-item label="开课年份" prop="year">
        <el-select v-model="addCourseForm.year" placeholder="Select">
          <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="开课学期" prop="semester">
        <el-select v-model="addCourseForm.semester" placeholder="Select">
          <el-option v-for="item in semesterOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="授课教师工号" prop="teacherId">
        <el-input v-model="addCourseForm.teacherId" disabled />
      </el-form-item>
      <el-form-item label="学生名单" prop="studentList">
        <!--上传学生名单的文件-->
        <el-upload class="upload-demo" action="" drag :auto-upload="false" :on-change="uploadChange" :limit="1">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将xls/xlsx文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <!-- <el-form v-else></el-form> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!--管理学生的弹出框-->
  <el-dialog v-model="dialogStudentsVisible" title="课程学生管理">
    <el-table :data="studentViewList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="stuId" label="学生序号" width="130" />
      <el-table-column prop="schoolNumber" label="学号" width="130" />
      <el-table-column prop="stuName" label="姓名" width="130" />
      <el-table-column prop="school" label="学校" width="130" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="viewStudents(scope.row)">查看学生</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="studentPageParams.currentPage"
      v-model:page-size="studentPageParams.pageSize"
      :page-sizes="[20, 50, 100, 200]"
      :small="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="showList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-dialog>

</template>

<script setup lang="ts" name="course">
/* eslint-disable */
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadInstance } from 'element-plus'
import { CourseManagement } from '@/api/interface'
import { getCoursesByTeacher, addCourse, getCourseStudents } from "@/api/modules/course"
import { ElMessage } from 'element-plus'
// import { defineComponent } from "vue";
import * as XLSX from "xlsx"; // vue3可用此引入

const index = 199
const input = ref('')
const dialogTableVisible = ref(false)
const dialogStudentsVisible = ref(false)
const showList = ref<CourseManagement.CourseInfo[]>([])
const addCourseForm = ref({ courseName: '', semester: '春季', year: 2023, teacherId: 2001001, studentList: [] })
const yearOptions = [
  {
    value: 2023,
    label: 2023,
  },
  {
    value: 2024,
    label: 2024,
  },
  {
    value: 2025,
    label: 2025,
  },
  {
    value: 2026,
    label: 2026,
  },
  {
    value: 2027,
    label: 2027,
  }
]
const semesterOptions = [
  {
    value: '春季',
    label: '春季',
  },
  {
    value: '秋季',
    label: '秋季',
  },
]
const upload = ref<UploadInstance>()
//用于导入的学生列表
const studentList: object[] = []

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
  ],
  semester: [
    { required: true, message: '请输入开课学期', trigger: 'blur' },
  ],
  year: [
    { required: true, message: '请输入开课年份', trigger: 'blur' },
  ],
  teacherId: [
    { required: true, message: '请输入授课教师', trigger: 'blur' },
  ],
  studentList: [
    { required: true, message: '请导入学生名单', trigger: 'blur' },
  ]
})

//用于展示的学生列表
const studentViewList = ref([])

const studentPageParams = ref({
  currentPage: 0,
  pageSize: 20,
})

onMounted(() => {
  let courseList = []
  //向后端拿到该教师的课程列表
  getCoursesByTeacher({ 'index': index })
    .then(res => {
      courseList = res.data
      courseList.forEach(item => {
        if (item.semester == 'spring') {
          item.semester = '春季'
        }
        else if (item.semester == 'fall') {
          item.semester = '秋季'
        }
      })

      showList.value = courseList
    })
    .catch(err => {
      console.log(err)
    })
});

const viewStudents = (e: CourseManagement.CourseInfo)=>{
  dialogStudentsVisible.value = true
  console.log(e)

  let courseId : string = e.courseId.toString()
  //根据该课程的courseId，去后端拿到这个课程的所有学生
  getCourseStudents(courseId)
  .then(res=>{
    console.log('该班级的学生列表：', res)
    studentViewList.value = res.data
  })
  .catch(err=>{
    console.log(err)
  })

}

const uploadChange = async (e) => {
  console.log(e);
  const files = e.raw;
  if (files.length <= 0) {
    return false;
  } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
    console.log("上传格式不正确，请上传xls或者xlsx格式");
    return false;
  }
  // 读取表格
  const fileReader = new FileReader();
  fileReader.onload = (ev) => {
    const workbook = XLSX.read(ev.target.result, {
      type: "binary",
    });
    const wsname = workbook.SheetNames[0];
    const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
    // console.log(ws); // 转换成json的数据
    const m = dealExcel(ws) // ...对数据进行自己需要的操作
    studentList.value = m
  };
  fileReader.readAsBinaryString(files);
};
const dealExcel = (ws) => {
  let keymap = {
    // 我们要转换的开头
    菜名: "dishes",
    介绍: "introduce",
    配料: "ingredients",
    标签: "label",
    提示: "tips",
    水平: "hor",
    方式: "way",
    时间: "time",
    风味: "flavor",
    步骤: "steps"
  }
  ws.forEach((sourceObj) => {
    let arr = new Array()
    Object.keys(sourceObj).map((keys) => {
      if (keys.includes('步骤')) {
        arr.push(sourceObj[keys])
        delete sourceObj[keys]
      } else
        if (keymap[keys]) {
          sourceObj[keymap[keys]] = sourceObj[keys]
          delete sourceObj[keys]
        }
    })
    sourceObj['steps'] = arr
  })
  return ws
}

//点击新增课程按钮
const clickAddCourse = () => {
  dialogTableVisible.value = true
}

// 从 upload 变量中读取学号数组
const getStudentNumbers = () => {
  const students: number[] = []

  // 在 upload.value 中获取 Excel 文件数据
  console.log(upload)
  const excelData = upload.value

  // 假设 Excel 文件中的学号数据存储在名为 "学号" 的列中
  // 这里假设 "学号" 列的数据从第二行开始，即索引为 1
  if (excelData) {
    for (let i = 1; i < excelData.length; i++) {
      const studentNumber = excelData[i]['序号'] // 根据表头名称获取学号数据
      if (studentNumber) {
        students.push(studentNumber)
      }
    }
  }

  return students
}

//确认提交新增
const onSubmit = () => {
  let params: CourseManagement.CourseDetailInfo = {
    // courseId: 0,
    courseName: addCourseForm.value.courseName,
    semester: addCourseForm.value.semester == '春季' ? 'spring' : 'fall',
    year: addCourseForm.value.year,
    teacherList: [index],
    studentList: []
  }

  let list = studentList.value

  list.forEach(item => {
    params.studentList.push(item['序号'])
  })

  /**先确认信息是否填写完整！ */
  if (params['courseName'] == '' ||
    params['semester'] == '' ||
    params['year'] == null ||
    params['teacherList'].length == 0 ||
    params['studentList'].length == 0) {
    ElMessage({
      message: '表单未填写完整！',
      type: 'warning',
    })
    return;
  }

  console.log("要发出去的数据：", params)

  addCourse(params)
    .then(res => {
      console.log(res)
      ElMessage({
        message: '新增课程成功！',
        type: 'success',
      })

      //向后端拿到该教师的课程列表
      getCoursesByTeacher({ 'index': index })
        .then(res => {
          showList.value = []
          showList.value = res.data
        })
        .catch(err => {
          console.log(err)
        })

      dialogTableVisible.value = false
    })
    .catch(err => {
      console.log(err)
      ElMessage.error('课程添加失败，请重试')
      dialogTableVisible.value = false
    })

}

const onCancel = () => {
  dialogTableVisible.value = false
}

</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>