import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAddressStore = defineStore('address', () => {
    // ������Ӧʽ����
    const addresses = ref([]);

    // ��ӵ�ַ
    const addAddress = (newAddress) => {
        addresses.value.push(newAddress);
    };

    // ɾ����ַ
    const removeAddress = () => {
        addresses.value = [];
    };

    // ���ҵ�ַ
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
    // ��ѡ������
    persist: true // �־û��洢
});