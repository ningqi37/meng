<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import SwiperCore, { Thumbs,EffectCoverflow,EffectFlip,Autoplay,Pagination, Navigation } from 'swiper';
SwiperCore.use([Thumbs,EffectCoverflow,EffectFlip,Autoplay,Pagination, Navigation]);
</script>

<template>
    <div class="custom-swiper">
        <Swiper
        :effect="'coverflow'"
        :slides-per-view="4"
        :space-between="30"
        :centeredSlides="true"
        :grab-cursor="true"
        :initialSlide="2"
        :coverflowEffect="{
            rotate: 25,
            stretch: 10,
            depth: 0,
            modifier: 1,
            slideShadows: false,
        }" 
        :slideShadows="{
            shadowOffset: 30, 
            shadowScale: 1, 
        }"  
        :autoplay="{
            delay: 2000,
            pauseOnMouseEnter:true,
            disableOnInteraction: false,
        }"
        :rewind="true"
        :pagination="false"
        :navigation="true"
        :modules="modules"
        class="mySwiper"
        ref="mySwiper"
        >
            <!-- <SwiperSlide v-for="(item, index) in CardList" :key="index">
                <img width=100% src="../../assets/image/travel_img/中共中央北京香山革命纪念地.jpg"/>
                <p style="font-size: 16px">{{ item.title }}</p>
            </SwiperSlide> -->
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/中共中央北京香山革命纪念地.jpg"/>
                <p style="font-size: 16px">中共中央北京香山革命纪念地</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/中华人民抗日战争纪念馆.jpg"/>
                <p style="font-size: 16px">中华人民抗日战争纪念馆</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/中国工农红军.png"/>
                <p style="font-size: 16px">中国工农红军纪念馆</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/井冈山.png"/>
                <p style="font-size: 16px">井冈山革命根据地</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/古田.png"/>
                <p style="font-size: 16px">古田旅游区</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/红旗渠风景区.png"/>
                <p style="font-size: 16px">红旗渠风景区</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/邓小平故里.jpg"/>
                <p style="font-size: 16px">邓小平故里</p>
            </SwiperSlide>
            <SwiperSlide>
                <img width=100% src="../../assets/image/travel_img/长汀红色旧址.png"/>
                <p style="font-size: 16px">长汀红色旧址</p>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<style scoped>
.custom-swiper {
  margin-left:5%;
  margin-right:5%;
  height: 300px; 
}
.swiper {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  --swiper-navigation-color:#F5F5F5
}

.swiper-slide {
  /* text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center; */
    width: 300px;
    background: #fff;
    box-shadow: 0 8px 20px #ddd;
    border-radius: 10px;
}
.swiper-slide p {
	line-height: 60px;
	padding-top: 0;
	text-align: center;
	color: #636363;
	font-size: 0.9em;
	margin: 0;
}
.swiper-slide img {
    top:0;
    display: block;
    width: 100%;
    height:240px;
}
</style>