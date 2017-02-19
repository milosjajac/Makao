import Games from '../Redis/Games';
import App from '../Redis/App';
import User from '../models/user';

module.exports = function (socket) {
    var socketUser = socket.decoded_token.name;
    // Socket can emit 'user:info' or any other message
    // only after being authenticated, so we're safe to continue.
    socket.on('user:info', () => {
        console.log('user ' + socketUser + ' connected to appSocket');
        App.setUserSocket(socketUser, socket.id);
        let userInfo = {
            id: socket.decoded_token.sub,
            username: socketUser
        }
        socket.emit('user:info', userInfo);
    });

    socket.on('user:friends', () => {
        User.findByUsername(socketUser, (err, user) => {
            socket.emit('user:friends', user.friends);
        })
    });

    socket.on('friend:accept', (friendUsername) => {
        User.addFriend(socketUser, friendUsername, (err) => {
            socket.emit('friend:added', friendUsername);
        });
    });

    socket.on('friend:ignore', (friendUsername) => {
        User.removeFriendRequest(socketUser, friendUsername, (err) => {
            socket.emit('friend:ignore', friendUsername);
        });
    });

    socket.on('invite:accept', (creatorUsername) => {
        let gameState, lobbyCount, gameRules;
        Games.getGameState(creatorUsername)
            .then((state) => gameState = state);
        Games.getLobby(creatorUsername)
            .then((users) => lobbyCount = users.length());
        Games.getGameRules(creatorUsername)
            .then((rules) => gameRules = rules);
        if (gameState === 'lobby' && lobbyCount < gameRules.playerNumberMax) {
            console.log('user ' + socketUser + ' accepted game invite from ' + creatorUsername);
            socket.emit('invite:accept', creatorUsername);
        } else {
            // reject if the game is currently full but still in lobby
            socket.emit('invite:reject', creatorUsername);
        }
    });

    socket.on('invite:decline', (creatorUsername) => {
        console.log('user ' + socketUser + ' declined game invite from' + creatorUsername);
        // remove the invite from redis [invites]
        // no need to send anything back to user
    });

    socket.on('disconnect', () => {
        App.removeUserSocket(socketUser);
        console.log('user ' + socketUser + ' disconnected from appSocket');
    });
};
