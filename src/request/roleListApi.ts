import Role from "@/type/roleList";
import http from ".";

/**
 * 通过id删除角色
 * @param id 角色id
 * @returns Promise<AxiosResponse>
 */
export function deleteRole(id: number) {
    return http.delete(`/gcs-admin/role/${id}`);
}

/**
 * 批量删除角色集合
 * @param ids 角色id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteRoleList(ids: number[]) {
    return http.delete(`/gcs-admin/role/list`, { data: JSON.stringify(ids) });
}

/**
 * 查询所有角色列表
 * @returns Promise<AxiosResponse>
 */
export function getRoleList() {
    return http.get(`/gcs-admin/role/list`);
}

/**
 * 通过角色英文名模糊查询
 * @param role 角色英文名
 * @returns Promise<AxiosResponse>
 */
export function getRoleListByRole(role: string) {
    return http.get(`/gcs-admin/role/list/role?role=${role}`);
}

/**
 * 修改角色信息
 * @param role 角色对象
 * @returns Promise<AxiosResponse>
 */
export function updateRoleInfo(role: Role) {
    return http.put(`/gcs-admin/role/${role.id}`, JSON.stringify(role));
}