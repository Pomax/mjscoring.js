var ScoringEntry = React.createClass({

  render: function() {
    var data = this.props.data;
    var handtiles = '';
    if(data.tiles) handtiles = <div className="tiles">hand: {data.tiles}</div>;
    return (
      <div className="entry">
        <div onClick={this.toggleLog}>
          <div className="info" data-winner={data.winner} data-amount={data.values.balance}> points</div>
        </div>
        <div className="hidden log" onClick={this.hideLog} ref="log">
          <div>{data.values.tilepoints} tilepoints, {data.values.amount} points total</div>
          {handtiles}
          {data.log.map(function(line,idx) {
            return <div key={idx} className="line">{line}</div>;
          })}
        </div>
      </div>
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
