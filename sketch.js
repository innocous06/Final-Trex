var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bgImg;
var sun, sunImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var jump, collide;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  sunImg = loadImage("sun.png");
  
  bgImg = loadImage("backgroundImg.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  jump = loadSound("jump.wav");
  collide = loadSound("collided.wav");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  sun = createSprite(width-80,120,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.15;
  
  trex = createSprite(50,height-50,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;
  
  trex.setCollider("circle", 50, 0, 200);
  
  ground = createSprite(width/2,height-20,600,10);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  //ground.visible=false;
  
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+20);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-20,width, 10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
 // invisibleGround.debug=true;
}

function draw() {
  //trex.debug = true;
  background(bgImg);
  invisibleGround.debug=true;
  fill("black")
  textSize(20);
  textFont("Comic Sans MS");
  text("Score: "+ score, width/5, height/10);
  text("HI: "+ localStorage[0], width/20, height/10);
  text(mouseX+","+mouseY,mouseX,mouseY)
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((keyDown("SPACE")) && trex.y  >=height-75) {
      jump.play( )
      trex.velocityY = -10;
      
    }
  
    trex.velocityY = trex.velocityY + 0.6
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
   // cloud.velocityX =  -(6 + 3*score/100);
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        collide.play();
    }
  //  obstaclesGroup.depth = ground.depth + 1000;
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  trex.depth=ground.depth;
  ground.depth=ground.depth-1;

  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width,height/2,40,10);
    cloud.y = Math.round(random(20,height/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + 3*score/100);;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = sun.depth;
    sun.depth = sun.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-40,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = (0.2);
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = (0.1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    //obstacle.depth = trex.depth;
    //trex.depth = trex.depth + 1;
    ground.depth = obstaclesGroup.depth;
    obstaclesGroup.depth = obstaclesGroup.depth + 1;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstaclesGroup.debug=true;
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
  console.log(localStorage[0]);
  
  score = 0;
  
}