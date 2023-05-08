<template>
  <el-container>
    <el-aside width="60%">
      <el-carousel height="370px" indicator-position="outside">
        <el-carousel-item v-for="(item, index) in imageList" :key="index">
          <el-image
            class="categoryImage"
            style="height: 100%"
            :src="require('../assets/' + item)"
            fit="contain"
          />
        </el-carousel-item>
      </el-carousel>
    </el-aside>
    <el-main>
      <el-row justify="center">
        <el-col :span="20">
          <el-card class="box-card">
            <template #header>
              <el-image
                :src="require('../assets/13.png')"
                style="width: 180px; height: 55px"
                fit="fill"
              />
            </template>
            <el-tabs v-model="activeName" class="tabs">
              <el-tab-pane name="credential">
                <template #label>
                  <el-icon><UserFilled /></el-icon>&nbsp;账号
                </template>
                <el-row justify="center">
                  <el-col :span="22">
                    <el-form
                      ref="userFormRef"
                      :model="userForm"
                      status-icon
                      :rules="userRules"
                      label-width="50px"
                      class="form"
                    >
                      <el-form-item label="账号" prop="username">
                        <el-input v-model="username" />
                      </el-form-item>
                      <el-form-item label="密码" prop="password">
                        <el-input
                          v-model="password"
                          type="password"
                          show-password
                        />
                      </el-form-item>
                      <el-row justify="center">
                        <el-col :span="18" :push="2">
                          <Captcha ref="userCaptchaRef" class="captcha" />
                        </el-col>
                      </el-row>
                      <el-row justify="center">
                        <el-col :span="18">
                          <el-form-item>
                            <el-button
                              type="primary"
                              @click="submitUserForm(userFormRef)"
                              >登录</el-button
                            >
                            <el-button @click="resetForm(userFormRef)"
                              >重置</el-button
                            >
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane name="phone">
                <template #label>
                  <el-icon><PhoneFilled /></el-icon>&nbsp;手机号
                </template>
                <el-row justify="center">
                  <el-col :span="22">
                    <el-form
                      ref="phoneFormRef"
                      :model="phoneForm"
                      status-icon
                      :rules="phoneRules"
                      label-width="70px"
                      class="form"
                    >
                      <el-form-item label="手机号" prop="phone">
                        <el-input v-model="phone" clearable />
                      </el-form-item>
                      <el-form-item label="验证码" prop="captcha">
                        <el-input class="code" v-model="captcha" clearable />
                        <el-button
                          @click="sendCodeFunction"
                          :disabled="disabled"
                          class="btn_send"
                          type="success"
                          ><span v-if="!disabled">发送</span
                          ><span v-else>{{ interval }}s</span></el-button
                        >
                      </el-form-item>
                      <el-row justify="center">
                        <el-col :span="24">
                          <el-form-item>
                            <el-button
                              type="primary"
                              @click="submitPhoneForm(phoneFormRef)"
                              style="margin-top: 5px; width: 100%"
                              >登录</el-button
                            >
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>

            <div class="otherInfo">
              <el-link href="/register" :underline="false"
                >没有账号?去注册</el-link
              >
              <div>
                <el-link
                  v-for="(image, index) in threePartyList"
                  :key="index"
                  :underline="false"
                >
                  <el-avatar
                    @click="showCode(image)"
                    :size="35"
                    :src="require('../assets/' + image)"
                  />
                </el-link>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

  <el-dialog v-model="dialogVisible" width="35%" center align-center>
    <el-row justify="center">
      <el-col :span="6">
        <h1 class="title">绑定用户</h1>
      </el-col>
    </el-row>
    <el-form
      ref="bingdingUserFormRef"
      :model="bingdingUserForm"
      :rules="bingdingUserFormRules"
      label-width="100px"
      class="form"
      size="default"
      status-icon
    >
      <el-row>
        <el-col :span="20">
          <el-form-item label="用户名" prop="username">
            <el-input
              class="username"
              v-model="bingdingUserForm.username"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="密码" prop="password">
            <el-input
              class="password"
              type="password"
              v-model="bingdingUserForm.password"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="21">
          <el-form-item
            ><el-button
              type="primary"
              @click="bindingUserFunction(bingdingUserFormRef)"
              >确定</el-button
            >
            <el-button @click="resetForm(bingdingUserFormRef)">
              取消
            </el-button></el-form-item
          >
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { getNumberNanoid } from "@/util/nanoid";
import { Message, PhoneLoginForm, UserLoginForm } from "@/type/login";
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
  FormInstance,
  FormRules,
} from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import Captcha from "@/components/Captcha.vue";
import useCaptchaStore from "@/store/captcha";
import { storeToRefs } from "pinia";
import {
  addUser,
  bindingUser,
  getAlipayUrl,
  getUserByUsername,
  login,
  loginByPhone,
  loginByThirdParty,
} from "@/request/loginApi";
import useUserStore from "@/store/user";
import { phoneRegex } from "@/util/regex";
import { useRouter } from "vue-router";
import { sendSms } from "@/request/loginApi";
import { useWebSocket } from "@/hooks";
import { Client } from "stompjs";
import { WS_THIRD_PARTY_PATH } from "@/config";
import { getNowDate } from "@/util/date";
import { thirdPartyConnect } from "@/hooks/webSocket";
export default defineComponent({
  name: "login",
  components: { Captcha },
  setup(props) {
    const imageList: string[] = reactive([
      "10.png",
      "11.png",
      "8.png",
      "9.png",
    ]);

    const router = useRouter();

    const activeName = ref("credential");

    const threePartyList: string[] = reactive(["alipay.png", "wechat.png"]);

    const userStore = useUserStore();
    const { id, username, roleList, image, access_token, refresh_token } =
      storeToRefs(userStore);
    const captchaStore = useCaptchaStore();
    const { captchaResult, captchaObject } = storeToRefs(captchaStore);

    const userFormRef = ref<FormInstance>();
    const userForm: UserLoginForm = reactive({
      username: "",
      password: "",
    });

    const userRules = reactive<FormRules>({
      username: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
        { min: 1, max: 50, message: "账号长度必须在1~50之间", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 1, max: 50, message: "密码长度必须在1~50之间", trigger: "blur" },
      ],
    });

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const phoneFormRef = ref<FormInstance>();
    const phoneForm: PhoneLoginForm = reactive({
      phone: "",
      captcha: "",
    });

    const interval = ref(60);
    const timer = ref();
    const disabled = ref(false);

    const dialogVisible = ref(false);

    const messageForm: Message = reactive({
      id: "1",
      type: "THIRD_PARTY_REGISTER",
      source: "",
      target: "",
      content: null,
      ack: false,
      time: "2023-2-26 08:29",
    });

    let websocket: Client;

    const bingdingUserFormRef = ref<FormInstance>();
    const bingdingUserForm: UserLoginForm = reactive({
      username: "",
      password: "",
    });

    const bingdingUserFormRules = reactive<FormRules>({
      username: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
        { min: 1, max: 50, message: "账号长度必须在1~50之间", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 1, max: 50, message: "密码长度必须在1~50之间", trigger: "blur" },
      ],
    });

    const thirdPartyWindow = ref();

    const phoneRules = reactive<FormRules>({
      phone: [
        {
          required: true,
          message: "请输入手机号",
          trigger: "blur",
        },
        { min: 11, max: 11, message: "手机号长度必须为11位", trigger: "blur" },
      ],
      captcha: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur",
        },
        { min: 6, max: 6, message: "验证码长度必须为6位", trigger: "blur" },
      ],
    });

    const submitUserForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          // console.log("submit!");
          const code: number = await login(userForm, captchaResult.value).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                access_token.value = res.data.data.access_token;
                refresh_token.value = res.data.data.refresh_token;
              }
              return res.data.code;
            },
            (err) => {
              console.log(err);
            }
          );

          if (code === 200) {
            getUserByUsername(userForm.username).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  id.value = res.data.data.id;
                  username.value = res.data.data.username;
                  roleList.value = res.data.data.roleList;
                  image.value = res.data.data.image;

                  ElNotification.success({
                    title: "欢迎回来",
                    duration: 2000,
                  });

                  router.push({ path: "/main/welcome" });
                }
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            ElMessage.error({
              message: "用户名或密码错误!!!",
              duration: 2000,
              center: true,
            });
          }
        } else {
          console.log("error submit!", fields);
        }
        //重置验证码
        captchaObject.value.reset();
        captchaStore.$reset();
      });
    };

    const submitPhoneForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          // console.log("submit!");
          const u: string = await loginByPhone(phoneForm).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                access_token.value = res.data.data.access_token;
                refresh_token.value = res.data.data.refresh_token;
              }
              return res.data.data.username;
            },
            (err) => {
              console.log(err);
            }
          );

          if (u !== "") {
            getUserByUsername(u).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  id.value = res.data.data.id;
                  username.value = res.data.data.username;
                  roleList.value = res.data.data.roleList;
                  image.value = res.data.data.image;

                  ElNotification.success({
                    title: "欢迎回来",
                    duration: 2000,
                  });

                  router.push({ path: "/main/welcome" });
                } else {
                }
              },
              (err) => {
                console.log(err);
              }
            );
          } else {
            ElMessage.error({
              message: "手机号或验证码错误!!!",
              duration: 2000,
              center: true,
            });
          }
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    function sendCodeFunction() {
      if (phoneForm.phone === "" || !phoneRegex.test(phoneForm.phone)) {
        ElMessage.warning({
          message: "请输入合法的手机号!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      sendSms(phoneForm.phone).then(
        (res) => {
          // console.log(res);
          if (res.data.code === 200) {
            ElMessage.success({
              message: "发送手机短信成功!",
              duration: 2000,
              center: true,
            });
          } else {
            ElMessage.error({
              message: "发送手机短信错误!!!",
              duration: 2000,
              center: true,
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );

      disabled.value = true;
      timer.value = setInterval(() => {
        if (interval.value > 0) {
          interval.value--;
        } else {
          interval.value = 60;
          disabled.value = false;
          clearInterval(timer.value);
          timer.value = null;
        }
      }, 1000);
    }

    function showCode(imageName: string) {
      const state = getNumberNanoid();
      websocket = thirdPartyConnect(function (frame) {
        console.log("Connected: " + frame);

        let loading = ElLoading.service({
          lock: true,
          text: "加载中",
          background: "rgba(0, 0, 0, 0.7)",
        });

        while (!websocket.connected) {}

        if (loading) {
          loading.close();
        }

        if (imageName === "alipay.png") {
          getAlipayUrl(state).then(
            (res) => {
              // console.log(res);
              thirdPartyWindow.value = window.open(res.data.data);
            },
            (err) => {
              console.log(err);
            }
          );
        }
        if (imageName === "wechat.png") {
          const url = router.resolve({
            name: "wechatQRCode",
            params: {
              id: state,
            },
          });
          thirdPartyWindow.value = window.open(url.href);
        }

        let messageID: string;
        websocket.subscribe(
          WS_THIRD_PARTY_PATH + "." + state,
          function (response) {
            // console.log(response);
            messageID =
              response.headers["message-id" as keyof typeof response.headers];
            const res = response.body;
            const message: Message = JSON.parse(res);

            //关闭三方登录窗口
            if (thirdPartyWindow.value) {
              thirdPartyWindow.value.close();
            }

            try {
              if (message.type === "THIRD_PARTY_SUCCESS") {
                loginByThirdParty(message.content).then(
                  (res) => {
                    // console.log(res);
                    if (res.data.code === 200) {
                      access_token.value = res.data.data.access_token;
                      refresh_token.value = res.data.data.refresh_token;
                      id.value = res.data.data.id;
                      username.value = res.data.data.username;
                      roleList.value = res.data.data.roleList;
                      image.value = message.content.image;

                      websocket.disconnect(() => {
                        console.log("Disconnect:");
                      });

                      //登录成功
                      ElNotification.success({
                        title: "欢迎回来",
                        duration: 2000,
                      });
                      router.push({ path: "/main/welcome" });
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              } else {
                messageForm.source = message.target;
                messageForm.target = message.source;
                messageForm.content = message.content;
                messageForm.time = getNowDate();

                ElMessageBox.confirm(`你是否要绑定已有账号?`, "提示", {
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  type: "warning",
                  draggable: true,
                })
                  .then(() => {
                    messageForm.type = "THIRD_PARTY_BINDING";
                    dialogVisible.value = true;
                  })
                  .catch(() => {
                    messageForm.type = "THIRD_PARTY_REGISTER";
                    registerUser();
                  });
              }
            } catch (error) {
              console.log(error);
              //出现异常不确认消息
              response.nack({ "message-id": messageID, res });
            }
          },
          { ack: "client", "x-queue-name": "thirdParty." + state }
        );
      });
    }

    function registerUser() {
      addUser(messageForm).then(
        (res) => {
          // console.log(res);
          if (res.data.code === 200) {
            access_token.value = res.data.data.access_token;
            refresh_token.value = res.data.data.refresh_token;
            id.value = res.data.data.id;
            username.value = res.data.data.username;
            roleList.value = res.data.data.roleList;
            image.value = messageForm.content.image;

            websocket.disconnect(() => {
              console.log("Disconnect:");
            });

            ElMessage.success({
              message: "账号初始密码为123456, 记得修改密码!",
              duration: 0,
              showClose: true,
              center: true,
            });

            //登录成功
            ElNotification.success({
              title: "欢迎回来",
              duration: 2000,
            });
            router.push({ path: "/main/welcome" });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    const bindingUserFunction = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          messageForm.content.username = bingdingUserForm.username;
          messageForm.content.password = bingdingUserForm.password;
          const res = await bindingUser(messageForm).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                access_token.value = res.data.data.access_token;
                refresh_token.value = res.data.data.refresh_token;
                id.value = res.data.data.id;
                username.value = res.data.data.username;
                roleList.value = res.data.data.roleList;

                return true;
              }
              return false;
            },
            (err) => {
              console.log(err);
              return false;
            }
          );

          if (res) {
            getUserByUsername(username.value).then(
              (res) => {
                if (res.data.code === 200) {
                  image.value = res.data.data.image;

                  websocket.disconnect(() => {
                    console.log("Disconnect:");
                  });

                  //登录成功
                  ElNotification.success({
                    title: "欢迎回来",
                    duration: 2000,
                  });
                  router.push({ path: "/main/welcome" });
                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    return {
      imageList,
      activeName,
      threePartyList,
      userFormRef,
      userForm,
      ...toRefs(userForm),
      userRules,
      phoneFormRef,
      phoneForm,
      ...toRefs(phoneForm),
      phoneRules,
      timer,
      interval,
      disabled,
      dialogVisible,
      messageForm,
      bingdingUserFormRef,
      bingdingUserForm,
      bingdingUserFormRules,
      showCode,
      submitUserForm,
      resetForm,
      submitPhoneForm,
      sendCodeFunction,
      bindingUserFunction,
    };
  },
  mounted() {},
});
</script>
<style lang="less" scoped>
h1 {
  margin-top: 0px;
  font-size: 21px;
  color: #409eff;
}

.el-container {
  margin-top: 90px;
  padding: 20px;

  .el-main {
    min-height: 400px !important;

    :deep(.box-card) {
      height: 430px;

      .el-card__header {
        padding: 0px;
      }

      .el-card__body {
        margin-top: 20px;
        padding: 0px 40px;

        .el-tabs {
          width: 90%;

          .el-icon {
            color: #67c23a;
          }

          .form {
            margin-top: 20px;

            .el-form-item {
              margin-bottom: 20px;
            }

            .code {
              width: 120px;
            }

            .btn_send {
              font-family: "Hiragino Sans GB";
              margin-left: 23px;
              width: 50px;
              height: 30px;
            }

            .captcha {
              margin-bottom: 20px;
            }
          }
        }

        .el-avatar {
          background-color: #fff;
          margin-top: 10px;
          margin-right: 10px;
        }
      }

      .el-tabs__content {
        width: 100%;
      }

      .otherInfo {
        position: absolute;
        left: 40%;
        bottom: 10px;
      }
    }
  }
}
</style>