var Bonus = React.createClass({

  componentDidMount: function() {
    this.flowers = [this.refs.f1, this.refs.f2, this.refs.f3, this.refs.f4 ],
    this.seasons = [this.refs.s1, this.refs.s2, this.refs.s3, this.refs.s4 ],
    this.buttons = this.flowers.concat(this.seasons);
  },

  render: function() {
    return (
      <div className="bonus">
        <div className="flowers">
          <button ref="f1" onClick={this.press}>1</button>
          <button ref="f2" onClick={this.press}>2</button>
          <button ref="f3" onClick={this.press}>3</button>
          <button ref="f4" onClick={this.press}>4</button>
        </div>
        <div className="seasons">
          <button ref="s1" onClick={this.press}>1</button>
          <button ref="s2" onClick={this.press}>2</button>
          <button ref="s3" onClick={this.press}>3</button>
          <button ref="s4" onClick={this.press}>4</button>
        </div>
      </div>
    );
  },

  // ==========================================

  reset: function() {
    this.buttons.forEach(function(button) {
      button.getDOMNode().classList.remove("pressed");
    })
  },

  press: function(event) {
    var button = event.target;
    button.classList.toggle("pressed");
  },

  getFlowers: function() {
    return this.flowers.map(function(b) {
      return b.getDOMNode().classList.contains("pressed");
    });
  },

  getSeasons: function() {
    return this.seasons.map(function(b) {
      return b.getDOMNode().classList.contains("pressed");
    });
  }

});
