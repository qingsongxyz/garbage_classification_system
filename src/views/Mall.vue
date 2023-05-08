<template>
  <el-row justify="center">
    <el-col :span="5">
      <el-image :src="require('@/assets/15.png')" fit="contain" />
    </el-col>
  </el-row>
  <el-row justify="center"
    >``
    <el-col :span="20">
      <el-autocomplete
        class="searchBox"
        v-model="search"
        :popper-append-to-body="false"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="name"
        select-when-unmatched
        :debounce="0"
        clearable
        fit-input-width
        placeholder="输入商品名称查询"
        @select="handleSelect"
      >
        <template #suffix>
          <el-link :underline="false" @click="searchGood">
            <el-icon size="23" style="color: #a3a6ad"><Search /></el-icon>
          </el-link>
        </template>
      </el-autocomplete>
    </el-col>
  </el-row>

  <el-row justify="center" class="pagination">
    <el-col :span="16">
      <el-tabs v-model="activeTab" @tab-change="tabChange">
        <el-tab-pane
          v-for="(c, index) in categoryList"
          :key="index"
          :label="c.category"
          :name="c.category"
        />
      </el-tabs>
    </el-col>
  </el-row>
  <el-row class="goodBox">
    <el-col
      v-for="(g, index) in goodList"
      :key="index"
      :xs="12"
      :sm="8"
      :md="6"
      :lg="6"
      :xl="4"
    >
      <el-card :body-style="{ padding: '0px' }">
        <el-image
          class="image"
          :src="g.image[0]"
          :previewSrcList="g.image"
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="score" style="margin-top: 5px">
          <span class="score"><b>￥</b>{{ g.score }}</span
          ><span class="storage">库存{{ format(g.storage.storage) }}</span>
        </div>
        <div>{{ g.name }}</div>
        <el-button
          @click="addToMarket(g)"
          type="primary"
          class="btn_addToMarket"
          >加入购物车</el-button
        >
      </el-card>
    </el-col>
  </el-row>

  <el-row justify="center" class="pagination">
    <el-col :span="12">
      <el-pagination
        v-model:current-page="currentPage"
        :hide-on-single-page="true"
        :background="true"
        :total="totalPage"
        :page-count="totalPage"
        layout="prev, pager, next, jumper, total"
      />
    </el-col>
  </el-row>

  <el-dialog v-model="dialogVisible" width="34%" center align-center>
    <el-row justify="center">
      <el-col :span="8">
        <h1 class="title">添加至购物车</h1>
      </el-col>
    </el-row>
    <el-form
      ref="ruleFormRef"
      v-model="marketDetails"
      label-width="120px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="24">
          <el-form-item label="商品名称" prop="goodName">
            <el-input class="goodName" v-model="goodName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="24">
          <el-form-item label="商品数量" prop="count">
            <el-input-number
              :precision="0"
              @keydown="inputLimit"
              v-model="count"
              :min="1"
              :max="storage"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item>
            <el-button type="primary" @click="addMarketDetailsFunction"
              >确定</el-button
            >
            <el-button @click="dialogVisible = false"> 取消 </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { addMarketDetails } from "@/request/mallApi";
