<template>
    <!-- <button @click="isShow = true">展示弹窗</button> -->
    <Teleport to="body">
        <div class="modal" v-show="isShow">
            <button class="close-button" @click="isShow = false">&times;</button>
            <h2 class="name">{{ name }}</h2>
            <h3 class="title">{{ sign }}</h3>
            <img :src="photo" class="image">
            <el-button style="position: absolute;top: 6vh;right: 10vw;" type="primary"
                @click="showSkyBox()">全景</el-button>
            <el-button style="position: absolute;top: 6vh;right: 5.5vw;" type="primary"
                @click="showmore()">详情</el-button>
            <el-button style="position: absolute;top: 6vh;right: 1vw;" type="primary"
                @click="favor(index + 1, userInfoStore.info.id)">收藏</el-button>
            <!-- <button style="position: absolute;top: 55px;right: 15px;" :@click="favor(index, userInfoStore.info.id)">favor</button> -->
            <p class="content">{{ content }}</p>
        </div>
    </Teleport>
</template>

<script setup name="Modal">
import { ref } from 'vue'
import emitter from '@/utils/emitter'
let isShow = ref(false)
let name = ref()
let sign = ref()
let photo = ref()
let content = ref()
let index = ref()
let viewList = [
    {
        name: '江岸区八七会议会址纪念馆',
        sign: '“第二批全国重点文物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b9876cc1-2710-43bd-a19e-7907b20b52b4.jpeg',
        content: '民国十六年（1927年）8月7日，中共中央在汉口召开紧急会议，史称“八七会议”。 八七会议会址是记录这一历史事件的重要载体，见证了中国共产党历史上第一次伟大的转折，在进行党史教育、爱国主义教育和革命传统教育中扮演着重要的角色。',
        position: [114.299762, 30.586469],
    }, {
        name: '武昌区毛泽东旧居',
        sign: '“湖北省武汉市武昌区辖内纪念馆”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b049984f-d554-4007-8343-838299e787ab.jpeg',
        content: '毛泽东旧居是1926年12月至1927年8月毛泽东在武汉从事革命活动时的住所。被列为湖北省文物保护单位。旧居是晚清民居式建筑，坐东朝西，青砖灰瓦，三进三天井。1967年经省、市委批准在原址按原貌重建，同时复原了毛泽东的卧室、蔡和森、罗哲等人先后住住过的房间以及前客厅等。',
        position: [114.299294, 30.551012],
    }, {
        name: '中央农民运动讲习所旧址纪念馆',
        sign: '“中央级革命训练机构”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/3a32dacc-bb99-4f94-b45e-6e7a7f43e07f.jpg',
        content: '中央农民运动讲习所旧址纪念馆，是一座重要的红色教育基地，位于湖北省武汉市江汉区江汉路139号，这里保存了大量珍贵的革命历史文物和实物，其中包括了毛泽东和其他中央领导同志的照片、手稿、日用品等，以及革命时期的文艺作品、出版物和宣传品等。',
        position: [114.300363, 30.554125],
    }, {
        name: '麻城市乘马会馆',
        sign: '“爱国主义教育示范基地”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/23410172-1f08-43bf-85ab-df1e2f3bee63.jpg',
        content: '乘马会馆位于湖北省麻城市乘马岗镇乘马岗村，是黄麻起义的策源地之一，中共乘马第一个党支部于1926年9月9日在这里成立，乘马区农民协会及农民自卫军长期在此开展工作。在乘马岗镇还留存有当年红军与敌人激战过的杨四寨、得胜寨等遗址。',
        position: [114.951049, 31.428866],
    }, {
        name: '麻城烈士陵园',
        sign: '“全国重点烈士纪念建筑物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/e3f443ed-f925-4901-a624-bc9befd834f3.webp',
        content: '麻城烈士陵园位于湖北省麻城市城区陵园路75号，为纪念黄麻起义和缅怀鄂豫皖苏区革命先烈的英雄事迹，于1979年建成，占地面积114600平方米。里面矗立着一座黄麻起义和鄂豫皖苏区革命烈士纪念碑，上面镌刻着华国锋、叶剑英等党和国家领导人的题字及题词。',
        position: [115.018845, 31.180759],
    }, {
        name: '黄麻起义和鄂豫皖苏区革命烈士陵园',
        sign: '“爱国主义教育示范基地”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/96f6dd7a-d353-49f8-8325-2d28ee3fe174.webp',
        content: '黄麻起义和鄂豫皖苏区革命烈士陵园位于湖北省红安县城关镇陵园大道1号，占地面积约23.8万平方米，是为纪念在黄麻起义和鄂豫皖苏区斗争中牺牲的烈士而修建的设施。 下辖：董必武纪念馆、李先念纪念馆、黄麻起义和鄂豫皖苏区革命历史纪念馆、黄麻起义和鄂豫皖苏区革命烈士纪念馆。',
        position: [114.62625, 31.292766],
    }, {
        name: '英山县英山烈士陵园',
        sign: '“湖北省十大红色旅游景区”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/788f8ff3-292f-4195-916d-591198c6577c.jpg',
        content: '英山烈士陵园位于县城陵园大道。1956年兴建，占地80亩，现主要建筑有富有民族特色的七层双六棱烈士纪念塔、革命烈士纪念馆、陈列馆、人民英雄纪念碑、抗日阵亡将士纪念碑、烈士墓群等。馆内收藏有朱德、周恩来、董必武、徐向前等党和国家领导人的亲笔题词。',
        position: [115.67411, 30.735743],
    }, {
        name: '罗田县胜利烈士陵园',
        sign: '“全国一百个红色旅游精品景区”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d11f497e-79d3-4a11-b95e-5bd65f4a0ccc.webp',
        content: '胜利镇烈士陵园分为东、西二区，东区为陵园区，创建于1986年，占地2万平方米，位于胜利镇中部的磨儿石山，内存有1988年建成的烈士纪念碑一座，碑高12米，上刻有王任重题写的"革命烈士永垂不朽"的题词；有1995年革命烈士遗孤李逸心先生捐建的揽胜亭和革命烈士展览馆。',
        position: [115.464468, 31.12439],
    }, {
        name: '刘邓大军挺进大别山指挥部旧址',
        sign: '“中小学研学旅行实践基地”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/63d24b63-d680-45eb-853d-65e367218d81.jpeg',
        content: '一九四七年的七月份，刘邓大军率领晋冀鲁豫野战军渡过黄河向大别山挺进的途中，发起了一次对国民党军队的大规模歼灭战----鲁西南战役，由此揭开了我军由战略防御向战略进攻的序幕。当时，刘邓首长就住在此处，并指挥了著名的“六营歼灭战”和“羊山战役”。',
        position: [114.984563, 30.88738],
    }, {
        name: '黄冈革命烈士陵园',
        sign: '“爱国主义教育示范基地”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/37b9ab53-24a5-44e4-a72f-319b06be627f.webp',
        content: '陵园始建于1975年，占地面积33万平方米，雄伟庄严的革命烈士纪念碑，正面箔金镌刻的是原国家主席李先念的题词：“革命烈士永垂不朽！”；碑的背面是原国务院副总理、全国政协副主席方毅的题词：“为建立鄂东革命根据地而英勇牺牲的烈士们名垂千古！”',
        position: [115.051919, 30.794868],
    }, {
        name: '湘鄂西革命根据地旧址',
        sign: '“全国重点文物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/c02b4c19-b034-487d-955c-e39c6b460da0.jpg',
        content: '主要有红二军团总指挥部、红二军军部、红六军军部、中共湘鄂西中央分局、中央湘鄂西省委员会、湘鄂西省苏维埃政府和湘鄂西省革命军事委员会等旧址。中央湘鄂西省委员会旧址和湘鄂西省苏维埃政府旧址毗邻，均为三进院落砖木结构建筑，占地面积 220平方米。近年修建了周老嘴革命烈士陵园。',
        position: [112.985383, 30.03121],
    }, {
        name: '鄂西苏区湘革命烈士陵园',
        sign: '“全国重点烈士纪念建筑物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b52c54e0-d149-4663-9f77-f082770c77f2.webp',
        content: '湘鄂西苏区革命烈士纪念碑碑座上，铭刻着国务院撰写的碑文。纪念碑正前方，是贺龙全身铜像。纪念碑以西有烈士祠，共展出116位烈士的遗像、遗物和生平简介。陈列馆内，展示着土地革命战争时期湘鄂西苏区史实，悬挂着湘鄂西革命根据地创始人贺龙、周逸群等的巨幅画像。',
        position: [113.454425, 29.793559],
    }, {
        name: '新四军五师旧址',
        sign: '“社会科学类历史遗址专题纪念馆”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/69c43a3d-e26f-4bc3-a86d-ecedefe68ae4.jpeg',
        content: '新四军第五师纪念馆，位于湖北省孝感市大悟县芳畈镇白果树湾，占地面积近8000平方米，隶属于大悟县文化体育局。1977年，正式成立四军第五师旧址保护机构。 截至2019年末，大悟县新四军第五师纪念馆藏品有34件套，其中珍贵文物4件/套，举办展览2个，开展教育活动576次。',
        position: [113.742359, 32.069682],
    }, {
        name: '武昌区辛亥革命武昌起义纪念馆',
        sign: '“全国重点文物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/0c544647-5cc9-4a56-8295-38842d49eaca.jpeg',
        content: '辛亥革命武昌起义纪念馆，是依托中华民国军政府鄂军都督府旧址而建立的纪念性博物馆，位于湖北省武汉市武昌区武珞路，占地面积20000多平方米。该馆是收藏辛亥革命时期相关的文物见长的专题性博物馆，已收藏文物数千件，有“辛亥名人字画”、“共和纪念瓷器”、“近代名人家谱”等。',
        position: [114.305641, 30.539066],
    }, {
        name: '中山舰纪念馆',
        sign: '“专题性纪念性博物馆”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/8ff74d4f-e618-435c-9fd1-9357ec57b94b.webp',
        content: '武汉市中山舰博物馆，位于湖北省武汉市江夏区金口街特，是一座专题性纪念性博物馆，以“中山舰”的名字命名，馆藏文物6000余套，主要为随“中山舰”出水文物，从不同角度反映了中山舰各个历史时期的政治、军事、经济、文化等社会活动及中山舰官兵们的精神面貌。',
        position: [114.134269, 30.345277],
    }, {
        name: '北伐战争汀泗桥战役遗址',
        sign: '“第二批省级文物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/21b5dad1-6568-467a-aef7-32b97d8988be.webp',
        content: '北伐汀泗桥战役遗址纪念馆位于湖北省咸宁市咸安区。北伐汀泗桥战役遗址占地面积约20万平方米，重点保护区一个是马家山，另一个是塔垴山。其中马家山占地面积约2万平方米，建有大门楼、烈士纪念亭、纪念碑、墓及陈列室。',
        position: [114.168523, 29.817853],
    }, {
        name: '长江三峡水利枢纽工程',
        sign: '“爱国主义教育示范基地”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d058d5e5-fc9d-4f3b-a5a6-89c00f87f1f7.jpg',
        content: '三峡水电站，即长江三峡水利枢纽工程，又称三峡工程。中国湖北省宜昌市境内的长江西陵峡段与下游的葛洲坝水电站构成梯级电站。三峡水电站是世界上规模最大的水电站，也是中国有史以来建设最大型的工程项目。三峡水电站的功能有十多种，航运、发电、种植等等。',
        position: [111.035707, 30.833629],
    }, {
        name: '宜城市张自忠将军纪念馆',
        sign: '“爱国主义、国防教育基地”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/cdec9937-fa38-4322-991e-5e8f870a86d1.webp',
        content: '宜城市张自忠将军纪念馆建于1991年，张将军殉国50年之际。馆内以张自忠将军生平事迹陈列为主，辅以名人题词碑刻展览，包括张自忠将军殉国处纪念碑、纪念碑广场、阶梯式步行道等纪念设施，每一处都蕴含着对张自忠将军的缅怀和对抗战胜利的纪念。',
        position: [112.255392, 31.708247],
    }, {
        name: '陈潭秋故居',
        sign: '“社会科学类名人专题纪念馆”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/914fcc3f-31ab-44cf-8019-70db446d21ce.jpeg',
        content: '陈潭秋故居纪念馆占地15.6亩，主体大楼3700平方米，呈“回”字形仿古建筑，楼顶由光彩夺目的黄色琉璃瓦覆盖，四脊金龙栩栩如生，其势如蟠雾腾霄；八方角巍峨挺拨，直指苍穹，寓意着革命伟人的丰功业绩。陈潭秋故居纪念馆包含陈潭秋故居纪念馆和铜像广场两部分。',
        position: [115.044026, 30.594645],
    }, {
        name: '新四军第五师九口堰旧址群',
        sign: '“社会科学类历史遗址专题纪念馆”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/55df587e-97b7-4844-a752-79132e9872e2.jpeg',
        content: '新四军第五师纪念馆，位于湖北省孝感市大悟县芳畈镇白果树湾，占地面积近8000平方米，隶属于大悟县文化体育局。1977年，正式成立四军第五师旧址保护机构。 截至2019年末，大悟县新四军第五师纪念馆藏品有34件套，其中珍贵文物4件/套，举办展览2个，开展教育活动576次。',
        position: [113.384316, 31.460218],
    }, {
        name: '咸丰忠堡大捷遗址及烈士陵园',
        sign: '“建党百年红色旅游景点”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/b26324d9-fb54-4679-ae51-49247b7b5af5.png',
        content: '忠堡大捷纪念园位于湖北省咸丰县忠堡镇高笋塘村,即当年红二、六军团取得史称“忠堡大捷”战场遗址处。为了缅怀先烈，弘扬革命精神，人民政府先后在忠堡大捷战场遗址上修建了忠堡大捷纪念碑、咸丰县革命烈士陵园，随后扩建为忠堡大捷纪念园，配套修建了环形路、步行道、广场、停车场等。',
        position: [109.29665, 29.674318],
    }, {
        name: '湘鄂边苏区革命烈士陵园',
        sign: '“国家重点烈士陵园建筑保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d5b32984-8c57-4d08-b67e-ce7bdd2306df.jpeg',
        content: '满山红烈士陵园位于鹤峰县城娄水河畔，因满山红杜鹃花盛开而得名“满山红”，全称为湘鄂边苏区革命烈士陵园，立有高22米的“湘鄂边苏区革命烈士纪念碑”，为纪念第二次国内革命战争中鹤峰苏区牺牲的烈士而建。陵园的主要建筑物包括楼牌、贺龙铜像、烈士祠、纪念碑和主墓群。',
        position: [110.034011, 29.890073],
    }, {
        name: '五里坪革命旧址群',
        sign: '“第六批全国重点文物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/9fb423db-2ae2-4d09-88ab-2bc516908264.jpg',
        content: '五里坪革命旧址，又名五里老街，位于湖北省恩施土家族苗族自治州鹤峰县五里乡五里坪老街中段，第二次国内革命战争时期，成为了湘鄂边苏区中心，也是湘鄂边红四军二次东下与红六军会师、成立红二军团的出发地，是整个湘鄂边地区唯一一处保存完好、建筑规模宏大的革命纪念建筑群。',
        position: [110.346179, 29.893672],
    }, {
        name: '中营红三军军部旧址',
        sign: '“省级革命文物”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/ec2e100d-0865-4b34-9a8e-aa77e754f615.jpg',
        content: '湖北十堰武当山紫霄宫，是武当山九大宫观建筑群的主体，武当山保存最完整的宫殿之一， [1]革命战争时期曾为红三军司令部驻地。父母殿曾是贺龙的卧室和办公室，至今殿内西耳房仍挂着“红三军司令部”的小牌，屋内保存着当年贺龙用过的办公桌椅，茶具、笔筒、木床等。',
        position: [111.028921, 32.424011],
    }, {
        name: '湘鄂赣边区鄂东南革命烈士陵园',
        sign: '“国家级烈士纪念设施保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/d450fb83-e652-4121-8527-d9745ec14631.webp',
        content: '在鄂东南这片土地上，曾有30万革命先烈为了人民解放事业无畏艰险，献出生命,为了纪念这些革命烈士，湘鄂赣边区鄂东南革命烈士陵园兴建而成。烈士陵园占地面积427亩，是鄂东南地区规模最大的革命烈士陵园。',
        position: [115.214298, 29.846651],
    }, {
        name: '红三军团建军旧址',
        sign: '“湖北省第二批不可移动革命文物”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/83e745f6-32fd-48f0-a47a-c4784868ec03.jpg',
        content: '红三军军部旧址位于监利县新沟嘴镇解放街北。1931年10月至1932年9月，中国工农红军第三军军部设此，军长贺龙，政治委员夏曦。旧址建于清代，现存为四合院式布局，面阔四间12.8米，通进深24.2米，硬山顶，穿斗、抬梁混合式砖木结构。',
        position: [114.833973, 29.936998],
    }, {
        name: '鄂州市梁子湖区湘鄂赣军区司令部旧址',
        sign: '“湖北省级文物保护单位”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/a863c42b-c1fb-4de1-be63-8665a071a0a2.webp',
        content: '旧址位于梁子湖区梁子岛南部张家楼房（原称张家炉坊），始建于清代，初为私塾学堂，后为作坊。1945年2月，由王震率领三五九旅主力组成的南下支队与张体学率领的新四军第五师在大悟胜利会师，之后回师樊湖地区开展武装斗争，其间曾在梁子岛居住，部队指挥部也曾设在这里。',
        position: [114.651588, 30.240804],
    }, {
        name: '武汉革命博物馆',
        sign: '“中国第一红街”',
        photo: 'https://red-travel-system.oss-cn-wuhan-lr.aliyuncs.com/817b219d-b63f-438a-9fde-28ac35f2aa72.jpg',
        content: '武汉革命博物馆下辖武昌农民运动讲习所旧址纪念馆、毛泽东旧居纪念馆、中共五大会址纪念馆、陈潭秋烈士纪念馆、武昌起义门管理所、中国共产党纪律建设历史陈列馆。馆内房屋多为晚清式建筑，青砖灰瓦红廊柱，漫步其间，回到那个风起云涌的时代，去见证党的革命故事、光辉历史。',
        position: [114.300394, 30.55369],
    }
]


