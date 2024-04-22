<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== registerData.value.password) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}

//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//调用后台接口,完成注册
import { userRegisterService, userLoginService } from '@/api/user.js'
const register = async () => {
    //registerData是一个响应式对象,如果要获取值,需要.value
    if (registerData.value.password === registerData.value.rePassword) {
        let result = await userRegisterService(registerData.value);
        if (result.msg === 'success') {
            ElMessage.success('注册成功')
        }
    }
    else{
        ElMessage.error('两次输入的密码不一致')
        console.log('两次输入的密码不一致')
    }
}

//绑定数据,复用注册表单的数据模型
//表单数据校验
//登录函数
import { useTokenStore } from '@/stores/token.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const tokenStore = useTokenStore();
const login = async () => {
    //调用接口,完成登录
    let result = await userLoginService(registerData.value);
    //    if(result.code===1){
    //     alert('登录成功')
    //    }else{
    //     alert('登录失败')
    //    }
    //    alert( '登录成功')
    if (result.code === 1) {
        //把得到的token存储到pinia中
        tokenStore.setToken(result.data)
        //跳转到首页 路由完成跳转
        router.push('/')
        ElMessage.success('登录成功')

    }

}

//定义函数,清空数据模型的数据
const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }
}
</script>

<template>

    <el-header></el-header>
    <div class="background">
        <br><br><br>   
    <el-row class="login-page">
        <el-col :span="15" class="bg">
            <!-- <video autoplay loop muted class="bg-video">
                    <source src="src/assets/image/video.mp4" type="video/mp4">                   
            </video> -->
            <video id="video" src="/static/images/video.mp4" controls="controls" autoplay="autoplay" class="bg-video"></video>
        </el-col>
        <el-col :span="5" :offset="2" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <!-- 在prop中指定校验名 -->
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <!-- <el-link type="primary" :underline="false">忘记密码？</el-link> -->
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    </div>



</template>

<style lang="scss" scoped>
/* 样式 */
.background {
    background: url('@/assets/image/history_background.png');
    background-size: 100% 100%;
    height: 80vh;
    
}
.login-page {
    height: 95%;
    background-color: #fff;
    width: 98%;
    //水平居中
    margin: 0 auto;
    .bg {
        width: 100%;
        height: 100%;
        // background: url('@/assets/image/login_background.png') no-repeat center;
        background-size: 100% 100%;
        border-radius: 0 20px 20px 0;
        position: relative;
        // height: 100%;
    }

    .bg-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        // background-size: 100% 100%;
        object-fit: cover;
        z-index: 1;
    }

    /* 可选：隐藏视频控件 */
    .bg-video::-webkit-media-controls {
        display: none;
    }

    .bg-video::-webkit-media-controls-enclosure {
        display: none !important;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;
        width: 100%;
        height: 100%;
        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

    }
}
.el-header {
    height: 11vh;
    background: url('@/assets/image/history_header.png') no-repeat center;
    background-size: 100% 100%;

}
</style>