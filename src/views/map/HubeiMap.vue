<template>
    <div class="map-container">
        <div id="container" ref="container">
            <Modal/>
            <div id="tooltip" ref="tooltip"></div>
            <div id="tooltip1" ref="tooltip1"></div>
        </div>
        <div v-if="ifBigScreen" class="button-group">
            <button class="btn btn1" @click="groupOneChange"><img src="/static/images/景点数量.png" alt="" /></button>
            <button class="btn btn2" @click="groupTwoChange"><img src="/static/images/景区等级.png" alt="" /></button>
            <button class="btn btn3" @click="groupThreeChange"><img src="/static/images/景区详情.png" alt="" /></button>
            <button class="btn btn4" @click="groupFourChange"><img src="/static/images/景区评价.png" alt="" /></button>
            <button class="btn btn5" @click="showAll"><img src="/static/images/漫游模式.png" alt="" /></button>
            <img src="~@/assets/image/image_button/showLeast.png" @click="closeBigScreen()" alt="" class="all" />
        </div>
    </div>
</template>
<script setup>
import emitter from '@/utils/emitter'
import Modal from "./Modal.vue";
import * as THREE from "three";
import * as d3 from 'd3';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { ref, onMounted, getCurrentInstance, inject } from 'vue';
//获取tween实例
const { appContext } = getCurrentInstance();
const tween = appContext.config.globalProperties.$tween;
// const $tween = inject('$tween');
// const $tweener = inject('$tweener');

//数据声明

let camera = ref();//相机
let scene;//场景
let renderer;//渲染器
let labelRenderer;//标签渲染器
const container = ref();//dom容器
const tooltip = ref();//dom容器
const tooltip1 = ref();
let controller = ref();//轨道控制器
let map;//省份地图
let raycaster;//射线
let mouse;//鼠标
let lastPick;//用来存放捕捉到的湖北地图的对象
let redTravel;//用来存放捕捉到的景点的3d对象
//是否是全局浏览的模式
let ifShowAll = ref(false);
//若正在播放点击省份的动画
let ifmapClickTween = ref(false);
//若正在播放加载时候的相机动画
let ifcameraTween = ref(true);
//若是在景点查看的group
let AtgroupThree = ref(false);
//若是在组件模式下就不显示按钮，在大屏模式下则显示按钮

let ifBigScreen = ref(false);
emitter.on('show_bigscreen', () => {
    ifBigScreen.value = true;
})

//后槽函数
function closeBigScreen(){
    ifBigScreen.value = false;
    console.log(ifBigScreen.value);
    emitter.emit('close_bigscreen');
}

let mapEdgeLightObj = ref({
    mapEdgePoints: [],
    lightOpacityGeometry: null,//单独把geometry提出来作为动画用
    //边缘流光参数
    lightSpeed: 3,
    lightCurrentPoints: 0,
    lightOpacity: null,
});
//每个屏幕模型一组
let groupOne = new THREE.Group();
let groupTwo = new THREE.Group();
let groupThree = new THREE.Group();
let groupFour = new THREE.Group();
let group = new THREE.Group();
//groupOne统计信息
let cityWaveMeshArr = ref([]);
let cityCylinderMeshArr = ref([]);
let cityMarkerMeshArr = ref([]);
let cityNumMeshArr = ref([]);

// groupTwo 告警信息
let alarmWaveMeshArr = ref([]);
let alarmCylinderMeshArr = ref([]);
let alarmNameMeshArr = ref([]);
// groupThree 能源
let energyWaveMeshArr = ref([]);
let energyCylinderMeshArr = ref([]);
let energyNameMeshArr = ref([]);

// groupFour 环境
let monitorWaveMeshArr = ref([]);
let monitorIconMeshArr = ref([]);
let monitorNameMeshArr = ref([]);

//城市信息
const mapConfig = {
    deep: 0.25,
}

