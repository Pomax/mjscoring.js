var StateRecorder = function() {
  this.bindings = {};
  var fn = this.__loadState.bind(this);
  window.addEventListener("popstate", fn);
};

var nextId = (function() {
  var id = 1;
  return function() {
    return id++;
  };
}());

StateRecorder.prototype = {
  register: function(object) {
    if(!object.stateId) {
      object.stateId = nextId();
    }
    this.bindings[object.stateId] = object;
  },

  getFullState: function() {
    var self = this;
    var fullState = {};
    Object.keys(this.bindings).forEach(function(stateId) {
      var object = self.bindings[stateId];
      if(object && object.loadState) {
        fullState[stateId] = object.state;
      }
    });
    return fullState;
  },

  // swap in this state as "the current page"
  replaceState: function(title, url) {
    title = title || "";
    url = url || "";
    var fullState = this.getFullState();
    history.replaceState(fullState, title, url);
  },

  // record the full state of every entity registered to this recorder
  saveState: function(title, url) {
    title = title || "";
    url = url || "";
    var fullState = this.getFullState();
    history.pushState(fullState, title, url);
  },

  // load the full state from browsing history
  loadState: function() {
    history.back();
  },

  // restore to a previous state
  __loadState: function(event) {
    if(!event.state) {
      console.log("no state to work with");
      return;
    }

    var self = this;
    var fullState = event.state;
    Object.keys(this.bindings).forEach(function(stateId) {
      var object = self.bindings[stateId];
      var state = fullState[stateId];
      if(object.loadState) { object.loadState(state); }
      else { object.setState(state); }
    });
  }
};
