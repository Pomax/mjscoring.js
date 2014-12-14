(function() {
  var winds = ['e', 's', 'w', 'n'];
  var dragons = ['c', 'f', 'p'];


  var ChineseClassical = {

    winds: winds,
    dragons: dragons,
    wincount: 14,
    basicwin: 10,
    base: 2000,
    limit: 1000,

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

    capLimit: function(score) {
      if(!score.limit) {
        score.value = Math.min(score.tilepoints * Math.pow(2,score.doubles), ChineseClassical.limit);
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
      score.value = ChineseClassical.limit;
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

    makeScoreObject: function() {
      var score = {
        tilepoints: 0,
        doubles: 0,
        winner: false,
        log: [],
        sets: [],
        getHand: function(doubled) {
          return {
            winner: score.winner,
            amount: score.value + (doubled?' (x2)':''),
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

    scoreWinner: function(score, limit, sets, ownwind, windoftheround, extras) {
      // limit hands are winners!
      if(limit) return ChineseClassical.scoreLimit(score, limit);

      // if not a limit, a player needs five sets to win.
      if(sets.length<5) return;

      // and they need the right number of tiles...
      var total = sets.map(function(s) { return s.properties.tiles.length; }).reduce(function(a,b) { return a+b; });
      if(total !== ChineseClassical.wincount) return;

      // Alright, winner! 10 points straight away just for winning.
      score.winner = true;
      ChineseClassical.scorePoints(score, ChineseClassical.basicwin, "winning");

      // and then the more complicated doubles:
      var properties = sets.map(function(s) { return s.properties; });

      // 1 double for fully concealed hand
      if(properties.every(function(p) { return p.concealed; }))
        ChineseClassical.scoreDoubles(score, 1, "a fully concealed hand");

      // 1 double for pure chow hand (no scoring pair)
      var scoringpair = false;
      properties.forEach(function(p) { if(p.pair && p.major) scoringpair=true; });

      if(!scoringpair && properties.every(function(p) { return !p.pung && !p.kong; }))
          ChineseClassical.scoreDoubles(score, 1, "a chow hand");

      // 1 double for all pung hand
      if(properties.every(function(p) { return p.pair || p.pung || p.kong; }))
        ChineseClassical.scoreDoubles(score, 1, "a pung hand");

      // 1 double for terminals and honours
      if(properties.every(function(p) { return (p.pair || p.pung || p.kong) && (p.terminal || p.dragon || p.wind); }))
        ChineseClassical.scoreDoubles(score, 1, "a terminals and honours hand");

      // 1 double for one suit and honours
      var suit = properties[0].suit;
      var honours = suit ? false : true;
      properties.forEach(function(p) {
        var s = p.suit;
        if(!s) { honours = true; }
        else if(s !== suit) { suit = false; }
      });
      if(suit!==false && honours)
        ChineseClassical.scoreDoubles(score, 1, "a one suit and honours hand");

      // 3 doubles for one suit hand
      if(suit!==false && !honours)
        ChineseClassical.scoreDoubles(score, 3, "a one suit hand");

      // 2 points for: self drawn last tile, out on a pair, out on a major pair, one chance hand
      if(extras.selfdrawn) ChineseClassical.scorePoints(score, 2, "a self drawn win");
      if(extras.pair) ChineseClassical.scorePoints(score, 2, "going out on a pair");
      if(extras.major) ChineseClassical.scorePoints(score, 2, "going out on a major pair");
      if(extras.onechance) ChineseClassical.scorePoints(score, 2, "winning with a 'one chance' hand");

      // 1 double for: last tile in the wall, out on the last discard, out on a supplement tile, robbing a kong, ready on first turn
      if(extras.lastwall) ChineseClassical.scoreDoubles(score, 1, "winning on the last wall tile");
      if(extras.lastdiscard) ChineseClassical.scoreDoubles(score, 1, "winning on the last discard");
      if(extras.supplement) ChineseClassical.scoreDoubles(score, 1, "winning on a supplement tile");
      if(extras.kongrob) ChineseClassical.scoreDoubles(score, 1, "robbing a kong to win");
      if(extras.turnone) ChineseClassical.scoreDoubles(score, 1, "ready on turn one");
    },

    scorePattern: function(score, sets, wind, windoftheround) {
      var points, reason;
      var properties = sets.map(function(s) { return s.properties; });

      // 1 doubles for three concealed pung/kong
      var concealed = 0;
      properties.forEach(function(p) { with(p) { if(same && (pung||kong) && concealed) concealed++; }});
      if(concealed>=3)
        ChineseClassical.scoreDoubles(score, 1, "having three concealed triplets");

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
      if(wpung===3 && wpair===1) ChineseClassical.scoreDoubles(score, 1, "having little four winds");
      // 4 doubles for pungs of each wind, but note that if this player wins, this pattern constitutes a limit hand.
      if(wpung===4) ChineseClassical.scoreDoubles(score, 4, "having big four winds");
      // 3 doubles for pung/pung/pair dragons, but really 1 because you already get 2 from the pungs.
      if(dpung===2 && dpair===1) ChineseClassical.scoreDoubles(score, 1, "having little three dragons");
      // 5 doubles for pung/pung/pung dragons, but really 2 because you already get 3 from the pungs.
      else if(dpung===3) ChineseClassical.scoreDoubles(score, 2, "having big three dragons");
    },

    preprocess: function(score, bonus, sets, ownwind, windoftheround) {
      score.sets = sets.map(function(set) {
        var tiles = set.getTiles();
        var tile = tiles[0];
        var suit = set.getSuit();
        var concealed = set.getConcealed();
        var numeric = tiles.every(function(v) { return parseInt(v,10) == v; });
        var terminal = numeric && tiles.every(function(v) { return v==1 || v==9; });
        var dragon = ChineseClassical.dragons.indexOf(tile) > -1;
        var same = tiles.every(function(v) { return v==tile; });
        var pair = same && tiles.length === 2;
        var major= same && (dragon || tile===ChineseClassical.winds[ownwind] || tile===ChineseClassical.winds[windoftheround]);
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

    scoreSet: function(score, set, ownwind, windoftheround) { with(set) {
      var points, reason;

      // no points for a chow, or pair of numbers!
      if(numeric && !pung && !kong) return;

      // 2 points for concealed pair of own wind
      // 2 points for concealed pair of wind of the round
      // 2 points for concealed pair of dragons
      if(same && pair && concealed) {
        if(tile === ChineseClassical.winds[ownwind])
          ChineseClassical.scorePoints(score, 2, "a concealed pair of own winds");
        else if(tile === ChineseClassical.winds[windoftheround])
          ChineseClassical.scorePoints(score, 2, "a concealed pair of wind of the round");
        else if(ChineseClassical.dragons.indexOf(tile) > -1)
          ChineseClassical.scorePoints(score, 2, "a concealed pair of dragons");
        return;
      }

      // no more points to be had if this is a pair.
      if(pair) return;

      // 2/4,  8/16 points for pung/kong simples
      // 4/8, 16/32 points for pung/kong terminals
      if (numeric) {
        points = (pung?1:4) * (!terminal? (!concealed? 2:4) : (!concealed? 4:8));
        reason = "a " + (concealed?'concealed ':'') + (pung?'pung':'kong') + " of " + (terminal?'terminals':'simples');
        ChineseClassical.scorePoints(score, points, reason);
        return;
      }

      // 4/8, 16/32 points for pung/kong winds/dragons
      points = (pung?1:4) * (!concealed?4:8);
      reason = "a " + (concealed?'concealed ':'') + (pung?'pung':'kong') + " of " + (dragon?'dragons':'winds');
      ChineseClassical.scorePoints(score, points, reason);

      // 1 double for pung/kong of dragons
      // 1 double for pung/kong of own wind
      // 1 double for pung/kong of wind of the round
      if(tile === ChineseClassical.winds[ownwind])
        ChineseClassical.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of own winds");
      else if(tile === ChineseClassical.winds[windoftheround])
        ChineseClassical.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of the wind of the round");
      else if(ChineseClassical.dragons.indexOf(tile) > -1)
        ChineseClassical.scoreDoubles(score, 1, "a " + (pung?'pung':'kong') + " of dragons");
    }},

    scoreSets: function(score, sets, ownwind, windoftheround) {
      score.sets.forEach(function(set) {
        ChineseClassical.scoreSet(score, set, ownwind, windoftheround);
      });
      ChineseClassical.scorePattern(score, sets, ownwind, windoftheround);
    },

    scoreBonus: function(score, bonus, ownwind, windoftheround) {
      var flowers = bonus.getFlowers();
      var seasons = bonus.getSeasons();
      // 4 points for each bonus tile:
      var count = flowers.concat(seasons)
                         .map(function(v) { return v ? 1 : 0; })
                         .reduce(function(a,b) { return a+b; });
      score.tilepoints += 4 * count;
      // 1 double if own flower and own season:
      if (flowers[ownwind] && seasons[ownwind]) { score.doubles++; }
      // 1 double for all flowers:
      var all_flowers = flowers.reduce(function(a,b) { return a&&b; });
      if (all_flowers) { score.doubles++; }
      // 1 double for all seasons:
      var all_seasons = seasons.reduce(function(a,b) { return a&&b; });
      if (all_seasons) { score.doubles++; }
      // all bonus tiles is 3 doubles, but is covered by the previous computations
    },

    award: function(players, scores) {
      // - if east wins: all players pay double east's points
      // - if east didn't win: east pays double to the winner
      // - non-winners balance their scores based on tilepoint difference
      var eastwon = false;
      var winner = false;
      var winneridx = false;
      players.forEach(function(p,idx) {
        if(scores[idx].winner) {
          winner = p;
          winneridx = idx;
          if (p.get("wind")===0) eastwon = true;
        }
      });

      // everyone pays the winner
      var winvalue = scores[winneridx].value;
      players.forEach(function(p,idx) {
        if(idx===winneridx) return;
        var diff = winvalue * (eastwon?2:1);
        p.adjust("score", -diff);
        winner.adjust("score", diff);
      });

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
            p1.adjust("score", diff);
            p2.adjust("score", -diff);
          }
        }
      }

      players.forEach(function(p,idx) { p.recordHand(scores[idx].getHand(idx===winneridx&&eastwon)); });
    }
  }

  // TODO: add more rulesets
  var RuleSets = {
    ChineseClassical: ChineseClassical
  };

  // -------

  var MJScoring = function(ruleset) {
    this.ruleset = RuleSets[ruleset];
    this.base = this.ruleset.base;
  };

  MJScoring.prototype = {
    base: 0,
    limits: function() { return this.ruleset.limits; },
    rotate: function(wind) { return this.ruleset.rotate(wind); },
    score: function(player, windoftheround, winds, extras) {
      var sets = player.getSets();
      var bonus = player.getBonus();
      var limit = player.getLimit();
      var ownwind = player.wind;
      var score = this.ruleset.makeScoreObject();

      this.ruleset.preprocess(score, bonus, sets, ownwind, windoftheround);
      this.ruleset.scoreBonus(score, bonus, ownwind, windoftheround);
      this.ruleset.scoreSets(score, sets, ownwind, windoftheround);
      this.ruleset.scoreWinner(score, limit, sets, ownwind, windoftheround, extras);
      this.ruleset.capLimit(score);

      return score;
    },
    award: function(players, scores) { this.ruleset.award(players.slice(), scores); }
  };

  // FIXME: HACK
  window.MJScoring = MJScoring;

}());
