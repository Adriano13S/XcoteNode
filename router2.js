//INITIAL FULL ROUTER - NOT IN USE


const express = require('express');
const router2 = express.Router();
const WebSocket = require('ws');

const {
    getSports,
    getAllGames,
    getStartingSoon,
} = require('./api/requests');


let sports;
(async () => {if(!sports){sports = await getSports()}})();

setInterval(async() => {
    sports = await getSports();
}, 1500000);



let allGames;
(async () => {if(!allGames){
    allGames = await getAllGames()}
})();

setInterval(async()=>{
    allGames = await getAllGames();
}, 30000);




let startingSoon;
(async () => {if(!startingSoon){startingSoon = await getStartingSoon()}})();

setInterval(async() => {
    startingSoon = await getStartingSoon();
}, 1500000);



router.get('/', async (req, res) => {
    res.json("HI");
});

router.get('/sports', async (req, res) => {
    res.json(sports);
});

router.get('/allgames', async (req, res) => {
    res.json(allGames);
});

router.get('/stsoon', async (req, res) => {
    res.json(startingSoon);
});

router.get('/league/:league_id', (req, res) => {
    let res_list = allGames.events.filter((game) => {
        if(req.params.league_id == game.event.groupId){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
})


router.get('/live', (req, res)=>{
    let res_list = allGames.events.filter((game) => {
        if(game.event.state === 'STARTED'){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
})


router.get('/live/sport/:sport_id', (req, res )=> {
    let res_list = allGames.events.filter((game) => {
        if(game.event.state === 'STARTED' && req.params.sport_id == game.event.path[0].id){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
})

router.get('/live/country/:country_id', (req, res) => {
    let res_list = allGames.events.filter((game) => {
        if(game.event.state === 'STARTED' && req.params.country_id == game.event.path[1].id){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
})

router.get('/live/league/:league_id', (req, res) => {
    let res_list = allGames.events.filter((game) => {
        if(game.event.state === 'STARTED' && req.params.league_id == game.event.groupId){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
})

router.get('/today', (req, res)=>{
    const today = new Date(Date.now());
    let res_list = allGames.events.filter((game) => {
        if(new Date(game.event.start).getDay() === today.getDay()){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
})

router.get('/today/sport/:sport_id', (req, res) => {
    const today = new Date(Date.now());
    let res_list = allGames.events.filter((game) => {
        if(new Date(game.event.start).getDay() === today.getDay() && req.params.sport_id == game.event.path[0].id ){
            return game
        }
    }).map((game) => {return game});
    res.json(res_list);
});

router.get('/today/country/:country_id', (req, res)=>{
    const today = new Date(Date.now());
    let res_list = allGames.events.filter((game) => {
        if(new Date(game.event.start).getDay() === today.getDay() && req.params.country_id == game.event.path[1].id ){
            return game
        }
    }).map((game)=> {return game});
    res.json(res_list);
});

router.get('/today/league/:league_id', (req, res) => {
    const today = new Date(Date.now());
    let res_list = allGames.events.filter((game) => {
        if(new Date(game.event.start).getDay() === today.getDay() && req.params.league_id == game.event.groupId){
            return game
        }
    }).map((game)=> {return game});
    res.json(res_list);
});



const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', function connection(ws) {
   console.log('conected')
    ws.send(JSON.stringify(allGames.events))

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    setInterval(()=>{ws.send(JSON.stringify(allGames.events))}, 31000)
});


module.exports = router2;
