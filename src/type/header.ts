interface MarketDetails {
    id: number,
    marketId: number,
    goodId: number,
    goodName: string,
    goodImage: string | Array<string>,
    goodScore: number,
    count: number
}

interface OrderForm {
    userId: number,
    sum: number,
    orderDetailsList: Array<OrderDetailsForm>
}

interface OrderDetailsForm{
    goodId: number,
    goodName: string,
    goodImage: string,
    goodScore: number,
    count: number
}

export {
    MarketDetails,
    OrderForm,
    OrderDetailsForm,
}