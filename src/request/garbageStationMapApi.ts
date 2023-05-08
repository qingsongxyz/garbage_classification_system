import { Address, GarbageStation, GarbageStationForm, Point, UpdateGarbageStationForm } from "@/type/garbageStationMap";
import http from ".";

/**
 * 添加垃圾回收站
 * @param garbageStation 垃圾回收站对象
 * @returns Promise<AxiosResponse>
 */
export function addGarbageStation(garbageStation: GarbageStationForm) {
    const o = {
        coordinates: new Array(garbageStation.position.lng, garbageStation.position.lat),
        address: garbageStation.address,
        status: garbageStation.status
    }
    return http.post(`/gcs-station/garbage-station/a`, JSON.stringify(o));
}

/**
 * 删除垃圾回收站
 * @param id 垃圾回收站id
 * @returns Promise<AxiosResponse>
 */
export function deleteGarbageStation(id: string) {
    return http.delete(`/gcs-station/garbage-station/${id}`);
}

/**
 * 通过id查询垃圾回收站
 * @param id 垃圾回收站id
 * @returns Promise<AxiosResponse>
 */
export function getGarbageStationById(id: string) {
    return http.get(`/gcs-station/garbage-station/${id}`);
}

/**
 * 通过地址查询垃圾回收站集合
 * @param address 垃圾回收站地址
 * @returns Promise<AxiosResponse>
 */
export function getGarbageStationListByAddress(address: Address) {
    return http.post(`/gcs-station/garbage-station/list/address`, JSON.stringify(address));
}

/**
 * 查询在中心点范围内的所有垃圾回收站集合
 * @param point 中心点
 * @param distance 离中心点距离
 * @returns Promise<AxiosResponse>
 */
export function getNearGarbageStationList(point: Point, distance: number) {
    return http.get(`/gcs-station/garbage-station/list/near?coordinates=${point.lng}&coordinates=${point.lat}&distance=${distance}`);
}

/**
 * 修改垃圾回收站信息
 * @param garbageStation 垃圾回收站对象
 * @returns Promise<AxiosResponse>
 */
export function updateGarbageStationFunction(garbageStation: UpdateGarbageStationForm) {
    const o = {
        id: garbageStation.id,
        status: garbageStation.status
    }
    return http.put(`/gcs-station/garbage-station/${garbageStation.id}`, JSON.stringify(o));
}