<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*, java.util.*, java.sql.*" %>
<%@ page import="javax.servlet.http.*, javax.servlet.*" %>
<%@ page import="com.cs336.pkg.Database" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Login Processing</title>
</head>
<body>
<%
    String userid = request.getParameter("username");   
    String pwd = request.getParameter("password");
    Database db = new Database();
    Connection con = null;
    Statement st = null, st2 = null;
    ResultSet rs = null, rs2 = null;

    try {
        con = db.getConnection();
        st = con.createStatement();
        st2 = con.createStatement();
        
        rs = st.executeQuery("SELECT * FROM employee_manager WHERE username='" + userid + "' AND password='" + pwd + "';");
        rs2 = st2.executeQuery("SELECT * FROM customer WHERE username='" + userid + "' AND password='" + pwd + "';");
        
        if (rs.next() && userid != null) {
            // Admin login successful
            session.setAttribute("user", userid);
            session.setAttribute("userRole", "admin"); // Set admin role
            response.sendRedirect("homepage.jsp"); // Redirect to homepage
        } else if (rs2.next() && userid != null) {
            // Customer login successful
            session.setAttribute("user", userid);
            session.setAttribute("userRole", "user"); // Set user role
            response.sendRedirect("homepage.jsp"); // Redirect to homepage
        } else {
            // Invalid login
            out.println("<p>Incorrect username or password</p>");
            out.println("<p><a href='login.jsp'>Go Back To Login Page</a></p>");
        }
    } catch (Exception e) {
        e.printStackTrace();
        out.println("<p>Error processing login. Please try again later.</p>");
    } finally {
        try {
            if (rs != null) rs.close();
            if (rs2 != null) rs2.close();
            if (st != null) st.close();
            if (st2 != null) st2.close();
            if (con != null) db.closeConnection(con);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
%>
</body>
</html>
