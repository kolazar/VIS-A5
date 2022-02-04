<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <h1>COVID-19 Dashboard</h1>
        </div>
      </div>

      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <h3 class="loading-message">Loading data...</h3>

      <div id="hide-screen" class="col-md-12" style="display: none">
        <div class="col-md-4 offset-4">
          <div class="note">
            <p><b>How to use?</b></p>
            <p>
              Hover on map legend, press/hover on a country, press/hover on any
              line chart, press/hover on a dot on a scatter plot graph.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <ControlPlane />
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <ChoroplethMap />
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <LineChart1 />
          </div>
          <div class="col-md-4">
            <Scatterplot />
          </div>

          <div class="col-md-4">
            <LineChart2 />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChoroplethMap from "./components/ChoroplethMap.vue";
import ControlPlane from "./components/ControlPlane.vue";
import Scatterplot from "./components/Scatterplot.vue";
import LineChart1 from "./components/LineChart1.vue";
import LineChart2 from "./components/LineChart2.vue";

export default {
  name: "App",
  components: {
    Scatterplot,
    ChoroplethMap,
    LineChart1,
    LineChart2,
    ControlPlane,
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

text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
p {
  font-size: 18px;
}

.lines-axes text {
  fill: #635f5d;
}

.lines-axes .lines-axes-text {
  font-size: 12px;
}

.tooltip-text {
  text-anchor: middle;
  font-size: 16px;
  fill: #635f5d;
}

.tooltip-text-stroke {
  stroke: white;
  stroke-width: 4px;
}
#tooltip-text-start {
  text-anchor: start;
}
#tooltip-text-end {
  text-anchor: end;
}

.lines-axes line {
  stroke: #e5e2e0;
}

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(0, 39, 58);
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

div.note {
  background-color: #f0f7fb;
  border-left: solid 4px #3498db;
  line-height: 18px;
  mc-auto-number-format: "{b}Note: {/b}";
  overflow: hidden;
  padding: 12px;
}
</style>
