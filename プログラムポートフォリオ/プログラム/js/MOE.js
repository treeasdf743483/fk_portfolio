//作成日時　2016/11/9 23:35
var x_init = 100;
var y_init = 300;
var width = 500;
var height = 800;
var radius = 20;
var t = 0;
var step = 0;
var animeObj;
var stopFlg = false;
var x_later;
var y_later;
var saveFlg = false;
var x_arr = new Array(15000);
var y_arr = new Array(15000);
var planetColor = [ 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(200,200,93)',
		'rgb(255,0,0)', 'rgb(143,99,66)', 'rgb(255,255,255)', '#ffff8c' ];
var planetName = new Array(100);
function init() {
	// 初期表示
	canvasSize();
	var canvas = document.getElementById("cvas");
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
		// 新しいパスを開始する
		context.beginPath();
		// 始め
		context.arc(x_init, height - y_init, radius, 0, Math.PI * 2, true);
		// 現在のパスを輪郭表示する
		context.stroke();
		// パスを閉じる（最後の座標から開始座標に向けてラインを引く）
		context.closePath();
		// 新しいパスを開始する

		for (var m = 0; m <= 6; m++) {

			context.font= 'normal 10px ＭＳ 明朝';
			planetName[m] = document.frm.slt.options[m].text;
			context.beginPath();
			context.strokeStyle = planetColor[m];
			context.strokeText(planetName[m], width - 200, 3+20 * (m + 1));

			context.moveTo(width - 110, 20 * (m + 1));
			context.lineTo(width - 10, 20 * (m + 1));
			context.stroke();
			context.closePath();
		}
	}
}

