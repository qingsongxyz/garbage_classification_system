import { Message, MessageForm } from "@/type/login";
import http from ".";

/**
 * 查询所有聊天在线用户
 * @returns Promise<AxiosResponse>
 */
export function getOnlineUserList() {
    return http.get(`/gcs-user/chat/userList/online`);
}

/**
 * 查询所有管理员用户
 * @returns Promise<AxiosResponse>
 */
export function getAdminList() {
    return http.get(`/gcs-user/chat/userList/admin`);
}

/**
 * 查询和用戶聊天的相关用户列表
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function getChatRelativeUserList(userId: number) {
    return http.get(`/gcs-user/chat/userList/relative?userId=${userId}`);
}

/**
 * 查询两个用户之间未确认消息的数量
 * @param source 发送消息用户id
 * @param target 接受消息用户id
 * @returns Promise<AxiosResponse>
 */
export function getNackMessageListCount(source: number, target: number) {
    return http.get(`/gcs-user/chat/count/nack/${source}/${target}`);
}

/**
 * 查询两个用户最近的消息列表
 * @param source 发送消息用户id
 * @param target 接受消息用户id
 * @returns Promise<AxiosResponse>
 */
export function getRecentMessageList(source: number, target: number) {
    return http.get(`/gcs-user/chat/messageList/recent/${source}/${target}`);
}

/**
 * 发送聊天消息
 * @param message 消息对象
 * @returns Promise<AxiosResponse>
 */
export function chat(message: MessageForm) {
    return http.post(`/gcs-admin/webSocket/chat`, JSON.stringify(message));
}