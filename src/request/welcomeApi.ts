import http from "."

/**
 * 按星期分组查询用户投递次数
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryCountGroupByWeek(userId: number) {
    return http.get(`/gcs-user/garbage-delivery/count/week?userId=${userId}`);
}

/**
 * 按投递状态分组查询个人投递次数
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getPersonalGarbageDeliveryCountGroupByStatus(userId: number) {
    return http.get(`/gcs-user/garbage-delivery/count/status?userId=${userId}`);
}

/**
 * 按垃圾种类分组查询垃圾数量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageCountGroupByCategory() {
    return http.get(`/gcs-garbage/garbage/total/category`);
}

/**
 * 按投递状态分组查询用户投递次数
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryCountGroupByStatus() {
    return http.get(`/gcs-user/garbage-delivery/total/status`);
}