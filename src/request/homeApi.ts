import http from "."

/**
 * 获取所有分类信息
 * @returns Promise<AxiosResponse>
 */
export function getGarbageCategoryList() {
    return http.get(`/gcs-garbage/garbage-category/all`)
}

/**
 * 通过分类分页查询垃圾信息
 * @param keyword 分类名称
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageByKeyword(keyword: string, pageNum: number, pageSize: number) {
    return http.get(`/gcs-garbage/garbage/keyword/${pageNum}/${pageSize}?keyword=${keyword}`)
}