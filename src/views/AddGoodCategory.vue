<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">添加商品种类</h1>
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
      <el-col :span="12">
        <el-form-item label="商品种类名称" prop="category">
          <el-input class="category" v-model="category" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="9">
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
import { addGoodCategory } from "@/request/addGoodCategoryApi";
import GoodCategoryForm from "@/type/addGoodCategory";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
export default defineComponent({
  name: "addGoodCategory",
  setup(props) {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: GoodCategoryForm = reactive({
      category: "",
    });

    const rules = reactive<FormRules>({
      category: [
        {
          required: true,
          message: "请输入商品分类名称",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "商品分类名称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          addGoodCategory(ruleForm).then(
            (res) => {
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "添加商品分类成功!!!",
                  duration: 2000,
                  center: true,
                });
                //重置表单
                ruleForm.category = "";
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "该分类名称已存在, 添加分类失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加商品分类失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err.message);
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
      ...toRefs(ruleForm),
      ruleForm,
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
}

.form {
  .el-row {
    margin-top: 15px;
  }
  .category {
    width: 300px;
  }
}
</style>
