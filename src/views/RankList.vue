<template>
  <el-row justify="center">
    <el-col :span="24">
      <el-image
        class="title"
        :src="require('@/assets/rank.png')"
        fit="contain"
      />
    </el-col>
  </el-row>

  <el-row justify="center">
    <el-col :span="16">
      <el-table
        class="table"
        v-loading="loading"
        element-loading-text="加载中"
        ref="userListRef"
        header-cell-class-name="tableHeader"
        row-class-name="tableRow"
        cell-class-name="tableCell"
        :data="userList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="排行" width="70" align="center">
          <template #default="{ $index }">
            <span class="number">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column label="头像" align="center">
          <template #default="scope">
            <el-avatar :size="90" :src="scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column prop="score" label="积分" align="center">
          <template #default="scope"
            ><span class="score">{{ scope.row.score }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-row justify="center">
    <el-col :span="16">
      <el-button type="primary" @click="showMoreUser">显示更多</el-button>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { getUserListByScoreRanking } from "@/request/rankListApi";
import User from "@/type/userList";
import { ElMessage, ElTable } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
export default defineComponent({
  name: "rankList",
  setup(props) {
    const loading = ref(false);
    const userListRef = ref<InstanceType<typeof ElTable>>();
    const userList: Array<User> = reactive([]);

    function showMoreUser() {
      loading.value = true;
      getUserListByScoreRanking(userList.length).then(
        (res) => {
          // console.log(res);
          loading.value = false;
          const temp: Array<User> = res.data.data;
          if (temp.length === 0) {
            ElMessage.warning({
              message: "排行榜已经完全显示!!!",
              duration: 2000,
              center: true,
            });
            return;
          }
          temp.forEach((u) => {
            if (u.image === null) {
              u.image =
                "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/user.png";
            }
            userList.push(u);
          });
        },
        (err) => {
          loading.value = false;
          console.log(err);
        }
      );
    }

    return {
      loading,
      userListRef,
      userList,
      showMoreUser,
    };
  },
  mounted() {
    getUserListByScoreRanking(0).then(
      (res) => {
        // console.log(res);
        const userList: Array<User> = res.data.data;
        userList.forEach((u) => {
          if (u.image === null) {
            u.image =
              "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/user.png";
          }
          this.userList.push(u);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  },
});
</script>
<style lang="less" scoped>
.title {
  margin-top: 70px;
}

:deep(.table) {
  color: #000;
  margin-top: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .tableHeader {
    color: #fff;
    background-color: #558134;
  }

  .tableCell {
    background-color: #fff;
  }

  .number {
    font-size: 20px;
    color: tomato;
    font-family: "Furore";
  }

  .score {
    font-size: 13px;
    font-family: "OPPOSans-B";
  }

  .el-image {
    width: 90px;
    height: 90px;
  }
}

.el-button {
  margin-top: 5px;
  width: 100%;
}
</style>