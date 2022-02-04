<template>
  <div>
    <div class="mt-2">
      <p>
        Selected Date:
        <b>{{ this.timeFormat(this.dateParser(selectedDate)) }}</b>
      </p>
    </div>
    <div class="mt-2">
      <p>
        Selected Countries:<b>{{
          selectedCountriesNames.length === 0
            ? " no countries selected"
            : selectedCountriesNames.join(", ")
        }}</b>
      </p>
    </div>
    <div class="mt-2">
      <button v-on:click="reset(this)">Reset</button>
    </div>
    <div class="mt-2"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "ControlPlane",
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {
    reset() {
      this.$store.commit("reset");

      for (let index = 0; index < this.data.length; index++) {
        d3.selectAll(`.${this.data[index].isoCode}`).attr("stroke", null);
      }

      d3.selectAll(`.scatterplot`).attr("id", null);
      d3.select(".map")
        .selectAll("path")
        .attr("id", null)
        .attr("stroke", null)
        .attr("stroke-width", null);
    },
  },
  computed: {
    data: {
      get() {
        return this.$store.getters.scatterPlotData;
      },
    },
    selectedDate: {
      get() {
        return this.$store.getters.selectedDate;
      },
    },

    selectedCountries: {
      get() {
        return this.$store.getters.selectedCountries;
      },
    },
    selectedCountriesNames() {
      let result = [];

      this.selectedCountries.forEach((element) => {
        this.data.forEach((element1) => {
          if (element === element1.isoCode) result.push(element1.countryName);
        });
      });
      return result;
    },

    dateParser() {
      return d3.timeParse("%m/%Y");
    },
    timeFormat() {
      return d3.timeFormat("%B %Y");
    },
  },
  watch: {
    selectedDate: {
      handler() {},

      deep: true,
    },
  },
};
</script>




<style scoped>
button {
  position: relative;
  background-color: #7a7a7a;
  border: none;
  font-size: 20px;
  color: #ffffff;
  padding: 10px;
  width: 100px;
  text-align: center;
  transition-duration: 0.4s;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
}

button:after {
  content: "";
  background: #f1f1f1;
  display: block;
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
  transition: all 0.8s;
}

button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s;
}
</style>
