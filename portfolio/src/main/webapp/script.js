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
function createListComments(text){
    const liElement = document.createElement('li');
    liElement.innerText = text.comment;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click',() => {
        deleteComment(text);
        liElement.remove();
    });

    liElement.appendChild(deleteButton);
    return liElement;
}

function deleteComment(text){
    const params = new URLSearchParams();
    params.append('id',text.id);
    fetch('/delete-data', {method: 'POST', body: params});
}

/** Creates a map and adds it to the page. */
function createMap(){
    const map = new google.maps.Map(document.getElementById('map'), {center: {lat: 37.422, lng: -122.084}, zoom:16});
}
