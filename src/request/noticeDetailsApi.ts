import http from ".";

/**
 * 通过id查询消息信息
 * @param id 消息id
 * @returns Promise<AxiosResponse>
 */
export function getBroadcastById(id: string) {
    return http.get(`/gcs-admin/broadcast/${id}`);    
}