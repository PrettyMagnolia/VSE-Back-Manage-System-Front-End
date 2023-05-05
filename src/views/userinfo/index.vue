<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="card self-content-box">
    <div class="left-main-content">
      <el-row :gutter="20" align="middle">
        <el-col :span="10">
          <el-descriptions title="个人信息" :column="1" border size="large">
            <template #extra>
              <el-button :type="!isChangingInfo?'primary':'success'" @click="changeMyInfo">{{ btnText }}</el-button>
            </template>
            <el-descriptions-item label="用户名" class-name="item-content">
              <span v-if="!isChangingInfo">{{ userInfo.name }}</span> 
              <el-input v-model="userInfo.name" v-else size="small" class="input-text" />
            </el-descriptions-item>

            <el-descriptions-item label="性别  " class-name="item-content">
              <span v-if="!isChangingInfo">{{ userInfo.gender }}</span> 
              <el-input v-model="userInfo.gender" v-else size="small" class="input-text" />
            </el-descriptions-item>

            <el-descriptions-item label="年龄" class-name="item-content">
              <span v-if="!isChangingInfo">{{ userInfo.age }}</span> 
              <el-input v-model="userInfo.age" v-else size="small" class="input-text" />
            </el-descriptions-item>

            <el-descriptions-item label="邮箱  " class-name="item-content">
              <!-- {{ userInfo.email }} -->
              <span v-if="!isChangingInfo">{{ userInfo.email }}</span> 
              <el-input v-model="userInfo.email" v-else size="small" class="input-text" />
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col align="middle" :span="10">
          <UploadImg
            v-if="isChanging" v-model:imageUrl="avatar2" @update:imageUrl="updateAvatar" :drag="false"
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
            <el-avatar :size="100" :src="userInfo.avatar" />
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
import { changeUserBaseInfo } from '@/api/modules/review';
import { ElMessage } from 'element-plus';

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

const btnText = ref<string>('修改');
const isChangingInfo = ref<boolean>(false)
const changeMyInfo = async () => {
  if(isChangingInfo.value === true) {
    const res = await changeUserBaseInfo(userInfo);
    if (res.data == true) {
      ElMessage({ message: "修改成功", type: "success" })
    }else{
      ElMessage({ message: "修改失败", type: "error" })
    }
  }
  isChangingInfo.value = !isChangingInfo.value;
  btnText.value = isChangingInfo.value?'保存':'修改';
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

.input-text{
  margin: 0;
  padding: 0;
}

.item-content{
  width: 300px;
  color: grey;
}
</style>