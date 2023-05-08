import http from ".";

/**
 * 分页查询垃圾投递信息
 * @param userId 用户id
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryList(userId: number, pageNum: number, pageSize: number) {
    return http.get(`/gcs-user/garbage-delivery/list/${pageNum}/${pageSize}?userId=${userId}`);
}

/**
 * 查询垃圾投递信息总数量
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getAllGarbageDeliveryCountByUserId(userId: number) {
   return http.get(`/gcs-user/garbage-delivery/count?userId=${userId}`); 
}

/**
 * 通过投递状态分页查询垃圾投递信息
 * @param userId 用户id
 * @param status 投递状态
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryListByUserIdAndStatus(userId: number, status: number, pageNum: number, pageSize: number) {
    return http.get(`/gcs-user/garbage-delivery/list/${status}/${pageNum}/${pageSize}?userId=${userId}`);
}

/**
 * 通过投递状态查询记录总数量
 * @param userId 用户id
 * @param status 投递状态
 * @returns Promise<AxiosResponse>
 */
export function getAllGarbageDeliveryCountByUserIdAndStatus(userId: number, status: number) {
    return http.get(`/gcs-user/garbage-delivery/count/${status}?userId=${userId}`); 
}

/**
 * 通过垃圾投递id查询垃圾投递详情信息
 * @param deliveryId 投递记录id
 * @returns Promise<AxiosResponse>
 */
export function getGarbageDeliveryDetailsVOByDeliveryId(deliveryId: number) {
    return http.get(`/gcs-user/garbage-delivery-details/list/${deliveryId}`);
}