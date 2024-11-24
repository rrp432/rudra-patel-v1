<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*, java.util.*, java.sql.*" %>
<%@ page import="com.cs336.pkg.Database" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Train Schedules</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        .no-results {
            color: red;
            font-weight: bold;
            margin-top: 20px;
        }
        .back-button {
            margin-top: 20px;
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .back-button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Train Schedules</h1>

    <%
        String origin = request.getParameter("origin");
        String destination = request.getParameter("destination");

        Database db = new Database();
        Connection con = null;
        PreparedStatement pst = null;
        ResultSet rs = null;

        try {
            con = db.getConnection();

            // SQL query to fetch train schedules based on origin and destination
            String sql = "SELECT t.tl_nick, s1.name AS origin_name, s2.name AS destination_name, tl.fare "
                       + "FROM transit_line tl "
                       + "JOIN station s1 ON tl.origin_station_id = s1.station_id "
                       + "JOIN station s2 ON tl.destination_station_id = s2.station_id "
                       + "WHERE s1.name = ? AND s2.name = ?";

            pst = con.prepareStatement(sql);
            pst.setString(1, origin);
            pst.setString(2, destination);

            rs = pst.executeQuery();

            boolean hasResults = false;

            if (rs.isBeforeFirst()) {
                hasResults = true;
    %>

    <!-- Display the results in a table -->
    <table>
        <tr>
            <th>Transit Line</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Fare</th>
        </tr>
        <%
                while (rs.next()) {
        %>
        <tr>
            <td><%= rs.getString("tl_nick") %></td>
            <td><%= rs.getString("origin_name") %></td>
            <td><%= rs.getString("destination_name") %></td>
            <td>$<%= rs.getFloat("fare") %></td>
        </tr>
        <%
                }
            }
        %>
    </table>

    <% if (!hasResults) { %>
        <p class="no-results">No train schedules found for the selected route.</p>
    <% } %>

    <a href="searchSchedules.jsp" class="back-button">Go Back</a>

    <%
        } catch (Exception e) {
            e.printStackTrace();
            out.println("<p class='no-results'>An error occurred while fetching train schedules. Please try again later.</p>");
        } finally {
            try {
                if (rs != null) rs.close();
                if (pst != null) pst.close();
                if (con != null) db.closeConnection(con);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    %>
</body>
</html>
