<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup">
        <g class="rects-group" ref="rects"></g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import mapWorld from "@/assets/world.json";

export default {
  name: "ChoroplethMap",
  props: {},
  data() {
    return {
      colors: [
        "#b3b2b2",
        "#e4acac",
        "#c85a5a",
        "#b0d5df",
        "#907881",
        "#985356",
        "#64acbe",
        "#627f8c",
        "#574249",
      ],
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 100,
      },

      n: 3,
      k: 30,
    };
  },
  mounted() {
    this.drawMap();
    this.drawLegend();
  },
  methods: {
    drawMap() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

      let projection = d3
        .geoMercator()
        .scale(100)
        .center([0, 20])
        .translate([this.innerWidth / 2, this.innerHeight / 2]);

      let path = d3.geoPath().projection(projection);

      let data = this.data;

      // let labels = ["low", "medium", "high"]

      d3.selectAll("title").remove();

      this.svg
        .selectAll("path")
        .data(mapWorld.features)
        .join("path")
        .attr("d", path)
        .attr("class", (d) => d.id)
        .attr("fill", (d) => {
          return this.color(data.get(d.id));
        })
        .append("title")
        .text((d) => {
          return `${d.id}, ${data.get(d.id)}`;
        })
        .raise()
        ;

      this.initializeZoom();
    },

    initializeZoom() {
      // this.svg
      //   .append("rect")
      //   .attr("class", "zoom")
      //   .attr("width", this.innerWidth)
      //   .attr("height", this.innerHeight)
        this.svg.call(
          d3
            .zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) =>
              d3
                .select(this.$refs.chartGroup)
                .attr("transform", event.transform)
            )
        );
    },

    drawLegend() {
      // d3.select(this.$refs.chartGroup)
      //   .append(legend)
      //   .attr("transform", "translate(95,510)");

      d3.select(this.$refs.rects)
        .append("text")
        .attr("font-weight", "bold")
        .attr("dy", "0.71em")
        .attr("transform", `rotate(90)`)
        .attr("text-anchor", "middle")
        .text("sdfsdf");

      d3.select(this.$refs.rects)
        .append("text")
        .attr("font-weight", "bold")
        .attr("dy", "3.4em")
        .attr("text-anchor", "middle")
        .text("sdfsdf");

      d3.select(this.$refs.rects)
        .attr("transform", "translate(20,400)")

        .selectAll("rect")
        .data(this.rectangularProps)
        .enter()
        .append("rect")
        .attr("x", (d) => d.x)
        .attr("width", (d) => d.width)
        .attr("y", (d) => d.y)
        .attr("height", (d) => d.height)
        .attr("fill", (d) => d.fill);
    },
  },
  computed: {
    data: {
      get() {
        return this.$store.getters.choroplethMapData;
      },
    },
    svg() {
      return d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left} ,${this.svgPadding.top})`
        );
    },
    innerHeight() {
      return this.svgHeight - this.svgPadding.top - this.svgPadding.bottom;
    },
    innerWidth() {
      return this.svgWidth - this.svgPadding.left - this.svgPadding.right;
    },
    x() {
      return d3.scaleQuantile(
        Array.from(this.data.values(), (d) => d[0]),
        d3.range(this.n)
      );
    },

    y() {
      return d3.scaleQuantile(
        Array.from(this.data.values(), (d) => d[1]),
        d3.range(this.n)
      );
    },
    rectangularProps() {
      let rectData = [];
      let plotAreaWidth = 40;
      let plotAreaHeight = 40;

      //Calculating properties for the rectangles
      d3.cross(d3.range(this.n), d3.range(this.n)).map(([i, j]) => {
        rectData.push({
          width: plotAreaWidth / 3,
          height: plotAreaHeight / 3,
          x: i * (plotAreaWidth / 3),
          y: (this.n - 1 - j) * (plotAreaHeight / 3),
          x1: i * (plotAreaWidth / 3) + plotAreaWidth / 3,
          y1: (this.n - 1 - j) * (plotAreaHeight / 3) + plotAreaHeight / 3,
          fill: this.colors[j * this.n + i],
        });
      });
      return rectData;
    },
    color() {
      return (value) => {
        if (!value) return "#001";
        let [a, b] = value;
        return this.colors[this.y(b) + this.x(a) * this.n];
      };
    },
  },

  watch: {
    data: {
      handler() {
        this.drawMap();
      },
      deep: true,
    },
  },
};
</script>

<style >
.zoom {
  fill: none;
  pointer-events: all;
}
</style>
