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
        <span>Rules: </span>
        <select value={this.state.selected} onChange={this.update} disabled={this.state.disabled}>
          <ChineseClassical ref="cc" />
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


  preprocess: function(score, bonus, sets, ownwind, windoftheround) {
    var self = this;

    score.sets = sets.map(function(set) {
      var tiles = set.getTiles();
      var tile = tiles[0];
      var suit = set.getSuit();
      var concealed = set.getConcealed();
      var numeric = tiles.every(function(v) { return parseInt(v,10) == v; });
      var terminal = numeric && tiles.every(function(v) { return v==1 || v==9; });
      var dragon = self.ruleset.dragons.indexOf(tile) > -1;
      var same = tiles.every(function(v) { return v==tile; });
      var pair = same && tiles.length === 2;
      var major= same && (dragon || tile === self.ruleset.winds[ownwind] || tile === self.ruleset.winds[windoftheround]);
      var pung = same && tiles.length === 3;
      var kong = same && tiles.length === 4;
      var ckong = set.state.ckong;

      // save this information for subsequent score computing.
      var properties = {
        tiles: tiles,
        tile: tile,
        suit: suit,
        concealed: concealed,
        numeric: numeric,
        terminal: terminal,
        dragon: dragon,
        wind: !numeric && !dragon,
        same: same,
        pair: pair,
        major: major,
        pung: pung,
        kong: kong,
        ckong: ckong
      };

      set.properties = properties;
      return properties;
    });
  },

  score: function(player, windoftheround, winds, extras) {
    var sets = player.getSets();
    var bonus = player.getBonus();
    var limit = player.getLimit();
    var ownwind = player.currentWind;
    var score = this.ruleset.makeScoreObject();
    this.preprocess(score, bonus, sets, ownwind, windoftheround);
    // defer to the ruleset for the scoring proper
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
