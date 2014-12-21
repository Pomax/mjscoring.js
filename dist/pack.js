var Bonus = React.createClass({displayName: "Bonus",

  componentDidMount: function() {
    this.flowers = [this.refs.f1, this.refs.f2, this.refs.f3, this.refs.f4 ],
    this.seasons = [this.refs.s1, this.refs.s2, this.refs.s3, this.refs.s4 ],
    this.buttons = this.flowers.concat(this.seasons);
    document.addEventListener("bonustile-claimed", this.handleClaim);
  },

  render: function() {
    return (
      React.createElement("div", {className: "bonus"}, 
        React.createElement("div", {className: "flowers"}, 
          React.createElement(Button, {ref: "f1", name: "f1", label: "1", onClick: this.handleExclusion}), 
          React.createElement(Button, {ref: "f2", name: "f2", label: "2", onClick: this.handleExclusion}), 
          React.createElement(Button, {ref: "f3", name: "f3", label: "3", onClick: this.handleExclusion}), 
          React.createElement(Button, {ref: "f4", name: "f4", label: "4", onClick: this.handleExclusion})
        ), 
        React.createElement("div", {className: "seasons"}, 
          React.createElement(Button, {ref: "s1", name: "s1", label: "1", onClick: this.handleExclusion}), 
          React.createElement(Button, {ref: "s2", name: "s2", label: "2", onClick: this.handleExclusion}), 
          React.createElement(Button, {ref: "s3", name: "s3", label: "3", onClick: this.handleExclusion}), 
          React.createElement(Button, {ref: "s4", name: "s4", label: "4", onClick: this.handleExclusion})
        )
      )
    );
  },

  // ==========================================

  reset: function() { this.buttons.forEach(function(button) { button.reset(); })},
  getFlowers: function() { return this.flowers.map(function(button) { return button.isPressed(); }); },
  getSeasons: function() { return this.seasons.map(function(button) { return button.isPressed(); }); },

  // when a bonus tile is claimed, unpress this tile for all other players
  handleExclusion: function(event) {
    document.dispatchEvent(new CustomEvent("bonustile-claimed", {detail: {
      name: event.target.props.name,
      source: this
    }}));
  },

  // event handler for the custom event that gets thrown above
  handleClaim: function(event) {
    if(event.detail.source === this) return;
    this.refs[event.detail.name].reset();
  }

});

