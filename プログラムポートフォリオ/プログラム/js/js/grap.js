//選択されたグラフを描画する
//設計書:graphtml.xls
function grap(){
	//宣言部
	var sltid=document.forms.frm.slt;
	var x= new Array(100);
	var y=new Array(100);
	var gaussSum;
	var average;
	average=0;
	var cavs = document.getElementById("grap");
	var variance;
	variance=10;
	x[0]=0;
	for(var i=1;i < x.length;i++){
		x[i]=x[i-1]+1;
	}

	//処理部
	if(sltid.value=="exp"){
		for(var j=0;j < y.length;j++){
			//ガウス関数
			y[j]=cavs.height/(variance*Math.pow(2*Math.PI,0.5))*(Math.exp(-0.5*Math.pow((x[j]-average)/variance,2)));
		}

	} else if(sltid.value=="ratio"){
		for(var j=0;j < y.length;j++){
			y[j]=x[j];
		}
	} else if(sltid.value=="test"){
		if (cavs.getContext) {
			var context1 = cavs.getContext('2d');

		    //ここに具体的な描画内容を指定する
		    //新しいパスを開始する
		    context1.beginPath();
		    context1.fillStyle = '#00ff00';
		    context1.fillRect(0,0,cavs.height,cavs.width);
		    //パスの開始座標を指定する
		    context1.moveTo(100,100);
		    context1.lineTo(100,300);
		  //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
		  context1.closePath();
		  //現在のパスを輪郭表示する
		  context1.stroke();
		  return null;
		}
	} else if(sltid.value=="power"){
		for(var j1=1;j1 < y.length;j1++){
			y[j1]=y[j1-1]+0.001*Math.pow(x[j1],2);
		}
	} else {
		alert("入力エラー。選択したデータはありません");
	}
	//値のチェック
	// テキストエリアの値をコンソールに文字列を出力
	for(var i1=0;i1 < x.length ;i1++){
	console.log(x[i1]);
	console.log(y[i1]);
	}

	//グラフ描画
		if (cavs.getContext) {
			var context = cavs.getContext('2d');
			//ここに具体的な描画内容を指定する
		    //新しいパスを開始する
		    context.beginPath();
		    context.fillStyle = '#00ff00';
		    context.fillRect(0,0,cavs.height,cavs.width);
		    //パスの開始座標を指定する
		    context.moveTo(x[0],cavs.height-y[0]);
		    for(var k=1;k < x.length ;k++){
		    //座標を指定してラインを引いていく
		      context.lineTo(x[k],cavs.height-y[k]);
		    }

		  //現在のパスを輪郭表示する
		  context.stroke();
	}
}
//canvasのサイズを設定(自動設定だと正確な値が定められない)
function canvasSize() {
	var canvas1 = document.getElementById("grap");
	// 横幅を設定
	canvas1.width = 700;
	// 縦幅を設定
	canvas1.height = 700;
	canvas1.style.backgroundColor = "#00FF00";
}

