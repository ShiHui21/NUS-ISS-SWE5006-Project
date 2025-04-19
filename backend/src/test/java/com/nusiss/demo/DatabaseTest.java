//package com.nusiss.demo;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import javax.sql.DataSource;
//import java.sql.SQLException;
//
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//@SpringBootTest
//class DatabaseTest {
//
//    @Autowired
//    private DataSource dataSource;
//
//    @Test
//    void contextLoads() throws SQLException {
//        // Assert that the connection to the database is successful
//        assertNotNull(dataSource.getConnection(), "Database connection should not be null");
//    }
//}
