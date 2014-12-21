var LimitHands = React.createClass({displayName: "LimitHands",

  getInitialState: function() {
    return { limit: 0, limits: {} };
  },

  componentDidMount: function() {
    this.select = this.refs.limits.getDOMNode();
    stateRecorder.register(this);
  },

  loadState: function(state) {
    this.setState(state);
    this.select.selectedIndex = state.limit;
  },

  render: function() {
    var self = this;
    var options = Object.keys(this.state.limits).sort().map(function(limit, idx) {
      return React.createElement("option", {key: idx}, limit);
    });
    var value = this.state.limits[this.state.limit];
    return (
      React.createElement("select", {ref: "limits", className: "limits", value: value, onChange: this.selectLimit}, 
        options
      )
    );
  },

  // ==========================================

  useRules: function(rules) {
    var limits = rules.limits();
    limits["--- limit hands ---"] = "--- limit hands ---";
    this.setState({ limits: limits });
  },

  reset: function() {
    this.select.selectedIndex = 0;
    this.setState({ limit: 0 });
  },

  selectLimit: function(event) {
    this.setState({ limit: this.select.selectedIndex });
  },

  getLimit: function() {
    var opt = this.select.selectedIndex;
    if(opt===0) return false;
    this.setState({ limitidx: opt });
    return this.select.options[opt].textContent;
  }

});
