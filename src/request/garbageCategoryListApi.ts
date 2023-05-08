import { GarbageCategory } from "@/type/home";
import http from ".";

/**
 * 分页查询所有分类信息
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageCategoryList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-garbage/garbage-category/list/${pageNum}/${pageSize}`)
}

/**
 * 批量删除垃圾分类
 * @param ids 删除分类的id数组
 * @returns Promise<AxiosResponse>
 */
export function deleteGarbageCategoryList(ids: number[]) {
    return http.delete('/gcs-garbage/garbage-category/list/', { data: JSON.stringify(ids) })
}

/**
 * 通过id删除垃圾分类
 * @param id 垃圾分类id
 * @returns Promise<AxiosResponse>
 */
export function deleteGarbageCategory(id: number) {
    return http.delete(`/gcs-garbage/garbage-category/${id}`)
}

/**
 * 修改垃圾分类信息
 * @param garbageCategory 垃圾分类对象
 * @returns Promise<AxiosResponse>
 */
export function updateGarbageCategory(garbageCategory: GarbageCategory) {
    return http.put(`/gcs-garbage/garbage-category/${garbageCategory.id}`, JSON.stringify(garbageCategory))
}

/**
 * 查询垃圾分类总数量
 * @params name 分类名称
 * @returns Promise<AxiosResponse>
 */
export function getGarbageCategoryCount(name: string) {
    if (name !== "") {
        return http.get(`/gcs-garbage/garbage-category/count?name=${name}`)
    }
    return http.get('/gcs-garbage/garbage-category/count')
}

/**
 * 通过分类名称模糊查询所有垃圾分类信息
 * @param name 分类名称
 * @returns 
 */
export function getAllGarbageCategoryListByName(name: string) {
    return http.get(`/gcs-garbage/garbage-category/list/name?name=${name}`)
}

/**
 * 通过分类名称模糊分页查询垃圾分类信息
 * @param name 分类名称
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns 
 */
export function getGarbageCategoryListByName(name: string, pageNum: number, pageSize: number) {
    return http.get(`/gcs-garbage/garbage-category/list/name/${pageNum}/${pageSize}?name=${name}`)
}

