import { MarketDetailsForm } from "@/type/mall";
import http from ".";

/**
 * 添加购物车详情
 * @param marketDetails 购物车详情信息
 * @returns Promise<AxiosResponse>
 */
export function addMarketDetails(marketDetails: MarketDetailsForm) {
    const o = {
        marketId: marketDetails.marketId,
        goodId: marketDetails.goodId,
        goodName: marketDetails.goodName,
        goodImage: marketDetails.goodImage,
        goodScore: marketDetails.goodScore,
        count: marketDetails.count,
    }
    return http.post(`/gcs-user/market-details/a`, JSON.stringify(o));
}