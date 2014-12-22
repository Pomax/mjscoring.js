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
    pung: 1,
    kong: 1,
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
    fullconceal: 1
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
    this.players.forEach(function(p) {
      players.setHand(this.generateHand());
    }.bind(this));
  },

  generateHand: function() {
    var bonus=[];
    var rchance = 1/144;
    // award bonus tiles
    for(i=0; i<8; i++) {
      bonus[i] = Math.random() < rchance;
    }
    // how many sets?
    var setCount = Math.round(5*Math.random());
    // award sets
    var sets = []
    for(i=0;i<setCount;i++) {
      set.push(this.generateSet(i===4 ? "pair" : false));
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
    var tile = start + (Math.random() * (end-start);

    if(this.tiles[tile]<tilecount) {
      // we'll have to look for an alternate tile in the start-end range
    }

    var tiles = [];
    while(tilecount-->0) { tiles.push(tile); }
    return { tiles: tiles };
  }
};
