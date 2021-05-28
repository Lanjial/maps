const state = {
    economicDate:"",
    weight_option:{},
    weight_myChart:{},
}

// getters
const getters = {
 
}

// actions
const actions = {

}

// mutations
const mutations = {
    geteConomicDate(state,val){
        state.economicDate = val
        console.log(1,val);
    },
    getWeight_option(state,val){
        state.weight_option = val
    },
    getWeight_myChart(state,val){
        state.weight_myChart = val
    },
}

export default {
  namespaced: true,//为了解决不同模块命名冲突的问题
  state,
  getters,
  actions,
  mutations
}

