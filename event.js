var events = require('events');
var eventEmitter = new events.EventEmitter();
var cbTest = function connected() {
  console.log('connection successful');

  eventEmitter.emit('data_received');
}

eventEmitter.on('connection', cbTest );
eventEmitter.on('data_received', function() {
  console.log('data received 2');
} );


eventEmitter.emit('connection');
