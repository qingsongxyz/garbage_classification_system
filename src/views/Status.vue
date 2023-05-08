<template>
  <div>
    <h1 v-if="statusCode === 401">4 0 1</h1>
    <h1 v-if="statusCode === 403" style="color: #E6A23C;">4 0 3</h1>
    <h1 v-if="statusCode === 404" style="color: #909399">4 0 4</h1>
    <h1 v-if="statusCode === 503" style="color: tomato">5 0 3</h1>
    <p class="notice" v-if="statusCode === 401">您没有认证, 请先登录 !</p>
    <p class="notice" v-if="statusCode === 403">您没有权限访问该路径 !</p>
    <p class="notice" v-if="statusCode === 404">您访问的页面不存在 !</p>
    <p class="notice" v-if="statusCode === 503">服务不可用, 请稍后再试 !</p>
    <el-button
      type="success"
      plain
      @click="jump('/login')"
      v-if="statusCode === 401"
      >去登录</el-button
    >
    <el-button type="success" plain @click="jump('/')" v-else
      >返回首页</el-button
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "status",
  setup(props) {
    const statusCode = ref(0);
    const router = useRouter();

    function jump(path: string) {
      router.push({ path });
    }

    return {
      statusCode,
      router,
      jump,
    };
  },
  mounted() {
    const temp = this.router.currentRoute.value.params.statusCode;
    if (typeof temp === "string") {
      this.statusCode = parseInt(temp);
    }
  },
});
</script>
<style lang="less" scoped>
div {
  height: 100vh;
  text-align: center;
  background-image: url("../assets/background.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;
  h1 {
    margin: 0px;
    padding-top: 150px;
    font-size: 80px;
    font-family: "Hiragino Sans GB";
  }

  .notice {
    font-weight: bolder;
    margin-top: 20px;
    margin-bottom: 30px;
    font-family: "Helvetica Neue";
  }

  .el-button {
    width: 80px;
    height: 35px;
  }
}
</style>