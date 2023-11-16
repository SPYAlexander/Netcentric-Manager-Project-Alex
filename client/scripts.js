const http = new coreHTTP;

// Block Variables
let theList = [];
let idWUpdate = "";
// setup selectors
const result = document.querySelector(".result");
const input =  document.querySelector("#listitem");
const inputForm =  document.querySelector("#inputForm");
const addButton =  document.querySelector(".add-btn");
const editButton =  document.querySelector(".edit-btn");
const delButton =  document.querySelector(".del-btn");
let itemList = document.querySelectorAll(".items");



// Listeners
addButton.addEventListener("click", httpPost);
delButton.addEventListener("click", httpDelete);

function AddListeners(){
  for (const item of itemList) {
    item.children[0].addEventListener("click", function() // this function pushes through the html document in question when the item is clicked to a function to handle things
      {
        itemClicked(item);
    }, false);
    // button click edit
    item.children[1].addEventListener("click", function(e)
    {
      e.preventDefault();
        editTextField(item);
      }, false);
  }
}

/* Helper Functions */
function ShowList() {
  let output = "<ul class=\"toDoUL\">";
  for (const itm of theList) {
    let finished = "unfinished";
    if(itm.completed === true){
      finished = "finished";
    }
    output += `<li class="items"><button id="${itm._id}" class="listItem"><h5 class="${finished}">${itm.name}</h5></button><button class="edit" id=${itm._id}>Edit</button><input type="checkbox" id=${itm._id} class="listBox"></li>`;
  }
  output += "</ul>";
  result.innerHTML = output;


  itemList = document.querySelectorAll(".items"); // trying to point to correct items once the list updates
  AddListeners();
}

async function GetList() {
  let tmp = await http.get("./api");
  theList = tmp.task;
  ShowList();
  return;
}

async function PutList(newItem){
  await http.put("./api", newItem); // calls the put request with the new updated info
  await GetList(); // calls the get function to then get the updated list so that we can then display the updated info
  return;  
}

/* Listener Functions */
async function httpPost(e) {
  const newData = input.value; // collects new user input from input

  if (newData === ""){ // checks to see if new user input is blank, returning (cancelling the post) if it is
    return;
  }

  if (idWUpdate) return;

  let newJText = `{
    "name":"${newData}",
    "completed":false
  }`;

  newJSON = JSON.parse(newJText);

  await http.post("./api", newJSON); // posts the new task to be created
  GetList(); // gets the new list and displays it
  e.preventDefault();  // basic prevent default code snipit
}

async function httpUpdate(e) {
  e.preventDefault();  // basic prevent default code snipit
  const newData = input.value; // collects new user input from input

  if (newData === ""){ // checks to see if new user input is blank, returning (cancelling the post) if it is
    return;
  }

  if (idWUpdate === "") return;

  let newJText = `{
    "_id": "${idWUpdate}",
    "name":"${newData}",
    "completed":false
  }`;

  newJSON = JSON.parse(newJText);
  await http.put("./api", newJSON); // posts the new task to be created
  GetList(); // gets the new list and displays it
  window.location.reload();
}

async function httpDelete(e){
  e.preventDefault();
  const idList = [];
  for (let item of itemList) { // goes through all items to see what's checked
    if(item.children[2].checked){
      idList.push(item.children[0].id) // adds the id of what's checked to the idList array
    }
  }

  if(idList.length != 0){ // makes sure that the array isn't empty to avoid unnecessary calls
    await http.delete(`/api/${idList}`); // sends a delete request with the idList as a parameter in the URL for the application to handle
  }
  await GetList(); // gets the newly updated list for refresh of page
}

function itemClicked(item){ // gets the html of the button clicked, and toggles a strikethrough on the text through usage of a class that acts like a boolean
  let update;
  if(item.children[0].children[0].className === "finished"){ // handles if the box is marked complete already
    update = `{
      "_id":"${item.children[0].id}",
      "name":"${item.children[0].children[0].innerHTML}",
      "completed":false
    }`;
  }
  else{ // handles adding the strikethrough to a recently completed event
    update = `{
      "_id":"${item.children[0].id}",
      "name":"${item.children[0].children[0].innerHTML}",
      "completed":true
    }`;
  }
  update = JSON.parse(update);
  PutList(update);
}

function editTextField(item) {

  if (item.children[0].children[0]) {
    let text = item.children[0].children[0].textContent;
    let idUpdate = item.children[0].id;

    if (text && idUpdate) {
      idWUpdate = idUpdate;
      input.setAttribute('value', text);
      inputForm.children[1].className = "edit-btn";
      inputForm.children[1].children[0].textContent = "Update";

      const updateButton =  document.querySelector(".edit-btn");
      updateButton.addEventListener("click", httpUpdate);
    }
  }
}

// Loading functions
function showLoading() {
  result.innerHTML = "Loading...";
}

async function main() {
  addButton.disabled = true;
  delButton.disabled = true;
  showLoading();

  await GetList();

  addButton.disabled = false;
  delButton.disabled = false;
}

main();