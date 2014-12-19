var ScoringEntry = React.createClass({

  render: function() {
    var data = this.props.data;
    return (
      <div className="entry">
        <div onClick={this.toggleLog}>
          <div className="info" data-winner={data.winner} data-amount={data.amount}> points</div>
        </div>
        <div className="hidden log" onClick={this.hideLog} ref="log">
          <div className="tiles">{data.tiles}</div>

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
  }

});
