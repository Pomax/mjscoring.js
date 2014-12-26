/**
 * I am still on the fence about whether to make this a plain JS library
 * or whether to keep this a React component. As a React component it can
 * be made to report things like limits, base points, etc. if you want to
 * compare rulesets, so I will likely keep it the way it is now, just
 * extend it with a meaningful render function rather than the stub.
 */
var ChineseClassical = React.createClass({

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
    return <span></span>;
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
    var points, reason;

    // no points for a chow, or pair of numbers!
    if(numeric && !pung && !kong) return;

    // 2 points for concealed pair of own wind
    // 2 points for concealed pair of wind of the round
    // 2 points for concealed pair of dragons
    if(same && pair && concealed) {
      if(tile === this.winds[ownwind])
        this.scorePoints(score, 2, "a concealed pair of own winds");
      if(tile === this.winds[windoftheround])
        this.scorePoints(score, 2, "a concealed pair of wind of the round");
      if(this.dragons.indexOf(tile) > -1)
        this.scorePoints(score, 2, "a concealed pair of dragons");
      return;
    }

    // no more points to be had if this is a pair.
    if(pair) return;

    // 2/4,  8/16 points for pung/kong simples
    // 4/8, 16/32 points for pung/kong terminals
    if (numeric) {
      points = (pung?1:4) * (!terminal? (!concealed? 2:4) : (!concealed? 4:8));
      reason = "a " + (concealed?'concealed ':'') + (pung?'pung':'kong') + " of " + (terminal?'terminals':'simples');
      this.scorePoints(score, points, reason);
      return;
    }

    // 4/8, 16/32 points for pung/kong winds/dragons
    points = (pung?1:4) * (!concealed?4:8);
    reason = "a " + (concealed?'concealed ':'') + (pung?'pung':'kong') + " of " + (dragon?'dragons':'winds');
    this.scorePoints(score, points, reason);

    // 1 double for pung/kong of dragons
    // 1 double for pung/kong of own wind
    // 1 double for pung/kong of wind of the round
    if(tile === this.winds[ownwind])
      this.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of own winds");
    else if(tile === this.winds[windoftheround])
      this.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of the wind of the round");
    else if(this.dragons.indexOf(tile) > -1)
      this.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of dragons");
  }},

  scorePattern: function(score, sets, wind, windoftheround) {
    var self = this, points, reason;
    var properties = sets.map(function(s) { return s.properties; });

    // 1 doubles for three concealed pung/kong
    var concealedTriplets = 0;
    properties.forEach(function(p) { with(p) { if(same) {
      if (concealed && (pung||kong)) { concealedTriplets++; }
      else if(kong && ckong) { concealedTriplets++; }
    }}});
    if(concealedTriplets >= 3) self.scoreDoubles(score, 1, "having three concealed triplets");

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
    if(total < this.wincount) return;

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

    // what about those suits and honours?
    var suits = [];
    var honours = false;
    properties.forEach(function(p) {
      var suit = p.suit;
      if(suit) { if (suits.indexOf(suit)===-1) suits.push(suit); }
      else honours = true;
    });
    var suit = (suits.length===1);

    // 1 double for one suit and honours
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
    }

    // no nine tile error. All players pay the winner.
    // East pays (or wins, if the winner is east) double.
    else {
      players.forEach(function(p,idx) {
        if(idx===winneridx) return;
        var diff = winvalue * (p.currentWind === 0 ? 2 : 1); // east pays double if they lose
        balance[idx] -= diff;
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
        diff = (v1 - v2) * (p1.currentWind===0 || p2.currentWind===0 ? 2 : 1);
        if(diff!==0) {
          balance[i] += diff;
          balance[j] -= diff;
        }
      }
    }

    // and finally we process the balance and return the scoring results
    return players.map(function(p, idx) {
      scores[idx].balance = balance[idx];
      p.receivePoints(balance[idx]);
      return scores[idx].getHand();
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
