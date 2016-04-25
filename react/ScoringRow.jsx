var ScoringRow = React.createClass({

  getInitialState: function() {
    return { showdetails: this.props.showdetails };
  },

  componentWillUpdate: function(props, state) {
    if (this.toggled) {
      return (this.toggled = false);
    }

    if(props.showdetails !== this.props.showdetails) {
      this.setState({ showdetails: props.showdetails});
    }
  },

  // There isn't much to do in this class other than just render a table row
  render: function() {
    var row = this.props.row;
    var showdetails = this.state.showdetails;
    var cells = this.props.scores.map(function(handData, idx) {
      return (
        <td key={'cell-' + row + '-' + idx}>
          <ScoringEntry data={handData} showlog={showdetails} cell={row+'-'+idx}/>
        </td>
      );
    });
    return (<tr onClick={this.showDetails}> <td>hand {this.props.hand}</td> {cells} </tr>);
  },


  // ==========================================


  showDetails: function() {
    this.toggled = true;
    this.setState({
      showdetails: !this.state.showdetails
    });
  }

});
