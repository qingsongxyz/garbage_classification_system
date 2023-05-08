import UpdatePasswordForm from "@/type/updatePassword";
import http from ".";
import CaptchaResult from "@/type/captcha";

/**
 * 修改用户密码
 * @param form 用户对象
 * @param captcha 极验验证对象
 * @returns Promise<AxiosResponse>
 */
export function updatePwd (form: UpdatePasswordForm, captcha: CaptchaResult) {
    const param = {
        id: form.id,
        oldPwd: form.oldPwd,
        newPwd: form.newPwd,
        captcha
    }
    return http.put(`/gcs-user/user/pwd/${form.id}`, JSON.stringify(param));
}