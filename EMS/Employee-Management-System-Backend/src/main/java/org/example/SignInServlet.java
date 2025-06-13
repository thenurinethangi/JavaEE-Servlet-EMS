package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletContext;
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

@WebServlet("/signin/*")
public class SignInServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/json");

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String,String> user = objectMapper.readValue(req.getInputStream(), Map.class);

        try {
            BasicDataSource basicDataSource = (BasicDataSource) req.getServletContext().getAttribute("dataSource");
            Connection connection = basicDataSource.getConnection();
            PreparedStatement pst = connection.prepareStatement("select * from user where userName = ?");
            pst.setString(1,user.get("userName"));
            ResultSet result = pst.executeQuery();

            if(result.next()){
                String p =result.getString("password");
                if(p.equals(user.get("password"))){
                    resp.setStatus(HttpServletResponse.SC_OK);
                    ObjectMapper objectMapper1 = new ObjectMapper();
                    objectMapper1.writeValue(resp.getWriter(),Map.of("code", "200",
                                                                    "status", "ok",
                                                                    "message", "success!"));
                }
                else{
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    ObjectMapper objectMapper1 = new ObjectMapper();
                    objectMapper1.writeValue(resp.getWriter(),Map.of("code", "400",
                                                                    "status", "bad request",
                                                                    "message", "password incorrect!"));
                }
            }
            else{
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ObjectMapper objectMapper1 = new ObjectMapper();
                objectMapper1.writeValue(resp.getWriter(),Map.of("code", "400",
                                                                "status", "bad request",
                                                                "message", "user not exist!"));
            }
            connection.close();

        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ObjectMapper objectMapper1 = new ObjectMapper();
            objectMapper1.writeValue(resp.getWriter(),Map.of("code", "500",
                                                            "status", "error",
                                                            "message", "internal server error!"));
            throw new RuntimeException(e);
        }
    }
}
