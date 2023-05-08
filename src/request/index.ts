/**
 * 封装axios实例
 */
import axios from 'axios'
import { ElLoading } from 'element-plus'
import { ElMessage } from 'element-plus'
import { HOST, PORT } from "@/config"
import { refreshToken } from './loginApi'
import useUserStore from '@/store/user'
import { storeToRefs } from 'pinia'
import router from '@/router'
import useWebSocketStore from '@/store/webSocket'
import useMarketStore from '@/store/market'
import useTab from '@/store/tab'

let loading: any = null;

/**
 * 对于特定路径(oauth/**)不添加Authorization请求头
 */
const ignoreHeader: string = "/oauth/"

/**
 * 隐藏加载动画的url数组
 */
const hideLoadingUrlArray: string[] = [
    "/gcs-garbage/garbage/keyword",
    "/gcs-garbage/garbage/list/name",
    "/gcs-garbage/garbage-category/all",
    "/gcs-garbage/garbage-category/list",
    "/gcs-admin/path/list/path",
    "/gcs-admin/role/rolePathList/path",
    "/gcs-admin/user/all/name",
    "/gcs-user/classify-rubbish/recognize/url",
    "/gcs-mall/good-category/list/category",
    "/gcs-mall/good/list/name",
    "/gcs-user/market/",
    "/gcs-user/market-details/list",
    "/gcs-user/user/rank",
    "/gcs-user/user/signIn",
    "/gcs-user/user/mail/captcha",
    "/gcs-user/user/phone/captcha",
    "/gcs-station/garbage-station/list/address",
    "/gcs-station/garbage-station/list/near",
]

//创建axios实例
const http = axios.create({
    baseURL: `https://${HOST}:${PORT}/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

//请求拦截 携带token请求头
http.interceptors.request.use((config) => {
    if (config.url) {
        let requestUrl: string = config.url;
        const index: number = requestUrl.indexOf("?");
        if (index !== -1) {
            requestUrl = requestUrl.substring(0, index);
        }

        if (!hideLoadingUrlArray.includes(requestUrl)) {
            //开启加载动画
            loading = ElLoading.service({
                lock: true,
                text: '加载中',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        }

        if (requestUrl.indexOf(ignoreHeader) === -1) {
            const user = localStorage.getItem('user')
            config.headers = config.headers || {}
            if (user) {
                const obj = JSON.parse(user);
                if (obj.access_token) {
                    const token = "Bearer " + obj.access_token;
                    config.headers.Authorization = token || ""
                }
            }
        }
    }
    return config
})

//响应拦截 刷新token
http.interceptors.response.use((res) => {

    //关闭加载动画
    if (loading !== null) {
        loading.close()
    }
    return res
}, async (err) => {
    let statusCode: number = err.response.status;

    //关闭加载动画
    if (loading !== null) {
        loading.close()
    }

    //token失效 刷新令牌
    if (statusCode === 401) {
        const res = await refreshToken();
        const userStore = useUserStore();
        const { id, access_token, refresh_token } = storeToRefs(userStore);

        if (!refresh_token.value) {
            return;
        }

        if (res.data.code === 200) {
            access_token.value = res.data?.access_token;
            refresh_token.value = res.data?.refresh_token;
            //刷新当前页面, 重新发起请求
            location.reload();
            return;
        } else {
            const webSocketStore = useWebSocketStore();
            const { ws } = storeToRefs(webSocketStore);
            const marketStore = useMarketStore();
            const tabStore = useTab();
            if (Object.keys(ws.value).length !== 0) {
                //关闭连接
                ws.value.disconnect(
                    () => {
                        console.log("Disconnect:");
                    },
                    {
                        id: id.value,
                        type: "CHAT",
                    }
                );
            }

            webSocketStore.$reset();
            userStore.$reset();
            tabStore.$reset();
            marketStore.$reset();
            //跳转到登录页
            ElMessage.error({
                message: '刷新令牌失败, 请重新登录!!!',
                center: true,
                duration: 2000,
            })
            router.push({ name: "login" });
            return;
        }
    } else if (statusCode === 403) {
        console.log(err);
        //跳转到错误页
        ElMessage.error({
            message: '您无权访问该页面!!!',
            center: true,
            duration: 2000,
        })
        router.push({ name: "status", params: { statusCode: 403 } });
        return;
    } else if (statusCode === 500) {
        ElMessage.error({
            message: '服务器错误!!!',
            center: true,
            duration: 2000,
        })
        return;
    } else if (statusCode === 503) {
        ElMessage.error({
            message: '服务不可用, 请稍后再试!!!',
            center: true,
            duration: 2000,
        })
        router.push({ name: "status", params: { statusCode: 503 } });
        return;
    }

    return Promise.reject(err);
})

export default http
