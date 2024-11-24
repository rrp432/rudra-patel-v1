<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.http.*, javax.servlet.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homepage</title>
    <style>
        /* General Styles */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        header {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        header h1 {
            margin: 0;
        }

        .welcome {
            font-size: 18px;
            margin-top: 10px;
        }

        .role-info {
            margin-top: 5px;
            font-size: 16px;
            color: #d4f2e0;
        }

        /* Button Container */
        .button-container {
            margin-top: 50px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            max-width: 800px;
        }

        /* Button Styles */
        .button {
            display: inline-block;
            width: 220px;
            padding: 15px 20px;
            text-align: center;
            text-decoration: none;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            transition: transform 0.2s, background-color 0.3s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .button:hover {
            background-color: #45a049;
            transform: translateY(-5px);
        }

        .button:active {
            transform: translateY(2px);
        }

        footer {
            margin-top: auto;
            padding: 10px;
            text-align: center;
            background-color: #f4f4f9;
            color: #777;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <h1>Welcome to the Train System</h1>
        <%
            String username = (String) session.getAttribute("user");
            String userRole = (String) session.getAttribute("userRole");
            if (username != null) {
        %>
            <p class="welcome">Welcome, <%= username %>!</p>
            <p class="role-info">You are logged in as: <strong><%= userRole.toUpperCase() %></strong></p>
        <%
            }
        %>
    </header>

    <!-- Buttons -->
    <div class="button-container">
        <!-- Common buttons for all users -->
        <a href="searchSchedules.jsp" class="button">Search for Trains</a>
        <a href="viewBookings.jsp" class="button">View Bookings</a>
        
        <!-- Additional buttons for admin users -->
        <%
            if ("admin".equalsIgnoreCase(userRole)) {
        %>
            <a href="manageUsers.jsp" class="button">Manage Users</a>
            <a href="viewReports.jsp" class="button">View Reports</a>
        <%
            }
        %>
    </div>

    <!-- Footer -->
    <footer>
        &copy; 2024 Train System. All Rights Reserved.
    </footer>
</body>
</html>
