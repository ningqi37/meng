<script setup>
import { Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();
const passwordData = ref({
    password: '',
    rePassword: ''
})
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== passwordData.value.password) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}

import { userUpdatePasswordService } from '@/api/user.js'
const updatePassword = async () => {
    // 表单校验
    if (passwordData.value.password === passwordData.value.rePassword) {
        let result = await userUpdatePasswordService(passwordData.value.password, userInfoStore.info.id);
        if (result.code === 1) {
            //修改成功
            ElMessage.success('修改成功,请重新登录')
            router.push('/login')

        }
    }
    else {
        ElMessage.error('两次输入的密码不一致')
    }


}

//定义表单校验规则
const rules = {
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>

        <el-row>
            <el-col :span="12">
                <el-form ref="form" size="large" autocomplete="off" :model="passwordData" :rules="rules">
                    <!-- 在prop中指定校验名 -->
                    <el-form-item prop="password">
                        <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                            v-model="passwordData.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="rePassword">
                        <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码"
                            v-model="passwordData.rePassword"></el-input>
                    </el-form-item>
                    <!-- 注册按钮 -->
                    <el-form-item>
                        <el-button class="button" type="primary" auto-insert-space @click="updatePassword">
                            修改密码
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
<style></style>