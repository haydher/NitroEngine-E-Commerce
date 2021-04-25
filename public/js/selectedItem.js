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

let readCookie, count, innerCartCount = 0, size
const itemSize = document.querySelectorAll(".size")

// check if cookie with name `cart=` exists
if (checkCookie) {
 // read  the cart cookie, 
 readCookie = decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('cart=')).split('=')[1]);
 if(readCookie.length > 0) {
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
}

if(readCookie?.length < 1) {
 cartCount.classList.remove("cartCountActive")
 cartCount.children[0].innerHTML = ""
}

// add new cart item to cookie
cartBtn.addEventListener("click", ()=> {
 // get the size of the element
 itemSize.forEach(element => {
  if(element.classList.contains("sizeActive")) size = element.children[0].innerHTML
  });
 // true if user is logged in
 const url = "/cart"
 item = {
  itemId: cartBtn.id,
  itemSize: size
 }
 const options = {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(item) 
 }
 if(size != undefined) {
  fetch(url, options)
  .then(response => response.json())
  .then(data => updateCart(data));
 }else {
  errMessage.innerHTML = "Please a select size."
  errMessage.classList.add("errMessage")
 }
    
})

function updateCart(data){
  // increase the cart value
  cartCount.classList.add("cartCountActive")
  cartCount.children[0].innerHTML = data.cartCount

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
   
 if(size == undefined && !cartBtn.classList.contains("btnDisabled")){
  errMessage.innerHTML = "Please a select size."
  errMessage.classList.add("errMessage")
 }
 else {
  errMessage.innerHTML = ""
  errMessage.classList.remove("errMessage")
  console.log("item already exists in cart")
 }
}

/*

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
 
*/