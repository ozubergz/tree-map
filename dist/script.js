const url = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";

const w = 960,
h = 750;

var title = d3.select('.chart').
append('div').
attr('id', 'title').
html('Movie Sales');

var description = d3.select('.chart').
append('div').
attr('id', 'description').
html('Top 100 Highest Grossing Movies Grouped By Genre');

var svg = d3.select('.chart').
append('svg').
attr('width', w).
attr('height', h);

var tooltip = d3.select('.chart').
append('div').
style('opacity', 0).
attr('id', 'tooltip').
attr('class', 'tooltip');

d3.json(url).then(data => {

  //create treemap
  var treemap = d3.treemap().
  size([w, h]).
  paddingOuter(5);

  //create root
  var root = d3.hierarchy(data).
  sum(d => d.value).
  sort((a, b) => b.value - a.value);

  //call treemap
  treemap(root);

  //create colors
  const color = {
    'Action': '#FF585D',
    'Drama': '#ffb549',
    'Adventure': '#41b6e6',
    'Family': '#ffc0cb',
    'Animation': '#6ae1da',
    'Comedy': '#279989',
    'Biography': '#acd7e3' };


  // create tiles
  var tiles = svg.selectAll('g').
  data(root.leaves()).
  enter().append('g').
  attr("transform", d => {return "translate(" + [d.x0, d.y0] + ")";});

  tiles.
  append('rect').
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr('class', 'tile').
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value).
  style('fill', d => color[d.data.category]).
  on('mousemove', d => {
    tooltip.style('opacity', 0.8);
    tooltip.attr('data-value', d.data.value);
    tooltip.html('Title: ' + d.data.name + "<br/>" +
    'Genre: ' + d.data.category + '<br/>' +
    'Value: ' + d.data.value).
    style('left', d3.event.pageX + 'px').
    style('top', d3.event.pageY - 80 + 'px');
  }).
  on('mouseout', d => {
    tooltip.style('opacity', 0);
  });

  tiles.
  append('text').
  attr('class', 'text').
  selectAll('tspan').
  data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).
  enter().append('tspan').
  attr('dy', '1.1em').
  attr('x', 4).
  text(d => d);

  //create legend
  const size = 15;
  const categories = Object.getOwnPropertyNames(color);

  var svg2 = d3.select('.legendSvg').append('svg').attr('class', 'svg2');

  var legend = svg2.selectAll('.legend').
  data(categories).
  enter().append('g').
  attr('class', 'legend').
  attr('id', 'legend').
  attr('transform', (d, i) => {
    return 'translate(0, ' + i * size + ')';
  });

  legend.
  append('rect').
  attr('transform', 'translate(10, 0)').
  attr('class', 'legend-item').
  attr('width', size).
  attr('height', size).
  attr('fill', (d, i) => color[d]);

  legend.
  append('text').
  attr('transform', 'translate(27, 11)').
  attr('class', 'legendTxt').
  text(d => d);

});