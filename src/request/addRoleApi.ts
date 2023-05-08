import RoleForm from "@/type/addRole";
import http from ".";

/**
 * 添加角色
 * @param role 角色对象
 * @returns Promise<AxiosResponse>
 */
export function addRole(role: RoleForm) {
    return http.post(`/gcs-admin/role/a`, JSON.stringify(role));
}
