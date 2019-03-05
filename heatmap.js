function heatmap()
{
	//setting globals attributes
	var margin = {top: 40, right:150, bottom:80, left:150},
	width  = 700 - margin.left - margin.right,
	height = 500 - margin.top  - margin.bottom;

	//default
	var selectValue = '2011'

	//color gradient
	colors = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']

	//create svg element
	var svg = d3.select('#heatmap')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top +')')

	//load csv
	d3.csv('heatmap.csv')
	  .then(function(data){
	  	console.log('Loaded heatmap csv');
		console.log(data[0])

		//Lables of row and columns
		var borough   = (['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island']).sort().reverse()
		var crimeType = (d3.map(data, function(d){ return d['Crime Type']}).keys()).sort()
		var years     = (d3.map(data, function(d){ return d['Year']}).keys()).sort()

		console.log(years)

		//Build X scale and axis
		var x = d3.scaleBand()
				  .range([0, width])
				  .domain(crimeType)
				  .padding(0.05)
			   svg.append('g')
			   	  .attr('transform', 'translate(0,' + height+ ')')
			   	  .call(d3.axisBottom(x).tickSize(0))
			   	  .select('.domain').remove()
			   svg.append('text')
		   		  .attr('text-anchor', 'end')
		   		  .attr('x', width + 50)
		   		  .attr('y', height+ 20)
		   		  .text('Crime Type')
		   		  .attr("font-size", "11px")
		   		  .attr('font-weight', 'bold')

		//Build Y scale and axis
		var y = d3.scaleBand()
				  .range([height, 0])
				  .domain(borough)
				  .padding(0.05)
			   svg.append('g')
			   	  .call(d3.axisLeft(y).tickSize(0))
			   	  .select('.domain').remove()
			   svg.append('text')
		   		  .attr('text-anchor', 'end')
		   		  .attr('x', 0)
		   		  .attr('y', 0)
		   		  .text('Boroughs')
		   		  .attr("font-size", "11px")
		   		  .attr('font-weight', 'bold')

		//create a drop down menu
		var select = d3.select('#dropdown')
					   .append('select')
					   .attr('class', 'option-select')
					   .attr('transform', 'translate(' + margin.left + ',' + margin.top +')')
					   .on('change', onchange)

		var options = select.selectAll('option')
							.data(years).enter()
							.append('option')
							.text(function(d){ return d;})

		function onchange(){
			selectValue = d3.select('select').property('value')

			drawHeatMap(selectValue)
		}

		var drawHeatMap = function(selectValue)
		{
			//Get crime for the selected year
			var crimePerYear = [];
			data.forEach(function (d){
				borough.forEach(function (b){
					if(d.Year == selectValue)
						crimePerYear.push([d['Crime Type'],  b, +d[b]]);
				})	
			})	

			
			//Build color scale
			crimePerYear.sort(function(a,b){ return d3.ascending(a[2], b[2])})
			var dz = Math.floor(crimePerYear.length/9)
			var cz   = dz
			var zthreshold = [0]
			for(var i=0; i<8; i++){ //Data into 9 buckets
				zthreshold.push(crimePerYear[cz][2])
				cz+=dz;
			}

			var z = d3.scaleLinear() //Update color scale Threshold
				  .domain(zthreshold)
				  .range(colors)

			//Add the squares
			var heatmap = svg.selectAll('.heatmap')
			   .data(crimePerYear)

			heatmap.exit().remove()


			heatmap.enter().append('rect')
			   	.attr('x', function(d) {return x(d[0])})
			   	.attr('y', function(d) {return y(d[1])})
			   	.attr('rx', 4)
			   	.attr('ry', 4)
			   	.attr('width', x.bandwidth())
			   	.attr('height', y.bandwidth())
			   	.style('stroke-width', 4)
			   	.style('stroke', 'none')
			   	.style('opacity', 0.8)
			   	.style('fill', colors[0])
			   	.transition().duration(10) //draw the colors
			   	.style('fill', function (d) {return z(d[2])})

			//Add legend
			var legend = svg.selectAll('.legend')
							.data(z.domain())

			legend.exit().remove()

			legendvalue = legend.enter()
				  .append('g')
				  .attr('class', 'legend')
				  .attr('transform', function(d,i){ return 'translate(' + (width+50) + ',' + (4+i*15) + ')'})

			legendvalue.append('rect')
				  .attr('width', 50)
				  .attr('height', 20)

			legendvalue.append('text')
				 .attr('class', 'summary')
				  .attr('x', 52)
				  .attr('y', -7)
				  .attr('dy', '1.35em')
				  .attr('text-anchor', 'left')
		    	  .attr('font-size', '10px')

			legend = legendvalue.merge(legend)
			legend.select('rect')
				  .style('fill', z)
			legend.select('text')
				  .text(String)


		}

		//default call
		drawHeatMap(selectValue)

		svg.append('text')
			   .attr('x', width+115)
			   .attr('y', -4)
			   .attr('dy', '.35em')
			   .attr('text-anchor', 'end')
		       .attr('font-size', '10px')
			   .text('No. of Crimes')
	  })
	  .catch(function(error){console.log("error")});

	//Add title
	var title = d3.select('#title')
				  .append('text')
				  .attr('transform', 'translate(' + margin.left + ',' + margin.top +')')
				  .attr('text-anchor', 'left')
				  .style('font-size', '18px')
				  .text('Visualizing Crimes in New York City')

}