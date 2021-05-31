  const state = {
    mapboxData:[],
    mapbox_option:[],
    mapbox_myChart:[],
  }
  
  // getters
  const getters = {
   
  }
  
  // actions
  const actions = {
  
  }
  
  // mutations
  const mutations = {
    getMapboxData(state,val){
      state.mapboxData = val
    },
    getMapbox_option(state,val){
        state.mapbox_option = val
    },
    getMapbox_myChart(state,val){
        state.mapbox_myChart = val
    },
  }
  
  export default {
    namespaced: true,//为了解决不同模块命名冲突的问题
    state,
    getters,
    actions,
    mutations
  }
  