emitter.on('show', (value) => {
    isShow.value = true
    name.value = viewList[value].name
    sign.value = viewList[value].sign
    photo.value = viewList[value].photo
    // console.log(photo.value)
    index.value = value
    content.value = viewList[value].content
})


import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
import { scenicSpotFavorService, scenicSpotListService } from '@/api/article.js'
import { ElMessage, imageEmits } from 'element-plus'
const favorList = ref([])
import { useRouter } from 'vue-router'
const router = useRouter();
const showmore = () => {
    router.push('/scenicSpot/zhangZiZhongMuseum')
}
const showSkyBox = () => {
    router.push('/skybox')
}
const favor = async (addid, userid) => {
    let result = await scenicSpotListService(userInfoStore.info.id);
    favorList.value = result.data;
    var List = favorList.value
    var temp = 0
    List.forEach(function (element) {
        if (element.id == addid) {
            console.log(element.id)
            ElMessage.error('该景点已收藏')
            temp = 1;
        }
    });
    if (temp == 0) {
        var data = {
            "userid": userid,
            "addid": addid
        }
        await scenicSpotFavorService(data)
        ElMessage.success('收藏成功')
    }


}
</script>

<style scoped>
.modal {
    width: 480px;
    height: 240px;
    background-image: url('@/assets/image/pop1.png');
    background-size: cover;
    /* 背景图片大小适应容器 */
    /* background-color: skyblue; */
    border-radius: 10px;
    padding: 5px;
    box-shadow: 0 0 5px;
    text-align: center;
    position: fixed;
    left: 50%;
    bottom: 17vh;
    margin-left: -240px;
    /* opacity: 10; */
    z-index: 999;
}

