//导入request.js请求工具
import request from '@/utils/request.js'

//提供调用注册接口的函数
export const userRegisterService = (registerData)=>{
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/user/register',params);
}

//提供调用登录接口的函数
export const userLoginService = (emp)=>{
    const params = new URLSearchParams();
    for(let key in emp){
        params.append(key,emp[key])
    }
    return request.post('/user/login',params)
}


//获取用户详细信息
export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}

//修改个人信息
export const userInfoUpdateService = (userInfoData)=>{
   return request.put('/user/update',userInfoData)
}

//修改头像
export const userAvatarUpdateService = (avatarUrl,id)=>{
    const params = new URLSearchParams();
    params.append('id',id)
    params.append('image',avatarUrl)
    return request.patch('/user/updateAvatar',params)
}
//修改密码
export const userUpdatePasswordService = (password,id)=>{
    
    const params = new URLSearchParams();
    params.append('id',id)
    params.append('password',password)
    return request.post('/user/updatePassword',params)
}

