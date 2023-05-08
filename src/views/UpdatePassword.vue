<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">修改密码</h1>
    </el-col>
  </el-row>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="form"
    size="default"
    status-icon
  >
    <el-row justify="center">
      <el-col :span="13">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="oldPwd" show-password clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="13">
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="newPwd" show-password clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="13">
        <el-form-item label="再次输入" prop="pwdAgain">
          <el-input v-model="pwdAgain" show-password clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="6">
        <Captcha class="captcha" />
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="10">
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >添加</el-button
          >
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Captcha from "@/components/Captcha.vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import UpdatePasswordForm from "@/type/updatePassword";
import { updatePwd } from "@/request/updatePasswordApi";
import useCaptchaStore from "@/store/captcha";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "updatePassword",
  components: { Captcha },
  setup(props) {
    const captchaStore = useCaptchaStore();
    const { captchaObject, captchaResult } = storeToRefs(captchaStore);
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: UpdatePasswordForm = reactive({
      id: 117601196511233,
      oldPwd: "",
      newPwd: "",
      pwdAgain: "",
    });

    const rules = reactive<FormRules>({
      oldPwd: [
        {
          required: true,
          message: "请输入旧密码",
          trigger: "blur",
        },
        {
          min: 1,
          max: 60,
          message: "旧密码长度必须在1~60之间",
          trigger: "blur",
        },
      ],
      newPwd: [
        {
          required: true,
          message: "请输入新密码",
          trigger: "blur",
        },
        {
          min: 1,
          max: 60,
          message: "新密码长度必须在1~60之间",
          trigger: "blur",
        },
      ],
      pwdAgain: [
        {
          required: true,
          message: "请再次输入新密码",
          trigger: "blur",
        },
        {
          min: 1,
          max: 60,
          message: "新密码长度必须在1~60之间",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (Object.keys(captchaResult.value).length === 0) {
            ElMessage.warning({
              message: "请先进行验证!",
              duration: 2000,
              center: true,
            });
            return;
          }
          if (ruleForm.newPwd !== ruleForm.pwdAgain) {
            ElMessage.warning({
              message: "两次输入的密码不一致!",
              duration: 2000,
              center: true,
            });
            return;
          }

          updatePwd(ruleForm, captchaResult.value).then(
            (res) => {
              //   console.log(res);
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "修改密码成功!",
                  duration: 2000,
                  center: true,
                });
                ruleForm.oldPwd = "";
                ruleForm.newPwd = "";
                ruleForm.pwdAgain = "";
              } else {
                ElMessage.error({
                  message: "修改密码失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );

          //重置验证码
          captchaObject.value.reset();
          captchaStore.$reset();
        } else {
          console.log("error submit!", fields);
        }
      });
    }

    function resetForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      formEl.resetFields();
      captchaObject.value.reset();
    }

    return {
      ruleFormRef,
      ruleForm,
      ...toRefs(ruleForm),
      rules,
      submitForm,
      resetForm,
    };
  },
});
</script>
<style lang="less" scoped>
h1 {
  font-size: 21px;
  color: #409eff;
  margin-top: 60px;
  margin-bottom: 30px;
}

.form {
  .el-form-item {
    margin-bottom: 30px;
    .el-input {
      width: 300px;
    }
  }

  .captcha {
    margin-bottom: 20px;
  }
}
</style>