import Vue from 'vue'
import Vuex from 'vuex'
import getters  from "./getters "
import mapbox from "./modules/mapbox"
import horizhist from "./modules/horizhist"
import Linetrend from "./modules/Linetrend"
Vue.use(Vuex)

const state = {
  Exports:"",
  // 鼠标移入和选中后的移入的颜色
  colorList_clear:['rgba(255,73,51, 0.1)', 'rgba(52,152,219, 0.1)', 'rgba(244,208,63, 0.1)', 'rgba(108,52,131, 0.1)', 'rgba(255,140,51, 0.1)', 'rgba(46,204,113, 0.1)', 'rgba(41,128,185, 0.1)', 'rgba(51,183,255, 0.1)', 'rgba(51,78,255, 0.1)', 'rgba(203,51,255, 0.1)', 'rgba(148,49,38, 0.1)', 'rgba(194,53,49, 0.1)', 'rgba(47,69,84, 0.1)', 'rgba(97,160,168, 0.1)', 'rgba(212,130,101, 0.1)', 'rgba(145,199,174, 0.1)', 'rgba(116,159,131, 0.1)', 'rgba(202,134,34, 0.1)'],
  // 默认的颜色
  colorList:['rgba(255,73,51, 1)', 'rgba(52,152,219, 1)', 'rgba(244,208,63, 1)', 'rgba(108,52,131, 1)', 'rgba(255,140,51, 1)', 'rgba(46,204,113, 1)', 'rgba(41,128,185, 1)', 'rgba(51,183,255, 1)', 'rgba(51,78,255, 1)', 'rgba(203,51,255, 1)', 'rgba(148,49,38, 1)', 'rgba(194,53,49, 1)', 'rgba(47,69,84, 1)', 'rgba(97,160,168, 1)', 'rgba(212,130,101, 1)', 'rgba(145,199,174, 1)', 'rgba(116,159,131, 1)', 'rgba(202,134,34, 1)'],
  
  // 时间与名称的全局处理
  data_set_from_json:[],
  date_set_from_json:[],
  TownName_set_from_json:[],
  
  // case部分的全局数据
  raw_geojson_info:[],
  raw_default_area_list:[],
  geojson_info:new Array(),
  area_chosen_state:new Array(),
  relation_between_area_ID:new Array(),
  relation_between_area_colorlist:new Array(),

  // Linetrend数据标记
  hl_line_mark:-1,
  hoveredStateId:null,
  map_muti_chosen_mark:false,
}

// actions
const actions = {
  
}

// mutations
const mutations = {
  // 处理全局数据
  getGeojsoninfo(state,element){
    state.geojson_info[element.properties.name] = element.properties.id + 1;
    state.area_chosen_state[element.id] = false;
    state.relation_between_area_ID[element.id] = element.properties.name;
    state.raw_default_area_list.push(element.properties.name)
    state.relation_between_area_colorlist[element.properties.name] = state.colorList.indexOf(state.colorList[element.properties.id])
  },
  // 时间与名称得全局数据处理
  timeNameDataHandle(state,Cases_Number_Monthly){
  let a
  Cases_Number_Monthly.casenumbermonthly.forEach(element => {
      state.TownName_set_from_json.push(element['TownName']);
      // 存储所有名称
      a = element['Month'].split("/");
      a = a[2] + '/' + a[0] + '/' + a[1];
      // 将日期写成正序格式
      state.date_set_from_json.push(a);
      // 将日期存储至date
  });
  // 数组去重
  state.date_set_from_json = [...new Set(state.date_set_from_json)];
  state.TownName_set_from_json = [...new Set(state.TownName_set_from_json)];
  // 在每个姓名对应的索引中创建与日期相同的位置
  state.data_set_from_json = new Array(state.TownName_set_from_json.length);
      for (let i = 0; i < state.data_set_from_json.length; i++) {
          state.data_set_from_json[i] = new Array(state.date_set_from_json.length);
  }
  // 将每一个名字与日期所对应的值存入相应位置
   Cases_Number_Monthly.casenumbermonthly.forEach(element => {
    state.TownName_set_from_json.findIndex(function(TownName_value, TownName_index) {
            //findindex分别找出对应的下标与值 
            if (TownName_value === element['TownName']) {
                //则包含该元素
                a = element['Month'].split("/");
                a = a[2] + '/' + a[0] + '/' + a[1];
                state.date_set_from_json.findIndex(function(date_value, date_index) {
                    if (date_value === a) {
                        //则包含该元素
                        state.data_set_from_json[TownName_index][date_index] = element['The number of cases']
                        // 将每一个名字与日期所对应的值存入相应位置
                    }
                })
            }
        })
    });
  // 名字与日期一一对应
  

},
  // mapbox的SetFeatureState事件
  setFeatureState(state,val){
    map.setFeatureState({
      source: 'rwanda-provinces',
      id: state.hoveredStateId
    }, {
        hover: val
    });
  }
}


const store = new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    mapbox,
    horizhist,
    Linetrend,
  },
  getters
})

export default store