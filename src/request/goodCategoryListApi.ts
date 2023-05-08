import GoodCategory from "@/type/goodCategoryList";
import http from ".";

/**
 * 删除商品种类
 * @param id 商品种类id
 * @returns Promise<AxiosResponse>
 */
export function deleteGoodCategory(id: number) {
    return http.delete(`/gcs-mall/good-category/${id}`);
}

/**
 * 批量删除商品种类
 * @param ids 商品种类id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteGoodCategoryList(ids: number[]) {
    return http.delete(`/gcs-mall/good-category/list`, {
        data: JSON.stringify(ids)
    })
}

/**
 * 查询商品种类集合
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGoodCategoryList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-mall/good-category/list/${pageNum}/${pageSize}`);
}

/**
 * 通过种类名称模糊查询商品种类集合
 * @param category 种类名称
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGoodCategoryListByCategory(category: string, pageNum: number, pageSize: number) {
    return http.get(`/gcs-mall/good-category/list/category/${pageNum}/${pageSize}?category=${category}`);
}

/**
 * 查询所有商品种类集合
 * @returns Promise<AxiosResponse>
 */
export function getAllGoodCategoryList() {
    return http.get(`/gcs-mall/good-category/list`);
}

/**
 * 通过种类名称模糊查询所有商品种类集合
 * @param category 种类名称
 * @returns Promise<AxiosResponse>
 */
export function getAllGoodCategoryListByCategory(category: string) {
    return http.get(`/gcs-mall/good-category/list/category?category=${category}`);
}

/**
 * 查询商品种类总数
 * @returns 商品种类总数
 */
export function getAllGoodCategoryCount() {
    return http.get(`/gcs-mall/good-category/count`)
}

/**
 * 通过种类名称模糊查询商品种类数量
 * @param category 种类名称
 * @returns Promise<AxiosResponse>
 */
export function getGoodCategoryCountByCategory(category: string) {
    return http.get(`/gcs-mall/good-category/count/category?category=${category}`)
}

/**
 * 修改商品种类
 * @param goodCategory 商品种类对象
 * @returns Promise<AxiosResponse>
 */
export function updateGoodCategoryFunction(goodCategory: GoodCategory) {
    return http.put(`/gcs-mall/good-category/${goodCategory.id}`, JSON.stringify(goodCategory));
}