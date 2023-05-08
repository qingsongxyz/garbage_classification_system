export interface GarbageCategory {
    id: number
    name: string
    description: string
    image: string | Array<string>
    details?: Array<Garbage>  //存储一系列该类型的垃圾
}

export interface Garbage {
    id: number
    name: string
    category: string
    unit: string
    score: number
    image: string | Array<string>
}
