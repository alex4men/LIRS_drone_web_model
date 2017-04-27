var area = new GUI(800);
var dp = new DronePatrol();

$("#area").click(function() {
  event.preventDefault();
  area.addVertex();
});

$("#area").contextmenu(function() {
  event.preventDefault();
  area.addStation();
});