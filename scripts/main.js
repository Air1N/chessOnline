var socket = io();
var UserID = 0;
var tile = [];
var tileSize = 135;
var centerBoardOffset = 420;
var selected = {};
var newSpace = {};
var side = 0;
var uSide = -1;
var hp1 = new Image();
hp1.src = "assets/hp1.png";

var hp2 = new Image();
hp2.src = "assets/hp2.png";

for (var i = 0; i < 8; i++) {
    tile.push([]);
    for (var j = 0; j < 8; j++) {
        tile[i].push(new ue.object(i * tileSize + centerBoardOffset, j * tileSize, tileSize, tileSize, "tile" + i + j));
        tile[i][j].color = "#f0d9b5";

        if ((i - j) % 2) {
            tile[i][j].color = "#b58863";
        }
    }
}

var ki = [
    new ue.object(0, 0, 135, 135, "kingw", "assets/king1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "kingb", "assets/king2.png", 1, 1)
];

var q = [
    new ue.object(0, 0, 135, 135, "queenw", "assets/queen1.png", 2, 2),
    new ue.object(0, 0, 135, 135, "queenb", "assets/queen2.png", 2, 2)
];

var b = [
    new ue.object(0, 0, 135, 135, "bishopw", "assets/bishop1.png", 1, 2),
    new ue.object(0, 0, 135, 135, "bishopw", "assets/bishop1.png", 1, 2),
    new ue.object(0, 0, 135, 135, "bishopb", "assets/bishop2.png", 1, 2),
    new ue.object(0, 0, 135, 135, "bishopb", "assets/bishop2.png", 1, 2)
];

var k = [
    new ue.object(0, 0, 135, 135, "knightw", "assets/knight1.png", 2, 1),
    new ue.object(0, 0, 135, 135, "knightw", "assets/knight1.png", 2, 1),
    new ue.object(0, 0, 135, 135, "knightb", "assets/knight2.png", 2, 1),
    new ue.object(0, 0, 135, 135, "knightb", "assets/knight2.png", 2, 1)
];

var r = [
    new ue.object(0, 0, 135, 135, "rookw", "assets/rook1.png", 2, 2),
    new ue.object(0, 0, 135, 135, "rookw", "assets/rook1.png", 2, 2),
    new ue.object(0, 0, 135, 135, "rookb", "assets/rook2.png", 2, 2),
    new ue.object(0, 0, 135, 135, "rookb", "assets/rook2.png", 2, 2)
];
var p = [
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnw", "assets/pawn1.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1),
    new ue.object(0, 0, 135, 135, "pawnb", "assets/pawn2.png", 1, 1)
];

