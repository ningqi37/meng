<template>

  <!--渲染画布的组件-->
  <div class="container1" ref="container">
    <button class="back" @click="back">返回主界面</button>
  </div>
  <!-- <div class = "tooltip-box" :style="tooltipPosition" ref="tooltipBox"> -->
  <div class="tip-container" :style="tooltipPosition" ref="tooltipBox">
    <!--标题盒子里面展示的是第一个被获取的标签的属性-->
    <button class="close" @click="close">x</button>
    <div class="title">{{ tooltopContent.title }}</div>
    <br>
    <div class="explain"> {{ tooltopContent.text }}</div>
  </div>
  <!-- </div> -->
  <!--若第一个被获取的标签是切换场景的标签则只显示标题-->
  <!-- <div class="title-text" ref="titleBox" :style="titlePosition">
    <button class="close" @click="close">x</button>
    <button class="option" @click="relook">重新浏览</button>
    <button class="option" @click="back">回到主界面</button>
  </div> -->
  <div class="title-text" :style="titlePosition" ref="titleBox">
    <div class="title">游览完毕</div>
    <!--标题盒子里面展示的是第一个被获取的标签的属性-->
    <button class="close" @click="close">x</button>
    <button class="option" @click="changeContentAndtips(0)">重新浏览</button>
    <button class="option1" @click="back">回到主界面</button>
  </div>
</template>
<script setup>
import * as THREE from "three";
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Scene1 from '@/assets/image/SkyBox_Image/场景1-plus.jpg';
import Scene2 from '@/assets/image/SkyBox_Image/场景2-plus.jpg';
import Scene3 from '@/assets/image/SkyBox_Image/场景3-plus.jpg';
import Scene4 from '@/assets/image/SkyBox_Image/场景4-plus.jpg';
import Scene5 from '@/assets/image/SkyBox_Image/场景5-plus.jpg';
import Scene6 from '@/assets/image/SkyBox_Image/场景6-plus.jpg';
import Scene7 from '@/assets/image/SkyBox_Image/场景7-plus.jpg';
import tipImage from '@/assets/image/SkyBox_Image/tip.png';
import enterImage from '@/assets/image/SkyBox_Image/进入.png';
import gsap from "gsap";
//数据
const showAnimation = ref(true);
const timer = ref();
//创建一个场景
const scene = new THREE.Scene();
//创建一个相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//设置相机的位置
camera.position.set(50, 0, 50);

//创建一个渲染器
const renderer = new THREE.WebGLRenderer();
//设置渲染器的宽高
renderer.setSize(window.innerWidth, window.innerHeight);

//获取组件中的dom对象
const container = ref(null);//用来渲染画布的容器
const tooltipBox = ref(null);//标签弹窗的组件
const titleBox = ref(null);//标签主题的组件

// 创建纹理、材质、和一个球形物体并添加到场景中
let texture = new THREE.TextureLoader().load(Scene1);//纹理
let SphereMaterial = new THREE.MeshBasicMaterial({ map: texture });//材质
const SphereGeometry = new THREE.SphereGeometry(12, 50, 50);//几何形状
SphereGeometry.scale(10, 10, -10);
const cube = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(cube);

// // 正方体纹理
// const geometry = new THREE.BoxGeometry(10, 10, 10);
// // var texture = ["left", "right", "top", "bottom", "front", "back"];
// // var texture = ["右","左","上","下","前","后"];
// var texture = ["右边","左边","上面","下面","前面","后面"];
// var boxMaterials = [];
// texture.forEach((item) => {
//   // 纹理加载
//   let texture = new THREE.TextureLoader().load(`./src/assets/image/${item}.png`);
//   console.log(texture);
//   // 将纹理添加到材质中
//   boxMaterials.push(new THREE.MeshBasicMaterial({map:texture}));
// //   if(item==="下")
// //   {
// //    texture.rotation = Math.PI/2;
// //    texture.center = new THREE.Vector2(0.5,0.5);
// //    boxMaterials.push(new THREE.MeshBasicMaterial({map:texture}));
// //   }
// //  else if(item==="上")//
// //  {
// //    texture.rotation = -Math.PI/2;
// //    texture.center = new THREE.Vector2(0.5,0.5);
// //    boxMaterials.push(new THREE.MeshBasicMaterial({map:texture}));
// //  }
// //  else{
// //    boxMaterials.push(new THREE.MeshBasicMaterial({map:texture}));
// //  }
// })
// const cube = new THREE.Mesh(geometry, boxMaterials);
// cube.geometry.scale(10, 10, -10);
// scene.add(cube);


