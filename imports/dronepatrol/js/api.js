let area = new GUI(800);
var dp = new DronePatrol();

$("#area").click(function() {
  event.preventDefault();
  area.addVertex();
});

$("#area").contextmenu(function() {
  event.preventDefault();
  area.addStation();
});

//
// function test(x, y) {
//   vertices = []
//   vertices = d3.selectAll('rect').nodes().map(function (el) {
//     return [parseInt(d3.select(el).attr('x') + size/2), parseInt(d3.select(el).attr('y') + size/2)];
//   });
//   console.log(coordsAreInside([x, y], vertices));
// }
