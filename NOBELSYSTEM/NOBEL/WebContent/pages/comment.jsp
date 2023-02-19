<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>コメント画面</title>
</head>
<body>

<form name=f  method=POST action="http://localhost:8080/NOBEL/Comment2">
			<input type=hidden name=x1 value=v1>


		<a href="javascript:document.f.submit()">リンクから submit</a>


<% request.setCharacterEncoding("UTF-8"); %>
	<% int cnt = (int)(request.getAttribute("cnt"));
	String[] comment = new String[cnt];
	//request.setAttribute("cnt",cnt);
	String str = "3333";
	comment = (String[])(request.getAttribute("commentArr")); %>
	<div>主題</div>
	<br>
	<div><% String theory = (String)(request.getAttribute("theory"));
			int cntThema = (int)(request.getAttribute("cntThema"));
			%>
		<%=theory %>
	</div>
	<input type="hidden" name="thoery" value=<%=theory%>>
	<input type="hidden" name="cnt" value=<%=cnt%>>
	<input type="hidden" name="cntThema" value=<%=cntThema%>>
	<table align="center" width="500">
	<%for(int i = 0; i < cnt;i++ ){ %>
		<tr>
			<td>No.<%=i+1%></td>
			<td><%=comment[i]%></td>
		</tr>
	<% }%>
	<tr>
		<td>
		コメントする
		</td>
		</tr>
		<tr>
		<td>
			<input type="text" name = "comment"/>
		</td>
		</tr>
		<tr>
		<td>
			<button type="submit" align="right">コメント送信</button>
		</td>
		</tr>
		</table>
	</form>
</body>
</html>