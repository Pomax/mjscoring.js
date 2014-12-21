var Game = React.createClass({displayName: "Game",

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
      React.createElement("div", {className: "game"}, 

        React.createElement("div", {ref: "info"}, 
          "Hand: ", this.state.hand, " (", this.state.draws, " draws) Wind of the round: ", React.createElement("span", {className: wotrclass}, this.state.windoftheround)
        ), 

        React.createElement("div", {ref: "players"}, 
          React.createElement(Player, {ref: "p1"}), 
          React.createElement(Player, {ref: "p2"}), 
          React.createElement(Player, {ref: "p3"}), 
          React.createElement(Player, {ref: "p4"})
        ), 

        React.createElement("div", {ref: "buttons", className: "play-buttons"}, 
          React.createElement(Button, {type: "signal", ref: "start", name: "start", onClick: this.start, label: "New Game"}), 
          React.createElement(Button, {type: "signal", ref: "reset", name: "reset", onClick: this.reset, label: "Reset this hand"}), 
          React.createElement(Button, {type: "signal", ref: "draw", name: "draw", onClick: this.draw, label: "This hand is a draw"}), 
          React.createElement(Button, {type: "signal", ref: "score", name: "score", onClick: this.score, label: "Score", className: "score"})
        ), 

        React.createElement("div", null, "Scoring extras:"), 
        React.createElement(WinModifiers, {ref: "extras"}), 

        React.createElement(ScoringArea, {ref: "scoring"}), 

        React.createElement(Rules, {ref: "rules"})
      )
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
    this.refs.start.getDOMNode().setAttribute("disabled","disabled");
    this.refs.reset.getDOMNode().removeAttribute("disabled");
    this.refs.draw.getDOMNode().removeAttribute("disabled");
    this.refs.score.getDOMNode().removeAttribute("disabled");
    this.reset();

    // FIXME: THIS IS GROSS, THERE HAS TO BE A BETTER WAY
    setTimeout(function() { stateRecorder.replaceState(); }, 500);
  },

  // This is questionable, but I don't know how React wants me to do this
  // without writing a component that is IDENTICAL to <button> except with
  // functions for enabling/disabling.
  __endGame: function() {
    this.refs.start.getDOMNode().removeAttribute("disabled");
    this.refs.reset.getDOMNode().setAttribute("disabled","disabled");
    this.refs.draw.getDOMNode().setAttribute("disabled","disabled");
    this.refs.score.getDOMNode().setAttribute("disabled","disabled");
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
    if(winner && direction) {
      this.players.forEach(function(p) {
         p.nextWind(direction);
      });

      // advance the wind of the round
      if(this.players[0].currentWind === 0) {
        this.setState({ windoftheround: this.state.windoftheround + 1 });
      }

      // Game finished condition:
      if(this.state.windoftheround >= 4) {
        this.__endGame();
        this.setState({ finished: true });
      }
    }

    if(this.state.finished) {
      this.setState({ windoftheround: '-'});
    } else {
      this.setState({ hand: this.state.hand + 1 });
      this.reset();
    }

    // FIXME: THIS IS GROSS, THERE HAS TO BE A BETTER WAY
    setTimeout(function() { stateRecorder.saveState(); }, 500);
  }

});
