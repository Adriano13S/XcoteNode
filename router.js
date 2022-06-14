const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const zlib = require('zlib');
const _ = require('lodash');

const {
    getSports,
    getAllGames,
} = require('./api/requests');



// Store sports response in sports let at start
let sports;
(async () => {if(!sports){sports = await getSports()}})();

// Make a new call every 25 min with getSports() and check for changes in sports
setInterval(async() => {
    check_sports = await getSports();
    if(check_sports != sports){
        sports = check_sports
    }
}, 1500000);


// Store all games response in allGames let at start
let allGames;
(async () => {if(!allGames){
    allGames = await getAllGames()}
})();

// Make a new call every 30 s with getAllGames() and assign allGames to response data
setInterval(async()=>{
    allGames = await getAllGames();
}, 30000);


// PATHS
router.get('/', async (_, res) => {
    res.json("HI");
});

router.get('/sports', async (_, res) => {
    res.json(sports);
});

router.get('/allgames', async (_, res) => {
    res.json(allGames);
});


// WS
const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', function connection(ws) {
    const buf = Buffer.from(JSON.stringify(allGames.events), 'utf-8'); // convert json stringify to buffer
    zlib.gzip(buf, (_, result) => ws.send(result)); // gzip buffer and send it

    ws.on('message', function incoming(_) {
        const buf = Buffer.from(JSON.stringify(allGames.events), 'utf-8');
        setTimeout(() => zlib.gzip(buf, (_, result) => ws.send(result)), 31000) // Send a message every 31 s containing allGames
    });
});


module.exports = router;
