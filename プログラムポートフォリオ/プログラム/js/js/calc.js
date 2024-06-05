sum = "";
var array = new Array(100);
var i = 0;
var ans=0;
var j = 0;
var memo = 0;
function calc(x) {
		sum = document.getElementById("txt").value + x;
	b(x);
	function b(b) {
		if (b == "ENTER") {
			var sumSubstr = sum.replace("ENTER","");
			try {
				var f = mathEval(sumSubstr);
				ans = f();
			} catch (e) {
				alert("計算式が有効ではありません。見直してください");
			}
			document.getElementById("txt").value = ans;
			sum = ans;
		} else if (b == "DEL") {
			sum = "";
			document.getElementById("txt").value = sum;
		}

		else {

			document.getElementById("txt").value = sum;
		}
	}
}

function Memo(c) {
	if (c == "M+") {

		array[i] = document.getElementById("txt").value;
		i++;
	} else if (c == "M-") {
		array[i] = -document.getElementById("txt").value;
		i++;
	} else if (c == "MR") {

		for (j = 0; j < i; j++) {
			memo = memo + parseInt(array[j]);
		}
		document.getElementById("txt").value = memo;
		i = 0;
		array.clear;
	} else if (c == "MC") {
		array.clear;
		memo = 0;
	}
}

function mathEval(arg) {
	  return Function('return ' + arg);
	}
function fcs(){
	document.getElementById("txt").focus();
}
