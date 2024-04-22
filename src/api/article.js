import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
//新闻获取
export const searchNew = ()=>{
    return request.get('/bmdt/szyw/')
}
//获取收藏列表
export const scenicSpotListService = (id)=>{
    return request.get('/scenicSpot/'+id)
}
//删除点赞
export const scenicSpotDeleteService = (data)=>{
    const params = new URLSearchParams();
    for(let key in data){
        params.append(key,data[key])
    }
    return request.post('/scenicSpotDelete', params)
}
//景点点赞
export const scenicSpotFavorService = (data)=>{
    const params = new URLSearchParams();
    for(let key in data){
        params.append(key,data[key])
    }
    return request.post('/scenicSpotFavor', params)
}
//文章分类列表查询
export const articleCategoryListService = ()=>{
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据,都不需要.value
    //return request.get('/category',{headers:{'Authorization':tokenStore.token}})
    return request.get('/depts')
}

//文章分类添加
export const articleCategoryAddService = (categoryData)=>{
    return request.post('/depts',categoryData)
}

//文章分类修改
export const articleCategoryUpdateService = (categoryData)=>{
   return  request.put('/depts',categoryData)
}

//文章分类删除
export const articleCategoryDeleteService = (id)=>{
    return request.delete('/depts/'+id)
}

//文章列表查询
export const articleListService = (params)=>{
   return  request.get('/article',{params:params})
}

//文章添加
export const articleAddService = (articleData)=>{
    return request.post('/article',articleData);

}