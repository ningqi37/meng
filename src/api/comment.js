import request from '@/utils/request.js'

export const getCommentListService =()=> {
    return request.get('/commentList')
}

export const addCommentService =(data)=> {
    return request.post('/addComment',data)
}