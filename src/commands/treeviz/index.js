const printASCIITree = require('./treeToASCII')

function TreeNode(arr) {
  this.val = arr[0]
  this.left = arr[1]
  this.right = arr[2]
  if (Array.isArray(this.left)) {
    this.left = new TreeNode(this.left)
  }
  if (Array.isArray(this.right)) {
    this.right = new TreeNode(this.right)
  }
}
module.exports = function(userInput) {
  try {
    json = JSON.parse(userInput)
    root = new TreeNode(json)
    return "```\n"+printASCIITree(root)+"```"
  } catch (err) {
    console.error(err)
    return 'Error parsing tree'
  }
}
