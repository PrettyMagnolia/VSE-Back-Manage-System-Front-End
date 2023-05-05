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

// 获取课程中的不包含的实验
export const getOneCourseExceptionExperiments = (courseId: number) => {
	return http.get<Experiment.ExperimentList[]>(PORT1 + `/experimentnotincourse`, {courseId}, { headers: { noLoading: true } })
}

// 修改课程中的实验
export const addExperimentInCourse = (courseId: string, experimentIdList: string[]) => {
	return http.post<string>(PORT1 + `/add_experimentincourse`, {courseId, experimentIdList}, { headers: { noLoading: true } })
}

// 修改课程中的实验
export const modifyExperimentInCourse = (courseId: string, experimentId: string, startTime: string, endTime: string, score: string) => {
	return http.put<string>(PORT1 + `/modify_experimentincourse`, {courseId, experimentId, startTime, endTime, score}, { headers: { noLoading: true } })
}

// 删除课程中的实验
export const deleteExperimentInCourse = (courseId: number, experimentId: number) => {
	return http.delete<string>(PORT1 + `/delete_experimentincourse`, {courseId, experimentId}, { headers: { noLoading: true } })
}

// 上传实验指导书	
export const uploadExperimentInstructor = (file: File, courseId: number, experimentId: number) => {
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('courseId', JSON.stringify(courseId));
	formData.append('experimentId', JSON.stringify(experimentId));
	return http.post<string>(PORT1 + `/upload_experiment_instructor`, formData, { headers: { noLoading: true, 'Content-Type': 'multipart/form-data' } })
}

// 上传实验报告模板
export const uploadExperimentTemplate = (file: File, courseId: number, experimentId: number) => {
	const formData = new FormData();
	formData.append('file', file.raw);
	formData.append('courseId', JSON.stringify(courseId));
	formData.append('experimentId', JSON.stringify(experimentId));
	return http.post<string>(PORT1 + `/upload_experiment_template`, formData, { headers: { noLoading: true, 'Content-Type': 'multipart/form-data' } })
}