import { createRouter, createWebHistory } from 'vue-router'

//导入组件
//主界面
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import HomeVue from '@/views/Home.vue'
import TestVue from '@/views/Test.vue'
import SkyBoxVue from '@/views/SkyBox.vue'
import HistoryVue from '@/views/History.vue'
import TravelVue from '@/views/Travel.vue'
import Navigate from '@/views/map/Navigate.vue'
import ZhangZiZhongMuseumVue from '@/views/scenicSpot/ZhangZiZhongMuseum.vue'
import IndexVue from '@/views/Index.vue'

//home下子组件
import HubeiMap from '@/views/map/HubeiMap.vue'

//Layout下子组件
import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import UserCommentVue from '@/views/user/UserComment.vue'




//定义路由关系
const routes = [
    { path: '/',component: IndexVue,  },
    { path: '/test', component: TestVue },
    { path: '/skybox', component: SkyBoxVue },
    { path: '/login', component: LoginVue },
    { path: '/history', component: HistoryVue },
    { path: '/travel', component: TravelVue },
    { path: '/navigate', component: Navigate },
    { path: '/scenicSpot/zhangZiZhongMuseum', component: ZhangZiZhongMuseumVue },
    {
        path: '/home', component: HomeVue, redirect: '/map/hubei', children: [
            { path: '/map/hubei', component: HubeiMap }
        ]
    },
    {
        path: '/user', component: LayoutVue, children: [
            { path: '/article/category', component: ArticleCategoryVue },
            // { path: '/article/manage', component: ArticleManageVue },
            { path: '/user/comment', component: UserCommentVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue }
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router
