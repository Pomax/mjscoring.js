var ScoringRow = React.createClass({

  // There isn't much to do in this class other than just render a table row
  render: function() {
    var cells = this.props.scores.map(function(handData, idx) {
      return <td key={idx}><ScoringEntry data={handData} /></td>;
    });
    return (
      <tr>
        <td>hand {this.props.hand}</td>
        {cells}
      </tr>
    );
  }

});
