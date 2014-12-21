var Set = React.createClass({

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
      <div className="set">
        <input ref="tiles" type="text" value={this.state.set} onChange={this.updateSet} />
        <Button ref="characters" name="characters" onClick={this.press} label="満" />
        <Button ref="bamboo"     name="bamboo"     onClick={this.press} label="竹" />
        <Button ref="dots"       name="dots"       onClick={this.press} label="◎" />
        <TileBank ref="tilebank" />
        <Button ref="concealed"  name="concealed"  label="..." />
      </div>
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