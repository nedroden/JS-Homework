/**
 * jQuery Memory Game
 *
 * @author      Robert Monden
 * @version     1.0.0
 * @license     BSD
 */

var cards = []
var startingTime = null

var timerId
var timeLeftDisplayId

var selectedCard = -1
var awaitingNextMove = true
var cardsTurned = 0
var pairs = 0

var gameFinished = false

var scores = []
var playingTime = 0

var colorInactive = '#ff0000'
var colorActive = '#008C00'
var colorFound = '#800080'

var placeholder = '*'

function initGame(rows) {
    let board = $('#speelveld')
    let random = getRandomLetter(rows)

    gameFinished = false
    awaitingNextMove = true
    cardsTurned = 0
    pairs = 0

    for (let y = 0; y < rows; y++) {
        let currentRow = '<tr>'
        cards[y] = []

        for (let x = 0; x < rows; x++) {
            let id = y * rows + x
            cards[y][x] = random()
            currentRow += '<td id="card-' + id + '" class="inactive" onclick="onCardClick(\'' + id + '\')">' + placeholder + '</td>'
        }

        board.append(currentRow + '</tr>')
    }
}

function endGame() {
    cards = []
    selectedCard = -1

    stopTimer()
    resetTimeLeftDisplay()

    $('#tijd').text('0')
    $('#gevonden').text(0)
    $('#speelveld').empty()
}

function resetGame(rows) {
    endGame()
    initGame(rows)
}

function setColor(type) {
    switch (type) {
        case 'inactive':
            colorInactive = '#' + $('#valueinactive').val()
            $('.inactive').css('background', colorInactive)
            break
        case 'active':
            colorActive = '#' + $('#valueactive').val()
            $('.active').css('background', colorActive)
            break
        case 'found':
            colorFound = '#' + $('#valuefound').val()
            $('.found').css('background', colorFound)
            break
        default:
            console.log('Something went wrong')
    }
}

function getRandomLetter(rows) {
    let letters = []

    for (let i = 0; i < (rows * rows) / 2; i++) {
        let letter

        // Generates random Latin characters (A-Z, uppercase)
        while (letters.includes(letter = String.fromCharCode(65 + Math.random() * 25 + 1))) {}

        letters.push(letter, letter)
    }

    // Credits go to w3schools: https://www.w3schools.com/js/js_array_sort.asp
    letters.sort((a, b) => 0.5 - Math.random())

    return function() {
        let temp = letters[letters.length - 1]
        letters = letters.splice(0, letters.length - 1)
        return temp
    }
}

function onCardClick(card) {
    if (!awaitingNextMove || card === selectedCard || gameFinished)
        return

    let x = card % cards.length
    let y = Math.floor(card / cards.length)

    if (startingTime === null)
        startTimer()

    $('#card-' + card).addClass('active').text(cards[y][x]).css('background', colorActive)

    if (selectedCard === -1) {
        enableTimeLeftDisplay()
        selectedCard = card
    }
    else
        verifyCardMatch(card)
}

function startTimer() {
    if (timerId !== null)
        stopTimer()

    startingTime = new Date()

    timerId = window.setInterval(function() {
        playingTime = Math.floor((new Date().getTime() - startingTime.getTime()) / 1000)
        $('#tijd').text(playingTime)
    }, 1000)
}

function stopTimer() {
    window.clearInterval(timerId)
    startingTime = null
    timerId = null
}

function enableTimeLeftDisplay() {
    timeLeftDisplayId = window.setInterval(function() {
        let timeLeft = $('#timeLeft')
        timeLeft.width(timeLeft.width() - 1.85)

        if (timeLeft.width() <= 0) {
            resetCurrentCard()
            resetTimeLeftDisplay()
            awaitingNextMove = true
        }
    }, 50)
}

function resetTimeLeftDisplay() {
    window.clearInterval(timeLeftDisplayId)
    $('#timeLeft').width(185)
}

function resetCurrentCard() {
    $('[id^=card-]').each(function() {
        if (!$(this).hasClass('found'))
            $(this).html(placeholder).removeClass('active').css('background', colorInactive)
    })

    selectedCard = -1
}

function verifyCardMatch(card) {
    if (cards[Math.floor(card / cards.length)][card % cards.length] === cards[Math.floor(selectedCard / cards.length)][selectedCard % cards.length]) {
        $('#card-' + card).addClass('found').css('background', colorFound)
        $('#card-' + selectedCard).addClass('found').css('background', colorFound)

        resetCurrentCard()
        resetTimeLeftDisplay()

        pairs++
        $('#gevonden').text(pairs)

        if ((cardsTurned += 2) == cards.length * cards.length) {
            alert('You\'ve won! Total playing time: ' + playingTime + ' seconds')

            let playername;
            while ((playername = prompt('Please enter your name')) == null) {}

            scores.push({
                name: playername,
                time: playingTime
            })

            stopTimer()
            updateStats()
            gameFinished = true
        }
    }
    else
        awaitingNextMove = false
}

function updateStats() {
    let stats = $('#topscores')
    let counter = 0
    let sum = 0

    stats.empty()
    scores.sort((a, b) => a.time - b.time)

    for (let score of scores) {
        if (i < 5)
            stats.append('<li>' + score.name + ' (' + score.time + 's)</li>')

        sum += score.time
    }

    let average = sum / scores.length
    let deviation = average - playingTime
    $('#gemiddeld').text(average + 's (' + (deviation < 0 ? '-' : '+') + Math.abs(deviation)+ 's)')
}

function updatePlaceholder() {
    placeholder = $('#character').val()
    $('.inactive').text(placeholder)
}