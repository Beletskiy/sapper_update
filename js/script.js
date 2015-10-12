
/*--------------------------------------------------visualization-------------------------------------------*/
/*--------------------------------------------------CanvasDrawer-------------------------------------------*/

function CanvasDrawer (leftClickHandler, rightClickHandler) {
    this.cellSize = 20;
    this.canvasField = document.getElementById("canvasGameField");
    this.ctx = this.canvasField.getContext('2d');
    this.pic = new Image();
    this.leftClickHandler = leftClickHandler;
    this.rightClickHandler = rightClickHandler;
}
CanvasDrawer.prototype.drawCanvasField = function (modelArr) {
    var canvasArr = modelArr,
        numberOfCells = canvasArr.length,
        cellSize = this.cellSize,
        self = this,
        ctx = this.ctx;
  /*this.canvasField.width = numberOfCells*cellSize;
    this.canvasField.height = numberOfCells*cellSize; */
    ctx.fillStyle = 'gray';
    for (var i = 0; i < numberOfCells; i++) {
        for (var j = 0; j < numberOfCells; j++) {
             ctx.fillRect(j*cellSize + 1, i*cellSize + 1, cellSize - 1, cellSize - 1);
        }
    }

    var leftClickHandler =  function(e) {
        var mousePositionX = Math.floor(e.offsetX/cellSize),
            mousePositionY = Math.floor(e.offsetY/cellSize);
        self.leftClickHandler(mousePositionX, mousePositionY, canvasArr);
    };

    var rightClickHandler = function(e) {
        var mousePositionX = Math.floor(e.offsetX/cellSize),
            mousePositionY = Math.floor(e.offsetY/cellSize);
        self.rightClickHandler(mousePositionX, mousePositionY, canvasArr);
        e.preventDefault();
    };
    this.canvasField.addEventListener('click', leftClickHandler);
    this.canvasField.addEventListener('contextmenu', rightClickHandler);
};
CanvasDrawer.prototype.showNumber = function (x,y,modelArr,numberOfMineBeside) {
    this.ctx.font = "18px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(numberOfMineBeside, x*this.cellSize + this.cellSize/3,  y*this.cellSize+this.cellSize-2);
};
CanvasDrawer.prototype.showBlank = function (x,y) {
    this.ctx.fillStyle = "#ddd";
    this.ctx.fillRect(x*this.cellSize+1, y*this.cellSize+1, this.cellSize-1, this.cellSize-1);
};
CanvasDrawer.prototype.showBomb = function (x,y) {
    this.pic.src = 'img/bomb.png';
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(x*this.cellSize+1, y*this.cellSize+1, this.cellSize-1, this.cellSize-1);
    //this.showAllBombs(x,y);
    this.ctx.drawImage(this.pic, x*this.cellSize, y*this.cellSize);
};
CanvasDrawer.prototype.showAllBombs = function (x,y) {
    this.pic.src = 'img/bomb.png';
    this.ctx.drawImage(this.pic, x*this.cellSize, y*this.cellSize);
};
CanvasDrawer.prototype.showFlag = function (x, y) {
    this.pic.src = 'img/flag1.png';
    this.ctx.drawImage(this.pic, x*this.cellSize, y*this.cellSize);
};
CanvasDrawer.prototype.disableFlag = function (x, y) {
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(x*this.cellSize+1, y*this.cellSize+1, this.cellSize-1, this.cellSize-1);
};

/* ---------------------------------------------------HTMLDrawer-----------------------------------------------*/
function HTMLDrawer (leftClickHandler, rightClickHandler) {
    // this.htmlField = null;
    this.leftClickHandler = leftClickHandler;
    this.rightClickHandler = rightClickHandler;
}

HTMLDrawer.prototype.drawHtmlField = function (modelArr) {
   var htmlField = modelArr,
       table = document.createElement('table'),
       tr = null, td = null,
       arrSize = htmlField.length,
       self = this;

    for (var i = 0; i < arrSize; i++) {
        tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j = 0; j < arrSize; j++) {
            td = document.createElement('td');
            tr.appendChild(td);
            td.setAttribute('id', 'c_'+j+'_'+i);
            td.setAttribute('class', 'closed');

             var leftClickHandler = function(e){
                var el = e.currentTarget,
                    id = el.getAttribute('id'),
                    parts = id.split('_'),
                    x = parts[1],
                    y = parts[2];
                self.leftClickHandler(x, y, modelArr);
            };

             var rightClickHandler = function (e) {
                var el = e.currentTarget,
                    id = el.getAttribute('id'),
                    parts = id.split('_'),
                    x = parts[1],
                    y = parts[2];
                self.rightClickHandler(x, y, modelArr);
                e.preventDefault();
            };

            td.addEventListener('click', leftClickHandler);
            td.addEventListener('contextmenu', rightClickHandler);
        }
    }
    gameField.appendChild(table);
};

