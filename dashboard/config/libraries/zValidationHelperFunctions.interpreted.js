var PLAYSPACE_SIZE = 400;	//replace var with const in GitHub
var EARLY_FAIL_TIME = 10;
var WAIT_TIME = 150;
var FAIL_COLOR = rgb(118,102,160);
var PASS_COLOR = rgb(0,173,188);
var CHALLENGE_PASS_COLOR = rgb(0,0,0);

//Helper Functions

/**
 * Sets successCriteria dictionary to input dictionary.
 */
function setSuccessCriteria(criteria){
  validationProps.successCriteria = criteria;
}

/**
 * Sets successTime if all success criteria
 * have been met.
 */
function setSuccessTime(criteria){
  if (!validationProps.successTime) {
    var success = true;
    for (var criterion in criteria) {
      if (!criterion) {
        success = false;
        break;
      }
    }
    if (success) {
      validationProps.successTime = World.frameCount;
    }
  }
}

function drawProgress(state,currentTime,endTime){
  if(state=="fail"){
    fill(rgb(118,102,160));
  } else if (state=="pass"){
    fill(rgb(0,173,188));
  } else if (state=="challenge"){
	fill(rgb(0,World.frameCount*10%255,0));
  }
  rect(0,390,currentTime*400/endTime);
}

function drawRings(x,y){
  push();
  stroke("rgba(0,0,0,0.5)");
  noFill();
  strokeWeight(3);
  ellipse(x,y,Math.cos(World.frameCount/10)*30,Math.cos(World.frameCount/10)*30);
  stroke("rgba(255,255,255,0.5)");
  noFill();
  strokeWeight(3);
  ellipse(x,y,Math.sin(World.frameCount/10)*30,Math.sin(World.frameCount/10)*30);
  pop();
}

function drawHand(x, y){
  y+=5;
  push();
  var gray1=Math.cos(World.frameCount/10)*30;
  var gray2=Math.sin(World.frameCount/10)*30+225;
  //background(color);
  noStroke();
  fill(rgb(224, 224, 224));
  //palm
  shape(x-5.5,y+12,x+35.5,y+20,x+35.5,y+37,x-5.5,y+37);
  //index finger
  rect(x-5.5,y-5,10,30);
  ellipse(x,y-5,10);
  //middle
  ellipse(x+10,y+15,10);
  //ring
  ellipse(x+20,y+17.5,10);
  //pinky
  ellipse(x+30,y+20,10);
  //wrist
  ellipse(x,y+37,10);
  ellipse(x+30,y+37,10);
  rect(x,y+32,30,15);
  //thumb
  shape(x-5.5,y+37,x-20.5,y+22,x-13.5,y+15,x-5.5,y+25);
  ellipse(x-17,y+18.5,10);
  stroke(rgb(96, 96, 96));
  strokeWeight(3);
  noFill();
  //palm
  line(x-5.5,y-5,x-5.5,y+25);
  line(x+35,y+20,x+35,y+37);
  //index finger
  line(x+4.5,y-5,x+4.5,y+15);
  arc(x,y-5,10,10,180,0);
  //middle
  arc(x+10,y+15,10,10,180,0);
  //ring
  arc(x+20,y+17.5,10,10,180,0);
  //pinky
  arc(x+30,y+20,10,10,180,0);
  //wrist
  arc(x,y+37,10,10,90,180);
  arc(x+30,y+37,10,10,0,90);
  line(x,y+42,x,y+47);
  line(x+30,y+42,x+30,y+47);
  line(x,y+47,x+30,y+47);
  //thumb
  line(x-5.5,y+37,x-20.5,y+22);
  line(x-13.5,y+15,x-5.5,y+25);
  arc(x-17,y+18.5,10,10,135,315);
  pop();
}

/**
 * Checks the locations of all sprites. 
 *
 * @return {boolean} Returns true if all sprites have 
 *         different locations and false otherwise.
 */
