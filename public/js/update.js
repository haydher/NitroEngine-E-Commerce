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
 .then(data => resultMessage(id, data));
}

const dltItem = document.querySelectorAll(".btnWarning")
dltItem.forEach(btn => {
 btn.addEventListener("click", (e)=>{
  const parent = document.getElementById(btn.id)
  parent.style.display = "none"
  e.preventDefault()
 })
});

const dltImg = document.querySelectorAll(".overLay img")
dltBtn.forEach(btn => {
 btn.addEventListener("click", (e)=>{
  console.log("image id", btn.id)
  e.preventDefault()
 })
});

function resultMessage(id, status){
 const parent = document.getElementById(id)
 const message = parent.querySelector(".message p")
 if(status == 200) message.innerHTML = "Item Updated Successfully"
 else message.innerHTML = "Failed to Update Item"
}