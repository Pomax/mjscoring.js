var StateRecorder = function(repository) {
  this.bindings = {};
  this.repository = repository;
  if(repository.restoreEvent && repository.restoreContext) {
    var fn = this.loadState.bind(this);
    repository.restoreContext.addEventListener(repository.restoreEvent, fn);
  }
};

var nextId = (function() {
  var id = 1;
  return function() {
    return id++;
  };
}());

StateRecorder.prototype = {
  register: function(object) {
    if(!object.stateId) { object.stateId = nextId(); }
    this.bindings[object.stateId] = object;
  },

  getFullState: function() {
    var self = this;
    var fullState = {};
    Object.keys(this.bindings).forEach(function(stateId) {
      fullState[stateId] = self.bindings[stateId].state;
    });
    return fullState;
  },

  // record the full state of every entity registered to this recorder
  saveState: function(options) {
    var fullState = this.getFullState();
    this.repository.save(fullState, options);
  },

  // swap in this state as "the current page"
  replaceState: function(options) {
    var fullState = this.getFullState();
    this.repository.replace(fullState, options);
  },

  // restore to a previous state
  loadState: function(event) {
    if(!event.state) { return console.error("no state to work with"); }

    var fullState = event.state;
    Object.keys(this.bindings).forEach(function(stateId) {
      var object = this.bindings[stateId];
      var state = fullState[stateId];
      if(object.loadState) { object.loadState(state); }
      else { object.setState(state); }
    }.bind(this));
  }
};
