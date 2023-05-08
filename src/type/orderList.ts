interface Order {
    id: number,
    sum: number,
    createTime: string,
}

interface OrderDetails{
    goodId: number,
    goodName: string,
    goodImage: string | Array<string>,
    goodScore: number,
    count: number
}

export {
    Order,
    OrderDetails,
}