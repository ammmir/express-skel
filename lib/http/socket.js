module.exports = function(socket) {
  console.log("[socket] new connection: %s", socket.id);

  socket.emit('hello', 'world');
  socket.on('hello', function(data) {
    console.log("[socket] got hello: %s", data);
  });
};