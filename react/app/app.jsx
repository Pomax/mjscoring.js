// some cosmetics
(function() {
  var section = document.querySelector("section");
  var height = section.getBoundingClientRect().height;
  section.style.height = (height|0) + "px";
  document.addEventListener("game-started", function(evt) {
    var section = document.querySelector("section");
    section.classList.add("slideout");
  });
}());

/**
 * We want to use the state recorder for browser history,
 * so we create a wrapper around the history API:
 */
var historyRecorder = {

  eventContext: document,
  restoreEvent: "popstate",
  restoreContext: window,

  save: function(state, options) {
    options = options || {};
    history.pushState(state, (options.title||""), (options.url||""));
  },

  replace: function(state, options) {
    options = options || {};
    history.replaceState(state, (options.title||""), (options.url||""));
  }
};

// and then use that with a new state recorder
var stateRecorder = new StateRecorder(historyRecorder);

// kick off the app
React.render(<Game/>, document.getElementById('app'));
