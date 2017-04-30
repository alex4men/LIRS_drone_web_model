import { ConvexHullGrahamScan } from './graham';


export function drawPerimeter() {
	// draw Perimeter
	d3.select("#perimeter").remove();
	var vertices = d3.selectAll('.vertex').nodes().map(function (el) {
		return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
	});
	var convexHull = new ConvexHullGrahamScan();
	vertices.map(function (el) {convexHull.addPoint(el[0], el[1]); });
	hullPoints = convexHull.getHull();
	var path       = ""

	if (hullPoints.length < 3)
	return;

	for (let i = 0, len = hullPoints.length; i < len; i++) {
		edges.push([
		[parseInt(hullPoints[i].x), parseInt(hullPoints[i].y)], // start point
		[parseInt(hullPoints[(i + 1) % len].x), parseInt(hullPoints[(i + 1) % len].y)] // end point
		]);
		path += i==0 ? "M" : " L";
		path += " " + (parseInt(hullPoints[i].x)) + " " + (parseInt(hullPoints[i].y));
	}
	path += " L " + (parseInt(hullPoints[0].x)) + " " + (parseInt(hullPoints[0].y));
	
	field.append("path")
	.attr("id", "perimeter")
	.attr("d", path);
}