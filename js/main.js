var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','assets/sprites/background.jpg');
    game.load.image('player','assets/sprites/man.png');
	game.load.audio('music', 'assets/audio/Axwell - Ingrosso - We Come We Rave We Love (Dex Morrison Remix).mp3');
	game.load.image('ball', 'assets/sprites/pencil.png');
    game.load.image('button', 'assets/sprites/button.png');
    game.load.image('close', 'assets/sprites/red.png');
}

var player;
var cursors;
var music;
var button;
var popup;
var tween;

function create() {

    game.world.setBounds(0, 0, 3400, 1000);
    game.add.tileSprite(0, 0, 3400, 1000, 'background');
	
	//music
    game.stage.backgroundColor = '#182d3b';
    game.input.touch.preventDefault = false;
    music = game.add.audio('music');
    music.play();
    game.input.onDown.add(changeVolume, this);
	
	//bitmapData
	game.physics.startSystem(Phaser.Physics.P2JS);
    player = game.add.sprite(100, 900, 'player');
    game.physics.p2.enable(player);
    cursors = game.input.keyboard.createCursorKeys();
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.camera.follow(player);
	
	//add pencil
	emitter = game.add.emitter(game.world.centerX, 100, 200);
    emitter.makeParticles('ball');
    emitter.start(false, 5000, 20);
	
	//button
	button = game.add.button(game.world.centerX - 95, 460, 'button', openWindow, this, 2, 1, 0);
    button.input.useHandCursor = true;
	 //  You can drag the pop-up window around
    popup = game.add.sprite(700, 100, 'background');
    popup.alpha = 0.8;
    popup.anchor.set(0.5);
    popup.inputEnabled = true;
    popup.input.enableDrag();
    //  Position the close button to the top-right of the popup sprite (minus 8px for spacing)
    var pw = (popup.width / 2) - 30;
    var ph = (popup.height / 2) - 8;
    //  And click the close button to close it down again
    var closeButton = game.make.sprite(pw, -ph, 'close');
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;
    closeButton.events.onInputDown.add(closeWindow, this);
    //  Add the "close button" to the popup window image
    popup.addChild(closeButton);
    //  Hide it awaiting a click
    popup.scale.set(0);

}

function update() {
	
	//bitmapData
	player.body.setZeroVelocity();
    if (cursors.up.isDown){
        player.body.moveUp(300)
    }
    else if (cursors.down.isDown){
        player.body.moveDown(300);
    }
    if (cursors.left.isDown){
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown){
        player.body.moveRight(300);
    }
}

function openWindow() {

    if ((tween && tween.isRunning) || popup.scale.x === 1){
        return;
    }
    //  Create a tween that will pop-open the window, but only if it's not already tweening or open
    tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);

}

function closeWindow() {

    if (tween.isRunning || popup.scale.x === 0){
        return;
    }
    //  Create a tween that will close the window, but only if it's not already tweening or closed
    tween = game.add.tween(popup.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In, true);

}

function render() {
	
	//music
	game.debug.soundInfo(music, 20, 32);
}

function changeVolume(pointer) {

    if (pointer.y < 300){
        music.volume += 0.1;
    }
    else{
        music.volume -= 0.1;
    }
}