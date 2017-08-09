var mouse = {
    down: {},
    up: {},
    current: {}
};

var activeKeys = [];


function keyEvents() {

}

window.onkeydown = function(e) {
    activeKeys.push(e.keyCode);
    //console.log(e.keyCode);
};

window.onkeyup = function(e) {
    var z = activeKeys.indexOf(e.keyCode);
    toggle = true;

    for (i = activeKeys.length; i > 0; i--) {
        if (z == -1) break;
        activeKeys.splice(z, 1);
        z = activeKeys.indexOf(e.keyCode);
    }

    moving = false;
};

function keyDown(key) {
    if (activeKeys.indexOf(key) > -1) return true;
    return false;
}

window.onmousedown = function(e) {
    mouse.isDown = true;
    mouse.down.x = (e.clientX - display.getBoundingClientRect().left) * (display.width / display.clientWidth);
    mouse.down.y = (e.clientY - display.getBoundingClientRect().top) * (display.height / display.clientHeight);


    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (mouse.down.x > i * 135 + centerBoardOffset && mouse.down.x < i * 135 + 135 + centerBoardOffset && mouse.down.y > j * 135 && mouse.down.y < j * 135 + 135) {
                newSpace = {
                    x: i,
                    y: j
                };

                if (pieces[j][i] !== null && ((side == 1 && pieces[j][i].name[pieces[j][i].name.length - 1] == "b") || (side == 0 && pieces[j][i].name[pieces[j][i].name.length - 1] == "w"))) {
                    selected = {
                        x: i,
                        y: j,
                        name: pieces[j][i].name
                    };
                }
            }
        }
    }

    if (selected.name !== null) {
        if (selected.x != newSpace.x || selected.y != newSpace.y) {
            movePiece(selected.x, selected.y, newSpace.x, newSpace.y);
            move(selected.x, selected.y, newSpace.x, newSpace.y);
            selected.name = null;
        }
    }
};

window.onmouseup = function(e) {
    mouse.isDown = false;
    mouse.up.x = (e.clientX - display.getBoundingClientRect().left) * (display.width / display.clientWidth);
    mouse.up.y = (e.clientY - display.getBoundingClientRect().top) * (display.height / display.clientHeight);
};

window.onmousemove = function(e) {
    mouse.current.x = (e.clientX - display.getBoundingClientRect().left) * (display.width / display.clientWidth);
    mouse.current.y = (e.clientY - display.getBoundingClientRect().top) * (display.height / display.clientHeight);
};

Array.prototype.getLast = function() {
    return this[this.length - 1];
};
