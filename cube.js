var rotateR, rotateRA, rotateB, rotateBA, rotateY, rotateYA, rotateG, rotateGA, rotateO, rotateOA, rotateW, rotateWA;
var array_array;

var cube_array = Array.from({ length: 54 }, (_, i) => i);
const win_condition = [...cube_array].join('');
var side_size, z_distance, z_shift;

const moves = {
    U1: [[0, 45], [3, 46], [6, 47], [9, 36], [12, 37], [15, 38], [27, 33], [28, 30], [29, 27], [30, 34], [32, 28], [33, 35], [34, 32], [35, 29], [36, 6], [37, 3], [38, 0], [45, 15], [46, 12], [47, 9]],
    U2: [[0, 15], [3, 12], [6, 9], [9, 6], [12, 3], [15, 0], [27, 35], [28, 34], [29, 33], [30, 32], [32, 30], [33, 29], [34, 28], [35, 27], [36, 47], [37, 46], [38, 45], [45, 38], [46, 37], [47, 36]],
    U3: [[0, 38], [3, 37], [6, 36], [9, 47], [12, 46], [15, 45], [27, 29], [28, 32], [29, 35], [30, 28], [32, 34], [33, 27], [34, 30], [35, 33], [36, 9], [37, 12], [38, 15], [45, 0], [46, 3], [47, 6]],
    D1: [[2, 44], [5, 43], [8, 42], [11, 53], [14, 52], [17, 51], [18, 20], [19, 23], [20, 26], [21, 19], [23, 25], [24, 18], [25, 21], [26, 24], [42, 11], [43, 14], [44, 17], [51, 2], [52, 5], [53, 8]],
    D2: [[2, 17], [5, 14], [8, 11], [11, 8], [14, 5], [17, 2], [18, 26], [19, 25], [20, 24], [21, 23], [23, 21], [24, 20], [25, 19], [26, 18], [42, 53], [43, 52], [44, 51], [51, 44], [52, 43], [53, 42]],
    D3: [[2, 51], [5, 52], [8, 53], [11, 42], [14, 43], [17, 44], [18, 24], [19, 21], [20, 18], [21, 25], [23, 19], [24, 26], [25, 23], [26, 20], [42, 8], [43, 5], [44, 2], [51, 17], [52, 14], [53, 11]],
    L1: [[9, 15], [10, 12], [11, 9], [12, 16], [14, 10], [15, 17], [16, 14], [17, 11], [20, 38], [23, 41], [26, 44], [29, 47], [32, 50], [35, 53], [38, 35], [41, 32], [44, 29], [47, 26], [50, 23], [53, 20]],
    L2: [[9, 17], [10, 16], [11, 15], [12, 14], [14, 12], [15, 11], [16, 10], [17, 9], [20, 35], [23, 32], [26, 29], [29, 26], [32, 23], [35, 20], [38, 53], [41, 50], [44, 47], [47, 44], [50, 41], [53, 38]],
    L3: [[9, 11], [10, 14], [11, 17], [12, 10], [14, 16], [15, 9], [16, 12], [17, 15], [20, 53], [23, 50], [26, 47], [29, 44], [32, 41], [35, 38], [38, 20], [41, 23], [44, 26], [47, 29], [50, 32], [53, 35]],
    R1: [[0, 2], [1, 5], [2, 8], [3, 1], [5, 7], [6, 0], [7, 3], [8, 6], [18, 51], [21, 48], [24, 45], [27, 42], [30, 39], [33, 36], [36, 18], [39, 21], [42, 24], [45, 27], [48, 30], [51, 33]],
    R2: [[0, 8], [1, 7], [2, 6], [3, 5], [5, 3], [6, 2], [7, 1], [8, 0], [18, 33], [21, 30], [24, 27], [27, 24], [30, 21], [33, 18], [36, 51], [39, 48], [42, 45], [45, 42], [48, 39], [51, 36]],
    R3: [[0, 6], [1, 3], [2, 0], [3, 7], [5, 1], [6, 8], [7, 5], [8, 2], [18, 36], [21, 39], [24, 42], [27, 45], [30, 48], [33, 51], [36, 33], [39, 30], [42, 27], [45, 24], [48, 21], [51, 18]],
    F1: [[6, 24], [7, 25], [8, 26], [15, 33], [16, 34], [17, 35], [24, 17], [25, 16], [26, 15], [33, 8], [34, 7], [35, 6], [45, 51], [46, 48], [47, 45], [48, 52], [50, 46], [51, 53], [52, 50], [53, 47]],
    F2: [[6, 17], [7, 16], [8, 15], [15, 8], [16, 7], [17, 6], [24, 35], [25, 34], [26, 33], [33, 26], [34, 25], [35, 24], [45, 53], [46, 52], [47, 51], [48, 50], [50, 48], [51, 47], [52, 46], [53, 45]],
    F3: [[6, 35], [7, 34], [8, 33], [15, 26], [16, 25], [17, 24], [24, 6], [25, 7], [26, 8], [33, 15], [34, 16], [35, 17], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51]],
    B1: [[0, 29], [1, 28], [2, 27], [9, 20], [10, 19], [11, 18], [18, 0], [19, 1], [20, 2], [27, 9], [28, 10], [29, 11], [36, 38], [37, 41], [38, 44], [39, 37], [41, 43], [42, 36], [43, 39], [44, 42]],
    B2: [[0, 11], [1, 10], [2, 9], [9, 2], [10, 1], [11, 0], [18, 29], [19, 28], [20, 27], [27, 20], [28, 19], [29, 18], [36, 44], [37, 43], [38, 42], [39, 41], [41, 39], [42, 38], [43, 37], [44, 36]],
    B3: [[0, 18], [1, 19], [2, 20], [9, 27], [10, 28], [11, 29], [18, 11], [19, 10], [20, 9], [27, 2], [28, 1], [29, 0], [36, 42], [37, 39], [38, 36], [39, 43], [41, 37], [42, 44], [43, 41], [44, 38]]
};


