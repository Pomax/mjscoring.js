# React notes

## State changes are scheduled. Overwritingly.

```
    this.setState({ thing: this.state.thing + 1 });
    this.setState({ thing: this.state.thing + 1 });
    this.setState({ thing: this.state.thing + 1 });
```

  results in "thing" being thing + 1, not thing + 3, as "thing" does not update until the next tick.

## There does not seem to be a React way to grab things from inside the component template other than through this.refs

  if, JSX wise, we have:

```
    <Thing>
      <h1>...</h1>
      <div>
        <OtherThing />
        <OtherThing />
        <OtherThing />
      </div>
    </Thing>
```
  Then there is no way to get to those OtherThing elements, except by using:

```
    <Thing>
      <h1>...</h1>
      <div ref="otherthings">
        <OtherThing />
        <OtherThing />
        <OtherThing />
      </div>
    </Thing>
```

  paired with this.refs.otherthings.children -- if we have multiple clusters of OtherThing elements, then React favours extreme modularisation over letting you (effectively) query-select the component's content structure.

## dynamically generating elements "into" the template means rebuilding the template from state.

```
    getInitialState: function() {
      return {
        things: []
      };
    },

    render: function() {
      var entries = [];
      this.state.things.forEach(function(data) {
        entries.push( React.createElement(SomeThing, data) );
      });
      return (
        <div ref="history">{entries}</div>
      );
    },

    addThingFromData: function(data) {
      this.setState({
        things: this.state.things.concat([data])
      });
    }
```

  This may seem daft, but React is state driven, so state's immutable, and state updates trigger rerender.
