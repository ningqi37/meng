<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';

import { searchWeather } from '@/api/home.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import left_graph from '@/components/Graph/left_graph.vue';
import Ai from "@/components/Ai/Ai.vue";
import avatar from '@/assets/image/default.png'
import emitter from '@/utils/emitter'

import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
//调用函数,获取用户详细信息
const getUserInfo = async () => {
    //调用接口
    let result = await userInfoService();
    //数据存储到pinia中
    await userInfoStore.setInfo(result.data);
}


//条目被点击后,调用的函数
import { useRouter } from 'vue-router'
const router = useRouter();


// 系统时间
const systemTime = ref(
    {
        timer: null,
        time: "",
        date: "",
    }
)

const AiVisible = ref("true")  // 控制显示AI文字还是图片
const isRotated = ref("false")  // 控制显示AI文字还是图片


// 天气信息
const weatherData = ref(
    {
        cityName: '武汉市',
        provinceName: '湖北省',
        weather: '',
        icon: ''
    }
)

const pointer = ref('none')

// 调用获取天气信息函数
const getWeather = async () => {
    let result = await searchWeather(weatherData.value.cityName, weatherData.value.admName);
    weatherData.value.weather = result.weather
    weatherData.value.icon = result.icon
}

const showAiWindow = () => {
    AiVisible.value = !AiVisible.value; // 切换显示状态
    isRotated.value = !isRotated.value; // 切换旋转状态
}



// 日期规格化
const dateFormat = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    systemTime.value.date = year + "." + month + "." + day + " " + "星期" + "日一二三四五六".charAt(date.getDay());
    systemTime.value.time = hours + ":" + minutes + ":" + seconds;
}
const dataDestroy = () => {
    // 在Vue实例销毁前，清除我们的定时器
    if (this.systemTime.timer) {
        clearInterval(this.systemTime.timer);
    }
}

// let screenWidth = document.documentElement.clientWidth;
// let screenHeight = document.documentElement.clientHeight;
// // 获取鼠标位置
// function handleMouseMove(event) {
//     const y = screenHeight - 90
//     if (event.pageX >= 400 && event.pageX <= screenWidth - 380 && event.pageY <= y) {
//         pointer.value = 'none'
//     }
//     else {
//         pointer.value = 'auto'
//     }
// }


onMounted(() => {
    getUserInfo();
    dateFormat()
    getWeather()
    systemTime.timer = setInterval(() => {
        dateFormat();
    }, 1000);
    console.log('Component mounted');
});
//获取新闻信息
import { searchNew } from '@/api/article.js'
//返回员工信息
const limitIndex = 4;
const newsData = ref();
const articleCategoryList = async () => {
    const parser = new DOMParser();
    let result = await searchNew();
    const doc = parser.parseFromString(result.data, 'text/html');
    const items = doc.querySelectorAll('.list-b li');
    // console.log(doc);
    newsData.value = Array.from(items).map(item => {
        return {
            // title:item.querySelector('h4 a').innerText.trim(),
            title: item.querySelector('h4 a').getAttribute('title'),
            link: item.querySelector('h4 a').getAttribute('href'),
        };
    });
    console.log(newsData.value[1].title);
}
articleCategoryList()
//进场动画
const showAnimation = ref(true);
function stopAnimation() {
    showAnimation.value = false;
}
setTimeout(() => {
    stopAnimation();
    console.log('动画结束');
}, 2000);
//消除定时器

const showData = ref({
    asideShow: true
})

function go_trip() {
    router.push('/navigate');
}
function personal_center() {
    router.push('/article/category');
}
function show() {
    showData.value.asideShow = !showData.value.asideShow;
    emitter.emit('show_bigscreen')    
}

emitter.on('close_bigscreen', () => {
    showData.value.asideShow = !showData.value.asideShow;
    console.log('关闭大屏');  
})
</script>


