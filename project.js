var svg;
var gauge;

var width;
var height;
var innerW;
var innerH;
var margin = { top: 50, right: 30, bottom: 20, left: 30 };

var geoData;
var happyData;
let data = [];
let labelsForSpider = ["Economy", "Social Support", "Health", "Freedom", "Trust in Government", "Generosity"];
let features = ["economy", "social_support", "health", "freedom", "trust", "generosity"]

var currentCountry = "Canada"

let svgS = d3.select("#spider").append("svg")




let radialScale = d3.scaleLinear()
  .domain([0,10]) //domain for the data values 
  .range([0,250]);


document.addEventListener('DOMContentLoaded', function() {
    svg = d3.select('#svg');
    width = +svg.style('width').replace('px','');
    height = +svg.style('height').replace('px','');;
    innerW = width - margin.left - margin.right;
    innerH = height - margin.top - margin.bottom;

    // Load both files before doing anything else
    Promise.all([d3.json('data/countries.geo.json'), 
              d3.json('data/world-countries.json'), 
              d3.json('data/happiness_data.json')])
          .then(function(values){
    

    
    geoData = values[1];
    happyData = values[2];
   
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
    
    var tooltip = d3.select("body")
      .append("div")
      .attr('class', 'tooltip');

    let g = svg.append('g');
    g.selectAll('path')
    .data(geoData.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill', "yellow")
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
    .on('mousedown', function(d,i){
      currentCountry = d.properties.name;
      svgS.remove()
      drawSpider();
      console.log(d.properties.name)
    })
    .on('mouseover', function(d,i) {
      //console.log('mouseover on ' + d.properties.name)
      // tooltip
      //   .style('visibility', 'visible')
      //   .style('left', d3.event.pageX + 'px')
      //   .style('top', d3.event.pageY + 'px')
      //   .html("Country: " + d.properties.name  + "</br>" + "Happiness Index: " + "</br>" + "Year: ")
      d3.select(this).style('stroke-width', 2)
      d3.select(this).style('stroke', 'black');
      var display = "('2015', '"+d.properties.name.toString()+"')";
      d3.select(this).transition()
                .style("stroke", "black")
                .attr("stroke-width", 4);
      tooltip.style("visibility", "visible")
      .html("Country: " + d.properties.name  + "</br>" + "Happiness Rank: " + happyData[display.toString()].rank + "</br>" + "Year: 2015")
    })
    .on('mousemove',function(d,i) {
      return tooltip.style("top",
    (d3.event.pageY-20)+"px").style("left",(d3.event.pageX+20)+"px");
    })
    .on('mouseout', function(d,i) {
      //console.log('mouseout on ' + d.properties.name);
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
    
     gauge.append('rect')
     .attr('width', 2)
     .attr('height', 85)
     .attr('x', 540)
     .attr('y', -324)
     .attr('transform', 'rotate(45)')

     gauge.append('rect')
     .attr('width', 2)
     .attr('height', 85)
     .attr('x', 165)
     .attr('y', 384)
     .attr('transform', 'rotate(-45)')

     gauge.append('image')
     .attr('width', 75)
     .attr('height', 75)
     .attr('x', 590)
     .attr('y', 200)
     .attr('href', 'data/Excited-Smiley-Face.svg')
     .attr('opacity', '1')
    
     gauge.append('image')
     .attr('width', 75)
     .attr('height', 75)
     .attr('x', 462)
     .attr('y', 120)
     .attr('href', 'data/Neutral-Smiley-Face.svg')
     .attr('opacity', '1')

     gauge.append('image')
     .attr('width', 75)
     .attr('height', 75)
     .attr('x', 333)
     .attr('y', 205)
     .attr('href', 'data/Upset-Face.svg')
     .attr('opacity', '1')

     gauge.append('image')
     .attr('width', 250)
     .attr('height', 250)
     .attr('x', 375)
     .attr('y', 160)
     .attr('href', 'data/arrow_direction_blue_48.svg')
     .attr('opacity', '1')
}




function drawSpider(){
    
  svgS = d3.select("#spider").append("svg")

  let data = [];

  let color = d3.scaleOrdinal(d3.schemeCategory10) //creates the color gradients for the data

  var point = {}
  entry = "('2015', '" + currentCountry + "')"
  console.log(entry)
  for (const [key, value] of Object.entries(happyData[entry])) {
    point[key] = value
  }
  data.push(point);

  //console.log(data)

  let ticks = [1,2,3,4,5,6,7,8,9,10]; //how many cirlce values we want

  ticks.forEach(t =>
    svgS.append("circle")
    .attr("cx", 500)
    .attr("cy", 325)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", radialScale(t)));
    //makes the actual circles


  ticks.forEach(t =>
    svgS.append("text")
    .attr("x", 500)
    .attr("y", 325 - radialScale(t))
    .text(t.toString())
    ); //adds the numbers 

    for(var x = 0; x < features.length; x++){
      let label = labelsForSpider[x];
      let angle = (Math.PI / 2) + (2 * Math.PI * x / features.length);
      let linep = (Math.cos(angle) * radialScale(10)) + 500 ;
      let liney = 325 - (Math.sin(angle) * radialScale(10));
      let labelp = (Math.cos(angle) * radialScale(10.5)) + 500;
      let labely = 325 - (Math.sin(angle) * radialScale(10.5));

      svgS.append("line")
      .attr("x1", 500)
      .attr("y1", 325)
      .attr("x2", linep)
      .attr("y2", liney)
      .attr("stroke", "black");

      svgS.append("text")
      .attr("x", labelp)
      .attr("y", labely)
      .text(label);

    }

    let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);

    
    //console.log(happyData["('2015', 'Afghanistan')"])

    for(var t = 0; t < data.length; t++){
      let d = data[t];
     // let colors = color[t];
      let cord = getPath(d);

      

      svgS.append("path")
      .data(data)
      .datum(cord)
      .attr("d", line)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .attr("fill", "black")
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);
      // .on('mouseover', function(d,i) {
      //   //console.log('mouseover on ' + d.properties.name)
      //   tooltip
      //     .style('visibility', 'visible')
      //     .style('left', d3.event.pageX + 'px')
      //     .style('top', d3.event.pageY + 'px')
      //     .html("Country: " + d.properties.name  + "</br>" + "Happiness Index: " + "</br>" + "Year: ")
      //   d3.select(this).style('stroke-width', 4)
      //   d3.select(this).style('stroke', 'red');
      // })
      // .on('mousemove',function(d,i) {
      //   //console.log('mousemove on ' + d.properties.name);
      // })
      // .on('mouseout', function(d,i) {
      //   //console.log('mouseout on ' + d.properties.name);
      //   tooltip.style('visibility' , 'hidden')
      //   d3.select(this).style('stroke-width', 1)
      //   d3.select(this).style('stroke', 'black');
      // });
    }



}


function angles(an, point){
  let x = Math.cos(an) * radialScale(point);
  let y = Math.sin(an) * radialScale(point);
  return{"x": 500 + x, "y": 325 - y}
}

function getPath(point){
  console.log(point[features[0]])
  let finalCords = [];
  for( var j = 0; j < features.length; j++){
    let name = features[j];
    let angle = (Math.PI / 2) + (2 * Math.PI * j / features.length);
    console.log(angle)
    console.log(point[name])
    finalCords.push(angles(angle, point[name]));
  }
return finalCords;
}
