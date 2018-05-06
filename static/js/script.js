'use strict';
// Your client side JavaScript code goes here.
// This file is included in every page.

// Example code for creating a list on the server
var num_lists = 0;

function createList(name, pos, cards) {
  return $.ajax('/api/lists', {
    type: 'POST',
    data: {
      name: name,
      pos: pos,
      cards: cards
    }
  });
}

function updateList(id, name, pos, cards) {
  return $.ajax('/api/lists/' + id, {
    type: 'POST',
    data: {
      name: name,
      pos: pos,
      cards: cards
    }
  });
}

// Example code for getting all `list`s from server
function loadLists() {
  return $.ajax('/api/lists');
}

// Example code for displaying lists in the browser
function displayLists(lists) {
  // Lists should be ordered based on their 'pos' field
  lists.rows = _.sortBy(lists.rows, 'pos');
  lists.rows.forEach(function(list) {
    var newID = list.id * 10 + list.pos;
    var curElem = $('<div>', {
      "class": "list"
    }).attr('id', newID);
    curElem.append('<input type="text" class="card-title" placeholder="Enter title here" value = ' + list.name + '>')
    if (list.cards) {
      var innerUl = $('<div>', {
        "class": "inner-list"
      });
      list.cards.forEach(function(card) {
        innerUl.append('<input type="text" class="card" placeholder= "Enter text" value= "' + card + '">');
        innerUl.append($('<div>', {
          "class": "card-spacing"
        }));
      });
      // var input_box = $('<input', {"class": "add-card"}).attr("placeholder", "Add a card").val("").focus().blur();

      innerUl.append('<input class="add-card" placeholder="New card text">');

      curElem.append(innerUl);
      curElem.append('<input type="button" class="add-button" value="Update list" OnClick="kk(' + newID + ')"/>');
    }
    $('#lists').append(curElem);
  });
}

function kk(id) {
  var currentList = document.getElementById(id);
  var listPos = id % 10;
  var listID = id / 10;
  var listName = currentList.querySelectorAll("input.card-title")[0].value;
  var listCards = [];
  // for (var x in currentList.find("div.inner-list")) {
  //   console.log(x);
  // }

  // console.log(currentList.querySelectorAll("input.card")[2].value);
  for (var x = 0; x < currentList.querySelectorAll("input.card").length; x++) {
  listCards.push(currentList.querySelectorAll("input.card")[x].value);
}
var additionalText = currentList.querySelectorAll("input.add-card")[0].value;
if (additionalText.trim() != "") {
  listCards.push(additionalText);
}

updateList(listID, listName, listPos, listCards);
var myNode = document.getElementById("lists");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}
loadLists().then(function(data) {
  if (data.rows.length) {
    // If some lists are found display them
    displayLists(data);
  }
});
}

function addNewList() {
  createList("CHANGE_ME", num_lists, [""]);
  num_lists += 1;
  var myNode = document.getElementById("lists");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
  loadLists().then(function(data) {
    if (data.rows.length) {
      // If some lists are found display them
      displayLists(data);
    }
  });
}

loadLists()
  .then(function(data) {
    console.log('Lists', data.rows);
    if (data.rows.length) {
      // If some lists are found display them
      displayLists(data);
    } else {
      // If no lists are found, create sample list
      // and re-display.
      console.log('No lists found, creating one.');
      createList('Hello', num_lists, ['asdfasd', 'adsfasdfa'])
        .then(function(list) {
          console.log('Created list', list);
          num_lists += 1;
          return loadLists();
        })
        .then(function(lists) {
          displayLists(lists);
        })
    }

  });

// var myNodelist = document.getElementsByTagName("LI");
// var i;
// for (i = 0; i < myNodelist.length; i++) {
//   var span = document.createElement("SPAN");
//   var txt = document.createTextNode("\u00D7");
//   span.className = "close";
//   span.appendChild(txt);
//   myNodelist[i].appendChild(span);
// }
//
// // Click on a close button to hide the current list item
// var close = document.getElementsByClassName("close");
// var i;
// for (i = 0; i < close.length; i++) {
//   close[i].onclick = function() {
//     var div = this.parentElement;
//     div.style.display = "none";
//   }
// }
//
// // Add a "checked" symbol when clicking on a list item
// var list = document.querySelector('ul');
// list.addEventListener('click', function(ev) {
//   if (ev.target.tagName === 'LI') {
//     ev.target.classList.toggle('checked');
//   }
// }, false);
//
// // Create a new list item when clicking on the "Add" button
// function newElement() {
//   var li = document.createElement("li");
//   var inputValue = document.getElementById("myInput").value;
//   var t = document.createTextNode(inputValue);
//   li.appendChild(t);
//   if (inputValue === '') {
//     alert("You must write something!");
//   } else {
//     document.getElementById("myUL").appendChild(li);
//   }
//   document.getElementById("myInput").value = "";
//
//   var span = document.createElement("SPAN");
//   var txt = document.createTextNode("\u00D7");
//   span.className = "close";
//   span.appendChild(txt);
//   li.appendChild(span);
//
//   for (i = 0; i < close.length; i++) {
//     close[i].onclick = function() {
//       var div = this.parentElement;
//       div.style.display = "none";
//     }
//   }
// }
