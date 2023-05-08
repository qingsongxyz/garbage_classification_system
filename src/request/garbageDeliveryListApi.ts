import { GarbageDeliveryForm } from "@/type/personalGarbageDeliveryList";
import http from "."

/**
 * 分页查询垃圾投递信息
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-admin/garbage-delivery/list/${pageNum}/${pageSize}`);
}

/**
 * 查询垃圾投递信息总数量
 * @returns Promise<AxiosResponse>
 */
export function getAllGarbageDeliveryCount() {
    return http.get(`/gcs-admin/garbage-delivery/count`);
}

/**
 * 通过投递状态和用户名分页模糊查询垃圾投递信息
 * @param username 用户名
 * @param status 投递状态
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryListByUsernameOrStatus(username: string, status: number, pageNum: number, pageSize: number) {
    if (username !== "") {
        if (status >= 0 && status <= 2) {
            return http.get(`/gcs-admin/garbage-delivery/list/username/status/${pageNum}/${pageSize}?username=${username}&status=${status}`);
        }
        return http.get(`/gcs-admin/garbage-delivery/list/username/status/${pageNum}/${pageSize}?username=${username}`);
    }
    if (status >= 0 && status <= 2) {
        return http.get(`/gcs-admin/garbage-delivery/list/username/status/${pageNum}/${pageSize}?status=${status}`);
    }
    return http.get(`/gcs-admin/garbage-delivery/list/${pageNum}/${pageSize}`);
}

/**
 * 通过投递状态和用户名模糊查询记录总数量
 * @param username 用户名
 * @param status 投递状态
 * @returns Promise<AxiosResponse>
 */
export function getAllGarbageDeliveryCountByUsernameOrStatus(username: string, status: number) {
    if (username !== "") {
        if (status >= 0 && status <= 2) {
            return http.get(`/gcs-admin/garbage-delivery/count/username/status?username=${username}&status=${status}`);
        }
        return http.get(`/gcs-admin/garbage-delivery/count/username/status?username=${username}`);
    }
    if (status >= 0 && status <= 2) {
        return http.get(`/gcs-admin/garbage-delivery/count/username/status?status=${status}`);
    }
    return http.get(`/gcs-admin/garbage-delivery/count`);
}

/**
 * 修改投递记录
 * @param garbageDeliveryList 
 * @returns Promise<AxiosResponse>
 */
export function updateGarbageDelivery(garbageDeliveryList: Array<GarbageDeliveryForm>) {
    return http.put(`/gcs-admin/garbage-delivery/list`, JSON.stringify(garbageDeliveryList));
}

/**
 * 通过垃圾投递id查询垃圾投递详情信息
 * @param deliveryId 投递记录id
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryDetailsVOByDeliveryId(deliveryId: number) {
    return http.get(`/gcs-admin/garbage-delivery-details/list/${deliveryId}`);
}