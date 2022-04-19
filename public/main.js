const socket = io();

console.log(socket.id);

let story = '';



socket.on('all-players', function (players) {
    console.log(players);
    document.querySelector('#players').innerHTML = '';
    players.forEach(function (player) {
        const li = document.createElement('li');
        li.innerHTML = player;
        if (player === socket.id) {
            li.classList.add('me');
        }
        document.querySelector('#players').appendChild(li);
        li.addEventListener('click', function () {
            socket.emit('message', { to: player, message: socket.id });
        });
    });
});

socket.on('all-usernames', data => {
    const usernames = document.querySelector('#users');
    usernames.innerHTML = '';
    data.forEach(function (user) {
        const li = document.createElement('li');
        li.innerHTML = user;
        usernames.appendChild(li);
    });
});


socket.on('connect', function () {
    console.log('connected', socket.id);
    const h1 = document.querySelector('h1');
    h1.innerHTML = socket.id;
});

socket.on('game-started', () => {
    console.log('game started')
    const startbutton = document.querySelector('#startgame');
    startbutton.previousElementSibling.remove();
    startbutton.remove();
})

socket.on('hey thanks for joining us', data => {
    console.log(data);
});

socket.emit('join', {
    room: 'room1',
    name: 'user1'
});

socket.on('message', function (message) {
    console.log(message);
});

socket.on('phase-mafia', (civilians) => {
    story += 'Chose a player to kill';
    document.querySelector('#story').innerHTML = story;
    document.querySelector('#choices').innerHTML = '';
    civilians.forEach(function (civilian) {
        const li = document.createElement('li');
        li.innerHTML = civilian.username;
        document.querySelector('#choices').appendChild(li);
        li.addEventListener('click', function () {
            socket.emit('kill', civilian);
        });
    })
});










socket.on('reclaim', player => {
    console.log('reclaiming', player);
    document.querySelector('#role').innerHTML = player.role;
    removeUsernameInputs();

});

socket.on('role', data => {
    console.log('got role', data);
    document.querySelector('#role').innerHTML = data;
});





function startGame() {
    socket.emit('start-game');
}

function submitUsername() {
    const username = document.querySelector('#username').value;
    socket.emit('username', username);
    removeUsernameInputs();
    sessionStorage.setItem('username', username);
}

function removeUsernameInputs() {
    const input = document.querySelector('#username');
    input.nextElementSibling.remove();
    input.remove();
}

function reconnect() {
    let username = sessionStorage.getItem('username');
    if (username) {
        console.log('found username', username);
        socket.emit('reconnect', username);
    } else {
        console.log('no local username')
    }
}

reconnect();