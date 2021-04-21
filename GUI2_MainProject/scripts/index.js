const newItemsList = JSON.parse(mainPageItems);
let catalogJson = JSON.parse(catalog);

// change the hero upon each reload
dynamicHero();
function dynamicHero() {
 // get the hero elements
 const hero = document.querySelector(".heroContainer");
 const heroHeader = hero.querySelector(".heroInfo h1");
 const heroDescription = hero.querySelector(".heroInfo h3");
 const heroBtn = hero.querySelector(".heroInfo button");
 const heroItemImg = hero.querySelector(".heroItemImg img");

 // get the hero object from the json file
 const data = newItemsList.mainPageData[0].hero;
 // get a random index value from the json obj to replace the hero content
 let random = getRandArr(data);

 // change the css background img
 const bg = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url("${data[random].heroCover}")`;

 // change the hero info
 hero.style.backgroundImage = bg;
 heroHeader.innerHTML = data[random].header;
 heroDescription.innerHTML = data[random].description;
 heroBtn.id = data[random].id;
 heroItemImg.src = data[random].heroCoverImg;

 heroBtn.addEventListener("click", () => {
  location.href = `selectedItem.html?id=${heroBtn.id}`;
 });
}

dynamicNewArrival(5);
function dynamicNewArrival(max) {
 //
 let set = new Set();
 //
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
  const newCardCont = document.createElement("div");
  const newImg = document.createElement("img");
  const newCardInfo = document.createElement("div");
  const newName = document.createElement("p");
  const newBtn = document.createElement("button");

  // give appropriate classes
  newCard.classList.add("card");
  newCardCont.classList.add("cardImgContainer");
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
  newName.id = randItem.id;

  // make item clickable
  [newBtn, newImg, newName].forEach((e) => {
   e.addEventListener("click", () => {
    location.href = `selectedItem.html?id=${newBtn.id}`;
    // window.open(`selectedItem.html?id=${newBtn.id}`);
   });
  });

  // append items to the card
  newCardCont.append(newImg);
  newCardInfo.append(newName);
  newCardInfo.append(newBtn);

  newCard.append(newCardCont);
  newCard.append(newCardInfo);

  container.append(newCard);
 }
}

// changes the collection options
dynamicCollection();
function dynamicCollection() {
 // get the collection object from json
 const data = newItemsList.mainPageData[1];
 // select the container that holds the collections
 const collectionContainer = document.querySelector(".collectionsContainer");
 let previousRand;

 let newSet = new Set();
 // loop twice to add 2 content, the loop can be changed based on the screen size
 for (i = 0; i < 2; i++) {
  // get a random number to show rand item from the json file
  // this can be changed later to show user choice
  let rand = getRandArr(data.collections);

  newSet.add(rand);
  // check for duplicates, doesnt work yet
  while (newSet.has(rand) && newSet.size - 1 < i) {
   rand = getRandArr(data.collections);
   newSet.add(rand);
  }

  // make new elements to  hold the content
  const newDivContainer = document.createElement("div");
  const newDivInfo = document.createElement("div");
  const newH1 = document.createElement("h1");
  const newBtn = document.createElement("button");

  // add appropriate classes
  newDivContainer.classList.add("collection");
  newDivInfo.classList.add("collectionInfo");
  newBtn.classList = "btn btn2";
  newBtn.innerHTML = "SHOP";

  // set the background image foor the container
  let bg = `linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 100%),url(${data.collections[rand].image})`;
  newDivContainer.style.backgroundImage = bg;
  // add the title
  newH1.innerHTML = data.collections[rand].title;

  // append everything
  newDivInfo.append(newH1);
  newDivInfo.append(newBtn);
  newDivContainer.append(newDivInfo);
  collectionContainer.append(newDivContainer);
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
