// Create an instance of the HTTP client
const http = new coreHTTP;

// Array to store the list items
let theList = [];

// Variable to store the ID of the item being updated
let idWUpdate = "";

// DOM elements
const result = document.querySelector(".result");
const input = document.querySelector("#listitem");
const inputForm = document.querySelector("#inputForm");
const addButton = document.querySelector(".add-btn");
const editButton = document.querySelector(".edit-btn");
const delButton = document.querySelector(".del-btn");

// NodeList containing all elements with the class "items"
let itemList = document.querySelectorAll(".items");

// Event listeners for the "Add" and "Delete" buttons
addButton.addEventListener("click", httpPost);
delButton.addEventListener("click", httpDelete);

// Function to add event listeners to each item in the list
function AddListeners() {
  // Loop through each item in the list
  for (const item of itemList) {
    // Add click event listener to the first child of the item (assumed to be a button)
    item.children[0].addEventListener("click", function () {
      // Call the function when the item is clicked
      itemClicked(item);
    }, false);

    // Add click event listener to the second child of the item (assumed to be another button)
    item.children[1].addEventListener("click", function (e) {
      // Prevent the default behavior of the click event (e.g., form submission)
      e.preventDefault();
      // Call the function to edit the text field when the button is clicked
      editTextField(item);
    }, false);
  }
}

// Function to display the list on the UI
function ShowList() {
  let output = "<ul class=\"toDoUL\">";
  // Loop through each item in theList
  for (const itm of theList) {
    // Determine the CSS class based on whether the item is completed
    let finished = "unfinished";
    if (itm.completed === true) {
      finished = "finished";
    }
    // Build the HTML for each list item
    output += `<li class="items"><button id="${itm._id}" class="listItem"><h5 class="${finished}">${itm.name}</h5></button><button class="edit" id=${itm._id}>Edit</button><input type="checkbox" id=${itm._id} class="listBox"></li>`;
  }
  output += "</ul>";
  // Set the innerHTML of the result element to the generated HTML
  result.innerHTML = output;

  // Update the itemList NodeList and add event listeners to each item
  itemList = document.querySelectorAll(".items");
  AddListeners();
}

// Function to retrieve the list from the server
async function GetList() {
  // Make a GET request to the server's API endpoint
  let tmp = await http.get("./api");
  // Update the global theList variable with the retrieved tasks
  theList = tmp.task;
  // Display the updated list on the UI
  ShowList();
  return;
}

// Function to update the list on the server
async function PutList(newItem) {
  // Make a PUT request to the server's API endpoint with the new item data
  await http.put("./api", newItem);
  // Retrieve the updated list from the server
  await GetList();
  return;
}

// Function to handle the "Add" button click event
async function httpPost(e) {
  // Get the new data from the input field
  const newData = input.value;

  // If the input is empty, do nothing
  if (newData === "") {
    return;
  }

  // If there's an item being updated, return without performing the add operation
  if (idWUpdate) return;

  // Construct a JSON object with the new item data
  let newJText = `{
    "name":"${newData}",
    "completed":false
  }`;

  // Parse the JSON text into a JavaScript object
  newJSON = JSON.parse(newJText);

  // Make a POST request to the server's API endpoint with the new item data
  await http.post("./api", newJSON);
  // Retrieve the updated list from the server
  GetList();
  // Prevent the default form submission behavior
  e.preventDefault();
}

// Function to handle the update operation
async function httpUpdate(e) {
  // Prevent the default form submission behavior
  e.preventDefault();
  // Get the new data from the input field
  const newData = input.value;

  // If the input is empty, do nothing
  if (newData === "") {
    return;
  }

  // If there's no item being updated, return without performing the update operation
  if (idWUpdate === "") return;

  // Construct a JSON object with the updated item data
  let newJText = `{
    "_id": "${idWUpdate}",
    "name":"${newData}",
    "completed":false
  }`;

  // Parse the JSON text into a JavaScript object
  newJSON = JSON.parse(newJText);

  // Make a PUT request to the server's API endpoint with the updated item data
  await http.put("./api", newJSON);
  // Retrieve the updated list from the server
  GetList();
  // Reload the page to reflect the changes
  window.location.reload();
}

// Function to handle the delete operation
async function httpDelete(e) {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Array to store the IDs of the items to be deleted
  const idList = [];
  
  // Loop through each item in the itemList
  for (let item of itemList) {
    // Check if the checkbox for the current item is checked
    if (item.children[2].checked) {
      // Add the ID of the checked item to the idList array
      idList.push(item.children[0].id);
    }
  }

  // If there are items selected for deletion, make a DELETE request to the server's API endpoint
  if (idList.length != 0) {
    await http.delete(`/api/${idList}`);
  }

  // Retrieve the updated list from the server
  await GetList();
}

// Function to handle the click event on a list item
function itemClicked(item) {
  let update;

  // Check the current class of the list item to determine if it is finished or unfinished
  if (item.children[0].children[0].className === "finished") {
    // If finished, construct a JSON object with completed set to false
    update = `{
      "_id":"${item.children[0].id}",
      "name":"${item.children[0].children[0].innerHTML}",
      "completed":false
    }`;
  } else {
    // If unfinished, construct a JSON object with completed set to true
    update = `{
      "_id":"${item.children[0].id}",
      "name":"${item.children[0].children[0].innerHTML}",
      "completed":true
    }`;
  }

  // Parse the JSON text into a JavaScript object
  update = JSON.parse(update);

  // Update the list on the server with the modified item
  PutList(update);
}

// Function to populate the input field with the text of the selected item and prepare for update
function editTextField(item) {
  // Check if the first child of the item has a child (assumed to be an <h5> element)
  if (item.children[0].children[0]) {
    // Retrieve the text content and ID of the selected item
    let text = item.children[0].children[0].textContent;
    let idUpdate = item.children[0].id;

    // If text and ID are available, set the global idWUpdate variable
    if (text && idUpdate) {
      idWUpdate = idUpdate;
      // Set the input field value to the selected item's text
      input.setAttribute('value', text);
      // Set the class and text content of the edit button in the form
      inputForm.children[1].className = "edit-btn";
      inputForm.children[1].children[0].textContent = "Update";

      // Add an event listener to the edit button for the update operation
      const updateButton =  document.querySelector(".edit-btn");
      updateButton.addEventListener("click", httpUpdate);
    }
  }
}

// Function to display a loading message while waiting for data
function showLoading() {
  result.innerHTML = "Loading";
}

// Main function to initialize the application
async function main() {
  // Disable the "Add" and "Delete" buttons
  addButton.disabled = true;
  delButton.disabled = true;
  // Display a loading message
  showLoading();

  // Retrieve the list from the server
  await GetList();

  // Enable the "Add" and "Delete" buttons
  addButton.disabled = false;
  delButton.disabled = false;
}

// Call the main function to start the application
main();
