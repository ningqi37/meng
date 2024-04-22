<script lang="ts" setup>
import { ref } from 'vue'
import RedSwiperVue from '../components/RedSwiper/RedSwiper.vue';
const activeIndex = ref('1')
const activeIndex2 = ref('1')

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>
<template>

    <el-backtop :right="100" :bottom="100" />
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router="true"
        collapse-transition="false" @select="handleSelect">
        <el-menu-item index="history">
            <h3>红色历史</h3>
        </el-menu-item>
        <el-menu-item index="travel">
            <h3>红色征程</h3>
        </el-menu-item>

        <el-sub-menu :popper-offset="0">
            <template #title>
                <h3>数据展示</h3>
            </template>
            <div style="max-height: 200px; overflow-y: auto;">
                    <el-menu-item style="height: 50px;" index="map/hubei">
                        <h4>湖北省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>北京市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>天津市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>河北省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>山西省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>内蒙古自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>辽宁省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>吉林省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>黑龙江省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>上海市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>江苏省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>浙江省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>安徽省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>福建省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>江西省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>山东省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>河南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>湖南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>广东省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>广西壮族自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>海南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>重庆市</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>四川省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>贵州省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>云南省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>西藏自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>陕西省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>甘肃省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>青海省</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>宁夏回族自治区</h4>
                    </el-menu-item>
                    <el-menu-item style="height: 50px;" index="test">
                        <h4>新疆维吾尔自治区</h4>
                    </el-menu-item>
            </div>

        </el-sub-menu>

        <el-menu-item index="article/category">
            <h3>个人中心</h3>
        </el-menu-item>
    </el-menu>
    <br>
    <br>

    <div class="background">
        <RedSwiperVue></RedSwiperVue>
        <div class="w">
            <div class="home2">
                <div class="home2-header">党的重要会议</div>
                <br><br><br>
                <div class="home2-content">
                    <ul class="home2-items">
                        <li class="home2-content-item1 item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">1921年7月23日</div>
                                <p class="txt-p">
                                    一大召开标志着中国共产党的正式成立，犹如一轮红日在东方冉冉升起，照亮了中国革命的前程。这是近代中国社会进步和革命发展的客观要求，是开天辟地的大事变。</p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%B8%80%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E4%B8%AD%E5%85%B1%E4%B8%80%E5%A4%A7&fromid=3583034&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/一大.jpg"></a>
                                <!-- <img src="./images/198601gj.jpg"> -->
                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%BA%8C%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A/1009592?fromtitle=%E4%B8%AD%E5%85%B1%E4%BA%8C%E5%A4%A7&fromid=3583086&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/二大.jpg"></a>
                                <!-- <img src="./images/张福祥1991.11中国玻璃协会讲话.jpg"> -->
                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">1922年7月</div>
                                <p class="txt-p">
                                    中共二大，党的二大的主要功绩是，在中国近代史上第一次明确地提出了反帝反封建的民主革命纲领，指明了中国人民革命斗争的方向，表明了共产党已经接受了列宁关于殖民地革命的理论，并将这一理论与中国的革命实际初步结合起来。
                                </p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">1923年6月</div>
                                <p class="txt-p">
                                    中共三大，党的三大之后，在中国共产党的推动下，孙中山先生对国民党进行了改组，确定了联俄、联共、扶助农工的三大政策，召开了国共合作的国民党第一次全国代表大会，第一次国共合作正式建立。
                                </p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%B8%89%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E4%B8%AD%E5%85%B1%E4%B8%89%E5%A4%A7&fromid=3583611&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/三大.jpg" alt=""></a>
                                <!-- <img src="./images/1993年.jpg"> -->
                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a href="https://baike.baidu.com/item/%E5%85%AB%E4%B8%83%E4%BC%9A%E8%AE%AE/63931">
                                    <img src="../assets/img_meeting/八七.jpg"></a>
                                <!-- <img src="./images/199410tw.jpg"> -->
                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">1927年7月</div>
                                <p class="txt-p">八七会议，会议批判和纠正了陈独秀右倾机会主义错误，撤销了他在党内的职务，选出了新的临时中央政治局，确定了土地革命和武装斗争的总方针。</p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">1935年1月</div>
                                <p class="txt-p">遵义会议是在红军第五次反“围剿”失败和长征初期严重受挫的情况下，为了纠正博古、王明、李德等人“左”倾领导在军事指挥上的错误而召开的。</p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a href="zunyi.html">
                                    <img src="../assets/img_meeting/遵义.jpg" alt=""></a>
                                <!-- <img src="./images/200206gy.jpg"> -->
                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="https://baike.baidu.com/item/%E6%B4%9B%E5%B7%9D%E4%BC%9A%E8%AE%AE?fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/洛川.jpg"></a>
                                <!-- <img src="./images/201205泰山玻纤董事长、总经理唐志尧做了题为《同心同德，谋划新发展；凝心聚力，实现新跨越》的讲话.jpg"> -->
                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">1937年8月</div>
                                <p class="txt-p">洛川会议，讨论制定动员全国军民开展民族解放战争，实行全面持久抗战的方针，进一步确定在抗日战争时期的任务及各项政策。</p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">1938年9-11月</div>
                                <p class="txt-p">
                                    六届六中全会，是为了总结抗战以来的斗争经验，纠正王明在抗日战争前期的右倾投降主义的错误，明确党在民族战争中的地位，以争取抗日战争的胜利而召开的会议。</p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%85%AD%E5%B1%8A%E4%B8%AD%E5%A4%AE%E5%A7%94%E5%91%98%E4%BC%9A%E7%AC%AC%E5%85%AD%E6%AC%A1%E5%85%A8%E4%BD%93%E4%BC%9A%E8%AE%AE?fromtitle=%E5%85%AD%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A&fromid=4807002&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/六届六中.jpg"></a>
                                <!-- <img src="./images/201212jc.jpg"> -->
                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%B8%83%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E4%B8%AD%E5%85%B1%E4%B8%83%E5%A4%A7&fromid=3583873&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/七大.jpg"></a>
                                <!-- <img src="./images/201311gjzj.jpg"> -->
                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">1945年4-6月</div>
                                <p class="txt-p">
                                    中共七大，是党在民主主义革命时期极其重要的一次代表大会。它总结了中国新民主主义革命20多年曲折发展的历史经验，制定了正确的路线、纲领和策略，克服了党内的错误思想。
                                </p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">1949年3月</div>
                                <p class="txt-p">
                                    七届二中全会，是解放战争时期中共召开的唯一的一次中央全会，会议作出的各项政策规定，不仅对迎接中国革命在全国的胜利，而且对新中国的建设事业，都具有重要指导作用。</p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%B8%83%E5%B1%8A%E4%B8%AD%E5%A4%AE%E5%A7%94%E5%91%98%E4%BC%9A%E7%AC%AC%E4%BA%8C%E6%AC%A1%E5%85%A8%E4%BD%93%E4%BC%9A%E8%AE%AE?fromtitle=%E4%B8%83%E5%B1%8A%E4%BA%8C%E4%B8%AD%E5%85%A8%E4%BC%9A&fromid=4416718&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/七届二中.jpg"></a>
                                <!-- <img src="./images/201410hybzdz.jpg"> -->
                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%85%AB%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E4%B8%AD%E5%85%B1%E5%85%AB%E5%A4%A7&fromid=3583961&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/八大.jpg"></a>
                                <!-- <img src="./images/202203zgtt.jpg"> -->
                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">1956年9月</div>
                                <p class="txt-p">中共八大对中国自己的建设社会主义道路的探索，取得了初步成果，历史证明这些成果对于党的事业的发展有长远的重要意义。</p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">1977年8月</div>
                                <p class="txt-p">
                                    十一届全国代表大会，由于当时历史条件的限制，大会不仅没有纠正“文化大革命”的错误理论和方针政策，反而加以肯定，因而没有从根本上着手纠正“文化大革命”的错误，党的十一大未能完成从理论和党的指导方针上拨乱反正的任务。
                                </p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%8D%81%E4%B8%80%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/十一届三中.jpg"></a>
                                <!-- <img src="./images/202211中国巨石第二十七、二十八届国际玻纤年会.jpg"> -->
                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="http://theory.people.com.cn/n/2014/0603/c385524-25097531.html#:~:text=%E4%BA%8C%E3%80%81%E5%8D%81%E4%B8%80%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E9%80%9A%E8%BF%87%E3%80%8A%E5%85%B3%E4%BA%8E%E5%BB%BA%E5%9B%BD%E4%BB%A5%E6%9D%A5%E5%85%9A%E7%9A%84%E8%8B%A5%E5%B9%B2%E5%8E%86%E5%8F%B2%E9%97%AE%E9%A2%98%E7%9A%84%E5%86%B3%E8%AE%AE%E3%80%8B.%20%E7%BB%8F%E8%BF%87%E5%85%85%E5%88%86%E9%85%9D%E9%85%BF%EF%BC%8C1981%E5%B9%B46%E6%9C%8827%E6%97%A5%E8%87%B329%E6%97%A5%EF%BC%8C%E4%B8%AD%E5%85%B1%E5%8D%81%E4%B8%80%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E5%9C%A8%E5%8C%97%E4%BA%AC%E4%B8%BE%E8%A1%8C%E3%80%82.,%E8%BF%99%E6%AC%A1%E5%85%A8%E4%BC%9A%E5%85%B7%E6%9C%89%E9%87%8D%E5%A4%A7%E6%84%8F%E4%B9%89%EF%BC%8C%E5%AE%8C%E6%88%90%E4%BA%86%E4%B8%A4%E9%A1%B9%E8%AE%AE%E7%A8%8B%EF%BC%9A%E5%AE%A1%E8%AE%AE%E5%92%8C%E9%80%9A%E8%BF%87%E3%80%8A%E5%85%B3%E4%BA%8E%E5%BB%BA%E5%9B%BD%E4%BB%A5%E6%9D%A5%E5%85%9A%E7%9A%84%E8%8B%A5%E5%B9%B2%E5%8E%86%E5%8F%B2%E9%97%AE%E9%A2%98%E7%9A%84%E5%86%B3%E8%AE%AE%E3%80%8B%EF%BC%9B%E6%94%B9%E9%80%89%E5%92%8C%E5%A2%9E%E9%80%89%E4%B8%AD%E5%A4%AE%E4%B8%BB%E8%A6%81%E9%A2%86%E5%AF%BC%E6%88%90%E5%91%98%E3%80%82.%20%E3%80%8A%E5%85%B3%E4%BA%8E%E5%BB%BA%E5%9B%BD%E4%BB%A5%E6%9D%A5%E5%85%9A%E7%9A%84%E8%8B%A5%E5%B9%B2%E5%8E%86%E5%8F%B2%E9%97%AE%E9%A2%98%E7%9A%84%E5%86%B3%E8%AE%AE%E3%80%8B%E7%BA%A63.4%E4%B8%87%E5%AD%97%EF%BC%8C%E5%AF%B9%E5%BB%BA%E5%9B%BD32%E5%B9%B4%E6%9D%A5%E5%85%9A%E7%9A%84%E9%87%8D%E5%A4%A7%E5%8E%86%E5%8F%B2%E4%BA%8B%E4%BB%B6%E7%89%B9%E5%88%AB%E6%98%AF%E2%80%9C%E6%96%87%E5%8C%96%E5%A4%A7%E9%9D%A9%E5%91%BD%E2%80%9D%E4%BD%9C%E4%BA%86%E6%AD%A3%E7%A1%AE%E6%80%BB%E7%BB%93%EF%BC%8C%E7%A7%91%E5%AD%A6%E5%88%86%E6%9E%90%E4%BA%86%E5%9C%A8%E8%BF%99%E4%BA%9B%E4%BA%8B%E4%BB%B6%E4%B8%AD%E5%85%9A%E7%9A%84%E6%8C%87%E5%AF%BC%E6%80%9D%E6%83%B3%E7%9A%84%E6%AD%A3%E7%A1%AE%E5%92%8C%E9%94%99%E8%AF%AF%EF%BC%8C%E5%88%86%E6%9E%90%E4%BA%86%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E7%9A%84%E4%B8%BB%E8%A7%82%E5%9B%A0%E7%B4%A0%E5%92%8C%E7%A4%BE%E4%BC%9A%E5%8E%9F%E5%9B%A0%EF%BC%8C%E5%AE%9E%E4%BA%8B%E6%B1%82%E6%98%AF%E5%9C%B0%E8%AF%84%E4%BB%B7%E4%BA%86%E6%AF%9B%E6%B3%BD%E4%B8%9C%E5%9C%A8%E4%B8%AD%E5%9B%BD%E9%9D%A9%E5%91%BD%E4%B8%AD%E7%9A%84%E5%8E%86%E5%8F%B2%E5%9C%B0%E4%BD%8D%EF%BC%8C%E5%85%85%E5%88%86%E8%AE%BA%E8%BF%B0%E4%BA%86%E6%AF%9B%E6%B3%BD%E4%B8%9C%E6%80%9D%E6%83%B3%E4%BD%9C%E4%B8%BA%E5%85%9A%E7%9A%84%E6%8C%87%E5%AF%BC%E6%80%9D%E6%83%B3%E7%9A%84%E4%BC%9F%E5%A4%A7%E6%84%8F%E4%B9%89%EF%BC%8C%E8%82%AF%E5%AE%9A%E4%BA%86%E4%B8%89%E4%B8%AD%E5%85%A8%E4%BC%9A%E4%BB%A5%E6%9D%A5%E9%80%90%E6%AD%A5%E7%A1%AE%E7%AB%8B%E7%9A%84%E9%80%82%E5%90%88%E5%9B%BD%E6%83%85%E7%9A%84%E5%BB%BA%E8%AE%BE%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E7%8E%B0%E4%BB%A3%E5%8C%96%E5%BC%BA%E5%9B%BD%E7%9A%84%E6%AD%A3%E7%A1%AE%E9%81%93%E8%B7%AF%EF%BC%8C%E8%BF%9B%E4%B8%80%E6%AD%A5%E6%8C%87%E6%98%8E%E4%BA%86%E6%88%91%E5%9B%BD%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E4%BA%8B%E4%B8%9A%E5%92%8C%E5%85%9A%E7%9A%84%E5%B7%A5%E4%BD%9C%E7%BB%A7%E7%BB%AD%E5%89%8D%E8%BF%9B%E7%9A%84%E6%96%B9%E5%90%91%E3%80%82.">
                                    <img src="../assets/img_meeting/十一届六中.jpg"></a>
                                <!-- <img src="./images/202304中原公司党委书记、经理冯利军会见泰山玻璃纤维有限公司部长胡文庆、主任刘晓华，双方就相关项目合作进行深入洽谈，并达成共识.jpg"> -->
                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">1981年6月</div>
                                <p class="txt-p">十一届六中全会，这次全会具有重大意义，完成了两项议程：审议和通过《关于建国以来党的若干历史问题的决议》；改选和增选中央主要领导成员。</p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <div class="left-txt">
                                <div class="txt-time">1992年10月</div>
                                <p class="txt-p">
                                    中共十四大，在中国改革开放和现代化建设的关键时刻，邓小平视察南方并发表重要讲话，高屋建瓴地阐述了关系党和国家前途命运的一系列重大问题，为建设有中国特色的社会主义指明了继续前进的方向。
                                </p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%8D%81%E5%9B%9B%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E5%8D%81%E5%9B%9B%E5%A4%A7&fromid=11260395&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/十四大.png   "></a>

                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%8D%81%E4%B8%83%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E5%8D%81%E4%B8%83%E5%A4%A7&fromid=56774287&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/十七大.png"></a>

                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">2007年10月</div>
                                <p class="txt-p">
                                    中共十七大，大会主题是：高举中国特色社会主义伟大旗帜，以邓小平理论和“三个代表”重要思想为指导，深入贯彻落实科学发展观，继续解放思想，坚持改革开放，推动科学发展，促进社会和谐，为夺取全面建设小康社会新胜利而奋斗。
                                </p>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">2012年11月</div>
                                <p class="txt-p">党的十八大是一次高举旗帜、继往开来、团结奋进的大会，对凝聚党心军心民心、推动党和国家事业发展具有十分重大的意义。</p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%8D%81%E5%85%AB%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E4%B8%AD%E5%85%B1%E5%8D%81%E5%85%AB%E5%A4%A7&fromid=62088621&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/十八大.png"></a>

                            </div>

                        </li>
                        <li class="home2-content-item2 item">
                            <div class="left-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E5%8D%81%E4%B9%9D%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A?fromtitle=%E4%B8%AD%E5%85%B1%E5%8D%81%E4%B9%9D%E5%A4%A7&fromid=15480469&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/十九大.png"></a>

                            </div>
                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <div class="right-txt">
                                <div class="txt-time">2017年10月</div>
                                <p class="txt-p">
                                    党的十九大，是中国特色社会主义发展关键时期召开的一次十分重要的大会。承担着谋划决胜全面建成小康社会、深入推进社会主义现代化建设的重大任务，事关党和国家事业继往开来，事关中国特色社会主义前途命运，事关最广大人民根本利益。
                                </p>
                                <br>
                            </div>
                        </li>
                        <li class="home2-content-item1 item">

                            <!-- <a class="item-link" href="#"> -->
                            <div class="left-txt">
                                <div class="txt-time">2022年10月</div>
                                <p class="txt-p">
                                    中国共产党第二十次全国代表大会是在全党全国各族人民迈上全面建设社会主义现代化国家新征程、向第二个百年奋斗目标进军的关键时刻召开的一次十分重要的大会。
                                </p>
                            </div>

                            <div class="mid-column">
                                <div class="time-circle-wrap">
                                    <img src="../assets/image/column-time-circle.png" alt="">
                                </div>
                                <div class="time-line-wrap"></div>
                            </div>
                            <!-- </a> -->

                            <div class="right-img">
                                <a
                                    href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%BA%8C%E5%8D%81%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A/59177990?fromtitle=%E4%B8%AD%E5%85%B1%E4%BA%8C%E5%8D%81%E5%A4%A7&fromid=60832369&fromModule=lemma_search-box">
                                    <img src="../assets/img_meeting/二十大.jpg"></a>

                            </div>
                        </li>
                        <li class="home2-content-item2 item">
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>


