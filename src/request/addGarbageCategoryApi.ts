import GarbageCategoryForm from "@/type/addGarbageCategory";
import http from ".";

/**
 * 添加垃圾分类
 * @param garbageCategory 垃圾分类对象 
 * @returns Promise<AxiosResponse>
 */
export function addGarbageCategory(garbageCategory: GarbageCategoryForm) {
    return http.post('/gcs-garbage/garbage-category/a', JSON.stringify(garbageCategory));
}