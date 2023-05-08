<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">个人中心</h1>
    </el-col>
  </el-row>
  <el-image
    class="image"
    :src="ruleForm.image[0]"
    :previewSrcList="ruleForm.image"
    fit="cover"
    preview-teleported
  >
  </el-image>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-width="120px"
    class="form"
    size="default"
    status-icon
  >
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="用户名" prop="username">
          <el-input class="username" v-model="ruleForm.username" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="性别" prop="gender">
          <el-radio-group class="gender" v-model="ruleForm.gender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="年龄" prop="age">
          <el-input-number
            :precision="0"
            @keydown="inputLimit"
            v-model="ruleForm.age"
            :min="1"
            :max="120"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-show="ruleForm.email !== ''"
            class="email"
            v-model="ruleForm.email"
            clearable
          />
          <el-tooltip effect="dark" placement="right">
            <template #content>
              <span v-if="ruleForm.email === ''">绑定</span>
              <span v-else>更改</span>
            </template>
            <el-button
              @click="showDialog('email')"
              class="btn_email"
              type="success"
              circle
              ><el-icon><Message /></el-icon
            ></el-button>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-show="ruleForm.phone !== ''"
            class="phone"
            v-model="ruleForm.phone"
            clearable
          />
          <el-tooltip effect="dark" placement="right">
            <template #content>
              <span v-if="ruleForm.phone === ''">绑定</span>
              <span v-else>更改</span>
            </template>
            <el-button
              @click="showDialog('phone')"
              class="btn_phone"
              type="info"
              circle
              ><el-icon><Iphone /></el-icon
            ></el-button>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="用户头像">
          <Upload type="user" @setImage="setImage" ref="uploadRef" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="个性签名" prop="signature">
          <el-input
            class="signature"
            :autosize="{ minRows: 4, maxRows: 10 }"
            v-model="ruleForm.signature"
            :show-word-limit="true"
            resize="none"
            maxlength="1000"
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="14">
        <el-form-item>
          <el-button class="saveButton" type="primary" @click="submitForm"
            >保存</el-button
          >
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-dialog
    @close="close"
    v-model="dialogVisible"
    width="35%"
    center
    align-center
  >
    <el-row justify="center">
      <el-col :span="7">
        <h1 class="title" v-if="type === 'email'">绑定邮箱</h1>
        <h1 class="title" v-else>绑定手机号</h1>
      </el-col>
    </el-row>
    <el-form
      class="form"
      ref="emailFormRef"
      v-if="type === 'email'"
      :model="emailBinding"
      :rules="emailRules"
      label-width="80px"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="邮箱" prop="emailBinding.email">
            <el-input class="email" v-model="emailBinding.email" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="验证码" prop="emailBinding.code">
            <el-input class="code" v-model="emailBinding.code" clearable />
            <el-button
              @click="sendCodeFunction(emailFormRef)"
              :disabled="disabled"
              class="btn_send"
              type="success"
              ><span v-if="!disabled">发送</span
              ><span v-else>{{ interval }}s</span></el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item>
            <el-button
              class="btn_operator"
              type="primary"
              @click="binding(emailFormRef)"
            >
              确定
            </el-button>
            <el-button class="btn_operator" @click="close">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form
      class="form"
      ref="phoneFormRef"
      v-else
      :model="phoneBinding"
      :rules="phoneRules"
      label-width="80px"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="手机号" prop="phoneBinding.phone">
            <el-input class="phone" v-model="phoneBinding.phone" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item label="验证码" prop="phoneBinding.code">
            <el-input class="code" v-model="phoneBinding.code" clearable />
            <el-button
              @click="sendCodeFunction(phoneFormRef)"
              :disabled="disabled"
              class="btn_send"
              type="success"
              ><span v-if="!disabled">发送</span
              ><span v-else>{{ interval }}s</span></el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="20">
          <el-form-item>
            <el-button
              class="btn_operator"
              type="primary"
              @click="binding(phoneFormRef)"
            >
              确定
            </el-button>
            <el-button class="btn_operator" @click="close">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import Upload from "../components/UploadImage.vue";
