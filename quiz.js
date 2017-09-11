var inquirer = require("inquirer");

function Quiz(array){
	console.log(array);
}

module.exports = Quiz;

// copy and pasted from the cloze.js file [INCOMPLETE QUIZ functionality]

// function basicQuiz(basicCards){
// 	if (quizLoop <=10){
// 		console.log("basicCards array is " + basicCards);
// 		inquirer.prompt([{
// 			name: "Q",
// 			message: typeof basicCards[quizLoop]
// 		}]).then(function(answers){
// 			answer = answers.Q;

// 			if (answers.Q === basicCards[quizLoop].back){
// 				console.log("Correct!");
// 				score++;
// 			} else {
// 				console.log("Incorrect!");
// 			}
// 			quizLoop++;
// 		})
// 	}

// }

// function quiz(){
// 	console.log("-----------QUIZ TIME-----------------");
// 	console.log("The is the first question:" + basicCards[0].front);
// 	console.log("This is the answer to question 1" + basicCards[0].back);
// }
