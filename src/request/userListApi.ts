import User from "@/type/userList"
import http from "."

/**
 * 添加用户角色
 * @param userId 用户id
 * @param roleId 角色id
 * @returns Promise<AxiosResponse>
 */
export function addUserRoleInfo(userId: number, roleId: number) {
    const ur = {
        userId,
        roleId
    }
    return http.post(`/gcs-admin/user-role/a`, JSON.stringify(ur))
}

/**
 * 删除用户
 * @param id 用户id
 * @returns Promise<AxiosResponse>
 */
export function deleteUser(id: number) {
    return http.delete(`/gcs-admin/user/${id}`)
}

/**
 * 批量删除用户
 * @param ids 用户id集合
 * @returns Promise<AxiosResponse>
 */
export function deleteUserList(ids: number[]) {
    return http.delete(`/gcs-admin/user/list`, { data: JSON.stringify(ids) })
}

/**
 * 通过角色英文名、性别和用户名模糊查询用户信息
 * @param role 角色
 * @param gender 性别
 * @param username 用户名
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getUserListByRoleOrGenderOrName(role: string, gender: string, username: string, pageNum: number, pageSize: number) {
    let path = "";
    const params: string[] = []
    if (role !== "") {
        params.push(`role=${role}`)
    }
    if (gender !== "") {
        params.push(`gender=${gender}`)
    }
    if (username !== "") {
        params.push(`username=${username}`)
    }

    if (params.length !== 0) {
        path += "?";
    }
    params.forEach((p, index) => {
        path += p
        if (index < params.length - 1) {
            path += "&"
        }
    });

    return http.get(`/gcs-admin/user/role/name/${pageNum}/${pageSize}${path}`)
}

/**
 * 分页查询用户列表
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getUserList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-admin/user/list/${pageNum}/${pageSize}`)
}

/**
 * 通过用户名模糊查询所有用户信息
 * @param name 用户名
 * @returns Promise<AxiosResponse>
 */
export function getAllUsersByName(name: string) {
    return http.get(`/gcs-admin/user/all/name?username=${name}`)
}

/**
 * 通过角色英文名、性别和用户名模糊查询用户数量
 * @param role 角色
 * @param gender 性别
 * @param username 用户名
 * @returns Promise<AxiosResponse>
 */
export function getCountByRoleOrGenderOrName(role: string, gender: string, username: string) {
    let path = "";
    const params: string[] = []
    if (role !== "") {
        params.push(`role=${role}`)
    }
    if (gender !== "") {
        params.push(`gender=${gender}`)
    }
    if (username !== "") {
        params.push(`username=${username}`)
    }

    if (params.length !== 0) {
        path += "?";
    }
    params.forEach((p, index) => {
        path += p
        if (index < params.length - 1) {
            path += "&"
        }
    });

    return http.get(`/gcs-admin/user/count/role/name${path}`)
}

/**
 * 修改用户信息
 * @param user 用户对象
 * @returns Promise<AxiosResponse>
 */
export function updateUserInfo(user: User) {
    return http.put(`/gcs-admin/user/${user.id}`, JSON.stringify(user))
}

/**
 * 测试通过用户id和角色id删除用户角色
 * @param userId 用户id
 * @param roleId 角色id
 * @returns Promise<AxiosResponse>
 */
export function deleteUserRoleByUserIdAndRoleId(userId: number, roleId: number) {
    return http.delete(`/gcs-admin/user-role/${userId}/${roleId}`)
}

/**
 * 导出excel
 * @param isTemplate 是否为excel模版
 * @returns 
 */
export function download(isTemplate: boolean) {
    return http.get(`/gcs-admin/excel/user/download?isTemplate=${isTemplate}`, {
        responseType: 'blob'
    });
}