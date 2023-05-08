<template>
  <div id="verify">
    <div id="captcha"></div>
    <!--预加载动画-->
    <div v-if="!isLoading" class="captcha-init-main">
      <div class="captcha-init-loading">
        <a href="/" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="48px"
            height="60px"
            viewBox="0 0 24 30"
            style="
              enable-background: new 0 0 50 50;
              width: 14px;
              height: 14px;
              vertical-align: middle;
            "
            xml:space="preserve"
          >
            <rect x="0" y="9.22656" width="4" height="12.5469" fill="#CCCCCC">
              <animate
                attributeName="height"
                attributeType="XML"
                values="5;21;5"
                begin="0s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
            </rect>
            <rect x="10" y="5.22656" width="4" height="20.5469" fill="#CCCCCC">
              <animate
                attributeName="height"
                attributeType="XML"
                values="5;21;5"
                begin="0.15s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0.15s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
            </rect>
            <rect x="20" y="8.77344" width="4" height="13.4531" fill="#CCCCCC">
              <animate
                attributeName="height"
                attributeType="XML"
                values="5;21;5"
                begin="0.3s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="y"
                attributeType="XML"
                values="13; 5; 13"
                begin="0.3s"
                dur="0.6s"
                repeatCount="indefinite"
              ></animate>
            </rect>
          </svg>
        </a>
        <span class="captcha-text">验证码加载中，请稍后...</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import CaptchaResult from "@/type/captcha";
import { storeToRefs } from "pinia";
import useCaptchaStore from "@/store/captcha";
export default defineComponent({
  name: "captcha",
  setup(props) {
    const isLoading = ref(false);
    const captchaStore = useCaptchaStore();
    const {captchaId, captchaObject, captchaResult} = storeToRefs(captchaStore);

    function getGeetest() {
      (window as any).initGeetest4(
        {
          captchaId: captchaId.value,
          product: "popup",
          nativeButton: {
            height: "36px",
            width: "100%",
          },
        },
        function (captchaObj: { appendTo?: any; onNextReady?: any; onSuccess?: any; getValidate?: any; reset?: any;}) {
          // captcha为验证码实例
          captchaObj.appendTo("#captcha"); // 调用appendTo将验证码插入到html元素中

          captchaObj.onNextReady(() => {
            //验证码加载完毕
            isLoading.value = true;
          });

          captchaObj.onSuccess(() => {
            const result: CaptchaResult = captchaObj.getValidate();
            captchaObject.value = captchaObj;
            captchaResult.value = result;
            // console.log(captchaObj);
            // console.log(result);
          });
        }
      );
    }

    return {
      isLoading,
      getGeetest,
    };
  },
  mounted() {
    this.getGeetest();
  },
});
</script>
<style lang="less" scoped>
.captcha-init-main {
  display: table;
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
}

.captcha-init-loading {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.captcha-init-loading > a {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: none;
}

.captcha-init-loading .captcha-text {
  font-family: sans-serif;
  font-size: 12px;
  color: #cccccc;
  vertical-align: middle;
}
</style>