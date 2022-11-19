// Single Player mode not working
// Ball position doesn't reset - fix this

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

// Redimensionar o canvas
// Resize canvas
function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

resize();

// Variáveis para definição de movimento e pontuação dos jogadores
// Variables for players' movement and score definition
var speed = 0;

var pressedKey = 0;
var releasedKey = 0;
var leftUp = false;
var leftDown = false;
var rightUp = false;
var rightDown = false;
var topLeft = false;
var topRight = false;
var bottomLeft = false;
var bottomRight = false;

var score = [0, 0];
var gols = [0, 0];
var golsDisplay = gols[0] + " / " + gols[1];

var gameOver = true;
var winner = "";
var playerNumber = 0;
var nggyuLoop = false;

var angulo;

var azul = 255;
var vermelho = 255;

var ciclo = 1;

// Definição dos controles
// Controls definition
window.addEventListener("keydown", function keyPressed(event){
	console.log(event.which);
	pressedKey = event.which;
	if(pressedKey==87){
		GoleiroEsquerdo.playerUp = true;
	}
	if(pressedKey==83){
		GoleiroEsquerdo.playerDown = true;
	}
	if(pressedKey==38){
		if(playerNumber==2){
			GoleiroDireito.playerUp = true;
		}
	}
	if(pressedKey==40){
		if(playerNumber==2){
			GoleiroDireito.playerDown = true;
		}
	}
});
window.addEventListener("keyup", function keyReleased(event){
	releasedKey = event.which;
	if(releasedKey==87){
		GoleiroEsquerdo.playerUp = false;
	}
	if(releasedKey==83){
		GoleiroEsquerdo.playerDown = false;
	}
	if(releasedKey==38){
		if(playerNumber==2){
			GoleiroDireito.playerUp = false;
		}
	}
	if(releasedKey==40){
		if(playerNumber==2){
			GoleiroDireito.playerDown = false;
		}
	}
});

// Parâmetros dos jogadores
// Players' parameters
function Goleiro(x, y, hv){
	// Tamanho e posição do jogador
	// Player size and position
	this.playerWidth = window.innerWidth/50;
	this.playerHeight = window.innerHeight/5;
	this.posX = x;
	this.posY = y;
	this.playerCor = "white";

	this.playerUp = false;
	this.playerDown = false;

	// Comando para desenhar o jogador
	// Command to draw player
	this.playerDraw = function(){
		if(hv=="h"){
			this.horiz = this.playerWidth;
			this.verti = this.playerHeight;
		}
		else{
			this.verti = this.playerWidth;
			this.horiz = this.playerHeight;
		}
		
		c.fillStyle = this.playerCor;
		c.fillRect(this.posX, this.posY, this.horiz, this.verti);
	}

	// Atualização de posição de acordo com a entrada
	// Position update according to input
	this.updatePlayer = function(){

		if((this.playerUp==true)&&(this.posY>0)){
			this.posY -= speed;
		}
		if((this.playerDown==true)&&(this.posY+this.playerHeight<window.innerHeight)){
			this.posY += speed;
		}
		this.playerDraw();
		pressedKey = 0;
	}
}

var ballSpeedX = window.innerWidth/75;
var ballSpeedY = window.innerHeight/100;
var baseSpeed = Math.sqrt((Math.pow(ballSpeedX, 2)+(Math.pow(ballSpeedY, 2))));