//摄像机移动位置
let cameraPosArr = ref([
    { x: 0, y: -3.5, z: 5 },
])
let dataTotal = [
    {
        name: "武汉市", adcode: "420100", total: 15,
        level:2,
        brief: "武汉历来是九省通衢、兵家必争之地，拥有着悠久的文化底蕴，自然也有烈士陵园、战争遗迹、重大事件会址等不少红色纪念地。"
    },
    {
        name: "黄石市", adcode: "420200", total: 13,
        level:2,
        brief: "黄石市位于中国湖北省中部，是一座历史悠久、文化丰富的城市。黄石市在中国革命历史上有着重要的地位，因此有一些红色旅游景点。如黄麻起义革命纪念馆等。"
    },
    {
        name: "十堰市", adcode: "420300", total: 5,
        level:1,
        brief: "十堰市是中国共产党早期的重要活动地之一，许多革命先烈在这里留下了光辉的历史足迹。十堰市曾是中国共产党的重要革命根据地之一，许多党的早期组织和活动在这里展开。"
    },
    {
        name: "宜昌市", adcode: "420500", total: 6,
        level:1,
        brief: "938年八路军第三五九旅在宜昌城内成立了军政府，宜昌也成为了当时的军事重镇之一。这些历史事件留下了丰富的红色旅游遗迹和景点。"
    },
    {
        name: "襄阳市", adcode: "420600", total: 4,
        level:0,
        brief: "襄阳市是中国共产党早期的重要活动地之一，许多革命活动和斗争在这里展开。例如，红军曾经在襄阳地区进行过多次战役和长征，留下了许多红色旅游遗迹和景点。"
    },
    {
        name: "孝感市", adcode: "420900", total: 7,
        level:1,
        brief: "红军长征曾经经过孝感市区，孝感也是抗日战争时期的重要抗日根据地之一。这些历史事件留下了丰富的红色旅游遗迹和景点。"
    },
    {
        name: "荆州市", adcode: "421000", total: 10,
        level:2,
        brief: "荆州市有着丰富的红色文化传承，包括革命先烈的故居、革命纪念馆、革命纪念碑等。这些文化资源反映了荆州市在革命历史中的重要地位和人民斗争的艰辛历程。"
    },
    {
        name: "黄冈市", adcode: "421100", total: 20,
        level:2,
        brief: "黄冈地区曾是红军长征的重要路线之一，有许多红色旅游景点与长征相关。政府对红色旅游的支持和投资也是促进黄冈市红色旅游景区多的重要原因之一。"
    },
    {
        name: "咸宁市", adcode: "421200", total: 6,
        level:1,
        brief: "咸宁市曾是中国共产党的重要革命根据地之一，许多党的早期组织和活动在这里展开。因此，咸宁市拥有一些红色旅游景区，吸引了一定数量的游客前来参观。"
    },
    {
        name: "随州市", adcode: "421300", total: 8,
        level:1,
        brief: "随州市曾是中国共产党的重要革命根据地之一，许多党的早期组织和活动在这里展开。党的领导人曾在随州进行过重要的革命活动，这为随州市的红色旅游景区提供了丰富的历史内涵。"
    },
    {
        name: "恩施苗族自治州", adcode: "422800", total: 12,
        level:2,
        brief: "恩施苗族自治州拥有丰富的红色旅游资源，其红色旅游景区之多得益于其深厚的革命历史、丰富的红色文化资源、重要的革命根据地地位、政府支持和投资以及自然风光与红色历史的结合等因素的综合作用。"
    },
    {
        name: "荆门市", adcode: "420800", total: 3,
        level:0,
        brief: "荆门市政府高度重视红色旅游的发展，积极支持相关景区的修复、保护和开发。政府投入资金和资源，提升红色旅游景区的硬件设施和服务水平，吸引更多游客前来参观。"
    },
];
let dataAlarm = [
    {
        name: '麻城市乘马会馆',
        sign: '“爱国主义教育示范基地”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/23410172-1f08-43bf-85ab-df1e2f3bee63.jpg',
        content: '乘马会馆位于麻城市乘马岗镇，占地总面积6077.7平方米，是依托省级重点文物保护单位（中央农民运动讲习所学生军指挥部)旧址建立的纪念性博物馆,是湖北省爱国主义教育基地、黄冈市爱国主义教育基地，曾入选全国30条红色旅游精品线路和100个红色旅游经典景区之一,在2022年升级为3A级景区',
        position: [114.951049, 31.428866],
    },
    {
        name: '麻城烈士陵园',
        sign: '“全国重点烈士纪念建筑物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/e3f443ed-f925-4901-a624-bc9befd834f3.webp',
        content: '麻城市烈士陵园占地面积114600平方米，2005年至2007年，麻城市共投入资金2678万元进行全新的改造，绿化率达80%以上。该陵园是全国重点烈士纪念建筑物保护单位，是湖北省爱国主义、国防教育示范基地。是“全国100个红色旅游景点景区”之一和全国30条红色旅游精品线路节点。为国家AAAA级旅游景区。',
        position: [115.018845, 31.180759],
    },
    {
        name: '黄麻起义和鄂豫皖苏区革命烈士陵园',
        sign: '“爱国主义教育示范基地”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/96f6dd7a-d353-49f8-8325-2d28ee3fe174.webp',
        content: '黄麻起义和鄂豫皖苏区纪念园是国家AAAA级旅游景区、全国爱国主义教育示范基地、全国重点烈士纪念建筑物保护单位、国家国防教育基地、全国廉政教育基地、全国旅游标准化示范基地、全国退役军人工作模范单位。',
        position: [114.62625, 31.292766],
    },
    {
        name: '英山县英山烈士陵园',
        sign: '“湖北省十大红色旅游景区”',
        level: "C级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/788f8ff3-292f-4195-916d-591198c6577c.jpg',
        content: '英山革命烈士园是全国红色旅游百家经典景区。位于英山县城中心地带。1997年被省政府批准为省级革命烈士纪念建筑物重点保护单位，湖北省爱国主义教育基地， 2005年被国家十三部委确定为全国红色旅游百家经典景区之一。',
        position: [115.67411, 30.735743],
    },
    {
        name: '黄冈革命烈士陵园',
        sign: '“爱国主义教育示范基地”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/37b9ab53-24a5-44e4-a72f-319b06be627f.webp',
        content: '黄冈革命烈士陵园地处团风县杜皮乡境内，始建于1974年，规划面积965亩，总建筑面积14149.65平方米，其中纪念建筑物占地面积7149.65平方米。黄冈革命烈士陵园是国家级烈士纪念设施、全国爱国主义教育示范基地、全国红色旅游经典景区、国家AAA级景区。',
        position: [115.051919, 30.794868],
    },
    {
        name: '湘鄂西革命根据地旧址',
        sign: '“全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/c02b4c19-b034-487d-955c-e39c6b460da0.jpg',
        content: '洪湖市湘鄂西革命根据地旧址群位于荆州市洪湖市西部的瞿家湾镇，距洪湖市区55公里，距武汉市140公里。旧址群共有现代重要史迹及代表性建筑39处，它们大部分集中于瞿家湾镇红军街（老街）和沿河路街道南北两边，其余散布在附近村湾。',
        position: [112.985383, 30.03121],
    },
    {
        name: '鄂西苏区湘革命烈士陵园',
        sign: '“全国重点烈士纪念建筑物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b52c54e0-d149-4663-9f77-f082770c77f2.webp',
        content: '洪湖湘鄂西苏区革命烈士纪念馆，位于湘鄂两省交界处的洪湖市新堤镇西南部，南临长江，北望洪湖，雄伟肃穆。全馆面积三百五十余亩，主体建筑包括纪念碑、烈士祠、陈列馆等。纪念馆于1984年落成开放。为全国重点烈士纪念建筑物保护单位，国家AAA级旅游景区。隶属市民政局。',
        position: [113.454425, 29.793559],
    },
    {
        name: '新四军五师旧址',
        sign: '“社会科学类历史遗址专题纪念馆”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/69c43a3d-e26f-4bc3-a86d-ecedefe68ae4.jpeg',
        content: '2023年10月，列入创建国家4A级旅游景区名单。 新四军五师旧址有28处，分布在以湖北省大悟县芳畈镇白果树湾为中心约方圆5km范围的11个自然村中。 占地面积近8000平方米，总建筑面积4142.03平方米。',
        position: [113.742359, 32.069682],
    },
    {
        name: '武昌区辛亥革命武昌起义纪念馆',
        sign: '“全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/0c544647-5cc9-4a56-8295-38842d49eaca.jpeg',
        content: '辛亥革命武昌起义纪念馆，是依托中华民国军政府鄂军都督府旧址而建立的纪念性博物馆，位于湖北省武汉市武昌区武珞路1号，占地面积20000多平方米，建筑面积近10000平方米.2012年10月2日，辛亥革命武昌起义纪念馆成为国家AAAA级旅游景区.',
        position: [114.305641, 30.539066],
    },
    {
        name: '中山舰纪念馆',
        sign: '“专题性纪念性博物馆”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/8ff74d4f-e618-435c-9fd1-9357ec57b94b.webp',
        content: '武汉市中山舰博物馆建筑面积11000平方米，常设展览有《中山舰舰体陈列》、《一代名舰——中山舰史迹陈列》、《中山舰出水文物精品展》。2012年07月09日，武汉市中山舰博物馆成为第三批省级爱国主义教育基地 [4]，2014年，入选第一批国家级抗战纪念设施、遗址名录 [2]，2017年5月18日，晋级第三批国家一级博物馆',
        position: [114.134269, 30.345277],
    },
    {
        name: '北伐战争汀泗桥战役遗址',
        sign: '“第二批省级文物保护单位”',
        level: "C级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/21b5dad1-6568-467a-aef7-32b97d8988be.webp',
        content: '北伐汀泗桥战役遗址纪念馆位于湖北省咸宁市咸安区。北伐汀泗桥战役遗址占地面积约20万平方米，重点保护区一个是马家山，另一个是塔垴山。其中马家山占地面积约2万平方米，建有大门楼、烈士纪念亭、纪念碑、墓及陈列室。',
        position: [114.168523, 29.817853],
    },
    {
        name: '长江三峡水利枢纽工程',
        sign: '“爱国主义教育示范基地”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d058d5e5-fc9d-4f3b-a5a6-89c00f87f1f7.jpg',
        content: '三峡水电站是世界上规模最大的水电站，也是中国有史以来建设最大型的工程项目。三峡水电站的功能有十多种，航运、发电、种植等等。三峡水电站1992年获得中国全国人民代表大会批准建设，1994年正式动工兴建，2003年6月1日下午开始蓄水发电，于2009年全部完工',
        position: [111.035707, 30.833629],
    },
    {
        name: '宜城市张自忠将军纪念馆',
        sign: '“爱国主义、国防教育基地”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/cdec9937-fa38-4322-991e-5e8f870a86d1.webp',
        content: '2016年1月5日，宜城市张自忠将军纪念园获批成为国家AAA级旅游景区。 2019年10月18日，国台办批准宜城张自忠纪念馆为海峡两岸交流基地。 宜城市张自忠将军纪念馆是全国爱国主义教育示范基地、湖北省国防教育基地。',
        position: [112.255392, 31.708247],
    },
    {
        name: '陈潭秋故居',
        sign: '“社会科学类名人专题纪念馆”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/914fcc3f-31ab-44cf-8019-70db446d21ce.jpeg',
        content: '1995年，陈潭秋故居纪念馆被湖北省人民政府命名为全省首批“爱国主义教育基地”。1998年，陈潭秋故居纪念馆被湖北省人民政府命名为“爱国主义教育示范基地”。 [2]2021年9月，陈潭秋故居纪念馆获“灵秀湖北——十佳红色旅游经典景区”。',
        position: [115.044026, 30.594645],
    },
    {
        name: '新四军第五师九口堰旧址群',
        sign: '“社会科学类历史遗址专题纪念馆”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/55df587e-97b7-4844-a752-79132e9872e2.jpeg',
        content: '新四军第五师纪念馆，位于湖北省孝感市大悟县芳畈镇白果树湾，占地面积近8000平方米，隶属于大悟县文化体育局。1977年，正式成立四军第五师旧址保护机构。 截至2019年末，大悟县新四军第五师纪念馆藏品有34件套，其中珍贵文物4件/套，举办展览2个，开展教育活动576次。',
        position: [113.384316, 31.460218],
    },
    {
        name: '咸丰忠堡大捷遗址及烈士陵园',
        sign: '“建党百年红色旅游景点”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b26324d9-fb54-4679-ae51-49247b7b5af5.png',
        content: '咸丰忠堡大捷烈士陵园，是2021年文化和旅游部、中央宣传部、中央党史和文献研究院、国家发展改革委关于发布“建党百年 红色旅游百条精品线路”的公告中，“湘鄂边苏区”精品线路中的景点之一。',
        position: [109.29665, 29.674318],
    },
    {
        name: '湘鄂边苏区革命烈士陵园',
        sign: '“国家重点烈士陵园建筑保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d5b32984-8c57-4d08-b67e-ce7bdd2306df.jpeg',
        content: '湘鄂边苏区鹤峰革命烈士陵园，即满山红烈士陵园，位于鹤峰县城娄水河畔，全称为湘鄂边苏区革命烈士陵园，因满山红土鹃花盛开而得名“满山红”，1962年建园，1978年重修，立有高22米的“湘鄂边苏区革命烈士纪念碑”.',
        position: [110.034011, 29.890073],
    },
    {
        name: '五里坪革命旧址群',
        sign: '“第六批全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/9fb423db-2ae2-4d09-88ab-2bc516908264.jpg',
        content: '五里坪革命旧址，又名五里老街，位于湖北省恩施土家族苗族自治州鹤峰县五里乡五里坪老街中段，第二次国内革命战争时期，成为了湘鄂边苏区中心，也是湘鄂边红四军二次东下与红六军会师、成立红二军团的出发地。',
        position: [110.346179, 29.893672],
    },
    {
        name: '中营红三军军部旧址',
        sign: '“省级革命文物”',
        level: "C级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/ec2e100d-0865-4b34-9a8e-aa77e754f615.jpg',
        content: '红岩坪红三军军部旧址，位于中营镇，是2021年文化和旅游部、中央宣传部、中央党史和文献研究院、国家发展改革委关于发布“建党百年 红色旅游百条精品线路”的公告中，“湘鄂边苏区”精品线路中的景点之一。',
        position: [111.028921, 32.424011],
    },
    {
        name: '湘鄂赣边区鄂东南革命烈士陵园',
        sign: '“国家级烈士纪念设施保护单位”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d450fb83-e652-4121-8527-d9745ec14631.webp',
        content: '2002年被湖北省政府命名为全省首批十五个省级国防教育基地之一。每年接待中央、省、市、县领导、老红军、国外友人500人次，参观团体200多个，约万人以人次，特别是每年清明节等重大活动日达万人以上人次。',
        position: [115.214298, 29.846651],
    },
    {
        name: '红三军团建军旧址',
        sign: '“湖北省第二批不可移动革命文物”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/83e745f6-32fd-48f0-a47a-c4784868ec03.jpg',
        content: '该烈士陵园先后被国务院确定为"全国重点烈士纪念建筑物保护单位"、民政部"爱国主义教育基地"、湖北省政府"国防教育基地"和国家AAA级旅游景区。 ',
        position: [114.833973, 29.936998],
    },
    {
        name: '鄂州市梁子湖区湘鄂赣军区司令部旧址',
        sign: '“湖北省级文物保护单位”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/a863c42b-c1fb-4de1-be63-8665a071a0a2.webp',
        content: '陵园始建于1979年，是为了纪念湘鄂赣边区鄂东南21个县市在第一次国内革命战争中牺牲的3万烈士、第二次国内革命战争中牺牲的20万烈士、抗日战争中牺牲的5万烈士和解放战争中牺牲的3万烈士，共31万革命先烈而兴建的。湘鄂赣边区鄂东南革命烈士陵园为全国重点烈士纪念建筑物保护单位，国家3A级旅游景区。',
        position: [114.651588, 30.240804],
    }
]
let dataEnergy = [
    {
        name: '江岸区八七会议会址纪念馆',
        sign: '“第二批全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b9876cc1-2710-43bd-a19e-7907b20b52b4.jpeg',
        content: '民国十六年（1927年）8月7日，中共中央在汉口召开紧急会议，史称“八七会议”。 八七会议会址是记录这一历史事件的重要载体，见证了中国共产党历史上第一次伟大的转折，在进行党史教育、爱国主义教育和革命传统教育中扮演着重要的角色。',
        position: [114.299762, 30.586469],
    },
    {
        name: '武昌区毛泽东旧居',
        sign: '“湖北省武汉市武昌区辖内纪念馆”',
        level:"A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b049984f-d554-4007-8343-838299e787ab.jpeg',
        content: '毛泽东旧居是1926年12月至1927年8月毛泽东在武汉从事革命活动时的住所。被列为湖北省文物保护单位。旧居是晚清民居式建筑，坐东朝西，青砖灰瓦，三进三天井。1967年经省、市委批准在原址按原貌重建，同时复原了毛泽东的卧室、蔡和森、罗哲等人先后住住过的房间以及前客厅等。',
        position: [114.299294, 30.551012],
    },
    {
        name: '中央农民运动讲习所旧址纪念馆',
        sign: '“中央级革命训练机构”',
        level:"A级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/3a32dacc-bb99-4f94-b45e-6e7a7f43e07f.jpg',
        content: '中央农民运动讲习所旧址纪念馆，是一座重要的红色教育基地，位于湖北省武汉市江汉区江汉路139号，这里保存了大量珍贵的革命历史文物和实物，其中包括了毛泽东和其他中央领导同志的照片、手稿、日用品等，以及革命时期的文艺作品、出版物和宣传品等。',
        position: [114.300363, 30.554125],
    },
    {
        name: '麻城市乘马会馆',
        sign: '“爱国主义教育示范基地”',
        level: "B级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/23410172-1f08-43bf-85ab-df1e2f3bee63.jpg',
        content: '乘马会馆位于湖北省麻城市乘马岗镇乘马岗村，是黄麻起义的策源地之一，中共乘马第一个党支部于1926年9月9日在这里成立，乘马区农民协会及农民自卫军长期在此开展工作。在乘马岗镇还留存有当年红军与敌人激战过的杨四寨、得胜寨等遗址。',
        position: [114.951049, 31.428866],
    },
    {
        name: '麻城烈士陵园',
        sign: '“全国重点烈士纪念建筑物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/e3f443ed-f925-4901-a624-bc9befd834f3.webp',
        content: '麻城烈士陵园位于湖北省麻城市城区陵园路75号，为纪念黄麻起义和缅怀鄂豫皖苏区革命先烈的英雄事迹，于1979年建成，占地面积114600平方米。里面矗立着一座黄麻起义和鄂豫皖苏区革命烈士纪念碑，上面镌刻着华国锋、叶剑英等党和国家领导人的题字及题词。',
        position: [115.018845, 31.180759],
    },
    {
        name: '黄麻起义和鄂豫皖苏区革命烈士陵园',
        sign: '“爱国主义教育示范基地”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/96f6dd7a-d353-49f8-8325-2d28ee3fe174.webp',
        content: '黄麻起义和鄂豫皖苏区革命烈士陵园位于湖北省红安县城关镇陵园大道1号，占地面积约23.8万平方米，是为纪念在黄麻起义和鄂豫皖苏区斗争中牺牲的烈士而修建的设施。 下辖：董必武纪念馆、李先念纪念馆、黄麻起义和鄂豫皖苏区革命历史纪念馆、黄麻起义和鄂豫皖苏区革命烈士纪念馆。',
        position: [114.62625, 31.292766],
    },
    {
        name: '英山县英山烈士陵园',
        sign: '“湖北省十大红色旅游景区”',
        level: "A级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/788f8ff3-292f-4195-916d-591198c6577c.jpg',
        content: '英山烈士陵园位于县城陵园大道。1956年兴建，占地80亩，现主要建筑有富有民族特色的七层双六棱烈士纪念塔、革命烈士纪念馆、陈列馆、人民英雄纪念碑、抗日阵亡将士纪念碑、烈士墓群等。馆内收藏有朱德、周恩来、董必武、徐向前等党和国家领导人的亲笔题词。',
        position: [115.67411, 30.735743],
    },
    {
        name: '罗田县胜利烈士陵园',
        sign: '“全国一百个红色旅游精品景区”',
        level: "A级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d11f497e-79d3-4a11-b95e-5bd65f4a0ccc.webp',
        content: '胜利镇烈士陵园分为东、西二区，东区为陵园区，创建于1986年，占地2万平方米，位于胜利镇中部的磨儿石山，内存有1988年建成的烈士纪念碑一座，碑高12米，上刻有王任重题写的"革命烈士永垂不朽"的题词；有1995年革命烈士遗孤李逸心先生捐建的揽胜亭和革命烈士展览馆。',
        position: [115.464468, 31.12439],
    },
    {
        name: '刘邓大军挺进大别山指挥部旧址',
        sign: '“中小学研学旅行实践基地”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/63d24b63-d680-45eb-853d-65e367218d81.jpeg',
        content: '一九四七年的七月份，刘邓大军率领晋冀鲁豫野战军渡过黄河向大别山挺进的途中，发起了一次对国民党军队的大规模歼灭战----鲁西南战役，由此揭开了我军由战略防御向战略进攻的序幕。当时，刘邓首长就住在此处，并指挥了著名的“六营歼灭战”和“羊山战役”。',
        position: [114.984563, 30.88738],
    },
    {
        name: '黄冈革命烈士陵园',
        sign: '“爱国主义教育示范基地”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/37b9ab53-24a5-44e4-a72f-319b06be627f.webp',
        content: '陵园始建于1975年，占地面积33万平方米，雄伟庄严的革命烈士纪念碑，正面箔金镌刻的是原国家主席李先念的题词：“革命烈士永垂不朽！”；碑的背面是原国务院副总理、全国政协副主席方毅的题词：“为建立鄂东革命根据地而英勇牺牲的烈士们名垂千古！”',
        position: [115.051919, 30.794868],
    },
    {
        name: '湘鄂西革命根据地旧址',
        sign: '“全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/c02b4c19-b034-487d-955c-e39c6b460da0.jpg',
        content: '主要有红二军团总指挥部、红二军军部、红六军军部、中共湘鄂西中央分局、中央湘鄂西省委员会、湘鄂西省苏维埃政府和湘鄂西省革命军事委员会等旧址。中央湘鄂西省委员会旧址和湘鄂西省苏维埃政府旧址毗邻，均为三进院落砖木结构建筑，占地面积 220平方米。近年修建了周老嘴革命烈士陵园。',
        position: [112.985383, 30.03121],
    },
    {
        name: '鄂西苏区湘革命烈士陵园',
        sign: '“全国重点烈士纪念建筑物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b52c54e0-d149-4663-9f77-f082770c77f2.webp',
        content: '湘鄂西苏区革命烈士纪念碑碑座上，铭刻着国务院撰写的碑文。纪念碑正前方，是贺龙全身铜像。纪念碑以西有烈士祠，共展出116位烈士的遗像、遗物和生平简介。陈列馆内，展示着土地革命战争时期湘鄂西苏区史实，悬挂着湘鄂西革命根据地创始人贺龙、周逸群等的巨幅画像。',
        position: [113.454425, 29.793559],
    },
    {
        name: '新四军五师旧址',
        sign: '“社会科学类历史遗址专题纪念馆”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/69c43a3d-e26f-4bc3-a86d-ecedefe68ae4.jpeg',
        content: '新四军第五师纪念馆，位于湖北省孝感市大悟县芳畈镇白果树湾，占地面积近8000平方米，隶属于大悟县文化体育局。1977年，正式成立四军第五师旧址保护机构。 截至2019年末，大悟县新四军第五师纪念馆藏品有34件套，其中珍贵文物4件/套，举办展览2个，开展教育活动576次。',
        position: [113.742359, 32.069682],
    },
    {
        name: '武昌区辛亥革命武昌起义纪念馆',
        sign: '“全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: '/static/images/3D模型.png',
        content: '辛亥革命武昌起义纪念馆，是依托中华民国军政府鄂军都督府旧址而建立的纪念性博物馆，位于湖北省武汉市武昌区武珞路，占地面积20000多平方米。该馆是收藏辛亥革命时期相关的文物见长的专题性博物馆，已收藏文物数千件，有“辛亥名人字画”、“共和纪念瓷器”、“近代名人家谱”等。',
        position: [114.305641, 30.539066],
    },
    {
        name: '中山舰纪念馆',
        sign: '“专题性纪念性博物馆”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/8ff74d4f-e618-435c-9fd1-9357ec57b94b.webp',
        content: '武汉市中山舰博物馆，位于湖北省武汉市江夏区金口街特，是一座专题性纪念性博物馆，以“中山舰”的名字命名，馆藏文物6000余套，主要为随“中山舰”出水文物，从不同角度反映了中山舰各个历史时期的政治、军事、经济、文化等社会活动及中山舰官兵们的精神面貌。',
        position: [114.134269, 30.345277],
    },
    {
        name: '北伐战争汀泗桥战役遗址',
        sign: '“第二批省级文物保护单位”',
        level: "A级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/21b5dad1-6568-467a-aef7-32b97d8988be.webp',
        content: '北伐汀泗桥战役遗址纪念馆位于湖北省咸宁市咸安区。北伐汀泗桥战役遗址占地面积约20万平方米，重点保护区一个是马家山，另一个是塔垴山。其中马家山占地面积约2万平方米，建有大门楼、烈士纪念亭、纪念碑、墓及陈列室。',
        position: [114.168523, 29.817853],
    },
    {
        name: '长江三峡水利枢纽工程',
        sign: '“爱国主义教育示范基地”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d058d5e5-fc9d-4f3b-a5a6-89c00f87f1f7.jpg',
        content: '三峡水电站，即长江三峡水利枢纽工程，又称三峡工程。中国湖北省宜昌市境内的长江西陵峡段与下游的葛洲坝水电站构成梯级电站。三峡水电站是世界上规模最大的水电站，也是中国有史以来建设最大型的工程项目。三峡水电站的功能有十多种，航运、发电、种植等等。',
        position: [111.035707, 30.833629],
    },
    {
        name: '宜城市张自忠将军纪念馆',
        sign: '“爱国主义、国防教育基地”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/cdec9937-fa38-4322-991e-5e8f870a86d1.webp',
        content: '宜城市张自忠将军纪念馆建于1991年，张将军殉国50年之际。馆内以张自忠将军生平事迹陈列为主，辅以名人题词碑刻展览，包括张自忠将军殉国处纪念碑、纪念碑广场、阶梯式步行道等纪念设施，每一处都蕴含着对张自忠将军的缅怀和对抗战胜利的纪念。',
        position: [112.255392, 31.708247],
    },
    {
        name: '陈潭秋故居',
        sign: '“社会科学类名人专题纪念馆”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/914fcc3f-31ab-44cf-8019-70db446d21ce.jpeg',
        content: '陈潭秋故居纪念馆占地15.6亩，主体大楼3700平方米，呈“回”字形仿古建筑，楼顶由光彩夺目的黄色琉璃瓦覆盖，四脊金龙栩栩如生，其势如蟠雾腾霄；八方角巍峨挺拨，直指苍穹，寓意着革命伟人的丰功业绩。陈潭秋故居纪念馆包含陈潭秋故居纪念馆和铜像广场两部分。',
        position: [115.044026, 30.594645],
    },
    {
        name: '新四军第五师九口堰旧址群',
        sign: '“社会科学类历史遗址专题纪念馆”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/55df587e-97b7-4844-a752-79132e9872e2.jpeg',
        content: '新四军第五师纪念馆，位于湖北省孝感市大悟县芳畈镇白果树湾，占地面积近8000平方米，隶属于大悟县文化体育局。1977年，正式成立四军第五师旧址保护机构。 截至2019年末，大悟县新四军第五师纪念馆藏品有34件套，其中珍贵文物4件/套，举办展览2个，开展教育活动576次。',
        position: [113.384316, 31.460218],
    },
    {
        name: '咸丰忠堡大捷遗址及烈士陵园',
        sign: '“建党百年红色旅游景点”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b26324d9-fb54-4679-ae51-49247b7b5af5.png',
        content: '忠堡大捷纪念园位于湖北省咸丰县忠堡镇高笋塘村,即当年红二、六军团取得史称“忠堡大捷”战场遗址处。为了缅怀先烈，弘扬革命精神，人民政府先后在忠堡大捷战场遗址上修建了忠堡大捷纪念碑、咸丰县革命烈士陵园，随后扩建为忠堡大捷纪念园，配套修建了环形路、步行道、广场、停车场等。',
        position: [109.29665, 29.674318],
    },
    {
        name: '湘鄂边苏区革命烈士陵园',
        sign: '“国家重点烈士陵园建筑保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d5b32984-8c57-4d08-b67e-ce7bdd2306df.jpeg',
        content: '满山红烈士陵园位于鹤峰县城娄水河畔，因满山红杜鹃花盛开而得名“满山红”，全称为湘鄂边苏区革命烈士陵园，立有高22米的“湘鄂边苏区革命烈士纪念碑”，为纪念第二次国内革命战争中鹤峰苏区牺牲的烈士而建。陵园的主要建筑物包括楼牌、贺龙铜像、烈士祠、纪念碑和主墓群。',
        position: [110.034011, 29.890073],
    },
    {
        name: '五里坪革命旧址群',
        sign: '“第六批全国重点文物保护单位”',
        level: "A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/9fb423db-2ae2-4d09-88ab-2bc516908264.jpg',
        content: '五里坪革命旧址，又名五里老街，位于湖北省恩施土家族苗族自治州鹤峰县五里乡五里坪老街中段，第二次国内革命战争时期，成为了湘鄂边苏区中心，也是湘鄂边红四军二次东下与红六军会师、成立红二军团的出发地，是整个湘鄂边地区唯一一处保存完好、建筑规模宏大的革命纪念建筑群。',
        position: [110.346179, 29.893672],
    },
    {
        name: '中营红三军军部旧址',
        sign: '“省级革命文物”',
        level: "A级",
        color:0,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/ec2e100d-0865-4b34-9a8e-aa77e754f615.jpg',
        content: '湖北十堰武当山紫霄宫，是武当山九大宫观建筑群的主体，武当山保存最完整的宫殿之一， [1]革命战争时期曾为红三军司令部驻地。父母殿曾是贺龙的卧室和办公室，至今殿内西耳房仍挂着“红三军司令部”的小牌，屋内保存着当年贺龙用过的办公桌椅，茶具、笔筒、木床等。',
        position: [111.028921, 32.424011],
    },
    {
        name: '湘鄂赣边区鄂东南革命烈士陵园',
        sign: '“国家级烈士纪念设施保护单位”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d450fb83-e652-4121-8527-d9745ec14631.webp',
        content: '在鄂东南这片土地上，曾有30万革命先烈为了人民解放事业无畏艰险，献出生命,为了纪念这些革命烈士，湘鄂赣边区鄂东南革命烈士陵园兴建而成。烈士陵园占地面积427亩，是鄂东南地区规模最大的革命烈士陵园。',
        position: [115.214298, 29.846651],
    },
    {
        name: '红三军团建军旧址',
        sign: '“湖北省第二批不可移动革命文物”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/83e745f6-32fd-48f0-a47a-c4784868ec03.jpg',
        content: '红三军军部旧址位于监利县新沟嘴镇解放街北。1931年10月至1932年9月，中国工农红军第三军军部设此，军长贺龙，政治委员夏曦。旧址建于清代，现存为四合院式布局，面阔四间12.8米，通进深24.2米，硬山顶，穿斗、抬梁混合式砖木结构。',
        position: [114.833973, 29.936998],
    },
    {
        name: '鄂州市梁子湖区湘鄂赣军区司令部旧址',
        sign: '“湖北省级文物保护单位”',
        level: "A级",
        color:1,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/a863c42b-c1fb-4de1-be63-8665a071a0a2.webp',
        content: '旧址位于梁子湖区梁子岛南部张家楼房（原称张家炉坊），始建于清代，初为私塾学堂，后为作坊。1945年2月，由王震率领三五九旅主力组成的南下支队与张体学率领的新四军第五师在大悟胜利会师，之后回师樊湖地区开展武装斗争，其间曾在梁子岛居住，部队指挥部也曾设在这里。',
        position: [114.651588, 30.240804],
    },
    {
        name: '武汉革命博物馆',
        sign: '“中国第一红街”',
        level:"A级",
        color:2,
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/817b219d-b63f-438a-9fde-28ac35f2aa72.jpg',
        content: '武汉革命博物馆下辖武昌农民运动讲习所旧址纪念馆、毛泽东旧居纪念馆、中共五大会址纪念馆、陈潭秋烈士纪念馆、武昌起义门管理所、中国共产党纪律建设历史陈列馆。馆内房屋多为晚清式建筑，青砖灰瓦红廊柱，漫步其间，回到那个风起云涌的时代，去见证党的革命故事、光辉历史。',
        position: [114.300394, 30.55369],
    }
]
let dataMonitor = [
    {
        name: "武汉市", adcode: "420100", monitor: "优",
        level:0,
        content: "景区好评度86%",
        company: "窑炉5厂", location: "市景区整体评价：优"
    },
    {
        name: "黄石市", adcode: "420200", monitor: "优",
        level:0,
        content: "景区好评度90%",
        company: "窑炉5厂", location: "市景区整体评价：优",
    },
    {
        name: "十堰市", adcode: "420300", monitor: "中",
        level:2,
        content: "景区好评度50%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
    {
        name: "宜昌市", adcode: "420500", monitor: "中",
        level:2,
        content: "景区好评度56%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
    {
        name: "襄阳市", adcode: "420600", monitor: "中",
        level:2,
        content: "景区好评度58%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
    {
        name: "孝感市", adcode: "420900", monitor: "中",
        level:2,
        content: "景区好评度59%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
    {
        name: "荆州市", adcode: "421000", monitor: "良",
        level:1,
        content: "景区好评度68%",
        company: "窑炉5厂", location: "市景区整体评价：良",
    },
    {
        name: "黄冈市", adcode: "421100", monitor: "优",
        level:0,
        content: "景区好评度95%",
        company: "窑炉5厂", location: "市景区整体评价：优",
    },
    {
        name: "咸宁市", adcode: "421200", monitor: "中",
        level:2,
        content: "景区好评度60%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
    {
        name: "随州市", adcode: "421300", monitor: "中",
        level:2,
        content: "景区好评度56%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
    {
        name: "恩施苗族自治州", adcode: "422800", monitor: "良",
        level:1,
        content: "景区好评度70%",
        company: "窑炉5厂", location: "市景区整体评价：良",
    },
    {
        name: "荆门市", adcode: "420800", monitor: "中",
        level:2,
        content: "景区好评度50%",
        company: "窑炉5厂", location: "市景区整体评价：中",
    },
];


//方法
//生命周期钩子
onMounted(() => {
    init();
    animate();
    window.addEventListener('resize', onWindowSize)
})
//数据的初始化
function init() {
    setScene();
    setCamera();
    setRenderer();
    setController();
    loadMapdata();
    setEarth();
    setRaycaster();
    setLight();
}
//场景的初始化
function setScene() {
    scene = new THREE.Scene();
    //创建场景中的雾
    // scene.fog = new THREE.Fog(0x999999, 0.1, 30);
    // scene.background = new THREE.Color(0x999999);
}
//相机的初始化
function setCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    camera.value = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    camera.value.position.set(0, 0, 16);  // 0,-3,6/0,0,14
    camera.value.lookAt(new THREE.Vector3(0, 0, 0));  // 0, 0, 0 this.scene.position
}
//渲染器的初始化
function setRenderer() {
    renderer = new THREE.WebGLRenderer({
        //是否启用抗锯齿
        antialias: true,
    })
    //设置渲染器的宽和高
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
    //在高密度显示器中获得更高的清晰度和更好的视觉效果
    renderer.setPixelRatio(window.devicePixelRatio);
    container.value.appendChild(renderer.domElement);

    //创建一个2d的渲染器用来渲染标签
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(container.value.clientWidth, container.value.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = 0;
    container.value.appendChild(labelRenderer.domElement);
    // console.log("渲染完成");
}
//轨道控制器的初始化
function setController() {
    controller.value = new OrbitControls(camera.value, labelRenderer.domElement);
    //规定相机与焦点之间的距离
    controller.value.minDistance = 2;
    controller.value.maxDistance = 8;
    //规定相机水平旋转的范围
    controller.value.minAzimuthAngle = -Math.PI / 3;
    controller.value.maxAzimuthAngle = Math.PI / 3;
    //规定相机垂直旋转的范围
    controller.value.minPolarAngle = 1;
    controller.value.maxPolarAngle = Math.PI - 0.1;
    // controller.value.target = new THREE.Vector3(0,0,0);
    // controller.value.target.set(1,0,0);
}
//辅助线暂时没有

//灯光的初始化
function setLight() {
    //设置环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 1.2);//灰色的环境光照射整个场景
    scene.add(ambientLight);
    //设置平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);//白色的平行光照射场景
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    //设置点光源用来照模型
    const test = new THREE.PointLight("#ffffff", 1.8, 20);
    test.position.set(1, -7, 7);
    scene.add(test);
    const testHelperMap = new THREE.PointLightHelper(test);
    scene.add(testHelperMap);
    //点光源用来照地球
    const pointLightMap = new THREE.PointLight("#ffffff", 1, 20);//原色为#4161ff,#B0171F
    pointLightMap.position.set(0, -5, 3);//0,7,3
    scene.add(pointLightMap);
    //辅助光照模型
    //const spotLightHelperMap = new THREE.PointLightHelper(pointLightMap);
    // this.scene.add(spotLightHelperMap);
}

//加载地图数据
function loadMapdata() {
    const loader = new THREE.FileLoader();
    loader.load("/static/map/json/hubei.json", data => {
        const jsondata = JSON.parse(data);
        // console.log(jsondata);
        addMapGeometry(jsondata);
    });
}

//导入省份地图模型
function addMapGeometry(jsondata) {
    //初始化一个地图对象
    map = new THREE.Object3D();
    //墨卡托投影转换
    const projection = d3.geoMercator()
        .center([112, 31])
        .translate([0.2, 0.15]);//根据地图贴图左轻微的调整
    jsondata.features.forEach((elem) => {
        //定义一个3d的省份对象
        const province = new THREE.Object3D();
        //获取每个省份的地理坐标
        const coordinates = elem.geometry.coordinates;
        coordinates.forEach((multiPolygon) => {
            multiPolygon.forEach((polygon) => {
                //创建区域的边界几何体
                const shape = new THREE.Shape();
                const lineMaterial = new THREE.LineBasicMaterial({ color: '#ffffff' });
                const lineGeometry = new THREE.BufferGeometry();
                //创建数组用来存放点的zuobiao 
                const pointsArray = new Array();
                for (let i = 0; i < polygon.length; i++) {
                    //将点投影到平面上,转化为平面坐标
                    const [x, y] = projection(polygon[i]);
                    const scaledX = x * 0.3;
                    const scaledY = -y * 0.3;
                    if (i === 0) {
                        //若该点是起点，则将绘制开始的位置移到这个点
                        shape.moveTo(scaledX, scaledY);
                    }
                    shape.lineTo(scaledX, scaledY);
                    //将三维的坐标存入到数组中，z坐标是自定义的地图拉伸深度
                    pointsArray.push(new THREE.Vector3(scaledX, scaledY, mapConfig.deep));
                    // console.log(pointsArray);
                    //左边缘流光效果，把所有的点保存下来
                    mapEdgeLightObj.value.mapEdgePoints.push([scaledX, scaledY, mapConfig.deep]);
                }
                //将点的坐标作为几何的形状
                lineGeometry.setFromPoints(pointsArray);
                const extrudeSettings = {
                    depth: mapConfig.deep,
                    bevelEnabled: false,//是否斜角
                }
                //创建一个用于拉伸的几何对象，可以沿指定路径进行拉伸
                const geometry = new THREE.ExtrudeGeometry(
                    shape,
                    extrudeSettings
                )
                // const texture = new THREE.TextureLoader().load('/static/map/texture/earth.jpg');
                //创建一个光照模型，表面能够产生光泽
                const material = new THREE.MeshPhongMaterial({
                    color: '#FF0000',//原颜色为#4161ff,#FF0000
                    // map:texture,
                    // bumpMap:texture,
                    transparent: true,
                    opacity: 0.25,//0.4
                    side: THREE.FrontSide,
                })
                //创建一个只考虑漫反射光的光照模型
                const material1 = new THREE.MeshLambertMaterial({
                    color: '#A52A2A',//原色为#10004a,#A52A2A
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.FrontSide,
                    // wireframe: true
                });
                //地图的几何形状
                const mesh = new THREE.Mesh(geometry, [material, material1]);
                //省份之间的边界线
                const line = new THREE.Line(lineGeometry, lineMaterial);
                line.position.z += 0.02;
                //动态加入省份属性
                province.properties = elem.properties;

                //将城市信息放到模型中后续做动画用
                if (elem.properties.centroid) {
                    const [x, y] = projection(elem.properties.centroid)// uv映射坐标

                    province.properties._centroid = [x * 0.3, y * 0.3]
                }
                province.add(mesh);
                province.add(line);
            })
        })
        map.add(province);
    })
    // setMapEdgeLight();
    setMapName();

    // map.scale.set(0.5,0.5,0.5);
    scene.add(map);
    // controller.value.target.copy(map.position);
    // 创建纹理地图平面
    // createTextureMapPlane();
    //获取数据后加载模型
    getResponseData();
}
//创建地图纹理
function createTextureMapPlane() {
    const mapTexture = new THREE.TextureLoader().load("/static/map/texture/map.png");
    const box = new THREE.Box3();
    // let mapBox = new THREE.Box3().setFromObject(map);
    box.expandByObject(map);
    //计算模型的长和宽
    const x = box.max.x - box.min.x;
    const y = box.max.y - box.min.y;
    console.log(x, y);
    //创建平面几何体
    const boxGeometry = new THREE.PlaneGeometry(x, y);
    const material = new THREE.MeshPhongMaterial({
        map: mapTexture,
        bumpMap: mapTexture,
        bumpScale: 0.2,
        transparent: true,
        // opacity:0.1,
        side: THREE.FrontSide,
        color: "#FFC0CB",
    });
    const mesh = new THREE.Mesh(boxGeometry, material);
    // mesh.rotateX(-Math.PI / 2);
    mesh.position.z += 0.26;//+0.26
    mesh.position.x += 0.45;
    // mesh.position.y += 0.11;
    // mesh.renderOrder = 2;
    scene.add(mesh);

}

//地球贴图纹理
function setEarth() {
    const geometry = new THREE.PlaneGeometry(20.0, 20.0);
    const texture = new THREE.TextureLoader().load('/static/map/texture/earth.png');
    const bumpTexture = new THREE.TextureLoader().load('/static/map/texture/earth.png');
    // texture.wrapS = THREE.RepeatWrapping;  // 质地.包裹
    // texture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.MeshPhongMaterial({
        map: texture,  // 贴图
        bumpMap: bumpTexture,//用于创建凹凸贴图的纹理
        bumpScale: 0.1,
        // specularMap: texture,
        // specular: 0xffffff,
        // shininess: 1,
        // color: "#000000", 
        side: THREE.FrontSide
    }
    );
    const earthPlane = new THREE.Mesh(geometry, material);
    scene.add(earthPlane);
}

//地图label
function setMapName() {
    map.children.forEach((elem, index) => {
        // 找到中心点
        const y = -elem.properties._centroid[1]
        const x = elem.properties._centroid[0]
        // 转化为二维坐标
        const vector = new THREE.Vector3(x, y, mapConfig.deep + 0.01)//0.01

        // 添加城市名称
        setCityName(vector, elem.properties.name);
    })
}
//地图上的城市名称显示
function setCityName(vector, name) {
    let spritey = makeTextSprite(
        name,
        {
            fontface: "微软雅黑",
            fontsize: 28,  // 定100调整位置，下面通过scale缩放
            fontColor: { r: 255, g: 255, b: 255, a: 1.0 },
            borderColor: { r: 94, g: 94, b: 94, a: 0.0 },
            backgroundColor: { r: 255, g: 255, b: 0, a: 0.0 },
            borderThickness: 2,
            round: 6
        }
    );
    // 轻微偏移，错开光柱
    // spritey.position.set(vector.x + 0.06, vector.y + 0.0, 0.22);  // num + 0.3
    spritey.position.set(vector.x + 0.2, vector.y - 0.17, 0.3);//+0.2,-0.05,0.3
    scene.add(spritey);
}
//城市名称显示，小精灵mesh
function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};

    let fontface = parameters["fontface"];
    let fontsize = parameters["fontsize"];
    let fontColor = parameters["fontColor"];
    let borderThickness = parameters["borderThickness"];
    let borderColor = parameters["borderColor"];
    let backgroundColor = parameters["backgroundColor"];

    // var spriteAlignment = THREE.SpriteAlignment.topLeft;

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    let metrics = context.measureText(message);
    let textWidth = metrics.width;

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    const painting = {
        width: textWidth * 1.4 + borderThickness * 2 + 0.1,
        height: fontsize * 1.4 + borderThickness * 2,
        round: parameters["round"]
    };
    // 1.4 is extra height factor for text below baseline: g,j,p,q.
    // context.fillRect(0, 0, painting.width, painting.height)
    roundRect(
        context,
        borderThickness / 2,
        borderThickness / 2,
        painting.width,
        painting.height,
        painting.round
    );

    // text color
    context.fillStyle = "rgba(" + fontColor.r + "," + fontColor.g + "," + fontColor.b + "," + fontColor.a + ")";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(message, painting.width / 2, painting.height / 2);

    // canvas contents will be used for a texture
    let texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        // useScreenCoordinates: false,
        depthTest: false,  // 解决精灵谍影问题
        // blending: THREE.AdditiveBlending,
        // transparent: true,
        // alignment: spriteAlignment
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, 1 / 2, 1);
    return sprite;
}
//城市名称显示的样式
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// 获取数据后，加载地图数据展示模型
function getResponseData() {
    setTimeout(function () {
        addCityModel();
        addAlarmModel();
        addEnergyModel();
        addMonitorModel();
        // 初始化动画
        setTimeout(cameraTween, 100)//原是100
    }, 500)
}


// 地区中心点 - 获取向量
function mapElem2Centroid(elem) {
    // 找到中心点
    const y = -elem.properties._centroid[1];
    const x = elem.properties._centroid[0];
    // 转化为三维坐标
    const vector = new THREE.Vector3(x, y, mapConfig.deep + 0.01);
    return vector;
}

// 数据归一化，映射到0-1区间 - 获取最大值
function getMaxV(distributionInfo) {
    let max = ref(0);
    for (let item of distributionInfo) {
        if (max.value < item.total) max.value = item.total;
    }
    return max.value;
}
// 数据归一化，映射到0-1区间 - 获取最小值
function getMinV(distributionInfo) {
    let min = ref(1000000);
    for (let item of distributionInfo) {
        if (min.value > item.total) min.value = item.total;
    }
    return min.value;
}
// 数据归一化，映射到0-1区间
function normalization(data, min, max) {
    let normalizationRatio = (data - min) / (max - min)
    return normalizationRatio
}

//添加地图数据模型
// GroupOne 添加模型
function addCityModel() {
    // 数据归一化
    const min = getMinV(dataTotal);
    const max = getMaxV(dataTotal);
    // 添加模型
    map.children.forEach((elem, index) => {
        // 满足数据条件 dataTotal
        if (dataTotal) {
            const vector = mapElem2Centroid(elem);
            dataTotal.forEach(d => {
                // 数据归一化，映射到0-1区间
                let num = normalization(d.total, min, max);
                // 判断区县
                if (d.name === elem.properties.name) {
                    // 添加城市光波
                    setCityWave(vector);

                    // 添加城市标记
                    setCityMarker(vector);

                    // 添加城市光柱
                    setCityCylinder(vector, num);

                    // 添加城市数据
                    setCityNum(vector, num, d);
                }
            })
            scene.add(groupOne);
        }
    })
}
//二维坐标转三维坐标
function getVector3(position) {
    const projection = d3.geoMercator()
        .center([112, 31])
        .translate([0.2, 0.15]);
    const [x, y] = projection(position);
    const scaledX = x * 0.3;
    const scaledY = -y * 0.3;
    const vector = new THREE.Vector3(scaledX, scaledY, mapConfig.deep + 0.01);
    return vector;
}

function addAlarmModel() {
    dataAlarm.forEach((elem, index) => {
        if (dataAlarm) {
            const vector = getVector3(elem.position);
            const colorLevel = ["#FFFF00", "#FFA500","#ff1800" ];
            // 添加告警光波
            setAlarmWave(vector, colorLevel[elem.color]);
            // 添加告警标记
            setAlarmCylinder(vector, colorLevel[elem.color]);
            // 添加告警名称
            setAlarmName(vector, colorLevel[elem.color], elem);
            // 先隐藏，通过按钮控制
            groupTwo.visible = false;
            scene.add(groupTwo);
        }
    })
}


// GroupThree 添加模型
function addEnergyModel() {
    dataEnergy.forEach((elem, index) => {
        // console.log(elem);
        // 满足数据条件 dataEnergy
        if (dataEnergy) {
            const vector = getVector3(elem.position);
            const colorLevel = ["#FFFF00", "#FFA500","#ff1800" ];
            // 添加告警光波
            setEnergyWave(vector, colorLevel);
            // 添加告警标记
            //console.log(index);
            setEnergyCylinder(vector, colorLevel[elem.color],elem.name,index);
            // 添加告警名称
            // setEnergyName(vector, colorLevel, elem);
            // 先隐藏，通过按钮控制
            groupThree.visible = false;
            scene.add(groupThree);
            // 各等级颜色 1、2、3
            //const colorLevel = ["#ff1800", "#FF8A00", "#FAE52D"];
        }
    })
}




// GroupFour 添加模型
function addMonitorModel() {
    map.children.forEach((elem, index) => {
        // console.log(elem);
        // 满足数据条件 dataMonitor
        if (dataMonitor) {
            const vector = mapElem2Centroid(elem);
            // 各等级颜色 1、2、3
            dataMonitor.forEach(d => {
                // 判断区县
                if (d.name === elem.properties.name) {
                    // 添加监测光波
                    setMonitorWave(vector);

                    // 添加监测标记
                    setMonitorIcon(vector);

                    // 添加监测名称
                    setMonitorName(vector, d);
                }
            })

            // 先隐藏，通过按钮控制
            groupFour.visible = false;
            scene.add(groupFour);
        }
    })
}

//模型1的数据
// 城市 - 光柱
function setCityCylinder(vector, num) {
    const height = num;
    const geometry = new THREE.CylinderGeometry(0.08, 0.08, height, 20);

    // 顶点着色器
    const vertexShader = `
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
              vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
              intensity = pow(dot(normalize(viewVector), actual_normal), 3.0);
          }
          `
    // 片段着色器
    const fragmentShader = `
          varying float intensity;
          void main() {
            vec3 glow = vec3(246, 239, 0) * 3.0;
            gl_FragColor = vec4(glow, 1);
          }
          `

    let material = new THREE.MeshPhongMaterial({  // ShaderMaterial
        // uniforms: {
        //     viewVector: this.camera.position
        // },
        // vertexShader: vertexShader,
        // fragmentShader: fragmentShader,
        color: "#ede619",
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        // depthTest: false,
        precision: "mediump",
        // depthFunc: THREE.LessEqualDepth,
        opacity: 0.9,
    });

    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(vector.x, vector.y, vector.z + height / 2);
    cylinder.rotateX(Math.PI / 2);
    cylinder.scale.set(1, 1, 1);
    // cylinder.position.z -= height / 2;
    // cylinder.translateY(-height);
    cylinder._height = height;

    // 法向量计算位置
    // let coordVec3 = vector.normalize();
    // // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    // let meshNormal = new THREE.Vector3(0, 0, 0);
    // // 四元数属性，角度旋转，quaternion表示mesh的角度状态，setFromUnitVectors();计算两个向量之间构成的四元数值
    // cylinder.quaternion.setFromUnitVectors(meshNormal, coordVec3);
    cityCylinderMeshArr.value.push(cylinder);
    groupOne.add(cylinder);
    // this.scene.add(cylinder);
}
// 城市 - 光波
function setCityWave(vector) {
    const cityGeometry = new THREE.PlaneBufferGeometry(1, 1); //默认在XOY平面上
    const textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    const texture = textureLoader.load('/static/map/texture/wave.png');

    // 如果不同mesh材质的透明度、颜色等属性同一时刻不同，材质不能共享
    const cityWaveMaterial = new THREE.MeshBasicMaterial({
        color: "#ede619",  // 0x22ffcc
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        opacity: 1.0,
        side: THREE.FrontSide, //双面可见
        depthWrite: false, //禁止写入深度缓冲区数据
        blending: THREE.AdditiveBlending,
    });

    let cityWaveMesh = new THREE.Mesh(cityGeometry, cityWaveMaterial);
    cityWaveMesh.position.set(vector.x, vector.y, vector.z);
    cityWaveMesh.size = 0;
    // cityWaveMesh.scale.set(0.1, 0.1, 0.1);  // 设置mesh大小

    // 法向量计算位置
    // let coordVec3 = vector.normalize();
    // // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    // let meshNormal = new THREE.Vector3(0, 0, 0);
    // // 四元数属性，角度旋转，quaternion表示mesh的角度状态，setFromUnitVectors();计算两个向量之间构成的四元数值
    // cityWaveMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
    cityWaveMeshArr.value.push(cityWaveMesh);
    groupOne.add(cityWaveMesh);
    // 添加到场景中
    // this.scene.add(cityWaveMesh);
}
// 城市 - 标记
function setCityMarker(vector) {
    const cityGeometry = new THREE.PlaneBufferGeometry(0.3, 0.3); //默认在XOY平面上
    const textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    const texture = textureLoader.load('/static/map/texture/marker.png');

    // 如果不同mesh材质的透明度、颜色等属性同一时刻不同，材质不能共享
    const cityMaterial = new THREE.MeshBasicMaterial({
        color: "#ffe000",  // 0x22ffcc
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        opacity: 1.0,
        side: THREE.FrontSide, //双面可见
        depthWrite: false, //禁止写入深度缓冲区数据
        blending: THREE.AdditiveBlending,
    });
    cityMaterial.blending = THREE.CustomBlending;
    cityMaterial.blendSrc = THREE.SrcAlphaFactor;
    cityMaterial.blendDst = THREE.DstAlphaFactor;
    cityMaterial.blendEquation = THREE.AddEquation;

    let cityMarkerMesh = new THREE.Mesh(cityGeometry, cityMaterial);
    cityMarkerMesh.position.set(vector.x, vector.y, vector.z);
    cityMarkerMesh.size = 0;
    // cityWaveMesh.scale.set(0.1, 0.1, 0.1);  // 设置mesh大小

    cityMarkerMeshArr.value.push(cityMarkerMesh);
    groupOne.add(cityMarkerMesh);
    // 添加到场景中
    // this.scene.add(cityMarkerMesh);  
}
// 城市 - 数据显示
function setCityNum(vector, num, data) {
    // CSS2DRenderer生成的标签直接就是挂在真实的DOM上，并非是Vue的虚拟DOM上
    const div = document.createElement('div');
    div.className = 'city-num-label';
    div.textContent = data.total;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'city-num-label-content';
    contentDiv.innerHTML =
        '本区县共有窑炉企业 ' + data.total + ' 个。<br/>' +
        '介绍：' + data.brief
        ;
    div.appendChild(contentDiv);

    const label = new CSS2DObject(div);
    label.position.set(vector.x, vector.y, num + 0.5);
    label.visible = true;
    cityNumMeshArr.value.push(label);
    groupOne.add(label);
    // this.scene.add(spritey);
}

//模型2的数据
// 告警 - 光波
function setAlarmWave(vector, color) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1); //默认在XOY平面上
    const textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    const texture = textureLoader.load('/static/map/texture/alarm.png');

    const material = new THREE.MeshBasicMaterial({
        color: color,
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        opacity: 1.0,
        side: THREE.FrontSide,
        depthWrite: false, //禁止写入深度缓冲区数据
        blending: THREE.AdditiveBlending,

    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(vector.x, vector.y, vector.z);
    mesh.scale.set(0.4, 0.4, 0.4);  // 设置mesh大小

    alarmWaveMeshArr.value.push(mesh);
    groupTwo.add(mesh);
}

// 告警 - 三角锥标记
function setAlarmCylinder(vector, color) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.0, 0.3, 4);
    let material = new THREE.MeshPhongMaterial({  // ShaderMaterial
        color: color,
        side: THREE.FrontSide,
        // blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
    });

    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(vector.x, vector.y, vector.z + 0.3);
    cylinder.rotateX(Math.PI / 2);
    cylinder.scale.set(1, 1, 1);

    alarmCylinderMeshArr.value.push(cylinder);
    groupTwo.add(cylinder);
}
// 告警 - 名称显示
function setAlarmName(vector, color, data) {
    // CSS2DRenderer生成的标签直接就是挂在真实的DOM上，并非是Vue的虚拟DOM上
    const div = document.createElement('div');
    div.className = 'alarm-label';
    const icon = document.createElement('span');
    icon.className = 'alarm-label-icon';
    icon.textContent = '●';
    icon.style.color = color;
    div.appendChild(icon);

    const text = document.createElement('span');
    text.className = 'alarm-label-text';
    text.textContent = data.level;
    div.appendChild(text);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'alarm-label-content';
    contentDiv.innerHTML =
        data.name + '<br/>' +
        '背景：' + data.sign + '<br/>' +
        '详情：' + data.content;
    div.appendChild(contentDiv);
    // // 创建第一个按钮
    // const button1 = document.createElement('button');
    // button1.className = 'alarm-label-button1'; // 添加类名
    // button1.textContent = '按钮1'; // 设置按钮文本
    // // 创建第二个按钮
    // const button2 = document.createElement('button');
    // button2.className = 'alarm-label-button2'; // 添加类名
    // button2.textContent = '按钮2'; // 设置按钮文本

    // div.appendChild(button1);
    // div.appendChild(button2);

    const image = document.createElement('img');
    image.className = 'alarm-label-img'; // 添加类名
    image.src = data.photo; // 设置图片的路径
    // 将 img 元素添加到 div 元素中
    div.appendChild(image);
    const label = new CSS2DObject(div);
    label.position.set(vector.x, vector.y, vector.z + 0.65);
    label.visible = false;
    alarmNameMeshArr.value.push(label);
    groupTwo.add(label);
    // this.scene.add(spritey);
}
//模型3数据
// 能源 - 光波
function setEnergyWave(vector, color) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1); //默认在XOY平面上
    const textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    const texture = textureLoader.load('/static/map/texture/alarm.png');

    const material = new THREE.MeshBasicMaterial({
        color: color,
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        opacity: 1.0,
        side: THREE.FrontSide,
        depthWrite: false, //禁止写入深度缓冲区数据
        blending: THREE.AdditiveBlending,

    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(vector.x, vector.y, vector.z);
    mesh.scale.set(0.4, 0.4, 0.4);  // 设置mesh大小

    energyWaveMeshArr.value.push(mesh);
    groupThree.add(mesh);
}
// 能源 - 四角锥标记
function setEnergyCylinder(vector, color,name,index) {
    const geometry = new THREE.OctahedronGeometry(0.12, 0);
    let material = new THREE.MeshPhongMaterial({  // ShaderMaterial
        color: color,
        side: THREE.FrontSide,
        // blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
    });

    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.name = name;
    cylinder.index = index;
    cylinder.position.set(vector.x, vector.y, vector.z + 0.3);
    cylinder.rotateX(Math.PI / 2);
    cylinder.scale.set(1, 1, 1);

    energyCylinderMeshArr.value.push(cylinder);
    groupThree.add(cylinder);
}
// 能源 - 名称显示
function setEnergyName(vector, color, data) {
    // CSS2DRenderer生成的标签直接就是挂在真实的DOM上，并非是Vue的虚拟DOM上
    const div = document.createElement('div');
    div.className = 'alarm-label';

    const icon = document.createElement('span');
    icon.className = 'alarm-label-icon';
    icon.textContent = '◆';
    icon.style.color = color;
    div.appendChild(icon);

    const text = document.createElement('span');
    text.className = 'alarm-label-text';
    text.textContent = data.type;
    div.appendChild(text);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'alarm-label-content';
    contentDiv.innerHTML =
        '告警：' + data.content + '<br/>' +
        '企业：' + data.company + '<br/>' +
        '位置：' + data.location + '<br/>' +
        '电话：' + data.tel
        ;
    div.appendChild(contentDiv);

    const label = new CSS2DObject(div);
    label.position.set(vector.x, vector.y, vector.z + 0.65);
    label.visible = false;
    energyNameMeshArr.value.push(label);
    groupThree.add(label);
    // this.scene.add(spritey);
}
//模型4数据
// 监测 - 光波
function setMonitorWave(vector) {
    const geometry = new THREE.PlaneBufferGeometry(1, 1); //默认在XOY平面上
    const textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    const texture = textureLoader.load('/static/map/texture/marker.png');

    const material = new THREE.MeshBasicMaterial({
        color: "#B3FFFF",
        map: texture,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        opacity: 0.9,
        side: THREE.FrontSide,
        depthWrite: false, //禁止写入深度缓冲区数据
        // blending: THREE.AdditiveBlending,

    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(vector.x, vector.y, vector.z);
    mesh.scale.set(0.4, 0.4, 0.4);  // 设置mesh大小

    monitorWaveMeshArr.value.push(mesh);
    groupFour.add(mesh);
}
// 监测 - 标记
function setMonitorIcon(vector) {
    const geometry = new THREE.PlaneGeometry(0.8, 0.8);
    const texture = new THREE.TextureLoader().load('/static/map/texture/满意度.png')
    let material = new THREE.MeshPhongMaterial({
        map: texture,
        color: "#FF0000",
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(vector.x, vector.y, vector.z + 0.25);
    mesh.rotateX(Math.PI / 4);
    mesh.scale.set(0.3, 0.3, 0.3);
    // mesh.lookAt(this.camera.position)

    monitorIconMeshArr.value.push(mesh);
    groupFour.add(mesh);
}
// 监测 - 名称显示
function setMonitorName(vector, data) {
    // CSS2DRenderer生成的标签直接就是挂在真实的DOM上，并非是Vue的虚拟DOM上
    const div = document.createElement('div');
    div.className = 'groupfour-label';

    const icon = document.createElement('span');
    icon.className = 'groupfour-label-icon';
    icon.textContent = '◉';
    icon.style.color = "#ffffff";
    div.appendChild(icon);

    const text = document.createElement('span');
    text.className = 'groupfour-label-text';
    text.textContent = data.monitor;
    div.appendChild(text);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'groupfour-label-content';
    contentDiv.innerHTML =
        '市景区评价：' + data.content + '<br/>' +
        '位置：' + data.location
        ;
    div.appendChild(contentDiv);

    const label = new CSS2DObject(div);
    label.position.set(vector.x, vector.y, vector.z + 0.65);
    label.visible = false;
    monitorNameMeshArr.value.push(label);
    groupFour.add(label);
    // this.scene.add(spritey);
}

//创建射线用于捕捉鼠标位置
function setRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    //鼠标移动事件
    const onMouseMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        if(tooltip.value&&tooltip1.value)
        {
            tooltip.value.style.left = event.clientX + 2 + 'px';
            tooltip.value.style.top = event.clientY + 2 + 'px';
            tooltip1.value.style.left = event.clientX + 2 +'px';
            tooltip1.value.style.top = event.clientY + 2 + 'px';
        }
        
    }
    // // 点击地图事件
    const onClick = (event) => {
        // console.log(lastPick)
        if(redTravel&&AtgroupThree.value)
        {
            redTravelClick();
        }
        else if (lastPick && "point" in lastPick) {
            mapClickTween(lastPick.point);
        }
        else resetCameraTween();
    }
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
}
// 鼠标悬浮显示
function showTip() {
    // 显示省份的信息
    //按照下列优先级来优先展示标签
    if(redTravel&&AtgroupThree.value)
    {
        if(tooltip1.value&&tooltip1.value)
        {
            tooltip1.value.textContent = redTravel.object.name;

            tooltip1.value.style.visibility = 'visible';
        }
    }
    else if (lastPick) {
        const properties = lastPick.object.parent.properties;
        if(tooltip1.value&&tooltip1.value){
            tooltip.value.textContent = properties.name;

            tooltip.value.style.visibility = 'visible';
            tooltip1.value.style.visibility = 'hidden';
        }
    } 
    else {
        if(tooltip1.value&&tooltip1.value)
        {
            tooltip.value.style.visibility = 'hidden';
            tooltip1.value.style.visibility = 'hidden';
        }
    }
}
//窗口变化函数
function onWindowSize() {
    // let container = document.getElementById("container");
    if(container.value)
    {
        camera.value.aspect = container.value.clientWidth / container.value.clientHeight;
        camera.value.updateProjectionMatrix();
        renderer.setSize(container.value.clientWidth, container.value.clientHeight);
        labelRenderer.setSize(container.value.clientWidth, container.value.clientHeight);
    }
    
    // console.log("执行了");
}
// Tween - 城市光柱动画
function cityCylinderTween() {
    console.log(cityCylinderMeshArr.value);
    cityCylinderMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        const begin = {
            // z: mesh.position.z,
            height: 0,
        };
        const end = {
            // z: mesh.position.z + mesh._height,
            height: mesh._height,
        };
        tween.use({
            begin,
            end,
            time: 1000,
            onUpdate(obj) {
                mesh.scale.y = obj.height / mesh.geometry.parameters.height;
            },
            onComplete() {
                // 动画结束，显示数据
                cityNumMeshArr.value.forEach(e => {
                    e.visible = true;
                })
            }
        });
    })
}



//Tween动画
//加载时移动相机动画
function cameraTween(i) {

    !i ? i = 0 : i = i;
    if (i > cameraPosArr.value.length - 1) {
        // cityCylinderTween();
        return false;
    }
    //关闭控制器
    controller.value.enabled = false;
    ifcameraTween.value = true;
    //动画开始前相机的位置
    const begin = {
        x: camera.value.position.x,
        y: camera.value.position.y,
        z: camera.value.position.z,
    };
    //动画结束时相机的位置
    const end = {
        x: cameraPosArr.value[i].x,
        y: cameraPosArr.value[i].y,
        z: cameraPosArr.value[i].z,
        // x: 0,
        // y: -3.0,
        // z: 3.8,
    };
    //使用获取到的实例tween中的方法
    tween.use({
        begin,
        end,
        time: 1500,
        onUpdate(obj) {
            camera.value.position.x = obj.x;
            camera.value.position.y = obj.y;
            camera.value.position.z = obj.z;
            controller.value.update();
        },
        onComplete() {
            //动画结束时将控制器设置为
            controller.value.enabled = true;
            ifcameraTween.value = false;
            ifShowAll.value = true;
            cameraTween(i + 1);
        }
    });
}
//点击景点动画
function redTravelClick()
{
    // console.log("景点被点击了",redTravel.object.index);
    emitter.emit('show',redTravel.object.index)
}

// Tween - 点击省份动画
function mapClickTween(pos) {
    //关闭控制器
    if (ifcameraTween.value || ifShowAll.value) {
        console.log("正在播放加载动画或者总览,点击省份动画失效");
    }
    else {
        controller.value.enabled = false;
        ifmapClickTween.value = true;
        ifcameraTween.value = true;
        lastPick.object.material[0].color.set('#FF0000');
        // tooltip.value.style.visibility = 'hidden';
        const begin = {
            x: camera.value.position.x,
            y: camera.value.position.y,
            z: camera.value.position.z,
        };
        const end = {
            x: pos.x,
            y: pos.y,
            z: pos.z + 3,
        };

        tween.use({
            begin,
            end,
            time: 500,
            onUpdate(obj) {
                camera.value.position.x = obj.x;
                camera.value.position.y = obj.y;
                camera.value.position.z = obj.z;
                camera.value.lookAt(obj.x, obj.y, obj.z);
                // 控制器更新
                controller.value.update();
            },
            onComplete() {
                controller.value.enabled = true;
                ifmapClickTween.value = false;
                ifcameraTween.value = false;
            }
        });
    }

}
// Tween - 重置相机
function resetCameraTween() {
    //关闭控制器
    if (ifcameraTween.value || ifShowAll.value) {
        console.log("正在播放加载动画,重置相机动画失效");
    }
    else {
        controller.value.enabled = false;
        ifcameraTween.value = true;
        const begin = {
            x: camera.value.position.x,
            y: camera.value.position.y,
            z: camera.value.position.z,
        };
        const end = {
            x: cameraPosArr.value[cameraPosArr.value.length - 1].x,
            y: cameraPosArr.value[cameraPosArr.value.length - 1].y,
            z: cameraPosArr.value[cameraPosArr.value.length - 1].z,
        };
        tween.use({
            begin,
            end,
            time: 500,
            onUpdate(obj) {
                camera.value.position.x = obj.x;
                camera.value.position.y = obj.y;
                camera.value.position.z = obj.z;

                camera.value.lookAt(0, 0, 0);

                // 控制器更新
                controller.value.update();
            },
            onComplete() {
                controller.value.enabled = true;
                ifcameraTween.value = false;
            }
        });
    }

}


//循环渲染
function animate() {
    //循环渲染
    requestAnimationFrame(animate);

    if (ifShowAll.value) {
        animationCamera();
    }
    showTip();
    if (!ifmapClickTween.value) {
        animationMouseover();
    }
    // groupOne
    animationOneWave();
    animationOneMarker();
    // animationCityCylinder();
    // animationCityEdgeLight();

    // groupTwo
    animationTwoWave();
    animationTwoCylinder();

    // groupThree
    animationThreeWave();
    animationThreeCylinder();

    // groupFour
    animationMonitorWave();
    animationFourPlane();
    controller.value.update();
    renderer.render(scene, camera.value);
    labelRenderer.render(scene, camera.value);
    // console.log(camera.value.position);
}
// 动画 - 鼠标悬浮动作
function animationMouseover() {
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouse, camera.value)
    // 计算物体和射线的焦点，与当场景相交的对象有那些
    const intersects = raycaster.intersectObjects(
        scene.children,
        true  // true，则同时也会检测所有物体的后代
    )

    // 恢复上一次清空的地图对象的颜色
    if (lastPick) {
        lastPick.object.material[0].color.set('#FF0000');//原色为：#4161ff
        // this.lastPick.object.material[1].color.set('#00035d');
    }
    //然后将内容置为空准备存储新的地图对象
    lastPick = null;
    lastPick = intersects.find(
        (item) => item.object.material && item.object.material.length === 2  // 选择map object
    )
    //每次经过这个循环都重新将捕捉的景点对象置为空
    redTravel = null;
    redTravel = intersects.find(
        (item) => item.object.geometry.type === "OctahedronGeometry"
    )
    //若景点对象不为空则地图不显示颜色
    if (redTravel) {
        // console.log(redTravel.object);
    }
    //将捕捉到的新的地图对象设置颜色
    else if (lastPick) {
        // console.log("捕捉到了");
        lastPick.object.material[0].color.set('#7CFC00');//原色为#00035d,#FF00FF
        // this.lastPick.object.material[1].color.set('#00035d');
    }
}
// 动画 - groupOne光波
function animationOneWave() {
    // console.log(this.cityWaveMesh);
    cityWaveMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.size += 0.005;  // Math.random() / 100 / 2
        let scale = mesh.size / 1;
        mesh.scale.set(scale, scale, scale);
        if (mesh.size <= 0.5) {
            mesh.material.opacity = 1;
        } else if (mesh.size > 0.5 && mesh.size <= 1) {
            mesh.material.opacity = 1.0 - (mesh.size - 0.5) * 2;  // 0.5以后开始加透明度直到0
        } else if (mesh.size > 1 && mesh.size < 2) {
            mesh.size = 0;
        }
    })
}
// 动画 - groupOne标记
function animationOneMarker() {
    cityMarkerMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.rotation.z += 0.05;
    })
}
// 动画 - groupTwo光波
function animationTwoWave() {
    // console.log(this.alarmWaveMeshArr);
    alarmWaveMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.rotation.z -= 0.01;
    })
}
// 动画 - groupTwo三角锥
function animationTwoCylinder() {
    alarmCylinderMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.rotation.y += 0.03;
        // if(mesh.position.z < 0.8) {
        //   mesh.position.z += 0.03;
        // } else if(mesh.position.z > 1.2) {
        //   mesh.position.z -= 0.03;
        // }
    })
}
//动画-groupThree光波
function animationThreeWave() {
    energyWaveMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.rotation.z -= 0.01;
    })
}
//动画-groupThree四棱锥
function animationThreeCylinder() {
    energyCylinderMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.rotation.y += 0.01;
        // if(mesh.position.z < 0.8) {
        //   mesh.position.z += 0.03;
        // } else if(mesh.position.z > 1.2) {
        //   mesh.position.z -= 0.03;
        // }
    })
}


