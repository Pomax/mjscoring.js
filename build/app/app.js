var section = document.querySelector("section");
var height = section.getBoundingClientRect().height;
section.style.height = (height|0) + "px";


document.addEventListener("game-started", function(evt) {
  var section = document.querySelector("section");
  section.classList.add("slideout");
});

var stateRecorder = new StateRecorder();

React.render(React.createElement(Game, null), document.getElementById('app'));
