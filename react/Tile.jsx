var Tile = React.createClass({

  getInitialState: function() {
    return {
      suit: '',
      face: ''
    };
  },

  componentDidMount: function() {
    this.setState({
      suit: this.props.suit,
      face: this.props.face
    });
  },

  render: function() {
    var suit = this.state.suit, face = this.state.face;
    var tileimg = "style/tiles/" + suit.substring(0,1) + face + ".jpg";
    var title = (suit?suit+' ':'') + face;
    return (
      <img className="tile" src={tileimg} title={title}/>
    );
  }

});
