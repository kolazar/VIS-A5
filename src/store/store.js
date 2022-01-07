import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';




Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2006,
    selectedStates: [],
    cardioDiabetes: [],
    data: [],
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
    cardioDiabetes(state) {
      let result = new Map();
      for (let i = 0; i < state.cardioDiabetes.length; i++) {
        result.set(state.cardioDiabetes[i].iso_code,
          [+state.cardioDiabetes[i].cardiovasc_death_rate, +state.cardioDiabetes[i].diabetes_prevalence]
        )
      }
      return result;
    },
    data(state) {
      let result = [];
      for (let i = 0; i < state.data.length; i++) {
        result.push({
          isoCode: state.data[i].iso_code,
          countryName: state.data[i].location,
          date: new Date(state.data[i].date),
          newDeaths: +state.data[i].new_deaths_smoothed_per_million,
          newVaccinations: +state.data[i].new_vaccinations_smoothed_per_million,
        })
      }

      return result;
    },

  },
  actions: {
    loadData({ state }) {

      d3.csv('./owid-covid-data-choropleth.csv')

        .then((d) => {
          state.cardioDiabetes = d;
        })

      d3.csv('./owid-covid-data-scatter.csv').then((d) => {
        state.data = d;
      document.getElementById('loading-message').remove();
        // document.getElementById('hide-screen').style.display = "block";
      })


    },
  }
})

export default store;
