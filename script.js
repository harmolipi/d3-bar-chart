const getGDPData = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  );
  const data = await response.json();
  return data;
};

const w = 800;
const h = 500;
const padding = 70;
const svg = d3
  .select('#chart-container')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

let tooltip = d3
  .select('#chart-container')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

getGDPData().then((data) => {
  console.log(data.data);

  const gdpMax = d3.max(data.data, (d) => d[1]);
  const dateMin = d3.min(data.data, (d) => new Date(d[0]));
  const dateMax = d3.max(data.data, (d) => new Date(d[0]));

  const xScale = d3
    .scaleTime()
    .domain([dateMin, dateMax])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([h - padding, padding]);

  const dateAxis = d3.axisBottom(xScale);
  const gdpAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(dateAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(gdpAxis);

  svg
    .selectAll('rect')
    .data(data.data)
    .enter()
    .append('rect')
    .attr('data-date', (_d, i) => data.data[i][0])
    .attr('data-gdp', (_d, i) => data.data[i][1])
    .attr('index', (_d, i) => i)
    .attr('stroke', 'white')
    .attr('stroke-width', 0.1)
    .attr('x', (_d, i) => xScale(new Date(data.data[i][0])))
    .attr('y', (d) => yScale(d[1]))
    .attr('width', w / data.data.length)
    .attr('height', (d) => h - padding - yScale(d[1]))
    .attr('class', 'bar')
    .on('mouseover', (e, d) => {
      const i = e.target.getAttribute('index');
      tooltip.transition().duration(200).style('opacity', 0.9);

      tooltip
        .html(`${d[0]}<br>$${d[1]}`)
        .attr('data-date', d[0])
        .style('left', `${xScale(new Date(data.data[i][0]))}px`)
        .style('bottom', `${padding - 15}px`);
    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0);
    });
});
