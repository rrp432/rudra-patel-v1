<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <%@ page import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Logout</title>
</head>
<body>
<%
    // Invalidate the session to log the user out
    session.invalidate();
%>
<p>You have been logged out.</p>
<a href="login.jsp">Go to Login Page</a> <!-- Replace with the actual login page path -->
</body>
</html>