<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.cs336.pkg.Database" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Train Schedules</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        label {
            display: block;
            margin: 10px 0 5px;
            font-weight: bold;
        }
        select, input[type="date"], button {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Search Train Schedules</h1>
        <form action="displaySchedules.jsp" method="get">
            <label for="origin">Origin</label>
            <select id="origin" name="origin" required>
                <option value="">Select Origin</option>
                <% 
                    Database db = new Database();
                    Connection con = null;
                    Statement stmt = null;
                    ResultSet rs = null;
                    try {
                        con = db.getConnection();
                        stmt = con.createStatement();
                        rs = stmt.executeQuery("SELECT DISTINCT s.name FROM station s JOIN transit_line_stops t ON s.station_id = t.start_station");
                        while (rs.next()) {
                            String stationName = rs.getString("name");
                            out.println("<option value='" + stationName + "'>" + stationName + "</option>");
                        }
                    } catch (SQLException e) {
                        e.printStackTrace();
                    } finally {
                        try {
                            if (rs != null) rs.close();
                            if (stmt != null) stmt.close();
                            if (con != null) db.closeConnection(con);
                        } catch (SQLException e) {
                            e.printStackTrace();
                        }
                    }
                %>
            </select>

            <label for="destination">Destination</label>
            <select id="destination" name="destination" required>
                <option value="">Select Destination</option>
                <% 
                    try {
                        con = db.getConnection();
                        stmt = con.createStatement();
                        rs = stmt.executeQuery("SELECT DISTINCT s.name FROM station s JOIN transit_line_stops t ON s.station_id = t.end_station");
                        while (rs.next()) {
                            String stationName = rs.getString("name");
                            out.println("<option value='" + stationName + "'>" + stationName + "</option>");
                        }
                    } catch (SQLException e) {
                        e.printStackTrace();
                    } finally {
                        try {
                            if (rs != null) rs.close();
                            if (stmt != null) stmt.close();
                            if (con != null) db.closeConnection(con);
                        } catch (SQLException e) {
                            e.printStackTrace();
                        }
                    }
                %>
            </select>

            <label for="date">Date of Travel</label>
            <input type="date" id="date" name="date" required>

            <button type="submit">Search</button>
        </form>
    </div>
</body>
</html>
