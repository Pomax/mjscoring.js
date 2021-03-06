var Player = React.createClass({

  // We have to track these internally because it's a value
  // that can be updated multiple times before a new render
  // occurs, which means we can't just stick it in this.state
  // and expect it to update properly.
  currentScore: 0,
  currentWind: 0,

  getInitialState: function() {
    return {
      wind: 0,
      name: '',
      score: 0,
      wins: 0,
      disabled: false
    };
  },

  componentDidMount: function() {
    this.history = this.refs.history;
    this.sets = [
      this.refs.s1,
      this.refs.s2,
      this.refs.s3,
      this.refs.s4,
      this.refs.s5
    ];
    stateRecorder.register(this);
  },

  loadState: function(state) {
    this.currentWind = state.wind;
    this.currentScore = state.score;
    this.setState(state);
  },

  render: function() {
    var windclass = "wind" + this.state.wind;
    var className = "player pwidth";
    if(this.state.disabled) { className += " disabled"; }
    return (
      <div className={className}>
        <div ref="playerinfo">
          <span className={windclass}>{this.state.wind}</span>
          <input type="text" className="name" value={this.state.name} placeholder="player name here" onChange={this.setName}/>
          <span className="scoring">score: <span onClick={this.overrideScore}>{this.state.score}</span>/<span onClick={this.overrideWins}>{this.state.wins}</span></span>
        </div>

        <Bonus ref="bonus" />

        <Set ref="s1" />
        <Set ref="s2" />
        <Set ref="s3" />
        <Set ref="s4" />
        <Set ref="s5" />

        <Button ref="ninetile" label="nine tile error!" />
        <Button ref="illegal"  onClick={this.confirmIllegalOut} label="illegal win declaration!" type="signal"/>

        <LimitHands ref="limits" />
      </div>
    );
  },

  // ==========================================

  /**
   * In case we're resuming some old game, we want to be able to override the scores.
   */
  overrideScore: function() {
    var value = prompt("Please specify a new score for this player:");
    if(value) {
      this.currentScore = parseInt(value, 10);
      this.setState({ score: this.currentScore });
    }
  },

  /**
   * In case we're resuming some old game, we want to be able to override the wins.
   */
  overrideWins: function() {
    var value = prompt("Please specify the number of wins this player:");
    if(value) {
      this.setState({ wins: parseInt(value, 10) });
    }
  },

  setName: function(event) {
    this.setState({ name: event.target.value });
  },

  /**
   * This is not an action that should go unconfirmed... it's a heavy loss.
   */
  confirmIllegalOut: function(event) {
    var reason = "declaring a win despite not having a winning hand";
    var msg = "Are you sure you want this player to be penalised for " + reason + "?";
    var confirmed = confirm(msg);
    if(confirmed) { this.game.processIllegalOut(this); }
  },

  setGame: function(game) {
    this.game = game;
  },

  setWind: function(wind) {
    this.currentWind = wind;
    this.setState({ "wind": this.currentWind });
  },

  reset: function() {
    this.sets.forEach(function(set) { set.reset(); });
    this.refs.bonus.reset();
    this.refs.limits.reset();
    this.refs.ninetile.reset();
  },

  /**
   * The rules specify certain aspects that are relevant to individual players.
   */
  useRules: function(rules) {
    this.rules = rules;
    this.currentScore = rules.base;
    this.setState({ score: this.currentScore });
    this.refs.limits.useRules(rules);
  },

  nextWind: function(direction) {
    var newwind = this.state.wind + direction;
    if(newwind<0) { newwind = 3; }
    else if(newwind>3) { newwind = 0; }
    this.setWind(newwind);
  },

  getSets: function() {
    return this.sets.filter(function(s) { return !s.empty(); });
  },

  getBonus: function() {
    return this.refs.bonus;
  },

  getLimit: function() {
    return this.refs.limits.getLimit();
  },

  getNineTileError: function() {
    return this.refs.ninetile.isPressed();
  },

  /**
   * Points won (or lost, if negative)
   */
  receivePoints: function(amount) {
    this.currentScore += amount;
    this.setState({ score: this.currentScore });
  },

  /**
   * This player's won a hand.
   */
  receiveWin: function() {
    this.setState({ wins: this.state.wins + 1 });
  },

  setDisabled: function(b) {
    this.refs.bonus.setDisabled(b);
    this.sets.forEach(function(s) { s.setDisabled(b); });
    this.refs.ninetile.setDisabled(b);
    this.refs.illegal.setDisabled(b);
    this.setState({ disabled: b });
  },

  /**
   * Mostly used for debugging and showing a random set of hands when the app first loads.
   * That said, might try to tie this into the MJJS pure-js Mahjong stuff, for gameplay.
   */
  setHand: function(h) {
    var self = this;
    this.refs.bonus.setBonus(h.bonus);
    h.sets.forEach(function(s, idx) {
      self.refs["s" +(1+idx)].setTiles(s.tiles, s.suit);
    });
  }
});
