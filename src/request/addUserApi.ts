import UserForm from "@/type/addUser";
import http from ".";

/**
 * 添加用户
 * @param user 用户对象
 * @returns Promise<AxiosResponse>
 */
export function addUser(user: UserForm) {
    return http.post(`/gcs-admin/user/a/${user.roleId}?username=${user.username}`)
}