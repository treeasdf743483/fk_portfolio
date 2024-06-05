//四角形の色を塗るメソッド
function paint(element){
	var colorDep;
	var redDep;
	var greenDep;
	var blueDep;

	//色を計算
	redDep = addZero(document.forms.frm.redDep.value);
	greenDep = addZero(document.forms.frm.greenDep.value);
	blueDep = addZero(document.forms.frm.blueDep.value);
	//色の合計
	colorDep = "#" + redDep + greenDep + blueDep + ";";
	//四角の色を選択した色に変える
	var elmId = element.id;
	document.getElementById(elmId).style.cssText = "background-color:" + colorDep;
}

//十進数から十六進数して、桁が1桁の場合、先頭に0を追加
function addZero(num){
	var strSixthNum = (Number(num)).toString(16);
	if(strSixthNum.length < 2){
		strSixthNum = "0" + strSixthNum;
	}
	return strSixthNum;
}