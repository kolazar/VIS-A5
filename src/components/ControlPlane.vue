<template>
  <div>
    
    <div class="mt-2">Selected Year: {{ selectedYear }}</div>
    <!-- <button >Reset</button> -->
  </div>
</template>

<script>
export default {
  name: 'ControlPlane',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    selectedYear: {
      get() {
        return this.$store.getters.selectedYear;
      },
      set(val) {
        this.$store.commit('changeSelectedYear', val);
      },
      selectedMonth: {
      get() {
        return this.$store.getters.selectedYear;
      },
      set(val) {
        this.$store.commit('changeSelectedYear', val);
      },
    },
  },
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
