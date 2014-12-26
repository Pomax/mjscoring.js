var Rules = React.createClass({

  getInitialState: function() {
    return {
      selected: "cc",
      disabled: false
    };
  },

  componentDidMount: function() {
    this.update({ target: { value: this.state.selected }});
    stateRecorder.register(this);
  },

  render: function() {
    return (
      <span ref="rules" className="rules">
        <ChineseClassical ref="cc" />
        <span>Rules: </span>
        <select ref="picker" value={this.state.selected} onChange={this.update} disabled={this.state.disabled}>
          <option value="cc">Chinese Classical</option>
        </select>
      </span>
    );
  },


  // ==========================================

  setDisabled: function(b) {
    this.setState({
      disabled: b
    });
  },

  update: function(event) {
    var selected = event.target.value;
    this.ruleset = this.refs[selected];
    this.base = this.ruleset.base;
    this.setState({ selected: selected });
  },

  setPlayers: function(players) {
    this.players = players;
  },

  limits: function() {
    return this.ruleset.limits;
  },

  rotate: function(wind) {
    return this.ruleset.rotate(wind);
  },

  score: function(player, windoftheround, winds, extras) {
    var sets = player.getSets();
    var bonus = player.getBonus();
    var limit = player.getLimit();
    var ownwind = player.currentWind;
    var score = this.ruleset.makeScoreObject();

    this.ruleset.preprocess(score, bonus, sets, ownwind, windoftheround);
    this.ruleset.scoreBonus(score, bonus, ownwind, windoftheround);
    this.ruleset.scoreSets(score, sets, ownwind, windoftheround);
    this.ruleset.scoreWinner(score, limit, sets, ownwind, windoftheround, extras);
    this.ruleset.capLimit(score);

    return score;
  },

  award: function(players, scores) {
    return this.ruleset.award(players, scores);
  },

  // special penalties
  processIllegalOut: function(players, offendingPlayer) {
    this.ruleset.processIllegalOut(players, offendingPlayer);
  }

});
