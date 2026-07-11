const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

const players = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'join':
          const player = {
            id: data.id,
            name: data.name,
            color: data.color,
            avatar: data.avatar,
            x: 400 + Math.random() * 200,
            y: 400 + Math.random() * 200
          };
          players.set(data.id, player);
          
          ws.send(JSON.stringify({
            type: 'playerList',
            players: Array.from(players.values()).filter(p => p.id !== data.id)
          }));
          
          broadcast(JSON.stringify({
            type: 'playerJoin',
            player
          }), ws);
          break;
          
        case 'move':
          const p = players.get(data.id);
          if (p) {
            p.x = data.x;
            p.y = data.y;
            broadcast(JSON.stringify({
              type: 'playerMove',
              id: data.id,
              x: data.x,
              y: data.y
            }), ws);
          }
          break;
          
        case 'chat':
          broadcast(JSON.stringify({
            type: 'playerChat',
            id: data.id,
            message: data.message
          }), ws);
          break;
          
        case 'leave':
          players.delete(data.id);
          broadcast(JSON.stringify({
            type: 'playerLeave',
            id: data.id
          }), ws);
          break;
      }
    } catch (e) {
      console.error('Message parse error:', e);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    for (const [id] of players) {
      players.delete(id);
      broadcast(JSON.stringify({
        type: 'playerLeave',
        id
      }));
      break;
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function broadcast(message, excludeWs = null) {
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === 1) {
      client.send(message);
    }
  });
}

console.log('WebSocket server running on ws://localhost:8080');
