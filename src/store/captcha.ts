import CaptchaResult from "@/type/captcha";
import { defineStore } from "pinia";
/**
 * 极验验证码相关 
 */

const useCaptchaStore = defineStore("captcha", {
    state: () => {
        return {
            captchaId: 'be090a5eecb471ac159043c760425a5f',
            captchaObject: <{ appendTo?: any; onNextReady?: any; onSuccess?: any; getValidate?: any; reset?: any; }>{},
            captchaResult: <CaptchaResult>{}
        }
    },
    getters: {

    },
    actions: {

    },
    persist: {
        //持久化的数据数组 多层级以.做分割
        paths: ['captchaObject', 'captchaResult']
    }
})

export default useCaptchaStore;