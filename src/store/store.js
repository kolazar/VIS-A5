import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedMonth: "January",
    selectedStates: [],
    cardioDiabetes: [],
    newDeathsVaccines: [],
    data: [],
    lineChartData: [],
    data2: []
  },
  mutations: {
    changeSelectedMonth(state, month) {
      state.selectedMonth = month;
      console.log(state.selectedMonth);
    },
    changeSelectedState(state, val) {
      state.selectedStates.push(val);
    },


  },
  getters: {
    selectedYear: (state) => state.selectedMonth,
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
    newDeathsVaccines(state) {
      let result = [];
      for (let i = 0; i < state.newDeathsVaccines.length; i++) {
            



        result.push({
          isoCode: state.newDeathsVaccines[i].iso_code,
          countryName: state.newDeathsVaccines[i].location,
          date: new Date(state.newDeathsVaccines[i].date),
          newDeaths: +state.newDeathsVaccines[i].new_deaths_smoothed_per_million,
          newVaccinations: state.newDeathsVaccines[i].new_vaccinations_smoothed_per_million === "undefined" ? "undefined": +state.newDeathsVaccines[i].new_vaccinations_smoothed_per_million,
        })
      }

      return result;
    },
    // lineChart2Data(state) {
    //   let result = [];
    //   for (let i = 0; i < state.data.length; i++) {
    //     result.push({
    //       isoCode: state.data[i].iso_code,
    //       countryName: state.data[i].location,
    //       date: new Date(state.data[i].date),
    //       stringency: +state.data[i].stringency_index,
    //     })

    //   }
    //   return result;
    // },
    // lineChart2Data(state) {

    //   let result = []
    //   let a = [], b = []
    //   // f_date=[];


    //   state.lineChart2Data.forEach(function (d) {
    //     a = d.date.split(" ", 1);
    //     b = a[0].split("/");
    //     // f_date = b[0].concat("-").concat(b[1]).concat("-").concat(b[2]);
    //     d.year = b[2] * 1;
    //     d.month = b[1] * 1;
    //     d.day = b[0] * 1;

    //   })



    //   for (let i = 0; i < state.lineChart2Data.length; i++) {

    //     result.push({
    //       isoCode: state.lineChart2Data[i].iso_code,
    //       countryName: state.lineChart2Data[i].location,
    //       date: d3.timeParse("%d/%m/%Y")(state.lineChart2Data[i].date),
    //       day: state.lineChart2Data[i].day,
    //       month: state.lineChart2Data[i].month,
    //       year: state.lineChart2Data[i].year,
    //       policy: +state.lineChart2Data[i].stringency_index,
    //     })


    //     // if (state.lineChart2Data[i].stringency_index === ""){
    //     //   result.policy: undefined,

    //     // }

    //   }

    //   return result;
    // },

    lineChartData(state) {

      let result = []

      let keys = Object.keys(state.data);

      keys.forEach((key) => {
        for (let i = 0; i < state.data[key].data.length; i++) {

          if (!(key.startsWith("OWID"))) {

            result.push({

              isoCode: key,
              countryName: state.data[key].location,
              date: d3.timeParse("%Y-%m-%d")(state.data[key].data[i].date),
              newCasesSmoothedMillion: state.data[key].data[i].new_cases_smoothed_per_million,
              newVaccinesSmoothedMillion: state.data[key].data[i].new_vaccinations_smoothed_per_million,
              newDeathsSmoothedMillion: state.data[key].data[i].new_deaths_smoothed_per_million,
              policy: state.data[key].data[i].stringency_index,
            })
          }
        }
        function sortByDateAscending(a, b) {
          return a.date - b.date;
        }

        result = result.sort(sortByDateAscending);

      })
      console.log(result);
      Object.freeze(result);

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
        state.newDeathsVaccines = d;
      })

      // d3.csv('./owid-covid-data.csv').then((d) => {

      //   Object.freeze(d);
      //   state.data2 = d;


      //   // document.getElementById('loading-message').remove();
      //   // document.getElementById('hide-screen').style.display = "block";
      // })


      // d3.csv('./owid-covid-data-line2.csv').then((d) => {

      // state.lineChart2Data = d;
      // document.getElementById('loading-message').remove();
      // document.getElementById('hide-screen').style.display = "block";
      // })

      d3.json('./owid-covid-data.json').then((d) => {
        Object.freeze(d);
        state.data = d;
        document.getElementById('loading-message').remove();

      })

    },
  }
})

export default store;
