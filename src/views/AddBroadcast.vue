<template>
  <el-row justify="center">
    <el-col :span="24">
      <h1 class="title">发布消息</h1>
    </el-col>
  </el-row>

  <div class="broadcast">
    <strong>标题:</strong
    ><el-input
      v-model="title"
      style="width: 250px; margin-left: 10px"
    ></el-input>
  </div>

  <WangEditor ref="wangRef" class="wang" />

  <el-row justify="center">
    <el-col :span="24">
      <el-button @click="addBroadcastFunction" type="primary">发布</el-button>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import WangEditor from "@/components/WangEditor.vue";
import { addBroadcast } from "@/request/broadcastApi";
import useUserStore from "@/store/user";
import { BroadcastForm, ImageElement } from "@/type/broadcast";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import {
  defineComponent,
  onBeforeUnmount,
  reactive,
  ref,
  shallowRef,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  name: "addBroadcast",
  component: { WangEditor },
  setup(props) {
    const wangRef = ref();

    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);

    const broadcastForm: BroadcastForm = reactive({
      userId: id.value,
      title: "",
      content: "",
    });

    function addBroadcastFunction() {
      broadcastForm.content = wangRef.value.getContent();
      // console.log(broadcastForm.content);
      if (broadcastForm.title.trim() === "") {
        ElMessage.warning({
          message: "请输入消息标题!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      if (broadcastForm.title.trim().length > 50) {
        ElMessage.warning({
          message: "消息标题长度不能超过50!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      if (wangRef.value.isEditorEmpty()) {
        ElMessage.warning({
          message: "请输入消息内容!!!",
          duration: 2000,
          center: true,
        });
        return;
      }

      addBroadcast(broadcastForm).then(
        (res) => {
          // console.log(res);
          if (res.data.code) {
            ElMessage.success({
              message: "发布消息成功!",
              duration: 2000,
              center: true,
            });
            broadcastForm.title = "";
            broadcastForm.content = "";
            wangRef.value.setContent("");
          } else {
            ElMessage.error({
              message: "发布消息失败!!!",
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
      wangRef,
      broadcastForm,
      ...toRefs(broadcastForm),
      addBroadcastFunction,
    };
  },
  mounted() {},
});
</script>
<style lang="less" scoped>
h1 {
  font-size: 21px;
  color: #409eff;
  margin-bottom: 20px;
}

.broadcast {
  width: 420px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.wang {
  width: 85%;
  margin-left: 7%;
}

.el-button {
  width: 450px;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>