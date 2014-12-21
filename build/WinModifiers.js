var WinModifiers = React.createClass({displayName: "WinModifiers",

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
      React.createElement("div", {className: "winmodifiers"}, 
        React.createElement(Button, {ref: "selfdrawn", label: "Self drawn"}), 
        React.createElement(Button, {ref: "pair", label: "Pair"}), 
        React.createElement(Button, {ref: "major", label: "Major pair"}), 
        React.createElement(Button, {ref: "onechance", label: "One chance"}), 
        React.createElement(Button, {ref: "lastwall", label: "Last wall tile"}), 
        React.createElement(Button, {ref: "lastdiscard", label: "Last discard"}), 
        React.createElement(Button, {ref: "supplement", label: "Supplement tile"}), 
        React.createElement(Button, {ref: "kongrob", label: "Robbed a kong"}), 
        React.createElement(Button, {ref: "turnone", label: "Ready on first turn"})
      )
    );
  },

  // ==========================================

  reset: function() {
    var self = this;
    this.buttons.forEach(function(ref) {
      self.refs[ref].reset();
    });
  },

  getExtras: function() {
    var self = this;
    var extras = {}
    this.buttons.forEach(function(ref) {
      extras[ref] = self.refs[ref].isPressed();
    });
    return extras;
  },

  setDisabled: function(b) {
    this.buttons.forEach(function(ref) {
      this.refs[ref].setDisabled(b);
    }.bind(this));
  }

});