<template>
    <!-- 进场动画 -->
    <!-- <transition name="fade">
        <div v-if="showAnimation" class="progress-bar-box">
        </div>
    </transition> -->

    <!-- @mousemove="handleMouseMove($event)" -->
    <div class="layout-container">
        <RouterView></RouterView>

        <!-- <div class="overlay-component" :style="{ 'pointer-events': pointer }"> -->
        <div class="overlay-component">
            <el-container class="in-container">
                <el-header style="flex: 1;">
                    <span style=" width: 100%;">
                        <!-- 上右下左 -->
                        <span style="position: absolute; left: 8vw; top: 2vh; color:bisque;">
                            <span>{{ systemTime.date }}&nbsp;&nbsp;</span>
                            <span>{{ systemTime.time }}&nbsp;&nbsp;</span>
                        </span>
                        <span style="position: absolute; right: 8vw; top: 2vh; color: bisque;">
                            <span>{{ weatherData.provinceName }}&nbsp;&nbsp;</span>
                            <span>{{ weatherData.cityName }}&nbsp;&nbsp;</span>
                            <span>{{ weatherData.weather }}℃&nbsp;&nbsp;</span>
                            <i :class="weatherData.icon"></i>
                        </span>
                    </span>
                    <!-- <el-dropdown placement="bottom-end" @command="handleCommand">
                        <span class="el-dropdown__box">
                            <el-avatar :src="userInfoStore.info.image ? userInfoStore.info.image : avatar" />
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="favor" :icon="Management">我的收藏</el-dropdown-item>
                                <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                                <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                                <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
                                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
</el-dropdown> -->
                </el-header>
                <el-container style="flex: 10;">
                    <el-aside v-if="showData.asideShow" width="390px">
                        <left_graph></left_graph>
                    </el-aside>
                    <el-container>
                        <el-main>
                            <img v-if="showData.asideShow" src="../assets/HomeImage/province.png" style="width: 50px;height:auto;" alt="">
                        </el-main>
                        <el-footer>
                            <div v-if="showData.asideShow" class="center-btns">
                                <button v-if="showData.asideShow" class="btn btn1" @click="showAiWindow()"><img
                                        src="~@/assets/image/image_button/Ai.png" alt="" /></button>
                                <!-- <button class="btn btn2" @click="traffic_flow()"><img src="~@/assets/image/image_button/navigation.png"
                                        alt="" /></button> -->
                                <button v-if="showData.asideShow" class="btn btn3" @click="personal_center()"><img
                                        src="~@/assets/image/image_button/personal.png" alt="" /></button>
                                <!-- <button class="btn btn4" @click="people_out()"><img src="~@/assets/image/image_button/personal.png"
                                        alt="" /></button> -->
                                <button v-if="showData.asideShow" class="btn btn5" @click="go_trip()"><img
                                        src="~@/assets/image/image_button/navigation.png" alt="" /></button>
                                <img v-if="showData.asideShow" src="~@/assets/image/image_button/showMore.png" @click="show()" alt=""
                                    class="all" />

                            </div>
                            <!-- ai -->
                            <!-- <div @click="showAiWindow()" class="ai-btn">
                                <transition name="fade">
                                    <span v-if="AiVisible">
                                        <img src="~@/assets/image/AI.png" alt="" />
                                    </span>
                                    <span v-else>
                                        <img :class="{ rotate: isRotated }" class="ai-image"
                                            src="~@/assets/image/AI1.png" alt="" />
                                    </span>
                                </transition>
                            </div>
                            <el-button @click="go_trip()" type="primary" :icon="Edit" circle
                                style="height: 60px;width: 60px;" />
                            <el-button @click="personal_center()" type="primary" :icon="Message" circle
                                style="height: 60px;width: 60px;" /> -->
                        </el-footer>
                    </el-container>


                    <el-aside  v-if="showData.asideShow" width="370px">
                        <Ai v-if="!AiVisible" ref="ai" style="height: 90%;"></Ai>
                        <el-card v-if="AiVisible" style="flex: 4;">
                            <template #header>红色旅游</template>
                            红色旅游是指以中国革命历史和红色文化为主题的旅游活动。这种旅游形式主要是为了弘扬革命传统、传播红色文化、弘扬爱国主义精神，让游客更加深入地了解中国革命历史，感受革命先烈的英勇事迹。
                        </el-card>
                        <el-card v-if="AiVisible" style="flex: 6;display: flex;flex-direction: column; ">
                            <template #header>红色时事</template>
                            <el-carousel style="flex: 1;" autoplay indicator-position="none" direction='vertical'>
                                <el-carousel-item style="height: 100%">
                                    <el-card class="news-card">
                                        <div v-for="(item, index) in newsData" :key="index">
                                            <div v-if="index < limitIndex" class="news-item">
                                                <span>
                                                    <img src="../assets/image/五角星圆角.png">
                                                    {{ item.title }}
                                                </span>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-carousel-item>
                                <el-carousel-item style="height: 100%;">
                                    <el-card class="news-card">
                                        <div v-for="(item, index) in newsData" :key="index">
                                            <div v-if="index >= limitIndex" class="news-item">
                                                <span>
                                                    <img src="../assets/image/五角星圆角.png">
                                                    {{ item.title }}
                                                </span>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-carousel-item>
                            </el-carousel>
                        </el-card>
                    </el-aside>

                </el-container>
            </el-container>
        </div>
    </div>


