<template>
  <div class="header">
    <el-row>
      <el-col :xs="5" :sm="5" :md="5" :lg="2" :xl="5">
        <el-link href="/" :underline="false">
          <el-image
            style="width: 80px; height: 54px"
            :src="require('@/assets/5.png')"
            fit="contain"
          />
        </el-link>
      </el-col>
      <el-col :xs="4" :sm="2" :md="4" :lg="2" :xl="2">
        <el-link class="broadcast" href="/notice" :underline="false"
          >消息公告</el-link
        >
      </el-col>
      <el-col :xs="4" :sm="2" :md="4" :lg="2" :xl="2">
        <el-dropdown>
          <span class="el-dropdown-link">
            积分相关
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-link href="/mall" :underline="false">
                  <el-icon color="#F56C6C"><School /></el-icon>
                  积分商城
                </el-link></el-dropdown-item
              >
              <el-dropdown-item
                ><el-link href="/rankList" :underline="false">
                  <el-icon color="#67C23A"><Histogram /></el-icon>
                  积分排行榜
                </el-link></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :xs="2" :sm="6" :md="4" :lg="12" :xl="10" />
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="5">
        <el-tooltip effect="dark" content="垃圾搜索">
          <el-link class="search" href="/search" :underline="false">
            <el-icon size="18px">
              <Search />
            </el-icon>
          </el-link>
        </el-tooltip>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="1" :xl="5">
        <span
          @click="visible = true"
          v-show="username !== '' && checkRole('guest')"
        >
          <el-badge :value="count" :hidden="count === 0">
            <el-tooltip effect="dark" content="购物车">
              <el-link class="market" href="#" :underline="false">
                <el-icon size="21px" color="#e6a23c"><ShoppingCart /></el-icon>
              </el-link>
            </el-tooltip>
          </el-badge>
        </span>
      </el-col>
      <el-col :xs="5" :sm="5" :md="3" :lg="3" :xl="5">
        <span v-show="username === ''">
          <el-link href="/login" :underline="false">登录</el-link>
          <i>&nbsp;&nbsp;|&nbsp;&nbsp;</i>
          <el-link href="/register" :underline="false">注册</el-link>
        </span>
        <span v-show="username !== ''">
          <el-popover
            trigger="hover"
            effect="dark"
            :offset="20"
            popper-style="min-width:50px;width:130px;margin:0px;padding:0px;box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px,
          rgb(14 18 22 / 20%) 0px 10px 20px -15px;"
          >
            <template #reference>
              <el-link href="/main/welcome" :underline="false">
                <el-avatar :size="40" shape="circle" :src="image" />
              </el-link>
            </template>
            <template #default>
              <el-menu class="menu" router>
                <el-menu-item @click="addTab('signIn')" index="/main/signIn">
                  <el-icon><EditPen /></el-icon>
                  <template #title>签到</template>
                </el-menu-item>
                <el-menu-item
                  @click="addTab('personal')"
                  index="/main/personal"
                >
                  <el-icon><UserFilled /></el-icon>
                  <template #title>个人中心</template>
                </el-menu-item>
                <el-menu-item
                  @click="addTab('updatePassword')"
                  index="/main/updatePassword"
                >
                  <el-icon><Edit /></el-icon>
                  <template #title>修改密码</template>
                </el-menu-item>
                <el-menu-item @click="logout" index="">
                  <el-icon><BottomRight /></el-icon>
                  <template #title>注销</template>
                </el-menu-item>
              </el-menu>
            </template>
          </el-popover>
        </span>
      </el-col>
    </el-row>
  </div>
  <el-divider />
  <el-drawer
    v-model="visible"
    size="43%"
    :show-close="false"
    @open="loadMarket"
    @close="updateMarket"
  >
    <template #header="{ close }">
      <el-page-header @back="close">
        <template #content>
          <span> 购物车 </span>
        </template>
      </el-page-header>
    </template>
    <el-button
      class="deleteAll"
      style="width: 85px; height: 29px"
      type="danger"
      @click="deleteChoosen"
    >
      <el-icon> <DeleteFilled /> </el-icon
      ><span style="font-size: 12px">全部删除</span>
    </el-button>
    <el-table
      class="table"
      v-loading="loading"
      element-loading-text="加载中"
      ref="tableRef"
      stripe
      :data="tableData"
      style="width: 100%"
      :show-header="false"
      @selection-change="sum"
    >
      <template #empty>
        <el-empty
          :image-size="90"
          description="空"
          style="padding-top: 10px; padding-bottom: 0px"
        />
      </template>
      <el-table-column type="selection" width="40" />
      <el-table-column
        prop="goodName"
        label="商品名称"
        width="70"
        align="center"
      />
      <el-table-column prop="goodImage" label="图片" align="center">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-image
              class="image"
              style="width: 75px; height: 75px"
              :src="scope.row.goodImage[0]"
              :preview-src-list="scope.row.goodImage"
              fit="cover"
              preview-teleported
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="数量" width="140" align="center">
        <template #default="scope">
          <el-input-number
            :precision="0"
            @keydown="inputLimit"
            v-model="scope.row.count"
            :min="1"
            @change="AddToList(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="积分" width="60" align="center">
        <template #default="scope">{{ calulate(scope.row) }} </template>
      </el-table-column>
      <el-table-column label="操作" width="70" align="center">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.$index, scope.row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="all" justify="center">
      <el-divider />
      <span class="label">总计:&nbsp;&nbsp;</span
      ><span class="total">￥{{ sum() }}</span>
      <el-button @click="pay" :dark="true" size="large" type="danger"
        >支付</el-button
      >
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { MarketDetails, OrderDetailsForm, OrderForm } from "@/type/header";
import {
  addOrder,
  deleteMarketDetails,
  deleteMarketDetailsList,
  getMarketByUserId,
  getMarketDetailsCountByUserId,
  updateMarketDetailsListFunction,
} from "@/request/headerApi";
import useMarketStore from "@/store/market";
import useUserStore from "@/store/user";
import { ElMessage, ElMessageBox, ElNotification, ElTable } from "element-plus";
import { storeToRefs } from "pinia";
import { defineComponent, reactive, ref } from "vue";
import useTab from "@/store/tab";
import { useRouter } from "vue-router";
import useWebSocketStore from "@/store/webSocket";
export default defineComponent({
  name: "myHeader",
  setup(props) {
    const userStore = useUserStore();
    const { id, username, image, roleList } = storeToRefs(userStore);
    const marketStore = useMarketStore();
    const { marketId, count } = storeToRefs(marketStore);
    const visible = ref(false);
    const tableRef = ref<InstanceType<typeof ElTable>>();
    const tableData: Array<MarketDetails> = reactive([]);
    const loading = ref(true);
    const updateMarketDetailsList: Array<MarketDetails> = reactive([]);
    const tabStore = useTab();
    const { tabs, tabName } = storeToRefs(tabStore);

    const router = useRouter();

    const webSocketStore = useWebSocketStore();
    const { ws } = storeToRefs(webSocketStore);

    function addTab(type: string) {
      //添加标签
      const tab = {
        name: "",
        title: "",
        closable: true,
        to: "/main/" + type,
        isRouterActive: true,
      };

      if (type === "signIn") {
        tab.name = "签到";
        tab.title = "签到";
      }
      if (type === "personal") {
        tab.name = "个人中心";
        tab.title = "个人中心";
      }
      if (type === "updatePassword") {
        tab.name = "修改密码";
        tab.title = "修改密码";
      }

      //判断是否存在该标签
      const flag = tabs.value.filter((t) => {
        return t.to === tab.to;
      });

      if (flag.length === 0) {
        tabs.value.push(tab);
        tabName.value = tab.name;
      }

      tabs.value.forEach((t) => {
        t.isRouterActive = false;
        if (t.name === tab.name) {
          t.isRouterActive = true;
        }
      });
    }

    function logout() {
      ElMessageBox.confirm("您确定要退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      })
        .then(() => {
          ElNotification.success({
            title: "登出成功",
            duration: 2000,
          });

          if (Object.keys(ws.value).length !== 0) {
            //关闭连接
            ws.value.disconnect(
              () => {
                console.log("Disconnect:");
              },
              {
                id: id.value,
                type: "CHAT",
              }
            );
          }
          webSocketStore.$reset();
          userStore.$reset();
          tabStore.$reset();
          marketStore.$reset();
          router.push({ path: "/login" });
        })
        .catch(() => {
          return new Promise(() => {});
        });
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

    function loadMarket() {
      loading.value = true;
      getMarketByUserId(id.value).then(
        (res) => {
          // console.log(res);
          tableData.splice(0, tableData.length);
          marketId.value = res.data.data.id;
          const data: Array<MarketDetails> = res.data.data.marketDetailsVOList;
          data.forEach((d) => {
            if (typeof d.goodImage === "string") {
              d.goodImage = new Array(d.goodImage);
            }
            tableData.push(d);
          });
          loading.value = false;
        },
        (err) => {
          console.log(err);
          loading.value = false;
        }
      );
    }

    function loadMarketCount() {
      getMarketDetailsCountByUserId(id.value).then(
        (res) => {
          // console.log(res);
          count.value = res.data.data;
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function calulate(marketDetails: MarketDetails) {
      // console.log(marketDetails.goodScore, marketDetails.count);
      return marketDetails.goodScore * marketDetails.count;
    }

    function sum() {
      let temp = 0;
      if (loading.value) {
        return temp;
      }
      const choosenRows: Array<MarketDetails> =
        tableRef.value?.getSelectionRows();
      choosenRows.forEach((r) => {
        temp += calulate(r);
      });
      return temp;
    }

    function handleDelete(index: number, row: MarketDetails) {
      // console.log(index, row);
      ElMessageBox.confirm(`你确定要移除商品${row.goodName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteMarketDetails(row.id).then(
          (res) => {
            // console.log(res);
            loadMarket();
            loadMarketCount();
            if (res.data.code === 200) {
              ElMessage.success({
                message: "移除商品成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.success({
                message: "移除商品失败!!!",
                duration: 2000,
                center: true,
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
      });
    }

    function deleteChoosen() {
      const choosenRows: Array<MarketDetails> =
        tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要移除的商品!",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessageBox.confirm("你确定要移除选中的商品吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
        }).then(() => {
          const ids: number[] = [];
          choosenRows.forEach((r) => {
            ids.push(r.id);
          });

          deleteMarketDetailsList(ids).then(
            (res) => {
              // console.log(res);
              loadMarket();
              loadMarketCount();
              if (res.data.code === 200) {
                ElMessage.success({
                  message: "移除商品成功!",
                  duration: 2000,
                  center: true,
                });
              } else {
                ElMessage.success({
                  message: "移除商品失败!!!",
                  duration: 2000,
                  center: true,
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );
        });
      }
    }

    function AddToList(row: MarketDetails) {
      // console.log(row);
      const temp: MarketDetails = JSON.parse(JSON.stringify(row));
      if (typeof temp.goodImage !== "string") {
        temp.goodImage = temp.goodImage[0];
      }
      if (updateMarketDetailsList.length === 0) {
        updateMarketDetailsList.push(temp);
      } else {
        const flag = updateMarketDetailsList.filter((md) => md.id === temp.id);
        if (flag.length !== 0) {
          updateMarketDetailsList.forEach((md, index) => {
            if (md.id === temp.id) {
              updateMarketDetailsList.splice(index, 1);
            }
          });
        }
        updateMarketDetailsList.push(temp);
      }
    }

    function updateMarket() {
      if (updateMarketDetailsList.length === 0) {
        return;
      }
      updateMarketDetailsListFunction(updateMarketDetailsList).then(
        (res) => {
          // console.log(res);
          loadMarketCount();
          updateMarketDetailsList.splice(0, updateMarketDetailsList.length);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    async function pay() {
      const choosenRows: Array<MarketDetails> =
        tableRef.value?.getSelectionRows();
      if (choosenRows.length === 0) {
        ElMessage.warning({
          message: "请先选择要兑换的商品!",
          duration: 2000,
          center: true,
        });
      } else {
        const orderDetailsList: Array<OrderDetailsForm> = [];
        const ids: number[] = [];

        choosenRows.forEach((r) => {
          ids.push(r.id);
        });

        choosenRows.forEach((r) => {
          const orderDetail: OrderDetailsForm = {
            goodId: r.goodId,
            goodName: r.goodName,
            goodImage: r.goodImage[0],
            goodScore: r.goodScore,
            count: r.count,
          };
          orderDetailsList.push(orderDetail);
        });

        const order: OrderForm = {
          userId: id.value,
          sum: sum(),
          orderDetailsList,
        };

        addOrder(order).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              deleteMarketDetailsList(ids).then(
                (res) => {
                  loadMarket();
                  loadMarketCount();
                  ElMessage.success({
                    message: "兑换商品成功!",
                    duration: 2000,
                    center: true,
                  });
                  // console.log(res);
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              ElMessage.success({
                message: "兑换商品失败!!!",
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
    }

    function checkRole(role: string) {
      const flag = roleList.value.filter((r) => r.role === role).length;
      return flag > 0;
    }

    return {
      id,
      username,
      image,
      count,
      visible,
      tableRef,
      tableData,
      loading,
      logout,
      addTab,
      inputLimit,
      loadMarket,
      calulate,
      sum,
      handleDelete,
      deleteChoosen,
      AddToList,
      updateMarket,
      pay,
      checkRole,
    };
  },
  mounted() {},
});
</script>

<style lang="less" scoped>
.header {
  .el-row {
    height: 54px;
    .el-col {
      height: 54px;

      :deep(.el-badge__content) {
        width: 5px;
        height: 12px;
        margin-top: 15px;
        left: -2px;
        font-size: 10px;
        padding: 0px 4px;
      }

      .broadcast {
        margin-top: -3px;
      }

      .el-dropdown {
        width: 100%;
        height: 40px;
        line-height: 54px;
      }

      .el-link {
        font-size: 15px;
      }

      .el-avatar {
        margin-top: 6px;
      }
    }
  }
}

.menu {
  border: none;
  .el-menu-item {
    width: 100%;
    height: 40px;
    color: #e5eaf3;
    background-color: #303133;
  }

  .el-menu-item:hover {
    color: #409eff;
  }
}

.el-divider {
  padding: 0px;
  margin: 0px;
}

.el-drawer {
  .deleteAll {
    float: left;
    margin-bottom: 20px;
  }

  .all {
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #ff6a00;

    span {
      font-weight: bolder;
      color: #fff;
      position: absolute;
    }

    .label {
      left: 10px;
    }

    .total {
      left: 50px;
      font-size: 18px;
      color: yellow;
    }

    .el-button {
      border: none;
      width: 90px;
      background-color: #626aef;
      border-radius: 0%;
      position: absolute;
      right: -1px;
      top: 1px;
    }
  }
}

.table {
  margin-top: 10px;

  .image {
    margin-left: 28%;
  }

  .el-input-number {
    width: 110px;
    height: 30px;
  }

  .el-button {
    width: 40px;
    height: 25px;
  }
}
</style>