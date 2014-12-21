document.addEventListener("game-started", function(evt) {
  var section = document.querySelector("section");
  section.classList.add("slideout");
});
var stateRecorder = new StateRecorder();
React.render(React.createElement(Game, null), document.getElementById('app'));