HTMLDrawer.prototype.showBomb = function (x,y) {
    var cellId = document.getElementById('c_'+x+'_'+ y);

    cellId.classList.remove('closed');
    cellId.classList.add('red');
    cellId.classList.add('bomb');
};
HTMLDrawer.prototype.showAllBombs = function (x,y) {
    var cellId = document.getElementById('c_'+x+'_'+y);

    cellId.classList.remove('closed');
    cellId.classList.add('bomb');
};
HTMLDrawer.prototype.showNumber = function (x,y,modelArr) {
    var htmlField = modelArr,
        cellId = document.getElementById('c_'+x+'_'+y);

    cellId.classList.remove('closed');
    cellId.innerHTML = htmlField[x][y][0];

};
HTMLDrawer.prototype.showBlank = function (x, y) {
    var cellId = 'c_'+x+'_'+y;
    document.getElementById(cellId).classList.remove('closed');
};
HTMLDrawer.prototype.showFlag = function (x, y) {
    var cellId = document.getElementById('c_'+x+'_'+y);
    cellId.classList.remove('closed');
    cellId.classList.add('flag');
};
HTMLDrawer.prototype.disableFlag = function (x, y) {
    var cellId = document.getElementById('c_'+x+'_'+y);
    cellId.classList.remove('flag');
    cellId.classList.add('closed');
};

/*----------------------------------------------end of visualization----------------------------------------*/

/*---------------------------------------------------logic--------------------------------------------------*/
function Game () {

    //var self = this;                           2-d variant
    //this.drawer = new HTMLDrawer(function () {
    //    self.onCellClick()
    //});

    //this.drawer = new HTMLDrawer(this.onCellClick.bind(this), this.onCellRightClick.bind(this));

    //this.drawer = new CanvasDrawer();
    this.drawer = new CanvasDrawer(this.onCellClick.bind(this), this.onCellRightClick.bind(this));
    this.modelArr = null;
    this.size = 0;
}

Game.prototype.start = function(s) {  //create model of the square field , s - side of the square
    this.modelArr = [];
    this.size = s;
    for (var i=0; i<this.size; i++) {
        var t = [];
        for (var j=0; j<this.size; j++){
            t.push([0, 'closed']);
        }
        this.modelArr.push(t);
    }
    this.arrangeMines();
};

Game.prototype.arrangeMines = function () {
    var z = 0,
        x = 0,
        y = 0;
    while (z < this.size) {  // Suppose, the number of bombs = size
        x = this.getRand(0, this.size - 1);
        y = this.getRand(0, this.size - 1);
        if (!this.isBomb(y,x))  {
            this.modelArr[y][x][0] = 10;
            this.arrangeNumbers(y,x);
            z++;
        }
    }
};
Game.prototype.arrangeNumbers = function (y,x) {
    var siblings = [
        {
            x : 0,
            y : -1
        },
        {
            x : 1,
            y : -1
        },
        {
            x : 1,
            y : 0
        },
        {
            x : 1,
            y : 1
        },
        {
            x : 0,
            y : 1
        },
        {
            x : -1,
            y : 1
        },
        {
            x : -1,
            y : 0
        },
        {
            x : -1,
            y : -1
        }
    ];
    var siblingsLength = siblings.length;
    for (var i = 0; i < siblingsLength; i++) {
        var obj = siblings[i];
        if ( (y + obj.y) < this.modelArr.length &&
        (x + obj.x) < this.modelArr.length &&
        (y + obj.y > -1) &&
        (x + obj.x > -1) &&
        (!this.isBomb(y + obj.y, x + obj.x)) ) {
            this.modelArr[y + obj.y][x + obj.x][0]++;
        }
    }
};

Game.prototype.getRand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Game.prototype.isBomb = function (x, y) {
   if  (this.modelArr[x][y][0] == 10) {
       return true;
   }
};
Game.prototype.isNumber = function (x, y) {
    if ((this.modelArr[x][y][0] > 0 ) && (this.modelArr[x][y][0] < 9)) {
        return true;
    }
};
Game.prototype.isFlag = function (x, y) {
    if (this.modelArr[x][y][1] == 'flag') {
        return true;
    }
};
Game.prototype.findAllBombs = function () {
    var size = this.modelArr.length;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (this.modelArr[j][i][0] == 10){
                this.drawer.showAllBombs(j, i);
            }
        }
    }
};
Game.prototype.onCellClick = function (x, y, modelArr) {
    var numberOfMineBeside = null;
    this.modelArr = modelArr;
    if ((this.isBomb(x, y)) && (!this.isFlag(x, y))) {
        this.drawer.showBomb(x, y);
        this.findAllBombs();
        alert ('You luse!');

    } else if ((this.isNumber(x, y)) && (!this.isFlag(x, y))) {
        numberOfMineBeside = this.modelArr[x][y][0];
        this.drawer.showNumber(x,y,this.modelArr,numberOfMineBeside);
        this.modelArr[x][y][1] = 'open';

    } else if (!this.isFlag(x, y)) {
        this.drawer.showBlank(x,y,this.modelArr);
        this.modelArr[x][y][1] = 'open';
    }
    if (this.isWin(this.modelArr)) {
        alert('You Win!!!');
    }
};
Game.prototype.onCellRightClick = function (x, y, modelArr) {
    var state;
    this.modelArr = modelArr;
        state = this.modelArr[x][y][1];
    if (state == 'closed') {
        this.modelArr[x][y][1] = 'flag';
        this.drawer.showFlag(x,y);
    } else if (state == 'flag') {
        this.modelArr[x][y][1] = 'closed';
        this.drawer.disableFlag(x,y);
    }

};
Game.prototype.isWin = function (modelArr) {
    this.modelArr = modelArr;
    var numberOpenCells = 0,
        size = this.modelArr.length;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (this.modelArr[j][i][1] == 'open'){
                numberOpenCells++;
                if (numberOpenCells == size*size - size) {
                    return true;
                }
            }
        }
    }
};

/*--------------------------------------end of logic------------------------------------------*/
var game = new Game();
game.start(5);
//game.drawer.drawHtmlField(game.modelArr);
game.drawer.drawCanvasField(game.modelArr);

