import PathForm from "@/type/addPath";
import http from ".";

/**
 * 添加权限信息
 * @param path 权限对象
 * @returns Promise<AxiosResponse>
 */
export function addPath(path: PathForm) {
    return http.post(`/gcs-admin/path/a`, JSON.stringify(path))
}