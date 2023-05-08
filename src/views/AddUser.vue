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
        <el-form-item label="用户名" prop="username">
          <el-input class="username" v-model="username" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="14">
        <el-form-item label="角色" prop="roleId" required>
          <el-select
            class="role"
            clearable
            v-model="role"
            placeholder="请选择角色"
            @change="changeRole"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role"
              :value="item.role"
            >
              <span>{{ item.role }}</span>
            </el-option>
          </el-select>
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
import { getRoleList } from "@/request/roleListApi";
import { addUser } from "@/request/addUserApi";
import UserForm from "@/type/addUser";
import Role from "@/type/roleList";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
export default defineComponent({
  name: "addUser",
  setup(props) {
    const ruleFormRef = ref<FormInstance>();
    const roleList: Role[] = reactive([]);
    const role = ref("");
    const ruleForm: UserForm = reactive({
      username: "",
      roleId: 1,
    });

    const rules = reactive<FormRules>({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "用户名长度必须在1~50之间",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          addUser(ruleForm).then(
            (res) => {
              //   console.log(res);
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "添加用户成功!",
                  duration: 2000,
                  center: true,
                });

                ruleForm.username = "";
                ruleForm.roleId = 1;
                role.value = "";
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "用户名已存在, 添加用户失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加用户失败!!!",
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
      role.value = "";
    }

    function changeRole() {
      roleList.forEach((r) => {
        if (r.role === role.value) {
          ruleForm.roleId = r.id;
        }
      });
    }

    return {
      ruleFormRef,
      ruleForm,
      role,
      roleList,
      ...toRefs(ruleForm),
      rules,
      submitForm,
      resetForm,
      changeRole,
    };
  },
  mounted() {
    getRoleList().then(
      (res) => {
        // console.log(res);
        const data: Role[] = res.data.data;
        data.forEach((d) => {
          this.roleList.push(d);
        });
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
  margin-top: 30px;
  margin-bottom: 50px;
}

.form {
  .el-form-item {
    margin-bottom: 30px;
    .username {
      width: 350px;
    }

    .role {
      width: 200px;
    }
  }
}
</style>