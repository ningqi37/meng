<script setup>
import { ref } from 'vue';
import emitter from '@/utils/emitter'
let data = ref({
    isDisplay_1: false,
    isDisplay_2: true,
    isDisplay_3: true,
    isDisplay_4: true,
    isDisplay_5: true,
    isDisplay_6: true,
})
var path = [0,3,2]
var index = 0
var disabledButton = ref(false)
function showPoint() {
    var flag = path[index]
    index = (index + 1) % path.length
    console.log(flag + 1)
    switch (flag) {
        case 0:
            reset();
            data.value.isDisplay_1 = !data.value.isDisplay_1;
            break;
        case 1:
            reset();
            data.value.isDisplay_2 = !data.value.isDisplay_2;
            break;
        case 2:
            reset();
            data.value.isDisplay_3 = !data.value.isDisplay_3;
            break;
        case 3:
            reset();
            data.value.isDisplay_4 = !data.value.isDisplay_4;
            break;
        case 4:
            reset();
            data.value.isDisplay_5 = !data.value.isDisplay_5;
            break;
        case 5:
            reset();
            data.value.isDisplay_6 = !data.value.isDisplay_6;
            break;
    }
    disabledButton.value = true
    setTimeout(() => {
        emitter.emit('flag', flag + 1)
        disabledButton.value = false
      }, 400);

}
const reset = () => {
    (data.value.isDisplay_1 = true),
    (data.value.isDisplay_2 = true),
    (data.value.isDisplay_3 = true),
    (data.value.isDisplay_4 = true),
    (data.value.isDisplay_5 = true),
    (data.value.isDisplay_6 = true);
}
const randomNum = () => {
    return Math.round(Math.random() * 5);
}
</script>

<template>
    <div class="box">
        <div class="first face" v-bind:class="{ isDisplay: data.isDisplay_1 }">
            <span class="pip"></span>
        </div>
        <div class="second face" v-bind:class="{ isDisplay: data.isDisplay_2 }">
            <span class="pip"></span>
            <span class="pip"></span>
        </div>
        <div class="third face" v-bind:class="{ isDisplay: data.isDisplay_3 }">
            <span class="pip"></span>
            <span class="pip"></span>
            <span class="pip"></span>
        </div>
        <div class="fourth face" v-bind:class="{ isDisplay: data.isDisplay_4 }">
            <div class="column">
                <span class="pip"></span>
                <span class="pip"></span>
            </div>
            <div class="column">
                <span class="pip"></span>
                <span class="pip"></span>
            </div>
        </div>
        <div class="fifth face" v-bind:class="{ isDisplay: data.isDisplay_5 }">
            <div class="column">
                <span class="pip"></span>
                <span class="pip"></span>
            </div>
            <div class="column">
                <span class="pip"></span>
            </div>
            <div class="column">
                <span class="pip"></span>
                <span class="pip"></span>
            </div>
        </div>
        <div class="sixth face" v-bind:class="{ isDisplay: data.isDisplay_6 }">
            <div class="column">
                <span class="pip"></span>
                <span class="pip"></span>
                <span class="pip"></span>
            </div>
            <div class="column">
                <span class="pip"></span>
                <span class="pip"></span>
                <span class="pip"></span>
            </div>
        </div>
        <el-button @click="showPoint" round :disabled=disabledButton >投掷骰子</el-button>

    </div>
</template>

<style>
.box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.pip {
    display: block;
    margin: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: whitesmoke;
}

.face {
    margin: 16px;
    padding: 12px;
    background-color: #444;
    width: 72px;
    height: 72px;
    object-fit: contain;

    border-radius: 10%;
}

.first {
    display: flex;
    align-items: center;
    justify-content: center;
}

.second {
    display: flex;
    justify-content: space-between;
}

.second .pip:nth-of-type(2) {
    align-self: flex-end;
}

.third {
    display: flex;
    justify-content: space-between;
}

.third .pip:nth-of-type(2) {
    align-self: center;
}

.third .pip:nth-of-type(3) {
    align-self: flex-end;
}

.fourth {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.fourth .column,
.sixth .column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.fifth {
    display: flex;
    justify-content: space-between;
}

.fifth .column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.fifth .column:nth-of-type(2) {
    display: flex;
    justify-content: center;
}

.sixth {
    display: flex;
    justify-content: space-between;
}

.isDisplay {
    display: none;
}
</style>