function animeExe() {
	var t_iv;
	var g_in;
	var vx0;
	var vy0;
	var t_f;
	var g_in = 9.80 * Number(document.forms.frm.slt.value);

	vx0 = Number(document.getElementById("v_x").value.trim());
	vy0 = Number(document.getElementById("v_y").value.trim());
	t_f = Number(document.getElementById("t_f").value.trim());
	t_iv = Number(document.getElementById("t_iv").value.trim());
	document.getElementById("degree").innerHTML=(Math.atan(vy0/vx0)*(180/Math.PI));
	console.log("角度"+Math.atan(vy0/vx0)*(180/Math.PI));
	var renum = /\d/;
	if (vx0 == null || !renum.test(vx0) || vy0 == null || !renum.test(vy0)
			|| t_f == null || !renum.test(t_f)
			|| t_iv == null || !renum.test(t_iv)
			|| vx0==""
			|| vy0==""
			|| t_f==""
			|| t_iv==""
			 ) {
		alert("入力値に数字を入力して下さい。");
		return null;
	}

	disable();
	// 入力チェック
	//console.log("t_fは" + t_f);
	//console.log("t_ivは" + t_iv);
//console.log("g_inは" + g_in);
	animeObj = setInterval("motion()", 1000);
}
function motion() {
	var canvas = document.getElementById("cvas");
	var x;
	var y;
	var vx;
	var vy;
	var radius;

	var y_md;
	var t_iv;
	var g;
	var vx0;
	var vy0;
	var t_f;
	var index = Number(document.forms.frm.slt.selectedIndex);

	vx0 = Number(document.getElementById("v_x").value);
	vy0 = Number(document.getElementById("v_y").value);
	t_f = Number(document.getElementById("t_f").value);
	t_iv = Number(document.getElementById("t_iv").value);
	g = 9.80 * Number(document.forms.frm.slt.value);

	// var width = canvas.width;
	// var heigth = canvas.height;

	if (canvas.getContext) {
		var context = canvas.getContext('2d');
		var context1 = canvas.getContext('2d');

		x = vx0 * t + x_init;
		vx = vx0;
		vy = vy0 - g * t;
		y = y_init + vy0 * t - 0.500 * g * t * t;
		y_md = height - y;
		x_arr[step] = x;
		y_arr[step] = y_md;

		if (step == 0) {
			x_later = x_init;
			y_later = height - y_init;
		}

		// 新しいパスを開始する
		context.beginPath();
		// 色を付ける
		context.strokeStyle = planetColor[index];
		console.log("index" + index);
		// 球の運動
		if (step % 5 == 0 || y <= 0) {
			context.arc(x, y_md, 20, 0, Math.PI * 2, true);
		}
		context.moveTo(x_init, height - y_init);
		for (var k = 0; k <= step; k++) {
			context.lineTo(x_arr[k], y_arr[k]);
		}
		// 現在のパスを輪郭表示する
		context.stroke();
		context.closePath();
	}
	// 出力チェック
	//console.log(x);
	//console.log(y);
	//console.log(t);
	x_later = x;
	y_later = y_md;
	//console.log("after" + t);
	outWrite(vx, vy, x, y, t, step);
	t = t + t_iv;
	step++;
	if (t == t_f || y <= 0|| x >= width) {
		clearInterval(animeObj);
	}
	//console.log("222222222");
}
function outWrite(vx, vy, x, y, t, step) {
	// 内容を表示させるための領域を追加
	var outTBL = document.getElementById("OUT");
	if (step <= 30) {
		var rows = outTBL.insertRow(step + 3);
		var outstep = rows.insertCell(0);
		var outt = rows.insertCell(1);
		var outx = rows.insertCell(2);
		var outy = rows.insertCell(3);
		var outvx = rows.insertCell(4);
		var outvy = rows.insertCell(5);

		outvx.innerHTML = vx
		outvy.innerHTML = vy;
		outx.innerHTML = x;
		outy.innerHTML = y;
		outt.innerHTML = t;
		outstep.innerHTML = step;
	}

	console.log("inner" + x);
	console.log(y);
}
function animeStop() {
	clearInterval(animeObj);
	disable();

}
// もう一回始める
function restart() {
	console.log(Number(document.forms.frm.save.value));
	if (Number(document.forms.frm.save.value) == 0) {
		saveFlg = true;
	} else if (Number(document.forms.frm.save.value) == 1) {
		saveFlg = false;
	}
	var canvas2 = document.getElementById("cvas");
	if (canvas2.getContext) {
		var context = canvas2.getContext('2d');
		// クリア
		if (saveFlg == false) {
			// 新しいパスを開始する
			context.beginPath();

			context.clearRect(0, 0, width, height);
			console.log("3333333333");

			// パスを閉じる（最後の座標から開始座標に向けてラインを引く）
			context.closePath();
			// 現在のパスを輪郭表示する
			context.stroke();
			clearInterval(animeObj);
			init();
		}
	}
	clearInterval(animeObj);
	var outTBL2 = document.getElementById("OUT");
	console.log("step" + step);
	while (outTBL2.rows[3])
		outTBL2.deleteRow(3);
	t = 0;
	step = 0;
	able();

}
// canvasのサイズを設定(自動設定だと正確な値が定められない)
function canvasSize() {
	var canvas1 = document.getElementById("cvas");
	// 横幅を設定
	canvas1.width = width;
	// 縦幅を設定
	canvas1.height = height;
	// 背景色
	canvas1.style.backgroundColor = "#aaaaaa";
}

// 非活性化
function disable() {
	document.getElementById("v_x").disabled = true;
	document.getElementById("v_y").disabled = true;
	document.getElementById("t_iv").disabled = true;
	document.getElementById("t_f").disabled = true;
	document.getElementById("start").disabled = true;
	document.getElementById("sltid").disabled = true;
}
// 活性
function able() {
	document.getElementById("v_x").disabled = false;
	document.getElementById("v_y").disabled = false;
	document.getElementById("t_iv").disabled = false;
	document.getElementById("t_f").disabled = false;
	document.getElementById("start").disabled = false;
	document.getElementById("sltid").disabled = false;
}
