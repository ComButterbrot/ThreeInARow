let config = {

	containerColorBG: "#ffffff",
	contentColorBG: "#ffffff",

    freeSpace: 5,

	countRows: 10,
	countCols: 10,

	offsetBorder: 10,
	borderRadius: 50,
		
	gemSize: 55,
	gemBorderSize: 5,

	imagesCoin: ["images/coin/i1.png", "images/coin/i2.png", "images/coin/i3.png", "images/coin/i4.png", "images/coin/i5.png", "images/coin/i6.png", "images/coin/i7.png", "images/coin/i_g.png"],

	gemClass: "gem-card",
	gemIdPrefix: "gem",
	giftClass: "gift",
	gameStates: ["pick", "switch", "revert", "remove", "refill"],
	gameState: "",
	
	movingItems: 0,

    countGift: 0,
	giftProbability: 1,

	countScore: 0,
	countTotalScore: 0,
	scorePercent: 0,
    
    countLevel: 0,
    currentLimit: 100,

    countdownTimer: "",
    countdownLimitMinutes: 05,
    countdownLimitSeconds: 30
}

let player = {
	selectedRow: -1,
	selectedCol: -1,
	posX: "",
	posY: ""
}

let components = {
	container: document.createElement( "div" ),
	content: document.createElement( "div" ),
	wrapper: document.createElement( "div" ),
	cursor: document.createElement( "div" ),
	gems: new Array(),
}

// start Game
initGame();

// Инициализация всех составляющих игры
function initGame () {
	createPage();
	createContentPage();
	createWrapper();
	createCursor();
	createGrid();
    updateCountdown();

	// Переключаем статус игры на "выбор"
	config.gameState = config.gameStates[ 0 ];
}

// Создание обертки для страницы
function createPage() {
	components.container.style.backgroundColor = config.containerColorBG;
	components.container.style.width = "100%";
	components.container.style.overflow = "hidden";
	components.container.style.display = "flex";
	components.container.style.alignItems = "center";
	components.container.style.justifyContent = "center";

	document.getElementById("gem-game").append( components.container );
}

// Создание обертки с контентом
function createContentPage () {
	components.content.id = "contentPlace";
	components.content.style.position = "absolute";
	components.content.style.width = 	"100%";
	components.content.style.height = 	"100%";
	components.content.style.backgroundColor = config.contentColorBG;
	components.content.style.boxShadow = config.offsetBorder + "px";
	components.content.style.borderRadius = config.gemBorderSize + "px";
	components.content.style.borderSize = config.borderSize + "px";
	components.content.style.boxSizing = "border-box";

	components.container.append( components.content );
}

// Создание обертки для монет и очков
function createWrapper () {
	components.wrapper.style.position = "relative";
	components.wrapper.style.height = "100%";
	components.wrapper.style.display = "flex";
	components.wrapper.style.alignItems = "center";
	components.wrapper.style.justifyContent = "center";
	components.wrapper.addEventListener("click", function(event) { handlerTab(event, event.target) });

	components.content.append( components.wrapper );
}

// Создание курсора для выделения монет
function createCursor () {
	components.cursor.id = "marker";
	components.cursor.style.width = config.gemSize - config.freeSpace + "px";
	components.cursor.style.height = config.gemSize - config.freeSpace + "px";
	components.cursor.style.backgroundColor = "#8DC98D";
	components.cursor.style.borderRadius = "5px";
	components.cursor.style.position = "absolute";
	components.cursor.style.display = "none";

	components.wrapper.append( components.cursor );
}
// Показать курсор
function cursorShow () {
	components.cursor.style.display = "block";
}
// Скрыть курсор
function cursorHide () {
	components.cursor.style.display = "none";
}

// Обновить прогресс уровня
function updateScore () {
  document.getElementById('score').style.background = "linear-gradient(to right, #F7CA1A 0%, #F7CA1A " + config.scorePercent + "%, white " + config.scorePercent + "%, white 100%)";
  updateScoreBarLine();
}

// Обновить очки на странице
function updateScoreBarLine () {
  document.getElementById('scorebar-line').innerHTML = config.countScore + "/" + config.currentLimit;
}

// Добавление очков
function scoreInc ( count ) {
    if ( count == 3 ) {
		count = 5;
	} else if ( count == 4 ) {
		count = 15;
	} else if ( count == 5 ) {
		count = 25;
	} else if ( count >= 6 ) {
		count = 35;
	} else {
	    count = 0;
	}

	config.countScore += count;
	config.countTotalScore += count;
	config.scorePercent = config.countScore/config.currentLimit * 100;
	updateScore();
    levelInc();
}

