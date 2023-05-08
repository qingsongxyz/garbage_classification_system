<template>
  <el-row justify="center">
    <el-col :span="7">
      <el-image :src="require('@/assets/6.png')" fit="contain" /> </el-col
  ></el-row>
  <el-row justify="center">
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
        placeholder="输入关键词查询"
        @select="handleSelect"
      >
        <template #suffix>
          <el-link :underline="false" @click="searchGarbage">
            <el-icon size="23" style="color: #a3a6ad"><Search /></el-icon>
          </el-link>
        </template>
        <template #default="{ item }">
          <el-row>
            <el-col :span="18"><span v-html="item.name"></span></el-col>
            <el-col :span="6">
              <el-tag
                v-if="item.category === '可回收垃圾'"
                disable-transitions
                type="success"
                >{{ item.category }}</el-tag
              >
              <el-tag
                v-else-if="item.category === '餐余垃圾'"
                disable-transitions
                >{{ item.category }}</el-tag
              >
              <el-tag
                v-else-if="item.category === '其他垃圾'"
                disable-transitions
                type="info"
                >{{ item.category }}</el-tag
              >
              <el-tag
                v-else-if="item.category === '有害垃圾'"
                disable-transitions
                type="danger"
                >{{ item.category }}</el-tag
              >
              <el-tag v-else disable-transitions type="warning">{{
                item.category
              }}</el-tag>
            </el-col>
          </el-row>
        </template>
      </el-autocomplete>
    </el-col>
  </el-row>
  <el-row>
    <el-col
      v-for="(g, index) in garbageList"
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
        <div style="padding: 14px">
          <span v-html="g.name"></span>
          <div class="category">
            <el-tag
              v-if="g.category === '可回收垃圾'"
              disable-transitions
              type="success"
              >{{ g.category }}</el-tag
            >
            <el-tag
              v-else-if="g.category === '餐余垃圾'"
              disable-transitions
              >{{ g.category }}</el-tag
            >
            <el-tag
              v-else-if="g.category === '其他垃圾'"
              disable-transitions
              type="info"
              >{{ g.category }}</el-tag
            >
            <el-tag
              v-else-if="g.category === '有害垃圾'"
              disable-transitions
              type="danger"
              >{{ g.category }}</el-tag
            >
            <el-tag v-else disable-transitions type="warning">{{
              g.category
            }}</el-tag>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row justify="center" class="pagination">
    <el-col :span="16">
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
</template>
<script lang="ts">
import { getGarbageByKeyword } from "@/request/homeApi";
import { Garbage } from "@/type/home";
import { defineComponent, reactive, ref, watch } from "vue";
import {
  getAllGarbageByKeyword,
  getGarbageCountByKeyword,
} from "@/request/searchGarbageApi";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "searchGarbage",
  setup(props) {
    const currentPage = ref(1);
    const totalPage = ref(1);
    const search = ref("");
    const garbageList: Garbage[] = reactive([]);

    const querySearch = (queryString: string, cb: any) => {
      if (!queryString) {
        return;
      }
      getAllGarbageByKeyword(queryString).then(
        (res) => {
          // console.log(res);
          const results = res.data.data.filter((g: Garbage) => {
            return (
              g.name.indexOf(queryString) !== -1 ||
              g.category.indexOf(queryString) !== -1
            );
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
      searchGarbage();
    };

    function searchGarbage() {
      if (search.value === "") {
        ElMessage.warning({
          message: "请输入关键词查询!!!",
          duration: 2000,
          center: true,
        });
        return;
      }
      totalPage.value = 1;
      getGarbageByKeyword(search.value, 1, 8).then(
        (res) => {
          // console.log(res);
          garbageList.splice(0, garbageList.length);
          const data: Garbage[] = res.data.data;
          data.forEach((d) => {
            if (typeof d.image === "string") {
              d.image = new Array(d.image);
            }
            garbageList.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );

      getGarbageCountByKeyword(search.value).then(
        (res) => {
          // console.log(res);
          totalPage.value = Math.ceil(res.data.data / 8);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    watch(currentPage, (newValue, oldValue) => {
      getGarbageByKeyword(search.value, currentPage.value, 8).then(
        (res) => {
          // console.log(res);
          garbageList.splice(0, garbageList.length);
          const data: Garbage[] = res.data.data;
          data.forEach((d) => {
            if (typeof d.image === "string") {
              d.image = new Array(d.image);
            }
            garbageList.push(d);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });

    watch(search, (newValue, oldValue) => {
      //去除handleSelect方法修改数据中的font标签
      if (newValue.indexOf("</font>") !== -1) {
        search.value = newValue
          .replace(/<font (.*?)>/gi, "")
          .replace(/<\/font>/gi, "");
        searchGarbage();
      }
    });

    return {
      currentPage,
      totalPage,
      search,
      garbageList,
      querySearch,
      handleSelect,
      searchGarbage,
    };
  },
});
</script>
<style lang="less" scoped>
.el-image {
  margin-top: 20px;
}

.category {
  margin: 10px auto;
}

:deep(.el-autocomplete) {
  width: 57%;
  margin-top: 30px;
  margin-bottom: 100px;

  .el-input__wrapper {
    height: 37px;
    border: 1.2px solid #909399;
    border-radius: 18px 18px 18px 18px;
  }

  .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 1.5px rgb(28, 196, 92) inset;
  }

  .el-link__inner svg:hover {
    color: #58585b;
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

.el-card {
  width: 220px;
  height: 275px;
  margin-bottom: 40px;
  margin-left: 40px;

  .image {
    width: 100%;
    height: 170px;
    display: block;
  }
}

.el-pagination {
  width: 400px;
  position: relative;
  left: 37%;
  margin-bottom: 50px;
}
</style>