//装有纹理的列表
const textureList = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];

//创建一个装有场景元素的对象列表
const dataList = [
  //场景1中的标签
  {
    //该列表存放该场景中的所有标签
    tipsList: [
      {

        position: { x: 110, y: -18, z: 36 },
        content: {
          id:0,
          title: "武昌起义革命纪念馆",
          text: "已开馆,请点击左侧按钮入馆",
          showTip: true,
          showTitle: false,
        },
      },
      {
        position: { x: 110, y: -13, z: -4 },
        content: {
          id: 1,
          title: "进入纪念馆",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //场景2中的标签
  {
    tipsList: [
      {

        position: { x: -100, y: -15, z: 45 },
        content: {
          id: 0,
          title: "返回上一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 20, y: -23, z: -105 },
        content: {
          id: 2,
          title: "去下一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -80, y: 15, z: -78 },
        content: {
          id:0,
          title: "武昌起义领导者",
          text: "武昌起义推翻了清满统治,唤醒了民族的觉醒,是具有里程碑意义的事件之一",
          showTip: true,
          showTitle: false,
        },
      },
    ],
  },
  //场景三中的标签
  {
    tipsList: [
      {

        position: { x: -41, y: -21, z: -100 },
        content: {
          id: 1,
          title: "返回上一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -62, y: -24, z: 90 },
        content: {
          id: 3,
          title: "去下一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {

        position: { x: 110, y: -40, z: 2 },
        content: {
          id:0,
          title: "武昌起义遗留文物",
          text: "武昌起义遗留下来了文物和遗迹,这些文物记录着起义的历史和背景,具有重要的历史意义",
          showTip: true,
          showTitle: false,
        },
      },
    ],
  },
  //场景四中的标签
  {
    tipsList: [
      {

        position: { x: 110, y: -28, z: -15 },
        content: {
          id: 1,
          title: "返回上一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -105, y: -32, z: 32 },
        content: {
          id: 4,
          title: "去下一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {

        position: { x: 68, y: -17, z: 90 },
        content: {
          id:0,
          title: "张之洞与湖北新政",
          text: "张之洞是湖北新政的推动者之一,在1895年只1911间对湖北进行了政治改革、军事改革、经济改革等,对于中国现代化进程起到了积极的推动作用。",
          showTip: true,
          showTitle: false,
        },
      },
    ],
  },
  //场景五中的标签
  {
    tipsList: [
      {

        position: { x: -36, y: -33, z: -105 },
        content: {
          id: 1,
          title: "返回上一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 70, y: -18, z: 89 },
        content: {
          id: 5,
          title: "去下一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {

        position: { x: 114, y: -26, z: -1 },
        content: {
          id:0,
          title: "武昌起义遗留碑文",
          text: "纪念碑上面主要记录了辛亥革命的背景、起义的经过以及对革命烈士的赞颂,表达了对革命烈士的敬意和对国家前途的期许",
          showTip: true,
          showTitle: false,
        },
      },
    ],
  },
  //场景六中的标签
  {
    tipsList: [
      {

        position: { x: -52, y: -20, z: 95 },
        content: {
          id: 1,
          title: "返回上一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -100, y: -46, z: 2 },
        content: {
          id: 6,
          title: "去下一个场景",
          text: "",
          showTip: false,
          showTitle: true,
        },
      },
      {

        position: { x: 114, y: -26, z: -1 },
        content: {
          id:0,
          title: "武昌起义的主要人物",
          text: "孙中山、黄兴等是武昌起义的代表人物,他们发起的武昌起义激发了广大民众的民族觉醒和爱国热情,是伟大的革命先驱！",
          showTip: true,
          showTitle: false,
        },
      },
    ],
  },
  //场景七中的标签
  {
    tipsList: [
      {
        position: { x: -101, y: -6, z: 55 },
        content: {
          id: 7,
          title: "",
          text: "",
          showTip: true,
          showTitle: false,
        },
      },
    ],
  },
]
//设置标签的纹理
let tipTexture = new THREE.TextureLoader().load(tipImage);//普通标签纹理
let tipTexture2 = new THREE.TextureLoader().load(enterImage);//切换场景标签纹理
let TipMaterial = new THREE.SpriteMaterial({ map: tipTexture });//材质
let TipMaterial2 = new THREE.SpriteMaterial({ map: tipTexture2 });
const tipsSpriteList = [];
//逐一添加标签
dataList[0].tipsList.forEach((item) => {
  //总是朝着摄像机平面的元素
  let sprite = new THREE.Sprite(TipMaterial);
  //若标签是切换场景标签则设置为其对应的纹理
  if (item.content.showTitle) {
    sprite.material = TipMaterial2;
  }
  else {
    sprite.material = TipMaterial;
  }
  sprite.scale.set(5, 5, 5);
  //设置其位置
  sprite.position.set(item.position.x, item.position.y, item.position.z);
  //设置标签的内容
  sprite.content = item.content;
  //将标签精灵加入到数组中并添加到场景中
  tipsSpriteList.push(sprite);
  scene.add(sprite);
})


//初始化弹窗位置
const tooltipPosition = ref({
  top: "-100%",
  left: "-100%",
})

//初始化标题位置
const titlePosition = ref({
  top: "-100%",
  left: "-100%",
})

//存放标签的内容
const tooltopContent = ref({})

//获取动画进度的变量
// const progress = ref(0);

//方法
//定义一个渲染函数
const render = () => {
  renderer.render(scene, camera);
  renderer.sortObjects = false;
  requestAnimationFrame(render);
}
//添加标签
function addTipsSprite(index) {
  //逐一添加标签
  dataList[index].tipsList.forEach((item) => {
    //总是朝着摄像机平面的元素
    let sprite = new THREE.Sprite(TipMaterial);
    //若标签是切换场景标签则设置为其对应的纹理
    if (item.content.showTitle) {
      sprite.material = TipMaterial2;
    }
    else {
      sprite.material = TipMaterial;
    }
    sprite.scale.set(5, 5, 5);
    //设置其位置
    sprite.position.set(item.position.x, item.position.y, item.position.z);
    //设置标签的内容
    sprite.content = item.content;
    //将标签精灵加入到数组中并添加到场景中
    tipsSpriteList.push(sprite);
    scene.add(sprite);
    console.log("执行了");
  })
}


//转场函数
function changeContentAndtips(index) {
  titlePosition.value= 
  {
    left: "-100%",
    top: "-100%",
  }
  tooltipPosition.value = {
    left: "-100%",
    top: "-100%",
  }
  console.log(index);
  //切换之前清空场景中的所有标签
  scene.children = scene.children.filter(
    (item) => String(item.type) !== "Sprite"
  );
  //将存放精灵标签的数组清空
  tipsSpriteList.splice(0, tipsSpriteList.length);
  //取消之前的动画效果
  gsap.killTweensOf(cube.material);
  // //初始化镜头的初始fov
  // const initialFov = camera.fov;
  // //设置目标fov(镜头拉近后的值)
  // const targetFov = 30;
  // const currentFov = ref(0);
  //添加转场动画并在动画结束后更换物体的纹理，第一个动画是浅出，第二个动画是淡入.
  gsap.to(cube.material,
    {
      transparent: true,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: function () {
        let texture1 = new THREE.TextureLoader().load(textureList[index]);
        let SphereMaterial1 = new THREE.MeshBasicMaterial({ map: texture1, });
        // 更换物体的纹理
        cube.material = SphereMaterial1;
        //添加转场动画
          gsap.to(
            SphereMaterial1,
            {
              transparent: true,
              opacity: 1,
              duration: 1,
              ease: "power2.inOut",
              // onUpdate:function(){
              //   progress.value = gsap.getProperty(SphereMaterial1, 'progress');
              //   currentFov.value = initialFov+(targetFov - initialFov)*progress;
              //   camera.fov = currentFov.value;
              //   camera.updateProjectionMatrix();
              // },
              onComplete: function () {
                //更新相机投影矩阵
                camera.updateProjectionMatrix();
                console.log("切换成功");
                //重新添加标签
                addTipsSprite(index);
              }
            });
      }
    })
}
//处理改变窗口大小的事件
function onresize() {
  //重新设置相机的宽高比
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  //更新相机的投影矩阵
  camera.updateProjectionMatrix();
  //重新设置渲染器的长和宽
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
}
//弹窗点击函数
function close() {
  tooltipPosition.value = {
    left: "-100%",
    top: "-100%",
  };
  titlePosition.value = 
  {
    left: "-100%",
    top: "-100%",
  }
}
//返回主界面函数
import { useRouter } from "vue-router";
const router = useRouter();
function back() {
  router.push("/map/hubei");
}
//标签的点击处理函数
function onMouseClick(e) {
  //定义一个射线
  let raycaster = new THREE.Raycaster();
  //定义鼠标向量（二维）
  let mouse = new THREE.Vector2();
  mouse.x = (e.clientX / container.value.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / container.value.clientHeight) * 2 + 1;
  //检查位置
  console.log(e.clientX, e.clientY);
  //初始化射线
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(tipsSpriteList, true);


  // 获取天空盒中的任意点的坐标以便添加标签
  let pointWorldSpace = raycaster.intersectObject(cube);
  if (pointWorldSpace.length > 0) {
    var point = pointWorldSpace[0].point;
    console.log('Point in world space:', point);
  }

  //如果是转换场景的标签
  if (intersects.length > 0 && intersects[0].object.content.showTitle) {
    console.log(intersects[0].object.content.id);
    changeContentAndtips(intersects[0].object.content.id);
    handleTooltipHide(e);
  }
  //若是展示的标签
  else if (intersects.length > 0) {
    if(intersects[0].object.content.id===0)
    {
      let elementWidth = container.value.clientWidth / 2;
    let elementHeight = container.value.clientHeight / 2;
    //存放获取到的第一个标签的坐标
    let worldVector = new THREE.Vector3(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z,
    )
    //将世界坐标投影到相机所在的视图空间中，得到一个二维坐标
    let position = worldVector.project(camera);
    //存放获取到的第一个标签的内容
    tooltopContent.value = intersects[0].object.content;
    //将标签的位置居中对齐
    let left = Math.round(
      elementWidth * position.x +
      elementWidth -
      tooltipBox.value.clientWidth / 2
    );
    let top = Math.round(
      elementHeight * position.y +
      elementHeight -
      tooltipBox.value.clientHeight / 2
    );
    //并将弹窗的位置设置居中
    //$为插值语法
    tooltipPosition.value = {
      left: `${left}px`,
      top: `${top}px`,
    };
    console.log("执行了1");
    }
    else
    {
      let elementWidth = container.value.clientWidth / 2;
    let elementHeight = container.value.clientHeight / 2;
    //存放获取到的第一个标签的坐标
    let worldVector = new THREE.Vector3(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z,
    )
    //将世界坐标投影到相机所在的视图空间中，得到一个二维坐标
    let position = worldVector.project(camera);
    //存放获取到的第一个标签的内容
    tooltopContent.value = intersects[0].object.content;
    //将标签的位置居中对齐
    let left = Math.round(
      elementWidth * position.x +
      elementWidth -
      titleBox.value.clientWidth / 2
    );
    let top = Math.round(
      elementHeight * position.y +
      elementHeight -
      titleBox.value.clientHeight / 2
    );
    //并将弹窗的位置设置居中
    //$为插值语法
    titlePosition.value = {
      left: `${left}px`,
      top: `${top}px`,
    };
    // console.log(tooltipPosition.value.top);
    console.log("执行了2");
    }
    
  }
}

//定义鼠标移入的事件的处理函数
function onMousemove(e) {
  //取消事件的默认行为
  // e.preventDefault();
  //创建一个射线
  let raycaster = new THREE.Raycaster();
  //创建一个二维向量存放鼠标的位置
  let mouse = new THREE.Vector2()
  //将鼠标的屏幕坐标转换为标准化坐标
  mouse.x = (e.clientX / container.value.clientWidth) * 2 - 1;
  mouse.y = (e.clientY / container.value.clientHeight) * 2 - 1;
  //定义鼠标射线的位置（从相机到鼠标的位置）
  raycaster.setFromCamera(mouse, camera);
  //将标签精灵数据放进来做视线交互
  let intersects = raycaster.intersectObjects(tipsSpriteList, true);
  //若射线穿过的标签数不为0
  if (intersects.length > 0) {
    console.log("有元素");
    let elementWidth = container.value.clientWidth / 2;
    let elementHeight = container.value.clientHeight / 2;
    //存放获取到的第一个标签的坐标
    let worldVector = new THREE.Vector3(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z,
    )
    //将世界坐标投影到相机所在的视图空间中，得到一个二维坐标
    let position = worldVector.project(camera);
    //存放获取到的第一个标签的内容
    tooltopContent.value = intersects[0].object.content;
    if (intersects[0].object.content.showTip) {
      //将标签的位置居中对齐
      let left = Math.round(
        elementWidth * position.x +
        elementWidth -
        tooltipBox.value.clientWidth / 2
      );
      let top = Math.round(
        elementHeight * position.y +
        elementHeight -
        tooltipBox.value.clientHeight / 2
      );
      //并将弹窗的位置设置居中
      //$为插值语法
      tooltipPosition.value = {
        left: `${left}px`,
        top: `${top}px`,
      };
      // console.log(tooltipPosition.value.top);
      console.log("显示弹窗");
    }
    else if (intersects[0].object.content.showTitle) {
      console.log("显示标题");
      let left = Math.round(
        elementWidth * position.x +
        elementWidth -
        titleBox.value.clientWidth / 2
      );
      let top = Math.round(-elementHeight * position.y + elementHeight);
      titlePosition.value = {
        left: `${left}px`,
        top: `${top}px`,
      };
      console.log(titlePosition.value)
    }
  }
  else {
    handleTooltipHide();
  }
}
//隐藏函数
function handleTooltipHide(e) {
  // e.preventDefault();
  //将标题弹窗隐藏
  tooltipPosition.value = {
    top: "-100%",
    left: "-100%",
  };
  //将标题隐藏
  titlePosition.value = {
    top: "-100%",
    left: "-100%",
  };
  //将存放第一个标签的内容置为空
  tooltopContent.value = {};
}



//挂载完毕之后获取dom
//利用钩子当组件被挂载时将画布添加到dom元素中
onMounted(() => {
    // timer = setTimeout(() => {
    //   showAnimation.value = false;
    // }, 3000);
  //添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.enablePan = false;
  container.value.appendChild(renderer.domElement);
  render();
  window.addEventListener("resize", onresize, false);
  window.addEventListener("click", onMouseClick, false);
  //添加一个鼠标移动的事件监听器到renderer渲染出来的元素上
  //并保证该事件不会向上冒泡传播
  // renderer.domElement.addEventListener(
  //   "mousemove",
  //   onMousemove,
  //   false,
  // )
  // //添加一个事件监听器到标题
  // tooltipBox.value.addEventListener(
  //   "mouseleave",
  //   handleTooltipHide,
  //   false
  // )
});
// onBeforeUnmount(() => {
//   clearTimeout(timer.value);
// });
</script>
<style src="@/assets/css/SkyBox.css" scoped></style>