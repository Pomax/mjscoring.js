var ScoringArea = React.createClass({

  getInitialState: function() {
    return { entries: [] };
  },

  componentDidMount: function() {
    stateRecorder.register(this);
  },

  render: function() {
    var last = this.state.entries.length - 1;
    var rows = this.state.entries.map(function(entry, idx) {
      return <ScoringRow key={'row-' + idx} scores={entry.scores} hand={entry.hand} windoftheround={entry.wotr} showdetails={idx===last} row={idx}/>;
    });
    return <table ref="scoring" className="scoring-area">{rows.reverse()}</table>;
  },


  // ==========================================


  recordHands: function(hands, currenthand, windoftheround) {
    var entry = {
      scores: hands,
      hand: currenthand,
      wotr: windoftheround
    };
    this.setState({
      entries: this.state.entries.concat([entry])
    });
  }

});
