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
    const map = new google.maps.Map(document.getElementById('map'), {
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

    var markerMexico = new google.maps.Marker({
        position: {lat: 20.5809134, lng: -87.1218867},
        map: map,
        title: 'Click'
    });

    var markerChicago = new google.maps.Marker({
        position: {lat: 41.8028818, lng: -87.5852623},
        map: map,
        title: 'Click'
    });

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

    addInfoWindow(map,contentMexico,markerMexico);
    addInfoWindow(map,contentChicago,markerChicago);
}

function addInfoWindow(map,contentForWindow,marker){
    var infowindow = new google.maps.InfoWindow({
        content: contentForWindow
    });

    marker.addListener('click',function(){
        infowindow.open(map, marker);
    });
}
