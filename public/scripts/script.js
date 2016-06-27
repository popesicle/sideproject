/**
 * Created by tylerneustaedter on 6/26/16.
 */

function Player(){
    this.name = '';
    this.characters = [];
    this.removeCharacter = function(character){
        var array = this.characters;
        var index = array.indexOf(character);

        array.splice(index, 1);
    };
    this.createCharacter = function(character){
        var array = this.characters,
            newCharacter = new Character();

        newCharacter.name = character;

        array.push(newCharacter);
    }
}

function Character(){
    this.name = '';
}

function newPlayer(name){
    var player = new Player();

        player.name = name;
}

var CreationBox = React.createClass({
    getInitialState: function() {
        return {player: '', name: ''};
    },
    handlePlayerChange: function(e) {
        this.setState({player: e.target.value});
    },
    handleNameChange: function(e) {
        this.setState({name: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var player = this.state.player.trim();
        var text = this.state.text.trim();
        if (!text || !player) {
            return;
        }
        console.log(player);
        this.props.onCommentSubmit({player: player, text: text});
        this.setState({player: '', text: ''});
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.player}
                    onChange={this.handlePlayerChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleNameChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;

        comment.id = Date.now();

        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr,status,err) {
                this.setState({data: comments});
                console.error(this.props.url, status, err.toString())
            }
        })
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
               Create a new
                <CreationBox onCommentSubmit={this.handleCommentSubmit}/>
                <CommentList data={this.state.data}/>
            </div>
        );
    }
});

var Character = React.createClass({
    render: function() {
        return (
            <div className="character">
                <h2 className="characterPlayer">
                    {this.props.player}
                </h2>
                {this.props.children}
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var characterNodes = this.props.data.map(function (character) {
            return (
                <Character player={character.player} key={character.id}>
                    {character.text}
                </Character>
            );
        });
        return (
            <div className="commentList">
                {characterNodes}
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000} />,
    document.getElementById('content')
);