</template>

<style lang="scss" scoped>
.layout-container {

    height: 100vh;
    // background-color: rgba(156, 32, 32, 0.3);
    background-image: url('../assets/HomeImage/background.png');
    background-size: 100% 100%;
}


.ai-btn {
    position: relative;
    width: 60px;
    height: 60px;
    //内边距右侧
    margin-right: 20px;
    z-index: 2;
    color: white;
    border-radius: 50%;
    background-color: #444653;
    box-shadow: 0px 0px 10px #444653;
    user-select: none;
}

.ai-btn img {
    width: 35px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.overlay-component {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    // background-color: rgba(156, 32, 32, 0.3);

    /* 设置较大的 z-index 值以覆盖在基础组件上方 */
    /* 覆盖组件样式 */
}

.in-container {

    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    // background-color: rgba(156, 32, 32, 0.5);

    .el-header {
        height: 70px;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-image: url('../assets/HomeImage/header.png');

        .el-dropdown__box {

            align-items: center;
            display: flex;
            margin-bottom: 12px;
            margin-right: 0px;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }

    }

    .el-aside {
        // background-color: rgba(119, 59, 59, 0.5);
        background-image: url('../assets/HomeImage/table.png');
        //透明度
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        background-size: 100% 100%;

        .el-card {
            background-color: rgba(255, 255, 255, 0);
            color: antiquewhite
        }
    }

    .el-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        // height: 80px;
        font-size: 25px;
        color: #666;

        // background-color: rgba(156, 32, 32, 0.5);
        .center-btns {
            position: absolute;
            left: 50%;
            bottom: 50px;
            z-index: 999;
            width: 350px;
            height: 120px;
            transform: translate(-50%);
        }

        .center-btns .btn {
            position: absolute;
            border: 0px;
            cursor: pointer;
            filter: drop-shadow(0px 0px 10px #b02505);

            background-color: transparent;
        }

        .center-btns .btn1:active,
        .center-btns .btn5:active,
        .center-btns .btn5:active {
            transform: scale(0.96);
            transition: transform 0.3s ease;
        }

        .center-btns .btn1 {
            left: 0;
            top: 50%;

        }

        .center-btns .btn2 {
            left: 50%;
            transform: translate(-200%, 0);
            top: -13px;
        }

        .center-btns .btn2:active {
            transform: translate(-200%, 0) scale(0.96);
        }

        .center-btns .btn3 {
            left: 50%;
            transform: translate(-50%, 0);
            top: -17px;
        }

        .center-btns .btn3:active {
            transform: translate(-50%, 0) scale(0.96);
        }

        .center-btns .btn4 {
            left: 50%;
            transform: translate(100%);
            top: -10px;
        }

        .center-btns .btn4:active {
            transform: translate(100%, 0) scale(0.96);
        }

        .center-btns .btn5 {
            right: 0;
            top: 50%;
        }

        .center-btns img {
            width: 80px;
            z-index: 5;
        }

        .center-btns .all {
            width: 150px;
            height: auto;
            position: absolute;
            left: 50%;
            top: 60%;
            // bottom: 0;
            cursor: pointer;
            transform: translate(-50%, 0);
            transition: transform 0.3s ease;
            z-index: 5;
        }

        .center-btns .all:hover {
            filter: drop-shadow(0px 0px 10px #c02303);
            z-index: 5;
        }

        .center-btns .all:active {
            transform: translate(-50%, 0) scale(0.9);
            transform-origin: center center;
            z-index: 5;
        }

    }

    .news-card {
        height: 100%;
        border: 0px solid #000;
        border-color: #FF0000;
        // padding: 20px;
    }

    .news-item {
        padding: 3px;
        margin-bottom: 15px;
        display: block;
        font-size: 16px;
        // color: #333;
        line-height: 1.5;
        background-color: #814d4d;
        border-radius: 5px;
    }

    .news-item span {
        display: block;
        overflow: visible;
        text-overflow: ellipsis;
        cursor: pointer;
        // white-space: nowrap;
    }

    .news-item img {
        height: 16px;
        width: 16px;
    }
}

.left-graph {
    position: absolute;
    top: 65px;
    z-index: 999;
    border-radius: 8px;
    border: 1px solid #ffffff0f;
    box-sizing: border-box;
}
</style>