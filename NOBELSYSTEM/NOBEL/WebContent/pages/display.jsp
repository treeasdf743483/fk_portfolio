<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="form.InputForm" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NOBEL 表示画面</title>
</head>
<body>
<% InputForm inputForm = (InputForm)request.getAttribute("inputForm");%>
	<form action="./Input" method="POST">
		<table align="center" width="500">
			<tr>
				<td>テーマ：</td>
				<td><%=inputForm.getThema()%></td>
			</tr>
			<tr>
				<td>詳細：</td>
				<td><%=inputForm.getDetail()%></td>
			</tr>
			<tr>
				<td>根拠：</td>
				<td><%=inputForm.getBasis()%></td>
			</tr>
		</table>
		<input type="submit" value="前へ戻る"/>
	</form>
</body>
</html>