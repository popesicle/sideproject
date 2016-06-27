/**
 * Created by tylerneustaedter on 6/27/16.
 */

function Player(){
    this.name = '';
    this.characters = [];

    return this;
}

function Character(){
    this.name = '';
}

function removeCharacter(character){
    var array = this.characters;
    var index = array.indexOf(character);

    array.splice(index, 1);

    return this;
}



Player.prototype.createCharacter = createCharacter;
Player.prototype.removeCharacter = removeCharacter;

function createCharacter(character){
    var newCharacter = new Character;

    newCharacter.name = character;
    this.characters.push(newCharacter);
    console.log(this, 'a new character has been created');
}


var MakeCharacter = React.createClass({
    getInitialState: function() {
        return {player: '', character: '', user: ''}
    },
    handlePlayerChange: function(e) {
        this.setState({player: e.target.value})
    },
    handleCharacterChange: function(e) {
        this.setState({character: e.target.value})
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var player = this.state.player.trim(),
            character = this.state.character.trim();
        if (!player) {
            return;
        }
        console.log(player);
        var newPlayer = new Player;

        newPlayer.name = player;
        newPlayer.createCharacter(character);

        this.setState({player: '', character: '', user: newPlayer});
        this.props.onPlayerSubmit({player: newPlayer})
    },
    render: function() {
        return (
            <form className="playerForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={this.state.player}
                    onChange={this.handlePlayerChange}
                />
                <input
                    type="text"
                    placeholder="Character Name"
                    value={this.state.character}
                    onChange={this.handleCharacterChange}
                />
                <input
                    type="submit" value="Post"
                />
            </form>
        )
    }
});

var CharacterList = React.createClass({
    handlePlayerSubmit: function(player) {
        var player = player.player;

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            //data: player,
            success: function(data) {
                //this.setState({data: data});
                console.log('ninjas success')
            }.bind(this),
            error: function(xhr,status,err) {
                console.log('ninjas failure');
                //this.setState({data: comments});
                console.error(this.props.url, status, err.toString())
            }
        })
    },
    render: function() {
        return (
            <div>
                Make a new Player
                <MakeCharacter onPlayerSubmit={this.handlePlayerSubmit} />
            </div>
        );
    }
});

ReactDOM.render(
    <CharacterList url="/api/characters" pollInterval={2000}/>,
    document.getElementById('content')
);