//マス目の数を決める
var gridNo = 0;
//記憶する四角の数を決める
var square = 0;
//全体の縦横の長さ
var all = 600;
//赤いマス
var ramCol = new Array(square);
var ramRow = new Array(square);

//間違えらる回数
var missCnt = 3;
//合っていた回数
var matchCnt = 0;

//マス目を初期状態に戻す
function init(){
	var grid = document.getElementsByName("grid");
	for(var r = 0; r < grid.length ; r++){
		if(grid[r].checked){
			gridNo = grid[r].value;
		}
	}
	var tElm = document.getElementById("tElm");
	//セルをすべて青にする
	for(var i = 0; i < gridNo ; i++){
		for(var j = 0;j < gridNo ; j++){
			tElm.rows[i].cells[j].style.backgroundColor = "#0000ff";
		}
	}
	document.getElementById("start").disabled=false;
}
//記憶するべき赤い四角をランダムに作る
function paintQuest(){
	var grid = document.getElementsByName("grid");
	for(var r = 0; r < grid.length ; r++){
		if(grid[r].checked){
			gridNo = grid[r].value;
		} else {
			grid[r].disabled = true;
		}
	}
	if(gridNo == 4){
		square = 5;
	} else if(gridNo == 6){
		square = 6;
	} else if(gridNo == 9){
		square = 10;
	} else {
		alert("システムエラー");
		return null;
	}
	var tElm = document.getElementById("tElm");
	//セルを削除
	for (var m =tElm.childNodes.length-1; m>=0; m--) {
		tElm.removeChild(tElm.childNodes[m]);
	}
	//セルを挿入
	for(var i = 0; i < gridNo ; i++){
		tElm.insertRow(-1);
		for(var j = 0;j < gridNo ; j++){
			tElm.rows[i].insertCell(-1);
			tElm.rows[i].cells[j].setAttribute("onclick",["out(" + i,j + ")"].join(","));
			tElm.rows[i].cells[j].style.backgroundColor = "#0000ff";
			tElm.rows[i].cells[j].width = all/gridNo;
			tElm.rows[i].cells[j].height = all/gridNo;
		}
	}

	var myTbl = document.getElementById("tElm");
	for (var j = 0; j < square; j++) {
		var ramRowObj = Math.floor(Math.random() * gridNo);
		var ramColObj = Math.floor(Math.random() * gridNo);
		for (var b = 0; b <= j; b++) {
			if ((ramRowObj == ramRow[b]) && (ramColObj == ramCol[b])) {
				ramRowObj = Math.floor(Math.random() * gridNo);
				ramColObj = Math.floor(Math.random() * gridNo);
				b = -1;
			}
		}
		ramRow[j] = ramRowObj;
		ramCol[j] = ramColObj;
	}
	for(var c1 = 0; c1 < gridNo ; c1++){
		for(var c2 = 0; c2 < gridNo; c2++){
			for(var k = 0; k < square; k++){
				if(c1 == ramRow[k] && c2 == ramCol[k]){
					myTbl.rows[c1].cells[c2].style.backgroundColor = "#ff0000";
					break;
				}
				myTbl.rows[c1].cells[c2].style.backgroundColor = "#0000ff";
			}
		}
	}
	document.getElementById("start").disabled=true;
	//初期化
	missCnt = 3;
	matchCnt = 0;
	setTimeout(init, 8000);
}

//当たり判定
function out(i,j){
	var matchFlg = true;
	var myTbl = document.getElementById("tElm");
	for(var No = 0;No < square;No++){
		//合っていた場合
		if(parseInt(i) == ramRow[No] && parseInt(j) == ramCol[No]){
			myTbl.rows[ramRow[No]].cells[ramCol[No]].style.backgroundColor = "#ff0000";
			matchCnt++;
			matchFlg = false;
		}
	}
	if(matchFlg == true){
		myTbl.rows[i].cells[j].style.backgroundColor = "yellow";
		missCnt--;
		alert("間違っています後" + missCnt + "回");
	}
	if(missCnt <= 0 || matchCnt == square){
		alert("終了です。" + matchCnt + "ポイント");
		for(var ansNo = 0;ansNo < square ; ansNo++){
			myTbl.rows[ramRow[ansNo]].cells[ramCol[ansNo]].style.backgroundColor = "#ff0000";
		}
		var grid = document.getElementsByName("grid");
		for(var r = 0; r < grid.length ; r++){
			if(grid[r].checked == false){
				grid[r].disabled = false;
			}
		}
	}
}
