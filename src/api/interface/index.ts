import { UserInfo } from "@/stores/interface";

// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	msg: string;
	success: boolean
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data: T;
}

// * 分页响应参数
export interface ResPage<T> {
	list: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
}

// * 文件上传模块
export namespace Upload {
	export interface ResFileUrl {
		fileUrl: string;
	}
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		school: string;
		password: string;
	}
	export interface ResLogin {
		token: string;
	}
	export interface ResAuthButtons {
		[key: string]: string[];
	}
}

// * 返回的用户信息
export interface ResUserInfo {
	account: UserInfo
	permissions: string[],
	role: number
}

// * 用户管理模块
export namespace User {
	export interface ReqUserParams extends ReqPage {
		username: string;
		gender: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string[];
		status: number;
	}
	export interface ResUserList {
		id: string;
		username: string;
		gender: number;
		user: {
			detail: {
				age: number;
			};
		};
		idCard: string;
		email: string;
		address: string;
		createTime: string;
		status: number;
		avatar: string;
		photo: any[];
		children?: ResUserList[];
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
	export interface ResGender {
		genderLabel: string;
		genderValue: number;
	}
	export interface ResDepartment {
		id: string;
		name: string;
		children?: ResDepartment[];
	}
	export interface ResRole {
		id: string;
		name: string;
		children?: ResDepartment[];
	}
}


export namespace Experiment {
	export interface ExperimentList {
		experimentId: number;
		experimentName: string;
		instructor: string;
		template: string;
	}
	export interface CourseExperimentList {
		experimentId: number;
		experimentName: string;
		instructor: string;
		template: string;
		score: number;
		startTime: string;
		endTime: string;
	}
}
