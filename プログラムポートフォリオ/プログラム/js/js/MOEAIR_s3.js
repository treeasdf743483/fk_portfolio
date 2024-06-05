//作成日時　2016/11/9 35 18  20:00 19:35
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
var x_later=x_init;
var y_later=y_init;
var saveFlg = false;

var  x_arr = new Array(2);
var  v_arr = new Array(2);
var  f = new Array(4);
var  k1 = new Array(4);
var k2 = new Array(4);
var k3 = new Array(4);
var k4 = new Array(4);
var initFg = true;
var delt = 0.01;
var b;
var vy0;
var h = 0;
var cnt = 1;
var x;
var y;

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
	if(initFg==true){
		x_arr[0]=x_init;
		x_arr[1]=y_init;
		v_arr[0]=vx0;
		v_arr[1]=vy0;
		
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
		
			x=-mass/b*Math.log(b*vx0/mass*t+1)+x_init;
			var v_f=Math.sqrt(mass*g/b);
			var A_i = (v_f-vy0)/(v_f+vy0);
			console.log(Math.floor(A_i*Math.exp(1+A_i*Math.exp(-2*v_f*t))*Math.pow(10,7))/Math.pow(10,7)+" "+v_f);
			y=-3*v_f*t+Math.log(A_i)-Math.log(1+Math.floor(A_i*Math.exp(1+A_i*Math.exp(-2*v_f*t))*Math.pow(10,7))/Math.pow(10,7))+y_init;
			console.log("y"+y);
			console.log("x"+x);
			//console.log("t"+t);
		}
		
	
	initFlg = false;
	t=t+t_iv;
	y_md = height - y;
	cnt++;
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

//x方向
function rungekt_lx2(xm2,vm2,i){
		var x2=xm2;
		var v2 = vm2;
		
		k1[i] = delt*f3(x2,v2,i)/6;
		x2 = x2+ delt*k1*0.5;
		f = f3(x2,v2,i);
		k2[i] = delt*f/3;
		x2 = x2+ delt*k2*0.5;
		f = f3(x2,v2,i);
		k3[i] = delt*f/3;
		x2 = x2+ delt*k3;
		f = f3(x2,v2,i);
		k4[i] = delt*f/6;
		return k1[i]+k2[i]+k3[i]+k4[i];
		
}
//v
function rungekt_lv2(xm3,vm3,i){
       var k = i+2
       var x3 = xm3;
       var v3 = vm3;
		k1[k] = delt*f3(x3,v3,k)/6;
		x3 = x3+ delt*k1*0.5;
		f = f3(x3,v3,k);
		k2[k] = delt*f/3;
		x3 = x3+ delt*k2*0.5;
		f = f3(x3,v3,k);
		k3[k] = delt*f/3;
		x3 = x3+ delt*k3;
		f = f3(x3,v3,k);
		k4[k] = delt*f/6;
		return k1[k]+k2[k]+k3[k]+k4[k];
		
}

function f3(xm,vm,i) {
var ms=Number(document.getElementById("m").value);
var b=Number(document.getElementById("b").value);
console.log(xm);
	f[0]=xm;
	f[1]=vm;
	var gm = 9.80 * Number(document.forms.frm.slt.value);
	if(vm >=0) {
		f[2]=-b*vm*vm;

	}else{
			f[2]=b*vm*vm;
	}
	if(vm >=Math.sqrt(ms*gm/b)){
			f[3]=-ms*gm-b*vm*vm;
	}
	else {
		f[3]=-ms*gm+b*vm*vm;
	}
	return f[i];
}