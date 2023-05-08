<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <Header />
    </el-header>
    <!-- 主题部分 -->
    <el-main>
      <router-view />
    </el-main>
    <!-- 底部 -->
    <el-footer>
      <Footer />
    </el-footer>
    <!-- 联系管理员(固钉) -->
    <el-affix v-show="id && id !== 0" target=".el-container" position="bottom">
      <el-tooltip effect="light" content="联系管理员">
        <el-button @click="openDialog" type="success" circle>
          <el-icon size="28"><ChatLineRound /></el-icon>
        </el-button>
      </el-tooltip>
    </el-affix>
    <!-- 回到顶部 -->
    <el-backtop :right="100" :bottom="100" />
  </el-container>

  <el-dialog
    @close="closeDialog"
    v-model="dialogVisible"
    width="60%"
    center
    align-center
  >
    <el-row class="chatBox">
      <el-col :span="7">
        <el-menu v-if="checkAdmin()" background-color="#fff">
          <el-menu-item
            v-for="(u, index) in userList"
            :key="index"
            @click="chooseUser(u, false)"
            :index="u.id.toString()"
          >
            <el-avatar :src="u.image" />
            <span class="name">{{ u.username }}</span>
            <strong v-if="u.online" class="online">·</strong>
            <el-badge
              :hidden="u.newMessageCount === 0"
              :value="u.newMessageCount"
              class="notice"
            />
          </el-menu-item>
        </el-menu>
        <el-menu v-else background-color="#fff">
          <el-menu-item
            v-for="(a, index) in adminList"
            :key="index"
            @click="chooseUser(a, true)"
            :index="a.id.toString()"
          >
            <el-avatar :src="a.image" />
            <span class="name">{{ a.username }}(管理员)</span>
            <strong v-if="a.online" class="online">·</strong>
            <el-badge
              :hidden="a.newMessageCount === 0"
              :value="a.newMessageCount"
              class="notice"
            />
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="17">
        <div v-show="chatDialogVisible">
          <div class="title">
            {{ chatUser.username }}&nbsp;
            <div v-show="isAdmin">
              <el-tooltip effect="light" content="邮箱: 3608802405@qq.com">
                <el-icon size="11"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </div>
          <div class="content">
            <ul>
              <li v-for="(m, index) in messageList" :key="index">
                <p class="time">{{ m.time.replaceAll("T", " ") }}</p>
                <div v-if="m.source === id.toString()" class="message">
                  <el-avatar :src="image" />
                  <div class="content my">
                    <div class="arrow left"></div>
                    {{ m.content }}
                  </div>
                </div>
                <div v-else class="message other">
                  <div class="content other">
                    <div class="arrow right"></div>
                    {{ m.content }}
                  </div>
                  <el-avatar :src="chatUser.image" />
                </div>
              </li>
            </ul>
          </div>
          <div class="editor">
            <el-input
              class="textarea"
              v-model="message"
              :rows="5"
              :autosize="false"
              type="textarea"
              resize="none"
              placeholder="Ctrl+Enter发送消息"
              @keydown.ctrl.enter="sendMessage"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, ref } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import * as echarts from "echarts";
