import http from ".";

/**
 * 签到
 * @param userId 用户id
 * @param score 获得的积分
 * @returns Promise<AxiosResponse>
 */
export function signIn(userId: number, score: number) {
    return http.post(`/gcs-user/user/signIn/${userId}?score=${score}`);
}

/**
 * 展示用户签到情况
 * @param userId 用户id
 * @returns Promise<AxiosResponse>
 */
export function showSignInStatus(userId: number) {
    return http.get(`/gcs-user/user/signIn/${userId}`);
}