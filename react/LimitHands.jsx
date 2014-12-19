var LimitHands = React.createClass({

  componentDidMount: function() {
    this.select = this.refs.limits.getDOMNode();
  },

  render: function() {
    return (
      <select ref="limits" className="limits">
        <option>--- limit hands ---</option>
      </select>
    );
  },

  // ==========================================

  useRules: function(rules) {
    var self = this;
    var limits = rules.limits();
    Object.keys(limits).forEach(function(limit) {
      var option = document.createElement("option");
      option.textContent = limit;
      self.select.appendChild(option);
    });
  },

  reset: function() {
    this.select.selectedIndex = 0;
  },

  getLimit: function() {
    var opt = this.select.selectedIndex;
    if(opt===0) return false;
    return this.select.options[opt].textContent;
  }

});