var ChineseClassical = React.createClass({displayName: "ChineseClassical",

  winds: ['e', 's', 'w', 'n'],

  dragons: ['c', 'f', 'p'],

  wincount: 14,

  basicwin: 10,

  base: 2000,

  limit: 1000,

  deadwall: 16,

  limits: {
    "all green" : "bamboo 2, 3, 4, 6, 8 and green dragons only",
    "all honours" : "no numbered tiles in winning hand",
    "all terminals" : "pung hand consisting only of 1s and 9s",
    "big four winds" : "Pungs for all winds, and any pair to complete the pattern",
    "earthly hand" : "non-dealer wins on dealer's first discard",
    "four kongs" : "hand consisting of four kongs and a pair",
    "fully concealed one suit hand" : "any legal winning hand, one suit, fully concealed (open kongs from concealed pungs count)",
    "fully concealed pung hand" : "open kongs from concealed pungs count",
    "heavenly hand" : "east wins on their dealt hand",
    "kong on kong" : "form any kong, form another kong with its supplement tile, then win on the second supplement tile",
    "moon from the bottom of the sea" : "win off of the last discard or last wall tile, if it's dots 1",
    "nine gates" : "111, 2345678, 999 + pair tile, all same suit",
    "plum blossom on the roof" : "win on a supplement time, if it's dots 5",
    "scratching a carrying pole" : "win by robbing a kong of bamboo 2",
    "thirteen orphans" : "1+9 of each suit, each wind once, each dragon once, + pair tile",
    "thirteen wins" : "draws set the number of consecutive wins to zero",
    "three great scholars" : "hand contains three big dragons"
  },

  render: function() {
    return (
      React.createElement("div", null)
    );
  },

  // ==========================================

  capLimit: function(score) {
    if(!score.limit) {
      score.value = Math.min(score.tilepoints * Math.pow(2,score.doubles), this.limit);
    }
  },

  rotate: function(wind) {
    if(wind===0) return false;
    // we rotate counter-clockwise
    return -1;
  },

  scoreLimit: function(score, limit) {
    score.winner = true;
    score.limit = true;
    score.tilepoints = 0;
    score.doubles = 0;
    score.value = this.limit;
    score.log = ["limit hand: " + limit];
  },

  scorePoints: function(score, points, reason) {
    score.tilepoints += points;
    score.log.push(points + " points for " + reason);
  },

  scoreDoubles: function(score, doubles, reason) {
    score.doubles += doubles;
    score.log.push(doubles + " double"+(doubles>1?'s':'')+" for " + reason);
  },

  // ==========================================

  makeScoreObject: function() {
    var score = {
      tilepoints: 0,
      doubles: 0,
      winner: false,
      log: [],
      sets: [],
      getHand: function() {
        return {
          winner: score.winner,
          values: {
            tilepoints: score.tilepoints,
            amount: score.value,
            balance: score.balance
          },
          tiles: score.sets.map(function(set) {
            var tiles = set.tiles.join('');
            if(set.suit) { tiles = set.suit.substring(0,1) + '.' + tiles; }
            return tiles;
          }).join(','),
          log: score.log
        };
      }
    };
    return score;
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
      var dragon = self.dragons.indexOf(tile) > -1;
      var same = tiles.every(function(v) { return v==tile; });
      var pair = same && tiles.length === 2;
      var major= same && (dragon || tile === self.winds[ownwind] || tile === self.winds[windoftheround]);
      var pung = same && tiles.length === 3;
      var kong = same && tiles.length === 4;

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
        kong: kong
      };

      set.properties = properties;
      return properties;
    });
  },

  scoreBonus: function(score, bonus, ownwind, windoftheround) {
    var self = this;
    var flowers = bonus.getFlowers();
    var seasons = bonus.getSeasons();
    // 4 points for each bonus tile:
    flowers.forEach(function(f, idx) { if(f) { self.scorePoints(score, 4, "flower "+(idx+1)); } });
    seasons.forEach(function(s, idx) { if(s) { self.scorePoints(score, 4, "season "+(idx+1)); } });
    // 1 double if own flower and own season:
    if (flowers[ownwind] && seasons[ownwind]) {
      this.scoreDoubles(score, 1, " having own flower and season");
    }
    // 1 double for all flowers:
    var all_flowers = flowers.reduce(function(a,b) { return a&&b; });
    if (all_flowers) {
      this.scoreDoubles(score, 1, "having all flowers");
    }
    // 1 double for all seasons:
    var all_seasons = seasons.reduce(function(a,b) { return a&&b; });
    if (all_seasons) {
      this.scoreDoubles(score, 1, "having all seasons");
    }
    // all bonus tiles is 3 doubles, but is covered by the previous computations
  },


  scoreSets: function(score, sets, ownwind, windoftheround) {
    var self = this;
    score.sets.forEach(function(set) {
      self.scoreSet(score, set, ownwind, windoftheround);
    });
    self.scorePattern(score, sets, ownwind, windoftheround);
  },

  scoreSet: function(score, set, ownwind, windoftheround) { with(set) {
    var self = this,  points, reason;

    // no points for a chow, or pair of numbers!
    if(numeric && !pung && !kong) return;

    // 2 points for concealed pair of own wind
    // 2 points for concealed pair of wind of the round
    // 2 points for concealed pair of dragons
    if(same && pair && concealed) {
      if(tile === self.winds[ownwind])
        self.scorePoints(score, 2, "a concealed pair of own winds");
      else if(tile === self.winds[windoftheround])
        self.scorePoints(score, 2, "a concealed pair of wind of the round");
      else if(self.dragons.indexOf(tile) > -1)
        self.scorePoints(score, 2, "a concealed pair of dragons");
      return;
    }

    // no more points to be had if this is a pair.
    if(pair) return;

    // 2/4,  8/16 points for pung/kong simples
    // 4/8, 16/32 points for pung/kong terminals
    if (numeric) {
      points = (pung?1:4) * (!terminal? (!concealed? 2:4) : (!concealed? 4:8));
      reason = "a " + (concealed?'concealed ':'') + (pung?'pung':'kong') + " of " + (terminal?'terminals':'simples');
      self.scorePoints(score, points, reason);
      return;
    }

    // 4/8, 16/32 points for pung/kong winds/dragons
    points = (pung?1:4) * (!concealed?4:8);
    reason = "a " + (concealed?'concealed ':'') + (pung?'pung':'kong') + " of " + (dragon?'dragons':'winds');
    self.scorePoints(score, points, reason);

    // 1 double for pung/kong of dragons
    // 1 double for pung/kong of own wind
    // 1 double for pung/kong of wind of the round
    if(tile === self.winds[ownwind])
      self.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of own winds");
    else if(tile === self.winds[windoftheround])
      self.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of the wind of the round");
    else if(self.dragons.indexOf(tile) > -1)
      self.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of dragons");
  }},

  scorePattern: function(score, sets, wind, windoftheround) {
    var self = this, points, reason;
    var properties = sets.map(function(s) { return s.properties; });

    // 1 doubles for three concealed pung/kong
    var concealed = 0;
    properties.forEach(function(p) { with(p) { if(same && (pung||kong) && concealed) concealed++; }});
    if(concealed>=3)
      self.scoreDoubles(score, 1, "having three concealed triplets");

    // doubles from honour patterns:
    var wpung = 0, wpair = 0, dpung = 0, dpair = 0;
    properties.forEach(function(p) { with(p) {
      if(same && !numeric) {
        if(dragon) {
          if(pung||kong) dpung++;
          else if(pair) dpair++;
        } else {
          if(pung||kong) wpung++;
          else if(pair) wpair++;
        }
      }
    }});
    // 1 double for pung/pung/pung/pair of winds
    if(wpung===3 && wpair===1) self.scoreDoubles(score, 1, "having little four winds");
    // 4 doubles for pungs of each wind, but note that if this player wins, this pattern constitutes a limit hand.
    if(wpung===4) self.scoreDoubles(score, 4, "having big four winds");
    // 3 doubles for pung/pung/pair dragons, but really 1 because you already get 2 from the pungs.
    if(dpung===2 && dpair===1) self.scoreDoubles(score, 1, "having little three dragons");
    // 5 doubles for pung/pung/pung dragons, but really 2 because you already get 3 from the pungs.
    else if(dpung===3) self.scoreDoubles(score, 2, "having big three dragons");
  },

  scoreWinner: function(score, limit, sets, ownwind, windoftheround, extras) {
    var self = this;

    // limit hands are winners!
    if(limit) return this.scoreLimit(score, limit);

    // if not a limit, a player needs five sets to win.
    if(sets.length<5) return;

    // and they need the right number of tiles...
    var total = sets.map(function(s) { return s.properties.tiles.length; }).reduce(function(a,b) { return a+b; });
    if(total !== this.wincount) return;

    // Alright, winner! 10 points straight away just for winning.
    score.winner = true;
    self.scorePoints(score, self.basicwin, "winning");

    // and then the more complicated doubles:
    var properties = sets.map(function(s) { return s.properties; });

    // 1 double for fully concealed hand
    if(properties.every(function(p) { return p.concealed; }))
      self.scoreDoubles(score, 1, "a fully concealed hand");

    // 1 double for pure chow hand (no scoring pair)
    var scoringpair = false;
    properties.forEach(function(p) { if(p.pair && p.major) scoringpair=true; });

    if(!scoringpair && properties.every(function(p) { return !p.pung && !p.kong; }))
        self.scoreDoubles(score, 1, "a chow hand");

    // 1 double for all pung hand
    if(properties.every(function(p) { return p.pair || p.pung || p.kong; }))
      self.scoreDoubles(score, 1, "a pung hand");

    // 1 double for terminals and honours
    if(properties.every(function(p) { return (p.pair || p.pung || p.kong) && (p.terminal || p.dragon || p.wind); }))
      self.scoreDoubles(score, 1, "a terminals and honours hand");

    // 1 double for one suit and honours
    var suit = properties[0].suit;
    var honours = suit ? false : true;
    properties.forEach(function(p) {
      var s = p.suit;
      if(!s) { honours = true; }
      else if(s !== suit) { suit = false; }
    });
    if(suit!==false && honours)
      self.scoreDoubles(score, 1, "a one suit and honours hand");

    // 3 doubles for one suit hand
    if(suit!==false && !honours)
      self.scoreDoubles(score, 3, "a one suit hand");

    // 2 points for: self drawn last tile, out on a pair, out on a major pair, one chance hand
    if(extras.selfdrawn) self.scorePoints(score, 2, "a self drawn win");
    if(extras.pair) self.scorePoints(score, 2, "going out on a pair");
    if(extras.major) self.scorePoints(score, 2, "going out on a major pair");
    if(extras.onechance) self.scorePoints(score, 2, "winning with a 'one chance' hand");

    // 1 double for: last tile in the wall, out on the last discard, out on a supplement tile, robbing a kong, ready on first turn
    if(extras.lastwall) self.scoreDoubles(score, 1, "winning on the last wall tile");
    if(extras.lastdiscard) self.scoreDoubles(score, 1, "winning on the last discard");
    if(extras.supplement) self.scoreDoubles(score, 1, "winning on a supplement tile");
    if(extras.kongrob) self.scoreDoubles(score, 1, "robbing a kong to win");
    if(extras.turnone) self.scoreDoubles(score, 1, "ready on turn one");

    // and finally, 1 double for winning as east
    if(ownwind === 0) self.scoreDoubles(score, 1, "winning as east");
  },

  award: function(players, scores, scoringarea) {
    // - if east wins: all players pay double east's points
    // - if east didn't win: east pays double to the winner
    // - non-winners balance their scores based on tilepoint difference
    var eastwon = false;
    var winner = false;
    var winneridx = false;
    var ninetile = false;
    var ninetileidx = false;

    players.forEach(function(p,idx) {
      if(scores[idx].winner) {
        winner = p;
        winneridx = idx;
        if (p.currentWind===0) eastwon = true;
      }
      if(p.getNineTileError()) {
        ninetile = p;
        ninetileidx = idx;
      }
    });

    // how many points is the winner owed?
    var winvalue = scores[winneridx].value;

    // how much do the other players win/lose?
    var balance = [0,0,0,0];

    // Do we have a nine tile error situation?
    if(ninetile) {
      // If so, the offending player pays the entire
      // number of points owed to it by all players.
      // Such is the penalty of the nine tile error.
      winvalue = 4 * winvalue;
      balance[winneridx] = winvalue;
      balance[ninetileidx] = -winvalue;
      this.scorePoints(scores[ninetileidx], -winvalue, "fascilitating the win");
    }

    // no nine tile error. All players pay the winner.
    // East pays (or wins, if the winner is east) double.
    else {
      players.forEach(function(p,idx) {
        if(idx===winneridx) return;
        var diff = winvalue * (p.currentWind === 0 ? 2 : 1); // east pays double if they lose
        p.receivePoints(-diff);
        balance[idx] += -diff;

        winner.receivePoints(diff);
        balance[winneridx] += diff;
      });
    }

    // then scores are settled amongst the losers

    var i,j,p1,p2,v1,v2;
    for(i=0; i<4; i++) {
      if(i===winneridx) continue;
      p1 = players[i];
      v1 = scores[i].value;
      for(j=i+1; j<4; j++) {
        if(j===winneridx) continue;
        p2 = players[j];
        v2 = scores[j].value;
        diff = v1 - v2;
        if(diff!==0) {
          p1.receivePoints(diff);
          balance[i] += diff;
          p2.receivePoints(-diff);
          balance[j] += -diff;
        }
      }
    }

    // and finally we chronicle these scores in the scoring area
    players.forEach(function(p, idx) {
      scores[idx].balance = balance[idx];
      scoringarea.recordHand(idx, scores[idx].getHand());
    });
  },

  // In Chinese Classical, and illegal out means the offending player pays 300
  // points to each of the other players for a total loss of 900 points.
  processIllegalOut: function(players, offendingPlayer) {
    players.forEach(function(p) {
      if(p!==offendingPlayer) {
        p.receivePoints(300);
      }
    });
    offendingPlayer.receivePoints(-900);
  }

});

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
    this.start();
    stateRecorder.register(this);
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

