//APIキー

var APIKEY = '6165842a-5c0d-11e3-b514-75d3313b9d05';//local

//ユーザーリスト
var userList = [];

//Connオブジェクト
var existingConn;

//send json
var sendJson = {
    "type": "chat",//chat or game
    "click": "",
    "name": "",
    "message": ""
}
var conn;

// PeerJSオブジェクトを生成
var peer = new Peer({ key: APIKEY, debug: 3});

// PeerIDを生成
peer.on('open', function(){
    $('#my_id').text(peer.id);
});

peer.on('connection', function(conn) {
    turn *= -1;
    connectChat(conn);
    $('#our_field').css('opacity', '0.6');
    $('#enemy_field').css('opacity', '1');
});

// エラーハンドラー
peer.on('error', function(err){
    alert(err.message);
});

// イベントハンドラー
$(function(){

    // 相手に接続
    $('#contact_start').click(function(){
        if (!existingConn) {
            conn = peer.connect($('#contactlist').val(),{
                reliable: true,
                serialization: 'binary-utf8'//UTF8?
            });
            connectChat(conn);
            $('#our_field').css('opacity', '1');
            $('#enemy_field').css('opacity', '0.6');
        }
    });

    // 切断

    //ユーザリス取得開始
    setInterval(getUserList, 2000);

});

function connectChat(c_conn) {
    if (!existingConn) {

        // 相手からのメディアストリームを待ち受ける
        conn = c_conn;
        conn.on('data', function(data){
            if(data.type == "chat"){
                $('#chat_area').prepend('<li>He:'+data.message+'</li>');
            }

            if(data.type == "game"){
                enemyTurnFn(data.click);
            }
        });

        existingCall = c_conn;
        // 相手がクローズした場合
        conn.on('close', function(){
            alert('disconnected!');
        });

        // Connオブジェクトを保存
        existingConn = conn;

        $('#send').click(function(){
            var message = $('#send_message').val();
            $('#chat_area').prepend('<li>You:'+message+'</li>');
            sendJson.type = "chat";
            sendJson.message = message;
            conn.send(sendJson);
        });

    }//if
}

function getUserList () {
    //ユーザリストを取得
    $.get('https://skyway.io/active/list/'+APIKEY,
        function(list){
            for(var cnt = 0;cnt < list.length;cnt++){
                if($.inArray(list[cnt],userList)<0 && list[cnt] != peer.id){
                    userList.push(list[cnt]);
                    $('#contactlist').append($('<option>', {"value":list[cnt],"text":list[cnt]}));
                }
            }
        }
    );
}
