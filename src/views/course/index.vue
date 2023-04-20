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
    <el-form :model="addCourseForm" :rules="courseRules" ref="ruleFormRef" label-width="120px">
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

        <!--教程弹出框-->
        <div class="question">
          <el-popover :width="500" trigger="hover"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
            <template #reference>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </template>
            <template #default>
              • 导入的文件需要为xls/xlsx格式的Excel文件<br>
              • 列的属性包括学校、学号、姓名、性别、邮箱<br>
              • 各列均无顺序要求
              <p style="font-weight:700">示例：</p>
              <img src="@/assets/images/import-instructor.png" class="instructor-image" />
            </template>
          </el-popover>
        </div>
      </el-form-item>

    </el-form>
    <!--显示学生列表-->
    <div>
      <el-button type="primary" @click="() => { dialogAddStudentVisible = true }">添加学生</el-button>
      <el-table
        :data="studentList.slice((studentPageParams.currentPage - 1) * studentPageParams.pageSize, studentPageParams.currentPage * studentPageParams.pageSize)"
        stripe style="width: 100%; min-height: 350px">
        <el-table-column prop="学校" label="学校" width="100" />
        <el-table-column prop="学号" label="学号" width="100" />
        <el-table-column prop="姓名" label="姓名" width="100" />
        <el-table-column prop="性别" label="性别" width="100" />
        <el-table-column prop="邮箱" label="邮箱" width="100" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="danger" @click="removeStudent(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="studentPageParams.currentPage" v-model:page-size="studentPageParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" :small="false" layout="total, sizes, prev, pager, next, jumper"
        :total="studentList.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-button type="primary" @click="onSubmit">确认</el-button>
    <el-button @click="onCancel">取消</el-button>
  </el-dialog>

  <!--管理学生的弹出框-->
  <el-dialog v-model="dialogAddStudentVisible" title="添加学生">
    <el-form :model="addStudentForm" :rules="studentRules">
      <el-form-item prop="school" label="学校">
        <el-input v-model="addStudentForm!['学校']" placeholder="请输入学生学校" />
      </el-form-item>
      <el-form-item prop="id" label="学号">
        <el-input v-model="addStudentForm!['学号']" placeholder="请输入学生学号" />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="addStudentForm!['姓名']" placeholder="请输入学生姓名" />
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <el-select v-model="addStudentForm!['性别']" placeholder="请输入学生性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="addStudentForm!['邮箱']" placeholder="请输入学生邮箱" />
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="addOneStudent">添加</el-button>
      <el-button @click="dialogAddStudentVisible = false">取消</el-button>
    </div>
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
const dialogAddStudentVisible = ref(false)
const showList = ref<CourseManagement.CourseInfo[]>([])
const addCourseForm = ref({ courseName: '', semester: '春季', year: 2023, teacherId: 2001001, studentList: [] })
// 用于导入的学生列表
// const studentList: object[] = []
const studentList = ref<CourseManagement.ImportedStudent>([])
const addStudentForm = ref<CourseManagement.ImportedStudent>({
  学校: '',
  学号: '',
  姓名: '',
  性别: '',
  邮箱: ''
})

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


const ruleFormRef = ref<FormInstance>()
const courseRules = reactive<FormRules>({
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

const studentRules = reactive<FormRules>({
  school: [
    { required: true, message: '请输入学生学校', trigger: 'blur' },
  ],
  id: [
    { required: true, message: '请输入学生学号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' },
  ]
})




const studentPageParams = ref({
  currentPage: 1,
  pageSize: 10,
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



const viewStudents = (e: CourseManagement.CourseInfo) => {
  dialogAddStudentVisible.value = true
  console.log(e)

  let courseId: string = e.courseId.toString()
  //根据该课程的courseId，去后端拿到这个课程的所有学生
  getCourseStudents(courseId)
    .then(res => {
      console.log('该班级的学生列表：', res)
      studentList.value = res.data
    })
    .catch(err => {
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
    const workbook = XLSX.read(ev.target!.result, {
      type: "binary",
    });
    const wsname = workbook.SheetNames[0];
    const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
    // console.log(ws); // 转换成json的数据
    const m = dealExcel(ws) // ...对数据进行自己需要的操作
    studentList.value = m
  };
  fileReader.readAsBinaryString(files);

  //然后将导入名单显示在前端
  console.log("学生名单：", studentList)

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

//对StudentList的合法性做校验
const checkStudentList = () => {
  //检查学生主码完整性
  for (let i = 0; i < studentList.value.length; i++) {
    if (studentList.value[i]['学号'] == null || studentList.value[i]['学号'] == '' ||
      studentList.value[i]['姓名'] == null || studentList.value[i]['姓名'] == '' ||
      studentList.value[i]['学校'] == null || studentList.value[i]['学校'] == '') {
      ElMessage({
        message: '每个学生的学校、学号、姓名信息不能缺失，请检查后重新提交！',
        type: 'warning'
      })
      return false
    }
  }
  return true
}

//确认提交新增
const onSubmit = () => {

  let params: CourseManagement.CourseDetailInfo = {
    // courseId: 0,
    courseName: addCourseForm.value.courseName,
    semester: addCourseForm.value.semester == '春季' ? 'spring' : 'fall',
    year: addCourseForm.value.year,
    teacherList: [index],
    studentList: studentList.value
  }

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

  //校验导入学生名单的合法性
  if (!checkStudentList()) {
    return;
  }

  console.log("要发出去的数据：", params)
  console.log(JSON.stringify(params));

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

//在学生预览中删除学生
const removeStudent = (row: CourseManagement.ImportedStudent) => {
  studentList.value = studentList.value.filter(function (item) {
    return item != row;
  });
}

//在学生预览中手动添加一名学生
const addOneStudent = () => {
  studentList.value.push(addStudentForm.value)
  console.log("addStudentForm:", addStudentForm, addStudentForm.value)
  console.log("studentList:", studentList.value)
  dialogAddStudentVisible.value = false
  //每次添加完学生，清空添加的表单
  addStudentForm.value = {
    学校: '',
    学号: '',
    姓名: '',
    性别: '',
    邮箱: ''
  }
}

//处理分页的回调函数
const handleSizeChange = (size: number) => {
  studentPageParams.value.pageSize = size
}
const handleCurrentChange = (currentPage: number) => {
  studentPageParams.value.currentPage = currentPage
}

</script>

<style scoped>
.demo-pagination-block+.demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.question {
  margin-left: 1rem;
}

.instructor-image {
  width: 28rem;
}
</style>