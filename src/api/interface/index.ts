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

// * 批阅实验报告模块
export namespace Review {
	export interface Experiment {
		experimentId: number,
		experimentName: string,
		startTime: string,
		endTime: string
		score: number
	}
	export interface ReqExperiments {
		courseId: string
	}
	export interface ReqStudentSubmit {
		courseId: string,
		experimentId: string
	}
	export interface StudentSubmit {
		reportId?: number,
		stuId: number,
		schoolNumber: string,
		stuName: string,
		submitTime?: string
		reviewTime?: string
		reportUrl?: string
		score?: number
	}
	export interface ReqGiveScore {
		reportId: number,
		score: number
	}
	export interface ReqCourseInfo {
		courseId: number
	}
	export interface CourseInfo {
		courseId: number,
		courseName: string,
		semester: string,
		year: string
	}
	export interface ReqSchool {
		key: string
	}
}

//课程管理模块
export namespace CourseManagement{
	export interface CourseInfo {
		courseId: number,
		courseName: string,
		semester: string,
		year: number
	}
	export interface CourseDetailInfo{
		// courseId: number,
		courseName: string,
		semester: string,
		year: number,
		studentList: ImportedStudent[],
		teacherList: number[]
	}
	export interface StudentBasicInfo{
		stuId: number,
		schoolNumber: number,
		stuName: string,
		school: string
	}
	export interface ImportedStudent{
		学号: number | string,
		学校: string,
		姓名: string,
		性别: string,
		邮箱: string
	}
	export interface CourseStudents{
		stuId: string,
		school: string,
		name: string,
		gender: string,
		email: string
	}


}
//公告模块
export namespace Announcement{
	export interface SingleAnnouncement{
		courseId:number | string,
		noticeTitle: string,
		noticeId: number  | string,
		publishTime:string,
		content:string
	}
}

//成绩模块
export namespace Score{
	export interface SingleExperimentScore{
		experimentName: string,
		score: number
	}
	export interface StudentCourseTotalScore{
		index: number,
		studentId: number,
		studentName: string,
		totalScore: number,
		scoreList: SingleExperimentScore[]
	}
}
