//作成日時　2016/11/9 35 18  20:00
//m入力 左下にふっきれる 原因　初期値　エラー204行目 b空条件ひっかかる outWrite成功　最初血がy v**2爆発　y爆発　java参照
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
var vx0;
var b;
var vy0;
var h = 0;
var x=y_init;
	var y=y_init;
	var vx=vx0;
	var vy=vy0;
	var cnt=0;
var planetColor = [ 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(200,200,93)',
		'rgb(255,0,0)', 'rgb(143,99,66)', 'rgb(255,255,255)', '#ffff8c' ];
var planetz = new Array(100);

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

			context.font= 'normal 1px ＭＳ 明朝';
			planetz[m] = document.frm.slt.options[m].text;
			context.beginPath();
			context.strokeStyle = planetColor[m];
			context.strokeText(planetz[m], width - 140, 3+20 * (m + 1));

			context.moveTo(width - 110, 20 * (m + 1));
			context.lineTo(width - 10, 20 * (m + 1));
			context.stroke();
			context.closePath();
		}
	}
}

function animeExe() {
	var t_iv;
	var vx0;
	var vy0;
	var t_f;
	var g_in = 9.80 * Number(document.forms.frm.slt.value);
	vx0 = Number(document.getElementById("v_x").value.trim());
    vy0 = Number(document.getElementById("v_y").value.trim());
	t_f = Number(document.getElementById("t_f").value.trim());
	t_iv = Number(document.getElementById("t_iv").value.trim());
	b = Number(document.getElementById("b").value.trim());
	console.log(b);
	vx = vx0;
	vy = vy0;
	//document.getElementById("degree").innerHTML=(Math.atan(vy0/vx0)*(180/Math.PI));
	//console.log("角度"+Math.atan(vy0/vx0)*(180/Math.PI));
	console.log("b:"+b);
	var renum = /\d/;
	if (vx0 == null || !renum.test(vx0) || vy0 == null || !renum.test(vy0)
			|| t_f == null || !renum.test(t_f)
			|| t_iv == null || !renum.test(t_iv)
			|| vx0==""
			|| vy0==""
			|| t_f==""
			|| t_iv==""
			|| !renum.test(b)) {
		alert("入力値に数字を入力して下さい。");
		return null;
	}

	disable();
	// 入力チェック
	console.log("t_fは" + t_f);
	console.log("t_ivは" + t_iv);
	console.log("g_inは" + g_in);
	animeObj = setInterval("motion()", 1000);
}
function motion() {
	
	var radius;

	var y_md;
	var t_iv;
	var g;
	var vx0;
	var vy0;
	var t_f;
	var m;
	var a;
	var v_f;
	var exp1;
	var exp2;
	

	vx0 = Number(document.getElementById("v_x").value);
	vy0 = Number(document.getElementById("v_y").value);
	t_f = Number(document.getElementById("t_f").value);
	t_iv = Number(document.getElementById("t_iv").value);
	g = 9.80 * Number(document.forms.frm.slt.value);
	mass= Number(document.getElementById("m").value);
	b= Number(document.getElementById("b").value);
	vx=vx0;
	vy=vy0;
	if(cnt==0){
		x_later=x_init;
		y_later=y_init;
	}
	if(b==0){
			x = vx0 * t + x_init;
			y = y_init + vy0 * t - 0.500 * g * t * t;
			v_x = vx0;
			v_y = -g*t +vy0; 
			
			

	} else {
		//空気抵抗の速度
		//vx = vx0*Math.exp(-a/m*t);
		//vy = -v_f+Math.exp(-a/m*t)*(vy0+v_f);
			
			vx=vx0+vx+rungekt_vx2(t,vx,x);
			x=x+rungekt_lx2(t,vx,x);
			vy=vy0+vy+rungekt_v(t,vy,y);
			y=y+rungekt_x(t,vy,y);
			//t=t+t_iv;
			//y_md = height - y;
			console.log("vx"+vx);
			console.log("x"+x);
			//console.log("t"+t);
		}
		
	
	
	cnt++;
	t=t+t_iv;
	y_md = height - y;
	
	draw(x_later,y_later,x,y_md);
			x_later = x;
			y_later = y_md;
			outWrite(vx, vy, x, y, t, cnt);
			if (t >= t_f || y <= 0|| y >= width) {
				clearInterval(animeObj);
			cnt = 0;
			}
			//停止した時、cntを初期化
			//if(clearInterval(animeObj)){
		//		cnt=0;
		//	}
	// 出力チェック
	//console.log(x);
	//console.log(y);
	//console.log(t);
	
	//console.log("after" + t);
	
	//t = t + t_iv;
	//step++;
	
	//console.log("222222222");
}