</template>



<style scoped>
.background {
    padding: 0;
    margin: 0;
    height: 4000px;
    background: url("../assets/image/history_background.png") no-repeat center center fixed;
    background-size: cover;
    /* 调整图片尺寸以覆盖整个屏幕 */
    opacity: 1;
}


.el-menu {

    width: 100%;
    /* justify-content: center; */
    margin-right: 0;
    align-items: center;
    height: 11vh;
    background: url("../assets/image/history_header.png");
    background-size: 100% 100%;

    .el-menu-item {
        width: 10vw;
        height: 11vh;
        left: 59vw;

        h3 {
            z-index: 1;
            width: 195px;
            height: 100px;
            line-height: 100px;
            color: #be8686;
            text-align: center;
            font-size: 19px;
            /* transition: 0.36s; */
        }
    }

    .el-sub-menu {
        width: 10vw;
        height: 11vh;
        left: 59vw;
        position: relative;

        h3 {
            z-index: 1;
            width: 195px;
            height: 100px;
            line-height: 100px;
            color: #be8686;
            text-align: center;
            font-size: 19px;
            /* transition: 0.36s; */
        }

    }
}




.w {
    width: 1400px;
    margin: 0 auto;
    padding: 30px 0;

}

.home2-header {
    position: absolute;
    left: 50%;
    color: #a92222;
    transform: translateX(-50%);
    font-size: 30px;
    font-weight: 700;
}