import useUserStore from "./store/user";
import { storeToRefs } from "pinia";
import { Message, MessageForm } from "./type/login";
import { ChatUser } from "./type/chat";
import {
  chat,
  getAdminList,
  getChatRelativeUserList,
  getOnlineUserList,
  getRecentMessageList,
} from "./request/chatApi";
import { getNowDate } from "./util/date";
import { WS_CHAT_PATH } from "./config";
import useWebSocketStore from "./store/webSocket";
import { connect } from "./hooks/webSocket";
import User from "./type/userList";
import { ElLoading } from "element-plus";
import { Subscription } from "stompjs";
export default defineComponent({
  components: { Header, Footer },
  setup() {
    provide("echarts", echarts);

    const dialogVisible = ref(false);

    const chatDialogVisible = ref(false);

    const userStore = useUserStore();
    const { id, username, image, roleList } = storeToRefs(userStore);

    const message = ref("");

    const messageList: Array<MessageForm> = reactive([]);

    const onlineUserList: Array<string> = reactive([]);

    const adminList: Array<ChatUser> = reactive([]);

    const userList: Array<ChatUser> = reactive([]);

    const chatUser: ChatUser = reactive({
      id: 1,
      username: "",
      image: "",
      newMessageCount: 0,
      online: false,
    });

    const isAdmin = ref(false);

    const webSocketStore = useWebSocketStore();
    const { ws } = storeToRefs(webSocketStore);

    function checkAdmin() {
      return roleList.value.filter((r) => r.role === "admin").length === 1;
    }

    async function openDialog() {
      if (ws.value) {
        ws.value = connect(id.value, function (frame) {
          console.log("Connected: " + frame);

          let loading = ElLoading.service({
            lock: true,
            text: "加载中",
            background: "rgba(0, 0, 0, 0.7)",
          });

          while (!ws.value.connected) {}

          if (loading) {
            loading.close();
          }
        });
      }

      const result = await getOnlineUserList().then(
        (res) => {
          // console.log(res);
          const temp: Array<string> = res.data.data;
          temp.forEach((t) => {
            onlineUserList.push(t);
          });
          return true;
        },
        (err) => {
          console.log(err);
          return false;
        }
      );

      if (result && checkAdmin()) {
        getChatRelativeUserList(id.value).then(
          (res) => {
            // console.log(res);
            const temp: Array<User> = res.data.data;
            temp.forEach((t) => {
              const c: ChatUser = {
                id: t.id,
                username: t.username,
                image: t.image,
                newMessageCount: 0,
                online: false,
              };
              if (onlineUserList.includes(t.id.toString())) {
                c.online = true;
              }
              userList.push(c);
            });

            dialogVisible.value = true;
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        getAdminList().then(
          (res) => {
            // console.log(res);
            const temp: Array<User> = res.data.data;
            temp.forEach((t) => {
              const c: ChatUser = {
                id: t.id,
                username: t.username,
                image: t.image,
                newMessageCount: 0,
                online: false,
              };
              if (onlineUserList.includes(t.id.toString())) {
                c.online = true;
              }
              adminList.push(c);
            });

            dialogVisible.value = true;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }

    function closeDialog() {
      chatUser.id = 1;
      chatUser.image = "";
      chatUser.username = "";

      if (adminList.length !== 0) {
        adminList.splice(0, adminList.length);
      }
      if (userList.length !== 0) {
        userList.splice(0, userList.length);
      }
      if (onlineUserList.length !== 0) {
        onlineUserList.splice(0, onlineUserList.length);
      }
    }

    function sendMessage() {
      if (message.value.trim() === "") {
        return;
      }

      const m: MessageForm = {
        type: "CHAT",
        source: id.value.toString(),
        target: chatUser.id.toString(),
        content: message.value,
        ack: false,
        time: getNowDate(),
      };

      //发送消息
      chat(m).then(
        (res) => {
          messageList.push(m);
          var chatBox = document.getElementsByClassName("content")[0];
          chatBox.scrollTop = chatBox.scrollHeight;
        },
        (err) => {
          console.log(err);
        }
      );

      message.value = "";
    }

    function chooseUser(u: ChatUser, flag: boolean) {
      if (chatUser.id === 1 || u.id !== chatUser.id) {
        //订阅对应的用户聊天路径
        let messageID: string;
        // let loading = ElLoading.service({
        //   lock: true,
        //   text: "加载中",
        //   background: "rgba(0, 0, 0, 0.7)",
        // });

        // while (!ws.value.connected) {}

        // loading.close();

        ws.value.subscribe(
          WS_CHAT_PATH + "." + id.value,
          function (response) {
            const content = response.body;
            messageID =
              response.headers["message-id" as keyof typeof response.headers];
            try {
              const message: Message = JSON.parse(content);

              //如果仍然在和该用户聊天
              if (message.source === chatUser.id.toString()) {
                messageList.push(message);
                var chatBox = document.getElementsByClassName("content")[0];
                chatBox.scrollTop = chatBox.scrollHeight;
              } else {
                let u;
                if (checkAdmin()) {
                  u = adminList.filter(
                    (a) => a.id.toString() === message.source
                  )[0];
                } else {
                  u = userList.filter(
                    (a) => a.id.toString() === message.source
                  )[0];
                }
                if (u && u.newMessageCount) {
                  //添加新消息数量
                  u.newMessageCount++;
                }
              }

              response.ack({ "message-id": messageID, content });
            } catch (error) {
              console.log(error);
              response.nack({ "message-id": messageID, content });
            }
          },
          {
            ack: "client",
            "x-queue-name": "chat." + id.value,
            id: id.value,
            durable: true,
            "auto-delete": false,
          }
        );

        isAdmin.value = flag;
        chatUser.id = u.id;
        chatUser.username = u.username;
        chatUser.image = u.image;
        chatUser.newMessageCount = u.newMessageCount;
        chatUser.online = u.online;

        let temp;
        if (isAdmin.value) {
          temp = adminList.filter((a) => a.id === u.id)[0];
        } else {
          temp = userList.filter((a) => a.id === u.id)[0];
        }

        //清空新消息提醒
        if (temp) {
          temp.newMessageCount = 0;
        }

        getRecentMessageList(id.value, u.id).then(
          (res) => {
            // console.log(res);
            messageList.splice(0, messageList.length);
            const temp: Array<Message> = res.data.data;
            temp.forEach((m) => {
              messageList.push(m);
            });
            chatDialogVisible.value = true;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }

    return {
      dialogVisible,
      chatDialogVisible,
      id,
      username,
      image,
      message,
      messageList,
      onlineUserList,
      adminList,
      userList,
      chatUser,
      isAdmin,
      checkAdmin,
      openDialog,
      closeDialog,
      sendMessage,
      chooseUser,
    };
  },
});
</script>

<style lang="less">
@import "./assets/font/font.css";
body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 15px;
  color: #4a4a4a;
  font-family: "Helvetica Neue", "PingFang SC", "Hiragino Sans GB";

  #app {
    text-align: center;
    .el-container {
      .el-header {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        z-index: 3;
        height: 54px;
        line-height: 54px;
        padding: 0px;
        background-color: #fdfeff;
      }

      .el-main {
        padding: 2px;
        min-height: 100vh;
      }

      .el-footer {
        height: 46px;
        line-height: 44px;
        color: #939393;
        background-color: #252525;
      }

      .el-affix {
        height: 0px;
        .el-button {
          position: absolute;
          right: 50px;
          bottom: 130px;
          width: 45px;
          height: 45px;
        }
      }
    }
  }

  .el-dialog {
    .chatBox {
      min-height: 518px;
      border: 1px solid #cccccc;

      .el-menu-item:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        background-color: #f5f5f5;
        color: #66b1ff;
      }

      .el-menu {
        min-height: 516px;
      }

      .el-menu-item {
        position: relative;
        .name {
          margin-left: 10px;
        }

        .online {
          color: #85ce61;
          font-size: 35px;
          margin-bottom: 6px;
          margin-left: 2px;
        }

        .notice {
          position: absolute;
          bottom: 18px;
          right: 15px;
        }
      }

      .title {
        height: 40px;
        text-align: center;
        line-height: 40px;
        border: 1px solid #409eff;
        background-color: #409eff;
        color: #fdfeff;
        size: 20px;
      }

      .content {
        ul {
          height: 360px;
          padding: 0;
          margin: 0;
          border-left: 1px solid #e5e5e5;
          list-style: none;
          overflow: auto;

          li {
            margin: 20px 0px;
            .time {
              text-align: center;
            }

            .message {
              padding: 0 10px;
              position: relative;

              .content {
                width: 150px;
                min-height: 25px;
                position: relative;
                font-size: 18px;
                margin: 0 10px;
                padding: 5px;
                border-radius: 3%;
              }

              .my {
                left: 50px;
                top: -40px;
                color: #fff;
                background-color: #12b7f5;
                border: 1px solid #12b7f5;
              }

              .other {
                left: 250px;
                color: #000;
                background-color: #e5e5e5;
                border: 1px solid #e5e5e5;
              }

              .content .arrow {
                position: absolute;
                top: 10px;
                width: 0;
                height: 0;
                font-size: 0;
                border: solid 8px;
              }

              .content .left {
                left: -17px; /* 圆角的位置需要细心调试哦 */
                border-color: #fff #12b7f5 #fff #fff;
              }

              .content .right {
                right: -17px; /* 圆角的位置需要细心调试哦 */
                border-color: #fff #fff #fff #e5e5e5;
              }
            }

            .other {
              .el-avatar {
                position: absolute;
                top: 0px;
                right: 10px;
              }
            }
          }
        }
      }

      .editor {
        .el-textarea {
          .el-textarea__inner {
            border-radius: 0;
            border-top: 1px solid #cccccc;
          }
        }
      }
    }
  }
}
</style>
