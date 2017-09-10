var inquirer = require("inquirer");
var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var fs = require("fs");
var library = require("./cardLibrary.json");

var drawnCard;
var playedCard;
var count = 0;


function openMenu(){
  inquirer.prompt([
    {
      type: "list",
          message: "\nPlease choose a menu option from the list below?",
          choices: ["Create","Use All", "Random", "Shuffle", "Show All", "Exit"],
          name: "menuOptions"

    }
  ]).then(function (answer) {
    var waitMsg;

    switch (answer.menuOptions) {

        case 'Create':
          console.log("unleash your creativity...");
          waitMsg = setTimeout(askQuestions, 1000);
          break;

        case 'Use All':
            console.log("OK lets run through the deck...");
            waitMsg = setTimeout(askQuestions, 1000);
            break;

        case 'Random':
            console.log("Randomizing commenced...");
            waitMsg = setTimeout(randomCard, 1000);
            break;

        case 'Shuffle':
            console.log("I am shuffling the cards as we speak...");
            waitMsg = setTimeout(shuffleDeck, 1000);
            break;

        case 'Show All':
            console.log("Your wish is my command...");
            waitMsg = setTimeout(showCards, 1000);
            break;

        case 'Exit':
            console.log("See you next time")
            return;
            break;

        default:
            console.log("");
            console.log("Sorry I don't understand");
            console.log("");
    }
  })
}

openMenu();

// user create card
function createCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "What type of flashcard do you want to create?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }

    ]).then(function (appData) {

        var cardType = appData.cardType;
        console.log(cardType);

        if (cardType === "Basic Card") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please fill out the front of your card (Your Question).",
                    name: "front"
                },

                {
                    type: "input",
                    message: "Please fill out the back of your card (Your Answer).",
                    name: "back"
                }

            ]).then(function (cardData) {

                var cardObj = {
                    type: "BasicCard",
                    front: cardData.front,
                    back: cardData.back
                };
                library.push(cardObj);
                fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (appData) {
                    if (appData.anotherCard === "Yes") {
                        createCard();
                    } else {
                        setTimeout(openMenu, 1000);
                    }
                });
            });

        } else {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please type out the full text of your statement (remove cloze in next step).",
                    name: "text"
                },

                {
                    type: "input",
                    message: "Please type the portion of text you want to cloze, replacing it with '...'.",
                    name: "cloze"
                }

            ]).then(function (cardData) {

                var cardObj = {
                    type: "ClozeCard",
                    text: cardData.text,
                    cloze: cardData.cloze
                };
                if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
                    library.push(cardObj);
                    fs.writeFile("cardLibrary.json", JSON.stringify(library, null, 2));
                } else {
                    console.log("Sorry, The cloze must match some word(s) in the text of your statement.");

                }
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (appData) {
                    if (appData.anotherCard === "Yes") {
                        createCard();
                    } else {
                        setTimeout(openMenu, 1000);
                    }
                });
            });
        }

    });
};
//function used to get the question from the drawnCard in the askQuestions function
function getQuestion(card) {
    if (card.type === "BasicCard") {						//If the cards type is "BasicCard" then....
        drawnCard = new BasicCard(card.front, card.back);	//drawnCard becomes a new instance of BasicCard constuctor with its front and back passed in
        return drawnCard.front;								//Return the front of the card (the questions side)
    } else if (card.type === "ClozeCard") {					//If the card type is "Cloze Card" then...
        drawnCard = new ClozeCard(card.text, card.cloze)	//drawnCard becomes a new instance of ClozeCard constuctor with its text and cloze passed in
        return drawnCard.clozeRemoved();					//Return the ClozeCard prototpe method clozeRemoved to show the question missing the cloze
    }
};

