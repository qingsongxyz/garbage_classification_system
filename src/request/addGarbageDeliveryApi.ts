import { GarbageDeliveryForm } from "@/type/addGarbageDelivery";
import http from ".";

/**
 * 垃圾分类图像识别(url)
 * @param url 垃圾图像url
 * @returns Promise<AxiosResponse>
 */
export function recognizeUrl(url: string) {
    return http.post(`/gcs-user/classify-rubbish/recognize/url?url=${url}`)
}

/**
 * 投递垃圾
 * @param delivery 投递对象
 * @returns Promise<AxiosResponse>
 */
export function addGarbageDelivery(delivery: GarbageDeliveryForm) {
    const temp: GarbageDeliveryForm = JSON.parse(JSON.stringify(delivery));
    temp.garbageDeliveryDetailsList.forEach(d => {
        delete d.classify, d.garbageId
        if(typeof d.garbageImage !== "string"){
            d.garbageImage = d.garbageImage[0]
        }
    })
    return http.post(`/gcs-user/garbage-delivery/a`, JSON.stringify(temp))
}