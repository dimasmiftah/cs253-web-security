const net = require('net');
const dns = require('dns');

dns.lookup('example.com', (err, address) => {
  if (err) throw err;
  console.log(`address: ${address}`);

  const socket = net.createConnection({
    host: address,
    port: 80,
  });

  const request = `GET / HTTP/1.1
Host: example.com

`;

  socket.write(request);
  socket.pipe(process.stdout);
});