// Обновить уровень на странице
function updateLevel () {
	document.getElementById('level').innerHTML = config.countLevel;
	let cup = document.createElement("div");
	cup.classList.add("level-cup");
	document.getElementById('level').append(cup);
}

// Повышение уровня
function levelInc ( ) {
    if ( config.countScore >= config.currentLimit ) {
		config.countLevel += 1;
        config.countScore = config.countScore - config.currentLimit;
        config.currentLimit += 50;
        config.scorePercent = config.countScore/config.currentLimit * 100;
        updateScore();
	}
    updateLevel();
    updateResult();
}

function updateCountdown () {
	document.getElementById('countdown').innerHTML = config.countdownLimitMinutes + ":" + config.countdownLimitSeconds;
	config.countdownTimer = countdownStart(config.countdownLimitSeconds + config.countdownLimitMinutes * 60, 'countdown', stopGame);
}

function countdownStart(seconds, container, oncomplete) {
    var startTime, timer, obj, ms = seconds*1000,
        display = document.getElementById(container);
    obj = {};
    obj.resume = function() {
        startTime = new Date().getTime();
        timer = setInterval(obj.step,250); // adjust this number to affect granularity
                            // lower numbers are more accurate, but more CPU-expensive
    };
    obj.pause = function() {
        ms = obj.step();
        clearInterval(timer);
    };
    obj.step = function() {
        let now = Math.max(0,ms-(new Date().getTime()-startTime)),
            m = Math.floor(now/60000), s = Math.floor(now/1000)%60;
        s = (s < 10 ? "0" : "")+s;
        display.innerHTML = m+":"+s;
        if( now == 0) {
            clearInterval(timer);
            obj.resume = function() {};
            if(oncomplete) oncomplete();
        }
        return now;
    };
    obj.resume();
    return obj;
}

function stopGame() {
  let gemCards = document.getElementsByClassName("gem-card");
  for (i = 0; i < gemCards.length; i++) {
    document.getElementsByClassName("gem-card")[i].style.pointerEvents = "none";
  }
  createOverflowBlock();
}

function createOverflowBlock() {
  document.getElementById("over-block").style.display = "flex";
  document.getElementById("real-gift").classList.add("hide");
  promoMenu = document.getElementById("menu_b");
  document.getElementById("continue_b").addEventListener('click', reloadGame);
  updateResult();
  if (promoMenu.classList.contains("hide")) {
    promoMenu.classList.remove("hide");
  }
}

function updateResult() {
  document.getElementById("totalscore_info").innerHTML = "Ты закончил игру, набрав " + config.countTotalScore + " очков!";
  document.getElementById("level_info").innerHTML = "Достигнутый уровень - " + config.countLevel;
  document.getElementById("score_info").innerHTML = "Прогресс до следующего уровня - " + config.countScore + "/" + config.currentLimit;
}

function reloadGame() {
  location.reload();
  return false;
}

function createOverflowGift() {
  config.countdownTimer.pause();
  document.getElementById("over-block").style.display = "flex";
  promoMenu = document.getElementById("menu_g");
  if (promoMenu.classList.contains("hide")) {
    promoMenu.classList.remove("hide");
    document.getElementById("continue_g").addEventListener('click', continueGame);
    document.getElementById("real-gift").classList.remove("hide");
  }
}

function continueGame() {
  document.getElementById("menu_g").classList.add("hide");
  document.getElementById("real-gift").style.animation = "bye 2s linear";
  document.getElementById("over-block").style.display = "none";
  config.countdownTimer.resume();
}

// Создание монеты
function createGem ( t, l, row, col, img, c_class) {
	let coin = document.createElement("div");
	coin.classList.add( config.gemClass );
	coin.classList.add( c_class );
	coin.id = config.gemIdPrefix + '_' + row + '_' + col;
	coin.style.boxSizing = "border-box";
	coin.style.cursor = "pointer";
	coin.style.position = "absolute";
	coin.style.top = t + "px";
	coin.style.left = document.getElementById('contentPlace').clientWidth / 2 - config.gemSize * config.countCols / 2 + l + "px";
	coin.style.width = config.gemSize - config.freeSpace + "px";
	coin.style.height = config.gemSize - config.freeSpace + "px";
	coin.style.borderRadius = config.gemBorderSize + "px";
	coin.style.backgroundImage = "url("+ img +")";
	coin.style.backgroundSize = "100%";
    coin.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 3px 8px";

	components.wrapper.append( coin );
}