function draw(x1,y1,x2,y2){
var index = Number(document.forms.frm.slt.selectedIndex);
var canvas = document.getElementById("cvas");
if (canvas.getContext) {
		var context = canvas.getContext('2d');
		var context1 = canvas.getContext('2d');
			// 新しいパスを開始する
			context.beginPath();
			// 色を付ける
			context.strokeStyle = planetColor[index];
			console.log("index" + index);
			// 球の運動
			if (cnt % 5 == 0 || y <= 0) {
				context.arc(x2, y2, 20, 0, Math.PI * 2, true);
			}
			context.moveTo(x1,y1);
			context.lineTo(x2, y2);
			// 現在のパスを輪郭表示する
			context.stroke();
			context.closePath();
			
		}

}
function outWrite(vx, vy, x, y, t, step) {
	// 内容を表示させるための領域を追加
	var outTBL = document.getElementById("OUT");
	if (step <= 30) {
		var rows = outTBL.insertRow(-1);
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

	//console.log("inner" + x);
	//console.log(y);
}
function animeStop() {
	clearInterval(animeObj);
	//disable();

}
// もう一回始める
function restart() {
	//console.log(Number(document.forms.frm.save.value));
	
	var canvas2 = document.getElementById("cvas");
	if (canvas2.getContext) {
		var context = canvas2.getContext('2d');
		// クリア
		
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
	clearInterval(animeObj);
	var outTBL2 = document.getElementById("OUT");
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
}
// 活性
function able() {
	document.getElementById("v_x").disabled = false;
	document.getElementById("v_y").disabled = false;
	document.getElementById("t_iv").disabled = false;
	document.getElementById("t_f").disabled = false;
	document.getElementById("start").disabled = false;
	
}
//y方向
function rungekt_x(t,a,x){
	var count=1;
	h=0.0010;
	//x[0]不明
	var q1 = h*g(t,a,x);
	var k1= h*f(t,a,x);
	console.log(q1);
	var q2 = h*g(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var k2 = h*f2(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var q3 = h*g(t+h*0.5,a+q2*0.5,x+k2*0.5);
	var k3 = h*f2(x+0.5*h,a+0.5*q2,x+0.5*k2);
 	var q4 = h+g(x+h,a+q3,x+q3);
 	var k4 =h*f2(x+h,a+q3,x+q3);
	a=q1/6+q2/3+q3/3+q4/6+a;
	x=k1/6+k2/3+k3/3+k4/6+x;
	console.log(x);
	return x;
}

function rungekt_v(t,a,x){
	var count=1;
	h = 0.0010;
	//x[0]不明
	var q1 = h*g(t,a,x);
	var k1= h*f(t,a,x);
	console.log("k1 "+k1);
	var q2 = h*g(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var k2 = h*f(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var q3 = h*g(t+h*0.5,a+q2*0.5,x+k2*0.5);
	var k3 = h*f(x+0.5*h,a+0.5*q2,x+0.5*k2);
 	var q4 = h*g(x+h,a+q3,x+q3);
 	var k4 = h*f(x+h,a+q3,x+q3);
	a=q1/6+q2/3+q3/3+q4/6+a;
	x=k1/6+k2/3+k3/3+k4/6+x;
	return a;
}
//x方向
function rungekt_vx2(t,a,x){
	var count=1;
	h = 0.0010;
	//x[0]不明
	var q1 = h*g(t,a,x);
	var k1= h*f(t,a,x);
	console.log(q1);
	var q2 = h*g(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var k2 = h*f2(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var q3 = h*g(t+h*0.5,a+q2*0.5,x+k2*0.5);
	var k3 = h*f2(x+0.5*h,a+0.5*q2,x+0.5*k2);
 	var q4 = h+g(x+h,a+q3,x+q3);
 	var k4 =h*f2(x+h,a+q3,x+q3);
	a=q1/6+q2/3+q3/3+q4/6+a;
	x=k1/6+k2/3+k3/3+k4/6+x;
	return a;
}
function rungekt_lx2(t,a,x){
	var count=1;
	h = 0.0010;
	//x[0]不明
	var q1 = h*g(t,a,x);
	var k1= h*f(t,a,x);
	console.log(q1);
	var q2 = h*g(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var k2 = h*f2(t+0.5*h,a+q1*0.5,x+k1*0.5);
	var q3 = h*g(t+h*0.5,a+q2*0.5,x+k2*0.5);
	var k3 = h*f2(x+0.5*h,a+0.5*q2,x+0.5*k2);
 	var q4 = h+g(x+h,a+q3,x+q3);
 	var k4 =h*f2(x+h,a+q3,x+q3);
	a=q1/6+q2/3+q3/3+q4/6+a;
	x=k1/6+k2/3+k3/3+k4/6+x;
	return x;
}
function f(a,d,c){
b=Number(document.getElementById("b").value.trim());
console.log("b"+b);
var mass=Number(document.getElementById("m").value);
//b=Number(document.getElementById("b").value);
var g_m = 9.80 * Number(document.forms.frm.slt.value);
if(Number(d) >= 0){
	return -g_m-b*d*d/mass;
} else if(Number(d) < 0){
	return -g_m+b*d*d/mass;
}
}

function f2(a,d,c){
b=Number(document.getElementById("b").value.trim());
console.log("b"+b);
var mass=Number(document.getElementById("m").value);
//b=Number(document.getElementById("b").value);
var g_m = 9.80 * Number(document.forms.frm.slt.value);
if(Number(d) >= 0){
	return -b*d*d/mass;
} else if(Number(d) < 0){
	return +b*d*d/mass;
}
}
function g(a,d,c){
	return d ;
	}
