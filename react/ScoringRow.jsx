var ScoringRow = React.createClass({

  getInitialState: function() {
    return { showdetails: false };
  },

  componentDidMount: function() {
    this.setState({ showdetails: this.props.showdetails });
  },

  // There isn't much to do in this class other than just render a table row
  render: function() {
    var showdetails = this.state.showdetails;
    var cells = this.props.scores.map(function(handData, idx) {
      return <td key={idx}><ScoringEntry data={handData} showlog={showdetails}/></td>;
    });
    return (<tr onClick={this.showDetails}> <td>hand {this.props.hand}</td> {cells} </tr>);
  },


  // ==========================================


  showDetails: function() {
    this.setState({
      showdetails: !this.state.showdetails
    });
  }

});