// Parâmetros da bolinha
// Ball parameters
function Bola(){
	// Tamanho e posição iniciais da bolinha
	// Initial ball size and position
	this.ballX = window.innerWidth/2;
	this.ballY = window.innerHeight/2;
	this.ballR = window.innerHeight/25;
	this.ballCor = "white";

	// Desenhar bolinha
	// Draw ball
	this.ballDraw = function(){
		if(gameOver!=true){
			c.beginPath();
			c.arc(this.ballX, this.ballY, this.ballR, 0, 2*Math.PI);
			c.fillStyle = this.ballCor;
			c.fill();
		}
		
		if(ballY>window.innerHeight/2){
			topo = window.innerHeight/2;
			fundo = canvas.height;
		}
		else{
			topo = window.innerHeight - canvas.height;
			fundo = canvas.height/2;
		}

		/*if(playerNumber==1){
			if(GoleiroDireito.posY<=topo){
				ciclo = 2;
			}
			else if(GoleiroDireito.posY+GoleiroDireito.playerHeight>=fundo){
				ciclo = 1;
			}

			if(GoleiroDireito.posY<topo){
				rightDown = true;
				rightUp = false;
			}
			else if(GoleiroDireito.posY>fundo){
				rightDown = false;
				rightUp = true;
			}
		}*/
	}
	ballDraw();

	// Atualização de posição da bolinha e pontuação dos jogadores
	// Ball position and player score update
	this.updateBall = function(){
		if(((ballY+ballR>=window.innerHeight)&&(ballSpeedY>0))||((ballY<=0)&&(ballSpeedY<0))){
			ballSpeedY *= -1;
		}
		if((ballX+ballR>=window.innerWidth)&&(ballSpeedX>0)){
			ballSpeedX *= -1;
			pontuacao("wallR");
		}
		if(ballX-ballR<=0){
			ballSpeedX *= -1;
			pontuacao("wallL");
		}

		// Hit from left to right
		if((ballX-ballR<=GoleiroEsquerdo.posX+GoleiroEsquerdo.playerWidth)&&(ballX+ballR>=GoleiroEsquerdo.posX)&&(ballY-ballR<=GoleiroEsquerdo.posY+GoleiroEsquerdo.playerHeight)&&(ballY+ballR>=GoleiroEsquerdo.posY)&&(ballSpeedX<0)){
			angulo = (GoleiroEsquerdo.posY+GoleiroEsquerdo.playerHeight/2-ballY)/(GoleiroEsquerdo.playerHeight/2);
			ballSpeedY = -angulo*window.innerHeight/75;
			
			ballSpeedX = Math.sqrt(Math.pow(baseSpeed,2)-Math.pow(Math.abs(ballSpeedY), 2));
			
			pontuacao("pL");
		}
		// Hit from left to left
		else if((ballX+ballR>=GoleiroEsquerdo.posX)&&(ballX<=GoleiroEsquerdo.posX)&&(ballY-ballR<=GoleiroEsquerdo.posY+GoleiroEsquerdo.playerHeight)&&(ballY+ballR>=GoleiroEsquerdo.posY)&&(ballSpeedX>0)){
			angulo = (GoleiroEsquerdo.posY+GoleiroEsquerdo.playerHeight/2-ballY)/(GoleiroEsquerdo.playerHeight/2);
			ballSpeedY = -angulo*window.innerHeight/75;
			
			ballSpeedX = -Math.sqrt(Math.pow(baseSpeed,2)-Math.pow(Math.abs(ballSpeedY), 2));
			
			pontuacao("pL");
		}
		// Hit from right to left
		else if((ballX+ballR>=GoleiroDireito.posX)&&(ballX<=GoleiroDireito.posX+GoleiroDireito.playerWidth)&&(ballY-ballR<=GoleiroDireito.posY+GoleiroDireito.playerHeight)&&(ballY+ballR>=GoleiroDireito.posY)&&(ballSpeedX>0)){
			angulo = (GoleiroDireito.posY+GoleiroDireito.playerHeight/2-ballY)/(GoleiroDireito.playerHeight/2);
			ballSpeedY = -angulo*window.innerHeight/75;
			
			ballSpeedX = -Math.sqrt(Math.pow(baseSpeed,2)-Math.pow(Math.abs(ballSpeedY), 2));
			
			pontuacao("pR");
		}
		// Hit from right to right
		else if((ballX-ballR<=GoleiroDireito.posX+GoleiroDireito.playerWidth)&&(ballX>=GoleiroDireito.posX+GoleiroDireito.playerWidth)&&(ballY-ballR<=GoleiroDireito.posY+GoleiroDireito.playerHeight)&&(ballY+ballR>=GoleiroDireito.posY)&&(ballSpeedX<0)){
			angulo = (GoleiroDireito.posY+GoleiroDireito.playerHeight/2-ballY)/(GoleiroDireito.playerHeight/2);
			ballSpeedY = -angulo*window.innerHeight/75;
			
			ballSpeedX = Math.sqrt(Math.pow(baseSpeed,2)-Math.pow(Math.abs(ballSpeedY), 2));
			
			pontuacao("pR");
		}

		this.ballX += ballSpeedX;
		this.ballY += ballSpeedY;
		ballDraw();
	}
}

