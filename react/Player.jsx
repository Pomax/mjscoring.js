var Player = React.createClass({

  // We have to track these internally because it's a value
  // that can be updated multiple times before a new render
  // occurs, which means we can't just stick it in this.state
  // and expect it to update properly.
  playerId: 0,
  currentScore: 0,
  currentWind: 0,

  getInitialState: function() {
    return {
      wind: 0,
      name: '',
      score: 0,
      wins: 0
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
  },

  render: function() {
    var windclass = "wind" + this.state.wind;
    return (
      <div className="player pwidth">
        <div ref="playerinfo">
          <span className={windclass}>{this.state.wind}</span>
          <input type="text" className="name" value={this.state.name} placeholder="player name here" onChange={this.setName}/>
          <span className="scoring">score: {this.state.score}/{this.state.wins}</span>
        </div>

        <Bonus ref="bonus" />

        <Set ref="s1" />
        <Set ref="s2" />
        <Set ref="s3" />
        <Set ref="s4" />
        <Set ref="s5" />

        <button ref="ninetile" onClick={this.press}>nine tile error!</button>
        <button ref="illegal" onClick={this.confirmIllegalOut}>illegal win declaration!</button>

        <LimitHands ref="limits" />
      </div>
    );
  },

  // ==========================================

  setName: function(event) {
    this.setState({ name: event.target.value });
  },

  press: function(event) {
    var button = event.target;
    button.classList.toggle("pressed");
  },

  confirmIllegalOut: function(event) {
    var reason = "declaring a win despite not having a winning hand";
    var msg = "Are you sure you want this player to be penalised for " + reason + "?";
    var confirmed = confirm(msg);
    if(confirmed) { this.game.processIllegalOut(this); }
  },

  // ==========================================

  setGame: function(game) {
    this.game = game;
  },

  setWind: function(wind) {
    this.currentWind = wind;
    this.setState({ "wind": this.currentWind });
  },

  reset: function() {
    this.sets.forEach(function(set) {
      set.reset();
    });
    this.refs.bonus.reset();
    this.refs.limits.reset();
    this.refs.ninetile.getDOMNode().classList.remove("pressed");
  },

  useRules: function(rules) {
    this.rules = rules;
    this.currentScore = rules.base;
    this.setState({ score: this.currentScore });
    this.refs.limits.useRules(rules);
  },

  markEast: function() {
    this.set("east",true);
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
    return this.refs.ninetile.getDOMNode().classList.contains("pressed");
  },

  receivePoints: function(amount) {
    this.currentScore += amount;
    this.setState({ score: this.currentScore });
  },

  receiveWin: function() {
    this.setState({ wins: this.state.wins + 1 });
  }

});
