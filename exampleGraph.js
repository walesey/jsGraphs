var columns = 50;
var rows = 6;
DotScale = 12;
DotSpacing = 6;
HorzDotSpacing = 12;
backGroundImg = "graph.png";

var exampleDotGraph = createGraph(document.getElementById("raphaelChart"), columns, rows, 1200, 600 );

exampleDotGraph.colorMap = [];
exampleDotGraph.colorMap.push([100,10,10]);
exampleDotGraph.colorMap.push([70,10,30]);
exampleDotGraph.colorMap.push([50,10,50]);
exampleDotGraph.colorMap.push([30,10,70]);
exampleDotGraph.colorMap.push([20,10,90]);
exampleDotGraph.colorMap.push([10,10,120]);

exampleDotGraph.blankColorMap = [];
exampleDotGraph.blankColorMap.push([200,130,140]);
exampleDotGraph.blankColorMap.push([170,130,130]);
exampleDotGraph.blankColorMap.push([150,130,150]);
exampleDotGraph.blankColorMap.push([130,130,170]);
exampleDotGraph.blankColorMap.push([120,130,190]);
exampleDotGraph.blankColorMap.push([110,130,210]);

exampleDotGraph.selectWidth = 2;

var ticker = 0;

//create a sine wave effect
var t=setInterval( function(){
    
    for(var i=0;i<columns;i++){
	for(var j=0;j<rows;j++){
	    exampleDotGraph.setValue(i,j,20*(1.6+Math.sin( 0.3*(ticker+i+j) )) );
	}
    }

    exampleDotGraph.select = ticker%columns;
	    
    update(exampleDotGraph);
    ticker+=0.1;
}, 12);
