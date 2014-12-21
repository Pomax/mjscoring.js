var ScoringArea = React.createClass({displayName: "ScoringArea",

  componentDidMount: function() {
    this.histories = [ this.refs.history1, this.refs.history2, this.refs.history3, this.refs.history4];
  },

  render: function() {
    return (
      React.createElement("div", {ref: "scoring", className: "scoring-area"}, 
        React.createElement(ScoringHistory, {ref: "history1"}), 
        React.createElement(ScoringHistory, {ref: "history2"}), 
        React.createElement(ScoringHistory, {ref: "history3"}), 
        React.createElement(ScoringHistory, {ref: "history4"})
      )
    );
  },

  recordHand: function(pid, hand) {
    this.histories[pid].addHand(hand);
  }

});