var pieces = [
    [r[0], k[0], b[0], ki[0], q[0], b[1], k[1], r[1]],
    [p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [p[8], p[9], p[10], p[11], p[12], p[13], p[14], p[15]],
    [r[2], k[2], b[2], ki[1], q[1], b[3], k[3], r[3]]
];

function update() {
    for (var i = 0; i < pieces.length; i++) {
        for (var j = 0; j < pieces[i].length; j++) {
            if (pieces[i][j] !== null) {
                if (uSide == 0) {
                    pieces[i][j].body.x = -pieces[i].indexOf(pieces[i][j]) * 135 + centerBoardOffset + 7 * 135;
                    pieces[i][j].body.y = -pieces.indexOf(pieces[i]) * 135 + 7 * 135;
                } else {
                    pieces[i][j].body.x = pieces[i].indexOf(pieces[i][j]) * 135 + centerBoardOffset;
                    pieces[i][j].body.y = pieces.indexOf(pieces[i]) * 135;
                }
            }
        }
    }
}

function checkJump(fx, fy, tx, ty) {
    var dx = (fx < tx) ? 1 : ((fx == tx) ? 0 : -1);
    var dy = (fy < ty) ? 1 : ((fy == ty) ? 0 : -1);

    var steps = Math.max(Math.abs(fx - tx), Math.abs(fy - ty));

    if (fx == tx || fy == ty || Math.abs(fx - tx) == Math.abs(fy - ty)) {
        for (var i = 1; i < steps; i++) {
            var x = fx + i * dx;
            var y = fy + i * dy;

            if (pieces[y][x] !== null && pieces[y][x] != pieces[fy][fx] && pieces[y][x] != pieces[ty][tx]) {
                return false;
            }
        }
    }

    return true;
}

function checkMove(fx, fy, tx, ty) {
    var pie = pieces[fy][fx];
    var pname = pieces[fy][fx].name.substring(0, pieces[fy][fx].name.length - 1);

    if (pname == "pawn") {
        if (side == 0) {
            if (ty == fy + 1) {
                if (pieces[ty][tx] !== null) {
                    if (fx - tx !== 0) return true;
                } else if (fx - tx == 0) {
                    return true;
                }
            }

            if (ty == fy + 2 && fx - tx == 0 && pie.hasMoved == false && pieces[ty][tx] == null) {
                return true;
            }
        } else {
            if (ty == fy - 1) {
                if (pieces[ty][tx] !== null) {
                    if (fx - tx !== 0) return true;
                } else if (fx - tx == 0) {
                    return true;
                }
            }

            if (ty == fy - 2 && fx - tx == 0 && pie.hasMoved == false && pieces[ty][tx] == null) {
                return true;
            }
        }
    }

    if (pname == "rook") {
        if ((ty - fy) == 0) {
            return true;
        }

        if ((tx - fx) == 0) {
            return true;
        }
    }

    if (pname == "king") {
        if (Math.abs(ty - fy) == 1) {
            return true;
        }

        if (Math.abs(tx - fx) == 1) {
            return true;
        }
    }

    if (pname == "knight") {
        if (Math.abs(fx - tx) == 2 && Math.abs(fy - ty) == 1) {
            return true;
        }

        if (Math.abs(fx - tx) == 1 && Math.abs(fy - ty) == 2) {
            return true;
        }
    }

    if (pname == "bishop") {
        if (Math.abs((ty - fy) / (tx - fx)) == 1) {
            return true;
        }
    }

    if (pname == "queen") {
        if (Math.abs((ty - fy) / (tx - fx)) == 1) {
            return true;
        }

        if ((ty - fy) == 0) {
            return true;
        }

        if ((tx - fx) == 0) {
            return true;
        }
    }

    return false;
}

function movePiece(fx, fy, tx, ty) {
    if (checkMove(fx, fy, tx, ty) && checkJump(fx, fy, tx, ty)) {
        var pie = pieces[fy][fx];

        if (pieces[ty][tx] !== null) {
            pieces[ty][tx].health -= pieces[fy][fx].attack;

            if (pieces[ty][tx].health <= 0) {
                physicsObjects.splice(physicsObjects.indexOf(pieces[ty][tx]), 1);
                pieces[ty][tx] = null;
            }
        }

        if (pieces[ty][tx] === null) {
            pieces[ty][tx] = pieces[fy][fx];
            pieces[fy][fx] = null;
        }

        pie.hasMoved = true;
        side = !side;
    }
}

function render() {
    ctx.clearRect(0, 0, display.width, display.height);

    for (var i = 0; i < physicsObjects.length; i++) {
        if (physicsObjects[i].color !== null) {
            ctx.fillStyle = physicsObjects[i].color;
            ctx.fillRect(physicsObjects[i].body.x, physicsObjects[i].body.y, physicsObjects[i].body.width, physicsObjects[i].body.height);
        } else {
            ctx.save();
            if (physicsObjects[i].sprite.rotation % 360 != 0) {
                ctx.translate(physicsObjects[i].body.x + physicsObjects[i].body.width / 2, physicsObjects[i].body.y + physicsObjects[i].body.height / 2);
                ctx.rotate(physicsObjects[i].sprite.rotation * Math.PI / 180);
                ctx.translate(-(physicsObjects[i].body.x + physicsObjects[i].body.width / 2), -(physicsObjects[i].body.y + physicsObjects[i].body.height / 2));
            }

            if (physicsObjects[i].sprite.animated) {
                ctx.drawImage(physicsObjects[i].sprite, physicsObjects[i].sprite.width * physicsObjects[i].sprite.frame, 0, physicsObjects[i].sprite.width, physicsObjects[i].sprite.height, physicsObjects[i].body.x, physicsObjects[i].body.y, physicsObjects[i].body.width, physicsObjects[i].body.height);
            } else {
                ctx.drawImage(physicsObjects[i].sprite, physicsObjects[i].body.x, physicsObjects[i].body.y, physicsObjects[i].body.width, physicsObjects[i].body.height);
                if (physicsObjects[i].health !== null) ctx.drawImage(eval("hp" + physicsObjects[i].health), physicsObjects[i].body.x, physicsObjects[i].body.y, physicsObjects[i].body.width, physicsObjects[i].body.height);
            }
            ctx.restore();
        }
    }

    for (var i = 0; i < textObjects.length; i++) {
        ctx.font = textObjects[i].font;
        ctx.fillStyle = textObjects[i].color;
        if (textObjects[i].timer > 0) ctx.fillText(textObjects[i].text, textObjects[i].x, textObjects[i].y);
    }
}

function move(fx, fy, tx, ty) {
    socket.emit('move', {
        fx: fx,
        fy: fy,
        tx: tx,
        ty: ty
    });

    console.log(fx + " " + fy)
}

socket.on('move', function(data) {
    movePiece(data.fx, data.fy, data.tx, data.ty);
});

socket.on('userConnect', function(data) {
    console.log(UserID);
    if (UserID == -1) UserID = data.UserID;
    if (uSide == -1) uSide = data.uSide;
    console.log(UserID);
});

socket.on('userDisconnect', function(data) {

});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

setInterval(update, 1000 / 100);
setInterval(render, 1000 / 100);