import { Email, Sms, UserForm } from "@/type/personal";
import {
  bindingEmail,
  bindingPhone,
  getUserById,
  mail,
  sendSms,
  updateUser,
} from "@/request/personalApi";
import { emailRegex, phoneRegex } from "@/util/regex";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "personal",
  components: { Upload },
  setup(props) {
    const uploadRef = ref();
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: UserForm = reactive({
      username: "",
      gender: "",
      age: 1,
      image: [],
      email: "",
      phone: "",
      signature: "",
    });

    const userStore = useUserStore();
    const { id, username, image } = storeToRefs(userStore);

    const type = ref("");

    const emailBinding: Email = reactive({
      userId: id.value,
      username,
      email: "",
      code: "",
    });

    const emailFormRef = ref<FormInstance>();

    const phoneBinding: Sms = reactive({
      userId: id.value,
      phone: "",
      code: "",
    });

    const phoneFormRef = ref<FormInstance>();

    const emailRules = reactive<FormRules>({
      "emailBinding.email": [
        { pattern: emailRegex, message: "请输入合法的邮箱", trigger: "blur" },
      ],
    });

    const phoneRules = reactive<FormRules>({
      "phoneBinding.phone": [
        { pattern: phoneRegex, message: "请输入合法的手机号", trigger: "blur" },
      ],
    });

    const interval = ref(60);
    const timer = ref();
    const disabled = ref(false);

    let dialogVisible = ref(false);

    function showDialog(param: string) {
      emailBinding.email = "";
      emailBinding.code = "";
      phoneBinding.phone = "";
      phoneBinding.code = "";
      type.value = param;
      dialogVisible.value = true;
    }

    function submitForm() {
      //上传图片
      uploadRef.value?.submit();

      const p = JSON.parse(JSON.stringify(ruleForm));

      p.id = id.value;
      if (typeof p.image !== "string") {
        p.image = p.image?.pop();
      }
      updateUser(p).then(
        (res) => {
          // console.log(res);
          if (res.data.code === 200) {
            image.value = p.image;
            ElMessage.success({
              message: "修改个人信息成功!!!",
              duration: 2000,
              center: true,
            });
          } else {
            ElMessage.error({
              message: "修改个人信息失败!!!",
              duration: 2000,
              center: true,
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function setImage(image: string) {
      ruleForm.image = image;
      if (typeof ruleForm.image === "string") {
        ruleForm.image = new Array(ruleForm.image);
      }
    }

    function inputLimit(e: any) {
      if (
        e.key === "e" ||
        e.key === "+" ||
        e.key === "-" ||
        e.key === "Shift"
      ) {
        e.returnValue = false;
        return false;
      }
      return true;
    }

    const binding = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (type.value === "email" && emailBinding.email === "") {
            ElMessage.warning({
              message: "请输入邮箱!!!",
              duration: 2000,
              center: true,
            });
            return;
          }
          if (type.value === "phone" && phoneBinding.phone === "") {
            ElMessage.warning({
              message: "请输入手机号!!!",
              duration: 2000,
              center: true,
            });
            return;
          }
          if (
            (type.value === "email" && emailBinding.code === "") ||
            (type.value === "phone" && phoneBinding.code === "")
          ) {
            ElMessage.warning({
              message: "请输入验证码!!!",
              duration: 2000,
              center: true,
            });
            return;
          }

          if (type.value === "email") {
            bindingEmail(emailBinding).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  ElMessage.success({
                    message: "绑定邮箱成功!",
                    duration: 2000,
                    center: true,
                  });
                  ruleForm.email = emailBinding.email;
                  emailBinding.email = "";
                  close();
                } else {
                  ElMessage.error({
                    message: "绑定邮箱失败!!!",
                    duration: 2000,
                    center: true,
                  });
                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
          if (type.value === "phone") {
            bindingPhone(phoneBinding).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  ElMessage.success({
                    message: "绑定手机号成功!",
                    duration: 2000,
                    center: true,
                  });
                  ruleForm.phone = phoneBinding.phone;
                  phoneBinding.phone = "";
                  close();
                } else {
                  ElMessage.error({
                    message: "绑定手机号失败!!!",
                    duration: 2000,
                    center: true,
                  });
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

    const sendCodeFunction = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (type.value === "email") {
            mail(emailBinding).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  ElMessage.success({
                    message: "发送邮箱验证码成功!",
                    duration: 2000,
                    center: true,
                  });
                } else {
                  ElMessage.error({
                    message: "发送邮箱验证码失败!!!",
                    duration: 2000,
                    center: true,
                  });
                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
          if (type.value === "phone") {
            sendSms(phoneBinding.phone).then(
              (res) => {
                // console.log(res);
                if (res.data.code === 200) {
                  ElMessage.success({
                    message: "发送手机验证码成功!",
                    duration: 2000,
                    center: true,
                  });
                } else {
                  ElMessage.error({
                    message: "发送手机验证码失败!!!",
                    duration: 2000,
                    center: true,
                  });
                }
              },
              (err) => {
                console.log(err);
              }
            );
          }

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
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    function close() {
      if (timer.value != null) {
        interval.value = 60;
        disabled.value = false;
        clearInterval(timer.value);
        timer.value = null;
      }
      dialogVisible.value = false;
    }

    return {
      id,
      uploadRef,
      ruleFormRef,
      ruleForm,
      type,
      emailBinding,
      emailFormRef,
      phoneBinding,
      phoneFormRef,
      emailRules,
      phoneRules,
      timer,
      interval,
      disabled,
      dialogVisible,
      showDialog,
      submitForm,
      setImage,
      inputLimit,
      binding,
      sendCodeFunction,
      close,
    };
  },
  mounted() {
    getUserById(this.id || 1).then(
      (res) => {
        // console.log(res);
        this.ruleForm.username = res.data.data.username;
        this.ruleForm.gender = res.data.data.gender;
        this.ruleForm.age = res.data.data.age;
        if (typeof res.data.data.image === "string") {
          this.ruleForm.image = new Array(res.data.data.image);
        }
        if (typeof this.ruleForm.image === "string") {
          this.ruleForm.image = new Array(this.ruleForm.image);
        }
        if (this.ruleForm.image === null) {
          this.ruleForm.image =
            "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/user.png";
        }
        this.ruleForm.email = res.data.data.email;
        this.ruleForm.phone = res.data.data.phone;
        this.ruleForm.signature = res.data.data.signature;
        // console.log(this.ruleForm);
      },
      (err) => {
        console.log(err);
      }
    );
  },
});
</script>
<style lang="less" scoped>
h1 {
  font-size: 21px;
  color: #409eff;
  margin-bottom: 30px;
}

.el-dialog .title {
  margin-top: 0px;
}

.image {
  width: 160px;
  height: 160px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  position: absolute;
  right: 10%;
  top: 23%;
  z-index: 1;
}

.form {
  .username {
    width: 250px;
  }

  .email {
    width: 200px;
  }

  .btn_email {
    margin-left: 10px;
  }

  .phone {
    width: 200px;
  }

  .btn_phone {
    margin-left: 10px;
  }

  .signature {
    width: 500px;
  }

  .saveButton {
    width: 300px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .code {
    width: 130px;
  }

  .btn_send {
    font-family: "Hiragino Sans GB";
    margin-left: 20px;
    width: 50px;
    height: 30px;
  }

  .btn_operator {
    margin-left: 20px;
    width: 70px;
  }
}
</style>