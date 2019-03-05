# DataVisualization
Visualize the data using D3 heatmaps.

To develop or view open a local host server:
python -m http.server

Tasks:
Use the dataset provided in heatmap.csv that describes the number and type of crimes in each of the 5 boroughs of New York City. Visualize the data using D3 heatmaps.

1. Create a file named heatmap.html. Within this file, create a heatmap of the number of crimes for each crime type that occured in each borough for the year 2011. Place the crime type on the heatmap's horizontal axis and the name of the borough on its vertical axis. 

2. The color scheme of a heatmap is a very important part of its design. The number of crimes for each borough should be represented by colors in the heatmap. Pick a meaningful color scheme (hint: color gradients) with 9 color gradations for the heatmap.

3. Add axis labels and a legend to the chart. Place the name of the boroughs ("Manhattan", "Brooklyn", "Queens", etc.) on the vertical axis in alphabetical order (i.e. top → bottom: A → Z). Place the crime type ("Murder", "Assault", "Shooting", etc.) on the horizontal axis also in alphabetical order (i.e. left → right: A → Z).

4. Create a drop down select box with D3 that is populated with the years (2011, 2012, 2013, 2014, 2015). When the user selects a different year in this select box, the heatmap and the legend should both be updated with values corresponding to the selected year
