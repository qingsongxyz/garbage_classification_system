import { Good } from "@/type/goodList";
import http from ".";

/**
 * 删除商品
 * @param id 商品id
 * @returns Promise<AxiosResponse>
 */
export function deleteGood(id: number) {
    return http.delete(`/gcs-mall/good/${id}`);
}

/**
 * 批量删除商品
 * @param ids 商品id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteGoodList(ids: number[]) {
    return http.delete(`/gcs-mall/good/list`, {
        data: JSON.stringify(ids)
    });
}

/**
 * 查询商品集合
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGoodList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-mall/good/list/${pageNum}/${pageSize}`);
}

/**
 * 测试通过种类名称、商品名称模糊查询商品集合
 * @param name 商品名称
 * @param category 商品种类
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGoodListByNameOrCategory(name: string, category: string, pageNum: number, pageSize: number) {
    if (name !== "" && category !== "") {
        return http.get(`/gcs-mall/good/list/name/category/${pageNum}/${pageSize}?name=${name}&category=${category}`);
    }
    if (name !== "") {
        return http.get(`/gcs-mall/good/list/name/category/${pageNum}/${pageSize}?name=${name}`);
    }
    if (category !== "") {
        return http.get(`/gcs-mall/good/list/name/category/${pageNum}/${pageSize}?category=${category}`);
    }
    return http.get(`/gcs-mall/good/list/${pageNum}/${pageSize}`);
}

/**
 * 通过商品名称模糊查询所有商品集合
 * @param name 商品名称
 * @returns Promise<AxiosResponse>
 */
export function getAllGoodListByName(name: string) {
    return http.get(`/gcs-mall/good/list/name?name=${name}`);
}

/**
 * 查询商品总数量
 * @returns Promise<AxiosResponse>
 */
export function getAllGoodCount() {
    return http.get(`/gcs-mall/good/count`);
}

/**
 * 通过种类名称、商品名称模糊查询商品数量
 * @param name 商品名称
 * @param category 商品种类
 * @returns Promise<AxiosResponse>
 */
export function getCountByNameOrCategory(name: string, category: string) {
    if (name !== "" && category !== "") {
        return http.get(`/gcs-mall/good/count/name/category?name=${name}&category=${category}`);
    }
    if (name !== "") {
        return http.get(`/gcs-mall/good/count/name/category?name=${name}`);
    }
    if (category !== "") {
        return http.get(`/gcs-mall/good/count/name/category?category=${category}`);
    }
    return http.get(`/gcs-mall/good/count`);
}

/**
 * 修改商品
 * @param good 商品对象
 * @returns Promise<AxiosResponse>
 */
export function updateGoodFunction(good: Good) {
    return http.put(`/gcs-mall/good/${good.id}`, JSON.stringify(good));
}

/**
 * 下载excel商品文件
 * @param isTemplate 是否下载模版excel
 * @returns excel商品文件
 */
export function download(isTemplate: boolean) {
    return http.get(`/gcs-mall/excel/good/download?isTemplate=${isTemplate}`, {
        responseType: 'blob'
    });
}