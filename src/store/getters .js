const getters = {
    // sidebar: state => state.app.sidebar,
    // horizhist
    horizhist_data_set1_from_json: state => state.horizhist.horizhist_data_set1_from_json,
    horizhist_colorlist: state => state.horizhist.horizhist_colorlist,
    horizhist_colorlist_clear: state => state.horizhist.horizhist_colorlist_clear,
    horizhist_arealist: state => state.horizhist.horizhist_arealist,

    // weight
    economicIndicators: state => state.weight.economicIndicators,
    economicDate: state => state.weight.economicDate,
    weight_option: state => state.weight.weight_option,
    weight_myChart: state => state.weight.weight_myChart,
    name:state => state.weight.name,
  }

  export default getters
  