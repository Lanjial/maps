const getters = {
    // sidebar: state => state.app.sidebar,
    // horizhist
    horizhistData: state => state.horizhist.horizhistData,
    horizhist_option: state => state.horizhist.horizhist_option,
    horizhist_myChart: state => state.horizhist.horizhist_myChart,

    // weight
    economicIndicators: state => state.weight.economicIndicators,
    economicDate: state => state.weight.economicDate,
    weight_option: state => state.weight.weight_option,
    weight_myChart: state => state.weight.weight_myChart,

    // Mobility
    mobility: state => state.mobility.mobility,
    mobility_option: state => state.mobility.mobility_option,
    mobility_myChart: state => state.mobility.mobility_myChart,

    // Linetrend
    linetrendData: state => state.Linetrend.linetrendData,
    linetrend_option: state => state.Linetrend.linetrend_option,
    linetrend_myChart: state => state.Linetrend.linetrend_myChart,

    // mapbox
    mapboxData: state => state.mapbox.mapboxData,
    mapbox_option: state => state.mapbox.mapbox_option,
    mapbox_myChart: state => state.mapbox.mapbox_myChart,
    
  }

  export default getters
  