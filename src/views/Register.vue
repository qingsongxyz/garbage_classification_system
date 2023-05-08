<template>
  <el-row justify="center">
    <el-col :span="12">
      <el-steps
        align-center
        :active="currentStep"
        process-status="finish"
        finish-status="success"
      >
        <el-step title="填写账号密码" />
        <el-step title="填写用户信息" description="(可跳过)" />
        <el-step title="注册成功" />
      </el-steps>
    </el-col>
  </el-row>

  <div class="register" v-if="currentStep === 0">
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      status-icon
      :rules="registerRules"
      label-width="120px"
      class="form"
    >
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="账号" prop="username">
            <el-input v-model="username" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="密码" prop="password">
            <el-input v-model="password" type="password" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model="confirmPwd" type="password" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="10" :push="2">
          <Captcha class="captcha" />
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="12">
          <el-form-item>
            <el-button
              type="primary"
              @click="submitRegisterForm(registerFormRef)"
              >下一步</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-link href="/login" :underline="false">已有账号?去登录</el-link>
  </div>

  <div class="userInfo" v-else-if="currentStep === 1">
    <el-form
      ref="userFormRef"
      :model="userForm"
      status-icon
      label-width="120px"
      :rules="userRules"
      class="form"
    >
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="年龄" prop="age">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="age"
              :min="1"
              :max="120"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input class="email" v-model="email" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="手机号" prop="phone">
            <el-input class="phone" v-model="phone" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item label="个性签名" prop="signature">
            <el-input
              class="signature"
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="signature"
              :show-word-limit="true"
              resize="none"
              maxlength="1000"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="11">
          <el-form-item>
            <el-button type="primary" @click="submitUserForm(userFormRef)"
              >下一步</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

  <div class="result" v-else-if="currentStep === 2">
    <el-result icon="success" title="注册成功">
      <template #extra>
        <el-button @click="goToLogin" type="success">login</el-button>
      </template>
    </el-result>
  </div>
</template>
<script lang="ts">
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import { RegisterForm, UserInfoForm } from "@/type/register";
import Captcha from "@/components/Captcha.vue";
import useCaptchaStore from "@/store/captcha";
import { storeToRefs } from "pinia";
import { emailRegex, phoneRegex } from "@/util/regex";
import { register } from "@/request/registerApi";
import { useRouter } from "vue-router";
import { UserForm } from "@/type/personal";
export default defineComponent({
  name: "register",
  components: { Captcha },
  setup(props) {
    const currentStep = ref(0);

    const registerFormRef = ref<FormInstance>();
    const registerForm: RegisterForm = reactive({
      username: "",
      password: "",
      confirmPwd: "",
    });

    const registerRules = reactive<FormRules>({
      username: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
        { min: 6, max: 20, message: "账号长度必须在6~20之间", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 6, max: 30, message: "密码长度必须在6~30之间", trigger: "blur" },
      ],
      confirmPwd: [
        {
          required: true,
          message: "请输入确认密码",
          trigger: "blur",
        },
        {
          min: 6,
          max: 30,
          message: "确认密码长度必须在6~30之间",
          trigger: "blur",
        },
      ],
    });

    const captchaStore = useCaptchaStore();
    const { captchaObject, captchaResult } = storeToRefs(captchaStore);

    const router = useRouter();

    const submitRegisterForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //   console.log("submit!");
          if (registerForm.password !== registerForm.confirmPwd) {
            ElMessage.warning({
              message: "两次输入的密码不一致!!!",
              duration: 2000,
              center: true,
            });
            return;
          }

          if (Object.keys(captchaResult.value).length === 0) {
            ElMessage.warning({
              message: "请先进行验证!",
              duration: 2000,
              center: true,
            });
            return;
          }

          currentStep.value = 1;
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const userFormRef = ref<FormInstance>();
    const userForm: UserForm = reactive({
      age: 0,
      gender: "",
      email: "",
      phone: "",
      signature: "",
    });

    const userRules = reactive<FormRules>({
      email: [
        { pattern: emailRegex, message: "请输入合法的邮箱", trigger: "blur" },
      ],
      phone: [
        { pattern: phoneRegex, message: "请输入合法的手机号", trigger: "blur" },
      ],
    });

    const submitUserForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //   console.log("submit!");
          const u: UserInfoForm = {
            username: registerForm.username,
            password: registerForm.password,
          };

          if (userForm.age !== 0) {
            u.age = userForm.age;
          }

          if (userForm.gender !== "") {
            u.gender = userForm.gender;
          }

          if (userForm.email !== "") {
            u.email = userForm.email;
          }

          if (userForm.phone !== "") {
            u.phone = userForm.phone;
          }

          if (userForm.signature !== "") {
            u.signature = userForm.signature;
          }

          register(u, captchaResult.value).then(
            (res) => {
              // console.log(res);
              if (res.data.code === 200) {
                currentStep.value = 2;
              } else if (res.data.code === 409) {
                currentStep.value = 0;
                ElMessage.warning({
                  message: "用户名已存在, 注册失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                currentStep.value = 0;
                ElMessage.warning({
                  message: "注册失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
              //重置验证码
              captchaObject.value.reset();
              captchaStore.$reset();
            },
            (err) => {
              currentStep.value = 0;
              console.log(err);
            }
          );
        } else {
          console.log("error submit!", fields);
        }
      });
    };

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

    function goToLogin() {
      router.push({ path: "/login" });
    }

    return {
      currentStep,
      registerFormRef,
      registerForm,
      ...toRefs(registerForm),
      registerRules,
      userFormRef,
      userForm,
      ...toRefs(userForm),
      userRules,
      submitRegisterForm,
      submitUserForm,
      inputLimit,
      goToLogin,
    };
  },
});
</script>
<style lang="less" scoped>
.el-steps {
  margin-top: 100px;
  margin-bottom: 40px;
}

.form {
  .el-form-item {
    margin-bottom: 25px;

    .el-button {
      width: 370px;
    }
  }

  .el-input {
    width: 350px;
  }

  .captcha {
    width: 300px;
    margin-bottom: 25px;
  }
}
</style>