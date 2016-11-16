"use strict"

function RailCarSprite(startCoord,endCoord,name,length,polarity,imageIndex) {
  this.startCoord = startCoord;
  this.endCoord = endCoord;
  this.name = name;
  this.length = length;
  this.polarity = polarity;
  this.imageIndex = imageIndex;
  this.prevX = null;

  PIXI.Sprite.call(this,PIXI.loader.resources[images[imageIndex]].texture);

  this.width = this.length/LENGTHSCALEFACTOR;
  this.height = 50;

}

  RailCarSprite.prototype = Object.create(PIXI.Sprite.prototype);
  RailCarSprite.prototype.constructor =  RailCarSprite;

  RailCarSprite.prototype.getEndx = function(){
    return(this.x + this.width);
};
  RailCarSprite.prototype.getCollisionBoundary = function(){

    return( {xStart : (this.position.x + this.width/2 - 30), xEnd : (this.position.x + this.width/2 + 30)});

};

  requestAnimationFrame(animate);

function animate() {

    requestAnimationFrame(animate);
    Tween.runTweens();
    // render the stage
    renderer.render(stage);
}

function onDragStart(event) {

  console.log("Drag started" + this.name);
  draggedSprite = this;
  this.prevX = this.x;
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function isIntersecting(r1, r2) {

return !(r2.x > (r1.x + r1.width) ||

           (r2.x + r2.width) < r1.x ||

           r2.y > (r1.y + r1.height) ||

           (r2.y + r2.height) < r1.y);
}

function checkIntersection(railCar) {

  var collidedCars = [];

  railCarSprites.forEach(railCarSprite => {

    if(railCarSprite !== railCar) {

      railCarSprite.y = 0;

      if(isIntersecting(railCar,railCarSprite)) {
        collidedCars.push(railCarSprite);
      }
    }
  });

  return collidedCars;

}

function isBoundaryIntersecting(r1,r2) {

return !(r2.x > (r1.getCollisionBoundary().xEnd) ||
             (r2.x + r2.width) < r1.getCollisionBoundary().xStart);

}

function checkBoundaryIntersection(railCar) {


  var collidedCars = [];

  railCarSprites.forEach(railCarSprite => {

    if(railCarSprite !== railCar) {

      railCarSprite.y = 0;

      if(isBoundaryIntersecting(railCar,railCarSprite)) {
        collidedCars.push(railCarSprite);
      }
    }
  });


  return collidedCars;

}

function onDragEnd() {

    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    var indexOfDraggedSprite = railCarSprites.indexOf(this);
    var chainedTweens = [];

    var collidedCars = [];

    if(this === draggedSprite) {

      collidedCars = checkIntersection(this);

      if (collidedCars.length === 0) {

        console.log('no collisions occured!');

        if (indexOfDraggedSprite !== (railCarSprites.length-1)) {
          console.log("not last one!");
          for(let x = indexOfDraggedSprite+1; x < railCarSprites.length; x++)
          {
            var tween = new Tween(railCarSprites[x],"position.x",railCarSprites[x].x+this.width+GAPBETWEENRAILCARS,2,false)
            tween.easing = Tween.inCubic;
            chainedTweens.push(tween);
            //railCarSprites[x].x = railCarSprites[x].x-this.width-GAPBETWEENRAILCARS;
          }
        }
        //new ChainedTween(chainedTweens);
        chainedTweens.push(new Tween(this, "position.x", this.prevX, 1, false));
        chainedTweens.push(new Tween(this, "position.y", 0, 1, false));
        new ChainedTween(chainedTweens);

        collapse = false;

      }else {

        //fix code
        // console.log('collisions occured!');
        // collidedCars.forEach(collidedCar => {
        //
        //   var indexOfCollidedCar = railCarSprites.indexOf(collidedCar);
        //   var collidedCarX = collidedCar.x;
        //   var startIndex;
        //
        //
        //
        //   //if rail car is in middle of chain collapse chain before shift
        //   if (indexOfDraggedSprite !== (railCarSprites.length-1)) {
        //     console.log("not last one!");
        //     for(let x = indexOfDraggedSprite+1; x < railCarSprites.length; x++)
        //     {
        //       chainedTweens.push(new Tween(railCarSprites[x],"position.x",railCarSprites[x].x-this.width-GAPBETWEENRAILCARS,1,false));
        //       railCarSprites[x].x = railCarSprites[x].x-this.width-GAPBETWEENRAILCARS;
        //     }
        //   }
        //
        //   if (indexOfDraggedSprite > indexOfCollidedCar) {
        //     startIndex = indexOfCollidedCar;
        //   }else {
        //     startIndex = indexOfCollidedCar+1;
        //   }
        //
        //   for(let x = startIndex; x < railCarSprites.length; x++)
        //   {
        //     if(railCarSprites[x] != this)
        //     {
        //       chainedTweens.push(new Tween(railCarSprites[x],"position.x",railCarSprites[x].x+this.width+GAPBETWEENRAILCARS,1,false));
        //     }
        //   }
        //
        //   if (indexOfDraggedSprite > indexOfCollidedCar) {
        //     chainedTweens.push(new Tween(this,"position.x",collidedCarX,1,false));
        //   }else {
        //     chainedTweens.push(new Tween(this,"position.x",railCarSprites[indexOfCollidedCar].x+railCarSprites[indexOfCollidedCar].width+GAPBETWEENRAILCARS,1,false));
        //   }
        //
        //   railCarSprites.splice(indexOfDraggedSprite,1);
        //   railCarSprites.splice(indexOfCollidedCar,0,this);
        //
        //   new ChainedTween(chainedTweens);
        // });
      }
    }
}

function onDragMove() {

    if (this.dragging)
    {

        var newPosition = this.data.getLocalPosition(this.parent);
        var chainedTweens = [];
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;

        var indexOfDraggedSprite = railCarSprites.indexOf(this);

        if(this.position.y > 50 && collapse === false)
        {
          //collapse structure
          if (indexOfDraggedSprite !== (railCarSprites.length-1)) {
            console.log("not last one!");
            for(let x = indexOfDraggedSprite+1; x < railCarSprites.length; x++)
            {

              var tween = new Tween(railCarSprites[x],"position.x",railCarSprites[x].x-this.width-GAPBETWEENRAILCARS,2,false);
              tween.easing = Tween.inCubic;
              chainedTweens.push(tween);
              //railCarSprites[x].x = railCarSprites[x].x-this.width-GAPBETWEENRAILCARS;
            }

          }

          new ChainedTween(chainedTweens);
          collapse = true;

        }

      var collidedCars = checkBoundaryIntersection(this);

      if(collidedCars.length > 1) {
        console.log('collision!!!!!');
        collidedCars.forEach(railCar => {railCar.y = 5;});
      }
    }

}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}
function initializeSpriteInteractivity(railCarSprite) {
  railCarSprite.interactive = true;
  railCarSprite.buttonMode = true;
  //railCarSprite.anchor.set(0.5,0.5);

  railCarSprite.on('mousedown', onDragStart).on('touchstart', onDragStart)
               .on('mouseup', onDragEnd).on('mouseupoutside', onDragEnd)
               .on('touchend', onDragEnd)
               .on('touchendoutside', onDragEnd)
               .on('mousemove', onDragMove)
               .on('touchmove', onDragMove);
}

