var ScoringHistory = React.createClass({

  getInitialState: function() {
    return {
      hands: []
    };
  },

  render: function() {
    return (
      <div ref="history" className="scoring-history pwidth">
      {this.state.hands.map(function(handData) {
        return <ScoringEntry data={handData} />;
      })}
      </div>
    );
  },

  addHand: function(hand) {
    this.setState({
      hands: this.state.hands.concat([hand])
    });
  }

});
