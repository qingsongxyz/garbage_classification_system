<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">添加角色信息</h1>
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
      <el-col :span="14">
        <el-form-item label="角色英文名" prop="role">
          <el-input v-model="role" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="14">
        <el-form-item label="角色中文名" prop="name">
          <el-input v-model="name" clearable />
        </el-form-item>
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
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import RoleForm from "@/type/addRole";
import { addRole } from "@/request/addRoleApi";
export default defineComponent({
  name: "addRole",
  setup(props) {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: RoleForm = reactive({
      role: "",
      name: "",
    });

    const rules = reactive<FormRules>({
      role: [
        {
          required: true,
          message: "请输入角色英文名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "角色英文名长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      name: [
        {
          required: true,
          message: "请输入角色中文名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "角色中文名长度必须在1~50之间",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          addRole(ruleForm).then(
            (res) => {
              //   console.log(res);
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "添加角色成功!",
                  duration: 2000,
                  center: true,
                });
                ruleForm.role = "";
                ruleForm.name = "";
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "该角色英文名已存在, 添加角色失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加角色失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          console.log("error submit!", fields);
        }
      });
    }

    function resetForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      formEl.resetFields();
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
  margin-top: 30px;
  margin-bottom: 50px;
}

.form {
  .el-row {
    margin-bottom: 20px;
  }
  .el-input {
    width: 350px;
  }
}
</style>