var block_size, margin_size, double_margin;
var time_interval = 250;
var origins = ['top', 'left', '-', 'right', 'bottom'];
var snake, direction, snake_array, head;
var new_direction;
var finished_cube = [];
var game_won = true;
var is_paused = false;
var is_crashed = false;

function init() {

    //get width of window...
    reportWindowSize();

    //draw swtich panel...
    drawSwitchPanel();

    //initialize the cube...
    init_cube();

    //set key binds    
    document.onkeydown = keyPushed;

    //add event listener for satnav checkbox
    var checkbox = document.getElementById('satnav');
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            init_solver();
            highlightApple();
        } else {
            //unhighlight all apples
            for (var j = 0; j < apples.length; j++) {
                apple_ele = document.getElementById("apple" + j.toString());
                apple_ele.style.border = '';
            }
        }
    });

    //draw controls
    draw_controls();

}

function reportWindowSize() {

    //block_size is the unit length of the 20x20 grid that makes up the snake game
    //total width of the game is 1 + 20 + 1 17 + 1 =  units of block_size
    //total height of the game is 22 units plush the height of the switch

    if ((window.innerWidth / 40) < (window.innerHeight / 22)) {
        block_size = Math.floor(window.innerWidth / 40);
    } else {
        block_size = Math.floor(window.innerHeight / 22);
    }
    block_size -= (block_size % 5);
    margin_size = 0.2 * block_size;
    double_margin = 0.4 * block_size;

    document.documentElement.style.setProperty('--block-size', (block_size).toString() + 'px');

}

function start_new_game() {

    is_crashed = false;
    game_won = false;

    //remove splash if any
    try {
        document.getElementById('splash').remove();
    } catch {

    }

    //scramble cube
    randomize_cube();

    //initialize snake game
    initSnake();

    //remove apples if restarting...
    while (document.getElementsByClassName('apple2')[0]) {
        document.getElementsByClassName('apple2')[0].remove();
    }

    //spawn apples
    for (var i = 0; i < apples.length; i++) {
        spawnApple(i);
    }

    //solve the cube...
    init_solver();
    if (document.getElementById('satnav').checked) {
        highlightApple();
    }

    //start snake
    moveSnake();
}


function moveSnake() {

    //snake is defined as a series of segments in an array, starting at the tail
    //each segment has a start, length, and direction
    //start is always top-left-most part of the segment

    //delete tail segment if length of 1...
    if (snake[0].length === 1) {
        snake.shift();
    }

    //if change in direction, add new segment to end of snake
    if (direction[0] !== new_direction[0]) {
        const start_col = snake[snake.length - 1].start[0] + (snake[snake.length - 1].length - 1) * Math.floor(0.5 * snake[snake.length - 1].direction[0] + 0.5);
        const start_row = snake[snake.length - 1].start[1] + (snake[snake.length - 1].length - 1) * Math.floor(0.5 * snake[snake.length - 1].direction[1] + 0.5);
        snake.push({ start: [start_col, start_row], length: 1, direction: [new_direction[0], new_direction[1]] });
        direction[0] = new_direction[0];
        direction[1] = new_direction[1];
    }

    //find out if snake has eaten an apple
    var is_apple_eaten = false;
    for (var i = 0; i < apples.length; i++) {
        if (head[0] === apples[i][0] && head[1] === apples[i][1]) {
            is_apple_eaten = true;
            rotateSide(i, 200);

            //unhighlight all apples
            for (var j = 0; j < apples.length; j++) {
                apple_ele = document.getElementById("apple" + j.toString());
                apple_ele.style.border = '';
            }

            //remove eaten apple
            document.getElementById("apple" + i.toString()).remove();
            spawnApple(i);

            if (document.getElementById('satnav').checked) {
                checkSequence(i);
                if (full_sequence.length > 0) {
                    highlightApple();
                }
            }
            checkGameWon();

            if (game_won) {
                spawn_splash('win');
                return
            }

            break;
        }
    }

    //if the snake will crash, do not move the snake
    if (detectCrash()) {
        is_crashed = true;
        console.log("uh");
        setTimeout(function () { spawn_splash('loss') }, (time_interval * double_margin / block_size));
        return;
    }

    if (!is_apple_eaten) {  //leave the tail as is if an apple was eaten
        //reduce the segment of the tail by 1...
        snake[0].length -= 1;
        snake_array.shift();

        //move start of the tail if necessary...
        snake[0].start[0] += Math.floor(0.5 * snake[0].direction[0] + 0.5);
        snake[0].start[1] += Math.floor(0.5 * snake[0].direction[1] + 0.5);
    }

    //increase head length
    snake[snake.length - 1].length += 1;
    snake_array.push([head[0], head[1]]);

    //move head if necessary
    snake[snake.length - 1].start[0] += Math.ceil(0.5 * snake[snake.length - 1].direction[0] - 0.5);
    snake[snake.length - 1].start[1] += Math.ceil(0.5 * snake[snake.length - 1].direction[1] - 0.5);

    //draw segments
    drawSegments();

    //animate head and tail
    if (snake.length === 1 && !is_apple_eaten) {
        animateOneSegment();
    } else {
        if (!is_apple_eaten) {
            animateTail();
        }
        animateHead(snake.length - 1);
    }

    if (!is_paused) {
        setTimeout(function () { moveSnake() }, time_interval);
    }

}


