<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*, java.util.*, java.sql.*" %>
<%@ page import="javax.servlet.http.*, javax.servlet.*" %>
<%@ page import="com.cs336.pkg.Database" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<% 
	String userid = request.getParameter("username");
	String email = request.getParameter("email");
	String pass = request.getParameter("password");
	String fname = request.getParameter("first_name");
	String lname = request.getParameter("last_name");
	Database db = new Database();
	Connection con = db.getConnection();
	Statement st = con.createStatement();
	ResultSet rs = st.executeQuery("SELECT * FROM customer WHERE username = '"+userid+"' AND password ='"+pass+"';");
	 if (rs.next() && userid != null) {
		 rs.close();
	     st.close();
	     out.println("<p>Account already exists");
	     out.println("<p><a href='login.jsp'>login</a></p>");
	 }else {					
		String query = "INSERT INTO customer(username, email, password, first_name, last_name) VALUE (?, ?, ?, ?, ?)";
		PreparedStatement pre = con.prepareStatement(query);
		pre.setString(1, userid);
		pre.setString(2, email);
		pre.setString(3, pass);
		pre.setString(4, fname);
		pre.setString(5, lname);
		int rowsInserted = pre.executeUpdate();
		rs.close();
    	st.close();
     	db.closeConnection(con);
	 }
	
%>

</body>
</html>