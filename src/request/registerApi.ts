import CaptchaResult from "@/type/captcha";
import http from "."
import { UserInfoForm } from "@/type/register";

/**
 * 注册用户
 * @param user 用户注册信息
 * @param captchaResult 验证码信息
 * @returns Promise<AxiosResponse>
 */
export function register(user: UserInfoForm, captchaResult: CaptchaResult) {
    return http.post(`/gcs-user/user/register`, JSON.stringify({ user, captchaResult }));
}
