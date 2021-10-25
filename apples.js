const colors = ['#a1ed4a', '#4a50ed', '#fff', '#ede84a', '#ed964a', '#ed4a50'];
var apples = new Array(12);
var fail_count = 0;

function spawnApple(index) {

	var is_apple_placed = false;

	while (!is_apple_placed) {

		const positionX = Math.floor(Math.random() * 20);
		const positionY = Math.floor(Math.random() * 20);
		var retry = false;

		//check snake positions
		for (var i = 0; i < snake_array.length; i++) {
			if (positionX === snake_array[i][0] && positionY === snake_array[i][1]) {
				retry = true;
			}
		}

		//check apple positions
		for (var i = 0; i < apples.length; i++) {
			if (apples[i]) { //check apple exists
				if (positionX === apples[i][0] && positionY === apples[i][1]) {
					retry = true
                }
            }
        }

		if (!retry) {
			apples[index] = [positionX, positionY];
			drawApple(index);
			is_apple_placed = true;
		}

	}
}

function drawApple(index) {

	var grid = document.getElementById("grid");
	var new_body = document.createElement("div");
	new_body.id = "apple" + index.toString();
	new_body.className = "apple2";
	if (index < 6) {
		new_body.innerText = "↻";
	} else {
		new_body.innerText = "↺";
	}
	new_body.style.color = colors[index % 6];
	new_body.style.gridColumn = apples[index][0] + 1;
	new_body.style.gridRow = apples[index][1] + 1;
	grid.appendChild(new_body);

}

function highlightApple() {
	
	const move_list = ['R3', 'L1', 'D3', 'U1', 'B3', 'F1', 'R1', 'L3', 'D1', 'U3', 'B1', 'F3'];
	var idx = move_list.indexOf(full_sequence[0]);
	if (idx !== -1) {
		var apple_ele = document.getElementById('apple' + idx.toString());
		apple_ele.style.border = "1px solid white";
	} else {

		//move is X2 so highlight both X1 and X3
		const letters = ['R', 'L', 'D', 'U', 'B', 'F'];
		idx = letters.indexOf(full_sequence[0].substr(0, 1));
		apple_ele = document.getElementById('apple' + idx.toString());
		apple_ele.style.border = "1px solid white";
		apple_ele = document.getElementById('apple' + (idx + 6).toString());
		apple_ele.style.border = "1px solid white"; 

    }
}

function checkSequence(input) {

	const move_list = ['R3', 'L1', 'D3', 'U1', 'B3', 'F1', 'R1', 'L3', 'D1', 'U3', 'B1', 'F3'];

	//if apple matches required move, remove required move from list...
	if (move_list[input] === full_sequence[0]) {
		fail_count = 0;
		full_sequence.shift();
		return
	}

	//if apple is first half of 180 turn, repeat the same apple...
	const letters = ['R', 'L', 'D', 'U', 'B', 'F'];
	if (letters[input % 6] === full_sequence[0].substr(0, 1) && full_sequence[0].substr(1, 1) === '2') {
		fail_count = 0;
		full_sequence[0] = move_list[input];
		return
	}

	//if apple doesn't match, undo the move. If more than 3 apples haven't matched, find a new solution
	fail_count++;
	if (fail_count > 3) {
		init_solver();
		fail_count = 0;
	} else {
		full_sequence.unshift(move_list[(input + 6) % 12]);
	}

}