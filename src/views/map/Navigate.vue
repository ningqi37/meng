<template>
    <div>
        <div id="map"></div>
        <div id="panel"></div>
        <el-row class="bottom-center">
            <el-button plain @click="dialogVisible = true">导航</el-button>
            <el-button @click="togglePointLayer">人流量</el-button>
        </el-row>
        <el-dialog v-model="dialogVisible" title="请输入出发点和目的地" width="500" draggable>
            <el-form :model="form" label-width="80px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="出发点" class="input-wrapper">
                            <el-input v-model="form.origin.value" placeholder="请输入出发点"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="目的地" class="input-wrapper">
                            <el-input v-model="form.destination.value" placeholder="请输入目的地"
                                ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleNavigation(form)" style="margin-left: 37px;">出发</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import emitter from '@/utils/emitter'
const location = ref(null);
const address = ref('');
const destinationpoint = ref();
const apiKey = "7c699e7b0b0b1aa1832646ba79e341c3";
const getLocation = async () => {
    try {
        const position = await getCurrentPosition();
        location.value = position;
    } catch (error) {
        console.error('获取位置信息失败：', error);
        // 设置默认值
        location.value = null;
    }
};

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('浏览器不支持地理位置获取。'));
        }
    });
};
import { useAddressStore } from '@/stores/address.js';
const addressStore = useAddressStore();
const getcity =async()=>{
    await getLocation()
    console.log(location.value.coords.longitude)
    console.log(location.value.coords.latitude)

    const url = "https://restapi.amap.com/v3/geocode/regeo";
    const params = new URLSearchParams({
      output: 'json',
      location: `${location.value.coords.longitude},${location.value.coords.latitude}`,
      key: apiKey,
      radius: '1000',
      extensions: 'regeocode'
    });
  
    try {
      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
    //   console.log(data);
      address.value = data.regeocode.formatted_address;
    } catch (error) {
      console.error('Error:', error);
    }

    console.log(address.value)
    destinationpoint.value = addressStore.findAddress(0)
    console.log(destinationpoint.value)
}
getcity()

import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
// import jsonData from "@/assets/boundsHubei.json"

let map = null;
let loca = null;
let isPointLayerVisible = ref(false); // 添加一个变量来跟踪点图层的显示状态

onMounted(() => {
    AMapLoader.reset()
    AMapLoader.load({
        key: "9d9704b872a88fca59adc67ef0dfe83f", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 插件列表
        AMapUI: {
            version: "1.1",
            plugins: ["overlay/SimpleMarker"],
        },
        Loca: { version: "2.0" },
        callback: function () {
            // 在 API 加载完成后执行相关代码
            console.log("高德地图 JavaScript API 加载完成");
            // 实例化地图等操作
        }
    })
        .then((AMap) => {
            map = new AMap.Map("map", {
                resizeEnable: true,
                zoom: 6.9,
                center: [112.222412, 30.653323], // 初始化地图中心点位置
                mapStyle: 'amap://styles/45311ae996a8bea0da10ad5151f72979',
            });

            loca = new Loca.Container({
                map,
                opacity: 1,
            });

            var geo = new Loca.GeoJSONSource({
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/cuisine.json',
            });

            var pl = window.pl = new Loca.PointLayer({
                zIndex: 10,
                blend: 'lighter',
            });

            var style = {
                radius: 5.2,
                unit: 'px',
                color: '#eb1818',
                borderWidth: 0,
                blurWidth: 3.7,
            }
            pl.setSource(geo);
            pl.setStyle(style);
            loca.add(pl);

            pl.addAnimate({
                key: 'radius',
                value: [0, 1],
                duration: 500,
                easing: 'Linear',
                transform: 2000,
                random: true,
                delay: 8000,
                yoyo: true,
                repeat: 100000
            });
            // var dat = new Loca.Dat();
            // dat.addLayer(pl);
            // 初始状态下隐藏点图层
            loca.remove(pl);
        });
});

// 切换点图层的显示状态
const togglePointLayer = () => {
    if (isPointLayerVisible.value) {
        loca.remove(pl); // 隐藏点图层
    } else {
        loca.add(pl); // 显示点图层
    }
    isPointLayerVisible.value = !isPointLayerVisible.value; // 切换显示状态
};

const dialogVisible = ref(false)
const form = {
    origin: address,
    destination: destinationpoint

};

const handleNavigation = (form) => {
    const originValue = form.origin.value;
    const destinationValue = form.destination.value;

    if (!originValue || !destinationValue) {
        alert('请输入出发点和目的地');
        return;
    }

    // 查询驾车路线
    AMap.plugin('AMap.Driving', function () {
        var driving = new AMap.Driving({
            map: map,
            panel: "panel"
        });

        driving.search([
            { keyword: originValue, city: originValue.substring(0, 3) },
            { keyword: destinationValue, city: "湖北省" }
        ], function (status, result) {
            if (status === 'complete') {
                console.log('绘制驾车路线完成');
            } else {
                console.error('获取驾车数据失败：' + result);
            }
        });
    });

    // 查询公交路线
    AMap.plugin('AMap.Transfer', function () {
        var transfer = new AMap.Transfer({
            map: map,
            panel: "panel"
        });

        transfer.search([
            { keyword: originValue, city: originValue.substring(0, 3) },
            { keyword: destinationValue, city: "湖北省" }
        ], function (status, result) {
            if (status === 'complete') {
                console.log('绘制公交路线完成');
            } else {
                console.error('获取公交数据失败：' + result);
            }
        });
    });
    // 导航完成后关闭弹窗
    dialogVisible.value = false;
};

onUnmounted(() => {
    map?.destroy();
});
</script>

<style scoped>
#map {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#panel {
    position: fixed;
    background-color: white;
    max-height: 75%;
    overflow-y: auto;
    top: 10%;
    right: 7%;
    width: 280px;
}

#panel .amap-call {
    background-color: #009cf9;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

#panel .amap-lib-driving {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
}

.bottom-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    /* 距离底部的距离 */
    text-align: center;
    /* 水平居中 */
}

.dialog-footer {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 12px;
    /* 距离底部的距离 */
    text-align: center;
    /* 水平居中 */
}

.input-wrapper {
    margin-bottom: 37px;
}
</style>