import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';




Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2006,
    selectedStates: [],
    data:[],
  },
  mutations: {
    changeSelectedYear(state, year) {
      state.selectedYear = year;
    },
    changeSelectedState(state, val) {
      state.selectedStates.push(val);
    },


  },
  getters: {
    selectedYear: (state) => state.selectedYear,
    selectedStates: (state) => state.selectedStates,
    data(state) {
      let result = new Map();
      for (let i = 0; i < state.data.length; i++) {
        
        

          result.set(state.data[i].iso_code,
          
          [+state.data[i].cardiovasc_death_rate,+state.data[i].diabetes_prevalence]
          )
          
          
          // .push({
          //   country: state.data[i].iso_code,
          //   cardioValue: +state.data[i].cardiovasc_death_rate,
          //   diabetesValue: +state.data[i].diabetes_prevalence,
          // })
        
        
      }
      return result;
    },
   
    
  },
  actions: {
    loadData({state}) {
      
        d3.csv('./owid-covid-data-reduced.csv')

        .then((data) => {
          state.data = data;
        })


      

    },
  }
})

export default store;
