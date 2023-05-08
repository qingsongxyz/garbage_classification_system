import { MarketDetails, OrderForm } from "@/type/header";
import http from ".";

/**
 * 通过用户id查询详情信息的数量
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getMarketDetailsCountByUserId(userId: number) {
    return http.get(`/gcs-user/market/count/${userId}`);
}

/**
 * 通过用户id查询购物车信息
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getMarketByUserId(userId: number) {
    return http.get(`/gcs-user/market/${userId}`);
}

/**
 * 删除购物车详情
 * @param id 购物车详情id
 * @returns Promise<AxiosResponse>
 */
export function deleteMarketDetails(id: number) {
    return http.delete(`/gcs-user/market-details/${id}`);
}

/**
 * 批量删除购物车详情
 * @param ids 购物车详情id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteMarketDetailsList(ids: number[]) {
    return http.delete(`/gcs-user/market-details/list`, {
        data: JSON.stringify(ids)
    })
}

/**
 * 批量修改购物车详情
 * @param marketDetailsList 购物车详情集合
 * @returns Promise<AxiosResponse>
 */
export function updateMarketDetailsListFunction(marketDetailsList: Array<MarketDetails>) {
    return http.put(`/gcs-user/market-details/list`, JSON.stringify(marketDetailsList));
}


/**
 * 添加订单
 * @param order 订单对象
 * @returns Promise<AxiosResponse>
 */
export function addOrder(order: OrderForm) {
    return http.post(`/gcs-user/order/pay`, JSON.stringify(order));
}