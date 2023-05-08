<template>
  <el-row justify="center">
    <el-col :span="20">
      <h1 class="title">{{ title }}</h1>
    </el-col>
  </el-row>

  <el-row justify="center">
    <el-col :span="20">
      <div class="content" v-html="content"></div>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { getBroadcastById } from "@/request/noticeDetailsApi";
import { Broadcast } from "@/type/broadcastList";
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "noticeDetails",
  setup(props) {
    const router = useRouter();

    const broadcast: Broadcast = reactive({
      id: 1,
      userId: 1,
      title: "",
      content: "",
      createTime: "",
    });

    return {
      broadcast,
      ...toRefs(broadcast),
      router,
    };
  },
  mounted() {
    //获取传递参数消息id
    const noticeId = this.router.currentRoute.value.params.id;
    if (typeof noticeId === "string") {
      getBroadcastById(noticeId).then(
        (res) => {
          // console.log(res);
          this.broadcast.id = res.data.data.id;
          this.broadcast.userId = res.data.data.userId;
          this.broadcast.title = res.data.data.title;
          this.broadcast.content = res.data.data.content;
          this.broadcast.createTime = res.data.data.createTime;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  },
});
</script>
<style lang="less" scoped>
.title {
  font-size: 20px;
  color: #303030;
  margin-top: 70px;
}
</style>