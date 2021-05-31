const state = {
    horizhistData:[],
    horizhist_option:[],
    horizhist_myChart:[],
    horizhist_data_set1_from_json:[],
    horizhist_colorlist:[],
    horizhist_colorlist_clear:[],
    horizhist_arealist:[],
}

const getters = {

}

const actions = {

}

const mutations = {
    getHorizhistData(state,val){
        state.horizhistData = val
    },
    getHorizhist_option(state,val){
        state.horizhist_option = val
    },
    getHorizhist_myChart(state,val){
        state.horizhist_myChart = val
    }
}
export default ({
    namespaced: true,//为了解决不同模块命名冲突的问题
    state,
    getters,
    actions,
    mutations,
})