import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedDate: "12/2021",
    selectedCountries: [],
    countryToAdd: "",
    countryToDelete: "",
    choroplethMapData: [],
    data: [],
  },
  mutations: {

    changeSelectedDate(state, date) {
    
      state.selectedDate = date;

    },
    addSelectedCountry(state, val) {
      state.countryToAdd = val;
      state.selectedCountries.push(val);
      state.countryToDelete = ""
    },
    deleteSelectedCountry(state, val) {


      state.countryToDelete = val;

      const index = state.selectedCountries.indexOf(val);
      if (index > -1) {
        state.selectedCountries.splice(index, 1);
      }
      state.countryToAdd = ""

    },

    reset(state) {

      state.selectedCountries = []
      state.selectedDate = "12/2021"
      state.countryToAdd = ""
      state.countryToDelete = ""

    },



  },
  getters: {

    selectedDate: (state) => state.selectedDate,
    countryToAdd: (state) => state.countryToAdd,
    selectedCountries: (state) => state.selectedCountries,
    countryToDelete: (state) => state.countryToDelete,

    scatterPlotData(state) {
      let result = []



      for (let i = 0; i < state.data.length; i++) {


        if (12 === d3.timeParse("%d/%m/%Y")(state.data[i].date).getMonth() + 1
          && 2021 === d3.timeParse("%d/%m/%Y")(state.data[i].date).getFullYear()
          && !(state.data[i].iso_code.startsWith("OWID"))) {

          result.push({
            isoCode: state.data[i].iso_code,
            countryName: state.data[i].location,
            date: d3.timeParse("%d/%m/%Y")(state.data[i].date),
            newDeathsSmoothedMillion: +state.data[i].new_deaths_smoothed_per_million > 0
              ? +state.data[i].new_deaths_smoothed_per_million
              : undefined,
            newVaccinesSmoothedMillion: +state.data[i].new_vaccinations_smoothed_per_million,
            newCasesSmoothedMillion: +state.data[i].new_cases_smoothed_per_million,

          })
        }


      }
      let valuesToSum = ["newDeathsSmoothedMillion", "newVaccinesSmoothedMillion"];
      let resultMap = d3.flatRollup(
        result,
        (v) =>
          Object.fromEntries(
            valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
          ),
        (d) => d.isoCode,
        (d) => d.countryName,
      );

      let finalResult = []
      for (let i = 0; i < resultMap.length; i++) {


        finalResult.push({
          countryName: resultMap[i][1],
          newDeathsSmoothedMillion: resultMap[i][2].newDeathsSmoothedMillion,
          newVaccinesSmoothedMillion: resultMap[i][2].newVaccinesSmoothedMillion,
          isoCode: resultMap[i][0],
        })


      }

      return finalResult;
    },


    scatterPlotData1(state) {
      let result = []



      for (let i = 0; i < state.data.length; i++) {


        if (+state.selectedDate.split("/")[0] === d3.timeParse("%d/%m/%Y")(state.data[i].date).getMonth() + 1
          && +state.selectedDate.split("/")[1] === d3.timeParse("%d/%m/%Y")(state.data[i].date).getFullYear()
          && !(state.data[i].iso_code.startsWith("OWID"))) {

          result.push({
            isoCode: state.data[i].iso_code,
            countryName: state.data[i].location,
            date: d3.timeParse("%d/%m/%Y")(state.data[i].date),
            newDeathsSmoothedMillion: +state.data[i].new_deaths_smoothed_per_million > 0
              ? +state.data[i].new_deaths_smoothed_per_million
              : undefined,
            newVaccinesSmoothedMillion: +state.data[i].new_vaccinations_smoothed_per_million,
            newCasesSmoothedMillion: +state.data[i].new_cases_smoothed_per_million,

          })
        }


      }
      let valuesToSum = ["newDeathsSmoothedMillion", "newVaccinesSmoothedMillion"];
      let resultMap = d3.flatRollup(
        result,
        (v) =>
          Object.fromEntries(
            valuesToSum.map((col) => [col, d3.sum(v, (d) => d[col])])
          ),
        (d) => d.isoCode,
        (d) => d.countryName,
      );

      let finalResult = []
      for (let i = 0; i < resultMap.length; i++) {


        finalResult.push({
          countryName: resultMap[i][1],
          newDeathsSmoothedMillion: resultMap[i][2].newDeathsSmoothedMillion,
          newVaccinesSmoothedMillion: resultMap[i][2].newVaccinesSmoothedMillion,
          isoCode: resultMap[i][0],
        })


      }

      return finalResult;
    },



    choroplethMapData(state) {
      let result = new Map();

      for (let i = 0; i < state.data.length; i++) {

        if (!(state.data[i].iso_code.startsWith("OWID"))) {
          result.set(state.data[i].iso_code,
            {
              countryName: state.data[i].location,
              cardiovascDeathRate: +state.data[i].cardiovasc_death_rate,
              diabetesPrevalence: +state.data[i].diabetes_prevalence
            })
        }


      }


      // for (let i = 0; i < state.choroplethMapData.length; i++) {
      //   result.set(state.choroplethMapData[i].iso_code,
      //     {

      //       cardiovascDeathRate: +state.choroplethMapData[i].cardiovasc_death_rate,
      //       diabetesPrevalence: +state.choroplethMapData[i].diabetes_prevalence
      //     }

      //     // [ +state.choroplethMapData[i].cardiovasc_death_rate, +state.choroplethMapData[i].diabetes_prevalence]
      //   )
      // }

      Object.freeze(result);
      return result;
    },

    lineChartData(state) {
      let result = [];


      let a = [], b = []


      state.data.forEach(function (d) {
        a = d.date.split(" ", 1);
        b = a[0].split("/");
        d.year = b[2] * 1;
        d.month = b[1] * 1;
        d.day = b[0] * 1;

      })


      for (let i = 0; i < state.data.length; i++) {

        if (!(state.data[i].iso_code.startsWith("OWID"))) {

          result.push({
            isoCode: state.data[i].iso_code,
            countryName: state.data[i].location,
            date: d3.timeParse("%d/%m/%Y")(state.data[i].date),
            newDeathsSmoothedMillion: +state.data[i].new_deaths_smoothed_per_million,
            newVaccinesSmoothedMillion: +state.data[i].new_vaccinations_smoothed_per_million,
            newCasesSmoothedMillion: +state.data[i].new_cases_smoothed_per_million,
            stringencyIndex: +state.data[i].stringency_index,
            monthYear: state.data[i].month + "/" + state.data[i].year,
          })
        }
      }

      function sortByDateAscending(a, b) {
        return a.date - b.date;
      }

      result = result.sort(sortByDateAscending);

      Object.freeze(result);
      return result;
    },

    lineSpecificCountryData(state) {
      let result = [];


      let a = [], b = []


      state.data.forEach(function (d) {
        a = d.date.split(" ", 1);
        b = a[0].split("/");
        d.year = b[2] * 1;
        d.month = b[1] * 1;
        d.day = b[0] * 1;

      })

      for (let i = 0; i < state.data.length; i++) {

        if (!(state.data[i].iso_code.startsWith("OWID"))
          && state.countryToAdd === (state.data[i].iso_code)

        ) {

          result.push({
            isoCode: state.data[i].iso_code,
            countryName: state.data[i].location,
            date: d3.timeParse("%d/%m/%Y")(state.data[i].date),
            newDeathsSmoothedMillion: +state.data[i].new_deaths_smoothed_per_million,
            newVaccinesSmoothedMillion: +state.data[i].new_vaccinations_smoothed_per_million,
            newCasesSmoothedMillion: +state.data[i].new_cases_smoothed_per_million,
            monthYear: state.data[i].month + "/" + state.data[i].year,
            stringencyIndex: +state.data[i].stringency_index,
          })
        }
      }

      function sortByDateAscending(a, b) {
        return a.date - b.date;
      }

      result = result.sort(sortByDateAscending);



      Object.freeze(result);

      return result;
    },

    voronoiData(state) {

      let result = [];


      let a = [], b = []


      state.data.forEach(function (d) {
        a = d.date.split(" ", 1);
        b = a[0].split("/");
        d.year = b[2] * 1;
        d.month = b[1] * 1;
        d.day = b[0] * 1;

      })

      for (let i = 0; i < state.data.length; i++) {

        if (!(state.data[i].iso_code.startsWith("OWID"))
          && state.selectedCountries.includes(state.data[i].iso_code)

        ) {

          result.push({
            isoCode: state.data[i].iso_code,
            countryName: state.data[i].location,
            date: d3.timeParse("%d/%m/%Y")(state.data[i].date),
            newDeathsSmoothedMillion: +state.data[i].new_deaths_smoothed_per_million,
            newVaccinesSmoothedMillion: +state.data[i].new_vaccinations_smoothed_per_million,
            newCasesSmoothedMillion: +state.data[i].new_cases_smoothed_per_million,
            stringencyIndex: +state.data[i].stringency_index,
            monthYear: state.data[i].month + "/" + state.data[i].year,
          })
        }
      }

      function sortByDateAscending(a, b) {
        return a.date - b.date;
      }

      result = result.sort(sortByDateAscending);

      Object.freeze(result);

      return result;
    },

  },
  actions: {
    loadData({ state }) {

      // d3.csv('./owid-covid-data-choropleth.csv')

      //   .then((d) => {
      //     state.choroplethMapData = d;
      //   })

      d3.csv('./owid-covid-data-reduced.csv').then((d) => {
        Object.freeze(d);
        state.data = d;
        document.getElementById('hide-screen').style.display = null;
        d3.select('.lds-roller').remove();
        d3.select('.loading-message').remove();

      })


    },
  }
})

export default store;