var LimitHands = React.createClass({displayName: "LimitHands",

  getInitialState: function() {
    return { limit: 0, limits: {} };
  },

  componentDidMount: function() {
    this.select = this.refs.limits.getDOMNode();
    stateRecorder.register(this);
  },

  loadState: function(state) {
    this.setState(state);
    this.select.selectedIndex = state.limit;
  },

  render: function() {
    var self = this;
    var options = Object.keys(this.state.limits).sort().map(function(limit, idx) {
      return React.createElement("option", {key: idx}, limit);
    });
    var value = this.state.limits[this.state.limit];
    return (
      React.createElement("select", {ref: "limits", className: "limits", value: value, onChange: this.selectLimit}, 
        options
      )
    );
  },

  // ==========================================

  useRules: function(rules) {
    var limits = rules.limits();
    limits["--- limit hands ---"] = "--- limit hands ---";
    this.setState({ limits: limits });
  },

  reset: function() {
    this.select.selectedIndex = 0;
    this.setState({ limit: 0 });
  },

  selectLimit: function(event) {
    this.setState({ limit: this.select.selectedIndex });
  },

  getLimit: function() {
    var opt = this.select.selectedIndex;
    if(opt===0) return false;
    this.setState({ limitidx: opt });
    return this.select.options[opt].textContent;
  }

});