// Создание и наполнение сетки для монет
function createGrid() {
	// Создание пустой сетки
	for(i = 0; i < config.countRows; i++) {
		components.gems[i] = new Array();
		for(j = 0; j < config.countCols; j++) {
			components.gems[i][j] = -1;
		}
	}

	// Заполняем сетку
	for( i = 0; i < config.countRows; i++ ) {
		for( j = 0; j < config.countCols; j++ ) {
		    currentClass = "gem-card";
			do{
			    if (config.giftProbability == 1) {
			        if ( i > 2 && i < config.countRows - 2) {
			            gemImageId = Math.floor(Math.random() * 8);
			        }
			        else {
			            gemImageId = Math.floor(Math.random() * 7);
			        }
				    components.gems[i][j] = gemImageId;
				    if (gemImageId == 7) {
				        currentClass = config.giftClass;
				        config.giftProbability = 0;
				        config.countGift++;
				    }
			    }
			    else {
			        gemImageId = Math.floor(Math.random() * 7);
				    components.gems[i][j] = gemImageId;
			    }
			} while( isStreak(i, j) );

			createGem( i * config.gemSize, j * config.gemSize, i, j, config.imagesCoin[ components.gems[i][j] ], currentClass);
		}
	}
}

// Проверка на группу сбора
function isStreak( row, col ) {
	return isVerticalStreak( row, col ) || isHorizontalStreak( row, col );
}
// Проверка на группу сбора по колонкам
function isVerticalStreak( row, col ) {
	let gemValue = components.gems[row][col];
	let streak = 0;
	let tmp = row;

	while(tmp > 0 && components.gems[tmp - 1][col] == gemValue){
		streak++;
		tmp--;
	}

	tmp = row;

	while(tmp < config.countRows - 1 && components.gems[tmp + 1][col] == gemValue){
		streak++;
		tmp++;
	}

	return streak > 1;
}
// Проверка на группу сбора по строкам
function isHorizontalStreak( row, col ) {
	let gemValue = components.gems[row][col];
	let streak = 0;
	let tmp = col;

	while(tmp > 0 && components.gems[row][tmp - 1] == gemValue){
		streak++;
		tmp--;
	}

	tmp = col;

	while(tmp < config.countCols - 1 && components.gems[row][tmp + 1] == gemValue){
		streak++;
		tmp++;
	}

	return streak > 1;
}

// Обработчик клика
function handlerTab ( event, target ) {
	// Если это элемент с классом config.gameClass
	// и
	// Если подходящее состояние игры
	if( target.classList.contains( config.gemClass ) && config.gameStates[ 0 ]) {
		// определить строку и столбец
		let row = parseInt( target.getAttribute( "id" ).split( "_" )[ 1 ] );
		let col =  parseInt( target.getAttribute( "id" ).split( "_" )[ 2 ] );

		// Выделяем гем курсором
		cursorShow();
		components.cursor.style.top = parseInt( target.style.top ) + config.freeSpace + "px";
		components.cursor.style.left = parseInt( target.style.left ) + config.freeSpace + "px";
		if (target.classList.contains(config.giftClass)) {
		    components.cursor.style.backgroundColor = "#FAE37C";
		}
		else {
		    components.cursor.style.backgroundColor = "#8DC98D";
		}

		// Если это первый выбор, то сохраняем выбор
		if( player.selectedRow == -1 ) {
			player.selectedRow = row;
			player.selectedCol = col;
		} else {
			// Если гем находится радом с первым выбором
			// то меняем их местами
			if ( ( Math.abs( player.selectedRow - row ) == 1 && player.selectedCol == col ) ||
				( Math.abs( player.selectedCol - col ) == 1 && player.selectedRow == row ) ){
					cursorHide();

					// После выбора меняем состояние игры
					config.gameState = config.gameStates[1];

					// сохранить позицию второго выбранного гема
					player.posX = col;
					player.posY = row;

					// поменять их местами
					gemSwitch();
			} else {
				// Если второй выбор произошел не рядом,
				// то делаем его первым выбором.
				player.selectedRow = row;
				player.selectedCol = col;
			}
		}
	}
}

