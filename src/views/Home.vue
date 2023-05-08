<template>
  <!-- 垃圾分类视频 -->
  <div class="vedio">
    <el-row justify="center">
      <el-col :span="6">
        <el-image :src="require('@/assets/1.png')" fit="contain" />
      </el-col>
      <el-col :span="16">
        <div class="box">
          <iframe
            src="https://player.bilibili.com/player.html?aid=59691040&bvid=BV1gt41137Fy&cid=141306819&page=1&danmaku=0"
            scrolling="no"
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            width="60%"
            height="340"
            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
          >
          </iframe>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-divider style="width: 70%; left: 15%" />

  <el-row justify="center">
    <el-col :span="5">
      <el-image :src="require('@/assets/notice.png')" fit="contain" />
    </el-col>
  </el-row>

  <el-row justify="center">
    <el-col :span="14">
      <div class="broadcast">
        <el-link href="/notice" class="more"
          >更多&nbsp;<el-icon><DArrowRight /></el-icon
        ></el-link>
        <p v-for="(b, index) in broadcastList" :key="index">
          <el-row justify="center">
            <span class="dot"></span>
            <el-col :span="16">
              <el-link @click="showDetails(b.id)">{{ b.title }}</el-link>
            </el-col>
            <el-col :span="8">
              <span class="time">{{ b.createTime.replace("T", " ") }}</span>
            </el-col>
          </el-row>
        </p>
      </div>
    </el-col>
  </el-row>

  <el-divider style="width: 70%; left: 15%" />

  <!-- 垃圾分类列表 -->
  <div
    class="garbageCategoryList"
    v-for="(category, index) in garbageCategoryList"
    :key="index"
  >
    <el-row v-show="index % 2 == 0">
      <el-col :span="6">
        <el-image
          class="categoryImage"
          style="width: 180px; height: 180px"
          :src="category.image[0]"
          :previewSrcList="category.image"
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
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span class="categoryTitle">{{ category.name }}</span>
            </div>
          </template>
          <el-tabs tab-position="left" style="height: 200px" class="demo-tabs">
            <el-tab-pane label="简介"> {{ category.description }}</el-tab-pane>
            <el-tab-pane label="分类垃圾">
              <span
                class="details"
                v-for="(g, index) in category.details"
                :key="index"
              >
                <el-image
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
                <span class="garbageName">{{ g.name }}</span>
              </span>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-show="index % 2 != 0">
      <el-col :span="16" :offset="1">
        <el-card shadow="hover" class="box-card">
          <template #header>
            <div class="card-header">
              <span class="categoryTitle">{{ category.name }}</span>
            </div>
          </template>
          <el-tabs tab-position="right" style="height: 200px" class="demo-tabs">
            <el-tab-pane label="简介"> {{ category.description }}</el-tab-pane>
            <el-tab-pane label="分类垃圾">
              <span
                class="details"
                v-for="(g, index) in category.details"
                :key="index"
              >
                <el-image
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
                <span class="garbageName">{{ g.name }}</span>
              </span>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-image
          class="categoryImage"
          style="width: 180px; height: 180px"
          :src="category.image[0]"
          :previewSrcList="category.image"
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
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { Garbage, GarbageCategory } from "@/type/home";
import { getGarbageCategoryList } from "@/request/homeApi";
import { getGarbageListByNameOrCategory } from "@/request/garbageListApi";
import { getBroadcastList } from "@/request/broadcastListApi";
import { Broadcast } from "@/type/broadcastList";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "home",
  setup() {
    const garbageCategoryList: Array<GarbageCategory> = reactive([]);

    const broadcastList: Array<Broadcast> = reactive([]);

    const router = useRouter();

    function showDetails(id: number) {
      router.push({ name: "noticeDetails", params: { id } });
    }

    return {
      garbageCategoryList,
      ...toRefs(garbageCategoryList),
      broadcastList,
      showDetails,
    };
  },
  mounted() {
    getBroadcastList(1, 10).then(
      (res) => {
        // console.log(res);
        const data: Broadcast[] = res.data.data;
        data.forEach((d) => {
          this.broadcastList.push(d);
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getGarbageCategoryList().then(
      (res) => {
        const temp: Array<GarbageCategory> = res.data.data;
        temp.forEach((c) => {
          if (typeof c.image === "string") {
            c.image = new Array(c.image);
          }
          c.details = [];

          getGarbageListByNameOrCategory("", c.name, 1, 6).then(
            (res) => {
              // console.log(res.data.data);
              const g: Array<Garbage> = res.data.data;
              g.forEach((d) => {
                if (typeof d.image === "string") {
                  d.image = new Array(d.image);
                }
                c.details?.push(d);
              });
            },
            (err) => {
              console.log(err);
            }
          );

          this.garbageCategoryList.push(c);
        });
      },
      (err) => {
        console.log(err.data);
      }
    );
  },
});
</script>

<style lang="less" scoped>
.vedio {
  margin-top: 120px;

  .el-image {
    margin-top: 17%;
  }

  .box {
    height: 320px;
    overflow: hidden;
  }
}

.el-divider {
  margin-top: 100px;
  margin-bottom: 20px;
}

.broadcast {
  position: relative;
  height: 300px;
  margin-top: 30px;
  background-color: #ececec;
  padding: 30px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .more {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 13px;
  }

  p:hover {
    background-color: #f3f6f8;
  }

  p:hover .el-link {
    color: #4084cb;
  }

  p:hover .time {
    color: #4084cb;
  }

  p {
    margin: 0px;
    height: 30px;
    padding: 0px 10px;
    line-height: 30px;
    position: relative;
    color: #424243;

    .dot {
      width: 5px;
      height: 5px;
      position: absolute;
      display: block;
      top: 10px;
      left: 15px;
      background-color: #da4453;
    }

    .el-link {
      position: absolute;
      top: 3px;
      left: 35px;
      color: #424243;
      font-size: 17px;
      line-height: 20px;
    }

    .time {
      line-height: 20px;
      font-size: 15px;
      font-family: "PingFang SC";
    }
  }
}

.garbageCategoryList {
  margin-bottom: 170px;

  .el-row {
    margin: 50px auto;
  }

  .categoryImage {
    margin: 18%;
  }

  .el-tab-pane {
    line-height: 200px;
  }

  .details {
    position: relative;
    .el-image {
      margin-top: 10%;
      margin-left: 24px;
      border-radius: 100%;
      overflow: hidden;
      width: 80px;
      height: 80px;
    }

    .garbageName {
      position: absolute;
      left: 48px;
      bottom: -120px;
    }
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }
}
</style>