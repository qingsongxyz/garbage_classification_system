import useUserStore from './user'
import useCaptchaStore from './captcha'
import useMarketStore from './market'
import useTab from './tab'
import useWebSocketStore from './webSocket'

// 统一导出useStore方法
export default function useStore() {
    return {
        user: useUserStore(),
        captcha: useCaptchaStore(),
        market: useMarketStore(),
        tab: useTab(),
        webSocket: useWebSocketStore(),
    }
}