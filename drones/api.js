let field = new Field(800);

$("#field").click(function() {
  event.preventDefault();
  field.addVertex();
});

$("#field").contextmenu(function() {
  event.preventDefault();
  field.addStation();
});

//
// function test(x, y) {
//   vertices = []
//   vertices = d3.selectAll('rect').nodes().map(function (el) {
//     return [parseInt(d3.select(el).attr('x') + size/2), parseInt(d3.select(el).attr('y') + size/2)];
//   });
//   console.log(coordsAreInside([x, y], vertices));
// }
