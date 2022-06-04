"use strict";

var game = {
    previewPill: [],
    gameArray: [],
    lastPill: [],
    virusCount: 4,
    score: 0,
    pillCount: 0,
    colors: ["blue", "brown", "yellow"],
    pillFall_interval: 0,
    start: function () {
        sessionStorage.setItem('score', this.score);

        this.gameArray = game.arrayCreate()
        this.gameBoard = game.boardCreate()

        this.virusCreate(this.gameArray, this.gameBoard, game.colors)

        var virusCount_split = (game.virusCount).toString().split('')
        var oldVirus = document.querySelector("#virus");
        while (document.querySelector('#virus') != null) {
            oldVirus.remove()
        }
        let dVirus = document.createElement('div');
        dVirus.id = "virus"
        document.body.appendChild(dVirus);
        for (let i = 0; i < virusCount_split.length; i++) {
            var img = document.createElement("img");
            img.src = "img/cyfry/" + virusCount_split[i] + ".png";
            img.style.position = "absolute"
            img.style.top = "352px"
            img.style.left = 608 - (i + 1) * 16 + "px"
            img.style.width = "16px"
            img.style.height = "16px"
            dVirus.appendChild(img);
        }

        if (localStorage.getItem("rekord") != null) {
            var topScore_split = (localStorage.getItem("rekord")).toString().split('')
            let dTopScore = document.createElement('div');
            dTopScore.id = "topStore"
            document.body.appendChild(dTopScore);
            for (let i = 0; i < topScore_split.length; i++) {
                var img = document.createElement("img");
                img.src = "img/cyfry/" + topScore_split[i] + ".png";
                img.style.position = "absolute"
                img.style.top = "96px"
                img.style.left = 176 - (i + 1) * 16 + "px"
                img.style.width = "16px"
                img.style.height = "16px"
                dTopScore.appendChild(img);
            }
        } else {
            let dTopScore = document.createElement('div');
            dTopScore.id = "topStore"
            document.body.appendChild(dTopScore);
            var img = document.createElement("img");
            img.src = "img/cyfry/0.png";
            img.style.position = "absolute"
            img.style.top = "96px"
            img.style.left = 176 - 16 + "px"
            img.style.width = "16px"
            img.style.height = "16px"
            dTopScore.appendChild(img);
        }

        this.pillCreate(this.gameArray, this.gameBoard, game.colors)


    },
    arrayCreate: function () {
        var array = new Array(16);
        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(8);
            for (let j = 0; j < 8; j++) {
                array[i][j] = { type: "empty", color: "none", x: j, y: i };
            }
        }
        return array;
    },
    boardCreate: function () {
        var d
        var board = document.createElement("div")
        board.id = "gameBoard"
        document.body.appendChild(board);
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 16; j++) {
                d = document.createElement("div")
                d.classList.add("gameBoard")
                d.style.position = "absolute"
                //d.style.border = "1px solid red"
                d.style.width = "16px"
                d.style.height = "16px"
                d.style.left = ((i * 16) + (17 * 16) + "px");
                d.style.top = ((j * 16) + (6 * 16) + "px");
                board.appendChild(d);
            }
        }
        return board.querySelectorAll('.gameBoard');
    },
    virusCreate: function (array, board, color) {
        for (let i = 0; i < this.virusCount; i++) {
            var virus = {
                type: "virus",
                color: color[i % 3],
                x: Math.floor(Math.random() * 8),
                y: Math.floor(Math.random() * 6) + 10
            }
            array[virus.y][virus.x] = virus
            //console.log(virus)

            for (let j = 0; j < board.length; j++) {
                if ((board[j].style.left == ((((virus.x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((virus.y * 16) + (7 * 16))) + "px")))) {
                    board[j].style.backgroundImage = 'url( img/viruses/' + virus.color + '.png)';
                }
            }
        }
    },
    pillCreate: function (array, board, color) {
        setTimeout(function () {

            var startPlace = ["left", "right"]

            if (game.previewPill.length == 0) {
                for (let i = 0; i < 2; i++) {

                    var pill = {
                        id: game.pillCount,
                        type: "pill",
                        color: color[Math.floor(Math.random() * 3)],
                        state: 1,
                        place: startPlace[i],
                        x: (3 + i),
                        y: 0,
                    }
                    array[pill.y][pill.x] = pill
                    //console.log(pill)

                    for (let j = 0; j < board.length; j++) {
                        if ((board[j].style.left == ((((pill.x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((pill.y * 16) + (7 * 16))) + "px")))) {
                            board[j].style.backgroundImage = 'url( img/pills/' + pill.color + "_" + pill.place + '.png)';
                        }
                    }
                    game.pillCount++

                }


                for (let i = 0; i < 16; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (game.gameArray[i][j].state == 1) {
                            game.lastPill.push(game.gameArray[i][j])
                        }
                    }
                }

                document.addEventListener("keyup", game.charListener)
            }

            game.pillFall_interval = setInterval(game.pillFall, 300, game.lastPill, array, board);
        }, 800);


    },
    charListener: function (event) {
        game.charEvent(event, game.gameArray, game.gameBoard, game.lastPill);
    },
    charEvent: function (event, array, board, last) {
        if (event.which == 68 || event.which == 39) {
            var error = game.pillCheck("right", last, array, board)
            if (error == 0) {
                this.pillDelete(last, array, board)
                last[0].x++
                last[1].x++
                array[last[0].y][last[0].x] = last[0]
                array[last[1].y][last[1].x] = last[1]
                this.pillAdd(last, array, board)
            }
        } else if (event.which == 65 || event.which == 37) {
            var error = game.pillCheck("left", last, array, board)
            if (error == 0) {
                this.pillDelete(last, array, board)
                last[0].x--
                last[1].x--
                array[last[0].y][last[0].x] = last[0]
                array[last[1].y][last[1].x] = last[1]
                this.pillAdd(last, array, board)
            }
        } else if (event.which == 83 || event.which == 40) {
            clearInterval(game.pillFall_interval);
            document.removeEventListener("keyup", game.charListener)

            this.pillFall_interval = setInterval(this.pillFall, 20, this.lastPill, array, board);

        } else if (event.which == 87 || event.which == 38) {

            if (last[0].place == "left") {
                var error = game.pillCheck("horizontal_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[1].x--
                    last[1].y--
                    last[0].place = "down"
                    last[1].place = "up"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                }
            } else if (last[0].place == "down") {
                var error = game.pillCheck("vertical_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[0].x++
                    last[1].y++
                    last[0].place = "right"
                    last[1].place = "left"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                } else {
                    if (array[last[0].y][last[0].x - 1].type == "empty") {
                        this.pillDelete(last, array, board)
                        last[1].y++
                        last[1].x--
                        last[0].place = "right"
                        last[1].place = "left"
                        array[last[1].y][last[1].x] = last[1]
                        array[last[0].y][last[0].x] = last[0]

                        this.pillAdd(last, array, board)
                    }
                }
            } else if (last[0].place == "right") {
                var error = game.pillCheck("horizontal_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[0].x--
                    last[0].y--
                    last[0].place = "up"
                    last[1].place = "down"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                }
            } else if (last[0].place == "up") {
                var error = game.pillCheck("vertical_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[0].y++
                    last[1].x++
                    last[0].place = "left"
                    last[1].place = "right"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                } else {
                    if (array[last[0].y][last[0].x - 1].type == "empty") {
                        this.pillDelete(last, array, board)
                        last[0].y++
                        last[0].x--
                        last[0].place = "left"
                        last[1].place = "right"
                        array[last[1].y][last[1].x] = last[1]
                        array[last[0].y][last[0].x] = last[0]

                        this.pillAdd(last, array, board)
                    }
                }
            }
        } else if (event.which == 16) {
            if (last[0].place == "left") {
                var error = game.pillCheck("horizontal_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[1].x--
                    last[0].y--
                    last[0].place = "up"
                    last[1].place = "down"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                }
            } else if (last[0].place == "down") {
                var error = game.pillCheck("vertical_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[1].x++
                    last[1].y++
                    last[0].place = "left"
                    last[1].place = "right"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                } else {
                    if (array[last[0].y][last[0].x - 1].type == "empty") {
                        this.pillDelete(last, array, board)
                        last[0].x--
                        last[1].y++
                        last[0].place = "left"
                        last[1].place = "right"
                        array[last[1].y][last[1].x] = last[1]
                        array[last[0].y][last[0].x] = last[0]

                        this.pillAdd(last, array, board)
                    }
                }
            } else if (last[0].place == "right") {
                var error = game.pillCheck("horizontal_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[0].x--
                    last[1].y--
                    last[0].place = "down"
                    last[1].place = "up"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                }
            } else if (last[0].place == "up") {
                var error = game.pillCheck("vertical_rotate", last, array, board)
                if (error == 0) {
                    this.pillDelete(last, array, board)
                    last[0].y++
                    last[0].x++
                    last[0].place = "right"
                    last[1].place = "left"
                    array[last[1].y][last[1].x] = last[1]
                    array[last[0].y][last[0].x] = last[0]

                    this.pillAdd(last, array, board)
                } else {
                    if (array[last[0].y][last[0].x - 1].type == "empty") {
                        this.pillDelete(last, array, board)
                        last[0].y++
                        last[1].x--
                        last[0].place = "right"
                        last[1].place = "left"
                        array[last[1].y][last[1].x] = last[1]
                        array[last[0].y][last[0].x] = last[0]

                        this.pillAdd(last, array, board)
                    }
                }
            }
        }
    },
    pillDelete: function (last, array, board) {
        for (let i = (last.length - 1); i >= 0; i--) {
            for (let j = 0; j < board.length; j++) {
                if ((board[j].style.left == ((((last[i].x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((last[i].y * 16) + (7 * 16))) + "px")))) {
                    board[j].style.backgroundImage = ""
                }
            }
            array[last[i].y][last[i].x] = { type: "empty", color: "none", x: (last[i].x), y: (last[i].y - 1) }
        }
    },
    pillAdd: function (last, array, board) {
        for (let i = 0; i < last.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if ((board[j].style.left == ((((last[i].x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((last[i].y * 16) + (7 * 16))) + "px")))) {
                    board[j].style.backgroundImage = 'url( img/pills/' + last[i].color + "_" + last[i].place + '.png)';
                }
            }
        }
    },
    pillFall: function (last, array, board) {
        if (last.length > 2) {
            console.log(last[0].y)
        }


        var error = game.pillCheck("fall", last, array, board)
        if (error == 0) {
            game.pillDelete(last, array, board)
            for (let i = 0; i < last.length; i++) {
                last[i].y++
            }
            for (let i = 0; i < last.length; i++) {
                array[last[i].y][last[i].x] = last[i]
            }
            game.pillAdd(last, array, board)
        } else {
            document.removeEventListener("keyup", game.charListener)
            for (let i = 0; i < last.length; i++) {
                last[i].state = 0
            }
            game.lastPill = [];
            clearInterval(game.pillFall_interval);
            game.pillBreak(array, board)

        }

    },
    pillCheck: function (what, last, array, board) {
        var error = 0;
        if (what == "fall") {
            for (let i = 0; i < last.length; i++) {
                if (last[i].y == 15) error++
                else if (array[last[i].y + 1][last[i].x].color != "none" && (array[last[i].y + 1][last[i].x].state != 1)) error++

            }
        } else if (what == "left") {
            for (let i = 0; i < last.length; i++) {
                if ((last[i].x - 1) == -1) error++
                else if ((array[last[i].y][last[i].x - 1].type != "empty") && (array[last[i].y][last[i].x - 1].state != 1)) error++
            }
        } else if (what == "right") {
            for (let i = 0; i < last.length; i++) {
                if ((last[i].x + 1) == 8) error++
                else if ((array[last[i].y][last[i].x + 1].type != "empty") && (array[last[i].y][last[i].x + 1].state != 1)) error++
            }
        } else if (what == "horizontal_rotate") {
            if (last[0].x < last[1].x) {
                if ((last[0].y) == 0) error++
                else if (array[last[0].y - 1][last[0].x].type != "empty") error++
            } else {
                if ((last[1].y) == 0) error++
                else if (array[last[1].y - 1][last[1].x].type != "empty") error++
            }
        } else if (what == "vertical_rotate") {
            if (last[0].y > last[1].y) {
                if ((last[0].x) == 7) error++
                else if (array[last[0].y][last[0].x + 1].type != "empty") error++
            } else {
                if ((last[1].x) == 7) error++
                else if (array[last[1].y][last[1].x + 1].type != "empty") error++
            }
        } return error;
    },
    pillBreak: function (array, board) {
        var counter = 1;
        var toBreak = []

        for (let i = 15; i >= 0; i--) {
            counter = 1
            for (let j = 0; j < 7; j++) {
                if (array[i][j].color == array[i][j + 1].color) {
                    counter++
                    if (j == 6) {
                        if (array[i][j].color != "none" && counter >= 4) {
                            for (let k = 0; k < counter; k++) {
                                toBreak.push(array[i][j - k + 1])
                            }

                        }
                    }
                } else {
                    if (array[i][j].color != "none" && counter >= 4) {
                        for (let k = 0; k < counter; k++) {
                            toBreak.push(array[i][j - k])
                        }
                    }
                    counter = 1
                }
            }
        }
        for (let i = 7; i >= 0; i--) {
            counter = 1
            for (let j = 0; j < 15; j++) {
                if (array[j][i].color == array[j + 1][i].color) {
                    counter++
                    if (j == 14) {
                        if (array[j][i].color != "none" && counter >= 4) {
                            for (let k = 0; k < counter; k++) {
                                toBreak.push(array[j - k + 1][i])
                            }
                        }
                    }
                } else {
                    if (array[j][i].color != "none" && counter >= 4) {
                        for (let k = 0; k < counter; k++) {
                            toBreak.push(array[j - k][i])
                        }
                    }
                    counter = 1
                }
            }
        }

        for (let i = 0; i < toBreak.length; i++) {
            if (toBreak[i].type == "virus") {
                game.score += 100;
                this.virusCount--;
                for (let j = 0; j < board.length; j++) {

                    if ((board[j].style.left == ((((toBreak[i].x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((toBreak[i].y * 16) + (7 * 16))) + "px")))) {
                        board[j].style.backgroundImage = 'url( img/viruses/' + toBreak[i].color + '_break.png)';
                    }
                }
            } else if (toBreak[i].type == "pill") {
                for (let j = 0; j < board.length; j++) {
                    if ((board[j].style.left == ((((toBreak[i].x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((toBreak[i].y * 16) + (7 * 16))) + "px")))) {
                        board[j].style.backgroundImage = 'url( img/pills/' + toBreak[i].color + '_break.png)';
                    }
                }
            }
        }

        setTimeout(function () {

            game.pillDelete(toBreak, array, board)

            var pills = [];
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 8; j++) {
                    if (array[i][j].type == "pill")
                        pills.push(array[i][j])
                }
            }

            var pillDots = []
            for (let i = 0; i < toBreak.length; i++) {
                if (toBreak[i].type == "pill") {
                    if (toBreak[i].id % 2 == 0) {
                        for (let j = 0; j < pills.length; j++) {
                            if ((toBreak[i].id + 1) == pills[j].id) {
                                pillDots.push(pills[j])
                            }
                        }
                    } else {
                        for (let j = 0; j < pills.length; j++) {
                            if ((toBreak[i].id - 1) == pills[j].id) {
                                pillDots.push(pills[j])
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < pillDots.length; i++) {
                pillDots[i].place = "dot"
                for (let j = 0; j < board.length; j++) {
                    if ((board[j].style.left == ((((pillDots[i].x * 16) + (18 * 16))) + "px") && (board[j].style.top == ((((pillDots[i].y * 16) + (7 * 16))) + "px")))) {
                        board[j].style.backgroundImage = 'url( img/pills/' + pillDots[i].color + '_dot.png)';
                    }
                }
            }

            pillDots = pillDots.sort((a, b) => (b.y > a.y) ? 1 : (b.y === a.y) ? ((b.y > a.y) ? 1 : -1) : -1)

            //game.pillFall_interval = setInterval(game.pillFall, 100, pillDots, array, board);

            sessionStorage.setItem('score', game.score);

            var score_split = (game.score).toString().split('')
            var oldScore = document.querySelector("#score");
            while (document.querySelector('#score') != null) {
                oldScore.remove()
            }
            let dScore = document.createElement('div');
            dScore.id = "score"
            document.body.appendChild(dScore);
            for (let i = 0; i < score_split.length; i++) {
                var img = document.createElement("img");
                img.src = "img/cyfry/" + score_split[i] + ".png";
                img.style.position = "absolute"
                img.style.top = "144px"
                img.style.left = 176 - (i + 1) * 16 + "px"
                img.style.width = "16px"
                img.style.height = "16px"
                dScore.appendChild(img);
            }

            var virusCount_split = (game.virusCount).toString().split('')
            var oldVirus = document.querySelector("#virus");
            while (document.querySelector('#virus') != null) {
                oldVirus.remove()
            }
            let dVirus = document.createElement('div');
            dVirus.id = "virus"
            document.body.appendChild(dVirus);
            for (let i = 0; i < virusCount_split.length; i++) {
                var img = document.createElement("img");
                img.src = "img/cyfry/" + virusCount_split[i] + ".png";
                img.style.position = "absolute"
                img.style.top = "352px"
                img.style.left = 608 - (i + 1) * 16 + "px"
                img.style.width = "16px"
                img.style.height = "16px"
                dVirus.appendChild(img);
            }

            if (game.virusCount == 0) {
                game.gameOver(array, "win");
            } else if (array[0][3].type == "pill" || array[0][4].type == 'pill') {
                game.gameOver(array, "fail");
            } else {
                console.log(pillDots)
                game.pillCreate(array, board, game.colors)
            }

        }, 300);

    },
    gameOver: function (array, end) {
        clearInterval(game.pillFall_interval);

        let dGameOver = document.createElement('div');
        dGameOver.id = "gameOver"
        document.body.appendChild(dGameOver);
        if (end == "win") {
            var img = document.createElement("img");
            img.src = "img/sc.png";
            img.style.position = "absolute"
            img.style.top = "128px"
            img.style.left = "128px"
            dGameOver.appendChild(img);
            if (localStorage.getItem("rekord") < sessionStorage.getItem("score"))
                localStorage.setItem("rekord", sessionStorage.getItem("score"));

            var topScore_split = (localStorage.getItem("rekord")).toString().split('')
            let dTopScore = document.createElement('div');
            dTopScore.id = "topStore"
            document.body.appendChild(dTopScore);
            for (let i = 0; i < topScore_split.length; i++) {
                var img = document.createElement("img");
                img.src = "img/cyfry/" + topScore_split[i] + ".png";
                img.style.position = "absolute"
                img.style.top = "96px"
                img.style.left = 176 - (i + 1) * 16 + "px"
                img.style.width = "16px"
                img.style.height = "16px"
                dTopScore.appendChild(img);
            }

            setTimeout(function () {
                confirm("Wygrałeś!  Twój wynik to " + sessionStorage.getItem("score") + "\n Chcesz zacząć jeszcze raz? (większa ilość wirusów)");
            }, 3000)

        } else {
            var img = document.createElement("img");
            img.src = "img/go_dr.png";
            img.style.position = "absolute"
            img.style.top = "64px"
            img.style.left = "494px"
            img.style.height = "112px"
            img.style.width = "112px"
            dGameOver.appendChild(img);

            var img = document.createElement("img");
            img.src = "img/go.png";
            img.style.position = "absolute"
            img.style.top = "160px"
            img.style.left = "192px"
            dGameOver.appendChild(img);
            setTimeout(function () {
                confirm("Przegrałeś! Twój wynik to " + sessionStorage.getItem("score") + " \n Chcesz zacząć jeszcze raz?");
            }, 3000)
        }
    }
}

game.start()
