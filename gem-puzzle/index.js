const createCanvas = document.createElement('canvas');
createCanvas.setAttribute('id', 'canvas');
document.body.prepend(createCanvas);


let arrNumber = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
let handleClick = 0;
let puzzleView = null;
let puzzleNumber = null;

function game() {


        function searchEmptyCell() {
            for (let i=0; i < arrNumber.length; i++) {
                for (let j=0; j < arrNumber[0].length; j++) {
                    if (arrNumber[j][i] === 0) {
                        return {'x': i, 'y': j};
                }
            }
        }
     }

  function getRandom() {
    if (Math.floor(Math.random()*2) === 0) {
        return true;
    }
  }

  this.getClicks = function() {
    return handleClick;
};

//Делаем движение пятнашки в пустую ячейку
this.move = function(x,y) {
    let emptyX = searchEmptyCell().x;
	let emptyY = searchEmptyCell().y;
		if (((x - 1 == emptyX || x + 1 == emptyX) && y == emptyY) || ((y - 1 == emptyY || y + 1 == emptyY) && x == emptyX)) {
			arrNumber[emptyY][emptyX] = arrNumber[y][x];
			arrNumber[y][x] = 0;
			handleClick++;
            
        }
}

this.win = function() {
    let arrWin = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
    let result = true;
    for (let i = 0; i < arrWin.length; i++) {
        for (let j =0; j < arrWin[0].length; j++) {
            if (arrWin[i][j] !== arrNumber[i][j]) {
               result = false;
            }
        }
    }
    return result;
}

this.mix = function(stepCount) {
    let x,y;
    for (let i=0; i < stepCount; i++) {
        let emptyX = searchEmptyCell().x;
	    let emptyY = searchEmptyCell().y;
        let someMove = getRandom();
        let upMove = getRandom();

        if (!someMove && !upMove) { 
            y = emptyY; x = emptyX - 1  //влево
        }
        if (someMove && !upMove) { 
            x = emptyX; y = emptyY + 1  //наверх
        }
        if (!someMove && upMove) { 
            y = emptyY; x = emptyX + 1  //вправо
        }
        if (someMove && upMove) { 
            x = emptyX; y = emptyY - 1  //вниз
        }
        if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
            this.move(x, y)
        }
    }
    handleClick = 0;
};
this.setPuzzleView = function(func) {
    puzzleView = func;
};

this.setNumView = function(func) {
    puzzleNumber = func;
};


this.draw = function (context, size) {
    for (let i = 0; i < 4; i++) { 
        for (let j = 0; j < 4; j++) { 
            if (arrNumber[i][j] > 0) { 
                if (puzzleView !== null) { 
                    puzzleView(j * size, i * size) 
                }
                if (puzzleNumber !== null) {
                    puzzleNumber();
                    context.fillText(arrNumber[i][j], j * size + size /2, i * size + size /2)
                }
            }
        }
    }
    }
    
    
 }


