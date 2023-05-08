import http from ".";

/**
 * 查询用户积分排行榜(前100名)
 * @returns Promise<AxiosResponse>
 */
export function getUserListByScoreRanking(start: number) {
    return http.get(`/gcs-user/user/rank/${start}`);
}