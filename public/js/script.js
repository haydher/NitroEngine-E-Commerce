const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", () => {
 const searchField = document.querySelector("#searchBar").value;
 console.log("Value", searchField);
 location.href = `/item?search=${searchField}`;
});


const searchField = document.querySelector("#searchBar")
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

// selected item page

const imgContainer = document.querySelector(".itemMainImgContainer img");
const moreImgs = document.querySelectorAll(".moreImgs img");

moreImgs.forEach((img) => {
 img.addEventListener("click", () => (imgContainer.src = img.src));
});



//
// toggle active class in sizes
//
const sizeBtnToggle = document.querySelectorAll(".size");
sizeBtnToggle.forEach((eBtn) => {
 eBtn.addEventListener("click", () => {
  sizeBtnToggle.forEach((element) => element.classList.remove("sizeActive"));
  if(!eBtn.classList.contains("sizeDisabled")) eBtn.classList.toggle("sizeActive");
 });
});


// add to cart function 

let cartArr = []
const cartBtn = document.querySelector(".cartBtn")
const cartCount = document.querySelector(".cartCount")
const errMessage = document.querySelector(".error")
let checkCookie = document.cookie.split(';').some((item) => item.trim().startsWith('cart='))
// read  the cart cookie, 
let readCookie = document.cookie.split('; ').find(row => row.startsWith('cart=')).split('=')[1];

let count, innerCartCount = 0, size
const itemSize = document.querySelectorAll(".size")
// check if cookie with name `cart=` exists
if (checkCookie && readCookie.length > 0) {
 // read each value since its stored as a string, eg. `"123,123,123"` this makes it, `"123","123","123",`
 let eachCartItem = readCookie.split(',')
 // increase the cart count
 if(eachCartItem.length > 0) {
  cartCount.classList.add("cartCountActive")
  cartCount.children[0].innerHTML = eachCartItem.length
 }
 // take all the values and add them to array
 eachCartItem.forEach(element => {
  let elementId = element.split('+')
  // console.log(elementId[0])
  
  if(!cartArr.includes(element)) cartArr.push(element)

  // if item already exists in cart then disable item and size
  if(cartBtn.id == elementId[0]){
   itemSize.forEach(element => element.classList.add("sizeDisabled"));
   cartBtn.classList.add("btnDisabled")
   cartBtn.innerHTML = "Item Already In Cart"
  }
 });
}
if(readCookie.length < 1) {
 cartCount.classList.remove("cartCountActive")
 cartCount.children[0].innerHTML = ""
}
// add new cart item to cookie
cartBtn.addEventListener("click", ()=> {
 // get the size of the element
 itemSize.forEach(element => {
  if(element.classList.contains("sizeActive")) size = element.children[0].innerHTML
  });

  // if array doesnt contain the item already then add the selected item
 if(!cartArr.includes(`${cartBtn.id}+${size}`) && size != undefined){
  // increase the cart value
  cartCount.classList.add("cartCountActive")
  if(cartCount.children[0].innerHTML.length < 1) innerCartCount++
  else innerCartCount = parseInt(cartCount.children[0].innerHTML) + 1
  cartCount.children[0].innerHTML = innerCartCount

  // push the item to the array with size
  cartArr.push(`${cartBtn.id}+${size}`)
  // set the cookie with the item
  document.cookie = `cart=${cartArr}; path=/` 

  // disable the `add to cart` button after item has been added to cart
  cartBtn.classList.add("btnDisabled")
  cartBtn.innerHTML = "Item Added to Cart"
  // clear the error message asking user to select size
  errMessage.innerHTML = ""
  errMessage.classList.remove("errMessage")

  // disable the size button so user cant select size
  itemSize.forEach(element => {
   element.classList.remove("sizeActive")
   element.classList.add("sizeDisabled")
  });
   
 }
 else if(size == undefined && !cartBtn.classList.contains("btnDisabled")){
  errMessage.innerHTML = "Please a select size."
  errMessage.classList.add("errMessage")
 }
 else {
  errMessage.innerHTML = ""
  errMessage.classList.remove("errMessage")
  console.log("item already exists in cart")
 }
})


