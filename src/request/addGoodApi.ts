import { GoodForm } from "@/type/addGood";
import http from ".";

/**
 * 添加商品
 * @param good 商品对象
 * @returns Promise<AxiosResponse>
 */
export function addGood(good: GoodForm) {
    return http.post(`/gcs-mall/good/a`, JSON.stringify(good));
}