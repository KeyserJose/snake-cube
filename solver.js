var full_sequence;
var our_cube;

const moves_g1 = ['U1', 'U2', 'U3', 'D1', 'D2', 'D3', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'F1', 'F2', 'F3', 'B1', 'B2', 'B3'];
const moves_g2 = ['U1', 'U2', 'U3', 'D1', 'D2', 'D3', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'F2', -1, -1, 'B2', -1, -1];
const moves_g3 = ['U1', 'U2', 'U3', 'D1', 'D2', 'D3', 'L2', -1, -1, 'R2', -1, -1, 'F2', -1, -1, 'B2', -1, -1];
const moves_g4 = ['U2', 'D2', 'L2', 'R2', 'F2', 'B2'];

function init_solver() {

    full_sequence = "";
    our_cube = [...cube_array];

    //phase 1: edge orientation
    var eo_index = get_p1_eo_index(our_cube);
    var sequence = solve_p1_iddfs(eo_index, 7);
    if (sequence) {
        sequence = sequence.split(' ');
        for (var i = 0; i < sequence.length; i++) {
            full_sequence += moves_g1[sequence[i]] + ' ';
            our_cube = apply_move(our_cube, moves_g1[sequence[i]]);
        }
    }


    //phase 2: co & udslice
    var co_index = get_p2_co_index(our_cube);
    var udslice_index = get_p2_udslice_index(our_cube);
    sequence = solve_p2_iddfs(co_index, udslice_index, 10);
    if (sequence) {
        sequence = sequence.split(' ');
        for (var i = 0; i < sequence.length; i++) {
            full_sequence += moves_g2[sequence[i]] + ' ';
            our_cube = apply_move(our_cube, moves_g2[sequence[i]]);
        }
    }

    //phase 3: the rest
    var cp_index = get_p3_cp_index(our_cube);
    var ep_index = get_p3_ep_index(our_cube);
    sequence = solve_p3_iddfs(cp_index, ep_index, 18);
    if (sequence) {
        sequence = sequence.split(' ');
        for (var i = 0; i < sequence.length; i++) {
            full_sequence += moves_g3[sequence[i]] + ' ';
            our_cube = apply_move(our_cube, moves_g3[sequence[i]]);
        }
    }

    //phase 4: half turns
    cp_index = get_p4_cp_index(our_cube);
    ep_index = get_p4_ep_index(our_cube);
    var mlp_index = get_p4_mlp_index(our_cube);
    sequence = solve_p4_iddfs(cp_index, ep_index, mlp_index, 15);
    if (sequence) {
        sequence = sequence.split(' ');
        for (var i = 0; i < sequence.length; i++) {
            full_sequence += moves_g4[sequence[i]] + ' ';
            our_cube = apply_move(our_cube, moves_g4[sequence[i]]);
        }
    }

    console.log(full_sequence);

    //remove repeats
    full_sequence = full_sequence.trim().split(' ');
    for (var i = 1; i < full_sequence.length; i++) {

        var turn0 = [...full_sequence[i - 1]];
        var turn1 = [...full_sequence[i]];

        if (turn0[0] === turn1[0]) {

            var new_number = (parseInt(turn0[1]) + parseInt(turn1[1])) % 4;
            if (new_number === 0) {
                full_sequence.splice(i - 1, 2);
            } else {
                full_sequence.splice(i - 1, 2, turn0[0] + new_number.toString());
            }
        }
    }


}

function get_p1_eo_index(cube) {
    const index_to_check = [30, 34, 32, 28, 21, 25, 23, 19, 48, 50, 41, 39];
    var idx = 0;
    for (var i = 0; i < index_to_check.length - 1; i++) {
        if (!index_to_check.includes(cube[index_to_check[i]])) {
            idx += Math.pow(2, 10 - i);
        }
    }
    return idx;
}

