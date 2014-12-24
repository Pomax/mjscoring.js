var Game = React.createClass({

  currentWOTR: 0,

  getInitialState: function() {
    return {
      hand: '-',
      draws: 0,
      windoftheround: '-',
      finished: false
    };
  },

  componentDidMount: function() {
    stateRecorder.register(this);
    var self = this;
    this.rules = this.refs.rules;
    this.players = [ this.refs.p1, this.refs.p2, this.refs.p3, this.refs.p4 ];
    this.players.forEach(function(p, wind) {
      p.playerId = wind;
      p.setWind(wind);
      p.useRules(self.rules);
      p.setGame(self);
    });
    this.rules.setPlayers(this.players);
    this.scores = this.refs.scoring;
    this.__endGame();

    var hg = new HandGenerator(this.players);
    hg.generate();
  },

  loadState: function(state) {
    if(!state) {
      console.error("Game did not receive a state to load");
    }
    this.setState(state);
  },

  render: function() {
    var wotrclass = "wind" + this.state.windoftheround;

    return (
      <div className="game">

        <div ref="info">
          Hand: {this.state.hand} ({this.state.draws } draws) Wind of the round: <span className={wotrclass}>{this.state.windoftheround}</span>
        </div>

        <div ref="players">
          <Player ref="p1"></Player>
          <Player ref="p2"></Player>
          <Player ref="p3"></Player>
          <Player ref="p4"></Player>
        </div>

        <div ref="buttons" className="play-buttons">
          <Button type="signal" ref="start" name="start" onClick={this.start} label="New Game" />
          <Button type="signal" ref="reset" name="reset" onClick={this.reset} label="Reset this hand" />
          <Button type="signal" ref="draw"  name="draw"  onClick={this.draw}  label="This hand is a draw" />
          <Button type="signal" ref="score" name="score" onClick={this.score} label="Score" className="score"/>
          <Button type="signal" ref="next"  name="next"  onClick={this.next}  label="Advance hand" />
        </div>

        <div>Scoring extras:</div>
        <WinModifiers ref="extras"></WinModifiers>

        <ScoringArea ref="scoring"></ScoringArea>

        <Rules ref="rules"></Rules>
      </div>
    );
  },

  // ==========================================

  start: function() {
    this.setState({
      hand: 1,
      draws: 0,
      windoftheround: 0
    });
    this.__start();
    document.dispatchEvent(new CustomEvent("game-started", { detail: {} }));
  },

  // This is questionable, but I don't know how React wants me to do this
  // without writing a component that is IDENTICAL to <button> except with
  // functions for enabling/disabling.
  __start: function() {
    this.refs.start.setDisabled(true);
    this.refs.next.setDisabled(false);
    this.refs.reset.setDisabled(false);
    this.refs.draw.setDisabled(false);
    this.refs.score.setDisabled(false);
    this.refs.extras.setDisabled(false);
    this.players.forEach(function(p) { p.setDisabled(false); });
    this.reset();

    // FIXME: THIS IS GROSS, THERE HAS TO BE A BETTER WAY
    setTimeout(function() { stateRecorder.replaceState(); }, 500);
  },

  next: function() {
    // ensure we rotate on not-east
    this.nextHand({ currentWind: 2 });
  },

  // This is questionable, but I don't know how React wants me to do this
  // without writing a component that is IDENTICAL to <button> except with
  // functions for enabling/disabling.
  __endGame: function() {
    this.refs.start.setDisabled(false);
    this.refs.next.setDisabled(true);
    this.refs.reset.setDisabled(true);
    this.refs.draw.setDisabled(true);
    this.refs.score.setDisabled(true);
    this.refs.extras.setDisabled(true);
    this.players.forEach(function(p) { p.setDisabled(true); });
  },

  reset: function() {
    this.players.forEach(function(p) {
      p.reset();
    });
    this.refs.extras.reset();
  },

  draw: function() {
    this.reset();
    this.setState({
      draws: this.state.draws + 1,
      hand: this.state.hand + 1
    });
  },

  processIllegalOut: function(offendingPlayer) {
    this.rules.processIllegalOut(this.players, offendingPlayer);
    this.draw();
  },

  score: function() {
    var self = this;
    var winner;
    var scores = this.players.map(function(p, idx) {
      var score = self.rules.score(p, self.state.windoftheround, self.winds, self.refs.extras.getExtras());
      if (score.winner) {
        winner = p;
        winner.receiveWin();
      }
      return score;
    });
    if(!winner) {
      return alert("No one has won yet\n\n(Illegal win, Draw, or accidentally pressed Score?)");
    }

    stateRecorder.replaceState();

    this.rules.award(this.players, scores, this.scores);
    this.nextHand(winner);
  },

  nextHand: function(winner) {
    // set up the next hand
    var direction = this.rules.rotate(winner.currentWind);
    var currentWOTR = this.state.windoftheround;
    var finished = this.state.finished;
    if(winner && direction) {
      this.players.forEach(function(p) {
         p.nextWind(direction);
      });

      // advance the wind of the round
      if(this.players[0].currentWind === 0) {
        currentWOTR++;
      }

      // Game finished condition:
      if(currentWOTR >= 4) {
        this.__endGame();
        finished = true;
      }
    }

    if(finished) {
      this.setState({
        hand: this.state.hand + ' played',
        windoftheround: 'none, this game is finished.',
        finished: true
      });
    } else {
      this.setState({
        windoftheround: currentWOTR,
        hand: this.state.hand + 1
      });
      this.reset();
    }

    // FIXME: THIS IS GROSS, THERE HAS TO BE A BETTER WAY
    setTimeout(function() { stateRecorder.saveState(); }, 500);
  }

});