//动画鼠标移动到四棱锥上时相应的四棱锥会做上下往复的动画
function animationThreeCylinder_action() {
    let speed = 0.03; // 上下运动的速度
    const maxHeight = 1.2; // 上下运动的最大高度
    const minHeight = 0.8; // 上下运动的最小高度
    
    energyCylinderMeshArr.value.forEach(mesh => {
        if (mesh.name === redTravel.object.name) 
        {
            // console.log("四棱锥动了");
            
        }
    })
}
// 动画 - groupFour光波
function animationMonitorWave() {
    monitorWaveMeshArr.value.forEach(mesh => {
        // console.log(mesh);
        mesh.rotation.z += 0.03;
    })
}
//动画-groupFour平面几何体
function animationFourPlane() {
    monitorIconMeshArr.value.forEach(mesh => {
        mesh.rotation.y += 0.03;
    })
}
//相机做圆周运动时的初始角度，半径,已经相机正对着的目标点
let angle = 0;
let radius = 2.5;
let target = new THREE.Vector3(0, 0, 0);
//开始动画前的相机位置为0，-3.5，5
function animationCamera() {
    angle += 0.01;
    camera.value.position.x = target.x - radius * Math.cos(angle);
    camera.value.position.y = target.y - radius * Math.sin(angle);
    camera.value.lookAt(target);
}


