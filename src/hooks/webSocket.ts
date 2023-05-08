import { WS_ADDRESS } from "@/config";
import { ElMessage } from "element-plus";
import SockJS from "sockjs-client";
import Stomp, { Frame } from "stompjs";


/**
 * 创建一个stompClient对象
 * @returns Stomp.Client
 */
export function useWebSocket() {
    const ws = new SockJS(WS_ADDRESS);
    const stompClient = Stomp.over(ws);
    //浏览器每20s发送一次心跳包 但不接受
    //关闭心跳
    stompClient.heartbeat.outgoing = 0;
    stompClient.heartbeat.incoming = 0;
    return stompClient;
}

/**
 * 三方登录连接
 * @param successCallback 连接成功回调函数
 * @returns Client
 */
export function thirdPartyConnect(successCallback: (frame?: Frame) => any) {
    const ws = useWebSocket();
    ws.connect(
        {},
        successCallback,
        (error: Frame | string) => {
            let count = 0;
            while (true) {
                if (!ws.connected && count < 3) {
                    console.log(`三方登录第${count + 1}次重连...`);
                    count++;
                    //重新连接
                    setTimeout(thirdPartyConnect, 100);
                } else {
                    ElMessage.error({
                        message: "三方登录连接失败, 请稍后重试!!!",
                        duration: 2000,
                        center: true,
                    });
                    break;
                }
            }
        }
    );
    return ws;
}

/**
 * 聊天连接
 * @param id 用户id
 * @param successCallback 连接成功回调函数
 * @returns Client
 */
export function connect(id: number, successCallback: (frame?: Frame) => any) {
    const ws = useWebSocket();
    ws.connect(
        {
            id,
            type: "CHAT"
        },
        successCallback,
        (error: Frame | string) => {
            let count = 0;
            while (true) {
                if (!ws.connected && count < 3) {
                    console.log(`聊天第${count + 1}次重连...`);
                    count++;
                    //重新连接
                    setTimeout(connect, 100);
                } else {
                    ElMessage.error({
                        message: "聊天连接失败, 请稍后重试!!!",
                        duration: 2000,
                        center: true,
                    });
                }
            }
        }
    );
    return ws;
}