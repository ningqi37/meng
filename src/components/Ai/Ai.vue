<template>
    <div title="弹窗" :visible="detailVisible" width="35%" class="wind" style="background-color: #222733">
        <iframe src="http://112.124.58.63:5173/" frameborder="0" class="aibox"></iframe>
    </div>
</template>

<script>
export default {
    name: "Ai",
    data() {
        return {
            detailVisible: false,
        };
    },
    methods: {
        //3.定义一个init函数，通过设置detailVisible值为true来让弹窗弹出，这个函数会在父组件的方法中被调用
        init() {
            this.detailVisible = true;
        },
    },
};
</script>

<style>
.wind {
    position: absolute;
    width: 370px;
    /* background: white;
    right: 110px;
    top: 20px;
    border-radius: 30px;
    box-shadow: 0px 0px 10px #222733;
    z-index: 9999999999999;
    overflow: hidden;
    background-color: #222733; */
}

.aibox {
    width: 100%;
    height: 100%;
}
</style>
