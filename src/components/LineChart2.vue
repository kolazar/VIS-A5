<template>
  <div class="vis-component" ref="chart">
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup"></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "LineChart2",
  props: {},
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 100,
        bottom: 50,
        left: 50,
      },
      circleRadius: 5,
    };
  },
   mounted() {
    this.drawAllCountriesLine();
  },
  methods: {
    drawAllCountriesLine() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;

 

      this.svg.selectAll("path").remove();

this.drawXAxis();
      this.drawYAxisAllCountries();
      this.drawVoronoiAllCountries(
        this.groupByMonthYearAllCountries
      );
      this.svg
        .append("g")

        .append("path")
        .datum(this.groupByMonthYearAllCountries)
        .attr("class", "line2-all-countries")
        .attr("id", "stringency-index")

        .attr("fill", "none")
        .attr("stroke", "#062f5c")
        .attr("stroke-width", 2.5)
        .attr("stroke-linecap", "round")
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => this.y(d[1]))
            .curve(d3.curveLinear)
        );

      

      let totalLength = d3.select(`#stringency-index`).node().getTotalLength();


      d3.select(`#stringency-index`)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

     

     
    },

    drawXAxis() {
      this.svg.select(".lines-axes").remove();
      this.svg.select(".line2-axis-x").remove();

      this.svg.append('g').attr('class', 'lines-axes')

      this.svg.select(".lines-axes")
        .append("g")
        .attr("class", "line2-axis-x")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(d3.axisBottom(this.x).tickSize(-this.innerHeight).tickSizeOuter(6));
    },

    drawYAxisAllCountries() {
      this.svg.select(".line2-axis-y-all").remove();
     this.svg.select(".line2-axis-y-specific").remove();

      this.svg.select(".lines-axes")
        .append("g")
        .attr("class", "line2-axis-y-all")
        .call(d3.axisLeft(this.y).tickSize(-this.innerWidth).tickSizeOuter(6))
        .raise()
        .append("text")
        .attr('class','lines-axes-text')
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Stringency Index");
    },

    drawOneCountryLine() {
      d3.selectAll(".line2-all-countries").remove();

      this.svg
        .append("path")
        .datum(this.groupByMonthYearSpecificCountry)
        .attr("fill", "none")
        .attr("stroke", "#78a4d3")
        .attr("stroke-width", 1.5)
        .attr("class", (d) => {
          return `path-${d[1][1]}-stringency`;
        })
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.x(this.dateParser(d[0])))
            .y((d) => {
              return this.yGroupByMonthYearCountryAllCountries(
                d[2] 
              );
            })
            .curve(d3.curveLinear)
        );

     
      let totalLength = d3
        .select(`.path-${this.countryToAdd}-stringency`)
        .node()
        .getTotalLength();

      this.svg.selectAll("path").attr("id", "not-active");

      d3.select(`.path-${this.countryToAdd}-stringency`)
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("id", "active")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);


      this.drawYAxisSpecificCountry();

      this.drawVoronoi(this.groupVoronoiData);
    },

    drawYAxisSpecificCountry() {



         this.svg.select('.line2-axis-y-all')
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.yGroupByMonthYearCountryAllCountries).tickSize(-this.innerWidth).tickSizeOuter(6))
     
    },

    deleteOneCountryLine() {
     this.svg.select(`.path-${this.countryToDelete}-stringency`).remove();
      this.deleteVoronoi();
      this.drawVoronoi(this.groupVoronoiData);

      if (!this.selectedCountries.length) {
        this.drawAllCountriesLine();
        this.drawYAxisAllCountries();
      }
    },
    deleteVoronoi() {
      this.svg.select(".voronoi").remove();
    },

    drawVoronoiAllCountries(data) {
      this.deleteVoronoi();


      let points = data.map((d) => {
        return [this.x(this.dateParser(d[0])), this.y(d[1])];
      });



      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([0, 0, this.innerWidth, this.innerHeight]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return (
          voronoiGroup
            .append("path")
            // .attr("stroke", "pink")
            .on("mouseover", () =>
              this.onHoverVoronoiAllCountries(data[i])
            )
            .on("click", () =>
              this.mouseClick(this.groupByMonthYearAllCountries)
            )
            .attr(
              "d",

              voronoi.renderCell(i)
            )
        );
      });
    },

    onHoverVoronoiAllCountries(data) {
      this.svg.selectAll("path").attr("id", "not-active");
     this.svg.selectAll(".voronoi g").remove();

      
       this.createTooltip(data[0], data[1], undefined, true);
      
    },

    drawVoronoi(data) {
      this.deleteVoronoi();

     

      let points = data.map((d) => {
        return [
          this.x(this.dateParser(d[0])),
          this.yGroupByMonthYearCountryAllCountries(d[3] ),
        ];
      });

      let delaunay = d3.Delaunay.from(points);
      let voronoi = delaunay.voronoi([0, 0, this.innerWidth, this.innerHeight]);

      let voronoiGroup = this.svg.append("g").attr("class", "voronoi");

      points.map((point, i) => {
        return voronoiGroup
          .append("path")
          .on("mouseover", () => this.onHoverVoronoi(data[i]))
          .on("click", () =>
            this.mouseClick(this.groupByMonthYearAllCountries)
          )
          .attr(
            "d",

            voronoi.renderCell(i)
          );
      });
    },

    onHoverVoronoi(data) {
      this.svg.selectAll("path").attr("id", "not-active");
      this.svg.selectAll(".voronoi g").remove();

      d3.select(`.path-${data[1]}-stringency`).attr("id", "active");

      

this.createTooltip(
        data[0],
      data[3],
        data[2]
      );


    },

 createTooltip(date, value, countryName, allCountries) {
      let lineChartTooltip = this.svg
        .select(".voronoi")
        .append("g")
        .attr(
          "transform",
          `translate(${this.x(this.dateParser(date))},
          ${
            !allCountries
              ? this.yGroupByMonthYearCountryAllCountries(
                  value >= 1 ? value : value + this.epsilon
                )
              : this.y(value >= 1 ? value : value + this.epsilon)
          })`
        );

      lineChartTooltip.append("circle").attr("r", this.circleRadius);

      if (countryName !== undefined) countryName = countryName + ", ";
      else countryName = "";

      this.createTooltipText(
        lineChartTooltip,
        "tooltip-text tooltip-text-stroke",
        date,
        countryName,
        value
      );
      this.createTooltipText(
        lineChartTooltip,
        "tooltip-text",
        date,
        countryName,
        value
      );

    },
    createTooltipText(tooltip, className, date, countryName, value) {
      tooltip
        .append("text")
        .attr("class", className)
        .attr("x", -10)
        .attr("y", -10)
        .text(
          `${this.timeFormat(this.dateParser(date))},${countryName}` +
            `Total: ` +
            `${this.formatValue(value)} `
        )
        .raise();

        
      if (+date.split("/")[0] < 4 && +date.split("/")[1] === 2020)
        tooltip
          .selectAll(".tooltip-text")
          .attr("id", "tooltip-text-start");

      if (+date.split("/")[0] > 8 && +date.split("/")[1] === 2021)
        tooltip
          .selectAll(".tooltip-text")
          .attr("id", "tooltip-text-end");
    },



    mouseClick(data) {
      let x0 = this.x.invert(d3.pointer(event)[0]),
        bisectDate = d3.bisector((d) => this.dateParser(d[0])).left,
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - this.dateParser(d0[0]) > this.dateParser(d1[0]) - x0 ? d1 : d0;

       
      

      this.$store.commit("changeSelectedDate", d[0]);
   if(this.selectedCountries.length!==0)
       d3.selectAll(`.scatterplot`).attr("id", "not-active-dot");
       
    },
  },

  computed: {
    data: {
      get() {
        return this.$store.getters.lineChartData;
      },
    },
    lineSpecificCountryData: {
      get() {
        return this.$store.getters.lineSpecificCountryData;
      },
    },

    selectedCountries: {
      get() {
        return this.$store.getters.selectedCountries;
      },
    },
    countryToAdd: {
      get() {
        return this.$store.getters.countryToAdd;
      },
    },
    countryToDelete: {
      get() {
        return this.$store.getters.countryToDelete;
      },
    },
    voronoiData: {
      get() {
        return this.$store.getters.voronoiData;
      },
    },
    

    groupByMonthYearAllCountries() {
      return d3.flatRollup(
        this.data,
        (v) =>
          d3.mean(v, (d) => {
            if (typeof d.stringencyIndex !== "undefined")
              return d.stringencyIndex;
          }),
        (d) => d.monthYear
      );
    },

     groupByMonthYearSpecificCountry() {
      
      return d3.flatRollup(
        this.lineSpecificCountryData,
       (v) =>
          d3.mean(v, (d) => {
            if (typeof d.stringencyIndex !== "undefined")
              return d.stringencyIndex;
          }),
        (d) => d.monthYear,
        (d) => d.isoCode
      );
    },
    groupByMonthYearCountry() {

      return d3.flatRollup(
        this.data,
        (v) =>
          d3.mean(v, (d) => {
            if (typeof d.stringencyIndex !== "undefined")
              return d.stringencyIndex;
          }),
        (d) => d.monthYear,
        (d) => d.isoCode
      );
    },

     groupVoronoiData(){
 
     return d3.flatRollup(
        this.voronoiData,
       (v) =>
          d3.mean(v, (d) => {
            if (typeof d.stringencyIndex !== "undefined")
              return d.stringencyIndex;
          }),
        (d) => d.monthYear,
        (d) => d.isoCode,
        (d) => d.countryName
      );
    },

 innerHeight() {
      return this.svgHeight - this.svgPadding.top - this.svgPadding.bottom;
    },
    innerWidth() {
      

      return this.svgWidth - this.svgPadding.left - this.svgPadding.right;
    },
    svg() {
      return d3
        .select(this.$refs.chartGroup)
        .attr(
          "transform",
          `translate(${this.svgPadding.left} ,${this.svgPadding.top})`
        );
    },

    x() {
      return d3
        .scaleTime()
        .domain(
          d3.extent(this.groupByMonthYearAllCountries, (d) =>
            this.dateParser(d[0])
          )
        )
        .range([0, this.innerWidth]);
    },

    y() {
      return d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.groupByMonthYearAllCountries, (d) =>
            d[1]
          ),
        ])
        .range([this.innerHeight, 0])
        .nice();
    },
    yGroupByMonthYearCountryAllCountries() {
      return d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.groupByMonthYearCountry, (d) =>
            d[2]
          ),
        ])
        .range([this.innerHeight, 0])
        .nice();
    },

    dateParser() {
      return d3.timeParse("%m/%Y");
    },
    formatValue() {
      return d3.format(",.0f");
    },
     timeFormat() {
      return d3.timeFormat("%B %Y");
    },


  },

  watch: {
    data: {
      handler() {
        this.drawAllCountriesLine();
      },
      deep: true,
    },
    
    countryToAdd: {
      handler() {
        if (this.countryToAdd !== "") {
          this.drawOneCountryLine();
        }
      },
      deep: true,
    },
    countryToDelete: {
      handler() {
        if (this.countryToDelete !== "") {
          this.deleteOneCountryLine();
        }
      },
      deep: true,
    },
    selectedCountries: {
      handler() {
        if (this.selectedCountries.length === 0) this.drawAllCountriesLine();
      },
    },
    deep: true,
  },
};
</script>

<style>

#active {
  stroke: #062f5c;
  stroke-width: 2.5;
}

/* circle {
  cursor: pointer;
} */

.voronoi path {
  fill: none;
  pointer-events: all;
}

</style>
