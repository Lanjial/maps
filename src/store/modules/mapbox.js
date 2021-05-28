import Export from "../../../static/Export_Output.json"

const state = {
    // raw_geojson_info:Export,
    // raw_default_area_list:[],
    // geojson_info:[],
    // area_chosen_state:[],
    // relation_between_area_ID:[],
    // relation_between_area_colorlist:[],
  }
  
  // getters
  const getters = {
   
  }
  
  // actions
  const actions = {
  
  }
  
  // mutations
  const mutations = {
    // setExport(state, data) {
    //     state.Export = data
    //     state.geojson_info[data.properties.name] = data.properties.id + 1;
    //     state.area_chosen_state[data.id] = false;
    //     state.relation_between_area_ID[data.id] = data.properties.name;
    //     state.raw_default_area_list.push(data.properties.name)
    //     state.relation_between_area_colorlist[data.properties.name] = window.colorList.indexOf(window.colorList[data.properties.id])
    // },
  }
  
  export default {
    namespaced: true,//为了解决不同模块命名冲突的问题
    state,
    getters,
    actions,
    mutations
  }
  