//城市边缘光的动画
function animationCityEdgeLight() {
    if (mapEdgeLightObj.value.lightOpacitys && mapEdgeLightObj.value.mapEdgePoints) {
        if (mapEdgeLightObj.value.lightCurrentPos > (mapEdgeLightObj.value.mapEdgePoints.length - mapEdgeLightObj.value.lightSpeed)) {
            mapEdgeLightObj.value.lightCurrentPos = 0;
        }

        mapEdgeLightObj.value.lightCurrentPos += mapEdgeLightObj.value.lightSpeed;
        for (let i = 0; i < mapEdgeLightObj.value.lightSpeed; i++) {
            mapEdgeLightObj.value.lightOpacitys[(mapEdgeLightObj.value.lightCurrentPos - i) % mapEdgeLightObj.value.mapEdgePoints.length] = 0;

        }

        for (let i = 0; i < 200; i++) {
            mapEdgeLightObj.value.lightOpacitys[(mapEdgeLightObj.value.lightCurrentPos + i) % mapEdgeLightObj.value.mapEdgePoints.length] = i / 50 > 2 ? 2 : i / 50;
            mapEdgeLightObj.value.lightOpacityGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(mapEdgeLightObj.value.lightOpacitys, 1));
        }

        if (mapEdgeLightObj.value.lightOpacityGeometry) {
            mapEdgeLightObj.value.lightOpacityGeometry.attributes.aOpacity.needsUpdate = true;
        }
    }
}