function get_p2_co_index(cube) {

    const faces0 = [33, 35, 29, 27, 24, 26, 20, 18];
    const faces1 = [0, 8, 11, 15, 38, 42, 45, 53];
    var idx = 0;

    for (var i = 0; i < faces0.length - 1; i++) {
        if (faces0.includes(cube[faces0[i]])) {
            continue
        }
        if (faces1.includes(cube[faces0[i]])) {
            idx += Math.pow(3, 6 - i)
            continue
        }
        idx += 2 * Math.pow(3, 6 - i)
    }

    return idx

}

function get_p2_udslice_index(cube) {

    const edges = [30, 34, 32, 28, 21, 25, 23, 19, 48, 50, 41, 39];
    const Os = [1, 7, 10, 16, 39, 41, 48, 50];
    var OX_cube = []

    for (var i = 0; i < edges.length; i++) {
        if (Os.includes(cube[edges[i]])) {
            OX_cube.push('O');
        } else {
            OX_cube.push('X');
        }
    }
    OX_cube = OX_cube.join('');

    return UDSlice_list.indexOf(OX_cube);

}

function get_p3_cp_index(cube) {

    var new_cube = '';
    const locations = [33, 35, 29, 27, 24, 26, 20, 18];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (var i = 0; i < locations.length; i++) {
        for (var j = 0; j < locations.length; j++) {
            if (cube[locations[i]] === locations[j]) {
                new_cube += letters[j];
            }
        }
    }

    sums = new Array(7).fill(0)
    const factorials = [1, 2, 6, 24, 120, 720, 5040];

    for (var i = 1; i < new_cube.length; i++) {
        for (var j = 0; j < i; j++) {
            if (new_cube[j] > new_cube[i]) {
                sums[i - 1]++;
            }
        }
    }

    var idx = sums[0];
    for (var i = 1; i < sums.length; i++) {
        idx += sums[i] * factorials[i];
    }
    return idx;

}

function get_p3_ep_index(cube) {

    var new_cube = '';
    const locations = [3, 46, 12, 37, 5, 52, 14, 43];
    const As = [3, 12, 5, 14];
    for (var i = 0; i < locations.length; i++) {
        if (As.includes(cube[locations[i]])) {
            new_cube += 'A';
        } else {
            new_cube += 'B'
        }
    }

    return ep_list.indexOf(new_cube);

}

function get_p4_cp_index(cube) {

    var new_cube = '';
    const locations = [33, 35, 29, 27, 24, 26, 20, 18];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (var i = 0; i < locations.length; i++) {
        for (var j = 0; j < locations.length; j++) {
            if (cube[locations[i]] === locations[j]) {
                new_cube += letters[j];
            }
        }
    }
    return p4_cp_list.indexOf(new_cube);

}

function get_p4_ep_index(cube) {

    var new_cube = '';
    const locations = [30, 34, 32, 28, 21, 25, 23, 19];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (var i = 0; i < locations.length; i++) {
        for (var j = 0; j < locations.length; j++) {
            if (cube[locations[i]] === locations[j]) {
                new_cube += letters[j];
            }
        }
    }
    return p4_ep_list.indexOf(new_cube);

}

function get_p4_mlp_index(cube) {

    var new_cube = '';
    const locations = [48, 50, 41, 39];
    const letters = ['A', 'B', 'C', 'D'];
    for (var i = 0; i < locations.length; i++) {
        for (var j = 0; j < locations.length; j++) {
            if (cube[locations[i]] === locations[j]) {
                new_cube += letters[j];
            }
        }
    }

    sums = new Array(3).fill(0)
    const factorials = [1, 2, 6];

    for (var i = 1; i < new_cube.length; i++) {
        for (var j = 0; j < i; j++) {
            if (new_cube[j] > new_cube[i]) {
                sums[i - 1]++;
            }
        }
    }

    var idx = sums[0];
    for (var i = 1; i < sums.length; i++) {
        idx += sums[i] * factorials[i];
    }
    return idx;

}

