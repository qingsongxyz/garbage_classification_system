<template>
  <el-row justify="center">
    <el-col :span="6">
      <h1 class="title">添加垃圾信息</h1>
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
        <el-form-item label="垃圾名称" prop="name">
          <el-input class="name" v-model="name" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="垃圾分类" prop="category">
          <el-select v-model="categoryId" placeholder="请选择分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="垃圾单位" prop="unit">
          <el-input class="unit" v-model="unit" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item label="每单位积分" prop="score">
          <el-input-number
            :precision="0"
            @keydown="inputLimit"
            v-model="score"
            :min="1"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row justify="center">
      <el-col :span="18">
        <el-form-item required label="分类图像">
          <Upload type="garbage" @setImage="setImage" ref="uploadRef" />
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
<script lang='ts'>
import { addGarbage } from "@/request/addGarbageApi";
import { getGarbageCategoryList } from "@/request/homeApi";
import GarbageForm from "@/type/addGarbage";
import { GarbageCategory } from "@/type/home";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import Upload from "../components/UploadImage.vue";
export default defineComponent({
  name: "addGarbage",
  components: { Upload },
  setup() {
    const uploadRef = ref();
    const categoryList: GarbageCategory[] = reactive([]);
    const ruleFormRef = ref<FormInstance>();
    const ruleForm: GarbageForm = reactive({
      name: "",
      categoryId: 0,
      unit: "",
      score: 0,
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
          message: "垃圾名称长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      categoryId: [
        {
          required: true,
          message: "请选择垃圾所属分类",
          trigger: "change",
        },
      ],
      unit: [
        {
          required: true,
          message: "请输入垃圾的单位",
          trigger: "blur",
        },
        {
          min: 1,
          max: 10,
          message: "垃圾单位长度必须在1~50之间",
          trigger: "blur",
        },
      ],
      score: [
        {
          required: true,
          message: "请输入垃圾每单位的积分",
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

          addGarbage(ruleForm).then(
            (res) => {
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "添加垃圾成功!",
                  duration: 2000,
                  center: true,
                });
                //重置表单
                ruleForm.name = "";
                ruleForm.unit = "";
                ruleForm.score = 0;
                ruleForm.image = "";
              } else if (res.data.code === 490) {
                ElMessage.warning({
                  message: "该垃圾名称已存在, 添加垃圾失败!!!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.error({
                  message: "添加垃圾失败!!!",
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
    getGarbageCategoryList().then(
      (res) => {
        // console.log(this.categoryList);
        const data: GarbageCategory[] = res.data.data;
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
<style lang='less' scoped>
h1 {
  font-size: 21px;
  color: #409eff;
}

.form {
  .name {
    width: 300px;
  }

  .unit {
    width: 300px;
  }
}
</style>