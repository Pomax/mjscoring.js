var ScoringArea = React.createClass({

  componentDidMount: function() {
    this.histories = [ this.refs.history1, this.refs.history2, this.refs.history3, this.refs.history4];
  },

  render: function() {
    return (
      <div ref="scoring" className="scoring-area">
        <ScoringHistory ref="history1" />
        <ScoringHistory ref="history2" />
        <ScoringHistory ref="history3" />
        <ScoringHistory ref="history4" />
      </div>
    );
  },

  recordHand: function(pid, hand) {
    this.histories[pid].addHand(hand);
  }

});
