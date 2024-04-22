<template>
    <div class="left-graph" style = "display:flex; flex-direction: column;width:390px ">
            <HB_leftgraph1 style="flex: 1;"></HB_leftgraph1>
            <HB_leftgraph4 style="flex: 1;"></HB_leftgraph4>
            <HB_leftgraph2 style="flex: 1;"></HB_leftgraph2>

    </div>
</template>
<script setup>
import HB_leftgraph1 from './HB_leftgraph1.vue';
import HB_leftgraph2 from './HB_leftgraph2.vue';
import HB_leftgraph4 from './HB_leftgraph4.vue';
</script>
<style>
.title {
    margin: 5px 0px 10px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: aliceblue;
}

</style>
