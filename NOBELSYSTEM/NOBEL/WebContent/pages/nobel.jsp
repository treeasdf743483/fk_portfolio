<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NOBEL ノベル画面</title>
</head>
<body>

	<form  action="../Input" method="POST">

		<a method="POST" href="../List" >説の一覧画面へ</a>
		<a href="../List" >フレンド一覧画面へ</a>
		<table align="center" width="500">
			<tr>
				<td>テーマ：</td>
				<td><input type="text" name="thema" /></td>
			</tr>
			<tr>
				<td>詳細：</td>
				<td><textarea name="detail"></textarea></td>
			</tr>
			<tr>
				<td>根拠：</td>
				<td><textarea name="basis"></textarea></td>
			</tr>
		</table>
		<button type="submit" align="right">発信</button>
	</form>
</body>
</html>