var Player = React.createClass({displayName: "Player",

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
    stateRecorder.register(this);
  },

  loadState: function(state) {
    if(!state) {
      console.error("Player did not receive a state to load");
    }
    this.setState(state);
  },

  render: function() {
    var windclass = "wind" + this.state.wind;
    return (
      React.createElement("div", {className: "player pwidth"}, 
        React.createElement("div", {ref: "playerinfo"}, 
          React.createElement("span", {className: windclass}, this.state.wind), 
          React.createElement("input", {type: "text", className: "name", value: this.state.name, placeholder: "player name here", onChange: this.setName}), 
          React.createElement("span", {className: "scoring"}, "score: ", this.state.score, "/", this.state.wins)
        ), 

        React.createElement(Bonus, {ref: "bonus"}), 

        React.createElement(Set, {ref: "s1"}), 
        React.createElement(Set, {ref: "s2"}), 
        React.createElement(Set, {ref: "s3"}), 
        React.createElement(Set, {ref: "s4"}), 
        React.createElement(Set, {ref: "s5"}), 

        React.createElement(Button, {ref: "ninetile", label: "nine tile error!"}), 
        React.createElement(Button, {ref: "illegal", onClick: this.confirmIllegalOut, label: "illegal win declaration!", type: "signal"}), 

        React.createElement(LimitHands, {ref: "limits"})
      )
    );
  },

  // ==========================================

  setName: function(event) {
    this.setState({ name: event.target.value });
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
    this.sets.forEach(function(set) { set.reset(); });
    this.refs.bonus.reset();
    this.refs.limits.reset();
    this.refs.ninetile.reset();
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
    return this.refs.ninetile.isPressed();
  },

  receivePoints: function(amount) {
    this.currentScore += amount;
    this.setState({ score: this.currentScore });
  },

  receiveWin: function() {
    this.setState({ wins: this.state.wins + 1 });
  }

});

