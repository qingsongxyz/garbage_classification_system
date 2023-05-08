<template>
  <el-upload
    v-model:file-list="imageList"
    ref="upload"
    class="upload"
    list-type="picture"
    :on-change="handleImage"
    :on-success="handleImageSuccess"
    :before-upload="getOssPolicy"
    :action="ossData.host"
    :data="ossData"
    accept=".jpg, .jpeg, .png,"
    :auto-upload="false"
  >
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">只能上传jpg/png文件,且不超过2M</div>
    </template>
  </el-upload>
</template>
<script lang='ts'>
import http from "@/request";
import {
  UploadFile,
  UploadFiles,
  UploadRawFile,
  ElMessage,
  UploadInstance,
  UploadUserFile,
} from "element-plus";
import { defineComponent, reactive, ref, onMounted } from "vue";
export default defineComponent({
  name: "uploadImage",
  props: ["image", "type"],
  emits: ["setImage"],
  setup(props, context) {
    const upload = ref<UploadInstance>();
    const ossData = reactive({
      key: "",
      OSSAccessKeyId: "",
      policy: "",
      Signature: "",
      host: "",
      dir: "",
    });

    let imageList: UploadUserFile[] = reactive([]);

    function getOssPolicy(rawFile: UploadRawFile) {
      if (rawFile.name === "") {
        ElMessage.warning({
          message: "请添加分类图片",
          duration: 2000,
          center: true,
        });
        return false;
      }

      return new Promise((resolve, reject) =>
        http.get("/gcs-third-party/oss/policy").then(
          (res) => {
            ossData.key = res.data.dir + props.type + "/" + `${rawFile.name}`;
            ossData.OSSAccessKeyId = res.data.accessId;
            ossData.policy = res.data.policy;
            ossData.Signature = res.data.signature;
            ossData.host = res.data.host;
            ossData.dir = res.data.dir + props.type;
            // console.log(ossData);
            resolve(true);
          },
          (err) => {
            console.log(err);
            reject(false);
          }
        )
      );
    }

    function handleImage(uploadFile: UploadFile, uploadFiles: UploadFiles) {
      // console.log(uploadFile, uploadFiles);
      const format =
        uploadFile.raw?.type == "image/jpeg" ||
        uploadFile.raw?.type == "image/jpg" ||
        uploadFile.raw?.type == "image/png";

      let isLt2M;
      if (uploadFile.raw?.size) {
        isLt2M = uploadFile.raw?.size / 1024 / 1024 < 2;
      }
      if (!format || !isLt2M) {
        ElMessage.warning({
          message: "只能上传jpg, jpeg, png, 且图片大小不能超过2MB!",
          duration: 2000,
          center: true,
        });
        uploadFiles.splice(0, 1);
      } else {
        //修改父组件image数据
        context.emit(
          "setImage",
          "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/" +
            props.type +
            "/" +
            uploadFile.name
        );
      }

      if (uploadFiles.length > 1) {
        uploadFiles.splice(0, 1);
      }
      return format && isLt2M;
    }

    function handleImageSuccess(
      response: any,
      uploadFile: UploadFile,
      uploadFiles: UploadFiles
    ) {
      //上传图片成功，删除图片显示
      uploadFiles.splice(0, 1);
      return;
    }

    function submit() {
      upload.value?.submit();
    }

    function clearFiles() {
      upload.value?.clearFiles();
    }

    function showImage(url: string) {
      const image = {
        name: url.substring(url.lastIndexOf("/") + 1, url.length),
        url,
      };
      imageList[0] = image;
    }

    onMounted(() => {
      if (props.image) {
        imageList.unshift({
          name: props.image.substring(
            props.image.lastIndexOf("/") + 1,
            props.image.length
          ),
          url: props.image,
        });
      }
    });

    return {
      upload,
      ossData,
      imageList,
      getOssPolicy,
      handleImage,
      handleImageSuccess,
      submit,
      clearFiles,
      showImage,
    };
  },
});
</script>
<style lang='less' scoped>
.upload {
  padding: 20px;
  width: 380px;
  min-height: 120px;
  border: 1px solid #dcdfe6;
  border-radius: var(--el-border-radius-base);
  text-align: center;
}
</style>