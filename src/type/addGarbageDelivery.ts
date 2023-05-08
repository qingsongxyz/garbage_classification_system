interface GarbageDeliveryForm{
    userId: number,
    total: number,
    stationAddress: string,
    status: number,
    garbageDeliveryDetailsList: Array<GarbageDeliveryDetailsForm>
}

interface GarbageDeliveryDetailsForm {
    id?: number
    deliveryId?: number,
    garbageId: number
    garbageName: string
    garbageCategory: string,
    garbageUnit: string
    garbageScore: number
    garbageImage: string | Array<string>
    count?: number,
    sum?: number,
    classify?: string,
    flag?: number,
    addition?: string
}

export {
    GarbageDeliveryForm,
    GarbageDeliveryDetailsForm
}