function detectCrash() {

    //find where the head will go next
    const index = snake.length - 1;
    head[0] += snake[index].direction[0];
    head[1] += snake[index].direction[1];

    //stop game if head is going out of bounds
    if (head[0] < 0 || head[0] > 19 || head[1] < 0 || head[1] > 19) {
        animateCrash(margin_size);
        return true
    }

    //stop game is head is moving into the snake itself
    for (var i = 0; i < snake_array.length; i++) {
        if (head[0] === snake_array[i][0] && head[1] === snake_array[i][1]) {
            animateCrash(double_margin);
            return true
        }
    }

    return false

}


function animateCrash(units) {      //units defines how far the snake moves before it crashes

    drawSegments();

    //if one body...
    if (snake.length === 1) {
        var body = document.getElementById("body0");
        body.animate([
            { transform: 'translateX(' + (units * snake[0].direction[0]).toString() + 'px) translateY(' + (units * snake[0].direction[1]).toString() + 'px)' },
        ], {
            duration: (time_interval * units / block_size),
            fill: "forwards",
        });
        return;
    }

    //move head
    const index = snake.length - 1;
    var body = document.getElementById("body" + index.toString());
    body.style.transformOrigin = origins[-1 * snake[index].direction[0] - 2 * snake[index].direction[1] + 2];
    var new_scale = (snake[index].length * block_size - double_margin + units) / (snake[index].length * block_size - double_margin);
    addAnimation(body, 1, new_scale, index, (units / block_size));

    //move tail
    body = document.getElementById("body0");
    body.style.transformOrigin = origins[snake[0].direction[0] + 2 * snake[0].direction[1] + 2];
    new_scale = (snake[0].length * block_size - double_margin - units) / (snake[0].length * block_size - double_margin);
    addAnimation(body, 1, new_scale, 0, (units / block_size));

}


function drawSegments() {

    //remove old segments
    while (document.getElementsByClassName("body")[0]) {
        document.getElementsByClassName("body")[0].remove();
    }

    for (var i = 0; i < snake.length; i++) {

        var grid = document.getElementById("grid");
        var new_body = document.createElement("div");
        new_body.id = "body" + i.toString();
        new_body.className = "body";
        new_body.style.gridColumn = snake[i].start[0] + 1;
        new_body.style.gridRow = snake[i].start[1] + 1;
        if (snake[i].direction[0] !== 0) {
            new_body.style.width = "calc(var(--block-size) * " + snake[i].length.toString() + " - 2 * var(--margin-size))";
        } else {
            new_body.style.height = "calc(var(--block-size) * " + snake[i].length.toString() + " - 2 * var(--margin-size))";
        }
        grid.appendChild(new_body);

    }

}


