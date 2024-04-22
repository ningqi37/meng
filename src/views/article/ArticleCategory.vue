<script setup>
import {
    Edit,
    Delete,
    Close
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
import { useAddressStore } from '@/stores/address.js';
const userInfoStore = useUserInfoStore();
//存储信息
const deptsList = ref([])

//声明一个异步的函数
import { scenicSpotListService, articleCategoryAddService, articleCategoryUpdateService, scenicSpotDeleteService } from '@/api/article.js'
//返回员工信息
const articleCategoryList = async () => {
    let result = await scenicSpotListService(userInfoStore.info.id);
    deptsList.value = result.data;
}
articleCategoryList();
//控制添加分类弹窗
const dialogVisible = ref(false)
const buttonVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分类表单校验
// const rules = {
//     categoryName: [
//         { required: true, message: '请输入分类名称', trigger: 'blur' },
//     ],
//     categoryAlias: [
//         { required: true, message: '请输入分类别名', trigger: 'blur' },
//     ]
// }


//调用接口,添加表单
import { ElMessage } from 'element-plus'
// const addCategory = async () => {
//     //调用接口
//     const data = ref({ "name": categoryModel.value.categoryName })
//     let result = await articleCategoryAddService(data.value);
//     ElMessage.success(result.msg ? result.msg : '添加成功')

//     //调用获取所有文章分类的函数
//     articleCategoryList();
//     //添加后将弹窗屏蔽
//     dialogVisible.value = false;
// }

//定义变量,控制标题的展示
const title = ref('')

// //展示编辑弹窗
// const showDialog = (row) => {
//     dialogVisible.value = true; title.value = '编辑分类'
//     //数据拷贝
//     categoryModel.value.categoryName = row.categoryName;
//     categoryModel.value.categoryAlias = row.categoryAlias;
//     //扩展id属性,将来需要传递给后台,完成分类的修改
//     categoryModel.value.id = row.id
// }

// //编辑分类
// const updateCategory = async () => {
//     //调用接口
//     const data = ref({
//         "name": categoryModel.value.categoryName,
//         "id": categoryModel.value.id
//     })
//     let result = await articleCategoryUpdateService(data.value);

//     ElMessage.success(result.msg ? result.msg : '修改成功')

//     //调用获取所有分类的函数
//     articleCategoryList();

//     //隐藏弹窗
//     dialogVisible.value = false;
// }

//清空模型的数据
const clearData = () => {
    categoryModel.value.categoryName = '';
    categoryModel.value.categoryAlias = '';
}
import {useRouter} from 'vue-router'
const router = useRouter();
const goSkyBox = (address) =>{
    router.push('/navigate')
    console.log(address)
    const addressStore = useAddressStore();
    addressStore.removeAddress();
    addressStore.addAddress(address);
    // const address1 = addressStore.findAddress(0);
    // console.log(address1)
}
//删除分类
import { ElMessageBox } from 'element-plus'
const deleteCategory = (addid) => {
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该收藏吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            var data = {
                "userid": userInfoStore.info.id,
                "addid": addid
            }
            let result = await scenicSpotDeleteService(data);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            articleCategoryList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>我的收藏</span>
                <div class="extra">
                    <el-button type="primary" @click="buttonVisible = !buttonVisible; title = '取消收藏'; clearData()">{{
                        buttonVisible ? '取消' :
                            '删除收藏' }}
                    </el-button>
                </div>
            </div>
        </template>

        <el-space wrap>
            <el-card v-for="index in deptsList" class="box-card" style="width: 295px;height: 300px">

                <template #header>
                    <div class="card-header" style="position: relative;">
                        <div>{{ index.address }}
                            <el-button :icon="Close" v-show="buttonVisible" size="small" circle
                                style="position: absolute; top: 0; right: 5px;"
                                @click="deleteCategory(index.id)"></el-button>
                            <el-button v-show="!buttonVisible" @click="goSkyBox(index.address)" style="margin-left: 195px;" type="primary" class="button"
                                text>去这里</el-button>
                        </div>
                    </div>
                </template>
                <el-image style="width: 260px; height: 170px" :src="index.image" />
            </el-card>
        </el-space>
        <!-- 添加分类弹窗 -->
        <!-- <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加分类' ? addCategory() : updateCategory()"> 确认
                    </el-button>
                </span>
            </template>
        </el-dialog> -->
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>