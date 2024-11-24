package com.cs336.pkg;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static final String URL = "jdbc:mysql://localhost:3306/trainsystem?useSSL=false";
    private static final String USER = "root";
    private static final String PASSWORD = "RudraRaju2002$";

    public Database() {
        // Empty constructor
    }

    public Connection getConnection() {
        Connection connection = null;

        try {
            // Load MySQL JDBC Driver
            System.out.println("Loading JDBC Djjrijver...");
			Class.forName("com.mysql.jdbc.Driver").newInstance();
            System.out.println("Driver loaded successfully!");

            // Create a connection to your DB
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connected to the database!");

        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found!");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Database connection failed!");
            e.printStackTrace();
        } catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        return connection;
    }

    public void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
                System.out.println("Connection closed successfully!");
            } catch (SQLException e) {
                System.err.println("Error closing connection!");
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        Database dao = new Database();
        Connection connection = dao.getConnection();

        if (connection != null) {
            System.out.println("Connection test successful!");
        } else {
            System.err.println("Failed to establish connection.");
        }

        dao.closeConnection(connection);
    }
}
