<script setup>
import GameVue from '@/components/Game/Game.vue'
import { ref } from 'vue'

</script>

<template>
    <el-backtop :right="100" :bottom="100" />
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router="true"
        collapse-transition="false" @select="handleSelect">
        <el-menu-item index="history">
            <h3>红色历史</h3>
        </el-menu-item>
        <el-menu-item index="travel">
            <h3>红色征程</h3>
        </el-menu-item>

        <el-sub-menu :popper-offset="0">
            <template #title>
                <h3>数据展示</h3>
            </template>
            <div style="max-height: 200px; overflow-y: auto;">
                    <el-menu-item style="height: 50px;" index="map/hubei">
                        <h4>湖北省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>北京市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>天津市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>河北省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>山西省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>内蒙古自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>辽宁省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>吉林省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>黑龙江省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>上海市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>江苏省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>浙江省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>安徽省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>福建省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>江西省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>山东省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>河南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>湖南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>广东省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>广西壮族自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>海南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>重庆市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>四川省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>贵州省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>云南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>西藏自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>陕西省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>甘肃省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>青海省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>宁夏回族自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>新疆维吾尔自治区</h4>
                    </el-menu-item>
            </div>

        </el-sub-menu>

        <el-menu-item index="article/category">
            <h3>个人中心</h3>
        </el-menu-item>
    </el-menu>
    <br>
    <GameVue></GameVue>
    <!-- <video id="video" src="@/assets/video/history.mp4" controls="controls" autoplay="autoplay"></video> -->

    
    

    

</template>

<style scoped>
/* .background {
    padding: 0;
    margin: 0;
    height: 1000px;
    background: url("../assets/image/history_background.png") no-repeat center center fixed;
    background-size: cover;
    opacity: 1;
} */
.el-menu {

width: 100%;
/* justify-content: center; */
margin-right: 0;
align-items: center;
height: 11vh;
background: url("../assets/image/history_header.png");
background-size: 100% 100%;

.el-menu-item {
    width: 10vw;
    height: 11vh;
    left: 59vw;

    h3 {
        z-index: 1;
        width: 195px;
        height: 100px;
        line-height: 100px;
        color: #be8686;
        text-align: center;
        font-size: 19px;
        /* transition: 0.36s; */
    }
}

.el-sub-menu {
    width: 10vw;
    height: 11vh;
    left: 59vw;
    position: relative;

    h3 {
        z-index: 1;
        width: 195px;
        height: 100px;
        line-height: 100px;
        color: #be8686;
        text-align: center;
        font-size: 19px;
        /* transition: 0.36s; */
    }

}
}
</style>