function animateTail() {

    var body = document.getElementById("body0");
    body.style.transformOrigin = origins[snake[0].direction[0] + 2 * snake[0].direction[1] + 2];
    const scale = ((snake[0].length + 1) * 5 - 2) / (snake[0].length * 5 - 2);
    addAnimation(body, scale, 1, 0, 1);

}

function animateHead(index) {

    var body = document.getElementById("body" + index.toString());
    body.style.transformOrigin = origins[-1 * snake[index].direction[0] - 2 * snake[index].direction[1] + 2];
    const scale = ((snake[index].length - 1) * 5 - 2) / (snake[index].length * 5 - 2);
    addAnimation(body, scale, 1, index, 1);

}

function addAnimation(body, old_scale, new_scale, index, time) {

    if (snake[index].direction[0] !== 0) {

        body.animate([
            { transform: 'scaleX(' + old_scale.toString() + ')' },
            { transform: 'scaleX(' + new_scale.toString() + ')' }
        ], {
            duration: time_interval * time,
            fill: "forwards",
        });

    } else {

        body.animate([
            { transform: 'scaleY(' + old_scale.toString() + ')' },
            { transform: 'scaleY(' + new_scale.toString() + ')' }
        ], {
            duration: time_interval * time,
            fill: "forwards",
        });

    }
}


function animateOneSegment() {

    var body = document.getElementById("body0");
    body.style.transformOrigin = origins[-1 * snake[0].direction[0] - 2 * snake[0].direction[1] + 2];
    body.animate([
        { transform: 'translateX(calc(var(--block-size) * -1 * ' + snake[0].direction[0].toString() + ')) translateY(calc(var(--block-size) * -1 * ' + snake[0].direction[1].toString() + '))' },
        { transform: 'translateX(0px) translateY(0px)' }
    ], {
        duration: time_interval,
        fill: "forwards",
    });

}


function initSnake() {

    snake = [{ start: [0, 0], length: 4, direction: [1, 0] }];
    snake_array = [[0, 0], [1, 0], [2, 0], [3, 0]];
    head = [3, 0];
    direction = [1, 0];
    new_direction = [1, 0];

    drawSegments();

}


function keyPushed(e) {
    if (is_crashed || game_won) {
        if (e.keyCode == "32") {    //space
            start_new_game();
        }
        return
    }

    if (e.keyCode == "65") {    //a
        if (direction[0] === 0) {
            new_direction = [-1, 0];
        }
    }
    if (e.keyCode == "68") {    //d
        if (direction[0] === 0) {
            new_direction = [1, 0];
        }
    }
    if (e.keyCode == "83") {    //s
        if (direction[1] === 0) {
            new_direction = [0, 1];
        }
    }
    if (e.keyCode == "87") {    //w
        if (direction[1] === 0) {
            new_direction = [0, -1];
        }
    }
    if (e.keyCode == "32") {    //space
        if (is_paused) {
            is_paused = false;
            setTimeout(function () { moveSnake() }, time_interval);
        } else {
            is_paused = true;
        }
    }
}

function spawn_splash(input) {

    var grid = document.getElementById("grid");
    var new_splash = document.createElement("div");
    new_splash.id = "splash";
    new_splash.className = "splash_screen";
    if (input === 'win') {
        new_splash.innerText = "You Win!\n(press space to play again)"
    } else {
        new_splash.innerText = "Game Over\n(press space to retry)"
    }
    grid.appendChild(new_splash);

}

function drawSwitchPanel() {

    var switch0 = document.getElementsByClassName('switch')[0];
    switch0.innerHTML = '<input type="checkbox" id="satnav" checked><span class="slider round"></span>';

}

function draw_controls() {

    var grid = document.getElementById("grid");
    var new_splash = document.createElement("div");
    new_splash.id = "splash";
    new_splash.className = "splash_screen";
    new_splash.innerText = "WASD to move\npress space to start/pause"
    grid.appendChild(new_splash);

}