// Меняем гемы местами
function gemSwitch () {
	let yOffset = player.selectedRow - player.posY;
	let xOffset = player.selectedCol - player.posX;

	// Метка для гемов, которые нужно двигать
	document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).classList.add("switch");
	document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("dir", "-1");

	document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).classList.add("switch");
	document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("dir", "1");

	// меняем местами гемы
	$( ".switch" ).each( function() {
		config.movingItems++;

		$(this).animate( {
				left: "+=" + xOffset * config.gemSize * $(this).attr("dir"),
				top: "+=" + yOffset * config.gemSize * $(this).attr("dir")
			},
			{
				duration: 250,
				complete: function() {
					//Проверяем доступность данного хода
					checkMoving();
				}
			}
		);

		$(this).removeClass("switch");
	});
	

	// поменять идентификаторы гемов
	document.querySelector("#" + config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("id", "temp");
	document.querySelector("#" + config.gemIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("id", config.gemIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol);
	document.querySelector("#temp").setAttribute("id",  config.gemIdPrefix + "_" + player.posY + "_" + player.posX);

	// поменять гемы в сетке
	let temp = components.gems[player.selectedRow][player.selectedCol];
	components.gems[player.selectedRow][player.selectedCol] = components.gems[player.posY][player.posX];
	components.gems[player.posY][player.posX] = temp;
}

// Проверка перемещенных гемов
function checkMoving () {
	config.movingItems--;

	// Действуем тольпо после всех перемещений
	if( config.movingItems == 0 ) {

		// Действия в зависимости от состояния игры
		switch( config.gameState ) {

			// После передвижения гемов проверяем на появление групп сбора
			case config.gameStates[1]:
			case config.gameStates[2]:
				// проверяем, появились ли группы сбора
				if( !isStreak( player.selectedRow, player.selectedCol ) && !isStreak( player.posY, player.posX ) ) {
					// Если групп сбора нет, нужно отменить совершенное движение
					// а если действие уже отменяется, то вернуться к исходному состоянию ожидания выбора
					if( config.gameState != config.gameStates[2] ){
						config.gameState = config.gameStates[2];
						gemSwitch();
					} else {
						config.gameState = config.gameStates[0];
						player.selectedRow = -1;
						player.selectedCol = -1;
					}
				} else {
					// Если группы сбора есть, нужно их удалить
					config.gameState = config.gameStates[3]

					// Отметим все удаляемые гемы
					if( isStreak( player.selectedRow, player.selectedCol ) ) {
						removeGems( player.selectedRow, player.selectedCol );
					}

					if(isStreak(player.posY, player.posX)) {
						removeGems( player.posY, player.posX );
					}

					// Убираем с поля
					gemFade();
				}
				break;
			// После удаления нужно заполнить пустоту
			case config.gameStates[3]:
				checkFalling();
				break;
			case config.gameStates[4]:
				placeNewGems();
				break;
		}

	}

}

// Отмечаем элементы для удаления и убираем их из сетки
function removeGems( row, col ) {
	let gemValue = components.gems[ row ][ col ];
	let tmp = row;

	document.querySelector( "#" + config.gemIdPrefix + "_" + row + "_" + col ).classList.add( "remove" );
	let countRemoveGem = document.querySelectorAll( ".remove" ).length;

	if ( isVerticalStreak( row, col ) ) {
		while ( tmp > 0 && components.gems[ tmp - 1 ][ col ] == gemValue ) {
			document.querySelector( "#" + config.gemIdPrefix + "_" + ( tmp - 1 ) + "_" + col ).classList.add( "remove" );
			components.gems[ tmp - 1 ][ col ] = -1;
			tmp--;
			countRemoveGem++;
		}

		tmp = row;

		while ( tmp < config.countRows - 1 && components.gems[ tmp + 1 ][ col ] == gemValue ) {
			document.querySelector( "#" + config.gemIdPrefix + "_" + ( tmp + 1 ) + "_" + col ).classList.add( "remove" );
			components.gems[ tmp + 1 ][ col ] = -1;
			tmp++;
			countRemoveGem++;
		}
	}

	if ( isHorizontalStreak( row, col ) ) {
		tmp = col;

		while ( tmp > 0 && components.gems[ row ][ tmp - 1 ] == gemValue ) {
			document.querySelector( "#" + config.gemIdPrefix + "_" + row + "_" + ( tmp - 1 ) ).classList.add( "remove" );
			components.gems[ row ][ tmp - 1 ] = -1;
			tmp--;
			countRemoveGem++;
		}

		tmp = col;

		while( tmp < config.countCols - 1 && components.gems[ row ][ tmp + 1 ] == gemValue ) {
			document.querySelector( "#" + config.gemIdPrefix + "_" + row + "_" + ( tmp + 1 ) ).classList.add( "remove" );
			components.gems[ row ][ tmp + 1 ] = -1;
			tmp++;
			countRemoveGem++;
		}
	}

	components.gems[ row ][ col ] = -1;

	scoreInc( countRemoveGem );
}

// Удаляем гемы
function gemFade() {
	$( ".remove" ).each(function() {
		config.movingItems++;

		$(this).animate( {
				opacity: 0
			},
			{
				duration: 200,
				complete: function() {
					$(this).remove();
					checkMoving();
				}
			}
		);
	});
}

// Заполняем пустоту
function checkFalling() {
	let fellDown = 0;

	for( j = 0; j < config.countCols; j++ ) {
		for( i = config.countRows - 1; i > 0; i-- ) {

			if(components.gems[i][j] == -1 && components.gems[i - 1][j] >= 0) {
				document.querySelector( "#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j ).classList.add( "fall" );
				document.querySelector( "#" + config.gemIdPrefix + "_" + (i - 1) + "_" + j ).setAttribute( "id", config.gemIdPrefix + "_" + i + "_" + j );
				components.gems[ i ][ j ] = components.gems[ i - 1 ][ j ];
				components.gems[ i - 1 ][ j ] = -1;
				fellDown++;
			}

		}
	}

	$( ".fall" ).each( function() {
		config.movingItems++;

		$( this ).animate( {
				top: "+=" + config.gemSize
			},
			{
				duration: 100,
				complete: function() {
					$( this ).removeClass( "fall" );
					checkMoving();
				}
			}
		);
	});

	// Если все элементы передвинули,
	// то сменить состояние игры
	if( fellDown == 0 ){
		config.gameState = config.gameStates[4];
		config.movingItems = 1;
		checkMoving();
	}
}


// Создание новых гемов
function placeNewGems() {
	let gemsPlaced = 0;

	// Поиск мест, в которых необходимо создать гем
	for( i = 0; i < config.countCols; i++ ) {
		if( components.gems[ 0 ][ i ] == -1 ) {
			if (config.giftProbability == 1) {
			    gemImageId = Math.floor(Math.random() * 8);
				components.gems[0][i] = gemImageId;
				if (gemImageId == 7) {
				    currentClass = config.giftClass;
				    config.giftProbability = 0;
				    config.countGift++;
				}
			}
			else {
			    gemImageId = Math.floor(Math.random() * 7);
				components.gems[0][i] = gemImageId;
			}

			createGem( 0, i * config.gemSize, 0, i, config.imagesCoin[ components.gems[ 0 ][ i ] ] );
			gemsPlaced++;
		}
	}

	// Если мы создали гемы, то проверяем необходимость их сдвинуть вниз.
	if( gemsPlaced ) {
		config.gameState = config.gameStates[ 3 ];
		checkFalling();
	} else {
		// Проверка на группы сбора
		let combo = 0

		for ( i = 0; i < config.countRows; i++ ) {
			for ( j = 0; j < config.countCols; j++ ) {

				if ( j <= config.countCols - 3 && components.gems[ i ][ j ] == components.gems[ i ][ j + 1 ] && components.gems[ i ][ j ] == components.gems[ i ][ j + 2 ] ) {
					combo++;
					removeGems( i, j );
				}
				if ( i <= config.countRows - 3 && components.gems[ i ][ j ] == components.gems[ i + 1 ][ j ] && components.gems[ i] [ j ] == components.gems[ i + 2 ][ j ] ) {
					combo++;
					removeGems( i, j );
				}
				if ( i == config.countRows - 1 && components.gems[ i ][ j ] == 7 ) {
					combo++;
					if (config.countGift < 2) {
					    config.giftProbability = 1;
					}
					removeGems( i, j );
					createOverflowGift();
				}
			}
		}

		// удаляем найденные группы сбора
		if( combo > 0 ) {
			config.gameState = config.gameStates[ 3 ];
			gemFade();
		} else { 
			// Запускаем основное состояние игры
			config.gameState = config.gameStates[ 0 ];
			player.selectedRow= -1;
		}
	}
}