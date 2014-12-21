var Bonus = React.createClass({

  componentDidMount: function() {
    this.flowers = [this.refs.f1, this.refs.f2, this.refs.f3, this.refs.f4 ],
    this.seasons = [this.refs.s1, this.refs.s2, this.refs.s3, this.refs.s4 ],
    this.buttons = this.flowers.concat(this.seasons);
    document.addEventListener("bonustile-claimed", this.handleClaim);
  },

  render: function() {
    return (
      <div className="bonus">
        <div className="flowers">
          <Button ref="f1" name="f1" label="1" onClick={this.handleExclusion}/>
          <Button ref="f2" name="f2" label="2" onClick={this.handleExclusion}/>
          <Button ref="f3" name="f3" label="3" onClick={this.handleExclusion}/>
          <Button ref="f4" name="f4" label="4" onClick={this.handleExclusion}/>
        </div>
        <div className="seasons">
          <Button ref="s1" name="s1" label="1" onClick={this.handleExclusion}/>
          <Button ref="s2" name="s2" label="2" onClick={this.handleExclusion}/>
          <Button ref="s3" name="s3" label="3" onClick={this.handleExclusion}/>
          <Button ref="s4" name="s4" label="4" onClick={this.handleExclusion}/>
        </div>
      </div>
    );
  },

  // ==========================================

  reset: function() { this.buttons.forEach(function(button) { button.reset(); })},
  getFlowers: function() { return this.flowers.map(function(button) { return button.isPressed(); }); },
  getSeasons: function() { return this.seasons.map(function(button) { return button.isPressed(); }); },

  // when a bonus tile is claimed, unpress this tile for all other players
  handleExclusion: function(event) {
    document.dispatchEvent(new CustomEvent("bonustile-claimed", {detail: {
      name: event.target.props.name,
      source: this
    }}));
  },

  // event handler for the custom event that gets thrown above
  handleClaim: function(event) {
    if(event.detail.source === this) return;
    this.refs[event.detail.name].reset();
  }

});
