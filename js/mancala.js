// var
var field_jqObj_array
var enemy_all_cups = $('#enemy_field>div');
var our_all_cups = $('#our_field>div');
var turn = 1;


// Function Defining
function gameEnd(winPlayer){
  if(winPlayer == 'our'){
    $('#status').html('Victory!!!');
  }
  if(winPlayer == 'enemy'){
    $('#status').html('Defeat!!!');
  }
}
function enemyTurnFn(clicked){
  var enmCup = clicked + 7;
  var enmJqId = '#'+enmCup;
  clickCup(enmCup, $('#'+enmCup).html());
}

function clickCup(clickCup, cupNum){
  var cup_num = Number(clickCup);// this 'cup_num' is number of field_jqObj_array.
  var cup_val = Number(cupNum);// number of in this cup.
  var origin_cup_val = Number(cupNum);
  var next_num;


  // Edit send data
  sendJson.click = cup_num;
  sendJson.type = "game";

  // Coin Moving Action(roop)
    for (var i = cup_num; i < cup_num + origin_cup_val; i++) {
      /*
      ウェイト処理、http://blog.kabadna.com/20110719-1282/ この辺をみながら
      1,roopは計算に集中。やることを配列に突っ込んでおく。
      2,配列から取り出す形でsetTimeoutをループさせる
      相手側へのjson送信もここで行って良い。

      for内では計算に集中するのがポイント、その後配列を処理し、見かけではsetTimeout()にてWaitを作り出す。
      */

      if(i == cup_num + origin_cup_val) return;

      if(i == cup_num){ //Action only first roop
        field_jqObj_array[i].html(0);// overwriting the number of cups to 0.
      }

      // Add ONE to next cup
      if(i + 1 <= 13){// nomal roop
          next_num = Number(field_jqObj_array[i+1].html());
          field_jqObj_array[i+1].html(next_num + 1);
      }
      if(i + 1 > 13){// action of second roop
        var second_i = i - 14;
        next_num = Number(field_jqObj_array[second_i+1].html());
        field_jqObj_array[second_i+1].html(next_num + 1);
      }

      // -1 cup_val
      cup_val--;

      // check last roop
      if(i == cup_num + origin_cup_val - 1){
        var numOver = i;
        if(numOver > 13){
          numOver - 13;
        }

        //check cup
        if($(field_jqObj_array[numOver+1]).attr("id") != 'right_cup' && turn == 1){
          $('#our_field').css('opacity', '0.6');
          $('#enemy_field').css('opacity', '1');
          turn *= -1;
        }else if($(field_jqObj_array[numOver+1]).attr("id") != 'left_cup' && turn == -1){
          $('#our_field').css('opacity', '1');
          $('#enemy_field').css('opacity', '0.6');
          turn *= -1;
        }
        conn.send(sendJson);
      }

      // wait
    }// roop end
    // End of Cup Action.


  // Win Check
  if(
      $(enemy_all_cups[0]).html() == 0 &&
      $(enemy_all_cups[1]).html() == 0 &&
      $(enemy_all_cups[2]).html() == 0 &&
      $(enemy_all_cups[3]).html() == 0 &&
      $(enemy_all_cups[4]).html() == 0 &&
      $(enemy_all_cups[5]).html() == 0
    )
  {
    gameEnd('enemy');
  }

  if(
      $(our_all_cups[0]).html() == 0 &&
      $(our_all_cups[1]).html() == 0 &&
      $(our_all_cups[2]).html() == 0 &&
      $(our_all_cups[3]).html() == 0 &&
      $(our_all_cups[4]).html() == 0 &&
      $(our_all_cups[5]).html() == 0
    )
  {
    gameEnd('our');
  }

  // check End cup -> 1 more turn check.
}


var conn;

$(function(){
  // init
  init();

  // for init
  function init(){// [todo]Option

    // Add JQueryObj in Array;
    field_jqObj_array = new Array(
        $('#our_field>.cup_0'),
        $('#our_field>.cup_1'),
        $('#our_field>.cup_2'),
        $('#our_field>.cup_3'),
        $('#our_field>.cup_4'),
        $('#our_field>.cup_5'),
        $('#right_cup'),
        $('#enemy_field>.cup_0'),
        $('#enemy_field>.cup_1'),
        $('#enemy_field>.cup_2'),
        $('#enemy_field>.cup_3'),
        $('#enemy_field>.cup_4'),
        $('#enemy_field>.cup_5'),
        $('#left_cup')
    );

  }

  // get clicked positon on this game field.
  $(document).on('click', '.clickable', function(){
    if(turn == 1 && $(this).parent('div').attr('id') != 'enemy_field'){
      clickCup(this.id, $(this).html());
    }
  });


});