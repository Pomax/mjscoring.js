var Set = React.createClass({

  getInitialState: function() {
    return {
      set: '',
      concealed: false
    };
  },

  componentDidMount: function() {
    this.characters = this.refs.characters.getDOMNode();
    this.bamboo = this.refs.bamboo.getDOMNode();
    this.dots = this.refs.dots.getDOMNode();
  },

  render: function() {
    return (
      <div className="set">
        <input ref="tiles" type="text" value={this.state.set} onChange={this.updateSet} />
        <button className="characters suit" ref="characters" onClick={this.press}>満</button>
        <button className="bamboo suit" ref="bamboo" onClick={this.press}>竹</button>
        <button className="dots suit" ref="dots" onClick={this.press}>◎</button>
        <input ref="concealed" type="checkbox" checked={this.state.concealed} onChange={this.toggleConcealed} />
      </div>
    );
  },

  // ==========================================

  reset: function() {
    this.setState({ set: '', concealed: false });
    this.characters.classList.remove("pressed");
    this.bamboo.classList.remove("pressed");
    this.dots.classList.remove("pressed");
  },

  press: function(event) {
    var button = event.target;
    button.classList.toggle("pressed");
  },

  updateSet: function(event) {
    this.setState({ set: event.target.value });
  },

  toggleConcealed: function() {
    this.setState({
      concealed: !this.state.concealed
    });
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
      if(this[suit].classList.contains("pressed")) return suit;
    }
    return false;
  },

  getTiles: function() {
    var v = this.state.set;
    v = v.split('').map(function(v) {
      if(parseInt(v,10) == v) {
        return parseInt(v,10);
      }
      return v;
    });
    return v;
  },

  getConcealed: function() {
    return this.state.concealed;
  }

});
