import Path from "@/type/pathList";
import http from ".";

/**
 * 删除权限信息
 * @param id 权限id
 * @returns Promise<AxiosResponse>
 */
export function deletePath(id: number) {
    return http.delete(`/gcs-admin/path/${id}`)
}

/**
 * 批量删除权限信息
 * @param ids 权限id集合
 * @returns Promise<AxiosResponse>
 */
export function deletePathList(ids: number[]) {
    return http.delete(`/gcs-admin/path/list`, {data: JSON.stringify(ids)});
}

/**
 * 查询所有权限集合
 * @returns Promise<AxiosResponse>
 */
export function getAllPathList() {
    return http.get(`/gcs-admin/path/list`);
}

/**
 * 分页查询权限集合
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getPathList(pageNum: number, pageSize: number) {
    return http.get(`/gcs-admin/path/list/${pageNum}/${pageSize}`);
}

/**
 * 查询权限总数量
 * @returns Promise<AxiosResponse>
 */
export function getAllPathCount() {
    return http.get(`/gcs-admin/path/count`);
}

/**
 * 通过权限路径模糊查询所有权限集合
 * @param path 权限路径
 * @returns Promise<AxiosResponse>
 */
export function getAllPathListByPath(path: string) {
    return http.get(`/gcs-admin/path/list/path?path=${path}`);
}

/**
 * 通过权限路径模糊分页查询权限集合
 * @param path 权限路径
 * @param pageNum 页码
 * @param pageSize 页面容量
 * @returns Promise<AxiosResponse>
 */
export function getPathListByPath(path: string, pageNum: number, pageSize: number) {
    return http.get(`/gcs-admin/path/list/path/${pageNum}/${pageSize}?path=${path}`);
}

/**
 * 通过权限路径模糊查询数量
 * @param path 权限路径
 * @returns Promise<AxiosResponse>
 */
export function getPathCountByPath(path: string) {
    return http.get(`/gcs-admin/path/count/path?path=${path}`)
}

/**
 * 修改权限信息
 * @param path 权限对象
 * @returns Promise<AxiosResponse>
 */
export function updatePathInfo(path: Path) {
    return http.put(`/gcs-admin/path/${path.id}`, JSON.stringify(path));
}