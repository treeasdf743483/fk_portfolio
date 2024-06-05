var t = 2;
function init() {
	//初期表示
	canvasSize();
	extend();
}
function extend() {
	setInterval(cross, 1000);
}
function cross() {
	var canvas = document.getElementById("universe");
	var width = canvas.width;
	var heigth = canvas.height;

	if (canvas.getContext) {
		var context = canvas.getContext('2d');
		// クリア
		context.clearRect(0, 0, width, heigth);
		// 横線と縦線を画面一杯にひく
		for (var i = 0; i < heigth; i++) {
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
	var canvas1 = document.getElementById("universe");
	// 横幅を設定
	canvas1.width = 500;
	// 縦幅を設定
	canvas1.height = 500;
}