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
        <input  ref="tiles" type="text" value={this.state.set} onChange={this.updateSet} />
        <Button ref="characters" name="characters" onClick={this.press} label="萬" />
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
      button.setPressed(false);
    });
    var newtiles = this.getTilesString();
    this.updateTileBank(newtiles);
  },

  updateSet: function(event) {
    var string = event.target.value;
    this.setTiles(string);
  },

  setTiles: function(string, suit) {
    var target, button;
    if(string) {
      if(suit) { this.refs[suit].setPressed(true); }

      target = this.refs.tiles.getDOMNode();
      target.value = string;

      if(string.match(/\d/)) {
        if(string.indexOf("c")>-1) {
          string = string.replace('c','');
          target.value = string;
          button = this.refs.characters;
          button.press();
          this.press({ target: button });
        }
        else if(string.indexOf("b")>-1) {
          string = string.replace('b','');
          target.value = string;
          button = this.refs.bamboo;
          button.press();
          this.press({ target: button });
        }
        else if(string.indexOf("d")>-1) {
          string = string.replace('d','');
          target.value = string;
          button = this.refs.dots;
          button.press();
          this.press({ target: button });
        }
      }
      if(string.match(/!/)) {
        string = string.replace('!','');
        target.value = string;
        this.refs.concealed.press();
      }
      var tstring = this.getTilesString();
      this.updateTileBank(tstring);
    } else { this.updateTileBank(false); }

    this.setState({ set: string });
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
    var suit = this.getSuit();
    var tiles = this.getTiles();
    var joined = tiles.join('');
    var concealed = this.getConcealed();
    var wrap = function(input) {
      if(!input) return input;
      return concealed ? "(" + input + ")" : input;
    };
    if(tiles.length>0) {
      if (typeof tiles[0] === "number") {
        if(!suit) return false;
        return wrap(suit.substring(0,1) + "." + joined);
      }
      return wrap(joined);
    }
    return false;
  },

  setDisabled: function(b) {
    this.refs.characters.setDisabled(b);
    this.refs.bamboo.setDisabled(b);
    this.refs.dots.setDisabled(b);
    this.refs.concealed.setDisabled(b);
  }

});
