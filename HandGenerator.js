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
    pung: 0.1,
    kong: 0.01,
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
    var setCount = Math.round(Math.sqrt(25*Math.random()));
    var sets = []
    for(var i=0; i<setCount; i++) {
      var set = this.generateSet(i===4 ? "pair" : false);
      sets.push(set);
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
    var start = 0;
    var end = sequential? 3*9 : this.tileNames.length-8;
    var tile = start + ((Math.random() * (end-start))|0);

    if(this.tiles[tile] < tilecount || (sequential && tile > 3*9-2)) {
      (function(tilecount) {
        // FIXME: we don't want to always start at 0, we want
        // to start at tile and fan out instead.
        for(tile=0; tile<(sequential?Math.min(16,end) : end); tile++) {
          if(sequential) {
            if(this.tiles[tile]===0 || this.tiles[tile+1]===0 || this.tiles[tile+2]===0
               || this.tiles[tile] % 9 > this.tiles[tile+1] % 9 || this.tiles[tile+1] % 9 > this.tiles[tile+2] % 9)
                 continue;
          }
          else if(this.tiles[tile]<tilecount) continue;
          break;
        }
      }.bind(this)(settype === "chow" ? 1 : 3));
    }

    var tiles = [];
    for(i=0; tilecount-->0; i++) {
      tiles.push(sequential ? tile+i : tile);
      this.tiles[sequential ? tile+i : tile]--;
    }

    return this.generateSetString(tiles);
  },

  generateSetString: function(tiles) {
   console.log(tiles);
    var suit = false, tm=0, tile=tiles[0];
         if(tile<9)     { suit = "c"; }
    else if(tile<(9*2)) { suit = "b"; tm=9; }
    else if(tile<(9*3)) { suit = "d"; tm=18; }
    else if(tile<this.tileNames.length) { tm = 18; }
    tiles = tiles.map(function(v) { return v - tm; });
   console.log(tiles);
    return (suit?suit+".":'') + tiles.join('');
  }

};
