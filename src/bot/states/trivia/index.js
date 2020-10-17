const fs = require('fs')
const { join } = require('path')
const { addPoints } = require('../../commands/points')

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

let currentQuestion = 0

function nextQuestion() {
  currentQuestion = (currentQuestion + 1) % questions.length
}

function check(userInput) {
  return userInput.toLowerCase() == questions[currentQuestion].answer.toLowerCase()
}

function getQuestion() {
  return questions[currentQuestion]
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

module.exports = class TriviaState {
  constructor(bot, chat, channels) {
    this.bot = bot
    this.chat = chat
    this.channels = channels
    this.messageHandler = this.messageHandler.bind(this)
    this.question = getQuestion()
    this.chat.sendMessage(channels.random, "**"+this.question.question+"**")
    this.hint = this.question.answer.replace(/([a-zA-Z0-9])/g, "_");
    this.wrongAnswers = 0
    this.resetTimer()
  }
  resetTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
        this.chat.sendMessage(this.channels.random, `The answer was: ${this.question.answer}`)
        nextQuestion()
        this.bot.setState("default")
    }, 20000)
  }
  messageHandler({ channelSlug, message, user }) {
    this.resetTimer()
    const correctAnswer = check(message)
    const author = user.username
    if (correctAnswer) {
      clearTimeout(this.timeout)
      // nice!
      const points = 1
      this.chat.sendMessage(channelSlug, `**${this.question.answer}** is correct! **${author} has been awarded ${points} points.**`)
      addPoints(author, points)
      this.chat.sendMessage(channelSlug, `${questions[currentQuestion].explanation}`)
      nextQuestion()
      this.bot.setState("default")
    } else {
      this.wrongAnswers += 1
      if (this.wrongAnswers % 3 == 0) {
        let idx = []
        for (let i = 0; i < this.hint.length; i++) {
          if (this.hint[i] == "_") {
            idx.push(i)
          }
        }
        if (idx.length > 2) {
          var new_hint_pos = idx[Math.floor(Math.random() * idx.length)];
          this.hint = setCharAt(this.hint, new_hint_pos, this.question.answer.charAt(new_hint_pos))
          const msg_hint = this.hint.split("").join(" ")
          this.hintCount += 1
          this.chat.sendMessage(channelSlug, "```" + msg_hint + "```")
        }
      }
    }
  }
}
