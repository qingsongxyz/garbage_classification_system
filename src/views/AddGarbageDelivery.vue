<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">投递垃圾</h1>
    </el-col>
  </el-row>

  <el-row justify="center">
    <el-col :span="10">
      <el-tabs v-model="activeName" tab-position="bottom">
        <el-tab-pane label="图片" name="image">
          <el-popover
            placement="bottom"
            :width="152"
            effect="dark"
            trigger="hover"
            content="请上传投递垃圾图片"
          >
            <template #reference>
              <el-upload
                drag
                ref="importRef"
                :limit="1"
                :action="baseUrl + '/gcs-user/classify-rubbish/recognize/image'"
                :on-progress="handleImage"
                :on-success="handleSuccess"
                :on-error="(loading = false)"
                accept=".jpg, .jpeg, .png,"
                :show-file-list="false"
                :headers="headers"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">拖拽或 <em>点击上传</em></div>
                <template #tip>
                  <div class="el-upload__tip">jpg/png 格式 大小不能大于3M</div>
                </template>
              </el-upload>
            </template>
          </el-popover>
        </el-tab-pane>
        <el-tab-pane label="网址" name="url">
          <el-input
            v-model="url"
            placeholder="请输入投递垃圾图片url"
            type="text"
            @change="formatUrl"
            style="width: 300px; margin: 40px"
          >
            <template #append>
              <el-button class="btn_url" @click="uploadUrl">
                <el-icon><Upload /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

  <el-row justify="center">
    <el-col :span="24">
      <el-table
        v-loading="loading"
        element-loading-text="加载中"
        class="table"
        ref="tableRef"
        max-height="500px"
        stripe
        :data="garbageList"
        style="width: 100%"
      >
        <template #empty>
          <el-empty
            :image-size="90"
            description="空"
            style="padding-top: 10px; padding-bottom: 0px"
          />
        </template>
        <el-table-column
          prop="garbageId"
          label="垃圾编号"
          width="150"
          align="center"
        />
        <el-table-column
          prop="garbageName"
          label="垃圾名称"
          width="120"
          align="center"
        />
        <el-table-column prop="garbageImage" label="垃圾图片" align="center">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                style="width: 75px; height: 75px; margin-left: 10%"
                :src="scope.row.garbageImage[0]"
                :preview-src-list="scope.row.garbageImage"
                fit="cover"
                preview-teleported
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="garbageScore"
          label="每单位积分"
          width="70"
          align="center"
        />
        <el-table-column prop="count" width="190" label="单位" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.count"
              @keydown="inputLimit"
              :precision="1"
              :step="0.1"
              :min="1"
              style="width: 130px"
            />
            &nbsp;/&nbsp;{{ scope.row.garbageUnit }}
          </template>
        </el-table-column>
        <el-table-column label="垃圾总积分" width="70" align="center">
          <template #default="scope">
            {{ sum(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="classify"
          label="分类"
          width="150"
          align="center"
        >
          <template #default="scope">
            <el-select v-model="scope.row.classify" placeholder="请选择分类">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <el-button class="btn_delivery" @click="deliveryFunction" type="primary"
    >投递</el-button
  >
</template>
<script lang="ts">
import {
  addGarbageDelivery,
  recognizeUrl,
} from "@/request/addGarbageDeliveryApi";
import {
  GarbageDeliveryForm,
  GarbageDeliveryDetailsForm,
} from "@/type/addGarbageDelivery";
import {
  ElMessage,
  ElNotification,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProgressEvent,
} from "element-plus";
import { defineComponent, h, reactive, ref, toRefs } from "vue";
import http from "@/request/index";
import { Garbage, GarbageCategory } from "@/type/home";
import { getGarbageCategoryList } from "@/request/homeApi";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "addGarbageDelivery",
  setup(props) {
    const uploadVisible = ref(true);

    const garbageList: GarbageDeliveryDetailsForm[] = reactive([]);

    const activeName = ref("image");

    const uploadRef = ref<UploadInstance>();

    const url = ref("");

    const headers = ref();

    const baseUrl = ref(http.defaults.baseURL);

    const categoryList: GarbageCategory[] = reactive([]);

    const router = useRouter();

    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);

    const loading = ref(false);

    //计算每种垃圾投递的总积分
    function sum(g: GarbageDeliveryDetailsForm) {
      g.sum = (g.count || 0) * g.garbageScore;
      return g.sum;
    }

    function handleImage(
      evt: UploadProgressEvent,
      uploadFile: UploadFile,
      uploadFiles: UploadFiles
    ) {
      // console.log(uploadFile, uploadFiles);
      const format =
        uploadFile.raw?.type == "image/jpeg" ||
        uploadFile.raw?.type == "image/jpg" ||
        uploadFile.raw?.type == "image/png";

      let isLt3M;
      if (uploadFile.raw?.size) {
        isLt3M = uploadFile.raw?.size / 1024 / 1024 < 3;
      }
      if (!format || !isLt3M) {
        ElMessage.warning({
          message: "只能上传jpg, jpeg, png, 且图片大小不能超过3MB!",
          duration: 2000,
          center: true,
        });
        uploadFiles.splice(0, 1);
        return;
      }

      if (uploadFiles.length > 1) {
        uploadFiles.splice(0, 1);
      }

      loading.value = true;
    }

    function handleSuccess(
      response: any,
      uploadFile: UploadFile,
      uploadFiles: UploadFiles
    ) {
      // console.log(response, uploadFile);
      loading.value = false;
      uploadFiles.splice(0, 1);
      if (response.code === 200) {
        ElMessage.success({
          message: response.message,
          duration: 2000,
          center: true,
        });

        const garbage: Garbage = response.data;
        console.log(garbage);
        if (typeof garbage.image === "string") {
          garbage.image = new Array(garbage.image);
        }

        const flag = garbageList.filter((g) => g.id === garbage.id).length;
        if (flag === 0) {
          garbageList.push({
            garbageId: garbage.id,
            garbageName: garbage.name,
            garbageCategory: garbage.category,
            garbageUnit: garbage.unit,
            garbageScore: garbage.score,
            garbageImage: garbage.image,
            classify: "",
          });
        } else {
          ElMessage.warning({
            message: "投递垃圾已经在下表中!!!",
            duration: 2000,
            center: true,
          });
        }
      }
      if (response.code === 404) {
        ElMessage.warning({
          message: "该垃圾不存在于系统中, 请联系管理员进行处理!!!",
          duration: 2000,
          center: true,
        });
      }
      if (response.code === 500) {
        ElMessage.error({
          message: "垃圾分类图像识别失败!!!",
          duration: 2000,
          center: true,
        });
      }
    }

    function uploadUrl() {
      if (url.value === "") {
        ElMessage.warning({
          message: "请输入投递垃圾图片url !!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      loading.value = true;

      recognizeUrl(url.value).then(
        (res) => {
          // console.log(res);
          loading.value = false;
          url.value = "";
          if (res.data.code === 200) {
            ElMessage.success({
              message: res.data.message,
              duration: 2000,
              center: true,
            });
            const garbage: Garbage = res.data.data;
            console.log(garbage);
            if (typeof garbage.image === "string") {
              garbage.image = new Array(garbage.image);
            }

            const flag = garbageList.filter((g) => g.id === garbage.id).length;
            if (flag === 0) {
              garbageList.push({
                garbageId: garbage.id,
                garbageName: garbage.name,
                garbageCategory: garbage.category,
                garbageUnit: garbage.unit,
                garbageScore: garbage.score,
                garbageImage: garbage.image,
                classify: "",
              });
            } else {
              ElMessage.warning({
                message: "投递垃圾已经在下表中!!!",
                duration: 2000,
                center: true,
              });
            }
          }
          if (res.data.code === 404) {
            ElMessage.warning({
              message: "该垃圾不存在于系统中, 请联系管理员进行处理!!!",
              duration: 2000,
              center: true,
            });
          }
          if (res.data.code === 500) {
            ElMessage.error({
              message: "垃圾分类图像识别失败!!!",
              duration: 2000,
              center: true,
            });
          }
        },
        (err) => {
          loading.value = false;
          console.log(err);
        }
      );
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

    function formatUrl() {
      // console.log(url.value);
      const res = url.value.match(
        /(https?|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
      );
      if (res && res.length > 0) {
        url.value = res[0];
      } else {
        url.value = "";
      }
    }

    function deliveryFunction() {
      const address = router.currentRoute.value.query.address;
      if (address === null) {
        ElMessage.warning({
          message: "请先选择垃圾站进行投递!!!",
          duration: 2000,
          center: true,
        });
        router.push({
          name: "garbageStationMap",
        });
        return;
      }

      if (garbageList.length === 0) {
        ElMessage.warning({
          message: "请先上传投递垃圾图片!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      const count = garbageList.filter((g) => g.count === undefined);
      if (count.length !== 0) {
        ElMessage.warning({
          message: "请填写投递垃圾的数量!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      const classify = garbageList.filter((g) => g.classify === "");
      if (classify.length !== 0) {
        ElMessage.warning({
          message: "请填写投递垃圾的分类!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      let total = 0;

      garbageList.forEach((g) => {
        g.flag = g.garbageCategory == g.classify ? 0 : 1;
        let mark = 1;
        if (g.flag === 1) {
          mark = -1;
        }

        total += mark * (g.sum || 0);
      });

      const delivery: GarbageDeliveryForm = {
        userId: id.value,
        total,
        stationAddress: address.toString(),
        status: 0,
        garbageDeliveryDetailsList: garbageList,
      };

      if (total < 0) {
        delivery.status = 2;
      }

      addGarbageDelivery(delivery).then(
        (res) => {
          // console.log(res);
          garbageList.splice(0, garbageList.length);

          if (res.data.code === 200) {
            const img = require("@/assets/score.png");
            ElNotification({
              type: "success",
              dangerouslyUseHTMLString: true,
              message: h("div", [
                h("p", { style: "font-size:16px;" }, "投递成功"),
                h("img", {
                  src: img,
                  style: "width:60px;position:absolute;right:30px;top:0",
                }),
                h(
                  "p",
                  {
                    style:
                      "font-size:16px;color:#409EFF;position:absolute;right:90px;top:17px",
                  },
                  `+${delivery.total}`
                ),
              ]),
              duration: 2000,
            });
          } else {
            ElMessage.error({
              message: "添加垃圾投递信息失败!!!",
              duration: 2000,
              center: true,
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    return {
      uploadVisible,
      garbageList,
      uploadRef,
      activeName,
      url,
      headers,
      baseUrl,
      categoryList,
      loading,
      sum,
      handleImage,
      handleSuccess,
      uploadUrl,
      inputLimit,
      formatUrl,
      deliveryFunction,
    };
  },
  mounted() {
    const user = localStorage.getItem("user");
    if (user) {
      const obj = JSON.parse(user);
      if (obj.access_token) {
        const token = "Bearer " + obj.access_token;
        this.headers = {
          Authorization: token,
        };
      }
    }

    getGarbageCategoryList().then(
      (res) => {
        // console.log(this.categoryList);
        const data: GarbageCategory[] = res.data.data;
        data.forEach((d) => {
          this.categoryList.push(d);
        });
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

:deep(.el-tabs) {
  .el-tabs__header {
    width: 25%;
    margin-left: 35%;
  }

  .el-tab-pane {
    min-height: 150px;
    .el-upload {
      margin-top: 10px;
      .el-upload-dragger {
        padding: 10px;
      }
    }

    .btn_url {
      background-color: #409eff;
      color: #fff;
    }
  }
}

.el-table {
  margin-top: 30px;
}

.btn_delivery {
  width: 350px;
  margin-top: 50px;
}
</style>