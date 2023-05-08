import { BroadcastForm } from "@/type/broadcast";
import http from ".";

/**
 * 发布消息
 * @param broadcastForm 消息对象
 * @returns Promise<AxiosResponse>
 */
export function addBroadcast(broadcastForm: BroadcastForm) {
    return http.post(`/gcs-admin/broadcast/a`, JSON.stringify(broadcastForm));
}