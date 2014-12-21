/**
 * This button can either behave as a "regular" HTML button, or it can act
 * as an actually physical switch with an on/off state. If you press it,
 * the button stayspressed unless you press it again.
 */
var Button = React.createClass({displayName: "Button",
  pressed: false,
  getInitialState: function() { return { pressed: this.pressed }; },
  componentDidMount: function() {
    this.pressed = !!this.props.pressed;
    this.setState({ pressed: this.pressed });
    stateRecorder.register(this);
  },
  loadState: function(state) {
    this.pressed = state.pressed;
    this.setState(state);
  },
  render: function() {
    var pclass = [
      this.state.pressed ? "pressed" : '',
      this.props.name ? this.props.name : ''
    ].filter(function(v) { return !!v; }).join(" ");
    return React.createElement("button", {className: pclass, onClick: this.press}, this.props.label);
  },
  reset: function() {
    this.pressed = false;
    this.setState({ pressed: false });
  },
  press: function(event) {
    if(this.props.type !== "signal") {
      this.pressed = !this.pressed;
      this.setState({ pressed: this.pressed });
    }
    if(this.props.onClick) { event.target = this; this.props.onClick(event); }
  },
  isPressed: function() { return this.pressed; }
});