var Rules = React.createClass({displayName: "Rules",

  componentDidMount: function() {
    this.ruleset = this.refs.current;
    this.base = this.ruleset.base;
  },

  render: function() {
    return (
      React.createElement("div", {ref: "rules"}, 
        React.createElement(ChineseClassical, {ref: "current"})
      )
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

  award: function(players, scores, scoringarea) {
    this.ruleset.award(players, scores, scoringarea);
  },

  // special penalties
  processIllegalOut: function(players, offendingPlayer) {
    this.ruleset.processIllegalOut(players, offendingPlayer);
  }

});

var ScoringArea = React.createClass({displayName: "ScoringArea",

  componentDidMount: function() {
    this.histories = [ this.refs.history1, this.refs.history2, this.refs.history3, this.refs.history4];
  },

  render: function() {
    return (
      React.createElement("div", {ref: "scoring", className: "scoring-area"}, 
        React.createElement(ScoringHistory, {ref: "history1"}), 
        React.createElement(ScoringHistory, {ref: "history2"}), 
        React.createElement(ScoringHistory, {ref: "history3"}), 
        React.createElement(ScoringHistory, {ref: "history4"})
      )
    );
  },

  recordHand: function(pid, hand) {
    this.histories[pid].addHand(hand);
  }

});

var ScoringEntry = React.createClass({displayName: "ScoringEntry",

  render: function() {
    var data = this.props.data;
    var tilebank = data.tiles ? React.createElement(TileBank, {ref: "tilebank", handtiles: data.tiles}) : '';
    return (
      React.createElement("div", {className: "entry"}, 
        React.createElement("div", {onClick: this.toggleLog}, 
          React.createElement("div", {className: "info", "data-winner": data.winner, "data-amount": data.values.balance}, " points")
        ), 
        React.createElement("div", {className: "hidden log", onClick: this.hideLog, ref: "log"}, 
          React.createElement("div", null, data.values.tilepoints, " tilepoints, ", data.values.amount, " points total"), 
          tilebank, 
          data.log.map(function(line,idx) {
            return React.createElement("div", {key: idx, className: "line"}, line);
          })
        )
      )
    );
  },

  revealLog: function() {
    this.refs.log.getDOMNode().classList.remove("hidden");
  },

  toggleLog: function() {
    this.refs.log.getDOMNode().classList.toggle("hidden");
  },

  hideLog: function() {
    this.refs.log.getDOMNode().classList.add("hidden");
  }

});

var ScoringHistory = React.createClass({displayName: "ScoringHistory",

  getInitialState: function() {
    return {
      hands: []
    };
  },

  componentDidMount: function() {
    stateRecorder.register(this);
  },

  loadState: function(state) {
    if(!state) return;
    this.setState(state);
  },

  render: function() {
    return (
      React.createElement("div", {ref: "history", className: "scoring-history pwidth"}, 
      this.state.hands.map(function(handData, idx) {
        var ref = "entry" + idx;
        return React.createElement(ScoringEntry, {data: handData, ref: ref});
      })
      )
    );
  },

  addHand: function(hand) {
    this.hideLogs();
    this.setState({
      hands: this.state.hands.concat([hand])
    });
  },

  hideLogs: function() {
    var self = this;
    this.state.hands.forEach(function(handData, idx) {
      var ref = "entry" + idx;
      self.refs[ref].hideLog();
    });
  }

});

var Set = React.createClass({displayName: "Set",

  getInitialState: function() {
    return { set: '' };
  },

  componentDidMount: function() {
    stateRecorder.register(this);
  },

  loadState: function(state) {
    this.setState(state);
    this.updateTileBank(this.getTilesString());
  },

  render: function() {
    return (
      React.createElement("div", {className: "set"}, 
        React.createElement("input", {ref: "tiles", type: "text", value: this.state.set, onChange: this.updateSet}), 
        React.createElement(Button, {ref: "characters", name: "characters", onClick: this.press, label: "満"}), 
        React.createElement(Button, {ref: "bamboo", name: "bamboo", onClick: this.press, label: "竹"}), 
        React.createElement(Button, {ref: "dots", name: "dots", onClick: this.press, label: "◎"}), 
        React.createElement(TileBank, {ref: "tilebank"}), 
        React.createElement(Button, {ref: "concealed", name: "concealed", label: "..."})
      )
    );
  },

  // ==========================================

  updateTileBank: function(tiles) {
    this.refs.tilebank.setTiles(tiles);
  },

  reset: function() {
    this.setState({ set: '' });
    this.refs.characters.reset();
    this.refs.bamboo.reset();
    this.refs.dots.reset();
    this.refs.concealed.reset();
    this.refs.tilebank.reset();
  },

  press: function(event) {
    var self = this;
    ["characters", "bamboo", "dots"].forEach(function(ref) {
      var button = self.refs[ref];
      if (event.target === button) return;
      button.reset();
    });
    this.updateTileBank(this.getTilesString());
  },

  updateSet: function(event) {
    this.setState({ set: event.target.value });
    this.updateTileBank(this.getTilesString());
  },

  empty: function() {
    return this.state.set.trim() === '';
  },

  getSuit: function() {
    var suits = ["characters", "bamboo", "dots"],
        slen = suits.length;
    for(var i=0; i<slen; i++) {
      var suit = suits[i];
      var btn = this[suit];
      if(this.refs[suit].isPressed()) return suit;
    }
    return false;
  },

  getTiles: function() {
    var v = this.refs.tiles.getDOMNode().value;
    v = v.split('').map(function(v) {
      if(parseInt(v,10) == v) {
        return parseInt(v,10);
      }
      return v;
    });
    return v;
  },

  getConcealed: function() {
    return this.refs.concealed.isPressed();
  },

  getTilesString: function() {
    var self = this;
    var suit = this.getSuit();
    var tiles = this.getTiles();
    var joined = tiles.join('');
    var wrap = function(input) {
      return self.state.concealed ? "("+input+")" : input;
    };
    if(tiles.length>0) {
      if (typeof tiles[0] === "number") {
        if(!suit) return false;
        return wrap(suit.substring(0,1) + "." + joined);
      }
      return wrap(joined);
    }
    return false;
  }

});

var Tile = React.createClass({displayName: "Tile",

  getInitialState: function() {
    return {
      suit: '',
      face: ''
    };
  },

  componentDidMount: function() {
    this.setState({
      suit: this.props.suit,
      face: this.props.face
    });
  },

  render: function() {
    var suit = this.state.suit, face = this.state.face;
    var tileimg = "style/tiles/" + suit.substring(0,1) + face + ".jpg";
    var title = (suit?suit+' ':'') + face;
    return (
      React.createElement("img", {className: "tile", src: tileimg, title: title})
    );
  }

});

var TileBank = React.createClass({displayName: "TileBank",

  getInitialState: function() {
    return { tiles: [] };
  },

  componentDidMount: function() {
    var handtiles = this.props.handtiles;
    if(handtiles) {
      handtiles = handtiles.split(",");
      this.setTiles(handtiles);
    }
  },

  render: function() {
    var tiles = this.state.tiles.map(function(tile) {
      return React.createElement(Tile, {suit: tile.suit, face: tile.face})
    })
    return (
      React.createElement("div", {className: "tilebank"}, 
        tiles
      )
    );
  },

  reset: function() {
    this.setState({ tiles: [] });
  },

  setTiles: function(tiles) {
    if(!tiles) return this.reset();

    var banktiles = [];

    if (!tiles.forEach) { tiles = [tiles]; }
    tiles.forEach(function(tiles) {

      // suited tiles?
      if(tiles.indexOf(".")>-1) {
        tiles = tiles.split(".");
        var suit = tiles[0];
        tiles = tiles[1].split('');
        tiles.forEach(function(face) {
          banktiles.push({ suit: suit, face: face });
        });
      }

      // suitless tiles
      else {
        tiles = tiles.split('');
        tiles.forEach(function(face) {
          banktiles.push({ suit: "", face: face });
        });
      }

    });
    this.setState({ tiles: banktiles });
  }

});

var WinModifiers = React.createClass({displayName: "WinModifiers",

  componentDidMount: function() {
    this.buttons = [
      "selfdrawn",
      "pair",
      "major",
      "onechance",
      "lastwall",
      "lastdiscard",
      "supplement",
      "kongrob",
      "turnone"
    ];
  },

  render: function() {
    return (
      React.createElement("div", {className: "winmodifiers"}, 
        React.createElement(Button, {ref: "selfdrawn", label: "Self drawn"}), 
        React.createElement(Button, {ref: "pair", label: "Pair"}), 
        React.createElement(Button, {ref: "major", label: "Major pair"}), 
        React.createElement(Button, {ref: "onechance", label: "One chance"}), 
        React.createElement(Button, {ref: "lastwall", label: "Last wall tile"}), 
        React.createElement(Button, {ref: "lastdiscard", label: "Last discard"}), 
        React.createElement(Button, {ref: "supplement", label: "Supplement tile"}), 
        React.createElement(Button, {ref: "kongrob", label: "Robbed a kong"}), 
        React.createElement(Button, {ref: "turnone", label: "Ready on first turn"})
      )
    );
  },

  // ==========================================

  reset: function() {
    var self = this;
    this.buttons.forEach(function(ref) {
      self.refs[ref].reset();
    })
  },

  getExtras: function() {
    var self = this;
    var extras = {}
    this.buttons.forEach(function(ref) {
      extras[ref] = self.refs[ref].isPressed();
    });
    return extras;
  },

});

/**
 * This button can either behave as a "regular" HTML button, or it can act
 * as an actually physical switch with an on/off state. If you press it,
 * the button stayspressed unless you press it again.
 */
var Button = React.createClass({displayName: "Button",
  pressed: false,
  getInitialState: function() { return { pressed: this.pressed }; },
  componentDidMount: function() {
    this.pressed = !!this.props.pressed;
    this.setState({ pressed: this.pressed });
    stateRecorder.register(this);
  },
  loadState: function(state) {
    this.pressed = state.pressed;
    this.setState(state);
  },
  render: function() {
    var pclass = [
      this.state.pressed ? "pressed" : '',
      this.props.name ? this.props.name : ''
    ].filter(function(v) { return !!v; }).join(" ");
    return React.createElement("button", {className: pclass, onClick: this.press}, this.props.label);
  },
  reset: function() {
    this.pressed = false;
    this.setState({ pressed: false });
  },
  press: function(event) {
    if(this.props.type !== "signal") {
      this.pressed = !this.pressed;
      this.setState({ pressed: this.pressed });
    }
    if(this.props.onClick) { event.target = this; this.props.onClick(event); }
  },
  isPressed: function() { return this.pressed; }
});

var stateRecorder = new StateRecorder();
React.render(React.createElement(Game, null), document.getElementById('app'));
