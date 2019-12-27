import axios from 'axios'
const host = 'http://localhost/api'
//获取Product信息
export const fetchProduct = param => {
    return axios.get(`${host}/games`,{params:param})
};
//删除Product
export const deleteProduct = delIds=>{
    return axios.delete(`${host}/games`,{withCredentials:true,data:delIds})
}
//更新Product
export const updateProduct= form=>{
    return axios.put(`${host}/games`,form,{withCredentials:true})
}
//添加新Product
export const addProduct = form=>{
    return axios.post(`${host}/games`,form,{withCredentials:true})
}
//获取所有订单
export const fetchOrderItem=()=>{
    return axios.get(`${host}/order-items`,{withCredentials:true})
}
//登录
export const login=form=>{
    return axios.post(`${host}/login`,form,{withCredentials:true})
}
