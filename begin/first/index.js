const { send } = require('micro')

module.exports = function (request, response) {
  send(response, 200, 'Hello World! 👋')
}