function createRailCarObjects() {

  var rows = textFile.target.result.split("\n");
  var imageIndex = 0;

  var x = 0;

  rows.forEach(row => {

    var rowSplitData = row.split("\t");
    var railCarSprite = new RailCarSprite(rowSplitData[1],rowSplitData[2],rowSplitData[5],rowSplitData[7],rowSplitData[8],imageIndex);

    initializeSpriteInteractivity(railCarSprite);

    railCarSprite.x = x;

    x += railCarSprite.width + GAPBETWEENRAILCARS;

    railCarSprites.push(railCarSprite);

    stage.addChild(railCarSprite);

    imageIndex += 1;

    if (imageIndex > 6) {
      imageIndex = 0;
    }

  });

  renderer.render(stage);
  populateFileContentsDiv();

}
function populateFileContentsDiv() {
  var para;
  var node;
  var element = document.getElementById("filecontents");

  railCarSprites.forEach(railCarSprite => {
    para = document.createElement("p");
    node = document.createTextNode(railCarSprite.startCoord + " " + railCarSprite.endCoord + " " + railCarSprite.name+ " " + railCarSprite.length + " " + railCarSprite.polarity);
    para.appendChild(node);
    element.appendChild(para);
  });
}

function handleFiles(files) {

  console.log("file was dropped!!!!!");
  var fr = new FileReader();
  fr.readAsText(files[0]);

  fr.onload = function(e) {

      textFile = e;

      images = [
      "assets/1.jpg",
      "assets/2.jpg",
      "assets/3.jpg",
      "assets/4.jpg",
      "assets/5.jpg",
      "assets/6.jpg",
    ];
    PIXI.loader
      .add(images)
      .load(createRailCarObjects);
  };

}
  const LENGTHSCALEFACTOR = 10;
  const GAPBETWEENRAILCARS = 5;

  var stage = new PIXI.Container();
  var renderer = PIXI.autoDetectRenderer(1400, 400,{backgroundColor : 0x000000});



  var view = document.getElementById("view");
  view.appendChild(renderer.view);

  var dropbox;
  var railCarSprites = [];
  var images = [];
  var textFile;
  var draggedSprite;
  var collapse = false;

  dropbox = document.getElementById("dropbox");
  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);