// 切换Group形态
function groupOneChange() {
    console.log("groupOneChange");
    AtgroupThree.value = false
    // CSS2DObject数据单独做处理
    cityNumMeshArr.value.forEach(e => { e.visible = true });
    alarmNameMeshArr.value.forEach(e => { e.visible = false });
    energyNameMeshArr.value.forEach(e => { e.visible = false });
    monitorNameMeshArr.value.forEach(e => { e.visible = false });

    groupOne.visible = true;
    groupTwo.visible = false;
    groupThree.visible = false;
    groupFour.visible = false;
}
function groupTwoChange() {
    console.log("groupTwoChange");
    AtgroupThree.value = false;
    // CSS2DObject数据单独做处理
    cityNumMeshArr.value.forEach(e => { e.visible = false });
    alarmNameMeshArr.value.forEach(e => { e.visible = true });
    energyNameMeshArr.value.forEach(e => { e.visible = false });
    monitorNameMeshArr.value.forEach(e => { e.visible = false });

    groupOne.visible = false;
    groupTwo.visible = true;
    groupThree.visible = false;
    groupFour.visible = false;
}
function groupThreeChange() {
    AtgroupThree.value = true;
    console.log("groupThreeChange");
    // CSS2DObject数据单独做处理
    cityNumMeshArr.value.forEach(e => { e.visible = false });
    alarmNameMeshArr.value.forEach(e => { e.visible = false });
    energyNameMeshArr.value.forEach(e => { e.visible = true });
    monitorNameMeshArr.value.forEach(e => { e.visible = false });
    groupOne.visible = false;
    groupTwo.visible = false;
    groupThree.visible = true;
    groupFour.visible = false;
}

