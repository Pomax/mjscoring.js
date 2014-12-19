var ScoringHistory = React.createClass({

  getInitialState: function() {
    return {
      hands: []
    };
  },

  render: function() {
    return (
      <div ref="history" className="scoring-history pwidth">
      {this.state.hands.map(function(handData, idx) {
        var ref = "entry" + idx;
        return <ScoringEntry data={handData} ref={ref}/>;
      })}
      </div>
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
