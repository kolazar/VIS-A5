# vis-vue-d3

## Mykola Lazarenko. Assignment 5

### Steps




1. Cloned the provided boilerplate code and run it.
2. Created a choropleth map and filled each state's polygon on the map with a color representing the personal income vs. educational attainment rate in that state. Overall, there are 9 colors each representing a range from (low personal income, low educational rate) to (high personal income, high educational rate).
3. Created a scatter plot with the x-axis displaying the educational attainment rate (bachelor's degree or higher) in a state, and y-axis displaying the average personal yearly income in a state. 
4. Created the background of the scatter plot in the form of 9 rectangles. Each rectangle is filled with the color representing the same range as the colors on the map.
5. Created the labeled axes and scales.
6. Implemented interactive changes of the data displayed on the map and the plot when the year changes by the year slider.
7. Implemented showing a tooltip on mouseover on a particular point in the plot.
8. Implemented brushing on the plot. Only the states corresponding to the data points which are selected by the brushed rectangle are shown on the map. All the other states are grayed out. 
9. Implemented deactivation of the brush selection by clicking an empty area inside the scatter plot.
10. Implemented highlighting of a particular data point on the plot when clicking on a state on the map.
11. Implemented deactivation of data points highlight when clicking outside the map.
12. Added a title summarizing the visualization.

### Challenges occured during the implementation




- represent the colors correctly (matching the range from low-low to high-high) both on the scatter plot and on the map; 
- draw the background of the scatter plot. For this, I needed to recall how the coordinate system is represented in SVG as well to compute the necessary coordinates;

### Sidenotes



- I chose the color scheme such as it can be understood by the end-user and taking into consideration possible defects in color recognition. Thus, colors were chosen neutral and going from light (representing low-low relationship) to darker (high-high relationship);
- the hihglhighting of the point is done by changing the point stroke. Thus, it brings end-user attention without distrating it too much;
- I decided to do scales not starting from zero to have a better representation of the data points on the scatterplot.

### References
- Boiler plate code: https://github.com/asilcetin/vis-vue-d3;
- https://www.d3-graph-gallery.com/graph/choropleth_basic.html


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



