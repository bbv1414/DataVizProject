var svg;

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
    Promise.all([d3.json('data/countries.geo.json')])
          .then(function(values){
    
    geoData = values[0];
   
    drawMap();
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
    .style('stroke-width', "1");
}