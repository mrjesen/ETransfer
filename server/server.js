import {WebSocketServer} from 'ws';
import RoomList from "./room/room.js";
import {nanoid} from 'nanoid';
import https from 'https';
import fs from 'fs';

let pfxpath = './ssl.pfx';
let options = {
    pfx: fs.readFileSync(pfxpath),
    passphrase: "123456",
};
let server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("this is a websocket server \n");
}).listen(9091);
const wss = new WebSocketServer({server: server});

wss.on('listening', function () {
    console.log('WebSocket server(https) is running on port 9091');
})
//如果有WebSocket请求接入，wss对象可以响应connection事件来处理这个WebSocket：
wss.on('connection', function (client) {
    let thisRoom;
    client.on('message', function (message) {
        const msg = formatMsg(message)
        switch (msg?.action) {
            case 'CREATE_ROOM':
                try {
                    if(thisRoom?.ID){
                        sendMsg(client, {action: "CREATE_ROOM", status: true, room_id: thisRoom.ID});
                    }else{
                        thisRoom = RoomList.createRoom(msg.room_id || "", client);
                        sendMsg(client, {action: "CREATE_ROOM", status: true, room_id: thisRoom.ID});
                    }
                    console.log("创建房间",thisRoom.ID)
                } catch (e) {
                    console.error("创建房间",e.message)
                    sendMsg(client, {action: "CREATE_ROOM", status: false, "msg": e.message});
                }
                break;
            case 'JOIN_ROOM':
                try {
                    //判断是否有room_id
                    if(!msg.room_id){
                        sendMsg(client, {action: "JOIN_ROOM", status: false, "msg": "房间号不能为空!"});
                        break
                    }
                    thisRoom = RoomList.joinRoom(msg.room_id, client);
                    sendMsg(client, {action: "JOIN_ROOM", status: true, "msg": "成功加入房间!"});
                    //告诉呼叫用户，新用户进来了
                    thisRoom.sendMsgToOtherUser(client, {action: "CONNECT", status: true, "msg": "新用户成功加入房间!"});
                    console.log("加入房间",thisRoom.ID)
                } catch (e) {
                    console.error("加入房间",e.message)
                    sendMsg(client, {action: "JOIN_ROOM", status: false, "msg": e.message});
                }
                break;
            case 'LEAVE_ROOM':
                let count=RoomList.leaveRoom(thisRoom.ID, client);
                if(count>0){
                    thisRoom.sendMsgToAll({action: "LEAVE_ROOM", status: true, "msg": "用户离开房间!"});
                }
                console.info("断开连接",thisRoom,count);
                break
            case "TRANSFER":
                thisRoom.sendMsgToOtherUser(client, msg);
                break
            case "HEART_BEAT":
                break
            default :
                console.warn("未知消息",msg)
                break;
        }
    });

    client.on('close', function () {
        if(!thisRoom){
            return
        }
        let count=RoomList.leaveRoom(thisRoom.ID, client);
        if(count>0){
            thisRoom.sendMsgToAll({action: "LEAVE_ROOM", status: true, "msg": "用户离开房间!"});
        }
        console.info(`断开连接 房间：${thisRoom.ID} 人数：${count}`);
        thisRoom=null

    })
})


/**
 * 处理消息
 * @param msgText
 */
function formatMsg(msgText) {
    return JSON.parse(msgText)
}

/**
 * 发送消息
 * @param client
 * @param msgObj
 */
function sendMsg(client, msgObj) {
    client.send(JSON.stringify(msgObj))
}

