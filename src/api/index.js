import request from '@/utils/request'

// 获取模拟数据
export function getMapDate(){
    return request({
        url:'json/Socio-Economic Relativity.json'
    })
}

// 获取