import { CourseManagement } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 课程学生管理模块
 */

// * 获取一个课程的所有学生
export const getstudentsByCourseId = (params: object | undefined) => {
	return http.get<CourseManagement.CourseStudents[]>(PORT1 + `/coursestudent`, params, { headers: { noLoading: true } });
};

//新增学生
export const addStudent = (params:object) => {
	return http.post<String>(PORT1 + `/coursestudentadd`, params, { headers: { noLoading: true } });
};

//获得可选学生列表
export const getFreeStudent = (params: object | undefined) => {
	return http.get<CourseManagement.CourseStudents[]>(PORT1 + `/coursefreestudent`, params ,{ headers: { noLoading: true } });
};

//删除学生
export const deleteStudent = (params: object) => {
	return http.delete<CourseManagement.CourseStudents>(PORT1 + `/coursestudentdelete`, params ,{ headers: { noLoading: true } });
};
