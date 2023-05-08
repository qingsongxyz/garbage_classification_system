import http from ".";

/**
 * 分页查询用户订单列表
 * @param userId 用户id 
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getOrderList(userId: number, pageNum: number, pageSize: number) {
    return http.get(`/gcs-user/order/list/${pageNum}/${pageSize}?userId=${userId}`);
}

/**
 * 查询用户订单总数量
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getAllOrderCount(userId: number) {
    return http.get(`/gcs-user/order/count?userId=${userId}`);
}

/**
 * 查询订单的详情信息
 * @param orderId 订单id
 * @returns Promise<AxiosResponse>
 */
export function getOrderDetailsList(orderId: number) {
    return http.get(`/gcs-user/order-details/list/${orderId}`);
}