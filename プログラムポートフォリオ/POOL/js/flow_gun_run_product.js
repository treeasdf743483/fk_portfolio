/**
*終了してから初期化してゲームスタート不可
*
*/
var x_init,y_init,vx_init,vy_init;
var x_me,y_me,vx_me,vy_me;
var x_emy,y_emy,vx_emy,vy_emy;
var delx = 0;
var dely = 0;
x_init = 270;
y_init = 270;
vx_init = 30;
vy_init = 0;
var x_c,y_c;
var theta = 0;
var theta_new = 0;
var r = 1;
var r_new = 1;
var step = 0;
var time=0;
var omega = 0.05;
var sumPoint = 0;
var omega_emy = 0.05;
var r_emy = 1;
var theta_emy = 0;
var animeMove;
var WIDTH = 700;
var HEIGHT = 500;
var gunMove;
var METER = 1000;
var anime_ship;
var theta_c = Math.atan2(y_c, x_c);
var colliFEmy = false;
var colliFShip = false;
var gunRadius = 30;
var shipRadius = 10;
var emyRadius = 10;
var exitingF_ship = false;
var exitingF_emy = false;
var x_ship = 0;
var y_ship = getRandomArbitrary(50, 150);
var gunF = false;
var DownF = false;
var UpF = false;
var LeftF = false;
var RightF = false;
var shotT_start = new Date();
var shotT_end;
var inKeyF = true;
var inKeyCnt = 0;
var time_ms = 0;
var xg;
var yg;
var cnt_timer = 0;
var FINISH_SEC = 60;
var countdownid;

//初期化処理
function init() {
	//描画コンテキストの取得
	var canvas = document.getElementById("gamePlane");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	clear();
	pushPoint(x_me, y_me, 10, "brown");
	cnt_timer = 0;
	document.getElementById("point").innerHTML = 0;
	DownF = false;
	UpF = false;
	RightF = false;
	LeftF = false;
	sumPoint = 0;
	time_ms = 0;

}

//最初から
function clear() {
	//描画コンテキストの取得
	var canvas = document.getElementById("gamePlane");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	var context = canvas.getContext('2d');
	//新しいパスを開始する
	context.beginPath();
	context.fillStyle = "#00ff00";
	context.fillRect(0, 0, WIDTH, HEIGHT);
	context.fill();
	x_me = x_init;
	y_me = y_init;
	stopGame();
	theta_new = 0;
	r_new = 0;
	theta_emy = 0;
	r_emy = 0;
	x_emy = 0;
	y_emy = 0;
	document.getElementById("point").innerHTML = "";
}

//ゲームスタートボタン押下で開始
function gameStart() {
	var canvasId = document.getElementById("gamePlane");
	x_c = WIDTH * 0.5;
	y_c = HEIGHT * 0.5;
	theta_new = Math.atan2(y_me - y_c, x_me - x_c);
	theta0 = Math.atan2(y_c, x_c);

	//初期位置
	x_me = x_init;
	y_me = y_init;

	x_emy = getRandomArbitrary(400, 430);
	y_emy = getRandomArbitrary(400, 430);
	//x_emy[2] = 20;
	//x_emy[3] = 20;

	//初期位置の半径を取得
	r_new = distance(x_me, y_me, x_c, y_c);
	r_emy = distance(x_emy, y_emy, x_c, y_c);

	shotT_start = new Date();
	countdown();

	//アニメーション作成
	animeMove = setInterval(

		function() {
			//円の中の回転の計算処理と描画処理
			calcFlow();
			//キーが押下されたときの処理
			document.addEventListener("keydown", function(e) {
				//もしもsキーが押下されたら
				if (e.keyCode == 83 && inKeyF == true) {
					xg = x_me;
					yg = y_me;
					UpF = true;
					DownF = false;
					LeftF = false;
					RightF = false;
					shotT_start = new Date();
					inKeyCnt++;
					//console.log("s押下");

					//Aキー押下
				} else if (e.keyCode == 65 && inKeyF == true) {
					xg = x_me;
					yg = y_me;
					LeftF = true;
					DownF = false;
					UpF = false;
					RightF = false;
					shotT_start = new Date();
					inKeyCnt++;

					//xキー押下
				} else if (e.keyCode == 88 && inKeyF == true) {
					xg = x_me;
					yg = y_me;
					DownF = true;
					UpF = false;
					LeftF = false;
					RightF = false;
					shotT_start = new Date();
					inKeyCnt++;

					//Dキー押下
				} else if (e.keyCode == 68 && inKeyF == true) {
					xg = x_me;
					yg = y_me;
					shotT_start = new Date();
					inKeyCnt++;
					RightF = true;
					DownF = false;
					LeftF = false;
					UpF = false;

				}

			});
			shotT_end = new Date();
			var StopTime = shotT_end.getTime() - shotT_start.getTime();
			var mins = StopTime / (1000 * 60);
			StopTime = StopTime % (1000 * 60);
			var secs = StopTime / 1000;
			if (secs <= 1) {
				inKeyF = false;
			} else {
				inKeyF = true;
			}
			if (DownF == true) {
				//円を描画する
				pushPoint(xg, yg, 30, "blue");
				yg = yg + 15;
			} else if (UpF == true) {
				pushPoint(xg, yg, 30, "blue");
				yg = yg - 15;
			} else if (LeftF == true) {
				pushPoint(xg, yg, 30, "blue");
				xg = xg - 15;
			} else if (RightF == true) {
				pushPoint(xg, yg, 30, "blue");
				xg = xg + 15;
			}

			//ポイント部分
			pointEye();

			//ポイントを表示
			document.getElementById("point").innerHTML = sumPoint;
			time_ms = time_ms + 20;
			//ゲーム終了
			if (time_ms >= FINISH_SEC * METER) {
				stopGame();
			}
		}
		, 20);
}

