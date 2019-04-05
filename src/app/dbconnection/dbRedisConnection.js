const redis = require("redis");

var client = redis.createClient(process.env.PORTRED, process.env.HOSTRED);

client.on('connect', function() {
    console.log('Redis client connected');
});

module.exports = client;