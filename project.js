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
var load = 0;
let svgS = d3.select("#spider").append("svg")
var rotation = 0;

var years;

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

  const defs = svg.append("defs");
  const linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

  var colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([158, 1]);
  var colors = d3.scaleSequential(d3.interpolateRdYlGn).domain([0,10]);

  years = document.getElementById('yea').value;
  var fil = document.getElementById('filters').value;

  linearGradient.selectAll("stop")
  .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
  .enter().append("stop")
  .attr("offset", d => d.offset)
  .attr("stop-color", d => d.color)
 
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
    .style('fill', d => {
      try { 
        if(fil.toString() == 'rank'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].rank;
          console.log("test")

          //console.log(val)
          return(colorScale(val));
        }
        else if(fil == 'economy'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].economy;
          return colors(val);
        }
        else if(fil == 'social_support'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].social_support;
          return colors(val);
        }
        else if(fil == 'freedom'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].freedom;
          return colors(val);
        }
        else if(fil == 'generosity'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].generosity;
          return colors(val);
        }
        else if(fil == 'trust'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].trust;
          return colors(val);
        }
        else if(fil == 'health'){
          let val = +happyData["('"+ years +"', '"+d.properties.name.toString()+"')"].health;
          return colors(val);
        }
      }
      catch(err){
        return 'white'
      }
    })
    .style('stroke', 'black')
    .style('stroke-width', "1")
    .on('mousedown', function(d,i){
      currentCountry = d.properties.name;
      svgS.remove()
      drawGauge();
      drawSpider();
      //console.log(d.properties.name)
    })
    .on('mouseover', function(d,i) {
      d3.select(this).style('stroke-width', 2)
      d3.select(this).style('stroke', 'black');
      //console.log(typeof(d.properties.name))
      try {
        var display = "('"+ years + "', '"+d.properties.name.toString()+"')";
        // d3.select(this).transition()
        //           .style("stroke", "black")
        //           .attr("stroke-width", 4);
        // tooltip.style("visibility", "visible")
        // .html("Country: " + d.properties.name  + "</br>" + "Happiness Rank: " + happyData[display.toString()].rank + "</br>" + "Year: " + years)
        if(fil == 'rank'){
          d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "Happiness Rank: " + happyData[display.toString()].rank + "</br>" + "Year: "+ years)
        }
        else if(fil == 'economy'){
          d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "Economy Rating: " + happyData[display.toString()].economy.toFixed(2) + "</br>" + "Year: "+ years)
        }
        else if(fil == 'social_support'){
          d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "Social Support Rating: " + happyData[display.toString()].social_support.toFixed(2) + "</br>" + "Year: "+ years)
        }
        else if(fil == 'freedom'){
          d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "Freedom Rating: " + happyData[display.toString()].freedom.toFixed(2) + "</br>" + "Year: "+ years)
        }
        else if(fil == 'generosity'){
          d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "Generosity Rating: " + happyData[display.toString()].generosity.toFixed(2) + "</br>" + "Year: "+ years)
        }
        else if(fil == 'trust'){
          d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "Trust Rating: " + happyData[display.toString()].trust.toFixed(2) + "</br>" + "Year: "+ years)
        }
        else if(fil == 'health'){
          d3.select(this).transition()
          .style("stroke", "black")
          .attr("stroke-width", 4);
          tooltip.style("visibility", "visible")
          .html("Country: " + d.properties.name  + "</br>" + "Health rating: " + happyData[display.toString()].health.toFixed(2) + "</br>" + "Year: "+ years)
        }
      }
      catch (err) {
        d3.select(this).transition()
                  .style("stroke", "black")
                  .attr("stroke-width", 4);
        tooltip.style("visibility", "visible")
        .html("Country: " + d.properties.name  + "</br>" + "No Happiness Data")
      }
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
  entry = "('"+ years + "', '" + currentCountry + "')";
  let datap = [];
  var pointp = {}
  for (const [key, value] of Object.entries(happyData[entry])) {
    pointp[key] = value
  }
  datap.push(pointp);

  var fil = document.getElementById('filters').value;

  if(fil == 'rank'){
    var cScore = datap[0]['score'] / 10
  }
  else if(fil == 'economy'){
    var cScore = datap[0]['economy'] / 10
  }
  else if(fil == 'social_support'){
    var cScore = datap[0]['social_support'] / 10
  }
  else if(fil == 'freedom'){
    var cScore = datap[0]['freedom'] / 10
  }
  else if(fil == 'generosity'){
    var cScore = datap[0]['generosity'] / 10
  }
  else if(fil == 'trust'){
    var cScore = datap[0]['trust'] / 10
  }
  else if(fil == 'health'){
    var cScore = datap[0]['health'] / 10
  }

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
  if(load == 0)
  {
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
     .attr('width', 50)
     .attr('height', 50)
     .attr('x', 600)
     .attr('y', 200)
     .attr('href', 'data/Excited-Smiley-Face.svg')
     .attr('opacity', '1')
    
     gauge.append('image')
     .attr('width', 50)
     .attr('height', 50)
     .attr('x', 475)
     .attr('y', 130)
     .attr('href', 'data/Neutral-Smiley-Face.svg')
     .attr('opacity', '1')

     gauge.append('image')
     .attr('width', 50)
     .attr('height', 50)
     .attr('x', 353)
     .attr('y', 205)
     .attr('href', 'data/Upset-Face.svg')
     .attr('opacity', '1')


     rotate = `rotate(${-120 + 210* cScore}, 500,285)`
        gauge.append('image')
        .data(datap)
        .attr('id', 'arrow')
        .transition()
        .duration(0)
        .delay(200)
        .attr('width', 150)
        .attr('height', 150)
        .attr('x', 425)
        .attr('y', 160)
        .attr('transform', `rotate(${-120 + 210* cScore}, 500,285)`)
        .attr('href', 'data/upPointer.svg')
        .attr('opacity', '1')
        load = 1;
        rotate = `rotate(${-120 + 210* cScore}, 500,285)`
    }
    else{
      console.log(typeof rotate)
      var interpolate = d3.interpolateString(rotate, `rotate(${-90 + 180* cScore}, 500,285)`)
        gauge.select('#arrow')
        .data(datap)
        .transition()
        .duration(2000)
        .ease(d3.easeElastic)
        .attrTween('transform', function(d,i,a){return interpolate})
    }
    rotate = `rotate(${-120 + 210* cScore}, 500,285)`

}
function drawSpider(){
    
  svgS = d3.select("#spider").append("svg")

  let data = [];

  var colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([150, 1]);

  const defs = svgS.append("defs");
  const linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

  linearGradient.selectAll("stop")
     .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
     .enter().append("stop")
     .attr("offset", d => d.offset)
     .attr("stop-color", d => d.color)
 
  var point = {}
  entry = "('"+ years + "', '" + currentCountry + "')";
  //console.log(entry)
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
      .attr("stroke-width", 0)
      .attr("stroke", "black")
      .attr('fill', d => {
        try { 
        let val = +happyData[entry].rank;
        return colorScale(val);
        }
        catch(err){
          return 'white'
        }
      })
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);
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
