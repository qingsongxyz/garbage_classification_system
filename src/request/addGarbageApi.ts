import GarbageForm from "@/type/addGarbage";
import http from ".";

/**
 * 添加垃圾
 * @param garbage 垃圾对象
 * @returns Promise<AxiosResponse>
 */
export function addGarbage(garbage: GarbageForm){
    return http.post('/gcs-garbage/garbage/a', JSON.stringify(garbage))
}