function checkSpriteLocations(spriteIds){
  var uniqueStartingSpriteLocations = [];
  for (var i=0; i<spriteIds.length; i++) {
    var coords = [getProp({id: spriteIds[i]}, "x"), getProp({id: spriteIds[i]}, "y")];
    var noDuplicateCoords = true;
    for (var j=0; j<uniqueStartingSpriteLocations.length; j++) {
      if ((coords[0] == uniqueStartingSpriteLocations[j][0]) &&
          (coords[1] == uniqueStartingSpriteLocations[j][1])){
        noDuplicateCoords = false;
        break;
      }
    }
    if (!noDuplicateCoords) {
      break;
    } else {
      uniqueStartingSpriteLocations.push(coords);
    }
  }

  if (spriteIds.length == uniqueStartingSpriteLocations.length) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks the costumes of all sprites.
 *
 * @return {boolean} Returns true if all sprites have 
 *         different costumes and false otherwise.
 */
function checkSpriteCostumes(spriteIds){
  var uniqueStartingSpriteCostumes = [];
  for (var i=0; i<spriteIds.length; i++) {
    var costume = getProp({id: spriteIds[i]}, "costume");
    var noDuplicateCostumes = true;
    for (var j=0; j<uniqueStartingSpriteCostumes.length; j++) {
      if (costume == uniqueStartingSpriteCostumes[j]) {
        noDuplicateCostumes = false;
        break;
      }
    }
    if (!noDuplicateCostumes) {
      break;
    } else {
      uniqueStartingSpriteCostumes.push(costume);
    }
  }

  if (spriteIds.length == uniqueStartingSpriteCostumes.length) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if sprites are touching.
 *
 * @return {boolean} Returns true if no sprites are
 *         touching and false otherwise.
 */
function checkSpritesTouching(spriteIds){
  for (var i=0; i<spriteIds.length; i++) {
    for (var j=i+1; j<spriteIds.length; j++) {
      if (isTouchingSprite({id: spriteIds[i]}, {id: spriteIds[j]})) {
        setProp({id: spriteIds[i]}, "debug", true);
        setProp({id: spriteIds[j]}, "debug", true);
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if any sprite has active speech.
 *
 * @return {boolean} Returns true if any sprite has
 *         active speech and false otherwise.
 */
function checkActiveSpeech(spriteIds){
  for (var spriteId in spriteIds) {
    if(getProp({ id: spriteId }, "speech")){
      return true;
    }
  }
  return false;
}

/**
 * Checks if all sprites say something.
 *
 * @return {boolean} Returns true if all sprites
 *         say something and false otherwise.
 */
/* NOT USED
function checkAllSpritesSay(spriteIds){
  var numSpritesWithSayBlocks = 0;
  for (var spriteId in spriteIds) {
    if(getProp({ id: spriteId }, "speech")){
      numSpritesWithSayBlocks = numSpritesWithSayBlocks + 1;
    }
  }
  if (numSpritesWithSayBlocks == spriteIds.length) {
    return true;
  } else {
    return false;
  }
} */ 

/**
 * Checks if new event occurred in playspace.
 *
 * @return {boolean} Returns true if new event
 *         occurred and false otherwise.
 */
function checkForNewEvent(){
  if (eventLog.length > validationProps.previous.eventLogLength) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if new click event occurred in playspace.
 *
 * @return {boolean} Returns true if new click
 *         event occurred and false otherwise.
 */
function checkForNewClickEvent(){
  if (eventLog.length > validationProps.previous.eventLogLength) {
    var currentEvent = eventLog[eventLog.length - 1];
    if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a sprite was clicked in current frame.
 *
 * @return {boolean} Returns true if a sprite was
 *         clicked and false otherwise.
 */
function checkSpriteClicked(){
  if (eventLog.length > validationProps.previous.eventLogLength) {
    var currentEvent = eventLog[eventLog.length - 1];
    var clickedSpriteId = parseInt(currentEvent.split(" ")[1]);
    if ((currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) &&
        clickedSpriteId) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a sprite was clicked in current frame and returns spriteId if so.
 *
 * @return {int} Returns spriteId of the sprite that was
 *         clicked and and -1 otherwise.
 */
function getClickedSpriteId(){
  if (eventLog.length > validationProps.previous.eventLogLength) {
    var currentEvent = eventLog[eventLog.length - 1];
    var clickedSpriteId = parseInt(currentEvent.split(" ")[1]);
    if ((currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) &&
        clickedSpriteId) {
      return clickedSpriteId;
    }
  }
  return -1;
}

/**
 * Checks if a clicked sprite causes some sprite to speak in the frame.
 *
 * @return {boolean} Returns true if a clicked sprite
 *         caused speech and false otherwise.
 */
function checkSpriteSay(){
  // don't know if first if statement this should be in every event check method......
  if (eventLog.length > validationProps.previous.eventLogLength) {
    var currentEvent = eventLog[eventLog.length - 1];
    if (currentEvent.includes("whenClick: ") || currentEvent.includes("whileClick: ")) {
      for (var spriteId in spriteIds) {
        if (getProp({id: spriteId}, "speech") && getProp({id: spriteId}, "timeout")==120) {
          // clicked sprite caused speech in some sprite
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Checks if there is at least one sprite.
 *
 * @return {boolean} Returns true if there is at least
 *         one sprite and false otherwise.
 */
function checkOneSprite(spriteIds){
  return spriteIds.length>=1;
}

/**
 * Checks if there are at least two sprites.
 *
 * @return {boolean} Returns true if there are at least
 *         two sprites and false otherwise.
 */
function checkTwoSprites(spriteIds){
  return spriteIds.length>=2;
}

/**
 * Checks if the background was changed.
 *
 * @return {boolean} Returns true if the background
 *         was changed and false otherwise.
 */
function checkBackgroundChanged(){
  var background = getBackground();
  return background !== undefined && background !== "#ffffff";
}



/**
 * Checks for unclicked sprites, and show hand with rings
 *
 * @return 
 */
function checkForUnclickedSprites(spriteIds, eventLog){
  for(var i=0;i<spriteIds.length;i++){
    var foundClick=false;
    for(var j=0;j<eventLog.length;j++){
      if(eventLog[j].includes(i)){
        foundClick=true;
        if(validationProps.clickedSprites.indexOf(i)==-1){
          validationProps.clickedSprites.push(i);
        }
      }
    }
    if(!foundClick){
      drawRings(getProp({id: i}, "x"),400-getProp({id: i}, "y"));
      drawHand(getProp({id: i}, "x"),400-getProp({id: i}, "y"));
    }
  }
}




/*

new method - check if clicked sprite starts speaking

*/


/*
new method

for (var spriteId in spriteIds) {
        if (getProp({id: spriteId}, "speech") && getProp({id: spriteId}, "timeout")==120) {
          // clicked sprite caused speech in some sprite
          return true;
        }
      }

*/




/**
 * Draws progress bar in playspace based on status. 
 * 
 * @param {string} status Keyword representing the current state
 *                 of the level (i.e. pass, fail, challenge, etc.).
 */
function drawProgressBar(status){
  push();
  stroke("white");

  switch (status) {
    case "earlyFail":
      fill(FAIL_COLOR);
      rect(0,PLAYSPACE_SIZE - 10,(World.frameCount*PLAYSPACE_SIZE/EARLY_FAIL_TIME),10);
      break;
    case "fail":
      fill(FAIL_COLOR);
      rect(0,PLAYSPACE_SIZE - 10,(World.frameCount*PLAYSPACE_SIZE/WAIT_TIME),10);
      break;
    case "pass":
      fill(PASS_COLOR);
      rect(0,PLAYSPACE_SIZE - 10,(World.frameCount*PLAYSPACE_SIZE/WAIT_TIME),10);
      break;
    case "challengePass":
    //Do something for challengePass
  }

  pop();
}