// Atualização da pontuação
// Score update
function pontuacao(onde){
	// Parede esquerda
	// Left wall
	if(onde=="wallL"){
		score[1] += 50*Math.pow(10, Math.floor(gols[0]/2));
		gols[1]++;

		if(gols[1]%3==0){
			GoleiroDireito.playerHeight *= 2/3;
		}
	}
	// Parede direita
	// Right wall
	if(onde=="wallR"){
		score[0] += 50*Math.pow(10, Math.floor(gols[1]/2));
		gols[0]++;

		if(gols[0]%3==0){
			GoleiroEsquerdo.playerHeight *= 2/3;
		}
	}
	// Raquete do jogador 2
	// Player 2 bat
	if(onde=="pR"){
		score[1] += Math.pow(10, Math.floor(gols[0]/2));
	}
	// Raquete do jogador 1
	// Player 1 bat
	if(onde=="pL"){
		score[0] += Math.pow(10, Math.floor(gols[0]/2));
	}

	// Definição de fim de jogo e vencedor
	// Game over and winner definition
	if(gols[0]==10){
		winner = "L";
		gameOver = true;
	}
	else if(gols[1]==10){
		winner = "R";
		gameOver = true;
	}

	// Atualização de pontuação, de gols e do placar
	// Score, goal and scoreboard update
	document.getElementById("p1").innerHTML = score[0];
	document.getElementById("p2").innerHTML = score[1];
	golsDisplay = gols[0] + " / " + gols[1];
	document.getElementById("round").innerHTML = golsDisplay;
}

function fimDeJogo(){
	if(winner=="L"){
		document.getElementById("p2").innerHTML = "";
		document.getElementById("round").innerHTML = "PLAYER 1 WIN";
	}
	else if(winner=="R"){
		document.getElementById("p1").innerHTML = "";
		document.getElementById("round").innerHTML = "PLAYER 2 WIN";
	}
	nggyuLoop = true;
	document.getElementById("musiquinha").play();
}

function telaEscrita(inifin){

	c.font = "50px Arial";
	c.fillStyle = "white";
	c.textAlign = "center";

	if(inifin=="I"){
		c.fillText("Press SPACE to play", canvas.width/2, canvas.height*1/2/*1/3*/);
		//c.fillText("Press H to play alone", canvas.width/2, canvas.height*2/3);
	}
	else{
		if(playerNumber==2){
			c.fillText("Press SPACE to play again", canvas.width/2, canvas.height*1/3);
			c.fillText("Press H to play alone", canvas.width/2, canvas.height*2/3);
		}
		else{
			c.fillText("Press SPACE to play against a friend", canvas.width/2, canvas.height*1/3);
			c.fillText("Press H to play alone again", canvas.width/2, canvas.height*2/3);
		}
	}

	window.addEventListener("keypress", function(){
		if(gameOver==true){
			if(event.which==32){
				gameOver = false;
				resetAll();
				playerNumber = 2;
				speed = window.innerHeight/50;
				animate();
			}/*
			else if(event.which==72||event.which==104){
				gameOver = false;
				resetAll();
				playerNumber = 1;
				speed = window.innerHeight/75;
				animate();
			}*/
		}
	});
}

function resetAll(){
	nggyuLoop = false;
	document.getElementById("musiquinha").pause();

	gols = [0, 0];
	score = [0, 0];
	
	GoleiroDireito.playerWidth = window.innerWidth/50;
	GoleiroDireito.playerHeight = window.innerHeight/5;
	GoleiroDireito.posX = canvas.width*9/10 - GoleiroDireito.playerWidth;
	GoleiroDireito.posY = canvas.height/2-GoleiroDireito.playerHeight/2;
	
	GoleiroEsquerdo.playerWidth = window.innerWidth/50;
	GoleiroEsquerdo.playerHeight = window.innerHeight/5;
	GoleiroEsquerdo.posX = canvas.width/10;
	GoleiroEsquerdo.posY = canvas.height/2-GoleiroEsquerdo.playerHeight/2;
}

// Executa animação dos jogadores
// Executes players' animation
function animate(){
	if(gameOver==true){
		fimDeJogo();
		telaEscrita("F");
	}
	else{
		requestAnimationFrame(animate);

		c.clearRect(0, 0, window.innerWidth, window.innerHeight);
		
		GoleiroEsquerdo.updatePlayer();
		GoleiroDireito.updatePlayer();
		updateBall();
	}
}

Bola();
var GoleiroEsquerdo = new Goleiro(canvas.width/10, canvas.height/2-window.innerHeight/10, "h");
var GoleiroDireito = new Goleiro(canvas.width*9/10-window.innerHeight/5, window.innerHeight/5, "h");

telaEscrita("I");