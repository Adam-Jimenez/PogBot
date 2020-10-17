const fs = require('fs')
const { join } = require('path')

let text = fs.readFileSync(join(__dirname, "./questions.txt"), {encoding:'utf8', flag:'r'})

let entries = text.split("\n\n")

let questions = []
let i = 0
while (i < entries.length) {
  questions.push({
    question: entries[i],
    answer: entries[i+1],
    explanation: entries[i+2]
  })
  i+=3
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

shuffle(questions)

const STATE = {
  IDLE: 0, 
  WAITING_FOR_ANSWER: 1 // we can't start a new question if one is already been asked
}

let current_question = 0
let state = STATE.IDLE

module.exports = function(userInput) { 
  if (state == STATE.IDLE) {
    return questions[current_question].question
  }
}
