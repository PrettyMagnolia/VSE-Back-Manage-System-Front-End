import { CourseManagement } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 课程管理模块
 */

// * 获取一名教师的所有课程
export const getCoursesByTeacher = (params : object) => {
	return http.get<CourseManagement.CourseInfo[]>(PORT1 + `/courses`, params, { headers: { noLoading: true } });
};

//新增一门课程
export const addCourse = (params : CourseManagement.CourseDetailInfo) => {
	return http.post<CourseManagement.CourseDetailInfo>(PORT1 + `/addcourse`, params, { headers: { noLoading: true } });
};