package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import org.apache.commons.dbcp2.BasicDataSource;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebServlet("/employee/*")
public class EmployeeServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/json");
        String path = req.getPathInfo();
        Connection connection = null;
        try {
            BasicDataSource basicDataSource = (BasicDataSource) req.getServletContext().getAttribute("dataSource");
            connection = basicDataSource.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        if(req.getParameter("newid")!=null){
            try {
                PreparedStatement pst = connection.prepareStatement("select * from employee order by id desc limit 1");
                ResultSet result = pst.executeQuery();
                String newId;
                if(result.next()){
                  String lastId = result.getString(1);
                  String noPart = lastId.substring(2);
                  int no = Integer.parseInt(noPart);
                  no++;
                  newId = String.format("E-%04d",no);

                }
                else{
                    newId = "E-0001";
                }
                resp.setStatus(HttpServletResponse.SC_OK);
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(resp.getWriter(), Map.of("code", "200",
                        "status", "ok",
                        "message", "success!",
                        "data", newId)
                );

            } catch (SQLException e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(resp.getWriter(), Map.of("code", "500",
                                                                "status", "error",
                                                                "message", "internal server error!"));
                throw new RuntimeException(e);
            }

        }
        else if(path!=null){
            String[] arr = path.split("/");
            String id = arr[1];

            try {
                PreparedStatement pst = connection.prepareStatement("select * from employee where id = ?");
                pst.setString(1,id);
                ResultSet result = pst.executeQuery();

                ObjectMapper objectMapper = new ObjectMapper();
                if(result.next()){

                    Map<String,String> em = Map.of(
                            "id",result.getString(1),
                            "name",result.getString(2),
                            "address",result.getString(3),
                            "phoneNo",result.getString(4),
                            "salary",String.valueOf(result.getDouble(5)),
                            "image",result.getString(6)
                    );

                    resp.setStatus(HttpServletResponse.SC_OK);
                    objectMapper.writeValue(resp.getWriter(), Map.of("code", "200",
                            "status", "ok",
                            "message", "success!",
                            "data", em)
                    );
                }
                else{
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    ObjectMapper objectMapper1 = new ObjectMapper();
                    objectMapper1.writeValue(resp.getWriter(),Map.of("code", "400",
                                                                    "status", "bad request",
                                                                    "message", "user not found!"));
                }

            } catch (SQLException e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(resp.getWriter(), Map.of("code", "500",
                                                                "status", "error",
                                                                "message", "internal server error!"));
                throw new RuntimeException(e);
            }
        }
        else {
            try {
                PreparedStatement pst = connection.prepareStatement("select * from employee");
                ResultSet result = pst.executeQuery();

                List<Map<String, String>> employees = new ArrayList<>();
                while (result.next()) {
                    Map<String, String> em = Map.of(
                            "id", result.getString(1),
                            "name", result.getString(2),
                            "address", result.getString(3),
                            "phoneNo", result.getString(4),
                            "salary", String.valueOf(result.getDouble(5))
                    );
                    employees.add(em);
                }

                resp.setStatus(HttpServletResponse.SC_OK);
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(resp.getWriter(), Map.of("code", "200",
                        "status", "ok",
                        "message", "success!",
                        "data", employees)
                );

            } catch (SQLException e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(resp.getWriter(), Map.of("code", "500",
                        "status", "error",
                        "message", "internal server error!"));
                throw new RuntimeException(e);
            }
        }
    }


    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String path = req.getPathInfo();
        String[] ar = path.split("/");
        String id = ar[1];

        resp.setContentType("application/json");
        ObjectMapper objectMapper1 = new ObjectMapper();

        try {
            BasicDataSource basicDataSource = (BasicDataSource) req.getServletContext().getAttribute("dataSource");
            Connection connection = basicDataSource.getConnection();
            PreparedStatement pst = connection.prepareStatement("delete from employee where id=?");
            pst.setString(1,id);
            int result = pst.executeUpdate();

            if(result>0){
                resp.setStatus(HttpServletResponse.SC_OK);
                objectMapper1.writeValue(resp.getWriter(),Map.of("code", "200",
                                                                "status", "ok",
                                                                "message", "success!"));
            }
            else{
                resp.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
                objectMapper1.writeValue(resp.getWriter(),Map.of("code", "417",
                                                                "status", "expectation failed",
                                                                "message", "failed to delete employee!"));
            }

        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            objectMapper1.writeValue(resp.getWriter(),Map.of("code", "500",
                                                            "status", "error",
                                                            "message", "internal server error!"));
            throw new RuntimeException(e);
        }
    }
}












