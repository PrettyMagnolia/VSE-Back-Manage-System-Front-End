import { Score } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 成绩模块
 */

//获取一个课程的全部成绩
export const coursescore = (params : object) => {
	return http.get<Score.StudentCourseTotalScore>(PORT1 + `/coursescore`, params, { headers: { noLoading: true } });
};