//次のステップの計算と描画処理
function calcFlow() {
	xm = x_me;
	ym = y_me;
	//横方向の速度
	x_ship = 7 * time;

	time++;
	if (x_ship >= WIDTH) {
		x_ship = 0;
		y_ship = getRandomArbitrary(50, 150);
		time = 0;

	}

	//現在位置を取得
	x_me = r_new * Math.cos(theta_new) + x_c;
	y_me = r_new * Math.sin(theta_new) + y_c;
	x_emy = r_emy * Math.cos(theta_emy) + x_c;
	y_emy = r_emy * Math.sin(theta_emy) + y_c;
	step++;

	//新しい座標を計算
	r_new = distance(x_me, y_me, x_c, y_c);
	theta_new = theta_new + omega / r_new * 50;
	r_emy = distance(x_emy, y_emy, x_c, y_c);
	theta_emy = theta_emy + omega_emy / r_emy * 50;
	//船、敵、自分まとめて移動させる
	moveAll();
}

//点を移動
function moveAll() {

	//描画コンテキストの取得
	var canvas = document.getElementById('gamePlane');
	//要素の左端と上端を定義するため、生成
	var rect = canvas.getBoundingClientRect();
	//ブラウザ振り分け
	var userAgent = window.navigator.userAgent.toLowerCase();
	//firefoxの場合
	//船を移動させる
	var canvas = document.getElementById('gamePlane');
	var context = canvas.getContext('2d');

	//キーボードによるデフォルトでの上下を非活性にする
	context.clearRect(0, 0, WIDTH, HEIGHT);

	//path（軌跡）を始めるということを宣言する
	context.beginPath();


	//自分を表示
	pushPoint(x_me, y_me, 10, "brown");

	//敵を表示
	pushPoint(x_emy, y_emy, 10, "purple");

	//船を表示
	pushPoint(x_ship, y_ship, 10, "red");

	//現在のpathを描画する
	context.stroke();
}

//停止
function stopGame() {
	clearInterval(animeMove);
	clearInterval(gunMove);
	clearInterval(countdownid);
}


//2点の距離取得
function distance(x, y, x2, y2) {
	var r = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
	return r;
}


