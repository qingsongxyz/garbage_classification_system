import { RolePath, RolePathForm } from "@/type/rolePathList";
import http from ".";

/**
 * 添加角色权限信息
 * @param rolePath 角色权限对象 
 * @returns Promise<AxiosResponse>
 */
export function addRolePathInfo(rolePath: RolePathForm) {
    return http.post(`/gcs-admin/role-path/a/${rolePath.pathId}/${rolePath.roleId}`);
}

/**
 * 通过id删除角色权限信息
 * @param id 角色权限id
 * @returns Promise<AxiosResponse>
 */
export function deleteRolePathById(id: number) {
    return http.delete(`/gcs-admin/role-path/${id}`)
}

/**
 * 批量删除角色权限列表
 * @param ids 角色权限id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteRolePathList(ids: number[]) {
    return http.delete(`/gcs-admin/role-path/list`, { data: JSON.stringify(ids) })
}

/**
 * 查询角色权限信息
 * @returns Promise<AxiosResponse>
 */
export function getRolePathList() {
    return http.get(`/gcs-admin/role/rolePathList`)
}

/**
 * 通过权限路径查询角色权限列表
 * @param path 
 * @returns Promise<AxiosResponse>
 */
export function getAllRolePathByPath(path: string) {
    return http.get(`/gcs-admin/role/rolePathList/path?path=${path}`)
}

/**
 * 通过角色英文名和权限路径查询角色权限列表
 * @param role 角色英文名
 * @param path 权限路径
 * @returns Promise<AxiosResponse>
 */
export function getAllRolePathByRoleAndPath(role: string, path: string) {
    if (role !== "" && path !== "") {
        return http.get(`/gcs-admin/role/rolePathList/role/path?role=${role}&path=${path}`)
    }
    if (role !== "") {
        return http.get(`/gcs-admin/role/rolePathList/role/path?role=${role}`)
    }
    return http.get(`/gcs-admin/role/rolePathList/role/path?path=${path}`)
}

/**
 * 修改角色权限信息
 * @param rp 角色权限对象
 * @returns Promise<AxiosResponse>
 */
export function updateRolePathInfo(rp: RolePath) {
    return http.put(`/gcs-admin/role-path/${rp.roleId}`, JSON.stringify(rp))
}
