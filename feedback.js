'use strict';

var Alexa = require('alexa-sdk');

var flashcardsDictionary = [
  {
    question: 'How was the food today? Good, Bad or Average?'
  },
  {
    question: 'Next, How was the staff who served you? Good, Bad or Average?'
  },
  {
    question:'Next, How were the beverages? Good, Bad or Average?'
  },
  {
    question:'Next, How was the ambience? Good, Bad, or Average?'
  },
  {
    question:'Finally, How much were you satisfied? Good, Bad or Average?'
  },
];

var DECK_LENGTH = flashcardsDictionary.length;

var handlers = {

  // feedback to initialize
  'LaunchRequest': function() {
    this.attributes.flashcards = {
        'billNumber': 0,
        'feedback': {
          'age' : 0,
          'ambience' : '',
          'food' : '',
          'staff' : '',
          'beverages': '',
          'satisfied' : ''
        },

    };
    this.attributes.currentFlashcardIndex = 0;
    this.response.speak('Welcome to Feedback. First off we would require your bill '+
    'number and age. Reply by saying, My bill number is [your bill number] and, My age is [your age]')
    .listen('Reply by saying, My bill number is [your bill number] and My age is [your age]');
    this.emit(':responseReady');
  },

  // My bill number is {bill} and my age is {age}
  'SetBillAgeIntent': function() {
    this.attributes.flashcards.billNumber = this.event.request.intent.slots.bill.value;
    this.attributes.flashcards.feedback['age'] = this.event.request.intent.slots.age.value;
    // console.log("are we here");
    // console.log(this.attributes.flashcards.billNumber);
    // console.log(this.attributes.flashcards.feedback['age']);
    this.response.speak('Okay, I will ask you some questions' +
    '. Here is your first question. ' +
    AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));

    this.emit(':responseReady');
  },

  // User gives an answer in good average bad
  'AnswerIntent': function() {

    var userAnswer = this.event.request.intent.slots.answer.value;
    var currentFlashcardIndex = this.attributes.currentFlashcardIndex;
    if(currentFlashcardIndex == 0){
      this.attributes.flashcards.feedback['food'] = userAnswer;
      this.attributes.currentFlashcardIndex++;
      this.response.speak(AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }
    else if (currentFlashcardIndex == 1){
      this.attributes.flashcards.feedback['staff'] = userAnswer;
      this.attributes.currentFlashcardIndex++;
      this.response.speak(AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }
    else if (currentFlashcardIndex == 2){
      this.attributes.flashcards.feedback['beverages'] = userAnswer;
      this.attributes.currentFlashcardIndex++;
      this.response.speak(AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }
    else if (currentFlashcardIndex == 3){
      this.attributes.flashcards.feedback['ambience'] = userAnswer;
      this.attributes.currentFlashcardIndex++;
      this.response.speak(AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));

    } else if (currentFlashcardIndex == 4){
      this.attributes.flashcards.feedback['satisfied'] = userAnswer;
      this.attributes.currentFlashcardIndex++;
      this.response.speak(AskQuestion(this.attributes)).listen(AskQuestion(this.attributes));
    }

    this.emit(':responseReady');
  },

  // Stop
  'AMAZON.StopIntent': function() {
    this.response.speak('Ok, let\'s play again soon.');
    this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
    this.response.speak('Ok, let\'s play again soon.');
    this.emit(':responseReady');
  },

  //Explicitly add attributes to dynamoDB
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  },

};

//
var AskQuestion = function(attributes) {
  console.log(attributes.currentFlashcardIndex);
  var currentFlashcardIndex = attributes.currentFlashcardIndex;

  if (currentFlashcardIndex >= flashcardsDictionary.length) {
    return 'thank you for your feedback';
  } else {
    var currentQuestion = flashcardsDictionary[currentFlashcardIndex].question;

    return  currentQuestion;
  }
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context, callback);

  alexa.dynamoDBTableName = 'Feedback';
  alexa.registerHandlers(handlers);
  alexa.execute();
};
