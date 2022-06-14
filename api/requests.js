const axios = require('axios');
require('dotenv').config();

async function getSports(){
    const response = await axios(process.env.SPORTS_URL);
    return response.data;
};

async function getAllGames(){
    const response1 = await axios(process.env.UBRO);
    const response2 = await axios(process.env.SBRO);
    const response3 = await axios(process.env.BBB);
    const response4 = await axios(process.env.GTRO);
    
    // Get all odds in response1 odds obj, adding provider
    response1.data.events.map( ev => {
        ev.betOffers[0] ? ev.betOffers[0]['provider'] = 'Unibet' : null
        response2.data.events.map(ev2 => {
            if(ev2.event.id === ev.event.id){
                if(ev2.betOffers.length === 1){
                    ev2.betOffers[0]['provider'] = 'Superbet'
                    ev.betOffers.push(ev2.betOffers[0])
                }
            }
        });
        response3.data.events.map( ev3 => {
            if(ev3.event.id === ev.event.id){
                if(ev3.betOffers.length === 1){
                    ev3.betOffers[0]['provider'] = '888Sport'
                    ev.betOffers.push(ev3.betOffers[0])
                }
            }
        });
        response4.data.events.map( ev4 => {
            if(ev4.event.id === ev.event.id){
                if(ev4.betOffers.length === 1){
                    ev4.betOffers[0]['provider'] = 'Admiral'
                    ev.betOffers.push(ev4.betOffers[0])
                }
            }
        });
    });

    return response1.data;
};


async function getStartingSoon(){
    const response = await axios(process.env.STARTING_SOON);
    return response.data;
};

// async function getAllGamesBySport(sport){
//     const response = await axios(process.env.ALL_GAMES_BY_SPORT.replace('$', sport));
//     return response.data;
// };

// async function getStartingSoonBySport(sport){
//     const response = await axios(process.env.STARTING_SOON_BY_SPORT.replace('$', sport));
//     return response.data;
// };

module.exports = {
    getSports,
    getAllGames,
    getStartingSoon,
};