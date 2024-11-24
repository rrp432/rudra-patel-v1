<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <%@ page import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Create Account</title>
</head>
<body>
	<h2>Create Account</h2>
	<form action="createAccountInfo.jsp" method="post">
		<div>Username:<input type:"text" name="username" required> </div>
		<div>Email:<input type:"text" name="email" required> </div>
		<div>Password:<input type:"password" name="password" required> </div>
		<div>First Name:<input type:"text" name="first_name" required> </div>
		<div>Last Name:<input type:"text" name="last_name" required> </div>
		<input type ="submit" value="CreateAccount">
	</form>

</body>
</html>