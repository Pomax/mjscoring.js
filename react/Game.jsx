var Game = React.createClass({

  currentWOTR: 0,

  visibles: ["next", "reset", "draw", "score", "extras"],

  getInitialState: function() {
    return {
      hand: '-',
      draws: 0,
      windoftheround: '-',
      finished: false
    };
  },

  cache: function() {
    stateRecorder.saveState();
  },

  loadState: function(state) {
    this.setState(state);
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
          <Button type="signal" ref="start" name="start" onClick={this.start}   label="New Game" />
          <Button type="signal" ref="reset" name="reset" onClick={this.reset}   label="Reset this hand" />
          <Button type="signal" ref="draw"  name="draw"  onClick={this.draw}    label="This hand is a draw" />
          <Button type="signal" ref="score" name="score" onClick={this.score}   label="Score" className="score"/>
          <Button type="signal" ref="next"  name="next"  onClick={this.advance} label="Advance hand" />
        </div>

        <div>Scoring extras:</div>
        <WinModifiers ref="extras"></WinModifiers>

        <ScoringArea ref="scoring"></ScoringArea>

        <Rules ref="rules"></Rules>
      </div>
    );
  },


  // ==========================================

  /**
   * Start scoring a new game
   */
  start: function() {
    this.__start();
    this.setState({
      hand: 1,
      draws: 0,
      windoftheround: 0
    }, this.cache);
    document.dispatchEvent(new CustomEvent("game-started", { detail: {} }));
  },

  /**
   * Helper function when starting, to make sure most parts of the app are interactive.
   */
  __start: function() {
    this.reset();
    this.refs.start.setDisabled(true);
    this.visibles.forEach(function(ref) {
      this.refs[ref].setDisabled(false);
    }.bind(this));
    this.players.forEach(function(p) {
      p.setDisabled(false);
    });
  },

  /**
   * Advance the game one hand without scoring anything.
   */
  advance: function() {
    // ensure we rotate on not-east
    this.nextHand({ currentWind: 2 });
  },

  /**
   * helper function when ending the game, to make sure most parts of the app are disabled.
   */
  __endGame: function() {
    this.refs.start.setDisabled(false);
    this.visibles.forEach(function(ref) {
      this.refs[ref].setDisabled(true);
    }.bind(this));
    this.players.forEach(function(p) {
      p.setDisabled(true);
    });
  },

  /**
   * Reset the current hand to empty everythings.
   */
  reset: function() {
    this.players.forEach(function(p) {
      p.reset();
    });
    this.refs.extras.reset();
  },

  /**
   * Treat the current hand as a draw.
   */
  draw: function() {
    this.reset();
    this.setState({
      draws: this.state.draws + 1,
      hand: this.state.hand + 1
    });
  },

  /**
   * If someone declared a win, but they do not have a winning hand, that may incur penalties.
   */
  processIllegalOut: function(offendingPlayer) {
    this.rules.processIllegalOut(this.players, offendingPlayer);
    this.draw();
  },

  /**
   * Process all players for this hand to figure out how much they've won/list
   */
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

    // For browser history tracking, we make sure to mark the current state
    // as the one we want to return to if the user clicks "back".
    stateRecorder.replaceState();

    var scoringResult = this.rules.award(this.players, scores);
    this.scores.recordHands(scoringResult, this.state.hand, this.state.windoftheround);
    this.nextHand(winner);
  },

  /**
   * Move on to the next hand - this may lead to the game being done,
   * or a round being replayed because east won, etc.
   */
  nextHand: function(winner) {
    var direction = this.rules.rotate(winner.currentWind);
    var currentWOTR = this.state.windoftheround;
    var finished = this.state.finished;
    if(winner && direction) {
      this.players.forEach(function(p) {
         p.nextWind(direction);
      });

      // advance the wind of the round?
      if(this.players[0].currentWind === 0) {
        currentWOTR++;
      }

      // Game finished?
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
      }, this.cache);
    } else {
      this.reset();
      this.setState({
        windoftheround: currentWOTR,
        hand: this.state.hand + 1
      }, this.cache);
    }
  }

});
