// CONNECT TO WS OF PROVIDER - ONLY UBRO (possible for ubro, sbro, 888, gtro) AND PARSE MESSAGES - NOT IN USE

const WebSocket = require('ws');

const second_msg = process.env.WS_MSG_1;
const thr_msg = JSON.parse(process.env.WS_MSG_2);

const wss = new WebSocket(process.env.WEB_SOCKET);

wss.on('open', function open() {
    setInterval(()=> wss.send(2), 55000);
});

wss.on('message', function incoming(message) {
    if(message == 40){
            wss.send(second_msg);
            wss.send(thr_msg);
    };

    if(message.slice(0,2) == 42){
        const data_json = JSON.parse(message.replace(42,''));
        const parse_data = JSON.parse(data_json[1]); //# final data
        return parse_data;
    };

    if(message[0]==3){
        console.log(`PASSS MESSANGE ${message}`);
    };
});