function solve_p1_iddfs(idx_eo, depth_limit) {

    const starting_depth = eo_prune_table[idx_eo];

    for (var depth = starting_depth; depth <= depth_limit; depth++) {
        let solution = solve_phase_1(idx_eo, '', depth);
        if (solution !== null) {
            return solution.trim();
        }
    }
    return null

}

function solve_p2_iddfs(idx_co, idx_ud, depth_limit) {

    const starting_depth = Math.max(co_prune_table[idx_co], udslice_prune_table[idx_ud]);

    for (var depth = starting_depth; depth <= depth_limit; depth++) {
        let solution = solve_phase_2(idx_co, idx_ud, '', depth);
        if (solution !== null) {
            return solution.trim();
        }
    }
    return null

}

function solve_p3_iddfs(idx_cp, idx_ep, depth_limit) {

    const starting_depth = Math.max(cp_prune_table[idx_cp], ep_prune_table[idx_ep]);

    for (var depth = starting_depth; depth <= depth_limit; depth++) {
        let solution = solve_phase_3(idx_cp, idx_ep, '', depth);
        if (solution !== null) {
            return solution.trim();
        }
    }
    return null

}

function solve_p4_iddfs(idx_cp, idx_ep, idx_mlp, depth_limit) {

    const starting_depth = Math.max(p4_cp_prune_table[idx_cp], p4_ep_prune_table[idx_ep], mlp_prune_table[idx_mlp]);

    for (var depth = starting_depth; depth <= depth_limit; depth++) {
        let solution = solve_phase_4(idx_cp, idx_ep, idx_mlp, '', depth);
        if (solution !== null) {
            return solution.trim();
        }
    }
    return null

}

function solve_phase_1(idx_eo, solution, depth_remaining, prev_move) {

    if (idx_eo === 0) {
        return solution
    }

    if (depth_remaining === 0) {
        return null
    }

    if (eo_prune_table[idx_eo] > depth_remaining) {
        return null
    }

    //trim moves
    var move_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    if (prev_move > -1) {
        if (Math.floor(prev_move / 3) % 2 === 1) {
            move_array.splice(6 * Math.floor(prev_move / 6), 6);
        } else {
            move_array.splice(3 * Math.floor(prev_move / 3), 3);
        }
    }

    for (var i = 0; i < move_array.length; i++) {
        //apply first turn
        const next_move = Math.floor(move_array[i] / 3);
        var new_idx_eo = eo_trans_table[idx_eo][next_move];

        if (move_array[i] % 3 > 0) {
            new_idx_eo = eo_trans_table[new_idx_eo][next_move];
        }
        if (move_array[i] % 3 === 2) {
            new_idx_eo = eo_trans_table[new_idx_eo][next_move];
        }

        let result = solve_phase_1(new_idx_eo, solution + move_array[i] + " ", depth_remaining - 1, move_array[i]);
        if (result !== null) {
            return result
        }
    }

    return null;

}

function solve_phase_2(idx_co, idx_ud, solution, depth_remaining, prev_move) {

    if (idx_co === 0 && idx_ud === 0) {
        return solution
    }

    if (depth_remaining === 0) {
        return null
    }

    if (Math.max(co_prune_table[idx_co], udslice_prune_table[idx_ud]) > depth_remaining) {
        return null
    }

    //trim moves
    var move_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, -1, -1, 15, -1, -1];
    if (prev_move > -1) {
        if (Math.floor(prev_move / 3) % 2 === 1) {
            move_array.splice(6 * Math.floor(prev_move / 6), 6);
        } else {
            move_array.splice(3 * Math.floor(prev_move / 3), 3);
        }
    }

    //remove -1s
    for (var i = 0; i < move_array.length; i++) {
        if (move_array[i] === -1) {
            move_array.splice(i, 1);
            i--;
        }
    }

    for (var i = 0; i < move_array.length; i++) {
        //apply first turn
        const next_move = Math.floor(move_array[i] / 3);
        var new_idx_co = co_trans_table[idx_co][next_move];
        var new_idx_ud = udslice_trans_table[idx_ud][next_move];

        if (move_array[i] % 3 > 0) {
            new_idx_co = co_trans_table[new_idx_co][next_move];
            new_idx_ud = udslice_trans_table[new_idx_ud][next_move];

        }
        if (move_array[i] % 3 === 2) {
            new_idx_co = co_trans_table[new_idx_co][next_move];
            new_idx_ud = udslice_trans_table[new_idx_ud][next_move];
        }

        let result = solve_phase_2(new_idx_co, new_idx_ud, solution + move_array[i] + " ", depth_remaining - 1, move_array[i]);
        if (result !== null) {
            return result
        }
    }

    return null;

}

