import http from ".";

/**
 * 通过关键词查询垃圾总数量
 * @param keyword 关键词
 * @returns Promise<AxiosResponse>
 */
export function getGarbageCountByKeyword(keyword: string) {
    return http.get(`/gcs-garbage/garbage/count/keyword?keyword=${keyword}`)
}

/**
 * 测试通过关键词查询所有垃圾信息
 * @param keyword 关键词
 * @returns Promise<AxiosResponse>
 */
export function getAllGarbageByKeyword(keyword: string) {
    return http.get(`/gcs-garbage/garbage/keyword?keyword=${keyword}`)
}