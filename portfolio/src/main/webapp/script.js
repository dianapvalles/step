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

let map;
/** Editable marker that displays when a user clicks in the map */
let editMarker;

/**
 * Adds a random facts to the page.
 */
function addRandomFacts() {
  const facts =
      ['\'Wait for it...legendary\'', '\'Talent wins games, but teamwork and intelligence wins championships\'', 
      'Fact: I love sports, I practiced Taekwondo for 10 years', '\'Suit up\'', 'Fact: I have 3 dogs'];

  // Pick a random greeting.
  const random = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  document.getElementById('random-fact-container').innerText = random;
}

/** Request content from server and add it to page */
function getServerMessage() {
    let userNum = document.getElementById('comments-number');
    fetch('/data?user-number-choice=' + userNum.value)
    .then(response => response.json())
    .then((comments) => {
        const history = document.getElementById('commentsList');
        history.innerHTML = "";
        // Build the list of history entries.
        comments.forEach((line) => {
        history.appendChild(createListComments(line));
        });
    })
    .catch((error) => {
        console.error(error);
    }); 
}

/** Creates an <li> element containing text. */
function createListComments(commentJson){
    const liElement = document.createElement('li');
    liElement.innerText = commentJson.comment;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click',() => {
        deleteComment(commentJson);
        liElement.remove();
    });

    liElement.appendChild(deleteButton);
    return liElement;
}

function deleteComment(commentJson){
    const params = new URLSearchParams();
    params.append('id',commentJson.id);
    fetch('/delete-data', {method: 'POST', body: params});
}

/** Creates a map and adds it to the page. */
function createMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.422, lng: -122.084 }, 
        zoom:10,
        // Enables dark mode view
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        });

    map.setTilt(45);

    var contentMexico = '<div id="info-window">'+
        '<h1>Xcaret Mexico</h1>'+
        '<p><b>Xcaret</b> is one of greatest nature parks. '+
        'Here you can find underground rivers, the caribbean '+
        'and Mexico\'s culture.</p>'+
        '<a href="https://www.xcaret.com/en/?langRedirect=1">Attribution: Xcaret by Mexico</a>'+
        '</div>';

    var contentChicago = '<div id="info-window">'+
        '<h1>Museum of Science and Industry</h1>'+
        '<p><b>Museum of Science and Industry in Chicago</b>, one of the largest '+
        'museums in the world. It inspires people to pursue science careers and it'+
        'is the home of more than 35,000 artifacts.</p>'+
        '<a href="https://www.msichicago.org/">Attribution: Museum of Science and Industry</a>'+
        '</div>';

    var markerMexico = createMarkerForDisplay(20.5809134,-87.1218867,contentMexico);
    var markerChicago = createMarkerForDisplay( 41.8028818,-87.5852623, contentChicago);

    /** When the user clicks in the map, show a marker with a text box the user can edit. */
    map.addListener('click',(event) => {
        createMarkerForEdit(event.latLng.lat(), event.latLng.lng());
    });

    fetchMarkers();
}

/** Fetches markers from the backend and adds them to the map. */
function fetchMarkers(){
    fetch('/markers').then(response => response.json()).then((markers) =>{
        markers.forEach((marker) => {
            createMarkerForDisplay(marker.lat, marker.lng, marker.content);
        });
    });
}

/** Creates a marker that shows a read-only info window when clicked. */
function createMarkerForDisplay(lat, lng, content) {
  const marker = 
    new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

  var infowindow = new google.maps.InfoWindow({
        content: content
  });

  marker.addListener('click',() => {
        infowindow.open(map, marker);
  });
}

/** Sends a marker to the backend for saving. */
function postMarker(lat, lng, content) {
  const params = new URLSearchParams();
  params.append('lat', lat);
  params.append('lng', lng);
  params.append('content', content);

  fetch('/markers', {method: 'POST', body: params});
}

/** Creates a marker that shows a textbox the user can edit. */
function createMarkerForEdit(lat, lng) {
  // If we're already showing an editable marker, then remove it.
  if (editMarker) {
    editMarker.setMap(null);
  }
  
  editMarker =
      new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

  let infoWindow = new google.maps.InfoWindow({content:buildInfoWindowInput(lat, lng)});

  // When the user closes the editable info window, remove the marker.
  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    editMarker.setMap(null);
  });

  infoWindow.open(map, editMarker);
}

/**
 * Builds and returns HTML elements that show an editable textbox and a submit
 * button.
 */
function buildInfoWindowInput(lat, lng) {
  const textBox = document.createElement('textarea');
  const button = document.createElement('button');
  button.appendChild(document.createTextNode('Submit'));

  button.onclick = () => {
    postMarker(lat, lng, textBox.value);
    createMarkerForDisplay(lat, lng, textBox.value);
    editMarker.setMap(null);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(document.createElement('br'));
  containerDiv.appendChild(button);

  return containerDiv;
}
