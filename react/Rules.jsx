var Rules = React.createClass({

  componentDidMount: function() {
    this.ruleset = this.refs.current;
    this.base = this.ruleset.base;
  },

  render: function() {
    return (
      <div ref="rules">
        <ChineseClassical ref="current"/>
      </div>
    );
  },

  // ==========================================

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
