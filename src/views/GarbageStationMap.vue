<template>
  <el-row justify="center">
    <el-col :span="12">
      <h1 class="title">垃圾站地图</h1>
    </el-col>
  </el-row>
  <el-row justify="center">
    <el-col :span="23">
      <baidu-map
        @init="ready"
        @click="showPosition"
        @zoomend="changeStyle"
        class="map"
        :min-zoom="10"
        :max-zoom="20"
        scroll-wheel-zoom
        :zoom="zoom"
        :center="center.position"
      >
        <!-- 在左上角加入城市切换控件  -->
        <bm-city-list
          @changeAfter="changeCity"
          anchor="BMAP_ANCHOR_TOP_LEFT"
        ></bm-city-list>
        <!-- 在左下角加入比例尺控件  -->
        <bm-scale
          anchor="BMAP_ANCHOR_BOTTOM_LEFT"
          :offset="{
            width: 10,
            height: 10,
          }"
        ></bm-scale>
        <!-- 在右上角加入缩放控件  -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!-- 在右下角加入定位控件  -->
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
          @locationSuccess="handleLocation"
          :locationIcon="{
            url: 'https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/person.png',
            size: {
              width: 70,
              height: 70,
            },
            opts: {},
          }"
        ></bm-geolocation>

        <!-- 自定义空间(添加垃圾站) -->
        <bm-control
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :offset="{
            width: 30,
            height: 180,
          }"
        >
          <el-tooltip effect="light" placement="bottom">
            <template #content>
              <span v-if="!isClickAdd">进入添加垃圾站模式</span>
              <span v-else>返回</span>
            </template>
            <el-button
              v-show="checkRole()"
              @click="changeMode"
              class="btn_addStation"
              type="info"
              circle
              ><el-icon size="18" v-if="!isClickAdd"><Plus /></el-icon
              ><el-icon size="18" v-else><RefreshLeft /></el-icon
            ></el-button>
          </el-tooltip>
        </bm-control>

        <!-- 自定义空间(查找附近的垃圾站) -->
        <bm-control
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :offset="{
            width: 420,
            height: 10,
          }"
        >
          <el-tooltip effect="light" placement="bottom">
            <template #content>
              <span
                >输入距离(千米)，按回车键查询<br />查询你附近范围内的垃圾站</span
              >
            </template>
            <el-input-number
              @change="findNearStation"
              v-model="nearDistance"
              :max="10"
              :min="0"
              :precision="1"
              :step="0.1"
              :disabled="inputDisabled"
              step-strictly
              @keydown="inputLimit"
              @keydown.enter="findNearStation"
            />
          </el-tooltip>
        </bm-control>

        <!-- 垃圾站标识 -->
        <bml-marker-clusterer
          :averageCenter="true"
          :minClusterSize="2"
          :maxZoom="13"
        >
          <bm-marker
            v-for="(p, index) in points"
            @click="showInfoWindow(p)"
            :clicking="!isClickAdd"
            :key="index"
            :animation="p.position.animation"
            :position="p.position"
            :icon="{
              url: p.status
                ? require('@/assets/garbageCan.png')
                : require('@/assets/garbageCanFull.png'),
              size: {
                width: 40,
                height: 40,
              },
              opts: {},
            }"
          >
            <!-- 菜单 -->
            <bm-context-menu>
              <bm-context-menu-item
                iconUrl="http://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/update.png"
                :callback="updateStation"
                :disabled="!checkRole()"
                text="修改垃圾站"
              ></bm-context-menu-item>
              <bm-context-menu-item
                iconUrl="http://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/delete.png"
                :callback="deleteStation"
                :disabled="!checkRole()"
                text="删除垃圾站"
              ></bm-context-menu-item>
            </bm-context-menu>
          </bm-marker>
        </bml-marker-clusterer>

        <!-- 信息窗体 -->
        <bm-info-window
          :position="position"
          :width="0"
          :height="0"
          autoPan
          title="<p class='title'>垃圾站</p>"
          :show="infoWindowVisible"
        >
          <el-row justify="center">
            <el-col :span="24">
              <el-image
                :src="require('@/assets/garbageStation.png')"
                fit="contain"
              />
            </el-col>
          </el-row>
          <p class="status">
            状态:&nbsp;
            <el-tag v-if="status" type="success">可投递</el-tag>
            <el-tag v-else type="danger">不可投递</el-tag>
          </p>
          <p class="address">地址:&nbsp;{{ getFullAddress(address) }}</p>
          <p class="distance">距离:&nbsp;{{ distance }}&nbsp;m</p>

          <el-button-group>
            <el-row justify="center">
              <el-col :span="24">
                <el-button
                  v-show="!checkRole()"
                  :disabled="!infoWindow.status"
                  color="#F1F3F4"
                  class="delivery"
                  @click="showGarbageDelivery"
                  ><el-icon><Delete /></el-icon>投递</el-button
                >
                <el-button color="#F1F3F4" @click="getRoute"
                  ><el-icon color="#67C23A"><Location /></el-icon
                  >到这里去</el-button
                >
                <el-button
                  color="#F1F3F4"
                  class="btn_close"
                  @click="infoWindowVisible = false"
                  ><el-icon color="#F56C6C"><Close /></el-icon>关闭</el-button
                >
              </el-col>
            </el-row>
          </el-button-group>
        </bm-info-window>
      </baidu-map>
    </el-col>
  </el-row>

  <!-- 步行规划展示 -->
  <div class="routers" v-show="walkRouterList.length !== 0">
    <h1 class="title">
      步行前往 {{ getFullAddress(infoWindow.address) }} 路线
    </h1>
    <h4 class="details">{{ length }} | {{ time }}</h4>
    <div class="start">
      <el-image
        :src="require('@/assets/start.png')"
        fit="none"
        style="width: 25px; height: 10px"
      />{{ getFullAddress(center.address) }}
    </div>
    <div class="middle">
      <p v-html="r" v-for="(r, index) in walkRouterList" :key="index" />
    </div>
    <div class="end">
      <el-image
        :src="require('@/assets/end.png')"
        fit="none"
        style="width: 25px; height: 10px"
      />{{ getFullAddress(infoWindow.address) }}
    </div>
  </div>

  <el-dialog v-model="dialogVisible" width="35%" center align-center>
    <template #header>
      <h1 class="title">修改垃圾站信息</h1>
    </template>
    <el-form
      :model="updateGarbageStation"
      label-width="80px"
      class="form"
      size="default"
      status-icon
    >
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="地址" prop="address">
            <el-input disabled v-model="updateGarbageStation.address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="22">
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="updateGarbageStation.status"
              style="
                --el-switch-off-color: #ff4949;
                --el-switch-on-color: #13ce66;
              "
              :loading="loading"
              @change="switchChange($event, switchInit)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { BmlMarkerClusterer } from "vue-baidu-map-3x";