function groupFourChange() {
    console.log("groupFourChange");
    AtgroupThree.value = false;
    // CSS2DObject数据单独做处理
    cityNumMeshArr.value.forEach(e => { e.visible = false });
    alarmNameMeshArr.value.forEach(e => { e.visible = false });
    energyNameMeshArr.value.forEach(e => { e.visible = false });
    monitorNameMeshArr.value.forEach(e => { e.visible = true });
    groupOne.visible = false;
    groupTwo.visible = false;
    groupThree.visible = false;
    groupFour.visible = true;
}
function showAll() {
    console.log("showAll");
    //若已经在总览模式下,则关闭总览模式
    if (ifShowAll.value) {
        ifShowAll.value = ifcameraTween.value;
        controller.value.enabled = true;
    }
    //若不是总览模式则开启总览模式
    else {
        //开启圆周运动
        ifShowAll.value = !ifcameraTween.value;
        controller.value.enabled = false;
    }
    console.log(controller.value.enabled);
    // controller.value.autoRotate = true;
    // // controller.value.autoRotateSpeed = 10;
    // controller.value.autoRotateDirection = THREE.MOUSE.LEFT;
}


</script>

<style>
.map-container{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
#container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#tooltip {
    position: absolute;
    z-index: 2;
    background: linear-gradient(180deg, #B0DEFF 0%, #2C4FDC 100%);
    padding: 6px 10px;
    color: #fff;
    border: 2px solid #FAE52D;
    font-weight: bold;
    font-size: 16px;
    /* border-radius: 4px; */
    visibility: hidden;
}
#tooltip1 {
    position: absolute;
    z-index: 2;
    background: linear-gradient(180deg, #ffd0b0 0%, #dc2c2c 100%);
    padding: 6px 10px;
    color: #fff;
    border: 2px solid #faec2d;
    border-radius: 2px;
    font-weight: bold;
    font-size: 16px;
    /* border-radius: 4px; */
    visibility: hidden;
}
/*.button-group {
    position: absolute;
    left: 24px;
    top: 24px;
    z-index: 2;
}*/
.button-group {
            position: absolute;
            left: 50%;
            bottom: 50px;
            z-index: 3;
            width: 350px;
            height: 120px;
            transform: translate(-50%);
        }

        .button-group .btn {
            position: absolute;
            border: 0px;
            cursor: pointer;
            filter: drop-shadow(0px 0px 10px #b02505);
            z-index: 3;
            background-color: transparent;
        }

        .button-group .btn1:active,
        .button-group .btn5:active,
        .button-group .btn5:active {
            transform: scale(0.96);
            transition: transform 0.3s ease;
        }

        .button-group .btn1 {
            left: 0;
            top: 50%;

        }

        .button-group .btn2 {
            left: 50%;
            transform: translate(-200%, 0);
            top: -13px;
        }

        .button-group .btn2:active {
            transform: translate(-200%, 0) scale(0.96);
        }

        .button-group .btn3 {
            left: 50%;
            transform: translate(-50%, 0);
            top: -17px;
        }

        .button-groupenter-btns .btn3:active {
            transform: translate(-50%, 0) scale(0.96);
        }

        .button-group .btn4 {
            left: 50%;
            transform: translate(100%);
            top: -10px;
        }

        .button-group .btn4:active {
            transform: translate(100%, 0) scale(0.96);
        }

        .button-group .btn5 {
            right: 0;
            top: 50%;
        }


.button-group img {
    width: 56px;
}

.button-group img {
            width: 70px;
            z-index: 5;
        }

        .button-group .all {
            width: 150px;
            height: auto;
            position: absolute;
            left: 50%;
            top: 60%;
             bottom: 0;
            cursor: pointer;
            transform: translate(-50%, 0);
            transition: transform 0.3s ease;
            z-index: 5;
        }

        .button-group .all:hover {
            filter: drop-shadow(0px 0px 10px #c02303);
            z-index: 5;
        }

        .button-group .all:active {
            transform: translate(-50%, 0) scale(0.9);
            transform-origin: center center;
            z-index: 5;
        }

/* .button-group .all {
    width: 275px;
    position: absolute;
    left: 50%;
    bottom: 0;
    cursor: pointer;
    transform: translate(-50%, 0);
    transition: transform 0.3s ease;
}

.button-group .all:hover {
    filter: drop-shadow(0px 0px 10px #f5f119);
    /*#1972f5*/


/* .button-group .all:active {
    transform: translate(-50%, 0) scale(0.9);
    transform-origin: center center;
}  */



#cityName {
    z-index: 2;
}

/* 城市统计数据 */
.city-num-label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    border-radius: 100px;
    background-color: rgba(233, 87, 20, 0.8);;
    box-shadow: 0px 0px 4px rgba(237, 230, 25, 0.5);
    border: 2px solid rgba(237, 230, 25, 1);
    /* font-family: 'PingFang SC'; */
    text-align: center;
    cursor: pointer;
    /* opacity: 0.8; */
    transition: all 0.1s linear;
}

.city-num-label:hover {
    margin-top: -60px;
    width: 300px;
    min-height: 140px;
    padding: 16px 16px;
    text-align: left;
    /* opacity: 1.0; */
    border-radius: 4px;
    box-shadow: 0px 0px 12px rgba(237, 230, 25, 0.9);
}

.city-num-label-content {
    display: none;
    font-size: 12px;
    line-height: 24px;
    color: #eeeeee;
}

.city-num-label:hover .city-num-label-content {
    display: block;
}

/* 告警名称 */
.alarm-label {
    min-width: 45px;
    height: 27px;
    line-height: 30px;
    border-radius: 4px;
    background: rgba(10, 26, 52, 0.8);
    border: 1px solid #59AFF9;
    box-shadow: 0px 0px 4px rgba(3, 149, 255, 0.5);
    text-align: center;
    cursor: pointer;
    transition: all 0.1s linear;
    z-index: 3;
}

.alarm-label:hover {
    /* pointer-events: none; 让父元素忽略鼠标事件 */
    margin-top: -60px;
    width: 550px;
    min-height: 270px;
    padding: 0px 0px;
    text-align: left;
    /* opacity: 1.0; */
    box-shadow: 0px 0px 12px rgba(3, 149, 255, 0.9);
    /* z-index: 999; */
}

.alarm-label-icon {
    margin-right: 4px;
    font-size: 18px;
}

.alarm-label-text {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
}

.alarm-label-content {
    display: none;
    font-size: 14px;
    line-height: 24px;
    left: 0%;
    width: 275px;
    color: #eeeeee;
}

.alarm-label-button1 {
    /* display: none; */
    visibility: hidden;
    position: absolute;
    top: 8%;
    right: 40%;
    cursor: pointer;
}

.alarm-label-button1:hover {
    background-color: #2C4FDC;
}

.alarm-label-button2 {
    display: none;
    position: absolute;
    top: 8%;
    right: 28%;
    cursor: pointer;
}

.alarm-label-img {
    position: absolute;
    display: none;
    left: 50%;
    top: 5%;
    bottom: 5%;
    width: 49%;
    height: 240px;
    border-radius: 5px;
}

.alarm-label:hover .alarm-label-content {
    display: block;
}

.alarm-label:hover .alarm-label-img {
    display: block;
}

.alarm-label:hover .alarm-label-button1 {
    /* display: block; */
    visibility: visible;
    z-index: 4;
}

.alarm-label:hover .alarm-label-button2 {
    display: block;
    z-index: 4;
}
.groupfour-label
{
    min-width: 45px;
    height: 27px;
    line-height: 30px;
    border-radius: 4px;
    background: rgba(10, 26, 52, 0.8);
    border: 1px solid #59AFF9;
    box-shadow: 0px 0px 4px rgba(3, 149, 255, 0.5);
    text-align: center;
    cursor: pointer;
    transition: all 0.1s linear;
    z-index: 3;
}
.groupfour-label:hover{
    /* pointer-events: none; 让父元素忽略鼠标事件 */
    margin-top: -30px;
    width: 300px;
    min-height: 100px;
    padding: 0px 0px;
    text-align: left;
    /* opacity: 1.0; */
    box-shadow: 0px 0px 12px rgba(3, 149, 255, 0.9);
    /* z-index: 999; */
}
.groupfour-label-icon{
    margin-right: 4px;
    font-size: 18px;
}
.groupfour-label-text {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
}
.groupfour-label-content {
    display: none;
    font-size: 14px;
    line-height: 24px;
    left: 0%;
    width: 275px;
    color: #eeeeee;
}
.groupfour-label:hover .groupfour-label-content {
    display: block;
}
</style>