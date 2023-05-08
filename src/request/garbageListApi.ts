import { UpdateGarbageObject } from "@/type/garbageList";
import http from ".";

/**
 * 查询垃圾信息
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-garbage/garbage/list/${pageNum}/${pageSize}`)
}

/**
 * 查询垃圾总数量
 * @param garbageName 垃圾名称
 * @param categoryName 分类名称
 * @returns Promise<AxiosResponse>
 */
export function getGarbageCount(garbageName: string, categoryName: string) {
    if (garbageName !== "") {
        if (categoryName != "") {
            return http.get(`/gcs-garbage/garbage/count?garbageName=${garbageName}&categoryName=${categoryName}`)
        }
        return http.get(`/gcs-garbage/garbage/count?garbageName=${garbageName}`)
    }

    if (categoryName != "") {
        return http.get(`/gcs-garbage/garbage/count?categoryName=${categoryName}`)
    }
    return http.get(`/gcs-garbage/garbage/count`)
}

/**
 * 通过id删除垃圾
 * @param id 垃圾编号
 * @returns Promise<AxiosResponse>
 */
export function deleteGarbage(id: number) {
    return http.delete(`/gcs-garbage/garbage/${id}`);
}

/**
 * 批量删除垃圾
 * @param ids 垃圾编号集合
 * @returns Promise<AxiosResponse>
 */
export function deleteGarbageList(ids: number[]) {
    return http.delete(`/gcs-garbage/garbage/list`, { data: JSON.stringify(ids) })
}

/**
 * 修改垃圾信息
 * @param garbage 垃圾对象 
 * @returns Promise<AxiosResponse>
 */
export function updateGarbageInfo(garbage: UpdateGarbageObject) {
    return http.put(`/gcs-garbage/garbage/${garbage.id}`, JSON.stringify(garbage))
}

/**
 * 通过垃圾名称、分类名称查询垃圾信息
 * @param name 垃圾名称
 * @param category 分类名称
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getGarbageListByNameOrCategory(name: string, category: string, pageNum: number, pageSize: number) {
    if (name !== "") {
        if (category != "") {
            return http.get(`/gcs-garbage/garbage/list/name/category/${pageNum}/${pageSize}?garbageName=${name}&categoryName=${category}`)
        }
        return http.get(`/gcs-garbage/garbage/list/name/category/${pageNum}/${pageSize}?garbageName=${name}`)
    }

    if (category != "") {
        return http.get(`/gcs-garbage/garbage/list/name/category/${pageNum}/${pageSize}?categoryName=${category}`)
    }
    return http.get(`/gcs-garbage/garbage/list/name/category/${pageNum}/${pageSize}`)
}

/**
 * 通过垃圾名称模糊查询所有垃圾信息
 * @param name 垃圾名称
 * @returns Promise<AxiosResponse>
 */
export function geAllGarbageListByName(name: string) {
    return http.get(`/gcs-garbage/garbage/list/name?garbageName=${name}`)
}

/**
 * 导出excel
 * @param isTemplate 是否为excel模版
 * @returns 
 */
export function download(isTemplate: boolean) {
    return http.get(`/gcs-garbage/excel/garbage/download?isTemplate=${isTemplate}`, {
        responseType: 'blob'
    });
}