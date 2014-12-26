var TileBank = React.createClass({

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
    var concealed = this.props.concealed;
    var tiles = this.state.tiles.map(function(tile, idx) {
      var ic = (idx!==3 && concealed);
      var suit = ic ? '' : tile.suit;
      var face = ic ? "concealed" : tile.face;
      var key = tile.suit + tile.face + idx + (ic?'ic':'');
      return <Tile suit={suit} face={face} key={key}/>
    });
    return <div className="tilebank" onClick={this.props.bankpress}>{tiles}</div>;
  },


  // ==========================================


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
        if(tiles.match(/f\d/) || tiles.match(/s\d/)) {
          banktiles.push({ suit: "", face: tiles });
        } else {
          tiles = tiles.split('');
          tiles.forEach(function(face) {
            banktiles.push({ suit: "", face: face });
          });
        }
      }
    });
    this.setState({ tiles: banktiles });
  }

});
