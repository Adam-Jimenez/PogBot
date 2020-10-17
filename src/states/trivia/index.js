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
    const question = getQuestion()
    this.chat.sendMessage(channels.random, "```"+question.question+"```")
    this.hint = question.answer.replace(/([a-zA-Z0-9])/g, "_");
    this.interval = setInterval(() => {
      let idx = []
      for (let i = 0; i < this.hint.length; i++) {
        if (this.hint[i] == "_") {
          idx.push(i)
        }
      }
      if (idx.length <= 1) {
        clearInterval(this.interval)
        this.chat.sendMessage(channels.random, `The answer was: ${question.answer}`)
        nextQuestion()
        this.bot.setState("default")
        return
      }
      var new_hint_pos = idx[Math.floor(Math.random() * idx.length)];
      this.hint = setCharAt(this.hint, new_hint_pos, question.answer.charAt(new_hint_pos))
      const msg_hint = this.hint.split("").join(" ")
      this.chat.sendMessage(channels.random, "```" + msg_hint + "```")
    }, 5000)
  }
  messageHandler(payload) {
    let channel = payload.channelSlug
    let message = payload.message
    let author = payload.user.username
    console.log(`[TRIVIA] ${author}: ${message}`)
    if (author == username) {
      return
    }
    const correctAnswer = check(message)
    if (correctAnswer) {
      clearInterval(this.interval)
      // nice!
      this.chat.sendMessage(channel, `${message} is correct! ${author} has been awarded 0 points.`)
      this.chat.sendMessage(channel, `${questions[currentQuestion].explanation}`)
      nextQuestion()
      this.bot.setState("default")
    }
  }
}
