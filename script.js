let quizData = [];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

// Fetch quiz data from API
async function fetchQuizData() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
    const data = await response.json();
    quizData = data.results.map(q => ({
      question: q.question,
      options: [...q.incorrect_answers, q.correct_answer],
      answer: q.correct_answer
    }));
    displayQuestion();
  } catch (error) {
    resultContainer.innerHTML = 'Failed to load quiz data. Please try again.';
  }
}

// Shuffle options
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Display question
function displayQuestion() {
  const questionData = quizData[currentQuestion];

  const questionHTML = `
    <div class="question">${questionData.question}</div>
    <div class="options">
      ${shuffle(questionData.options).map(option => `
        <label class="option">
          <input type="radio" name="quiz" value="${option}">
          ${option}
        </label>
      `).join('')}
    </div>
  `;

  quizContainer.innerHTML = questionHTML;
}

// Check the selected answer
function checkAnswer() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === quizData[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: quizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizData[currentQuestion].answer
      });
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      displayQuestion();
    } else {
      showResult();
    }
  }
}

// Show the result
function showResult() {
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';
  retryButton.style.display = 'block';
  showAnswerButton.style.display = 'block';
  resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
}

// Retry quiz
function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  quizContainer.style.display = 'block';
  submitButton.style.display = 'block';
  retryButton.style.display = 'none';
  showAnswerButton.style.display = 'none';
  resultContainer.innerHTML = '';
  displayQuestion();
}

// Show the correct answers
function showAnswers() {
  let answersHTML = incorrectAnswers.map(ia => `
    <p><strong>Question:</strong> ${ia.question}<br>
       <strong>Your Answer:</strong> ${ia.incorrectAnswer}<br>
       <strong>Correct Answer:</strong> ${ia.correctAnswer}</p>
  `).join('');
  resultContainer.innerHTML = `
    <p>You scored ${score} out of ${quizData.length}!</p>
    <p>Incorrect Answers:</p>
    ${answersHTML}
  `;
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswers);

// Start the quiz
fetchQuizData();
