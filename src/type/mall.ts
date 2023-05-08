interface MarketDetailsForm {
    marketId: number,
    goodId: number,
    goodName: string,
    goodImage: string | Array<string>,
    goodScore: number,
    count: number,
    storage: number;
}

export {
    MarketDetailsForm,
}