'use strict';

var Alexa = require('alexa-sdk');

var flashcardsDictionary = [
  {
    question: 'Which is the most popular sport? Option A. Cricket, Option B. soccer, Option C. Tennis, Option D. Badminton',
    basketballAnswer: 'soccer',
    tennisAnswer: 'soccer',
    cricketAnswer: 'soccer',
    soccerAnswer: 'soccer'
  },
  {
    question: 'How many players are there in a team Option A. 11, Option B. 5, Option C. 6, Option D. 2',
    basketballAnswer: '5',
    tennisAnswer: '2',
    cricketAnswer: '11',
    soccerAnswer: '11'
  },
  {
    question:'Who is the best in the world right now? Option A. LeBron James, Option B. Rafael Nadal, Option C. Virat Kohli, Option D. Cristiano Ronaldo',
    basketballAnswer: 'LeBron James',
    tennisAnswer: 'Rafael Nadal',
    cricketAnswer: 'Virat Kohli',
    soccerAnswer: 'Cristiano Ronaldo'
  },
  {
    question:'When is the next World cup? Option A. No world cup in this sport, Option B. 2019, Option C. 2018',
    basketballAnswer: 'No world cup in this sport',
    tennisAnswer: 'No world cup in this sport',
    cricketAnswer: '2019',
    soccerAnswer: '2018'
  },
  {
    question:'Who are the favorites to win the next world cup? Option A. No world cup in this sport, Option B. India, Option C. Spain, Option D. Germany, Option E. Brazil, Option F. Australia, Option G. USA',
    basketballAnswer: 'No world cup in this sport',
    tennisAnswer: 'No world cup in this sport',
    cricketAnswer: 'India',
    soccerAnswer: 'Brazil'
  },
];

var DECK_LENGTH = flashcardsDictionary.length;

var handlers = {

  // Trivia Sports to initiate the skill
  'LaunchRequest': function() {

    if (Object.keys(this.attributes).length === 0){
      this.attributes.flashcards = {
        'currentSport': '',
        'sport': {
          'basketball':{
            'numberCorrect': 0,
            'currentFlashcardIndex': 0,
            'score': 0
          },
          'cricket':{
            'numberCorrect': 0,
            'currentFlashcardIndex': 0,
            'score': 0
          },
          'soccer':{
            'numberCorrect': 0,
            'currentFlashcardIndex': 0,
            'score': 0
          },
          'tennis':{
            'numberCorrect': 0,
            'currentFlashcardIndex': 0,
            'score': 0
          },
        }
      };
      this.response
      .speak('Welcome to Sports trivia. In this session, do you want to test' +
      ' your knowledge in Sports?')
      .listen('Which sport would you like to test your knowledge in from basketball, cricket, soccer, and tennis?');
    }
    else {
      var currentSport = this.attributes.flashcards.currentSport;
      var numberCorrect = this.attributes.flashcards.sport[currentSport].numberCorrect;
      var currentFlashcardIndex = this.attributes.flashcards.sport[currentSport].currentFlashcardIndex;
      var currentScore = this.attributes.flashcards.sport[currentSport].score;

      this.response
      .speak('Welcome back to Sports Trivia. You are currently working on '
              + currentSport + '. You\'re on question ' + currentFlashcardIndex
              + ' and have answered ' + numberCorrect + ' correctly.' + ' Your score is '
              + currentScore + '. Do you want to test your knowledge in Sports?')
      .listen('Which sport would you like to test your knowledge in from basketball, cricket, soccer, and tennis?');
    }
    this.emit(':responseReady');
  },

  // Test my {sport name} knowledge
  'SetSportIntent': function() {
    this.attributes.flashcards.currentSport = this.event.request.intent.slots.sport.value;

    if (this.attributes.flashcards.currentSport === 'basketball') {
      this.attributes['sport'] = 'basketball';
    }
    else if(this.attributes.flashcards.currentSport === 'cricket'){
      this.attributes.flashcards.currentSport = 'cricket';
    }
    else if(this.attributes.flashcards.currentSport === 'soccer'){
      this.attributes.flashcards.currentSport = 'soccer';
    }
    else if(this.attributes.flashcards.currentSport === 'tennis'){
      this.attributes.flashcards.currentSport = 'tennis';
    }

    var currentSport = this.attributes.flashcards.currentSport;

    this.response
    .speak('Okay, I will ask you some questions about ' +
    currentSport + '. Here is your first question. ' +
    AskQuestion(this.attributes))
    .listen(AskQuestion(this.attributes));

    this.emit(':responseReady');
  },

  // User gives an answer
  'AnswerIntent': function() {

    var userAnswer = this.event.request.intent.slots.answers.value;
    var currentSport= this.attributes.flashcards.currentSport;
    var sportAnswer = currentSport + 'Answer';
    var currentFlashcardIndex = this.attributes.flashcards.sport[currentSport].currentFlashcardIndex;
    var correctAnswer = flashcardsDictionary[currentFlashcardIndex][sportAnswer];


    if (userAnswer === correctAnswer){
      this.attributes.flashcards.sport[currentSport].numberCorrect++;
      this.attributes.flashcards.sport[currentSport].score = this.attributes.flashcards.sport[currentSport].score + 10;

      var numberCorrect = this.attributes.flashcards.sport[currentSport].numberCorrect;
      var currentScore =  this.attributes.flashcards.sport[currentSport].score;

      this.attributes.flashcards.sport[currentSport].currentFlashcardIndex++;
      this.response
      .speak('Nice job! The correct answer is ' + correctAnswer + '. You ' +
      'have gotten ' + numberCorrect + ' out of ' + DECK_LENGTH + ' ' +
      currentSport + ' questions correct. Your total score is '+ currentScore + '. Here is your next question. ' + AskQuestion(this.attributes))
      .listen(AskQuestion(this.attributes));
    } else {
      var numberCorrect = this.attributes.flashcards.sport[currentSport].numberCorrect;
      var currentScore =  this.attributes.flashcards.sport[currentSport].score;
      this.attributes.flashcards.sport[currentSport].currentFlashcardIndex++;
      this.response
      .speak('Sorry, the correct answer is ' + correctAnswer + '. You ' +
      'have gotten ' + numberCorrect + ' out of ' + DECK_LENGTH + ' ' +
      currentSport + ' questions correct. Your total score is '+ currentScore + ' .Here is your next question. ' +
      AskQuestion(this.attributes))
      .listen(AskQuestion(this.attributes));
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

// Test my {sport} knowledge
var AskQuestion = function(attributes) {
  var currentSport = attributes.flashcards.currentSport;
  var currentFlashcardIndex = attributes.flashcards.sport[currentSport].currentFlashcardIndex;
  var currentScore = attributes.flashcards.sport[currentSport].score;

  if (currentFlashcardIndex >= flashcardsDictionary.length) {
    return 'Bummer. No more questions remaining. Your total score is ' + currentScore + ' out of 50. Thank you for playing';
  } else {
    var currentQuestion = flashcardsDictionary[currentFlashcardIndex].question;
    return  currentQuestion;
  }
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context, callback);

  alexa.dynamoDBTableName = 'TriviaSports';
  alexa.registerHandlers(handlers);
  alexa.execute();
};
