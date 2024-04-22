<template>
    <div class="game">
        <!-- <div>当前位置{{ position + 1 }}</div> -->
        <div class="dice">
            <DiceVue></DiceVue>
        </div>
        <img ref="movingImage" class="moving-image" src="@/assets/image/kid.png" alt="Moving Image">
    </div>
</template>

<script setup>
import DiceVue from '@/components/game/Dice.vue'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import emitter from '@/utils/emitter'
import { onMounted } from 'vue'

const movingImage = ref(null)
let index = 0; // 图片索引

const moveImage = (gridCount) => {
    if (gridCount < 0){
        index-=2;
    }
    let image = movingImage.value;
    console.log(index);
    let nodes = [{ x: 71, y: 59 },
    { x: 61, y: 57 },
    { x: 56, y: 56 },
    { x: 53, y: 48 },//5
    { x: 47, y: 46 },
    { x: 42, y: 37 },
    { x: 35, y: 31 },
    { x: 28, y: 37 },
    { x: 37, y: 39 },//10
    { x: 34, y: 50 },
    { x: 31, y: 59 },
    { x: 27, y: 60 },
    { x: 14, y: 47 },
    { x: 8, y: 52 },//15
    { x: 13, y: 58 },
    { x: 19, y: 57 },
    { x: 20, y: 63 },
    { x: 14, y: 41 },
    { x: 15, y: 34 },//20
    { x: 15, y: 25 },
    { x: 11, y: 17 },
    { x: 15, y: 13 },
    { x: 21, y: 10 },
    { x: 15, y: 0 },//25
    { x: 21, y: -2 },
    { x: 29, y: -5 },
    { x: 35, y: -4 },
    { x: 42, y: -4 },
    { x: 50, y: -2 },]; // 定义节点
    let currentGrid = 0; // 当前格子数

    let interval = setInterval(() => {
        let node = nodes[index];
        let posX = node.x - 2;
        let posY = node.y - 8;
        image.style.left = posX + '%';
        image.style.top = posY + '%';
        if (gridCount > 0) {
            currentGrid++;
            if (currentGrid < gridCount) {
                index++;
            }
            else if (currentGrid == gridCount) {
                index++;
                clearInterval(interval);
                return;
            }
            if (index >= nodes.length) {
                clearInterval(interval); // 达到终点后停止动画
            }
        }
        else {
            currentGrid--;
            if (currentGrid > gridCount) {
                index--;
            }
            else if (currentGrid == gridCount) {
                index++;
                clearInterval(interval);
                return;
            }
            if (index >= nodes.length) {
                clearInterval(interval); // 达到终点后停止动画
            }
        }
    }, 1000); // 每隔1秒移动到下一个节点
};


const position = ref(0)
const event = ref()
// onMounted(() => {
//     moveImage(14); // 多次调用，每次传入一个格子数
//     position.value = 14; // 设置初始位置
// });
function millionaireEvent() {
    switch (position.value) {
        case 0:
            return "【旅游起点】听，革命号角已经吹响";
        case 1:
            moveImage(2); // 多次调用，每次传入一个格子数
            position.value = position.value + 2;
            return "【迫不及待】直接前进2步";
        case 2:
            return "【到达湘江】";
        case 3:
            return "无事发生";
        case 4:
            return "无事发生";
        case 5:
            return "【到达遵义】";
        case 6:
            moveImage(3); // 多次调用，每次传入一个格子数
            position.value = position.value + 3;
            return "【历史突破】前进3步";
        case 7:
            return "【到达赤水】";
        case 8:
            return "无事发生";
        case 9:
            return "无事发生";
        case 10:
            return "【到达金沙江】";
        case 11:
            return "无事发生";
        case 12:
            return "【停顿兵马】停一回合";
        case 13:
            return "无事发生";
        case 14:
            return "无事发生";
        case 15:
            moveImage(-2); // 多次调用，每次传入一个格子数
            position.value = position.value - 2;
            return "【迷路了】后退两步";
        case 16:
            return "无事发生";
        case 17:
            return "无事发生";
        case 18:
            return "无事发生";
        case 19:
            return "【到达大渡河】";
        case 20:
            return "无事发生";
        case 21:
            return "【到达泸定桥】";
        case 22:
            return "无事发生";
        case 23:
            moveImage(1); // 多次调用，每次传入一个格子数
            position.value = position.value + 1;
            moveImage(1); // 多次调用，每次传入一个格子数
            position.value = position.value + 1;
            return "【爬雪山】前进一步";
        case 24:
            moveImage(1); // 多次调用，每次传入一个格子数
            position.value = position.value + 1;
            return "【过草地】前进一步";
        case 25:
            return "无事发生";
        case 26:
            return "【大会师】";
        case 27:
            return "无事发生";
        case 28:
            moveImage(1); // 多次调用，每次传入一个格子数
            position.value = position.value + 1;
            return "【胜利在望】前进一步";
        case 29:
            return "【旅游终点】长征结束";
    }
}

emitter.on('flag', flag => {
    moveImage(flag); // 多次调用，每次传入一个格子数
    position.value = Math.min(position.value + flag, 29); // 设置上限为 29
    setTimeout(() => {
        event.value = millionaireEvent();
        if (position.value === 2) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/湘江1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        } 
        else if (position.value === 5) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/遵义会议1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        } 
        else if (position.value === 7) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/赤水1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        } 
        else if (position.value === 10) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/金沙江1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        }
        else if (position.value === 19) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/大渡河1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        } 
        else if (position.value === 21) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/泸定桥1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        }
        else if (position.value === 26) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/大会师1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        }
        else if (position.value === 29) {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步' + event.value + '</p>'
                    + '<video id="video" src="/static/images/延安1.mp4" controls="controls" autoplay="autoplay" width="100%" height="75%"></video>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        }
        else {
            ElMessageBox.alert('', '事件', {
                confirmButtonText: 'OK',
                dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
                message: '<div>' +
                    '<p>前进' + flag + '步   ' + event.value + '</p>'
                    + '</div>'
            }).catch(() => {
                // 不点 OK 按钮，按 × 的情况
            });
        }
    }, flag * 1001 /* 设置一个适当的延迟时间 */);
});
</script>

<style>
.game {
    margin-left: 5%;
    margin-right: 5%;
    width: auto;
    height: 100vh;
    /* 使用100vh来让容器充满整个视口高度 */
    background: url("@/assets/image/dfw.png") center center no-repeat;
    background-size: cover;
    /* 调整图片尺寸以覆盖整个屏幕 */
}

.dice {
    width: 60%;
    position: relative;
    top: 39%;
    left: 33%;
}

.moving-image {
    position: relative;
    width: 120px;
    height: 120px;
    top: 48%;
    left: 78%;
    transition: left 0.5s ease, top 0.5s ease;
}
</style>