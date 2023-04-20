import { UserInfo } from "@/stores/interface";
import { PORT1 } from "../config/servicePort";
import { Review } from "../interface";
import http from "@/api";

/**
 * @description 获取课程的所有实验
 * @param params 课程ID
 * @returns 实验列表
 */
export const getCourseExperiments = (params: Review.ReqExperiments) => {
  return http.get<Review.Experiment[]>(PORT1 + `/review/experimentlist`, params, { headers: { noLoading: true } });
}

export const getStudnetSubmit = (params: Review.ReqStudentSubmit) => {
  return http.get<Review.StudentSubmit[]>(PORT1 + `/review/reportlist`, params, {});
}

/**
 * @description 评阅实验报告
 * @param params 评阅分数级评阅人
 */
export const giveReportScore = (params: Review.ReqGiveScore) => {
  return http.post<boolean>(PORT1 + `/review/score`, params, { headers: { noLoading: true } });
}

/**
 * 获取课程详情
 */

export const getCourseInfo = (params: Review.ReqCourseInfo) => {
  return http.get<Review.CourseInfo>(PORT1 + `/review/course-info`, params, { headers: { noLoading: true } });
}

/**
 * 获取课程人员
 */
export const getStudentList = (params: Review.ReqCourseInfo) => {
  return http.get<UserInfo[]>(PORT1 + `/review/student`, params, { headers: { noLoading: true } });
}

/**
 * 获取
 */
export const getSchoolNameList = (params: Review.ReqSchool) => {
  return http.get<string[]>(PORT1 + `/review/school-name`, params, { headers: { noLoading: true } })
}