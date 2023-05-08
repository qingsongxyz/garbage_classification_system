<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">添加分类信息</h1>
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
        <el-form-item label="分类名称" prop="name">
          <el-input class="name" v-model="name" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item required label="分类图像">
          <Upload type="category" @setImage="setImage" ref="uploadRef" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="分类描述" prop="description">
          <el-input
            class="description"
            :autosize="{ minRows: 4, maxRows: 10 }"
            v-model="description"
            :show-word-limit="true"
            resize="none"
            maxlength="1000"
            type="textarea"
          />
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
<script lang='ts'>
import { addGarbageCategory } from "@/request/addGarbageCategoryApi";
import GarbageCategoryForm from "@/type/addGarbageCategory";
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadInstance,
} from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import Upload from "../components/UploadImage.vue";
export default defineComponent({
  name: "addGarbageCategory",
  components: { Upload },
  setup() {
    const uploadRef = ref();
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: GarbageCategoryForm = reactive({
      name: "",
      description: "",
      image: "",
    });

    const rules = reactive<FormRules>({
      name: [
        {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "垃圾分类名称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "请输入分类简介",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //上传图片
          uploadRef.value?.submit();

          addGarbageCategory(ruleForm).then(
            (res) => {
              if (res.data.code === 200) {
                ElMessage.success({
                  message: res.data.message,
                  duration: 2000,
                  center: true,
                });
                //重置表单
                ruleForm.name = "";
                ruleForm.description = "";
                ruleForm.image = "";
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "该垃圾分类名称已存在, 添加分类失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加分类失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err.data);
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
      uploadRef.value?.clearFiles();
    }

    function setImage(image: string) {
      ruleForm.image = image;
    }

    return {
      uploadRef,
      ruleFormRef,
      ruleForm,
      ...toRefs(ruleForm),
      rules,
      submitForm,
      resetForm,
      setImage,
    };
  },
});
</script>
<style lang='less' scoped>
.title {
  font-size: 21px;
  color: #409eff;
}

.form {
  .name {
    width: 300px;
  }

  .description {
    width: 500px;
  }
}
</style>