<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function To_RedHistory() {
    // showAnimation.value = false;
    router.push('/history');
    // console.log("点击了");
    // setTimeout(() => {
    //     router.push('/skybox');
    // },1000);
}
function To_RedTravel() {
    router.push('/travel');

}
function To_ShowData() {
    router.push('/map/hubei');
}
</script>
<template>
    <transition name="fade">
        <div class="progress-bar-box">
            <button @click="To_RedHistory" class="to_RedHistory">红色历史</button>
            <button @click="To_RedTravel" class="to_RedTravel">红色征程</button>
            <button @click="To_ShowData" class="to_ShowData">数据展示</button>
        </div>
    </transition>
</template>