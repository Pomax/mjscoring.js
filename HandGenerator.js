var HandGenerator = function(players) {
  this.players = players;
};

HandGenerator.prototype = {
  tilecount: {
    pair: 2,
    chow: 3,
    pung: 3,
    kong: 4
  },

  odds: {
    // set types
    chow: 1,
    pung: 0.2,
    kong: 0.08,
    // face type
    numeric: 1,
    simple: 1,
    terminal: 1,
    wind: 1,
    dragon: 1,
    // concealment
    concealed: 1,
    // hand type
    suited: 1,
    nohonours: 1,
    fullconceal: 1,
    // bonusses
    bonus: 0.1
  },

  tileNames: [
    "characters one",
    "characters two",
    "characters three",
    "characters four",
    "characters five",
    "characters six",
    "characters seven",
    "characters eight",
    "characters nine",

    "bamboo one",
    "bamboo two",
    "bamboo three",
    "bamboo four",
    "bamboo five",
    "bamboo six",
    "bamboo seven",
    "bamboo eight",
    "bamboo nine",

    "dots one",
    "dots two",
    "dots three",
    "dots four",
    "dots five",
    "dots six",
    "dots seven",
    "dots eight",
    "dots nine",

    "east",
    "south",
    "west",
    "north",

    "green dragon",
    "red dragon",
    "white dragon",

    "flower 1", "flower 2", "flower 3", "flower 4",
    "season 1", "season 2", "season 3", "season 4"
  ],

  resetAvailableTiles: function() {
    this.tiles = [];
    var i, tlen = this.tileNames.length;
    for(i=0; i<tlen-8; i++) { this.tiles[i] = 4; }
    for(i=tlen-8; i<tlen; i++) { this.tiles[i] = 1; }
  },

  generate: function() {
    this.winner = false;
    this.resetAvailableTiles();
    var hands = this.players.map(function(player) {
      var hand = this.generateHand();
      player.setHand(hand);
      return hand;
    }.bind(this));
    return hands;
  },

  generateHand: function() {
    // award bonus tiles
    var bonus=[];
    for(var i=0; i<8; i++) {
      if(this.tiles[34+i] == 0) {
        bonus[i] = false;
      }
      bonus[i] = Math.random() < this.odds.bonus;
      if(bonus[i]) { this.tiles[34+i]--; }
    }
    // how many sets? we want a number with "higher" bias
    var base = this.winner ? 16 : 25;
    var setCount = Math.round(Math.sqrt(base*Math.random()));
    var sets = []
    for(var i=0; i<setCount; i++) {
      var set = this.generateSet(i===4 ? "pair" : false);
      sets.push(set);
      if(i===4) this.winner = true;
    }
    return { bonus: bonus, sets: sets };
  },

  generateSet: function(settype) {
    if(!settype) {
      // will this be a chow, a pung or a kong?
           if(Math.random() < this.odds.kong) { settype="kong"; }
      else if(Math.random() < this.odds.pung) { settype="pung"; }
      else if(Math.random() < this.odds.chow) { settype="chow"; }
      return this.generateSet(settype);
    }

    var tilecount = this.tilecount[settype];
    var sequential = (settype==="chow");
    var tiles = [], tile;

    if(sequential) {
      do {
        var suit = Math.round(Math.random()*2);
        tile = Math.round(Math.random()*6) + suit * 9;
      } while(this.tiles[tile] === 0 && this.tiles[tile+1]===0 && this.tiles[tile+2]===0);
      for(var t=0; t<3; t++) {
        tiles.push(tile+t);
        this.tiles[tile+t]--;
      }
    }
    else {
      do {
        tile = Math.round(Math.random() * (this.tileNames.length - 8));
      } while(this.tiles[tile] < tilecount);
      while(tilecount-->0) {
        tiles.push(tile);
        this.tiles[tile]--;
      }
    }

    return this.generateSetObject(tiles);
  },

  generateSetObject: function(tiles) {
    var suit = false, tm=0, tile=tiles[0];
         if(tile<9)     { suit = "characters"; }
    else if(tile<(9*2)) { suit = "bamboo"; tm=9; }
    else if(tile<(9*3)) { suit = "dots"; tm=18; }
    else if(tile<this.tileNames.length) { tm = 18; }
    tiles = tiles.map(function(v) {
      corrected = v - tm;
      switch(corrected) {
        case 9: return 'e';
        case 10: return 's';
        case 11: return 'w';
        case 12: return 'n';
        case 13: return 'f';
        case 14: return 'c';
        case 15: return 'p';
        default: return (corrected+1);
      }
    });
    return {
      suit: suit,
      tiles: tiles.join('')
    };
  }

};
