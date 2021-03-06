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
import com.google.sps.data.Marker;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

/** Handles fetching and saving markers data. */
@WebServlet("/markers")
public class MarkerServlet extends HttpServlet {
    private static final Gson gson = new Gson();
    private static final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    private static final String ENTITY_TITLE = "Marker";
    private static final String ENTITY_PROPERTY_KEY_1 = "lat";
    private static final String ENTITY_PROPERTY_KEY_2 = "lng";
    private static final String ENTITY_PROPERTY_KEY_3 = "content";


    /** Responds with JSON array containing marker data. */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        List<Marker> markers = getMarkers();
        String json = gson.toJson(markers);
        response.setContentType("application/json");
        response.getWriter().println(json);
    }

    /** Accepts a POST request containing a new marker. */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
        double lat = Double.parseDouble(request.getParameter("lat"));
        double lng = Double.parseDouble(request.getParameter("lng"));

        /** Use to ensure that end-user provided HTML contains only elements and attributes that you 
            are expecting; no junk */
        String content = Jsoup.clean(request.getParameter("content"), Whitelist.none());
        Marker marker = new Marker(lat, lng, content);
        storeMarker(marker);
    }

    /** Fetches markers from Datastore. */
    private List<Marker> getMarkers(){
        List<Marker> markers = new ArrayList<>();
        Query query = new Query(ENTITY_TITLE);
        PreparedQuery results = datastore.prepare(query);

        for(Entity entity: results.asIterable()){
            double lat = (double) entity.getProperty("lat");
            double lng = (double) entity.getProperty("lng");
            String content = (String) entity.getProperty("content");

            Marker marker = new Marker(lat, lng, content);
            markers.add(marker);
        }
        return markers;
    }

    /** Stores a marker in Datastore. */
    public void storeMarker(Marker marker){
        Entity markerEntity = new Entity(ENTITY_TITLE);
        markerEntity.setProperty(ENTITY_PROPERTY_KEY_1, marker.getLat());
        markerEntity.setProperty(ENTITY_PROPERTY_KEY_2, marker.getLng());
        markerEntity.setProperty(ENTITY_PROPERTY_KEY_3, marker.getContent());

        datastore.put(markerEntity);
    }
}
