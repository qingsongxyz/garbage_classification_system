<template>
  <el-calendar
    ref="calendarRef"
    v-model="today"
    :range="[new Date(year, month, 1), new Date(year, month, day)]"
  >
    <template #header="{ date }">
      <el-row justify="center">
        <el-col :span="5">
          <el-image
            class="title"
            :src="require('@/assets/signIn.png')"
            fit="contain"
          />
        </el-col>
      </el-row>
      <p class="year">{{ date }}</p>
    </template>
    <template #date-cell="{ data }">
      <div :class="judge(data) ? 'cell' : 'hidden'">
        <p class="date">
          {{ getDay(data) }}
        </p>
        <p class="result" v-show="signInResult[getDay(data) - 1] === '1'">
          <el-icon size="30" color="#67C23A"><CircleCheckFilled /></el-icon>
        </p>
        <el-button
          v-show="
            data.day === getTodatDateStr() &&
            signInResult[getDay(data) - 1] !== '1'
          "
          @click="signInFunction(getDay(data) - 1)"
          color="#67C23A"
          plain
          >签到</el-button
        >
      </div>
    </template>
  </el-calendar>
</template>
<script lang="ts">
import { DateCell } from "@/type/signIn";
import { signIn, showSignInStatus } from "@/request/signInApi";
import useUserStore from "@/store/user";
import { getTodatDateStr } from "@/util/date";
import { ElMessage, ElNotification } from "element-plus";
import { storeToRefs } from "pinia";
import { computed, defineComponent, h, reactive, ref, toRefs } from "vue";
export default defineComponent({
  name: "signIn",
  setup(props) {
    const signInResult = ref("");

    const calendarRef = ref();
    //获取年份
    const year = ref(new Date().getFullYear());
    //获取月份
    const month = ref(new Date().getMonth());
    //获取本月总天数
    const day = computed(() => {
      return new Date(year.value, month.value + 1, 0).getDate();
    });

    //日历锁定今天
    const today = new Date();

    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);

    //判断是否为本月的日期
    function judge(d: DateCell) {
      return d.date.getMonth() === month.value;
    }

    //获取Calendar 每一天的日期
    function getDay(d: DateCell) {
      return d.day.split("-")[2];
    }

    function getScore(index: number) {
      let count = 1;
      while (true) {
        if (index === 0 || signInResult.value.charAt(index - 1) === "0") {
          break;
        }
        count++;
        index--;
      }
      return 100 * count;
    }

    function signInFunction(index: number) {
      // console.log(index);
      const score = getScore(index);
      signIn(id.value, score).then(
        (res) => {
          // console.log(res);
          //修改签到结果
          if (res.data.code === 200) {
            signInResult.value =
              signInResult.value.substr(0, index) +
              "1" +
              signInResult.value.substr(index);
            const img = require("@/assets/score.png");
            ElNotification({
              type: "success",
              dangerouslyUseHTMLString: true,
              message: h("div", [
                h("p", { style: "font-size:16px;" }, "签到成功"),
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
                  `+${score}`
                ),
              ]),
              duration: 2000,
            });
          } else {
            ElMessage.error({
              message: "签到失败!!!",
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
      signInResult,
      calendarRef,
      year,
      month,
      day,
      today,
      id,
      judge,
      getTodatDateStr,
      getDay,
      signInFunction,
    };
  },
  mounted() {
    showSignInStatus(this.id).then(
      (res) => {
        let temp: string = res.data.data;
        //如果不足32位用0补齐
        if (temp && temp.length < 32) {
          let i = 32 - temp.length;
          while (i > 0) {
            i--;
            temp += "0";
          }
        }
        this.signInResult = temp;
      },
      (err) => {
        console.log(err);
      }
    );
  },
});
</script>
<style lang="less" scoped>
.el-calendar {
  .title {
    margin-bottom: 10px;
  }

  .year {
    position: absolute;
    color: #409eff;
    font-size: 20px;
    font-family: "OPPOSans-B";
  }

  :deep(.el-calendar-table thead th) {
    background-color: #76b348;
    color: #fff;
    font-size: 14px;
    font-family: "Furore";
  }

  :deep(.el-calendar-day) {
    width: 135px;
    height: 100px;
  }

  .date {
    font-size: 14px;
    font-family: "Hiragino Sans GB";
  }
}

.el-calendar-table:not(.is-range) td.prev,
.el-calendar-table:not(.is-range) td.next {
  pointer-events: none;
}

.prev > .el-calendar-day > .hidden {
  display: none;
}

.current > .el-calendar-day > .hidden {
  display: none;
}

.next > .el-calendar-day > .hidden {
  display: none;
}
</style>