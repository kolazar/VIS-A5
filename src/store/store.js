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



  },
  getters: {

    selectedDate: (state) => state.selectedDate,
    countryToAdd: (state) => state.countryToAdd,
    selectedCountries: (state) => state.selectedCountries,
    countryToDelete: (state) => state.countryToDelete,

    scatterPlotData(state) {
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
      for (let i = 0; i < state.choroplethMapData.length; i++) {
        result.set(state.choroplethMapData[i].iso_code,
          [+state.choroplethMapData[i].cardiovasc_death_rate, +state.choroplethMapData[i].diabetes_prevalence]
        )
      }
      return result;
    },

    lineChart1Data(state) {
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

    voronoiData(state){

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
    
            monthYear: state.data[i].month + "/" + state.data[i].year,
          })
        }
      }

      function sortByDateAscending(a, b) {
        return a.date - b.date;
      }

      result = result.sort(sortByDateAscending);


      result =  d3.flatRollup(
        result,
        (v) =>
          d3.sum(v, (d) => {
            if (typeof d.newCasesSmoothedMillion !== "undefined")
              return d.newCasesSmoothedMillion;
          }),
        (d) => d.monthYear,
        (d) => d.isoCode,
        (d) => d.countryName
      );

      

      Object.freeze(result);

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







    /*
    ==================
JSON implementation
    ==================
    
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

    */
  },
  actions: {
    loadData({ state }) {

      d3.csv('./owid-covid-data-choropleth.csv')

        .then((d) => {
          state.choroplethMapData = d;
        })

      d3.csv('./owid-covid-data-reduced.csv').then((d) => {
        Object.freeze(d);
        state.data = d;
        document.getElementById('loading-message').remove();
        // document.getElementById('hide-screen').style.display = null;
      })

      // d3.csv('./owid-covid-data-scatter.csv').then((d) => {
      //   state.lineChart1Data = d;
      // })

      // d3.json('./owid-covid-data.json').then((d) => {
      //   Object.freeze(d);
      //   state.data = d;
      //   document.getElementById('loading-message').remove();
      //   // document.getElementById('hide-screen').style.display = null;
      // })

    },
  }
})

export default store;
