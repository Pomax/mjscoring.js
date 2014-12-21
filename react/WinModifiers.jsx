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
        <Button ref="selfdrawn"   label="Self drawn" />
        <Button ref="pair"        label="Pair" />
        <Button ref="major"       label="Major pair" />
        <Button ref="onechance"   label="One chance" />
        <Button ref="lastwall"    label="Last wall tile" />
        <Button ref="lastdiscard" label="Last discard" />
        <Button ref="supplement"  label="Supplement tile" />
        <Button ref="kongrob"     label="Robbed a kong" />
        <Button ref="turnone"     label="Ready on first turn" />
      </div>
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
