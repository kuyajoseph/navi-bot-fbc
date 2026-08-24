const express = require('express');

function keepAlive() {
  const server = express();
  const port = process.env.PORT || 3000;

  server.get('/', (request, response) => {
    response.status(200).send('Here come the buffs!');
  });

  server.listen(port, () => {
    console.log(`Health-check server listening on port ${port}.`);
  });
}

module.exports = keepAlive;
