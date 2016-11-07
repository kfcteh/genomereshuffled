function RailCarSprite(startCoord,endCoord,name,length,polarity,imageIndex)
{
  this.startCoord = startCoord;
  this.endCoord = endCoord;
  this.name = name;
  this.length = length;
  this.polarity = polarity;
  this.imageIndex = imageIndex;

  PIXI.Sprite.call(this,PIXI.loader.resources[images[imageIndex]].texture);

  this.width = this.length/LENGTHSCALEFACTOR;
  this.height = 50;

}

  RailCarSprite.prototype = Object.create(PIXI.Sprite.prototype);
  RailCarSprite.prototype.constructor =  RailCarSprite;


  requestAnimationFrame(animate);

function animate() {

    requestAnimationFrame(animate);
    // render the stage
    renderer.render(stage);
}

function onDragStart(event)
{
  console.log("Drag started");
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    console.log("Drag ended");
    console.log(this.position.x);
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    console.log("Drag moved");
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        //this.position.y = newPosition.y;
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
function initializeSpriteInteractivity(railCarSprite)
{
  railCarSprite.interactive = true;
  railCarSprite.buttonMode = true;

  railCarSprite.on('mousedown', onDragStart).on('touchstart', onDragStart)
               .on('mouseup', onDragEnd).on('mouseupoutside', onDragEnd)
               .on('touchend', onDragEnd)
               .on('touchendoutside', onDragEnd)
               .on('mousemove', onDragMove)
               .on('touchmove', onDragMove);
}


function createRailCarObjects()
{

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
function populateFileContentsDiv()
{
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

  dropbox = document.getElementById("dropbox");
  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);
