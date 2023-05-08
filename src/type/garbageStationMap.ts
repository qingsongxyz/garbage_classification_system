interface Point {
    lat: number,
    lng: number,
    animation?: "BMAP_ANIMATION_DROP" | "BMAP_ANIMATION_BOUNCE"
}

interface Address{
    province: string,
    city: string,
    district: string,
    street: string,
    streetNumber: string,
}

interface GarbageStationForm {
    position: Point,
    address: Address,
    status: boolean
}

interface GarbageStation {
    id: string,
    distance?: string,
    position: Point,
    address: Address,
    status: boolean
}

interface UpdateGarbageStationForm{
    id: string,
    address: string,
    status: boolean
}

export {
    Point,
    Address,
    GarbageStationForm,
    GarbageStation,
    UpdateGarbageStationForm
}