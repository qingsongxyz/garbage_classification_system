<template>
  <div class="footer">
    <el-row :gutter="20" justify="center">
      <el-col :span="6"> © 2022 qingsongxyz.top </el-col>
      <el-col :span="6">
        <el-link
          :underline="false"
          href="http://www.beian.gov.cn/portal/registerSystemInfo"
          target="_blank"
        >
          <el-image
            style="width: 20px; height: 20px"
            :src="require('@/assets/beian.png')"
            fit="fill"
          />
          &nbsp;&nbsp;<span>鄂ICP备2022014961号-1</span>
        </el-link>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "myFooter",
  setup(props) {},
});
</script>

<style lang="less" scoped>
.footer {
  .el-link {
    color: #939393;
  }

  span:hover {
    color: #ff6a00;
  }
}
</style>