import { UpdateBroadcastForm } from "@/type/broadcastList";
import http from ".";

/**
 * 删除消息
 * @param id 消息id
 * @returns Promise<AxiosResponse>
 */
export function deleteBroadcast(id: number) {
    return http.delete(`/gcs-admin/broadcast/${id}`);
}

/**
 * 批量删除消息
 * @param ids 消息id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteBroadcastList(ids: Array<number>) {
    return http.delete(`/gcs-admin/broadcast/list`, {
        data: JSON.stringify(ids)
    });
}

/**
 * 分页查询消息集合
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getBroadcastList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-admin/broadcast/list/${pageNum}/${pageSize}`);
}

/**
 * 通过消息标题分页查询信息集合
 * @param title 消息标题
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getBroadcastListByTitle(title: string, pageNum: number, pageSize: number) {
    return http.get(`/gcs-admin/broadcast/list/title/${pageNum}/${pageSize}?title=${title}`);
}

/**
 * 通过消息标题查询所有消息集合
 * @param title 消息标题
 * @returns Promise<AxiosResponse>
 */
export function getAllBroadcastListByTitle(title: string) {
    return http.get(`/gcs-admin/broadcast/all/title?title=${title}`)
}

/**
 * 查询消息数量
 * @param title 消息标题
 * @returns Promise<AxiosResponse>
 */
export function getBroadcastListCount(title: string) {
    if (title === "") {
        return http.get(`/gcs-admin/broadcast/count`);
    }
    return http.get(`/gcs-admin/broadcast/count?title=${title}`);
}

/**
 * 修改消息信息
 * @param broadcast 消息对象
 * @returns Promise<AxiosResponse>
 */
export function updateBroadcastFunc(broadcast: UpdateBroadcastForm) {
    return http.put(`/gcs-admin/broadcast/${broadcast.id}`, JSON.stringify(broadcast));
}