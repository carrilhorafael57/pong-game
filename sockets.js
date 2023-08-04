let readyPlayerCount = 0;

function listen(io) {
  // Creating different namespaces to different games
  const pongNamespace = io.of('/pong');

  pongNamespace.on('connection', (socket) => {
    let room;

    console.log('a user connected', socket.id);

    socket.on('ready', () => {
      room = 'room' + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log('Player ready', socket.id, room);

      readyPlayerCount++;

      if (readyPlayerCount % 2 === 0) {
        pongNamespace.in(room).emit('startGame', socket.id);
      }
    });

    socket.on('paddleMove', (paddleData) => {
      // Broadcast for everyone but the sender in the room
      socket.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
      // Broadcast for everyone but the sender in the room
      socket.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
