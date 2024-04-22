<template>
    <div class="left_graph">
        <div class="title">
            {{ tit }}
        </div>
        <br>
        <div id="HB_leftgraph1" style="width: 388px;height: 190px;"></div>
    </div>

</template>


<script setup name="leftgraph1">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
const allData = [
    {
        "name": "武汉",
        "value": 1880.82
    },
    {
        "name": "荆州",
        "value": 2000.9
    },
    {
        "name": "天门",
        "value": 871.5
    },
    {
        "name": "黄冈",
        "value": 1273.74
    },
    {
        "name": "荆门",
        "value": 1107.89
    },
    {
        "name": "十堰",
        "value": 1201.2
    },
];
const tit = "湖北各市红色景区年均人流量(市/万人)";
const showDrop = ref(false);
const startValue = ref(0);
const endValue = ref(0);
const timerId = ref();
let chartInstance = ref();
//声明周期函数，自动执行初始化
onMounted(() => {
    init();
    updateChart();
});

function init() {
    chartInstance = echarts.init(document.getElementById("HB_leftgraph1"));
    const initOption = {
        grid: {     
            top: "8%",
            left: "5%",
            right: "5%",
            bottom: "5%",
            containLabel: true,
        },
        tooltip: {
            show: true,
        },
        xAxis: {
            type: "category",
            axisLabel: {
                setInterval: 0,
                // rotate:45,
                fontSize: 14,
                color: 'rgba(255,255,255,0.8)',
            }
        },
        yAxis: {
            value: "value",
        },
        series: [
            {
                type: "bar",
                label: {
                    show: true,
                    position: "top",
                    color: "white",
                    rotate: 30,
                },
            }
        ],
    };
    chartInstance.setOption(initOption);
    // 鼠标经过关闭 动画效果
    chartInstance.on("mouseover", () => {
        clearInterval(timerId.value);
    });
    // 鼠标离开 开启动画效果
    chartInstance.on("mouseout", () => {
        startInterval();
    });
    console.log("图标初始化了");
}
// 更新图表配置项
function updateChart() {
    // 渐变色数组
    const colorArr = [
        ["orange", "red"],
        ["yellow", "orange"],
        ["#f8c291", "#b71540"],
    ];
    // const colorArr = [
    //   ['#b8e994', '#079992'],
    //   ['#82ccdd', '#0a3d62'],
    //   ['#f8c291', '#b71540'],
    // ]
    // 所有省份组成的数组
    const provinceInfo = allData.map(item => item.name);
    // 所有省份对应的销售金额
    const valueArr = allData.map(item => item.value)
    const dataOption = {
        xAxis: {
            data: provinceInfo,
        },
        dataZoom: {
            // 区域缩放组件
            show: false,
            startValue: startValue.value,
            endValue: endValue.value,
        },
        series: [
            {
                data: valueArr,
                itemStyle: {
                    color: arg => {
                        let targetColorArr = ref(0);
                        if (arg.value > 1500) {
                            targetColorArr.value = colorArr[0];
                        } else if (arg.value > 1000) {
                            targetColorArr.value = colorArr[1];
                        } else {
                            targetColorArr.value = colorArr[2];
                        }

                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            // 0%
                            { offset: 0, color: targetColorArr.value[0] },
                            // 100%
                            { offset: 1, color: targetColorArr.value[1] },
                        ]);
                    },
                },
            },
        ],
    };
    chartInstance.setOption(dataOption);

}
// 根据图标容器的宽度 计算各属性、标签、元素的大小
function screenAdapter() {
    const titleFontSzie = ($refs.rankRef.offsetWidth / 100) * 3.6;

    const adapterOption = {
        title: {
            textStyle: {
                fontSize: (titleFontSzie / 3.6) * 1.5,
            },
        },
        series: [
            {
                barWidth: titleFontSzie,
                itemStyle: {
                    barBorderRadius: [titleFontSzie / 2, titleFontSzie / 2, 0, 0],
                },
            },
        ],
    };
    chartInstance.setOption(adapterOption);
    chartInstance.resize();
}
// 改变柱形图 区域缩放起始与终点值的函数
function startInterval() {
    // 如果存在则关闭
    timerId.value && clearInterval(timerId);

    timerId.value = setInterval(() => {
        startValue.value++;
        endValue.value++;
        if (endValue.value > allData.length - 1) {
            startValue.value = 0;
            endValue.value = 9;
        }
        updateChart();
    }, 2000);
}
function removeChart() {
    this.chartInstance.dispose();
    this.chartInstance = null;
}
function toggleDropdown() {
    this.showDropdown = !this.showDropdown;
}
function switchData(index) {
    this.currentDataIndex = index;
    this.tit = this.allData[this.currentDataIndex].name;
    this.showDropdown = false;
    this.getData();
}
</script>

<style scoped>
.left_graph{
    display: flex; /* 使用 Flexbox 布局 */
    flex-direction: column; /* 垂直方向排列子元素 */
}
.title {
    padding: 5px; /* 添加一些内边距，使标题更易读 */
    margin-left: 13%;
    margin-bottom: -20px;
}
</style>