function solve_phase_3(idx_cp, idx_ep, solution, depth_remaining, prev_move) {

    if (cp_prune_table[idx_cp] === 0 && idx_ep === 0) {
        return solution
    }

    if (depth_remaining === 0) {
        return null
    }

    if (Math.max(cp_prune_table[idx_cp], ep_prune_table[idx_ep]) > depth_remaining) {
        return null
    }

    //trim moves
    var move_array = [0, 1, 2, 3, 4, 5, 6, -1, -1, 9, -1, -1, 12, -1, -1, 15, -1, -1];
    if (prev_move > -1) {
        if (Math.floor(prev_move / 3) % 2 === 1) {
            move_array.splice(6 * Math.floor(prev_move / 6), 6);
        } else {
            move_array.splice(3 * Math.floor(prev_move / 3), 3);
        }
    }

    //remove -1s
    for (var i = 0; i < move_array.length; i++) {
        if (move_array[i] === -1) {
            move_array.splice(i, 1);
            i--;
        }
    }

    for (var i = 0; i < move_array.length; i++) {
        //apply first turn
        const next_move = Math.floor(move_array[i] / 3);
        var new_idx_cp = cp_trans_table[idx_cp][next_move];
        var new_idx_ep = ep_trans_table[idx_ep][next_move];

        if (move_array[i] % 3 > 0) {
            new_idx_cp = cp_trans_table[new_idx_cp][next_move];
            new_idx_ep = ep_trans_table[new_idx_ep][next_move];
        }
        if (move_array[i] % 3 === 2) {
            new_idx_cp = cp_trans_table[new_idx_cp][next_move];
            new_idx_ep = ep_trans_table[new_idx_ep][next_move];
        }

        let result = solve_phase_3(new_idx_cp, new_idx_ep, solution + move_array[i] + " ", depth_remaining - 1, move_array[i]);
        if (result !== null) {
            return result
        }
    }

    return null;

}

function solve_phase_4(idx_cp, idx_ep, idx_mlp, solution, depth_remaining, prev_move) {

    if (idx_cp === 0 && idx_ep === 0 && idx_mlp === 0) {
        return solution
    }

    if (depth_remaining === 0) {
        return null
    }

    if (Math.max(p4_cp_prune_table[idx_cp], p4_ep_prune_table[idx_ep], mlp_prune_table[idx_mlp]) > depth_remaining) {
        return null
    }

    //trim moves
    var move_array = [0, 1, 2, 3, 4, 5];
    if (prev_move > -1) {
        if (prev_move % 2 === 1) {
            move_array.splice(2 * Math.floor(prev_move / 2), 2);
        } else {
            move_array.splice(prev_move, 1);
        }
    }

    for (var i = 0; i < move_array.length; i++) {

        var new_idx_cp = p4_cp_trans_table[idx_cp][move_array[i]];
        var new_idx_ep = p4_ep_trans_table[idx_ep][move_array[i]];
        var new_idx_mlp = mlp_trans_table[idx_mlp][move_array[i]];
        let result = solve_phase_4(new_idx_cp, new_idx_ep, new_idx_mlp, solution + move_array[i] + " ", depth_remaining - 1, move_array[i]);
        if (result !== null) {
            return result
        }
    }

    return null;

}