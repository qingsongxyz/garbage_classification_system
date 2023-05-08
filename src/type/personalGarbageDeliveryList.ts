import User from "@/type/userList"

interface GarbageDelivery {
    id: number,
    userId: number,
    total: number,
    status: number,
    stationAddress: string,
    addition: string,
    createTime: string,
    userVO?: User
}

interface GarbageDeliveryDetails {
    id: number
    deliveryId?: number,
    garbageId: number
    garbageName: string
    garbageCategory: string,
    garbageUnit: string
    garbageScore: number
    garbageImage: string | Array<string>
    count: number,
    sum: number,
    flag: number
}

interface GarbageDeliveryForm {
    id: number,
    status: number,
    addition?: string
}

export {
    GarbageDelivery,
    GarbageDeliveryDetails,
    GarbageDeliveryForm
}