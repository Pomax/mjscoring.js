var ScoringArea = React.createClass({

  getInitialState: function() {
    return { entries: [] };
  },

  componentDidMount: function() {
    stateRecorder.register(this);
  },

  render: function() {
    var rows = this.state.entries.map(function(entry, idx) {
      return <ScoringRow scores={entry.scores} hand={entry.hand} windoftheround={entry.wotr} key={idx} />;
    });
    return <table ref="scoring" className="scoring-area">{rows}</table>;
  },

  recordHands: function(hands, currenthand, windoftheround) {
    var entry = {
      scores: hands,
      hand: currenthand,
      wotr: windoftheround
    };
    this.setState({
      entries: ([entry]).concat(this.state.entries)
    });
  }

});