.home2-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    /* border: 1px solid green; */
    width: 80%;
    font-weight: 500;


}

.home2-content .home2-items {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.home2-content-item1,
.home2-content-item2 {
    display: flex;
    justify-content: space-between;
    height: 200px;
    width: 100%;
}


/* .home2-content-item1 .item-link,
.home2-content-item2 .item-link {
    position: relative;
    display: flex;
    height: 200px;
    width: 55%;
    display: block;
    border: 2px solid pink;
} */

.left-txt,
.right-txt {
    position: relative;
    width: 45%;
}


.left-txt .txt-time,
.right-txt .txt-time {
    position: absolute;
    right: 0;
    top: 10%;
    font-size: 20px;
    color: rgb(136, 7, 7);
}

.left-txt .txt-time {
    right: 0;
}

.right-txt .txt-time {
    left: 0;
}


.left-txt .txt-p,
.right-txt .txt-p {
    position: absolute;
    top: 30%;
    font-size: 18px;
    color: #9a1919e6;
    text-indent: 2em;
}

.left-txt .txt-p {
    right: 0;
}

.right-txt .txt-p {
    left: 0;

}

.mid-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* position: relative; */
    width: 10%;
    /* border: 1px solid red; */
}

.home2-content-item1 .item-link .mid-column {
    position: absolute;
    right: 0;
}


.mid-column .time-line-wrap {
    display: table-cell;
    width: 1px;
    background: #e4e0e0;
    height: 1000px;
    /* top: 0; */
    /* left: 50%; */
    margin-left: -0.5px;
    display: inline-block;
    /* border: 2px solid blue; */
}

.mid-column .time-circle-wrap {
    height: 22px;
}

.left-img,
.right-img {
    position: relative;
    width: 45%;
}

.left-img img,
.right-img img {
    /* width: 80%; */
    height: 100%;
    /* height: 200px; */
}

.left-img img {
    position: absolute;
    right: 0;
}
</style>