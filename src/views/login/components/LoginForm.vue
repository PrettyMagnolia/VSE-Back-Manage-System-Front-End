<template>
  <el-form v-if="isActived" ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名：huangjie@tongji.edu.cn">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="school">
      <el-select
        v-model="loginForm.school" filterable remote :remote-method="remoteMethod" :loading="loading2"
        placeholder="学校：同济大学" style="width: 100%;">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
        <el-option v-for="item in options" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password" v-model="loginForm.password" placeholder="密码：123456" show-password
        autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <el-form v-else ref="activeAccountFormRef" :model="activeAccountForm" :rules="activeAccountRules" size="large">
    <el-form-item prop="verifyCode">
      <el-input v-model="activeAccountForm.verifyCode" placeholder="请输入六位验证码">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input type="password" v-model="activeAccountForm.pass" placeholder="请输入新密码" show-password>
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="activeAccountForm.checkPass" placeholder="请再次输入密码" show-password>
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div v-if="isActived" class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(loginFormRef);" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
      登录
    </el-button>
  </div>
  <div v-else class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(activeAccountFormRef);" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="activeAccount" size="large" type="primary" :loading="loading">
      激活并修改
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
import { ElMessage, ElNotification } from "element-plus";
import { activateApi, getUserInfoApi, loginApi } from "@/api/modules/login";
import { GlobalStore } from "@/stores";
import { TabsStore } from "@/stores/modules/tabs";
import { KeepAliveStore } from "@/stores/modules/keepAlive";
import { getTimeState } from "@/utils/util";
import { HOME_URL } from "@/config/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { getSchoolNameList } from "@/api/modules/review";
import { validatePassword } from "@/utils/util";

const router = useRouter();
const tabsStore = TabsStore();
const keepAlive = KeepAliveStore();
const globalStore = GlobalStore();

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	school: [{ required: true, message: "请输入学校", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const isActived = ref<boolean>(true);
const activeAccountFormRef = ref<FormInstance>();
const activeAccountForm = reactive({verifyCode:"",pass:"",checkPass:""});
const checkCode = (rule: any, value: any, callback: any) => {
	if (!value) {
		return callback(new Error('Please input the verify code'))
	}
	const valueInteger = Number(value)
	if (!Number.isInteger(valueInteger)) {
		callback(new Error('Please input digits'))
	} else {
		if (String(value).length != 6) {
			callback(new Error('The verification code length must be equal to 6'))
		} else {
			callback()
		}
	}
}

const validatePass = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('Please input the password'))
	} else if (validatePassword(value) == false) {
		callback(new Error("At least one lowercase letter (a-z), one uppercase letter(A-Z), one digit (0-9). Minimum length of 6 characters."))
	} else {
		if (activeAccountForm.checkPass !== '') {
			if (!activeAccountFormRef.value) return
			activeAccountFormRef.value.validateField('checkPass', () => null)
		}
		callback()
	}
}

const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('Please input the password again'))
	} else if (validatePassword(value) == false) {
		callback(new Error("At least one lowercase letter (a-z), one uppercase letter(A-Z), one digit (0-9). Minimum length of 6 characters."))
	} else if (value !== activeAccountForm.pass) {
		callback(new Error("Two inputs don't match!"))
	} else {
		callback()
	}
}
const activeAccountRules = reactive({
	pass: [{ validator: validatePass, trigger: 'blur' }],
	checkPass: [{ validator: validatePass2, trigger: 'blur' }],
	verifyCode: [{ validator: checkCode, trigger: 'blur' }],
})

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({ username: "", school: "", password: "" });
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid: any) => {
		if (!valid) return;
		loading.value = true;
		try {
			// 1.执行登录接口
			const { success, data } = await loginApi({ ...loginForm });
			console.log(success, data);

			// 1.1 账户未激活
			if (success == false) {
				ElMessage({ message: "初次登录，须修改密码，验证码已发送至邮箱", type: "warning" })
				isActived.value = false;
				return;
			}
			globalStore.setToken(data.token);
			console.log(data);

			// 1.1.获取用户个人信息
			const { data: userDetail } = await getUserInfoApi();
			globalStore.setUserInfo(userDetail.account);

			// 2.添加动态路由
			await initDynamicRouter();

			// 3.清空 tabs、keepAlive 保留的数据
			tabsStore.closeMultipleTab();
			keepAlive.setKeepAliveName();

			// 4.跳转到首页
			router.push(HOME_URL);
			ElNotification({
				title: getTimeState(),
				message: "欢迎登录 虚拟实验教学平台",
				type: "success",
				duration: 3000
			});
		} finally {
			loading.value = false;
		}
	});
};

// 激活账户
const activeAccount = async () => {
	const { verifyCode, pass } = activeAccountForm;
	if (verifyCode.length == 0 || pass.length == 0) {
		return;
	}
	activeAccountFormRef.value?.validate(async (valid: any) => {
		if (!valid) return;
		loading.value = true
		try {
			const { code, data } = await activateApi({
				code: verifyCode,
				password: pass,
				username: loginForm.username
			})
			// 账户激活成功
			if (code == 0 && data != null) {
				ElMessage({ message: "账户激活成功,请重新登录", type: "success" })
				isActived.value = true;
			}
		} finally {
			loading.value = false;
		}
	})
}

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			login(loginFormRef.value);
		}
	};
});

//
const options = ref<string[]>([])
const loading2 = ref<boolean>(false)
const remoteMethod = async (query: string) => {
	if (query) {
		loading2.value = true;
		const { data } = await getSchoolNameList({ key: query });
		options.value = data;
		loading2.value = false;
	} else {
		options.value = []
	}
}
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
