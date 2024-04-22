<template>
    <div class="left_graph">
        <div class="title">
            {{ tit }}
        </div>
        <br>
        <div id="HB_leftgraph4" style="width: 388px;height: 190px;"></div>
    </div>

</template>
<script setup name = "leftgraph4">
import * as echarts from 'echarts';
import {ref, onMounted} from 'vue';
const chartInstance = ref();
const allData = ref([
    {
        "name": "▎图书馆年级借阅书目统计（册）",
        "children": [
            {
                "name": "2018级",
                "value": 3297
            },
            {
                "name": "2019级",
                "value": 6923
            },
            {
                "name": "2020级",
                "value": 6207
            },
            {
                "name": "2021级",
                "value": 6839
            },
            {
                "name": "2022级",
                "value": 7535
            }
        ]
    },
    {
        "name": "▎纸质图书借阅分类统计（册）",
        "children": [
            {
                "name": "文学",
                "value": 11311
            },
            {
                "name": "工业技术",
                "value": 8772
            },
            {
                "name": " 历史、地理",
                "value": 1544
            },
            {
                "name": "经济",
                "value": 987
            },
            {
                "name": "数理科学和化学",
                "value": 533
            },
            {
                "name": "其他",
                "value": 453
            }
        ]
    }
]);
const currentIndex = ref(0);
const currentDataIndex = ref(0);
const tit = ref("湖北省红色旅游成本占比(万元)");
const showDropdown = ref(false);
onMounted(() => {
  init();
  updateChart();
});
//方法
function init()
{
    chartInstance.value = echarts.init(document.getElementById("HB_leftgraph4"));
    const initOption = {
            tooltip: {
                trigger: 'item'
            },
            grid: {
                    top: "15%",
                    left: "5%",
                    right: "15%",
                    bottom: "5%",
                    // 把x轴和y轴纳入 grid
                    // containLabel: true,
                },
            visualMap: {
                top: 'middle',
                right: 10,
                color: ['rgb(250,207,44)', 'rgb(228,44,43)'],
                calculable: true
            },
            radar: {
                radius:'65%',
                indicator: [
                { text: '服务', max: 400 },
                { text: '环境', max: 400 },
                { text: '宣传', max: 400 },
                { text: '管理', max: 400 },
                { text: '科技', max: 400 }
                ],
                name: {
                    textStyle: {
                        color: 'rgba(255,255,255,0.7)', // 设置字体颜色为红色
                    }
                }
            },
            series: (function () {
                var series = [];
                for (var i = 1; i <= 24; i++) {
                series.push({
                    type: 'radar',
                    symbol: 'none',
                    lineStyle: {
                    width: 1,
                    },
                    emphasis: {
                    areaStyle: {
                        color: 'orange',
                        opacity:1,
                    }
                    },
                    data: [
                    {
                        value: [
                        (40 - i) * 10,
                        (38 - i) * 4 + 60,
                        i * 5 + 10,
                        i * 9,
                        (i * i) / 2
                        ],
                        name: i + 2000 + ''
                    }
                    ]
                });
                }
                return series;
            })()
            };
    chartInstance.value.setOption(initOption);
}

function updateChart() {
            // 处理数据
            const valueData = allData.value[currentDataIndex.value].children;
            const legenDateArr = valueData.map(item => item.name);
            const seriesDataArr = valueData.map(item => {
                return {
                    // name: item.name,
                    value: item.value,
                    children: item.children,
                };
            });
            const dataOption = {
                legend: {
                    data: legenDateArr,
                },
                series: [
                    {
                        data: seriesDataArr,
                    },
                ],
            };
            chartInstance.value.setOption(dataOption);
        }
        function toggleDropdown() {
            showDropdown.value = !showDropdown.value;
        }
        function switchData(index) {
            currentDataIndex.value = index;
            tit.value = allData.value[currentDataIndex.value].name;
            showDropdown.value = false;
            getData();
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