function startGame() {
	let canvas = document.getElementById("canvas");
    if (window.innerWidth >= 1280) {
        canvas.width  = 450;
        canvas.height = 450;
    }
    if (window.innerWidth < 1280) {
        canvas.width  = 400;
        canvas.height = 400;
    }
    if (window.innerWidth < 768) {
        canvas.width  = 320;
        canvas.height = 320;
    }
	let cellSize = canvas.width / 4;
	let context = canvas.getContext("2d");
	let puzzleArea = new game(); 
    puzzleArea.mix(350); 
    puzzleArea.setPuzzleView(function(x, y) { 
	    	context.fillStyle = "#cf4688";
	    	context.fillRect(x+1, y+1, cellSize-2, cellSize-2);
	    });
	    puzzleArea.setNumView(function() { 
	    	context.font = "bold "+(cellSize/2)+"px Trispace";
	    	context.textAlign = "center";
	    	context.textBaseline = "middle";
	    	context.fillStyle = "white";
	    });
	context.fillStyle = "#d6d6d6";
	context.fillRect(0, 0, canvas.width, canvas.height);
	puzzleArea.draw(context, cellSize);


   
function action(x, y) { 
    puzzleArea.move(x, y);
    context.fillStyle = "#d6d6d6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    puzzleArea.draw(context, cellSize);
    if (puzzleArea.win()) { // если головоломка сложена, то пятнашки заново перемешиваются
        alert(`Hooray! You solved the puzzle in ${minute} minutes ${second} seconds and ${puzzleArea.getClicks()} moves!`);
        puzzleArea.mix(350);
        pauseTimer();
        context.fillStyle = "#d6d6d6";
        context.fillRect(0, 0, canvas.width, canvas.height);
        puzzleArea.draw(context, cellSize);

            let arrScore = new Array(2);
            arrScore[0] = puzzleArea.getClicks();
            console.log(`${puzzleArea.getClicks()}`)
            arrScore[1] = `${minute} min ${second} sec`;
            tenBestScores.push(arrScore);
            tenBestScores = tenBestScores.slice(0,10);
            localStorage.setItem('tenBestScore', JSON.stringify(tenBestScores));
    
    }
    console.log(puzzleArea.getClicks())
    document.querySelector('.game__moves').innerHTML = `Move: ${puzzleArea.getClicks()}`
    mySound.play();
}

let mySound;
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = './src/audio/sound1.mp3';
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

  mySound = new sound();
  
  canvas.onclick = function(event) { // обрабатываем клики мышью
    startTimer();
    let x = (event.pageX - canvas.offsetLeft) / cellSize | 0;
    let y = (event.pageY - canvas.offsetTop)  / cellSize | 0;
    action(x, y); 
    if (soundGame) {
     mySound.play();    
    } else {
      mySound.stop();
    }
 
}
//перемешиваем при нажатии Новая игра
newGameButton.addEventListener('click', function(event){
    puzzleArea.mix(350);
    context.fillStyle = "#d6d6d6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    puzzleArea.draw(context, cellSize);
    resetTimer();
    moves.innerHTML = 'Move: 0';
})

}

let nameGame = document.createElement('div');
nameGame.className = 'title';
nameGame.innerText = 'Gem-Puzzle '
document.body.prepend(nameGame);

let counter = document.createElement('div');
counter.className = 'counter';
document.body.appendChild(counter);
document.querySelector('.counter').innerHTML = `<span>Time: </span><span id="minute">00</span>:<span id="second">00</span>`;

let controlButtons = document.createElement('div');
controlButtons.className = 'buttons__control';
document.body.appendChild(controlButtons);


//Кнопка Новая игра
const newGameButton = document.createElement('button');
newGameButton.className = 'button__newgame';
newGameButton.innerText = "New Game";
controlButtons.appendChild(newGameButton);



const soundButton = document.createElement('button');
soundButton.className = 'button__sound';
soundButton.innerText = "Sound On";
document.body.appendChild(soundButton);

let soundGame = false;
soundButton.addEventListener('click', function() {
    if (soundGame) {
        soundGame = false;
        soundButton.innerText = 'Sound On';
    } else {
        soundGame = true;
        soundButton.innerText = "Sound Off";
    }
})
 

const timerButton = document.createElement('button');
timerButton.className = 'button__timer';
timerButton.innerText = "Pause Game";
controlButtons.appendChild(timerButton);

let minute = 0;
let second = 0;
let step;

function startTimer(event) {
    pauseTimer();
    step = setInterval(() => {
        gameTimer();
    }, 1000)
}

function pauseTimer() {
    clearInterval(step);
}

function resetTimer() {
    minute = 0;
    second = 0;
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
  }

function gameTimer() {
if ((second += 1) == 60) {
    second = 0;
    minute++;
}
if (minute == 60) {
    minute = 0;
  }

  document.getElementById('minute').innerText = returnData(minute);
  document.getElementById('second').innerText = returnData(second);

  function returnData(input) {
      return input > 9 ? input : `0${input}`;
    }
   
}
//Таймер
let pauseGame = false;
timerButton.addEventListener('click', function() {
    startTimer();
    if (pauseGame) {
        pauseGame = false;
        timerButton.innerText = 'Pause Game';
    } else {
        pauseGame = true;
        timerButton.innerText = "Continue Game";
        pauseTimer();
    }
});


