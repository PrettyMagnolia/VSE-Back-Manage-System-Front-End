import { Announcement } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 公告管理模块
 */

// * 获取一个课程的所有公告
export const getAnnouncementsByCourseId = (params : object) => {
	return http.get<Announcement.SingleAnnouncement[]>(PORT1 + `/coursenotice`, params, { headers: { noLoading: true } });
};

//新增/修改公告
export const addAnnouncement = (params: object | undefined) => {
	return http.post<Announcement.SingleAnnouncement>(PORT1 + `/coursenoticeadd`, params, { headers: { noLoading: true } });
};

export const deleteAnnouncementsById = (params : object) => {
	return http.delete<string>(PORT1 + `/coursenotice`, params, { headers: { noLoading: true } });
};
