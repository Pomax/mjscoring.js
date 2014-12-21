var ScoringHistory = React.createClass({displayName: "ScoringHistory",

  getInitialState: function() {
    return {
      hands: []
    };
  },

  componentDidMount: function() {
    stateRecorder.register(this);
  },

  loadState: function(state) {
    if(!state) return;
    this.setState(state);
  },

  render: function() {
    return (
      React.createElement("div", {ref: "history", className: "scoring-history pwidth"}, 
      this.state.hands.map(function(handData, idx) {
        var ref = "entry" + idx;
        return React.createElement(ScoringEntry, {data: handData, ref: ref});
      })
      )
    );
  },

  addHand: function(hand) {
    this.hideLogs();
    this.setState({
      hands: this.state.hands.concat([hand])
    });
  },

  hideLogs: function() {
    var self = this;
    this.state.hands.forEach(function(handData, idx) {
      var ref = "entry" + idx;
      self.refs[ref].hideLog();
    });
  }

});
