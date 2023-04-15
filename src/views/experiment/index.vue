<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="22">
        <el-form>
          <el-form-item label="实验名称 : " prop="name">
            <el-input v-model="input" placeholder="请输入实验名称" clearable />  
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button type="primary">搜索</el-button>
      </el-col>
    </el-row>
  </el-card>
    
  <el-card v-if="experimentList.length > 0">
    <el-table :data="experimentList" stripe style="width: 100%; min-height: 350px">
      <el-table-column prop="experimentId" label="实验序号" width="180" />
      <el-table-column prop="experimentName" label="实验名称" width="450" />
      <el-table-column label="实验指导书">
        <el-table-column prop="状态" label="状态">
          <template #default>
            <el-tag>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="clickViewInstructor(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="clickModifyInstructor(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="实验报告模板">
        <el-table-column prop="状态" label="状态">
          <template #default>
            <el-tag>已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="clickViewTemplate(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="clickModifyTemplate(scope.$index, scope.row)">修改</el-button>
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
      :total="experimentList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  
</template>
  
<script setup lang="ts" name="class">
import { ref } from 'vue'
import { getAllExperiments } from "@/api/modules/experiment"
import { Experiment } from '@/api/interface'

const input = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const experimentList = ref<Experiment.ExperimentList[]>([])

getAllExperiments().then(res => {
  console.log("所有的实验记录", res)
  experimentList.value = res.data;
})

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
const clickViewInstructor = (index: number, row: Experiment.ExperimentList) => {
  console.log("查看实验指导书", index, row)
}
const clickModifyInstructor = (index: number, row: Experiment.ExperimentList) => {
  console.log("修改实验指导书", index, row)
}
const clickViewTemplate = (index: number, row: Experiment.ExperimentList) => {
  console.log("查看实验报告模板", index, row)
}
const clickModifyTemplate = (index: number, row: Experiment.ExperimentList) => {
  console.log("修改实验报告模板", index, row)
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