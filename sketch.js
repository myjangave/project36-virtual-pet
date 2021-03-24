var dog,sadDog,happyDog;
var database;
var btnfeed,btnadd;
var foodS,foodStock;
var foodObj,fedTime,lastFed;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  btnfeed = createButton("Feed The Dog");
  btnfeed.position(750,95);
  btnfeed.mousePressed(feedDog);

  btnadd = createButton("Add Food");
  btnadd.position(850,95);
  btnadd.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
 
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function (data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(20);
  if (lastFed >=12) {
    text("Last Feed: " + lastFed % 12 +"PM",350,30);
  } else if(lastFed === 0) {
    text("Last Feed: 12AM",350,30);
  }
  else {
    text("Last Feed: " + lastFed + "AM",350,30);
  }

  drawSprites();
}

//function to read stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fedTime
function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() -1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
