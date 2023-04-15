<template>
  <div class="card self-content-box">
    <div class="left-main-content">
      <el-row :gutter="20" align="middle">
        <el-col :span="10">
          <el-descriptions title="个人信息" :column="1" border size="large" class="description">
            <el-descriptions-item width="400" label="用户名">
              {{ userInfo.name }}
            </el-descriptions-item>

            <el-descriptions-item width="400" label="性别  ">
              {{ userInfo.gender }}
            </el-descriptions-item>

            <el-descriptions-item width="400" label="年龄">
              {{ userInfo.age }}
            </el-descriptions-item>

            <el-descriptions-item width="400" label="邮箱  ">
              {{ userInfo.email }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col align="middle" :span="10">
          <UploadImg v-if="isChanging" v-model:imageUrl="avatar2" @update:imageUrl="updateAvatar" :drag="false"
            borderRadius="50%">
            <template #empty>
              <el-icon>
                <Avatar />
              </el-icon>
              <span>请上传头像</span>
            </template>
            <template #tip> 圆形组件（禁止拖拽上传） </template>
          </UploadImg>
          <span v-else>
            <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
            <p>{{ userInfo.name }}</p>
          </span>
          <el-button @click="changeAvater">修改头像</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="userinfo">
import { GlobalStore } from '@/stores';
import UploadImg from "@/components/Upload/Img.vue";
import { ref } from 'vue';

const globalStore = GlobalStore();
const userInfo = globalStore.userInfo;
const avatar2 = ref('')
const isChanging = ref(false)
const changeAvater = () => {
  isChanging.value = true
}

const updateAvatar = (url: string) => {
  globalStore.userInfo.avatar = url;
}
</script>

<style scoped>
.self-content-box {
  height: 100%;
  width: 100%;
}

.left-main-content {
  width: 100%;
  margin-left: 30px;
}

.description {
  width: 400px;
}
</style>