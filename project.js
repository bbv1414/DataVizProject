var svg;
var gauge;

var width;
var height;
var innerW;
var innerH;
var margin = { top: 50, right: 30, bottom: 20, left: 30 };

var geoData;
var happyData;

document.addEventListener('DOMContentLoaded', function() {
    svg = d3.select('#svg');
    width = +svg.style('width').replace('px','');
    height = +svg.style('height').replace('px','');;
    innerW = width - margin.left - margin.right;
    innerH = height - margin.top - margin.bottom;

    // Load both files before doing anything else
    Promise.all([d3.json('data/countries.geo.json'), 
              d3.json('data/world-countries.json')])
          .then(function(values){
    
    geoData = values[0];
    happyData = values[1];
   
    drawMap();
    drawGauge();
    drawSpider();
  })
})

function drawMap() {

    svg.selectAll("*").remove();
    // create the map projection and geoPath
    let projection = d3.geoMercator()
                        .scale(150)
                        .center(d3.geoCentroid(geoData))
                        .translate([+svg.style('width').replace('px','')/1.75,
                                    +svg.style('height').replace('px','')/2.2]);
    let path = d3.geoPath()
                 .projection(projection);

    let g = svg.append('g');
    g.selectAll('path')
    .data(geoData.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill', "blue")
    // .style('fill', function() {
    //     var x = Math.random()
    //     if(x > 0 && x < .2) {
    //         return "black"
    //     }
    //     else if(x > .2 && x < .4){
    //         return "orange"
    //     }
    //     else if(x > .4 && x < .6){
    //         return "green"
    //     }
    //     else if(x > .6 && x < .8){
    //         return "red"
    //     }
    //     else {
    //         return "blue"
    //     }
    // })
    .style('stroke', 'black')
    .style('stroke-width', "1")
    .on('mouseover', function(d,i) {
      console.log('mouseover on ' + d.properties.name)
      tooltip
        .style('visibility', 'visible')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 'px')
        .html("Country: " + d.properties.name  + "</br>" + "Happiness Index: " + "</br>" + "Year: ")
      d3.select(this).style('stroke-width', 4)
      d3.select(this).style('stroke', 'red');
    })
    .on('mousemove',function(d,i) {
      console.log('mousemove on ' + d.properties.name);
    })
    .on('mouseout', function(d,i) {
      console.log('mouseout on ' + d.properties.name);
      tooltip.style('visibility' , 'hidden')
      d3.select(this).style('stroke-width', 1)
      d3.select(this).style('stroke', 'black');
    });
}

function drawGauge()
{
  gauge = d3.select('#gauge')

  arc = d3.arc()
  .innerRadius(100)
  .outerRadius(185)
  .startAngle(-1.55)
  .endAngle(1.55)

  const defs = gauge.append("defs");
  const linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");
 
  var colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 200]); //get our scale of colors given max GDP
  //var axisScale = d3.scaleLinear().domain(colorScale.domain()).range([0, 200]);

  linearGradient.selectAll("stop") //Create the gradient
     .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
     .enter().append("stop")
     .attr("offset", d => d.offset)
     .attr("stop-color", d => d.color)

     gauge.append('path')// Create the rectangle and apply gradient to it
     .attr('transform', `translate(500, 300)`)
     .attr('d', arc)
     .style("fill", "url(#linear-gradient)");

     gauge.append('line')
     .attr('x1', 500)
     .attr('y1', 300)
     .attr('x2', 300)
     .attr('y2', 100)
}

function drawSpider(){
    
    
}
