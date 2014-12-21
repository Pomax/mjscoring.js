var ScoringEntry = React.createClass({displayName: "ScoringEntry",

  render: function() {
    var data = this.props.data;
    var tilebank = data.tiles ? React.createElement(TileBank, {ref: "tilebank", handtiles: data.tiles}) : '';
    return (
      React.createElement("div", {className: "entry"}, 
        React.createElement("div", {onClick: this.toggleLog}, 
          React.createElement("div", {className: "info", "data-winner": data.winner, "data-amount": data.values.balance}, " points")
        ), 
        React.createElement("div", {className: "hidden log", onClick: this.hideLog, ref: "log"}, 
          React.createElement("div", null, data.values.tilepoints, " tilepoints, ", data.values.amount, " points total"), 
          tilebank, 
          data.log.map(function(line,idx) {
            return React.createElement("div", {key: idx, className: "line"}, line);
          })
        )
      )
    );
  },

  revealLog: function() {
    this.refs.log.getDOMNode().classList.remove("hidden");
  },

  toggleLog: function() {
    this.refs.log.getDOMNode().classList.toggle("hidden");
  },

  hideLog: function() {
    this.refs.log.getDOMNode().classList.add("hidden");
  }

});
