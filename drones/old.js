var elem = document.getElementById('field'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];

// Add event listener for `click` events.
elem.addEventListener('click', function(event) {
    event.preventDefault();
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    console.log(x, y);// Add element.
    context.rect(x , y,5,5);
    context.stroke();

}, false);

// Add event listener for 'rightclick' events
elem.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
}, false);

var classname = document.getElementsByClassName("classname");

var myFunction = function() {
    var attribute = this.getAttribute("data-myattribute");
    alert(attribute);
};

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myFunction, false);
}
