const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", () => {
 const searchField = document.querySelector("#searchBar").value;
 location.href = `/item?search=${searchField}`;
});

const searchField = document.querySelector("#searchBar")
searchField.addEventListener("keyup", (e)=> {
 if (e.keyCode === 13) {
  location.href = `/item?search=${searchField.value}`;
  e.preventDefault();
 }
});

// const searchField = document.querySelector("#searchBar")
// searchField.addEventListener("keyup", () => {
//  const searchValue = searchField.value
//  console.log("Value", searchValue);
//  data = { searchValue}
//  const url = "/item/searchResult"

//  const options = {
//   method: 'POST', 
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(data) 
//  }
//  fetch(url, options)
//  .then(response => response.json())
//   .then(data => console.log(data));
   
// });


const dropDownToggle = document.querySelector(".account");
const accountDropDown = document.querySelector(".accountContainer");

// true means the drop down is not visible, or is not clicked yet
dropDownToggle?.addEventListener("click", () => {
 accountDropDown.classList.toggle("toggleDropDown");
});

// remove the dropdown menu if clicked out of it
window.addEventListener("mouseup", (e) => {
 if (e.target != accountDropDown) accountDropDown?.classList.add("toggleDropDown");
});

// item page
// filter items
const collapse = document.querySelectorAll(".filterHeader");
// collapse and show the filter menu
collapse.forEach((element) => {
 element.addEventListener("click", () => {
  // get the class of the menu thats clicked
  const contentType = `.${element.attributes[1].ownerElement.id}Content`;
  // select the class
  const selectContent = document.querySelector(contentType);
  // select the plus icon of that category
  const plusIcon = element.attributes[1].ownerElement.querySelector("img");
  // collapse the menu of open
  if (selectContent.style.maxHeight) {
   //change icon
   plusIcon.src = "imgs/icons/plucIcon.svg";
   // set height to 0
   selectContent.style.maxHeight = null;
  }
  // show menu if collapsed
  else {
   plusIcon.src = "imgs/icons/minusIcon.svg";
   selectContent.style.maxHeight = selectContent.scrollHeight + "px";
  }
 });
});

