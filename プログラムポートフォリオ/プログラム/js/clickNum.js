x=0;
a=0;
function clickNum(){
	var x = x + a;
	c();
	 function c(){
		a++;
		alert(a);
	}
}
function cj(x){	
	var f = clickNum(x);
	f();
}