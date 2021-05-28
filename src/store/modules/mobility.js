const state = {
    mobility:[],
    mobility_option:[],
    mobility_myChart:[]
}

// getters
const getters = {
 
}

// actions
const actions = {

}

// mutations
const mutations = {
    getMobility(state,val){
        state.mobility = val
    },
    getMobility_option(state,val){
        state.mobility_option = val
    },
    getMobility_myChart(state,val){
        state.mobility_myChart = val
    }
}

export default {
  namespaced: true,//为了解决不同模块命名冲突的问题
  state,
  getters,
  actions,
  mutations
}
