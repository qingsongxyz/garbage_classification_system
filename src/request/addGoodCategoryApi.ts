import http from "."
import GoodCategoryForm from "@/type/addGoodCategory"

/**
 * 添加商品种类
 * @param goodCategory 商品种类名称
 * @returns Promise<AxiosResponse>
 */
export function addGoodCategory(goodCategory: GoodCategoryForm) {
    return http.post(`/gcs-mall/good-category/a`, JSON.stringify(goodCategory));
}