import {
  addGarbageStation,
  deleteGarbageStation,
  getGarbageStationListByAddress,
  getNearGarbageStationList,
  updateGarbageStationFunction,
} from "@/request/garbageStationMapApi";
import {
  Address,
  GarbageStation,
  GarbageStationForm,
  UpdateGarbageStationForm,
} from "@/type/garbageStationMap";
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref, defineComponent, toRefs } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/store/user";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "garbageStationMap",
  components: { BmlMarkerClusterer },
  setup(props) {
    let BMap: any = reactive({});
    let map: any = reactive({});
    let walk: any = reactive({});
    //地图缩放比例
    const zoom = ref(14);
    //起点(定位)
    let center: GarbageStationForm = reactive({
      position: { lat: 30.593098, lng: 114.305392 },
      address: {
        province: "",
        city: "",
        district: "",
        street: "",
        streetNumber: "",
      },
      status: true,
    });
    //距离
    let length = ref("");
    //时间
    let time = ref("");
    //垃圾站地理信息
    const points: Array<GarbageStation> = reactive([]);
    const infoWindowVisible = ref(false);
    const infoWindow: GarbageStation = reactive({
      id: "",
      distance: "",
      position: {
        lat: 0,
        lng: 0,
      },
      address: {
        province: "",
        city: "",
        district: "",
        street: "",
        streetNumber: "",
      },
      status: true,
    });

    const router = useRouter();

    const userStore = useUserStore();
    const { roleList } = storeToRefs(userStore);

    //步行路线集合
    const walkRouterList: string[] = reactive([]);

    const isClickAdd = ref(false);

    const nearDistance = ref(0.1);

    const inputDisabled = ref(false);

    const dialogVisible = ref(false);

    let updateGarbageStation: UpdateGarbageStationForm = reactive({
      id: "",
      address: "",
      status: true,
    });

    const switchInit = ref(true);

    const loading = ref(false);

    function ready(p: any) {
      // console.log(p);
      BMap = p.BMap;
      map = p.map;

      const geolocation = new BMap.Geolocation();
      // 开启SDK辅助定位
      geolocation.enableSDKLocation();
      //获取当前位置
      geolocation.getCurrentPosition(
        function (r: any) {
          // console.log(r);
          /*
                  变量名                    含义         值
          BMAP_STATUS_SUCCESS           表示检索成功     0
          BMAP_STATUS_CITY_LIST           城市列表       1
          BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知     2
          BMAP_STATUS_UNKNOWN_ROUTE     导航结果未知     3
          BMAP_STATUS_INVALID_KEY         非法密钥       4
          BMAP_STATUS_INVALID_REQUEST     非法请求       5
          BMAP_STATUS_PERMISSION_DENIED   没有权限       6
          BMAP_STATUS_SERVICE_UNAVAILABLE 服务不可用     7
          BMAP_STATUS_TIMEOUT               超时        8
        */
          const BMAP_STATUS_SUCCESS = 0;
          if (geolocation.getStatus() === BMAP_STATUS_SUCCESS) {
            // console.log(
            //   "GPS坐标定位(经纬度):" + r.point.lat + "," + r.point.lng,
            //   "地点:" +
            //     r.address.country +
            //     r.address.province +
            //     r.address.city +
            //     r.address.district +
            //     r.address.street +
            //     r.street_number +
            //     "号"
            // );

            center.position.lng = r.point.lng;
            center.position.lat = r.point.lat;
            center.address.province = r.address.province;
            center.address.city = r.address.city;
            center.address.district = r.address.district;
            center.address.street = r.address.street;
            center.address.streetNumber = r.address.street_number;

            if (
              typeof center.address.streetNumber === "string" &&
              center.address.streetNumber.indexOf("号") === -1
            ) {
              center.address.streetNumber += "号";
            }

            const address: Address = {
              province: center.address.province,
              city: center.address.city,
              district: "",
              street: "",
              streetNumber: "",
            };

            getGarbageStationListByAddress(address).then(
              (res) => {
                // console.log(res);
                if (res.data.data.length !== 0) {
                  res.data.data.forEach((t: any) => {
                    const o: GarbageStation = {
                      id: t.id,
                      position: {
                        lng: t.coordinates[0],
                        lat: t.coordinates[1],
                      },
                      address: t.address,
                      status: t.status,
                    };
                    points.push(o);
                  });
                }
              },
              (err) => {
                console.log(err);
              }
            );

            const icon = new BMap.Icon(
              "https://garbage-bucket.oss-cn-shanghai.aliyuncs.com/gcs/person.png",
              new BMap.Size(70, 70)
            );
            const marker = new BMap.Marker(r.point, {
              title: "起点",
              icon,
              enableClicking: false,
            });

            map.addOverlay(marker);
            map.panTo(r.point);
          } else {
            console.log("failed:" + geolocation.getStatus());
          }
        },
        {
          SDKLocation: true, //开启SDK辅助定位
          enableHighAccuracy: true, //要求浏览器获取最佳效果
          timeout: 5000, //获取位置允许的最长时间
          maximumAge: 1000, //多久更新获取一次位置
        }
      );
    }

    function showPosition(p: any) {
      // console.log("点击位置经纬度:" + p.point.lat + "," + p.point.lng);
      if (isClickAdd.value) {
        const myGeo = new BMap.Geocoder({ extensions_town: true });
        myGeo.getLocation(
          new BMap.Point(p.point.lng, p.point.lat),
          function (result: any) {
            // console.log(result);
            if (result) {
              // console.log(result);
              ElMessageBox.confirm(
                `你确定在${result.address}处添加垃圾站吗?`,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  draggable: true,
                }
              ).then(() => {
                const temp: GarbageStationForm = {
                  position: {
                    lng: p.point.lng,
                    lat: p.point.lat,
                  },
                  address: {
                    province: result.addressComponents.province,
                    city: result.addressComponents.city,
                    district: result.addressComponents.district,
                    street: result.addressComponents.street,
                    streetNumber: result.addressComponents.streetNumber,
                  },
                  status: true,
                };
                if (
                  typeof temp.address.streetNumber === "string" &&
                  temp.address.streetNumber.indexOf("号") === -1
                ) {
                  temp.address.streetNumber += "号";
                }

                addGarbageStation(temp).then(
                  (res) => {
                    // console.log(res);
                    if (res.data.code === 200) {
                      const t: any = res.data.data;
                      points.push({
                        id: t.id,
                        position: {
                          lng: t.coordinates[0],
                          lat: t.coordinates[1],
                        },
                        address: t.address,
                        status: t.status,
                      });
                      ElMessage.success({
                        message: "添加垃圾站信息成功!",
                        duration: 2000,
                        center: true,
                      });
                    } else {
                      ElMessage.error({
                        message: "添加垃圾站信息失败!!!",
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
            } else {
              console.log(result);
            }
          }
        );
      }
    }

    function showInfoWindow(g: GarbageStation) {
      // console.log(event);
      //清除上一次步行规划数据
      length.value = "";
      time.value = "";
      walkRouterList.splice(0, walkRouterList.length);
      if (Object.keys(walk).length !== 0) {
        walk.clearResults();
      }

      infoWindow.id = g.id;
      infoWindow.position = g.position;
      infoWindow.address = g.address;
      infoWindow.status = g.status;

      //计算两间距离
      infoWindow.distance = map
        .getDistance(
          new BMap.Point(center.position.lng, center.position.lat),
          new BMap.Point(infoWindow.position.lng, infoWindow.position.lat)
        )
        .toFixed(1);

      infoWindowVisible.value = true;
    }

    function showGarbageDelivery() {
      router.push({
        name: "addGarbageDelivery",
        query: { address: getFullAddress(infoWindow.address) },
      });
    }

    function getRoute() {
      map.centerAndZoom(center, zoom.value);
      walk = new BMap.WalkingRoute(map, {
        renderOptions: {
          map: map,
          selectFirstResult: true, //选择第一个检索结果
          autoViewport: true, //自动调整地图视野
        },
        onSearchComplete: (results: any) => {
          const walkRouter = results.getPlan(0).getRoute(0);
          //路线上关键点个数
          const count = walkRouter.getNumSteps();
          for (let i = 0; i < count; i++) {
            walkRouterList.push(walkRouter.getStep(i).getDescription(true));
          }
          length.value = results.getPlan(0).getDistance(true);
          time.value = results.getPlan(0).getDuration(true);
          // console.log("线路" + walkRouterList);
          // console.log("总距离:" + results.getPlan(0).getDistance(true));
          // console.log("总时间:" + results.getPlan(0).getDuration(true));
        },
      });
      walk.search(
        new BMap.Point(center.position.lng, center.position.lat),
        new BMap.Point(infoWindow.position.lng, infoWindow.position.lat)
      );
      // console.log(walk);
      infoWindowVisible.value = false;
    }

    function updateStation(p: any) {
      // console.log(p);
      const point: GarbageStation = points.filter((t) => {
        return (
          t.position.lat === p.target.OA.lat &&
          t.position.lng === p.target.OA.lng
        );
      })[0];

      updateGarbageStation.id = point.id;
      updateGarbageStation.address = getFullAddress(point.address);
      updateGarbageStation.status = point.status;
      dialogVisible.value = true;
    }

    function deleteStation(p: any) {
      // console.log(p);
      const point: GarbageStation = points.filter((t) => {
        return (
          t.position.lat === p.target.OA.lat &&
          t.position.lng === p.target.OA.lng
        );
      })[0];
      ElMessageBox.confirm(`你确定要删除此处垃圾站吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
      }).then(() => {
        deleteGarbageStation(point.id).then(
          (res) => {
            // console.log(res);
            if (res.data.code === 200) {
              points.forEach((t, index) => {
                if (t.id === point.id) {
                  points.splice(index, 1);
                }
              });
              ElMessage.success({
                message: "删除垃圾站信息成功!",
                duration: 2000,
                center: true,
              });
            } else {
              ElMessage.error({
                message: "删除垃圾站信息失败!!!",
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

    function changeMode() {
      isClickAdd.value = !isClickAdd.value;
      if (isClickAdd.value) {
        ElMessage.success({
          message: "进入添加垃圾站模式",
          duration: 2000,
          center: true,
        });
      } else {
        ElMessage.info({
          message: "退出添加垃圾站模式",
          duration: 2000,
          center: true,
        });
      }
    }

    function getFullAddress(address: Address) {
      return (
        address.province +
        address.city +
        address.district +
        address.street +
        address.streetNumber
      );
    }

    function handleLocation(p: any) {
      // console.log(p);
      center.position.lng = p.point.lng;
      center.position.lat = p.point.lat;
      center.address.province = p.addressComponent.province;
      center.address.city = p.addressComponent.city;
      center.address.district = p.addressComponent.district;
      center.address.street = p.addressComponent.street;
      center.address.streetNumber = p.addressComponent.street_number;
      if (
        typeof center.address.streetNumber === "string" &&
        center.address.streetNumber.indexOf("号") === -1
      ) {
        center.address.streetNumber += "号";
      }
    }

    function changeCity(p: any) {
      const city = document.getElementById("cur_city_spn")?.innerHTML;
      if (city) {
        const address: Address = {
          province: "",
          city: city,
          district: "",
          street: "",
          streetNumber: "",
        };

        getGarbageStationListByAddress(address).then(
          (res) => {
            // console.log(res);
            if (res.data.data.length !== 0) {
              res.data.data.forEach((t: any) => {
                points.splice(0, points.length);
                const o: GarbageStation = {
                  id: t.id,
                  position: {
                    lng: t.coordinates[0],
                    lat: t.coordinates[1],
                  },
                  address: t.address,
                  status: t.status,
                };
                points.push(o);
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }

    function findNearStation() {
      inputDisabled.value = true;
      getNearGarbageStationList(
        center.position,
        nearDistance.value * 1000
      ).then(
        (res) => {
          // console.log(res);
          points.splice(0, points.length);
          const result: GarbageStation[] = res.data.data;
          result.forEach((t: any) => {
            const o: GarbageStation = {
              id: t.id,
              position: {
                lng: t.coordinates[0],
                lat: t.coordinates[1],
                animation: "BMAP_ANIMATION_BOUNCE",
              },
              address: t.address,
              status: t.status,
            };
            points.push(o);
          });
          inputDisabled.value = false;
          return;
        },
        (err) => {
          console.log(err);
        }
      );

      setTimeout(() => {
        inputDisabled.value = false;
      }, 2000);
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

    function switchChange(val: boolean, switchInit: boolean) {
      // console.log(val, switchInit);
      if (!switchInit) return;
      loading.value = true;
      updateGarbageStationFunction(updateGarbageStation).then(
        (res) => {
          // console.log(res);
          points.forEach((t) => {
            if (t.id === updateGarbageStation.id) {
              t.status = updateGarbageStation.status;
            }
          });
          if (val) {
            ElMessage.success("垃圾站状态更改为可投递");
          } else {
            ElMessage.error("垃圾站状态更改为不可投递(已满)");
          }
          loading.value = false;
          switchInit = false;
        },
        (err) => {
          console.log(err);
        }
      );
      setTimeout(() => {
        loading.value = false;
        switchInit = false;
      }, 250);
    }

    function checkRole() {
      let result = false;
      roleList.value.forEach((r) => {
        if (r.role === "admin") {
          result = true;
        }
      });
      return result;
    }

    return {
      zoom,
      center,
      length,
      time,
      points,
      infoWindowVisible,
      infoWindow,
      ...toRefs(infoWindow),
      walkRouterList,
      isClickAdd,
      nearDistance,
      inputDisabled,
      dialogVisible,
      updateGarbageStation,
      switchInit,
      loading,
      ready,
      showPosition,
      showInfoWindow,
      showGarbageDelivery,
      getRoute,
      updateStation,
      deleteStation,
      changeMode,
      getFullAddress,
      handleLocation,
      changeCity,
      findNearStation,
      inputLimit,
      switchChange,
      checkRole,
    };
  },
  mounted() {},
});
</script>
<style lang="less" scoped>
.title {
  font-size: 21px;
  margin-bottom: 15px;
  color: #409eff;
}

.map {
  margin-bottom: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 6px rgba(0, 0, 0, 0.15);
  width: 100%;
  height: 480px;

  .BMap_noprint .el-button {
    width: 40px;
    height: 40px;
  }

  :deep(.anchorBL) {
    display: none;
  }

  :deep(.BMap_scaleCtrl) {
    display: inline;
  }

  :deep(p.title) {
    color: rgb(77, 77, 77);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    font-family: "OPPOSans-B";
  }

  :deep(.BMap_pop) {
    font-family: "OPPOSans-B";
  }

  :deep(.BMap_bubble_title) {
    text-align: center;
  }

  .el-image {
    width: 100%;
    height: 120px;
  }

  .status {
    font-size: 12px;
    line-height: 18px;
  }

  .address {
    font-size: 12px;
    line-height: 18px;
    color: rgb(77, 77, 77);
  }

  .distance {
    font-size: 12px;
    line-height: 18px;
    color: rgb(127, 127, 127);
  }

  .delivery {
    color: #000;
  }

  .el-button {
    margin-left: 0px;
    font-size: 13px;
    font-family: "Furore";
    height: 30px;
    margin-bottom: 10px;
  }

  .el-icon {
    margin-right: 2px;
  }

  :deep(.BMap_contextMenu div[unselectable="on"]) {
    height: 20px;
    text-align: center;
    color: #000;
    line-height: 20px;
  }

  :deep(.BMap_contextMenu div:first-child[unselectable="on"]) {
    border-bottom: 1px solid #dfe2e5;
  }
}

.routers {
  margin-top: 30px;
  text-align: left;

  .title {
    color: #000;
    font-size: 19px;
  }

  .details {
    width: 500px;
    color: #424243;
    padding-left: 15px;
    background-color: #e5ecf9;
    line-height: 40px;
  }

  p {
    width: 500px;
    border: 1px solid #dfe2e5;
    border-bottom: none;
    margin: 0px;
    padding-left: 7px;
    line-height: 35px;
  }

  p:last-child {
    border: 1px solid #dfe2e5;
  }

  p:nth-child(odd) {
    background-color: #f6f8fa;
  }

  .start {
    margin-bottom: 25px;
  }

  .end {
    margin-top: 25px;
  }
}

.form {
  .el-input {
    width: 250px;
  }
}
</style>