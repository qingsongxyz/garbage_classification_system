import http from '.'
import { Email, Sms, UserForm } from '@/type/personal';

/**
 * 发送绑定手机号验证码短信
 * @param phone 手机号
 * @returns Promise<AxiosResponse>
 */
export function sendSms(phone: string) {
    return http.post(`/gcs-user/user/phone/captcha/binding?phone=${phone}`);
}

/**
 * 发送验证码邮件
 * @param email 邮件对象
 * @returns Promise<AxiosResponse>
 */
export function mail(email: Email) {
    const o = {
        userId: email.userId,
        username: email.username,
        targetMail: email.email,
        captcha: email.code 
    }
    return http.post(`/gcs-user/user/mail/captcha`, JSON.stringify(o));
}

/**
 * 绑定邮箱
 * @param email 邮件对象
 * @returns Promise<AxiosResponse>
 */
export function bindingEmail(email: Email) {
    const o = {
        userId: email.userId,
        email: email.email,
        captcha: email.code 
    }
    return http.put(`/gcs-user/user/bind/email`, JSON.stringify(o));
}

/**
 * 绑定手机号
 * @param sms 短信对象
 * @returns Promise<AxiosResponse>
 */
export function bindingPhone(sms: Sms) {
    const o = {
        userId: sms.userId,
        phone: sms.phone,
        captcha: sms.code 
    }
    return http.put(`/gcs-user/user/bind/phone`, JSON.stringify(o));
}

/**
 * 通过id查询用户信息
 * @param id 用户id
 * @returns Promise<AxiosResponse>
 */
export function getUserById(id: number) {
    return http.get(`/gcs-user/user/${id}`);
}

/**
 * 修改用户信息
 * @param user 用户对象
 * @returns Promise<AxiosResponse>
 */
export function updateUser(user: UserForm) {
    return http.put(`/gcs-user/user/${user.id}`, JSON.stringify(user));
}