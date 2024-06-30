<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%--もう一つページを作る --%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
	String[] msg = {"志望動機","自己PR","長所","困難打破経験","業務スキル","人とは何か？"};
int ram = (int)(Math.random()*msg.length);

%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>面接プログラム2</title>
</head>
<body>
<form action="/QASpeak/Speak" method="post">
<div>質問</div>
<p><%=msg[ram] %></p>
<input type ="text" name="sp_in"/>
<input type="submit" value="回答"/>
</form>
</body>
</html>