//function to ask questions from all stored card in the library
function askQuestions() {
    if (count < library.length) {					//if current count (starts at 0) is less than the number of cards in the library....
        playedCard = getQuestion(library[count]);	//playedCard stores the question from the card with index equal to the current counter.
        inquirer.prompt([							//inquirer used to ask the question from the playedCard.
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					//once the user answers
        	//if the users answer equals .back or .cloze of the playedCard run a message "You are correct."
            if (answer.question === library[count].back || answer.question === library[count].cloze) {
                console.log("You are correct.");
            } else {
            	//check to see if current card is Cloze or Basic
                if (drawnCard.front !== undefined) { //if card has a front then it is a Basic card
                    console.log("Sorry, the correct answer was ") + library[count].back + "."; //grabs & shows correct answer
                } else { // otherwise it is a Cloze card
                    console.log("Sorry, the correct answer was ") + library[count].cloze + ".";//grabs & shows correct answer
                }
            }
            count++; 		//increase the counter for the next run through
            askQuestions(); //recursion. call the function within the function to keep it running. It will stop when counter=library.length
        });
    } else {
      	count=0;			//reset counter to 0 once loop ends
      	openMenu();			//call the menu for the user to continue using the app
    }
};

function shuffleDeck() {
  newDeck = library.slice(0); //copy the flashcards into a new array
  for (var i = library.length - 1; i > 0; i--) { //this algorithm (Fisher-Yates shuffle) should jumble up the order of the copied array

      var getIndex = Math.floor(Math.random() * (i + 1));
      var shuffled = newDeck[getIndex];

      newDeck[getIndex] = newDeck[i];

      newDeck[i] = shuffled;
  }
  fs.writeFile("cardLibrary.json", JSON.stringify(newDeck, null, 2)); //write the new randomized array over the old one
  console.log("The deck of flashcards have been shuffled");
  //setTimeout(openMenu, 1000);  //*** shuffle only works on app reload, look into how to apply it in-app
}

//function to ask question from a random card
function randomCard() {
  var randomNumber = Math.floor(Math.random() * (library.length - 1));  // get a random index number within the length of the current library

  playedCard = getQuestion(library[randomNumber]);	//playedCard stores the question from the card with index equal to the randomNumber.
        inquirer.prompt([							//inquirer used to ask the question from the playedCard.
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					//once the user answers
        	//if the users answer equals .back or .cloze of the playedCard run a message "You are correct."
            if (answer.question === library[randomNumber].back || answer.question === library[randomNumber].cloze) {
                console.log("You are correct.");
                setTimeout(openMenu, 1000);
            } else {
            	//check to see if rando card is Cloze or Basic
                if (drawnCard.front !== undefined) { //if card has a front then it is a Basic card
                    console.log("Sorry, the correct answer was ") + library[randomNumber].back + "."; //grabs & shows correct answer
                    setTimeout(openMenu, 1000);
                } else { // otherwise it is a Cloze card
                    console.log("Sorry, the correct answer was ") + library[randomNumber].cloze + ".";//grabs & shows correct answer
                    setTimeout(openMenu, 1000);
                }
            }
        });

};

//function to print all cards on screen for user to read through
function showCards () {

  var library = require("./cardLibrary.json");

  if (count < library.length) {                     //if counter stays below the length of the library array
    //currentCard = getQuestion(library[count]);      //currentCard variable becomes

    if (library[count].front !== undefined) { //if card has a front then it is a Basic card
        console.log("");
        console.log("++++++++++++++++++ Basic Card ++++++++++++++++++");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("Front: " + library[count].front); //grabs & shows card question
        console.log("------------------------------------------------");
        console.log("Back: " + library[count].back + "."); //grabs & shows card question
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("");

    } else { // otherwise it is a Cloze card
        console.log("");
        console.log("++++++++++++++++++ Cloze Card ++++++++++++++++++");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("Text: " + library[count].text); //grabs & shows card question
        console.log("------------------------------------------------");
        console.log("Cloze: " + library[count].cloze + "."); //grabs & shows card question
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("");
    }
    count++;		//increase the counter each round
    showCards();	//re-call the function with in itself. recursion.
  } else {
    count=0;		//reset counter to 0 once loop ends
    openMenu();		//call the menu for the user to continue using the app
  }
}
