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
    fetch('/list-comments')
    .then(response => response.json())
    .then((comments) => {
        const history = document.getElementById('commentsList');
        
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
    liElement.className = 'text';

    const titleElement = document.createElement('span');
    titleElement.innerText = text.comment;

    liElement.appendChild(titleElement);
    return liElement;
}
