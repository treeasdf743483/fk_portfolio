<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	<!-- 日本語リンク読み取り不可 -->
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>一覧画面</title>
</head>
<body>
<form accept-charset="UTF-8">
<% request.setCharacterEncoding("UTF-8"); %>
	<% int cntThema = (int)(request.getAttribute("cnt"));
	String[] thema = new String[cntThema];
	String str = "3333";
	thema = (String[])(request.getAttribute("themaArr")); %>
	<table align="center" width="500">
	<input type="hidden" name="cntThema" value=<%=cntThema%>>
	<%for(int i = 0; i < cntThema;i++ ){ %>
		<tr>
			<td>テーマ：</td>
			<td><a href="http://localhost:8080/NOBEL/Detail?thema=<%=thema[i] %> &cntThema=<%=cntThema %>"><%=thema[i]%></a></td>
		</tr>
	<% }%>
	</table>
	</form>
</body>
</html>