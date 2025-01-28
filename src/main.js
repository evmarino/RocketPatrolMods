//Evelyn Marino 
//Rocket Patrol : On the Lookout

//Approx time: 2 days (I worked in sections, not sure how many hours but about 18 maybe)
//Mods included: Implement an alternating two-player mode (5)
//Display the time remaining (in seconds) on the screen (3)
//Implement mouse control for player movement and left mouse click to fire (5)
//Allow the player to control the Rocket after it's fired (1)
//adds time to score once hit (apart of the 5 point tier but i could only do the addition, not the subtraction for now)


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

