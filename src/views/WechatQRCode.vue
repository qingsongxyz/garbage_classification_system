<template>
  <div>
    <el-image
      class="wechat"
      :src="require('@/assets/wechat.png')"
      fit="contain"
    />
    <span>使用微信扫一扫登录</span>
    <p>先扫左侧二维码关注公众号, 再扫右侧二维码登录!</p>
  </div>
  <el-image
    class="public"
    :src="require('@/assets/wechatTest.png')"
    fit="fill"
  />
  <el-image class="code" :src="code" fit="fill" />
</template>
<script lang="ts">
import { getWechatQRCode } from "@/request/loginApi";
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "wechatQRCode",
  setup(props) {
    const code = ref("");
    const router = useRouter();
    return {
      code,
      router,
    };
  },
  mounted() {
    const noticeId = this.router.currentRoute.value.params.id;
    if (typeof noticeId === "string") {
      getWechatQRCode(noticeId).then(
        (res) => {
          // console.log(res);
          this.code = res.data.data;
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
div {
  text-align: center;
  margin-top: 60px;
  .wechat {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  span {
    width: 100px;
    height: 30px;
    font-size: 20px;
  }

  p {
    font-size: 14px;
  }
}

.code {
  width: 200px;
  height: 200px;
  margin-left: 40px;
}

.public {
  width: 170px;
  height: 170px;
  margin-bottom: 15px;
}
</style>