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

// get the catalog
let catalogJson = JSON.parse(catalog);
// catalogJson = JSON.parse(catalog);

// call the function when the page loads
cards(catalogJson.itemData[0].shoes);
cards(catalogJson.itemData[1].shirts);

// fill up the cards with data
function cards(data) {
 // get the container that holds the cards
 const container = document.querySelector(".itemCardContainer");

 // loop thru the items to show the list
 for (let i = 0; i < data.length; i++) {
  // make all the elements that fills up the cards
  let newDiv = document.createElement("div");
  const newImgCont = document.createElement("div");
  const newImg = document.createElement("img");
  const newPName = document.createElement("p");
  const newPDesc = document.createElement("p");
  const newPPrice = document.createElement("p");
  const newBtn = document.createElement("button");

  // give appropriate classes
  newDiv.classList.add("itemCard");
  newImgCont.classList.add("itemCardImgContainer");
  newPName.classList.add("itemHeading");
  newPDesc.classList.add("itemDescription");
  newPPrice.classList.add("itemPrice");
  newBtn.classList = "btn btn2";

  // give id so when clicked it opens it new tab
  newImg.id = data[i].id;
  newPName.id = data[i].id;
  newBtn.id = data[i].id;
  // fill the data
  newImg.src = data[i].image[0];
  newPName.innerHTML = data[i].model;
  newPDesc.innerHTML = data[i].type;
  newPPrice.innerHTML = `$ ${data[i].price}`;
  newBtn.innerHTML = "View Item";

  [newBtn, newImg, newPName].forEach((e) => {
   e.addEventListener("click", () => {
    location.href = `selectedItem.html?id=${newBtn.id}`;
    // window.open(`selectedItem.html?id=${newBtn.id}`);
   });
  });

  // append everything in the card
  newImgCont.append(newImg);
  newDiv.append(newImgCont);
  newDiv.append(newPName);
  newDiv.append(newPDesc);
  newDiv.append(newPPrice);
  newDiv.append(newBtn);

  // append the card in the html
  container.append(newDiv);
 }
}

dynamicNewArrival(7);
function dynamicNewArrival(max) {
 //
 let set = new Set();
 // loop how many cards are wanted in the first page
 for (let i = 0; i < max; i++) {
  const container = document.querySelector(".arrivalContainer");
  // gets a random index value (1,2,3...)
  let rand = getRandArr(catalogJson.itemData);
  // get the type of the chosen item eg (type: shoes)
  let type = catalogJson.itemData[rand].type;
  // get random type eg , ( shoes : [] )
  let randIndex = getRandArr(catalogJson.itemData[rand][type]);

  set.add(randIndex);

  //  check for duplicates, doesnt work yet
  // break so it doesnt get stuck in infinite loop
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
