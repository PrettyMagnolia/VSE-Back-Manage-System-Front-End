import { Experiment } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 实验模块
 */
// * 获取所有实验
export const getAllExperiments = () => {
	return http.get<Experiment.ExperimentList[]>(PORT1 + `/allexperiment`, {}, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
};

// 获取课程中的所有实验
export const getOneCourseAllExperiments = (courseId: number) => {
	return http.get<Experiment.CourseExperimentList[]>(PORT1 + `/experimentincourse`, {courseId}, { headers: { noLoading: true } })
}

// 修改课程中的实验
export const modifyExperimentInCourse = (courseId: string, experimentId: string, startTime: string, endTime: string, score: string) => {
	return http.put<string>(PORT1 + `/modify_experimentincourse`, {courseId, experimentId, startTime, endTime, score}, { headers: { noLoading: true } })
}

// 删除课程中的实验
export const deleteExperimentInCourse = (courseId: number, experimentId: number) => {
	return http.delete<string>(PORT1 + `/delete_experimentincourse`, {courseId, experimentId}, { headers: { noLoading: true } })
}
