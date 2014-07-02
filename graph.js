
var DotScale = 12.7;
var DotSpacing = 6.5;
var HorzDotSpacing = 10.5;

var backGroundImg = "graph.png";

function createGraph(div, nbColumns, nbRows, width, height){

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    div.appendChild(canvas);

    var graph = new DotGraph(canvas, true);
    for(var i=0;i<nbColumns;i++){    
	var column = new Column(0);
	graph.addColumn( column );
	for(var j=0;j<nbRows;j++)
	    graph.addRow( i, new Dot(0,0,j) );
    }

    for(var i=0;i<nbColumns;i++){    
	for(var j=0;j<nbRows;j++){    
	    graph.setValue(i, j, 10);
	}
    }

    update(graph);

    return graph;
}

function update(dotGraph){
    dotGraph.layout();
    dotGraph.draw();
}

/////////////////////////////
//Base dot class
function Dot(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;
    this.dot = null;
    this.width = DotScale;
    this.height = 1;
    this.blank = false;
}

Dot.prototype.draw = function( dotGraph ){

    var rectWidth = this.width;
    var rectHeight = this.height;
    var rectX = this.x;
    var rectY = this.y;
    var cornerRadius = 0.5*DotScale;

    dotGraph.secondaryCanvas.getContext('2d').beginPath();
    dotGraph.secondaryCanvas.getContext('2d').moveTo(rectX+rectWidth/2, rectY);
    dotGraph.secondaryCanvas.getContext('2d').lineTo(rectX + rectWidth - cornerRadius, rectY);
    dotGraph.secondaryCanvas.getContext('2d').arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
    dotGraph.secondaryCanvas.getContext('2d').lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    dotGraph.secondaryCanvas.getContext('2d').arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
    dotGraph.secondaryCanvas.getContext('2d').lineTo(rectX + rectWidth - cornerRadius, rectY + rectHeight);
    dotGraph.secondaryCanvas.getContext('2d').arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
    dotGraph.secondaryCanvas.getContext('2d').lineTo(rectX, rectY + cornerRadius);
    dotGraph.secondaryCanvas.getContext('2d').arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
    dotGraph.secondaryCanvas.getContext('2d').lineWidth = 5;
    if(this.blank){
	dotGraph.secondaryCanvas.getContext('2d').fillStyle = "rgb("+
	    dotGraph.blankColorMap[this.color][0]+","+
	    dotGraph.blankColorMap[this.color][1]+","+
	    dotGraph.blankColorMap[this.color][2]+")";
    }
    else{
	dotGraph.secondaryCanvas.getContext('2d').fillStyle = "rgb("+
	    dotGraph.colorMap[this.color][0]+","+
	    dotGraph.colorMap[this.color][1]+","+
	    dotGraph.colorMap[this.color][2]+")";
    }
    dotGraph.secondaryCanvas.getContext('2d').closePath();
    dotGraph.secondaryCanvas.getContext('2d').fill();
    
}
/////////////////////////////////////////



///////////////////////////////////////
//Column class
//in charge of reorganising relative y position of it's children
function Column(x){
    this.children = [];
    this.nbChildren = 0;
    this.x = x;
}

Column.prototype.addChild = function(dot){
    this.children.push( dot );
    this.nbChildren++;
}

Column.prototype.setValue = function(nb, value){
    this.children[nb].height = value;
}

Column.prototype.getValue = function(nb){
    return this.children[nb].height;
}

Column.prototype.layout = function(originY){
    //set x positions
    for(var i=0;i<this.nbChildren;i++)
	this.children[i].x = this.x;

    //Total size
    var totalHeight = 0;
    for(var i=0;i<this.nbChildren;i++)
	totalHeight += (this.children[i].height + DotSpacing);
    totalHeight -= DotSpacing;

    //set positions
    var start = originY - (0.5*totalHeight);
    for(var i=0;i<this.nbChildren;i++){
	this.children[i].y = start;
	start += (this.children[i].height + DotSpacing);
    }
}

Column.prototype.layoutBlank = function(blank){
    for(var i=0;i<this.nbChildren;i++){
	this.children[i].blank = false;
	if(blank){
	    this.children[i].height = DotScale;
	    this.children[i].blank = true;
	}
    }
}

Column.prototype.draw = function(dotGraph){
    for(var i=0;i<this.nbChildren;i++){
	this.children[i].draw(dotGraph);
    }
}

///////////////////////////////////////////////



///////////////////////////////////////////////
//Graph Class represents a full graph layout

function DotGraph(canvas, interpolation){
    this.nbColumns = 0;
    this.columns = [];
    this.colorMap = [[66,85,99],[118,134,146],[164,188,194],[251,221,64],[242,169,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0],[237,139,0]];
    this.blankColorMap = [[230,200,200],[220,200,230],[250,220,210],[251,221,190],[255,230,150],[255,210,150],[255,210,150],[255,210,150],[255,210,150],[255,210,150],[255,210,150],[255,210,150],[255,210,150],[255,210,150]];

    this.select = 35;
    this.selectWidth = 1;

    this.canvas = canvas;
    this.secondaryCanvas = document.createElement("canvas");
    this.secondaryCanvas.width = canvas.width;
    this.secondaryCanvas.height = canvas.height;

    this.GraphWidth = canvas.width;
    this.GraphHeight = canvas.height;

}

DotGraph.prototype.addColumn = function(column){
    this.columns.push(column);
    this.nbColumns++;
}

DotGraph.prototype.addRow = function(columnNb, row){
    this.columns[columnNb].addChild(row);
}

DotGraph.prototype.setValue = function(column, row, value){    
    this.columns[column].setValue(row,value);
};

DotGraph.prototype.layout = function(){

    originX = this.GraphWidth * 0.5;
    originY = this.GraphHeight * 0.5;

    //Total size
    var totalWidth = 0;
    for(var i=0;i<this.nbColumns;i++)
	totalWidth += (this.columns[i].children[0].width + HorzDotSpacing);
    totalWidth -= HorzDotSpacing;

    //set positions
    var start = originX - (0.5*totalWidth);

    for(var i=0;i<this.nbColumns;i++){
	this.columns[i].x = start;
	start += (this.columns[i].children[0].width + HorzDotSpacing);
    }

    //layout individual columns
    for(var i=0;i<this.nbColumns;i++){
	if(i <= (this.select+this.selectWidth) && i >= (this.select-this.selectWidth-1))
	    this.columns[i].layoutBlank(true);
	else
	    this.columns[i].layoutBlank(false);
	this.columns[i].layout(originY);
    }
}

DotGraph.prototype.draw = function(){
    //double buffering draw loop
    //redraw background
    var imageObj = new Image();
    var cnvs = this.secondaryCanvas;
    imageObj.onload = function() {
        cnvs.getContext('2d').drawImage(imageObj,0,0, cnvs.width, cnvs.height);
    };
    imageObj.src = backGroundImg;
    //draw all "tick tacks"
    for(var i=0;i<this.nbColumns;i++){
	this.columns[i].draw( this );
    }
    //flip buffers
    this.canvas.getContext('2d').drawImage(this.secondaryCanvas,0,0);
};

DotGraph.prototype.changeSelected = function(select){
    this.select = select;
    //clear blanked out flags
    for(var i=0;i<this.nbColumns;i++){
	for(var j=0;j<this.columns[i].nbChildren;j++){
	    this.columns[i].children[j].blank = false;
	}
    }
}
