// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.common.collect.ImmutableList; 
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private static final String ENTITY_TITLE = "Comment";
  private static final String ENTITY_PROPERTY_KEY = "comment";
  private static final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  private static final Gson gson = new Gson();

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query(ENTITY_TITLE);
    PreparedQuery results = datastore.prepare(query);
    
    int userChoice = getUserChoice(request);

    final List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
        if(comments.size() >= userChoice){ 
            break; 
        }

        String comment = (String) entity.getProperty(ENTITY_PROPERTY_KEY);
        long id = entity.getKey().getId();
        Comment text = new Comment(id,comment);
        comments.add(text);     
    }

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }    

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
      // Get input from the form.
      String comment = request.getParameter("text-input");
      
      // Store comments as entities in Datastore
      Entity commentEntity = new Entity(ENTITY_TITLE);
      commentEntity.setProperty(ENTITY_PROPERTY_KEY, comment);
      datastore.put(commentEntity);
      response.sendRedirect("/index.html");
  }

  private int getUserChoice(HttpServletRequest request){
      String userChoiceString = request.getParameter("user-number-choice");
      int userChoice;

      try{
          userChoice = Integer.parseInt(userChoiceString);
      }
      catch(NumberFormatException e){
          System.err.println("Could not convert to int: " + userChoiceString);
          return -1;
      }

      if(userChoice < 1 || userChoice > 4){
          System.err.println("User choice is out of range: " + userChoiceString);
          return -1;
      }

      return userChoice;
  }
}
