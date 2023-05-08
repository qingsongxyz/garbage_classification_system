<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">添加商品信息</h1>
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
        <el-form-item label="商品名称" prop="name">
          <el-input class="name" v-model="name" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="垃圾分类" prop="categoryId">
          <el-select
            v-model="categoryId"
            placeholder="请选择分类"
            class="categoryId"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.category"
              :value="item.id"
            >
              <span>{{ item.category }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="商品所需积分" prop="score">
          <el-input-number
            :precision="0"
            @keydown="inputLimit"
            v-model="score"
            :min="0"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item required label="商品图像">
          <UploadImage type="good" @setImage="setImage" ref="uploadRef" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="商品库存" prop="storage.storage">
          <el-input-number
            :precision="0"
            @keydown="inputLimit"
            v-model="storage.storage"
            :min="0"
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
import { addGood } from "@/request/addGoodApi";
import { getAllGoodCategoryList } from "@/request/goodCategoryListApi";
import { GoodForm } from "@/type/addGood";
import GoodCategory from "@/type/goodCategoryList";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import UploadImage from "../components/UploadImage.vue";
export default defineComponent({
  name: "addGood",
  setup(props) {
    const uploadRef = ref();
    const categoryList: GoodCategory[] = reactive([]);
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: GoodForm = reactive({
      name: "",
      categoryId: 0,
      image: "",
      score: 0,
      storage: {
        storage: 0,
      },
    });

    const rules = reactive<FormRules>({
      name: [
        {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        {
          min: 1,
          max: 50,
          message: "商品名称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      categoryId: [
        {
          required: true,
          message: "请选择商品种类",
          trigger: "change",
        },
      ],
      storage: [
        {
          required: true,
          message: "请输入商品库存",
          trigger: "blur",
        },
      ],
    });

    async function submitForm(formEl: FormInstance | undefined) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          if (ruleForm.score === 0) {
            ElMessage.warning({
              message: "商品所需积分必须大于0!!!",
              duration: 2000,
              center: true,
            });
            return;
          }

          if (ruleForm.storage.storage === 0) {
            ElMessage.warning({
              message: "商品库存必须大于0!!!",
              duration: 2000,
              center: true,
            });
            return;
          }

          //上传图片
          uploadRef.value?.submit();

          addGood(ruleForm).then(
            (res) => {
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "添加商品成功!",
                  duration: 2000,
                  center: true,
                });
                //重置表单
                ruleForm.name = "";
                ruleForm.categoryId = 0;
                ruleForm.image = "";
                ruleForm.score = 0;
                ruleForm.storage.storage = 0;
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "该商品名称已存在, 添加商品失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加商品失败!!!",
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
      uploadRef.value?.clearFiles();
    }

    function setImage(image: string) {
      ruleForm.image = image;
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

    return {
      uploadRef,
      categoryList,
      ruleFormRef,
      ...toRefs(ruleForm),
      ruleForm,
      rules,
      submitForm,
      resetForm,
      setImage,
      inputLimit,
    };
  },
  mounted() {
    getAllGoodCategoryList().then(
      (res) => {
        const data: GoodCategory[] = res.data.data;
        // console.log(data);
        data.forEach((d) => {
          this.categoryList.push(d);
        });
        this.ruleForm.categoryId = data[0].id;
      },
      (err) => {
        console.log(err.message);
      }
    );
  },
});
</script>
<style lang="less" scoped>
h1 {
  font-size: 21px;
  color: #409eff;
}

.form {
  margin-top: 20px;
  .name {
    width: 280px;
  }
  .categoryId {
    width: 200px;
  }
}
</style>