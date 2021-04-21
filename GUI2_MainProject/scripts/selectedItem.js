catalogJson = JSON.parse(catalog);
// read the query from the url
const params = new URLSearchParams(window.location.search);
let bolItemFound = true;

fillData(params, catalogJson);

// fill the item with data from params
function fillData(params, catalogJson) {
 let queryExtractedID;

 // get image info from query
 for (const [key, value] of params) {
  if (key == "id") queryExtractedID = value;
 }
 //get item ID  //pants00011 and change it to //pants
 const idType = queryExtractedID
  .match(/[a-zA-Z]+/g)
  .toString()
  .toLowerCase();

 // skip a loop and assign the index value
 const imgIndex = findImgIndex(idType);

 // *simplified*  catalogJson.itemData[0].shoes.length
 for (let i = 0; i < catalogJson.itemData[imgIndex][idType].length; i++) {
  //
  const catalogData = catalogJson.itemData[imgIndex][idType][i];

  // get the id of the item
  id = catalogJson.itemData[imgIndex][idType][i].id;

  // loop thru the selected id type only if there is a match
  if (id == queryExtractedID) {
   makeItem(catalogData);
   // break once id is found to save resources
   break;
  }
 }
 // if page is not found then show not found
 if (bolItemFound) {
  console.log("page not found");
  let pageNotFound = document.querySelector(".pageNotFound");
  let mainContainer = document.querySelector(".itemContainer");
  pageNotFound.classList.remove("notFound");
  mainContainer.classList.add("notFound");
 }
}

// get the index of the image type rather than looping over the json
function findImgIndex(idType) {
 switch (idType) {
  case "shoes":
   return 0;
  case "shirts":
   return 1;
  case "pants":
   return 2;
  case "jeans":
   return 3;
  case "hoodie":
   return 4;
  case "jacket":
   return 5;
  default:
   break;
 }
}

// make the item when page loads
function makeItem(catalogData) {
 const mainImg = document.querySelector(".itemMainImgContainer img");
 const itemName = document.querySelector(".itemDetail .header");
 const itemType = document.querySelector(".itemDetail .itemType");
 const moreImgs = document.querySelector(".moreImgs");
 const description = document.querySelector(".itemDetail .description");
 const sizeContainer = document.querySelector(".itemDetail .sizeContainer");

 const priceContainer = document.querySelector(".priceContainer");
 const newPPrice = document.createElement("h3");

 // add *add to cart*  function later
 const button = document.querySelector(".priceContainer button");

 mainImg.src = catalogData.image[0];
 itemName.innerHTML = catalogData.model;
 itemType.innerHTML = catalogData.type;

 // fill up the extra images
 for (let i = 0; i < catalogData.image.length; i++) {
  const newImg = document.createElement("img");
  newImg.src = catalogData.image[i];
  moreImgs.append(newImg);
  // change the src of the main image when clicked on smaller one
  newImg.addEventListener("click", () => {
   mainImg.src = newImg.src;
  });
 }

 // add the description
 description.innerHTML = catalogData.description;

 // add all the size options
 for (let i = 0; i < catalogData.size.length; i++) {
  const newDivSize = document.createElement("div");
  const newSizeSpan = document.createElement("span");
  newDivSize.classList.add("size");
  newSizeSpan.innerHTML = catalogData.size[i];
  newDivSize.append(newSizeSpan);
  sizeContainer.append(newDivSize);
 }

 // add the price
 newPPrice.innerHTML = `$${catalogData.price}`;
 priceContainer.append(newPPrice);

 bolItemFound = false;
}

//
// toggle active class in sizes
//
const sizeBtnToggle = document.querySelectorAll(".size");
sizeBtnToggle.forEach((eBtn) => {
 eBtn.addEventListener("click", () => {
  sizeBtnToggle.forEach((element) => element.classList.remove("sizeActive"));
  eBtn.classList.toggle("sizeActive");
 });
});

