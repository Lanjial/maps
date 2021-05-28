import request from '@/utils/request'

// 获取社会经济数据
export function getEconomicDate(){
    return request({
        url:'json/Socio-Economic Relativity.json'
    })
}

// 获取迁移率数据
export function getMobility(){
    return request({
        url:'json/Mobility.json'
    })
}