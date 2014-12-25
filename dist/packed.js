var Bonus=React.createClass({displayName:"Bonus",componentDidMount:function(){this.flowers=[this.refs.f1,this.refs.f2,this.refs.f3,this.refs.f4],this.seasons=[this.refs.s1,this.refs.s2,this.refs.s3,this.refs.s4],this.buttons=this.flowers.concat(this.seasons),document.addEventListener("bonustile-claimed",this.handleClaim)},render:function(){return React.createElement("div",{className:"bonus"},React.createElement("div",{className:"flowers"},React.createElement(Button,{ref:"f1",name:"f1",label:"1",onClick:this.handleExclusion}),React.createElement(Button,{ref:"f2",name:"f2",label:"2",onClick:this.handleExclusion}),React.createElement(Button,{ref:"f3",name:"f3",label:"3",onClick:this.handleExclusion}),React.createElement(Button,{ref:"f4",name:"f4",label:"4",onClick:this.handleExclusion})),React.createElement("div",{className:"seasons"},React.createElement(Button,{ref:"s1",name:"s1",label:"1",onClick:this.handleExclusion}),React.createElement(Button,{ref:"s2",name:"s2",label:"2",onClick:this.handleExclusion}),React.createElement(Button,{ref:"s3",name:"s3",label:"3",onClick:this.handleExclusion}),React.createElement(Button,{ref:"s4",name:"s4",label:"4",onClick:this.handleExclusion})))},reset:function(){this.buttons.forEach(function(e){e.reset()})},getFlowers:function(){return this.flowers.map(function(e){return e.isPressed()})},getSeasons:function(){return this.seasons.map(function(e){return e.isPressed()})},handleExclusion:function(e){document.dispatchEvent(new CustomEvent("bonustile-claimed",{detail:{name:e.target.props.name,source:this}}))},handleClaim:function(e){e.detail.source!==this&&this.refs[e.detail.name].reset()},setDisabled:function(e){this.buttons.forEach(function(t){t.setDisabled(e)})},setBonus:function(e){var t=this;e.forEach(function(e,s){t.buttons[s].setPressed(e)})}}),ChineseClassical=React.createClass({displayName:"ChineseClassical",winds:["e","s","w","n"],dragons:["c","f","p"],wincount:14,basicwin:10,base:2e3,limit:1e3,deadwall:16,limits:{"all green":"bamboo 2, 3, 4, 6, 8 and green dragons only","all honours":"no numbered tiles in winning hand","all terminals":"pung hand consisting only of 1s and 9s","big four winds":"Pungs for all winds, and any pair to complete the pattern","earthly hand":"non-dealer wins on dealer's first discard","four kongs":"hand consisting of four kongs and a pair","fully concealed one suit hand":"any legal winning hand, one suit, fully concealed (open kongs from concealed pungs count)","fully concealed pung hand":"open kongs from concealed pungs count","heavenly hand":"east wins on their dealt hand","kong on kong":"form any kong, form another kong with its supplement tile, then win on the second supplement tile","moon from the bottom of the sea":"win off of the last discard or last wall tile, if it's dots 1","nine gates":"111, 2345678, 999 + pair tile, all same suit","plum blossom on the roof":"win on a supplement time, if it's dots 5","scratching a carrying pole":"win by robbing a kong of bamboo 2","thirteen orphans":"1+9 of each suit, each wind once, each dragon once, + pair tile","thirteen wins":"draws set the number of consecutive wins to zero","three great scholars":"hand contains three big dragons"},render:function(){return React.createElement("div",null)},capLimit:function(e){e.limit||(e.value=Math.min(e.tilepoints*Math.pow(2,e.doubles),this.limit))},rotate:function(e){return 0===e?!1:-1},scoreLimit:function(e,t){e.winner=!0,e.limit=!0,e.tilepoints=0,e.doubles=0,e.value=this.limit,e.log=["limit hand: "+t]},scorePoints:function(e,t,s){e.tilepoints+=t,e.log.push(t+" points for "+s)},scoreDoubles:function(e,t,s){e.doubles+=t,e.log.push(t+" double"+(t>1?"s":"")+" for "+s)},makeScoreObject:function(){var e={tilepoints:0,doubles:0,winner:!1,log:[],sets:[],getHand:function(){return{winner:e.winner,values:{tilepoints:e.tilepoints,amount:e.value,balance:e.balance},tiles:e.sets.map(function(e){var t=e.tiles.join("");return e.suit&&(t=e.suit.substring(0,1)+"."+t),t}).join(","),log:e.log}}};return e},preprocess:function(e,t,s,n,i){var r=this;e.sets=s.map(function(e){var t=e.getTiles(),s=t[0],a=e.getSuit(),o=e.getConcealed(),c=t.every(function(e){return parseInt(e,10)==e}),l=c&&t.every(function(e){return 1==e||9==e}),u=r.dragons.indexOf(s)>-1,h=t.every(function(e){return e==s}),d=h&&2===t.length,f=h&&(u||s===r.winds[n]||s===r.winds[i]),p=h&&3===t.length,m=h&&4===t.length,g=e.state.ckong,b={tiles:t,tile:s,suit:a,concealed:o,numeric:c,terminal:l,dragon:u,wind:!c&&!u,same:h,pair:d,major:f,pung:p,kong:m,ckong:g};return e.properties=b,b})},scoreBonus:function(e,t,s){var n=this,i=t.getFlowers(),r=t.getSeasons();i.forEach(function(t,s){t&&n.scorePoints(e,4,"flower "+(s+1))}),r.forEach(function(t,s){t&&n.scorePoints(e,4,"season "+(s+1))}),i[s]&&r[s]&&this.scoreDoubles(e,1," having own flower and season");var a=i.reduce(function(e,t){return e&&t});a&&this.scoreDoubles(e,1,"having all flowers");var o=r.reduce(function(e,t){return e&&t});o&&this.scoreDoubles(e,1,"having all seasons")},scoreSets:function(e,t,s,n){var i=this;e.sets.forEach(function(t){i.scoreSet(e,t,s,n)}),i.scorePattern(e,t,s,n)},scoreSet:function(score,set,ownwind,windoftheround){with(set){var points,reason;if(numeric&&!pung&&!kong)return;if(same&&pair&&concealed)return tile===this.winds[ownwind]&&this.scorePoints(score,2,"a concealed pair of own winds"),tile===this.winds[windoftheround]&&this.scorePoints(score,2,"a concealed pair of wind of the round"),void(this.dragons.indexOf(tile)>-1&&this.scorePoints(score,2,"a concealed pair of dragons"));if(pair)return;if(numeric)return points=(pung?1:4)*(terminal?concealed?8:4:concealed?4:2),reason="a "+(concealed?"concealed ":"")+(pung?"pung":"kong")+" of "+(terminal?"terminals":"simples"),void this.scorePoints(score,points,reason);points=(pung?1:4)*(concealed?8:4),reason="a "+(concealed?"concealed ":"")+(pung?"pung":"kong")+" of "+(dragon?"dragons":"winds"),this.scorePoints(score,points,reason),tile===this.winds[ownwind]?this.scoreDoubles(score,1,"a "+(pung?"pung":"kong")+" of own winds"):tile===this.winds[windoftheround]?this.scoreDoubles(score,1,"a "+(pung?"pung":"kong")+" of the wind of the round"):this.dragons.indexOf(tile)>-1&&this.scoreDoubles(score,1,"a "+(pung?"pung":"kong")+" of dragons")}},scorePattern:function(score,sets,wind,windoftheround){var self=this,properties=sets.map(function(e){return e.properties}),concealedTriplets=0;properties.forEach(function(p){with(p)same&&(concealed&&(pung||kong)?concealedTriplets++:kong&&ckong&&concealedTriplets++)}),concealedTriplets>=3&&self.scoreDoubles(score,1,"having three concealed triplets");var wpung=0,wpair=0,dpung=0,dpair=0;properties.forEach(function(p){with(p)same&&!numeric&&(dragon?pung||kong?dpung++:pair&&dpair++:pung||kong?wpung++:pair&&wpair++)}),3===wpung&&1===wpair&&self.scoreDoubles(score,1,"having little four winds"),4===wpung&&self.scoreDoubles(score,4,"having big four winds"),2===dpung&&1===dpair?self.scoreDoubles(score,1,"having little three dragons"):3===dpung&&self.scoreDoubles(score,2,"having big three dragons")},scoreWinner:function(e,t,s,n,i,r){var a=this;if(t)return this.scoreLimit(e,t);if(!(s.length<5)){var o=s.map(function(e){return e.properties.tiles.length}).reduce(function(e,t){return e+t});if(!(o<this.wincount)){e.winner=!0,a.scorePoints(e,a.basicwin,"winning");var c=s.map(function(e){return e.properties});c.every(function(e){return e.concealed})&&a.scoreDoubles(e,1,"a fully concealed hand");var l=!1;c.forEach(function(e){e.pair&&e.major&&(l=!0)}),!l&&c.every(function(e){return!e.pung&&!e.kong})&&a.scoreDoubles(e,1,"a chow hand"),c.every(function(e){return e.pair||e.pung||e.kong})&&a.scoreDoubles(e,1,"a pung hand"),c.every(function(e){return(e.pair||e.pung||e.kong)&&(e.terminal||e.dragon||e.wind)})&&a.scoreDoubles(e,1,"a terminals and honours hand");var u=[],h=!1;c.forEach(function(e){var t=e.suit;t?-1===u.indexOf(t)&&u.push(t):h=!0});var d=1===u.length;d!==!1&&h&&a.scoreDoubles(e,1,"a one suit and honours hand"),d===!1||h||a.scoreDoubles(e,3,"a one suit hand"),r.selfdrawn&&a.scorePoints(e,2,"a self drawn win"),r.pair&&a.scorePoints(e,2,"going out on a pair"),r.major&&a.scorePoints(e,2,"going out on a major pair"),r.onechance&&a.scorePoints(e,2,"winning with a 'one chance' hand"),r.lastwall&&a.scoreDoubles(e,1,"winning on the last wall tile"),r.lastdiscard&&a.scoreDoubles(e,1,"winning on the last discard"),r.supplement&&a.scoreDoubles(e,1,"winning on a supplement tile"),r.kongrob&&a.scoreDoubles(e,1,"robbing a kong to win"),r.turnone&&a.scoreDoubles(e,1,"ready on turn one"),0===n&&a.scoreDoubles(e,1,"winning as east")}}},award:function(e,t){var s=!1,n=!1,i=!1,r=!1,a=!1;e.forEach(function(e,o){t[o].winner&&(n=e,i=o,0===e.currentWind&&(s=!0)),e.getNineTileError()&&(r=e,a=o)});var o=t[i].value,c=[0,0,0,0];r?(o=4*o,c[i]=o,c[a]=-o):e.forEach(function(e,t){if(t!==i){var s=o*(0===e.currentWind?2:1);c[t]-=s,c[i]+=s}});var l,u,h,d,f,p;for(l=0;4>l;l++)if(l!==i)for(h=e[l],f=t[l].value,u=l+1;4>u;u++)u!==i&&(d=e[u],p=t[u].value,diff=(f-p)*(0===h.currentWind||0===d.currentWind?2:1),0!==diff&&(c[l]+=diff,c[u]-=diff));return e.map(function(e,s){return t[s].balance=c[s],e.receivePoints(c[s]),t[s].getHand()})},processIllegalOut:function(e,t){e.forEach(function(e){e!==t&&e.receivePoints(300)}),t.receivePoints(-900)}}),Game=React.createClass({displayName:"Game",currentWOTR:0,visibles:["next","reset","draw","score","extras"],getInitialState:function(){return{hand:"-",draws:0,windoftheround:"-",finished:!1}},cache:function(){stateRecorder.saveState()},loadState:function(e){this.setState(e)},componentDidMount:function(){stateRecorder.register(this);var e=this;this.rules=this.refs.rules,this.players=[this.refs.p1,this.refs.p2,this.refs.p3,this.refs.p4],this.players.forEach(function(t,s){t.playerId=s,t.setWind(s),t.useRules(e.rules),t.setGame(e)}),this.rules.setPlayers(this.players),this.scores=this.refs.scoring,this.__endGame();var t=new HandGenerator(this.players);t.generate()},render:function(){var e="wind"+this.state.windoftheround;return React.createElement("div",{className:"game"},React.createElement("div",{ref:"info"},"Hand: ",this.state.hand," (",this.state.draws," draws) Wind of the round: ",React.createElement("span",{className:e},this.state.windoftheround)),React.createElement("div",{ref:"players"},React.createElement(Player,{ref:"p1"}),React.createElement(Player,{ref:"p2"}),React.createElement(Player,{ref:"p3"}),React.createElement(Player,{ref:"p4"})),React.createElement("div",{ref:"buttons",className:"play-buttons"},React.createElement(Button,{type:"signal",ref:"start",name:"start",onClick:this.start,label:"New Game"}),React.createElement(Button,{type:"signal",ref:"reset",name:"reset",onClick:this.reset,label:"Reset this hand"}),React.createElement(Button,{type:"signal",ref:"draw",name:"draw",onClick:this.draw,label:"This hand is a draw"}),React.createElement(Button,{type:"signal",ref:"score",name:"score",onClick:this.score,label:"Score",className:"score"}),React.createElement(Button,{type:"signal",ref:"next",name:"next",onClick:this.advance,label:"Advance hand"})),React.createElement("div",null,"Scoring extras:"),React.createElement(WinModifiers,{ref:"extras"}),React.createElement(ScoringArea,{ref:"scoring"}),React.createElement(Rules,{ref:"rules"}))},start:function(){this.__start(),this.setState({hand:1,draws:0,windoftheround:0},this.cache),document.dispatchEvent(new CustomEvent("game-started",{detail:{}}))},__start:function(){this.reset(),this.refs.start.setDisabled(!0),this.visibles.forEach(function(e){this.refs[e].setDisabled(!1)}.bind(this)),this.players.forEach(function(e){e.setDisabled(!1)})},advance:function(){this.nextHand({currentWind:2})},__endGame:function(){this.refs.start.setDisabled(!1),this.visibles.forEach(function(e){this.refs[e].setDisabled(!0)}.bind(this)),this.players.forEach(function(e){e.setDisabled(!0)})},reset:function(){this.players.forEach(function(e){e.reset()}),this.refs.extras.reset()},draw:function(){this.reset(),this.setState({draws:this.state.draws+1,hand:this.state.hand+1})},processIllegalOut:function(e){this.rules.processIllegalOut(this.players,e),this.draw()},score:function(){var e,t=this,s=this.players.map(function(s){var n=t.rules.score(s,t.state.windoftheround,t.winds,t.refs.extras.getExtras());return n.winner&&(e=s,e.receiveWin()),n});if(!e)return alert("No one has won yet\n\n(Illegal win, Draw, or accidentally pressed Score?)");stateRecorder.replaceState();var n=this.rules.award(this.players,s);this.scores.recordHands(n,this.state.hand,this.state.windoftheround),this.nextHand(e)},nextHand:function(e){var t=this.rules.rotate(e.currentWind),s=this.state.windoftheround,n=this.state.finished;e&&t&&(this.players.forEach(function(e){e.nextWind(t)}),0===this.players[0].currentWind&&s++,s>=4&&(this.__endGame(),n=!0)),n?this.setState({hand:this.state.hand+" played",windoftheround:"none, this game is finished.",finished:!0},this.cache):(this.reset(),this.setState({windoftheround:s,hand:this.state.hand+1},this.cache))}}),LimitHands=React.createClass({displayName:"LimitHands",getInitialState:function(){return{limit:0,limits:{}}},componentDidMount:function(){this.select=this.refs.limits.getDOMNode(),stateRecorder.register(this)},loadState:function(e){this.setState(e),this.select.selectedIndex=e.limit},render:function(){var e=Object.keys(this.state.limits).sort().map(function(e,t){return React.createElement("option",{key:t},e)}),t=this.state.limits[this.state.limit];return React.createElement("select",{ref:"limits",className:"limits",value:t,onChange:this.selectLimit},e)},useRules:function(e){var t=e.limits();t["--- limit hands ---"]="--- limit hands ---",this.setState({limits:t})},reset:function(){this.select.selectedIndex=0,this.setState({limit:0})},selectLimit:function(){this.setState({limit:this.select.selectedIndex})},getLimit:function(){var e=this.select.selectedIndex;return 0===e?!1:this.select.options[e].textContent}}),Player=React.createClass({displayName:"Player",playerId:0,currentScore:0,currentWind:0,getInitialState:function(){return{wind:0,name:"",score:0,wins:0,disabled:!1}},componentDidMount:function(){this.history=this.refs.history,this.sets=[this.refs.s1,this.refs.s2,this.refs.s3,this.refs.s4,this.refs.s5],stateRecorder.register(this)},loadState:function(e){this.currentWind=e.wind,this.currentScore=e.score,this.setState(e)},render:function(){var e="wind"+this.state.wind,t="player pwidth";return this.state.disabled&&(t+=" disabled"),React.createElement("div",{className:t},React.createElement("div",{ref:"playerinfo"},React.createElement("span",{className:e},this.state.wind),React.createElement("input",{type:"text",className:"name",value:this.state.name,placeholder:"player name here",onChange:this.setName}),React.createElement("span",{className:"scoring"},"score: ",React.createElement("span",{onClick:this.overrideScore},this.state.score),"/",React.createElement("span",{onClick:this.overrideWins},this.state.wins))),React.createElement(Bonus,{ref:"bonus"}),React.createElement(Set,{ref:"s1"}),React.createElement(Set,{ref:"s2"}),React.createElement(Set,{ref:"s3"}),React.createElement(Set,{ref:"s4"}),React.createElement(Set,{ref:"s5"}),React.createElement(Button,{ref:"ninetile",label:"nine tile error!"}),React.createElement(Button,{ref:"illegal",onClick:this.confirmIllegalOut,label:"illegal win declaration!",type:"signal"}),React.createElement(LimitHands,{ref:"limits"}))},overrideScore:function(){var e=prompt("Please specify a new score for this player:");e&&(this.currentScore=parseInt(e,10),this.setState({score:this.currentScore}))},overrideWins:function(){var e=prompt("Please specify the number of wins this player:");e&&this.setState({wins:parseInt(e,10)})},setName:function(e){this.setState({name:e.target.value})},confirmIllegalOut:function(){var e="declaring a win despite not having a winning hand",t="Are you sure you want this player to be penalised for "+e+"?",s=confirm(t);s&&this.game.processIllegalOut(this)},setGame:function(e){this.game=e},setWind:function(e){this.currentWind=e,this.setState({wind:this.currentWind})},reset:function(){this.sets.forEach(function(e){e.reset()}),this.refs.bonus.reset(),this.refs.limits.reset(),this.refs.ninetile.reset()},useRules:function(e){this.rules=e,this.currentScore=e.base,this.setState({score:this.currentScore}),this.refs.limits.useRules(e)},nextWind:function(e){var t=this.state.wind+e;0>t?t=3:t>3&&(t=0),this.setWind(t)},getSets:function(){return this.sets.filter(function(e){return!e.empty()})},getBonus:function(){return this.refs.bonus},getLimit:function(){return this.refs.limits.getLimit()},getNineTileError:function(){return this.refs.ninetile.isPressed()},receivePoints:function(e){this.currentScore+=e,this.setState({score:this.currentScore})},receiveWin:function(){this.setState({wins:this.state.wins+1})},setDisabled:function(e){this.refs.bonus.setDisabled(e),this.sets.forEach(function(t){t.setDisabled(e)}),this.refs.ninetile.setDisabled(e),this.refs.illegal.setDisabled(e),this.setState({disabled:e})},setHand:function(e){var t=this;this.refs.bonus.setBonus(e.bonus),e.sets.forEach(function(e,s){t.refs["s"+(1+s)].setTiles(e.tiles,e.suit)})}}),Rules=React.createClass({displayName:"Rules",componentDidMount:function(){this.ruleset=this.refs.current,this.base=this.ruleset.base},render:function(){return React.createElement("div",{ref:"rules"},React.createElement(ChineseClassical,{ref:"current"}))},setPlayers:function(e){this.players=e},limits:function(){return this.ruleset.limits},rotate:function(e){return this.ruleset.rotate(e)},score:function(e,t,s,n){var i=e.getSets(),r=e.getBonus(),a=e.getLimit(),o=e.currentWind,c=this.ruleset.makeScoreObject();return this.ruleset.preprocess(c,r,i,o,t),this.ruleset.scoreBonus(c,r,o,t),this.ruleset.scoreSets(c,i,o,t),this.ruleset.scoreWinner(c,a,i,o,t,n),this.ruleset.capLimit(c),c},award:function(e,t){return this.ruleset.award(e,t)},processIllegalOut:function(e,t){this.ruleset.processIllegalOut(e,t)}}),ScoringArea=React.createClass({displayName:"ScoringArea",getInitialState:function(){return{entries:[]}},componentDidMount:function(){stateRecorder.register(this)},render:function(){var e=this.state.entries.map(function(e,t){return React.createElement(ScoringRow,{scores:e.scores,hand:e.hand,windoftheround:e.wotr,key:t,showdetails:0===t})});return React.createElement("table",{ref:"scoring",className:"scoring-area"},e)},recordHands:function(e,t,s){var n={scores:e,hand:t,wotr:s};this.setState({entries:[n].concat(this.state.entries)})}}),ScoringEntry=React.createClass({displayName:"ScoringEntry",render:function(){var e=this.props.data,t=e.tiles?React.createElement(TileBank,{ref:"tilebank",handtiles:e.tiles}):"",s=(this.props.showlog?"":"hidden ")+"log";return React.createElement("div",{className:"entry"},React.createElement("div",{onClick:this.toggleLog},React.createElement("div",{className:"info","data-winner":e.winner,"data-amount":e.values.balance}," points")),React.createElement("div",{className:s,onClick:this.hideLog,ref:"log"},React.createElement("div",null,e.values.tilepoints," tilepoints, ",e.values.amount," points total"),t,e.log.map(function(e,t){return React.createElement("div",{key:t,className:"line"},e)})))}}),ScoringRow=React.createClass({displayName:"ScoringRow",getInitialState:function(){return{showdetails:!1}},componentDidMount:function(){this.setState({showdetails:this.props.showdetails})},render:function(){var e=this.state.showdetails,t=this.props.scores.map(function(t,s){return React.createElement("td",{key:s},React.createElement(ScoringEntry,{data:t,showlog:e}))});return React.createElement("tr",{onClick:this.showDetails}," ",React.createElement("td",null,"hand ",this.props.hand)," ",t," ")},showDetails:function(){this.setState({showdetails:!this.state.showdetails})}}),Set=React.createClass({displayName:"Set",resets:["characters","bamboo","dots","tilebank","concealed"],getInitialState:function(){return{set:"",ckong:!1}},componentDidMount:function(){stateRecorder.register(this)},loadState:function(e){this.setState(e),this.updateTileBank(this.getTilesString())},render:function(){return React.createElement("div",{className:"set"},React.createElement("input",{ref:"tiles",type:"text",value:this.state.set,onChange:this.updateSet}),React.createElement(Button,{ref:"characters",name:"characters",onClick:this.press,label:"萬"}),React.createElement(Button,{ref:"bamboo",name:"bamboo",onClick:this.press,label:"竹"}),React.createElement(Button,{ref:"dots",name:"dots",onClick:this.press,label:"◎"}),React.createElement(TileBank,{ref:"tilebank",concealed:this.state.ckong,bankpress:this.bankpress}),React.createElement(Button,{ref:"concealed",name:"concealed",label:"..."}))},reset:function(){this.setState({set:""}),this.resets.forEach(function(e){this.refs[e].reset()}.bind(this))},updateTileBank:function(e){this.refs.tilebank.setTiles(e)},press:function(e){var t=this;["characters","bamboo","dots"].forEach(function(s){var n=t.refs[s];e.target!==n&&n.setPressed(!1)});var s=this.getTilesString();this.updateTileBank(s)},bankpress:function(){4===this.getTiles().length&&this.setState({ckong:!this.state.ckong})},updateSet:function(e){var t=e.target.value;this.setTiles(t)},setTiles:function(e,t){var s,n;if(e){t&&this.refs[t].setPressed(!0),s=this.refs.tiles.getDOMNode(),s.value=e,e.match(/\d/)&&(e.indexOf("c")>-1?(e=e.replace("c",""),s.value=e,n=this.refs.characters,n.press(),this.press({target:n})):e.indexOf("b")>-1?(e=e.replace("b",""),s.value=e,n=this.refs.bamboo,n.press(),this.press({target:n})):e.indexOf("d")>-1&&(e=e.replace("d",""),s.value=e,n=this.refs.dots,n.press(),this.press({target:n}))),e.match(/!/)&&(e=e.replace("!",""),s.value=e,this.refs.concealed.press());var i=this.getTilesString();this.updateTileBank(i)}else this.updateTileBank(!1);this.setState({set:e})},empty:function(){return""===this.state.set.trim()},getSuit:function(){for(var e=["characters","bamboo","dots"],t=e.length,s=0;t>s;s++){{var n=e[s];this[n]}if(this.refs[n].isPressed())return n}return!1},getTiles:function(){var e=this.refs.tiles.getDOMNode().value;return e=e.split("").map(function(e){return parseInt(e,10)==e?parseInt(e,10):e})},getConcealed:function(){return this.refs.concealed.isPressed()},getTilesString:function(){var e=this.getSuit(),t=this.getTiles(),s=t.join(""),n=this.getConcealed(),i=function(e){return e&&n?"("+e+")":e};return t.length>0?"number"==typeof t[0]?e?i(e.substring(0,1)+"."+s):!1:i(s):!1},setDisabled:function(e){this.refs.characters.setDisabled(e),this.refs.bamboo.setDisabled(e),this.refs.dots.setDisabled(e),this.refs.concealed.setDisabled(e)}}),Tile=React.createClass({displayName:"Tile",getInitialState:function(){return{suit:"",face:""}},componentDidMount:function(){this.setState({suit:this.props.suit,face:this.props.face})},render:function(){var e=this.state.suit,t=this.state.face,s="style/tiles/"+e.substring(0,1)+t+".jpg",n=(e?e+" ":"")+t;return React.createElement("img",{className:"tile",src:s,title:n})}}),TileBank=React.createClass({displayName:"TileBank",getInitialState:function(){return{tiles:[]}},componentDidMount:function(){var e=this.props.handtiles;e&&(e=e.split(","),this.setTiles(e))},render:function(){var e=this.props.concealed,t=this.state.tiles.map(function(t,s){var n=3!==s&&e,i=n?"":t.suit,r=n?"concealed":t.face,a=t.suit+t.face+s+(n?"ic":"");return React.createElement(Tile,{suit:i,face:r,key:a})});return React.createElement("div",{className:"tilebank",onClick:this.props.bankpress},t)},reset:function(){this.setState({tiles:[]})},setTiles:function(e){e||(e=[]);var t=[];e.forEach||(e=[e]),e.forEach(function(e){if(e=e.replace(/[()]/g,""),e.indexOf(".")>-1){e=e.split(".");var s=e[0];e=e[1].split(""),e.forEach(function(e){t.push({suit:s,face:e})})}else e=e.split(""),e.forEach(function(e){t.push({suit:"",face:e})})}),this.setState({tiles:t})}}),WinModifiers=React.createClass({displayName:"WinModifiers",componentDidMount:function(){this.buttons=["selfdrawn","pair","major","onechance","lastwall","lastdiscard","supplement","kongrob","turnone"]},render:function(){return React.createElement("div",{className:"winmodifiers"},React.createElement(Button,{ref:"selfdrawn",label:"Self drawn"}),React.createElement(Button,{ref:"pair",label:"Pair"}),React.createElement(Button,{ref:"major",label:"Major pair"}),React.createElement(Button,{ref:"onechance",label:"One chance"}),React.createElement(Button,{ref:"lastwall",label:"Last wall tile"}),React.createElement(Button,{ref:"lastdiscard",label:"Last discard"}),React.createElement(Button,{ref:"supplement",label:"Supplement tile"}),React.createElement(Button,{ref:"kongrob",label:"Robbed a kong"}),React.createElement(Button,{ref:"turnone",label:"Ready on first turn"}))},reset:function(){var e=this;this.buttons.forEach(function(t){e.refs[t].reset()})},getExtras:function(){var e=this,t={};return this.buttons.forEach(function(s){t[s]=e.refs[s].isPressed()}),t},setDisabled:function(e){this.buttons.forEach(function(t){this.refs[t].setDisabled(e)}.bind(this))}}),Button=React.createClass({displayName:"Button",pressed:!1,disabled:!1,getInitialState:function(){return{pressed:this.pressed,disabled:this.disabled}},componentDidMount:function(){this.pressed=!!this.props.pressed,this.setState({pressed:this.pressed}),stateRecorder.register(this)},loadState:function(e){this.pressed=e.pressed,this.setState(e)},render:function(){var e=[this.state.pressed?"pressed":"",this.props.name?this.props.name:""].filter(function(e){return!!e}).join(" ");return React.createElement("button",{disabled:this.state.disabled,className:e,onClick:this.press},this.props.label)},reset:function(){this.pressed=!1,this.setState({pressed:!1})},press:function(e){"signal"!==this.props.type&&(this.pressed=!this.pressed,this.setState({pressed:this.pressed})),e&&this.props.onClick&&(e.target=this,this.props.onClick(e))},isPressed:function(){return this.pressed},setPressed:function(e){this.pressed=e,this.setState({pressed:e})},isDisabled:function(){return this.disabled},setDisabled:function(e){this.disabled=e,this.setState({disabled:this.disabled})}});!function(){var e=document.querySelector("section"),t=e.getBoundingClientRect().height;e.style.height=(0|t)+"px",document.addEventListener("game-started",function(){var e=document.querySelector("section");e.classList.add("slideout")})}();var historyRecorder={eventContext:document,restoreEvent:"popstate",restoreContext:window,save:function(e,t){t=t||{},history.pushState(e,t.title||"",t.url||"")},replace:function(e,t){t=t||{},history.replaceState(e,t.title||"",t.url||"")}},stateRecorder=new StateRecorder(historyRecorder);React.render(React.createElement(Game,null),document.getElementById("app"));