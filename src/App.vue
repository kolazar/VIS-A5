<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <h1>COVID-19 Dashboard</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">Control Plane
          <ControlPlane/>
        </div>
      </div>
      <!-- <div class="row">
        <div class="col-md-12">
          <YearSlider/>
        </div>
      </div> -->
      <div class="row">
        <h2 id="loading-message">Loading...</h2>
</div>
          <!-- <div id="hide-screen" class="col-md-12" style = "display: none"> -->

          <div class="row">
            <div class="col-md-7">
              <LineChart1 />
            </div>
            <div class="col-md-5">
              <Scatterplot />
            </div>
          </div>
          <div class="row">
            <div class="col-md-7">
              <ChoroplethMap />
            </div>
            <!-- <div class="col-md-5">
              <LineChart2 />
            </div> -->
          </div>
        <!-- </div> -->
      
    </div>
  </div>
</template>

<script>
// import BarChart from './components/BarChart.vue';
import ChoroplethMap from "./components/ChoroplethMap.vue";
// import YearSlider from './components/YearSlider.vue';
import ControlPlane from './components/ControlPlane.vue';
import Scatterplot from "./components/Scatterplot.vue";
import LineChart1 from "./components/LineChart1.vue";
// import LineChart2 from "./components/LineChart2.vue";

export default {
  name: "App",
  components: {
    Scatterplot,
    ChoroplethMap,
    LineChart1,
    // LineChart2,
    ControlPlane
  },
  mounted() {
    this.$store.dispatch("loadData");
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

/* text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
} */

#hide-screen {
  /* display: none; */
}
</style>