function init_cube() {

    side_size = 1.5 * block_size;
    side_margin = 0.05 * side_size;
    document.documentElement.style.setProperty('--cube-size', (side_size).toString() + 'px');
    document.documentElement.style.setProperty('--cube-margin', (side_size * 0.05).toString() + 'px');
    z_distance = 5 * side_size;
    z_shift  = 3.5 * side_size;

    rotateR = [{ number: 6, addendum: 'rotateX(90deg)' }, { number: 7, addendum: 'rotateX(90deg)' }, { number: 8, addendum: 'rotateX(90deg)' },
    { number: 15, addendum: 'rotateX(90deg)' }, { number: 16, addendum: 'rotateX(90deg)' }, { number: 17, addendum: 'rotateX(90deg)' },
    { number: 24, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 25, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 26, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 33, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 34, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 35, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }];

    rotateRA = [{ number: 6, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 7, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 8, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 15, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 16, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 17, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 24, addendum: 'rotateX(-90deg)' }, { number: 25, addendum: 'rotateX(-90deg)' }, { number: 26, addendum: 'rotateX(-90deg)' },
    { number: 33, addendum: 'rotateX(-90deg)' }, { number: 34, addendum: 'rotateX(-90deg)' }, { number: 35, addendum: 'rotateX(-90deg)' }];

    rotateB = [{ number: 20, addendum: 'rotateY(90deg)' }, { number: 23, addendum: 'rotateY(90deg)' }, { number: 26, addendum: 'rotateY(90deg)' },
    { number: 29, addendum: 'rotateY(90deg)' }, { number: 32, addendum: 'rotateY(90deg)' }, { number: 35, addendum: 'rotateY(90deg)' },
    { number: 38, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 41, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 44, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 47, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 50, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 53, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }];

    rotateBA = [{ number: 20, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 23, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 26, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 29, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 32, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 35, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 38, addendum: 'rotateY(-90deg)' }, { number: 41, addendum: 'rotateY(-90deg)' }, { number: 44, addendum: 'rotateY(-90deg)' },
    { number: 47, addendum: 'rotateY(-90deg)' }, { number: 50, addendum: 'rotateY(-90deg)' }, { number: 53, addendum: 'rotateY(-90deg)' }];

     rotateY = [{ number: 0, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 3, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 6, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 9, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 12, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 15, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 36, addendum: 'rotateX(-90deg)' }, { number: 37, addendum: 'rotateX(-90deg)' }, { number: 38, addendum: 'rotateX(-90deg)' },
    { number: 45, addendum: 'rotateX(-90deg)' }, { number: 46, addendum: 'rotateX(-90deg)' }, { number: 47, addendum: 'rotateX(-90deg)' }];

    rotateYA = [{ number: 0, addendum: 'rotateY(90deg)' }, { number: 3, addendum: 'rotateY(90deg)' }, { number: 6, addendum: 'rotateY(90deg)' },
    { number: 9, addendum: 'rotateY(90deg)' }, { number: 12, addendum: 'rotateY(90deg)' }, { number: 15, addendum: 'rotateY(90deg)' },
    { number: 36, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 37, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 38, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 45, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 46, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 47, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }];

    rotateG = [{ number: 18, addendum: 'rotateY(90deg)' }, { number: 21, addendum: 'rotateY(90deg)' }, { number: 24, addendum: 'rotateY(90deg)' },
    { number: 27, addendum: 'rotateY(90deg)' }, { number: 30, addendum: 'rotateY(90deg)' }, { number: 33, addendum: 'rotateY(90deg)' },
    { number: 36, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 39, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 42, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 45, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 48, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 51, addendum: 'rotateY(90deg) translateZ(' + z_shift.toString() + 'px)' }];

    rotateGA = [{ number: 18, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 21, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 24, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 27, addendum: 'rotateY(-90deg)  translateZ(' + z_shift.toString() + 'px)' }, { number: 30, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 33, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 36, addendum: 'rotateY(-90deg)' }, { number: 39, addendum: 'rotateY(-90deg)' }, { number: 42, addendum: 'rotateY(-90deg)' },
    { number: 45, addendum: 'rotateY(-90deg)' }, { number: 48, addendum: 'rotateY(-90deg)' }, { number: 51, addendum: 'rotateY(-90deg)' }];

    rotateO = [{ number: 0, addendum: 'rotateX(90deg)' }, { number: 1, addendum: 'rotateX(90deg)' }, { number: 2, addendum: 'rotateX(90deg)' },
    { number: 9, addendum: 'rotateX(90deg)' }, { number: 10, addendum: 'rotateX(90deg)' }, { number: 11, addendum: 'rotateX(90deg)' },
    { number: 18, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 19, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 20, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 27, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 28, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 29, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }];

    rotateOA = [{ number: 0, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 1, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 2, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 9, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 10, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 11, addendum: 'rotateX(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 18, addendum: 'rotateX(-90deg)' }, { number: 19, addendum: 'rotateX(-90deg)' }, { number: 20, addendum: 'rotateX(-90deg)' },
    { number: 27, addendum: 'rotateX(-90deg)' }, { number: 28, addendum: 'rotateX(-90deg)' }, { number: 29, addendum: 'rotateX(-90deg)' }];

    rotateW = [{ number: 2, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 5, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 8, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 11, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 14, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 17, addendum: 'rotateY(-90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 42, addendum: 'rotateX(-90deg)' }, { number: 43, addendum: 'rotateX(-90deg)' }, { number: 44, addendum: 'rotateX(-90deg)' },
    { number: 51, addendum: 'rotateX(-90deg)' }, { number: 52, addendum: 'rotateX(-90deg)' }, { number: 53, addendum: 'rotateX(-90deg)' }];

    rotateWA = [{ number: 2, addendum: 'rotateY(90deg)' }, { number: 5, addendum: 'rotateY(90deg)' }, { number: 8, addendum: 'rotateY(90deg)' },
    { number: 11, addendum: 'rotateY(90deg)' }, { number: 14, addendum: 'rotateY(90deg)' }, { number: 17, addendum: 'rotateY(90deg)' },
    { number: 42, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 43, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 44, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' },
    { number: 51, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 52, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }, { number: 53, addendum: 'rotateX(90deg) translateZ(' + z_shift.toString() + 'px)' }];

    array_array = [rotateG, rotateB, rotateW, rotateY, rotateO, rotateR, rotateGA, rotateBA, rotateWA, rotateYA, rotateOA, rotateRA];

    drawCube();

}

function randomize_cube() {

    //randomize the cube
    const move_list = ['U1', 'U2', 'U3', 'D1', 'D2', 'D3', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'F1', 'F2', 'F3', 'B1', 'B2', 'B3'];
    for (var i = 0; i < 100; i++) {
        const value = Math.floor(Math.random() * 18);
        cube_array = apply_move(cube_array, move_list[value]);
    }

    for (var i = 0; i < 54; i++) {
        var tile = document.getElementById('tile' + i.toString());
        tile.style.backgroundColor = colors[Math.floor(cube_array[i] / 9)];
    }
}

function drawCube() {

    var cube = document.getElementById('D3Cube');

    for (var i = 0; i < 54; i++) {

        const col = i % 3;
        const row = Math.floor(i / 3) % 3;
        const z = (Math.floor(i / 9) % 2) * (1.5 * side_size + z_distance) - z_distance;
        const plane = Math.floor(i / 18) % 3
        var xangle = 0;
        var yangle = 0;
        if (plane > 0) {
            xangle = 90;
        }
        if (plane > 1) {
            yangle = 90;
        }

        var new_tile = document.createElement("div");
        new_tile.id = "tile" + i.toString();
        //new_tile.innerText = i.toString();
        new_tile.style.transformOrigin = (1.5 * side_size - side_margin - side_size * row).toString() + 'px ' + (1.5 * side_size - side_margin - side_size * col).toString() + 'px ' + (-1 * z).toString() + 'px';
        new_tile.style.webkitTransform = 'translateX(' + (side_size * row).toString() + 'px) translateY(' + (side_size * col).toString() + 'px) translateZ(' + z.toString() + 'px) rotatex(' + xangle.toString() + 'deg) rotatey(' + yangle.toString() + 'deg) '
        new_tile.style.backgroundColor = colors[Math.floor(cube_array[i] / 9)];

        cube.appendChild(new_tile);
    }

}

function rotateSide(input, duration) {

    //recolor cube
    for (i = 0; i < 54; i++) {
        document.getElementById('tile' + i.toString()).remove();
    }
    drawCube();

    const face_index = (input % 6) * 9;
    const angle = (90 - 180 * Math.floor(input / 6)).toString();

    //rotate main face
    for (var i = face_index; i < face_index + 9; i++) {
        var tile = document.getElementById("tile" + i.toString());
        if (tile) {
            tile.animate([
                { transform: tile.style.transform },
                { transform: tile.style.transform + 'rotateZ(' + angle + 'deg)' }
            ], {
                duration: duration,
                fill: "forwards",
            });
        }
    }

    //rotate side faces
    for (var i = 0; i < 12; i++) {
        var tile = document.getElementById("tile" + array_array[input][i].number.toString());
        if (tile) {
            tile.animate([
                { transform: tile.style.transform },
                { transform: tile.style.transform + array_array[input][i].addendum }
            ], {
                duration: duration,
                fill: "forwards",
            });
        }
    }

    //change array
    //const array_array = [rotateG, rotateB, rotateW, rotateY, rotateO, rotateR, rotateGA, rotateBA, rotateWA, rotateYA, rotateOA, rotateRA];
    const move_list = ['R3', 'L1', 'D3', 'U1', 'B3', 'F1', 'R1', 'L3', 'D1', 'U3', 'B1', 'F3'];
    cube_array = apply_move(cube_array, move_list[input]);

}

function apply_move(cube, perm) {

    var new_cube = [...cube];
    for (var i = 0; i < 20; i++) {
        new_cube[moves[perm][i][1]] = cube[moves[perm][i][0]];
    }
    return new_cube;

}

function checkGameWon() {

    if (cube_array.join('') === win_condition) {
        console.log('hurray!');
        game_won = true;
    }

}


function write_you_win() {

}
