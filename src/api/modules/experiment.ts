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