//Счётчик 

let moves = document.createElement('span');
moves.className = 'game__moves';
moves.innerHTML = 'Move: 0';
counter.prepend(moves);

//Сохранение игры
let saveButtons = document.createElement('div');
saveButtons.className = 'buttons__save';
document.body.appendChild(saveButtons);


//Кнопка Новая игра
const saveGameButton = document.createElement('button');
saveGameButton.className = 'button__save';
saveGameButton.innerText = "Save Game";
saveButtons.appendChild(saveGameButton);

const loadGameButton = document.createElement('button');
loadGameButton.className = 'button__load';
loadGameButton.innerText = "Load Game";
saveButtons.appendChild(loadGameButton);



function saveGame() {
//    console.log('saved in local storage');
   localStorage.setItem('arrNumber', JSON.stringify(arrNumber));
   localStorage.setItem('handleClick', JSON.stringify(handleClick));
}

function loadSavedGame() {
    // console.log('loaded from local storage');
    let context = canvas.getContext("2d");
    let cellSize = canvas.width / 4;
   if (localStorage.getItem('arrNumber') !== null) {
    arrNumber = JSON.parse(localStorage.getItem('arrNumber'));
    drawPuzzle();
    }
    if (localStorage.getItem('handleClick') !== null) {
        handleClick = localStorage.getItem('handleClick');
        document.querySelector('.game__moves').innerHTML = `Move: ${handleClick}`
    }

function drawPuzzle() {
    context.fillStyle = "#d6d6d6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    //перерисовываем игру
    for (let i = 0; i < 4; i++) { 
        for (let j = 0; j < 4; j++) { 
            if (arrNumber[i][j] > 0) { 
                if (puzzleView !== null) { 
                    puzzleView(j * cellSize, i * cellSize) 
                }
                if (puzzleNumber !== null) {
                    puzzleNumber();
                    context.fillText(arrNumber[i][j], j * cellSize + cellSize/2, i * cellSize + cellSize /2)
                }
            }
        }
    }
}
   
}
saveGameButton.addEventListener('click', saveGame);
loadGameButton.addEventListener('click', loadSavedGame);

//Рейтинг побед

const topScoreButton = document.createElement('button');
topScoreButton.className = 'button__score';
topScoreButton.innerText = "TOP SCORE";
document.body.appendChild(topScoreButton);

const topScore = document.createElement('div');
topScore.className = 'top-score';
document.body.appendChild(topScore);

const topScoreContent = document.createElement('div');
topScoreContent.className = 'top-score__content';
topScore.appendChild(topScoreContent);

topScoreButton.addEventListener('click', showTopScores);
let tenBestScores = [];


function checkWin() {
    let arrWin = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
    let result = true;
    for (let i = 0; i < arrWin.length; i++) {
        for (let j =0; j < arrWin[0].length; j++) {
            if (arrWin[i][j] !== arrNumber[i][j]) {
               result = false;
            }
        }
    }
    return result;
}



function showTopScores() {
    topScore.style.display = 'block';
    topScoreContent.innerHTML = '';
    if (tenBestScores.length === 0) {
        topScoreContent.innerText = 'No score saved!'
    } else {
        let tableScore = topScoreContent.appendChild(document.createElement('table'))
                    .appendChild(document.createElement('tbody'));
        tableScore.classList.add('score-table');
        let str = '<tr><th>Totale<br/>Score</th><th>Moves</th><th>Time<th></tr>';
        for (let i = 0; i < tenBestScores.length; i++) {
            str += '<tr><td>' + (i+1).toString() + '. ' + '</td>' + 
                        '<td>' + tenBestScores[i][0] + '</td>' + 
                        '<td>' + tenBestScores[i][1] + '</td></tr>';
        }
        tableScore.innerHTML = str;
    }
 }
window.onclick = function(event) {
    if (event.target == topScore) {
        topScore.style.display = 'none';
    }
}

startGame();
