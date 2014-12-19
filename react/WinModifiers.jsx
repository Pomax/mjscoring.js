var WinModifiers = React.createClass({

  componentDidMount: function() {
    this.buttons = [
      "selfdrawn",
      "pair",
      "major",
      "onechance",
      "lastwall",
      "lastdiscard",
      "supplement",
      "kongrob",
      "turnone"
    ];
  },

  render: function() {
    return (
      <div className="winmodifiers">
        <button ref="selfdrawn"   onClick={this.press}>Self drawn</button>
        <button ref="pair"        onClick={this.press}>Pair</button>
        <button ref="major"       onClick={this.press}>Major pair</button>
        <button ref="onechance"   onClick={this.press}>One chance</button>
        <button ref="lastwall"    onClick={this.press}>Last wall tile</button>
        <button ref="lastdiscard" onClick={this.press}>Last discard</button>
        <button ref="supplement"  onClick={this.press}>Supplement tile</button>
        <button ref="kongrob"     onClick={this.press}>Robbed a kong</button>
        <button ref="turnone"     onClick={this.press}>Ready on first turn</button>
      </div>
    );
  },

  // ==========================================

  reset: function() {
    var self = this;
    this.buttons.forEach(function(ref) {
      self.refs[ref].getDOMNode().classList.remove("pressed");
    })
  },

  press: function(event) {
    var button = event.target;
    button.classList.toggle("pressed");
  },

  getExtras: function() {
    var self = this;
    var extras = {}
    this.buttons.forEach(function(ref) {
      extras[ref] = self.refs[ref].getDOMNode().classList.contains("pressed");
    });
    return extras;
  },

});
