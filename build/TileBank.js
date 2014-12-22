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
    var tiles = this.state.tiles.map(function(tile, idx) {
      var key = tile.suit + tile.face + idx;
      return React.createElement(Tile, {suit: tile.suit, face: tile.face, key: key})
    });
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
    if(!tiles) tiles = [];
    var banktiles = [];
    if (!tiles.forEach) { tiles = [tiles]; }
    tiles.forEach(function(tiles) {
      tiles = tiles.replace(/[()]/g,'');
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
