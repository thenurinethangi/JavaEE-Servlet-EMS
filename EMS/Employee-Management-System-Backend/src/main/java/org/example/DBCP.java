package org.example;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.Connection;
import java.sql.SQLException;

@WebListener
public class DBCP implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setDriverClassName("com.mysql.jdbc.Driver");
        basicDataSource.setUrl("jdbc:mysql://localhost:3306/employeedb");
        basicDataSource.setUsername("root");
        basicDataSource.setPassword("Ijse@1234");
        basicDataSource.setInitialSize(25);
        basicDataSource.setMaxTotal(50);

        ServletContext servletContext = sce.getServletContext();
        servletContext.setAttribute("dataSource",basicDataSource);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

        ServletContext servletContext = sce.getServletContext();
        if(servletContext.getAttribute("dataSource")!=null){
            BasicDataSource basicDataSource = (BasicDataSource) servletContext.getAttribute("dataSource");
            try {
                basicDataSource.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
