import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAddressStore = defineStore('address', () => {
    // 定义响应式变量
    const addresses = ref([]);

    // 添加地址
    const addAddress = (newAddress) => {
        addresses.value.push(newAddress);
    };

    // 删除地址
    const removeAddress = () => {
        addresses.value = [];
    };

    // 查找地址
    const findAddress = (index) => {
        return addresses.value[index];
    };

    return {
        addresses,
        addAddress,
        removeAddress,
        findAddress
    };
}, {
    // 可选的配置
    persist: true // 持久化存储
});