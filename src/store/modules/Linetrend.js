const state = {
    linetrendData:[],
    linetrend_option:[],
    linetrend_myChart:[],
}

const getters = {

}

const actions = {

}

const mutations = {
    getLinetrendData(state,val){
        state.linetrendData = val
    },
    getLinetrend_option(state,val){
        state.linetrend_option = val
    },
    getLinetrend_myChart(state,val){
        state.linetrend_myChart = val
    },
}
export default ({
    namespaced: true,//为了解决不同模块命名冲突的问题
    state,
    getters,
    actions,
    mutations,
})