import CaptchaResult from "@/type/captcha";
import { Message, PhoneLoginForm, UserLoginForm } from "@/type/login";
import http from ".";

/**
 * 登录获取token
 * @param user 用户对象
 * @returns Promise<AxiosResponse>
 */
export function login(user: UserLoginForm, captchaResult: CaptchaResult) {
    const u = {
        username: user.username,
        password: user.password
    };
    return http.post(`/gcs-auth/oauth/token`, JSON.stringify({ ...u, captchaResult }))
}

//保存刷新令牌结果
let refreshResult: Promise<any>;
//是否正在刷新令牌
let isRefreshing: boolean = false;

/**
 * 刷新token
 * @returns Promise<AxiosResponse>
 */
export function refreshToken() {
    if (isRefreshing) {
        //多次刷新令牌, 返回第一次的结果
        return refreshResult;
    }

    //正在刷新令牌
    isRefreshing = true;

    let refresh_token: string = '';
    const user = localStorage.getItem('user')
    if (user) {
        const obj = JSON.parse(user);
        if (obj.refresh_token) {
            refresh_token = obj.refresh_token;
        }
    }

    refreshResult = http.post(`/gcs-auth/oauth/token/refresh?refreshToken=${refresh_token}`).finally(() => {
        //完成刷新令牌
        isRefreshing = false;
    })
}

/**
 * 发送验证码短信
 * @param phone 手机号
 * @returns Promise<AxiosResponse>
 */
export function sendSms(phone: string) {
    return http.post(`/gcs-user/user/phone/captcha?phone=${phone}`);
}


/**
 * 手机号登录获取token
 * @param phoneForm 手机号登录对象
 * @returns Promise<AxiosResponse>
 */
export function loginByPhone(phoneForm: PhoneLoginForm) {
    return http.post(`/gcs-auth/oauth/token/phone`, JSON.stringify(phoneForm))
}

/**
 * 通过用户名查询用户信息
 * @param username 用户名
 * @returns Promise<AxiosResponse>
 */
export function getUserByUsername(username: string) {
    return http.get(`/gcs-admin/user/name?username=${username}`)
}

/**
 * 获取微信认证二维码
 * @param id 唯一标识  
 * @returns Promise<AxiosResponse>
 */
export function getWechatQRCode(id: string) {
    return http.get(`/gcs-auth/third-party/wechat/auth?id=${id}`);
}

/**
 * 获取支付宝扫码url
 * @param id 唯一标识
 * @returns Promise<AxiosResponse>
 */
export function getAlipayUrl(id: string) {
    return http.get(`/gcs-auth/third-party/alipay/auth?id=${id}`);
}

/**
 * 注册三方登录用户消息
 * @param message 消息对象
 * @returns Promise<AxiosResponse>
 */
export function addUser(message: Message) {
    return http.post(`/gcs-admin/webSocket/addUser`, JSON.stringify(message));
}

/**
 * 绑定用户三方消息
 * @param message 消息对象
 * @returns Promise<AxiosResponse>
 */
export function bindingUser(message: Message) {
    return http.post(`/gcs-admin/webSocket/bindingUser`, JSON.stringify(message));
}

/**
 * 通过三方登录
 * @param userDTO 扫码登录用户信息
 * @returns Promise<AxiosResponse>
 */
export function loginByThirdParty(userDTO: any) {
    return http.post(`/gcs-auth/oauth/token/thirdParty`, JSON.stringify(userDTO));
}