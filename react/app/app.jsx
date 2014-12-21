document.addEventListener("game-started", function(evt) {
  var section = document.querySelector("section");
  section.classList.add("slideout");
});
var stateRecorder = new StateRecorder();
React.render(<Game/>, document.getElementById('app'));
