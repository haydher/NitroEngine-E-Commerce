const update = document.querySelectorAll(".update")

update.forEach(btn => {
 const idItems = document.getElementsByClassName(btn.id)
 btn.addEventListener("click", (e)=>{
 
  updateItem(btn.id, idItems)

  console.log("clicked to update")
  console.log("btn.id", btn.id)
  e.preventDefault()
 })
});

function updateItem(id, params) {
 let price, name, description, type, brand, category, gender, tags, sizes

 for(let i = 0; i < params.length; i++){
  if(params[i].name == "price") price = params[i].value
  if(params[i].name == "name") name = params[i].value
  if(params[i].name == "description") description = params[i].value
  if(params[i].name == "type") type = params[i].value
  if(params[i].name == "brand") brand = params[i].value
  if(params[i].name == "category") category = params[i].value
  if(params[i].name == "gender") gender = params[i].value
  if(params[i].name == "tags") tags = params[i].value
  if(params[i].name == "sizes") sizes = params[i].value
 }

 const url = "/update/item/update"
 item = {
  itemId: id,
  name,
  price,
  description,
  type,
  brand,
  category,
  gender,
  tags,
  sizes,
 }
 const options = {
  method: 'PUT', 
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(item) 
 }
 fetch(url, options)
 .then(response => response.status)
 .then(data => resultMessage(id, data, "updateItem"));
}

const dltItem = document.querySelectorAll(".btnWarning")
dltItem.forEach(btn => {
 btn.addEventListener("click", (e)=>{
  const parent = document.getElementById(btn.id)
  // parent.style.display = "none"
  
  const url = "/update/item/delete"
  const item = {
   itemId: btn.id,
  }
  const options = {
   method: 'PUT', 
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(item) 
  }
  fetch(url, options)
  .then(response => response.status)
  .then(data => console.log(data));
  // .then(data => resultMessage(itemId, data, "img"));

  e.preventDefault()
 })
});

const dltImg = document.querySelectorAll(".overLay img")
dltImg.forEach(btn => {
 btn.addEventListener("click", (e)=>{

  let btnId = btn.id.split("/")
  let imgId = btnId[0] 
  let itemId = btnId[1] 

  const url = "/update/image/delete"
  const item = {
   itemId,
   imgId, 
  }
  const options = {
   method: 'PUT', 
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(item) 
  }
  fetch(url, options)
  .then(response => response.status)
  .then(data => resultMessage(itemId, data, "img"));
  e.preventDefault()
 })
});

function resultMessage(id, status, type){
 const parent = document.getElementById(id)
 const message = parent.querySelector(".message p")
 if(type == "img"){
  if(status == 200) message.innerHTML = "Image Deleted Successfully"
  else message.innerHTML = "Failed to Update Item"
 }
 if(type == "updateItem"){
  if(status == 200) message.innerHTML = "Item Updated Successfully"
  else message.innerHTML = "Failed to Update Item"
 }
}

// const uploadImg = document.querySelector(".custom-file-input")
// uploadImg.addEventListener("change", ()=>{
//  const parentElement = uploadImg.parentElement.id.split("-")[1]
//  const parentId = document.getElementById(parentElement)
//  const parentNode = parentId.querySelector(".catalogImgContainer")
//  const insertBeforeNode = document.getElementById(uploadImg.parentElement.id)

//  const file = uploadImg.files[0]

//  if(file){
//   console.log("file", file)
//   const reader = new FileReader()
//   reader.addEventListener("load", ()=>{
//    console.log("reader", reader)
//    // console.log("reader.result", reader.result)
//    // makeImgContainer(file.name, reader, parentElement, parentNode, insertBeforeNode)
//   })
//   reader.readAsDataURL(file)
//  }
// })

function makeImgContainer(imgName, imgSrc, id, parentNode, insertBeforeNode){

 console.log("imgName",imgName)
 console.log("id", imgSrc.result)
 console.log("id",id)

  const url = "/update/image/upload"
  const item = {
   imgName,
   imgSrc: imgSrc,
   itemId: id,
  }
  const options = {
   method: 'PUT', 
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(item) 
  }
  fetch(url, options)
  .then(response => response.status)
  .then(data => console.log(data));

 const itemImgContainer = document.createElement("div")
 const uploadedImg = document.createElement("img")
 const overLay = document.createElement("div")
 const cross = document.createElement("img")

 itemImgContainer.classList.add("itemImgContainer")
 overLay.classList.add("overLay")

 uploadedImg.src = `/imgs/mainImgs/${imgSrc}`
 uploadedImg.classList.add("images")

 cross.src = "/imgs/icons/cross.svg"
 cross.id = `${imgSrc}/${id}`

 overLay.append(cross)

 itemImgContainer.append(uploadedImg)
 itemImgContainer.append(overLay)

 parentNode.insertBefore(itemImgContainer, insertBeforeNode)
}