import { getAllGoodCategoryList } from "@/request/goodCategoryListApi";
import {
  getAllGoodCount,
  getAllGoodListByName,
  getCountByNameOrCategory,
  getGoodList,
  getGoodListByNameOrCategory,
} from "@/request/goodListApi";
import GoodCategory from "@/type/goodCategoryList";
import { Good } from "@/type/goodList";
import { MarketDetailsForm } from "@/type/mall";
import { ElMessage, FormInstance, FormRules, TabPaneName } from "element-plus";
import { defineComponent, reactive, ref, toRef, toRefs, watch } from "vue";
import useMarketStore from "@/store/market";
import { storeToRefs } from "pinia";
import useUserStore from "@/store/user";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "mall",
  setup(props) {
    const marketStore = useMarketStore();
    const { marketId, count } = storeToRefs(marketStore);
    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);
    const router = useRouter();
    const currentPage = ref(1);
    const totalPage = ref(1);
    const activeTab = ref("1");
    const search = ref("");
    const categoryList: Array<GoodCategory> = reactive([]);
    const goodList: Array<Good> = reactive([]);
    const marketDetails: MarketDetailsForm = reactive({
      marketId: 1,
      goodId: 1,
      goodName: "",
      goodImage: "",
      goodScore: 1,
      count: 1,
      storage: 1,
    });

    const ruleFormRef = ref();
    const dialogVisible = ref(false);

    const querySearch = (queryString: string, cb: any) => {
      if (!queryString) {
        return;
      }

      getAllGoodListByName(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((g: Good) => {
            return g.name.indexOf(queryString) !== -1;
          });
          cb(results);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    const handleSelect = (item: any) => {
      // console.log(item);
      searchGood("");
    };

    function searchGood(category: string) {
      getGoodListByNameOrCategory(search.value, category, 1, 8).then(
        (res) => {
          // console.log(res);
          goodList.splice(0, goodList.length);
          const data: Good[] = res.data.data;
          data.forEach((d) => {
            if (typeof d.image === "string") {
              d.image = new Array(d.image);
            }
            goodList.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );

      getCountByNameOrCategory(search.value, category).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 8);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    function tabChange(category: TabPaneName) {
      searchGood(category.toString());
    }

    watch(currentPage, (newValue, oldValue) => {
      getGoodListByNameOrCategory(
        search.value,
        activeTab.value === "1" ? "" : activeTab.value,
        currentPage.value,
        8
      ).then(
        (res) => {
          // console.log(res);
          goodList.splice(0, goodList.length);
          const data: Good[] = res.data.data;
          data.forEach((d) => {
            if (typeof d.image === "string") {
              d.image = new Array(d.image);
            }
            goodList.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });

    function format(num: number) {
      if (num < 0) {
        return;
      }
      if (num < 1000) {
        return num;
      } else if (num < 10000) {
        return Math.round(num / 1000) + "千";
      } else if (num < 100000) {
        return Math.round(num / 10000) + "万";
      } else if (num < 1000000000) {
        return Math.round(num / 100000000) + "亿";
      }
    }

    function addToMarket(row: Good) {
      //未登录直接跳转到登录页面
      if (id.value === 0) {
        ElMessage.warning({
          message: "请先登录再兑换商品!!!",
          duration: 2000,
          center: true,
        });
        router.push({ name: "login" });
        return;
      }
      // console.log(row);
      marketDetails.marketId = marketId.value;
      marketDetails.count = 1;
      marketDetails.goodId = row.id;
      marketDetails.goodName = row.name;
      marketDetails.goodScore = row.score;
      marketDetails.goodImage = row.image[0];
      marketDetails.storage = row.storage.storage;
      dialogVisible.value = true;
      // console.log(marketDetails);
    }

    function addMarketDetailsFunction() {
      // console.log(marketDetails);
      addMarketDetails(marketDetails).then(
        (res) => {
          if (res.data.code === 200) {
            count.value += marketDetails.count;
            ElMessage.success({
              message: res.data.message,
              duration: 2000,
              center: true,
            });
          } else {
            ElMessage.error({
              message: res.data.message,
              duration: 2000,
              center: true,
            });
          }
          dialogVisible.value = false;
        },
        (err) => {
          console.log(err.message);
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

    return {
      currentPage,
      totalPage,
      activeTab,
      search,
      categoryList,
      goodList,
      marketDetails,
      ...toRefs(marketDetails),
      dialogVisible,
      ruleFormRef,
      querySearch,
      handleSelect,
      tabChange,
      searchGood,
      format,
      addToMarket,
      addMarketDetailsFunction,
      inputLimit,
    };
  },
  mounted() {
    getGoodList(1, 8).then(
      (res) => {
        // console.log(res);
        const data: Good[] = res.data.data;
        data.forEach((d) => {
          if (typeof d.image === "string") {
            d.image = new Array(d.image);
          }
          this.goodList.push(d);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getAllGoodCategoryList().then(
      (res) => {
        const data: GoodCategory[] = res.data.data;
        // console.log(data);
        data.forEach((d) => {
          this.categoryList.push(d);
        });
      },
      (err) => {
        console.log(err.message);
      }
    );

    getAllGoodCount().then(
      (res) => {
        this.totalPage = Math.ceil(res.data.data / 8);
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
  font-size: 21px;
  color: #409eff;
  margin-top: 0;
  margin-bottom: 30px;
}

:deep(.el-autocomplete) {
  width: 57%;
  margin-top: 20px;
  margin-bottom: 20px;

  .el-input__wrapper {
    height: 37px;
    border: 1.2px solid #909399;
  }

  .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 1.8px tomato inset;
  }

  .el-link__inner svg:hover {
    color: tomato;
  }

  .el-input__clear svg {
    color: tomato;
    width: 18px;
    height: 18px;
    position: absolute;
    right: 65px;
  }

  .el-input__suffix {
    width: 33px;
    height: 33px;
  }
}

:deep(.el-tabs) {
  .el-tabs__nav-scroll {
    text-align: center;
  }
}

.el-card:hover {
  background-color: rgba(0, 0, 0, 0.7);
  color: #4a4a4a;
}

.el-card:hover .btn_addToMarket {
  display: inline;
}
.el-card:hover .storage {
  color: aliceblue;
}

.goodBox {
  padding-left: 10%;
  padding-right: 5%;
}

.el-card {
  width: 175px;
  height: 210px;
  margin-top: 40px;
  .el-image {
    margin-top: 20px;
    width: 120px;
    height: 120px;
  }

  .score {
    font-size: 18px;
    color: red;
    margin-left: -5%;
  }

  .storage {
    font-size: 10px;
    color: #636466;
    margin-left: 35%;
  }

  .btn_addToMarket {
    position: relative;
    bottom: 20px;
    display: none;
  }
}

.pagination {
  margin-top: 20px;
}

.el-dialog {
  .form {
    .goodName {
      width: 150px;
    }

    .el-button {
      margin-top: 20px;
    }
  }
}
</style>