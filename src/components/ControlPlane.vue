<template>
  <div>
    <div class="mt-2">
      Selected Date: {{ this.timeFormat(this.dateParser(selectedDate)) }}
    </div>
    <div class="mt-2">
      Selected Countries:{{selectedCountries}}
    </div>
    <button v-on:click="reset(this)">Reset</button>
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

      d3.selectAll(`.scatterplot`).attr("stroke", null);
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
</style>
