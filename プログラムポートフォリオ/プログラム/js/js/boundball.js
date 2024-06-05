//作成日時　2016/11/9 23:35
var t = 1;
var g = 9.8;
var colcnt=0;
var step=0;
var wide;
var height
var vx0
function init() {
	//初期表示
	canvasSize();
	wide = 900
	height = 600;
	var canvas = document.getElementById("cvs");
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
		// 新しいパスを開始する
		context.beginPath();
			//始め
			context.arc(50,200,20,0,Math.PI*2,true);
			// パスを閉じる（最後の座標から開始座標に向けてラインを引く）
			context.closePath();
			// 現在のパスを輪郭表示する
			context.stroke();
		}
	document.getElementById("cvs").style.backgroundColor = "rgb('0','0','255')";
}

function animeExe() {
	var vx0 = document.getElementById("v_x").value;
	var e = document.getElementById("e").value;
	var vy0 = document.getElementById("v_y").value;
	var finalStep = document.getElementById("step").value;
	var t_il = document.getElementById("t_il").value;
	document.getElementById("v_x").disable;
	document.getElementById("e").disable;
	document.getElementById("v_y").disable;
	setInterval(motion, 1000);
}
function motion() {
	var canvas = document.getElementById("cvs");
	//var width = canvas.width;
	//var heigth = canvas.height;


	if(vx0 != null || !vx0.test("\\d") || vy0 != null || !vy0.test("\\d") || e != null || !e.test("\\d")){
		alert("空白の入力値に数字を入力して下さい。");
			retune;
	}

	if (canvas.getContext) {
		var context = canvas.getContext('2d');
		var y
		var x
		var y_md
		var vx
		var vy
		var t = t_il*step;
		x = vx0*t+50;
		vx = vx0;
		vy = vy0-g*t:
		y = 200+vy0*t-0.5*g*t*t;
		y_md=height-y;
		//クリア
		context.clearRect(0, 0, width, heigth);
			if(y < 20 ){
				t=0;
				vx0=
			}
			context.arc(, y, radius, startAngle, endAngle, anticlockwise)
			var interval = i* 5 * t;
			// ここに具体的な描画内容を指定する
			// 新しいパスを開始する
			context.beginPath();
			// パスの開始座標を指定する
			context.moveTo(0, interval);
			// 横線をひく
			context.lineTo(width, interval);
			// パスを閉じる（最後の座標から開始座標に向けてラインを引く）
			context.closePath();
			// 現在のパスを輪郭表示する
			context.stroke();
		}
		for (var j = 0; j < width; j++) {
			var interval = j * 5 * t;
			// 新しいパスを開始する
			context.beginPath();
			// パスの開始座標を指定する
			context.moveTo(interval, 0);
			// 縦線をひく
			context.lineTo(interval, heigth);
			// パスを閉じる（最後の座標から開始座標に向けてラインを引く）
			context.closePath();
			// 現在のパスを輪郭表示する
			context.stroke();
		}
	}
	t++;
	//10秒後、初めから再起動
	if(t == 10){
		t = 2;
	}
}
// canvasのサイズを設定(自動設定だと正確な値が定められない)
function canvasSize() {
	var canvas1 = document.getElementById("cvs");
	// 横幅を設定
	canvas1.width = 900;
	// 縦幅を設定
	canvas1.height = 600;
}