//キーボードが押された時、呼び出し。矢印キーで座標をずらす。
//矢印キーを押下すると、発生。船の座標を増減させる
document.addEventListener("DOMContentLoaded", function() {
	document.addEventListener("keydown", function(e) {
		var x_before = x_me;
		var y_before = y_me;
		//ブラウザ振り分け
		var userAgent = window.navigator.userAgent.toLowerCase();
		if (e.isComposing || e.keyCode === 37
			|| e.keyCode === 38
			|| e.keyCode === 39
			|| e.keyCode === 40) {
			if (userAgent.indexOf('msie') != -1) {
				//←押下したら半径小さく
				if (e.which == 37) {
					r_new = r_new - 5;
					//→押下したら半径大きく
				} else if (e.which == 39) {
					r_new = r_new + 5;
				}
				//その他の場合
			} else {
				//←押下したら半径小さく
				if (e.keyCode == 37) {
					r_new = r_new - 5;
					//→押下したら半径大きく
				} else if (e.keyCode == 39) {
					r_new = r_new + 5;
				}
			}
		}
		moveAll();
		theta_new = Math.atan2(y_me - y_c, x_me - x_c);

	});
}, false);

//点を描く
function pushPoint(x, y, r, color) {
	//描画コンテキストの取得
	var canvas = document.getElementById('gamePlane');
	context = canvas.getContext('2d');

	//path（軌跡）を始めるということを宣言する
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.stroke();

	//色を指定する
	context.strokeStyle = color; //枠線の色は青
	context.fillStyle = color; //塗りつぶしの色は赤
	context.fill();
}

// 描画をクリア
function clearGame() {
	var canvas2 = document.getElementById("gamePlane");
	if (canvas2.getContext) {
		var context = canvas2.getContext('2d');
		// 新しいパスを開始する
		context.beginPath();
		context.fillStyle = "green";
		context.clearRect(0, 0, 700, 700);
		//console.log("3333333333");

		// パスを閉じる（最後の座標から開始座標に向けてラインを引く）
		context.closePath();
		// 現在のパスを輪郭表示する
		context.stroke();
		clearInterval(animeMove);
		init();
	}
}


//指定した間の乱数を生成する
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}


document.addEventListener("DOMContentLoaded", function() {
	var xm = x_me;
	var ym = y_me;
	document.addEventListener("keydown", function(e) {

		//もしもsキーが押下されたら
		if (e.keyCode == 83) {
			gunMove = setInterval(function slidePoint() {
				//円を描画する
				pushPoint(xm, ym, 30, "blue");
				ym = ym - 15;
			}, 20);
		} else if (e.keyCode == 65) {
			gunMove = setInterval(function slidePoint() {
				//円を描画する
				pushPoint(xm, ym, 30, "blue");
				xm = xm - 15;
			}, 20);
		} else if (e.keyCode == 88) {
			gunMove = setInterval(function slidePoint() {
				//円を描画する
				pushPoint(xm, ym, 30, "blue");
				ym = ym + 15;
			}, 20);
		} else if (e.keyCode == 68) {
			gunMove = setInterval(function slidePoint() {
				//円を描画する
				pushPoint(xm, ym, 30, "blue");
				xm = xm + 15;
			}, 20);
		}

	});

}, false);

//球と球の衝突判定
function colliBall(x1, y1, r1, x2, y2, r2) {
	var colliF_m = false;
	if (distance(x1, y1, x2, y2) <= Math.abs(r1 + r2)) {
		colliF_m = true;
	}
	return colliF_m;
}

//点数部分
function pointEye() {
	colliFShip = colliBall(xg, yg, gunRadius, x_ship, y_ship, shipRadius);
	colliFEmy = colliBall(xg, yg, gunRadius, x_emy, y_emy, emyRadius);

	if (exitingF_ship == true && colliFShip == false) {
		exitingF_ship = false;
	}

	if (exitingF_emy == true && colliFEmy == false) {
		exitingF_emy = false;
	}

	//船なら+5
	if (colliFShip == true && exitingF_ship == false) {
		sumPoint += 5;
		//console.log("444455566");
		exitingF_ship = true;
	}
	//敵なら+1
	if (colliFEmy == true && exitingF_emy == false) {
		sumPoint += 6;
		exitingF_emy = true;
		//console.log("afdssss");
	}
}

//タイマー処理

function countdown() {
	var cnt_timer = FINISH_SEC;

	countdownid = setInterval(function() {
		cnt_timer--;
		if(cnt_timer <= 30){
			remain.innerHTML = cnt_timer;
		}
		if (cnt_timer == 0) {
			clearInterval(countdownid);
		}
		console.log(cnt_timer);
	}, 1000);
}