.close-button {
    position: absolute;
    top: 5px;
    right: 15px;
    background: none;
    border: none;
    font-size: 36px;
    color: white;
    cursor: pointer;
}

.name {
    position: absolute;
    left: 21%;
    top: -3px;
    color: white;
    font-size: 19px;
    font-weight: 150;
    /* 调整字体粗细 */
}

.title {
    background-image: url('@/assets/image/pop2.png');
    background-size: cover;
    position: absolute;
    left: 5%;
    top: 19%;
    color: white;
    font-size: 14px;
    font-weight: 150;
    padding: 5px;
    /* 添加内边距 */
}

.image {
    width: 200px;
    /* 控制图片宽度 */
    height: 110px;
    /* 控制图片高度 */


    position: absolute;
    bottom: 12%;
    left: 10%;
}

.content {
    position: absolute;
    left: 275px;
    top: 33%;
    right: 15px;
    bottom: 2%;
    color: white;
    font-size: 13px;
    text-align: justify;
    word-wrap: break-word;
    overflow: auto;
    /* 显示滚动条 */
    -ms-overflow-style: none;
    /* 隐藏IE和Edge的滚动条 */
    scrollbar-width: none;
    /* 隐藏Firefox的滚动条 */
}

.content::-webkit-scrollbar {
    display: none;
    /* 隐藏Chrome等Webkit浏览器的滚动条 */
}
</style>