<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">添加权限信息</h1>
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
      <el-col :span="18">
        <el-form-item label="权限路径" prop="path">
          <el-input class="path" v-model="path" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="权限描述" prop="description">
          <el-input
            class="description"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="description"
            :show-word-limit="true"
            resize="none"
            maxlength="200"
            type="textarea"
          />
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
import PathForm from "@/type/addPath";
import { addPath } from "@/request/addPathApi";
export default defineComponent({
  name: "addPath",
  setup(props) {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: PathForm = reactive({
      path: "",
      description: "",
    });

    const rules = reactive<FormRules>({
      path: [
        {
          required: true,
          message: "请输入权限路径",
          trigger: "blur",
        },
        {
          min: 1,
          max: 255,
          message: "权限路径长度必须在1~255之间",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "请输入权限描述",
          trigger: "blur",
        },
        {
          min: 1,
          max: 255,
          message: "权限描述长度必须在1~255之间",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (ruleForm.path.indexOf("/") === -1) {
            ElMessage.warning({
              message: "权限路径格式不正确!!!",
              duration: 2000,
              center: true,
            });
            return;
          }
          addPath(ruleForm).then(
            (res) => {
              //   console.log(res);
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "添加权限信息成功!",
                  duration: 2000,
                  center: true,
                });
                //重置表单
                ruleForm.path = "";
                ruleForm.description = "";
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "该权限路径名已存在, 添加权限信息失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加权限信息失败!!!",
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
  margin-bottom: 40px;
}

.form {
  .el-row {
    margin-bottom: 15px;
  }

  .path {
    width: 300px;
  }

  .description {
    width: 500px;
  }
}
</style>