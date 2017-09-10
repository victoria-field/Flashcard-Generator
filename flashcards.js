var inquirer = require("inquirer");
var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var fs = require("fs");

var drawnCard;
var playedCard;
var count = 0;


function openMenu(){
  inquirer.prompt([
    {
      type: "list",
          message: "\nPlease choose a menu option from the list below?",
          choices: ["Use All", "Random", "Shuffle", "Show All", "Exit"],
          name: "menuOptions"

    }
  ])

}
