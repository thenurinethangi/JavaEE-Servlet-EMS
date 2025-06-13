package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.dbcp2.BasicDataSource;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

@WebServlet("/signup/*")
public class SignUpServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/json");

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String,String> user = objectMapper.readValue(req.getInputStream(), Map.class);

        String userName = user.get("userName");
        try {
            BasicDataSource basicDataSource = (BasicDataSource) req.getServletContext().getAttribute("dataSource");
            Connection connection = basicDataSource.getConnection();
            PreparedStatement pst = connection.prepareStatement("select * from user where userName = ?");
            pst.setString(1,userName);
            ResultSet result = pst.executeQuery();

            if(result.next()){
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ObjectMapper objectMapper1 = new ObjectMapper();
                objectMapper1.writeValue(resp.getWriter(),Map.of("code", "400",
                                                                "status", "bad request",
                                                                "message", "user name exist!"));
                return;
            }

            PreparedStatement pst1 = connection.prepareStatement("insert into user (userName,fullName,email,password) values(?,?,?,?)");
            pst1.setString(1,user.get("userName"));
            pst1.setString(2,user.get("fullName"));
            pst1.setString(3,user.get("email"));
            pst1.setString(4,user.get("password"));
            int result1 = pst1.executeUpdate();

            if(result1>0){
                resp.setStatus(HttpServletResponse.SC_OK);
                ObjectMapper objectMapper1 = new ObjectMapper();
                objectMapper1.writeValue(resp.getWriter(),Map.of("code", "200",
                                                                "status", "ok",
                                                                "message", "success!"));
            }
            else{
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ObjectMapper objectMapper1 = new ObjectMapper();
                objectMapper1.writeValue(resp.getWriter(),Map.of("code", "500",
                                                                "status", "error",
                                                                "message", "failed!"));
            }
            connection.close();
        }
        catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ObjectMapper objectMapper1 = new ObjectMapper();
            objectMapper1.writeValue(resp.getWriter(),Map.of("code", "500",
                                                            "status", "error",
                                                            "message", "internal server error!"));
            throw new RuntimeException(e);
        }
    }
}
