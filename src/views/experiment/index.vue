<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="21">
        <el-form>
          <el-form-item label="实验名称 : " prop="name">
            <el-input v-model="input" placeholder="请输入实验名称" clearable />  
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="clickSearch">搜索</el-button>
         <el-button type="primary" @click="clickReset">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
    
  <el-card>
    <el-table :data="showList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="experimentId" label="实验序号" width="180" />
      <el-table-column prop="experimentName" label="实验名称" width="450" />
      <el-table-column label="实验指导书">
        <el-table-column prop="状态" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.instructor !== null">已上传</el-tag>
            <el-tag v-else type="info">未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作">
          <template #default="scope">
            <template v-if="scope.row.instructor !== null">
              <el-button size="small" type="success" @click="clickViewInstructor(scope.$index, scope.row)">查看</el-button>
              <el-button size="small" type="warning" @click="clickModifyInstructor(scope.$index, scope.row)">修改</el-button>
            </template>
            <el-button v-else size="small" type="danger" @click="clickModifyInstructor(scope.$index, scope.row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="实验报告模板">
        <el-table-column prop="状态" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.template !== null">已上传</el-tag>
            <el-tag v-else type="info">未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作">
          <template #default="scope">
            <template v-if="scope.row.template !== null">
              <el-button size="small" type="success" @click="clickViewTemplate(scope.$index, scope.row)">查看</el-button>
              <el-button size="small" type="warning" @click="clickModifyTemplate(scope.$index, scope.row)">修改</el-button>
            </template>
            <el-button v-else size="small" type="danger" @click="clickModifyTemplate(scope.$index, scope.row)">上传</el-button>
          </template>
        </el-table-column>
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
      :total="showList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  
  <el-dialog v-model="dialogTableVisible" :title="dialogTitle">
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
  </el-dialog>
</template>
  
<script setup lang="ts" name="class">
import { ref, onMounted } from 'vue'
import { getAllExperiments } from "@/api/modules/experiment"
import { Experiment } from '@/api/interface'
import { UploadFilled } from '@element-plus/icons-vue'
import router from '@/routers'

const input = ref('')
const dialogTableVisible = ref(false)
const dialogTitle = ref("")
const currentPage = ref(1)
const pageSize = ref(10)

const experimentList = ref<Experiment.ExperimentList[]>([])
const showList = ref<Experiment.ExperimentList[]>([])

onMounted(() => {
  getAllExperiments().then(res => {
    console.log("所有的实验记录", res)
    experimentList.value = res.data
    showList.value = experimentList.value
  })
});

// 分页
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const clickViewInstructor = (index: number, row: Experiment.ExperimentList) => {
  console.log("查看实验指导书", index, row)
  router.push("/showInfo/")
}
const clickModifyInstructor = (index: number, row: Experiment.ExperimentList) => {
  console.log("修改实验指导书", index, row)
  dialogTitle.value = row.experimentName + "  实验指导书"
  dialogTableVisible.value = true;
}
const clickViewTemplate = (index: number, row: Experiment.ExperimentList) => {
  console.log("查看实验报告模板", index, row)
}
const clickModifyTemplate = (index: number, row: Experiment.ExperimentList) => {
  console.log("修改实验报告模板", index, row)
  dialogTitle.value = row.experimentName + "  实验报告模板"
  dialogTableVisible.value = true;
}

// 搜索
const clickSearch = () => {
  console.log("输入的搜索内容是", input.value)
  showList.value = experimentList.value.filter(item => item.experimentName.includes(input.value));
}
const clickReset = () => {
  console.log("重置")
  showList.value = experimentList.value;
  input.value = ''
}

</script>
<style scoped>
.box-card {
  margin-bottom: 20px;
}
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>