dynamicNewArrival(7);
function dynamicNewArrival(max) {
 //
 let set = new Set();
 // loop how many cards are wanted in the first page
 for (let i = 0; i < max; i++) {
  let prevRand;
  const container = document.querySelector(".arrivalContainer");
  // gets a random index value (1,2,3...)
  let rand = getRandArr(catalogJson.itemData);
  // get the type of the chosen item eg (type: shoes)
  let type = catalogJson.itemData[rand].type;
  // get random type eg , ( shoes : [] )
  let randIndex = getRandArr(catalogJson.itemData[rand][type]);

  set.add(randIndex);

  // check for duplicates, doesnt work yet
  let breakPoint = 0;
  while (set.has(randIndex) && set.size - 1 < i) {
   if (breakPoint > 5) break;
   randIndex = getRandArr(catalogJson.itemData[rand][type]);
   set.add(randIndex);
   breakPoint++;
  }
  // get random index of chosen type eg ( shoes : [0,1,2...] )
  let randItem = catalogJson.itemData[rand][type][randIndex];

  // make all the card elements
  const newCard = document.createElement("div");
  const newCardImgCont = document.createElement("div");
  const newImg = document.createElement("img");
  const newCardInfo = document.createElement("div");
  const newName = document.createElement("p");
  const newBtn = document.createElement("button");

  // give appropriate classes
  newCard.classList.add("card");
  newCardImgCont.classList.add("cardImgContainer");
  newCardInfo.classList.add("cardInfo");
  newCard.classList.add("card");
  newBtn.classList = "btn btn2";

  // assign values
  newImg.src = randItem.image[0];
  newName.innerHTML = randItem.model;
  newBtn.innerHTML = "SHOP";

  // assign id's to click on img
  newBtn.id = randItem.id;
  newImg.id = randItem.id;
  newCardInfo.id = randItem.id;

  // make item clickable
  [newBtn, newImg, newCardInfo].forEach((e) => {
   e.addEventListener("click", () => {
    location.href = `selectedItem.html?id=${newBtn.id}`;
    // window.open(`selectedItem.html?id=${newBtn.id}`);
   });
  });

  // append items to the card
  newCardInfo.append(newName);
  newCardImgCont.append(newImg);
  newCardImgCont.append(newCardInfo);
  // newCardInfo.append(newBtn);

  newCard.append(newCardImgCont);
  // newCard.append(newCardInfo);

  container.append(newCard);
 }
}

// get random value for the array
function getRandArr(arr) {
 return Math.floor(Math.random() * arr.length);
}
// get random number between range
function getRandNum(min, max) {
 return Math.floor(Math.random() * (max - min + 1) + min);
}

/*



fillData(params, catalogJson);
function fillData(params, catalogJson) {
 let getImage = document.querySelector("img");
 let getPrice = document.querySelector("span");
 let getDescription = document.querySelector("p");
 let getIDP = document.querySelector(".id span");

 let imageID;

 // get image info from query
 for (const [key, value] of params) {
  if (key == "id") imageID = value;
 }

 //get item ID  //pants00011
 const idType = imageID
  .match(/[a-zA-Z]+/g)
  .toString()
  .toLowerCase();

 //pants
 const idNumber = imageID.match(/\d+/g);
 //0001
 console.log(idType, idNumber);

 // go thru the
 // for (let i = 0; i < newItemsList.itemData.length; i++) {
 //  itemType = newItemsList.itemData[i].type;

 //  if (itemType == idType) {
 //   console.log(itemType);

 //   for (let j = 0; j < newItemsList.itemData[i][itemType].length; j++) {
 //    console.log(newItemsList.itemData[i][itemType].length);

 //    id = newItemsList.itemData[i][itemType][j].id;
 //    console.log("id: ", id);
 //    console.log("idNumber: ", idNumber);
 //    console.log("imageID ", imageID);
 //    if (id == imageID) {
 //     console.log("match ", id, idNumber);
 //     image = newItemsList.itemData[i][itemType][j].image[1];
 //     price = newItemsList.itemData[i][itemType][j].price;
 //     description = newItemsList.itemData[i][itemType][j].description;

 //     console.log(id, image, price, description);

 //     makeItemBox(id, image, price, description);
 //    }
 //   }
 //  }
 // }

 // skip a loop and assign the index value
 let i = 0;
 switch (idType) {
  case "shoes":
   i = 0;
   break;
  case "shirts":
   i = 1;
   break;
  case "pants":
   i = 2;
   break;
  case "jeans":
   i = 3;
   break;
  case "hoodie":
   i = 4;
   break;
  case "jacket":
   i = 5;
   break;
  default:
   break;
 }

 for (let j = 0; j < catalogJson.itemData[i][idType].length; j++) {
  console.log(catalogJson.itemData[i][idType].length);

  id = catalogJson.itemData[i][idType][j].id;

  console.log("id: ", id);
  console.log("idNumber: ", idNumber);
  console.log("imageID ", imageID);

  if (id == imageID) {
   console.log("match ", id, idNumber);
   image = catalogJson.itemData[i][idType][j].image;
   price = catalogJson.itemData[i][idType][j].price;
   description = catalogJson.itemData[i][idType][j].description;

   console.log(id, image, price, description);

   makeItemBox(id, image, price, description);
   break;
  }
 }



*/
