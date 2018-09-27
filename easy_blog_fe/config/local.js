// see http://vuejs-templates.github.io/webpack for documentation.
var devHost = '127.0.0.1';
// var username = process.env.USER;
var username ='hanhuasong'
var portMap = {
    hanhuasong: {
        frontendPort: 9731,
        backendPort: 9732,
    },
};
var frontendPort = portMap[username].frontendPort;
var backendPort = portMap[username].backendPort;
var basePath = 'http://' + devHost + ':' + frontendPort;
var baseApiPath = 'http://' + devHost + ':' + backendPort;

module.exports = {
    devHost,
    frontendPort,
    backendPort,
    basePath,
    baseApiPath,
};
