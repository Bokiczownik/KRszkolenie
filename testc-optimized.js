/**
 * TestC - Quiz Application
 * Główna logika aplikacji
 */

// Stan aplikacji
let currentQuestionIndex = 0;
let selectedQuestions = [];
let results = [];

/**
 * Inicjalizacja aplikacji
 */
window.addEventListener("DOMContentLoaded", () => {
  initializeNavbar();
  attachEventListeners();
});

/**
 * Inicjalizacja navbaru
 */
function initializeNavbar() {
  if (typeof renderNavbar === "function") {
    renderNavbar("karkówka");
  }
}

/**
 * Podpięcie event listenerów
 */
function attachEventListeners() {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", startQuiz);
  }
}

/**
 * Rozpoczęcie quizu
 */
function startQuiz() {
  // Losowanie pytań
  selectedQuestions = shuffleArray([...questions]);
  
  // Reset stanu
  currentQuestionIndex = 0;
  results = [];

  // Przełączenie widoków
  showElement("quiz-screen");
  hideElement("start-screen");

  // Renderowanie pierwszego pytania
  renderQuestion();
}

/**
 * Renderowanie pytania
 */
function renderQuestion() {
  const question = selectedQuestions[currentQuestionIndex];
  
  // Aktualizacja UI
  updateProgress();
  updateQuestionText(question.question);
  clearContainer("answers-container");
  clearContainer("media-container");
  
  // Renderowanie mediów
  renderMedia(question);
  
  // Renderowanie odpowiedzi
  renderAnswers(question);
}

/**
 * Aktualizacja paska postępu
 */
function updateProgress() {
  const progress = document.getElementById("progress");
  progress.textContent = `Pytanie ${currentQuestionIndex + 1} / ${selectedQuestions.length}`;
}

/**
 * Aktualizacja tekstu pytania
 */
function updateQuestionText(text) {
  const questionText = document.getElementById("question-text");
  questionText.textContent = text;
}

/**
 * Renderowanie mediów (wideo/obraz)
 */
function renderMedia(question) {
  const mediaContainer = document.getElementById("media-container");
  
  if (question.type === "video") {
    const iframe = createVideoElement(question.media);
    mediaContainer.appendChild(iframe);
  } else if (question.type === "image") {
    const img = createImageElement(question.media);
    mediaContainer.appendChild(img);
  }
}

/**
 * Tworzenie elementu wideo
 */
function createVideoElement(src) {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.allowFullscreen = true;
  iframe.frameBorder = "0";
  return iframe;
}

/**
 * Tworzenie elementu obrazu
 */
function createImageElement(src) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "quiz-image";
  img.alt = "Pytanie quiz";
  return img;
}

/**
 * Renderowanie odpowiedzi
 */
function renderAnswers(question) {
  const answersContainer = document.getElementById("answers-container");
  const shuffledAnswers = shuffleArray([...question.answers]);

  shuffledAnswers.forEach(answer => {
    const btn = createAnswerButton(answer, question);
    answersContainer.appendChild(btn);
  });
}

/**
 * Tworzenie przycisku odpowiedzi
 */
function createAnswerButton(answer, question) {
  const btn = document.createElement("button");
  btn.className = "answer-btn";
  btn.textContent = answer.text;
  btn.addEventListener("click", () => saveAnswer(question, answer));
  return btn;
}

/**
 * Zapisanie odpowiedzi i pokazanie feedbacku
 */
function saveAnswer(question, selectedAnswer) {
  const buttons = document.querySelectorAll(".answer-btn");
  
  // Dezaktywacja wszystkich przycisków
  disableButtons(buttons);
  
  // Pokazanie punktów dla wszystkich odpowiedzi
  revealAllAnswers(buttons, question);
  
  // Podświetlenie wybranej odpowiedzi
  highlightSelectedAnswer(buttons, selectedAnswer);
  
  // Zapisanie wyniku
  saveResult(question, selectedAnswer);
  
  // Pokazanie feedbacku
  showFeedback(selectedAnswer);
}

/**
 * Dezaktywacja przycisków
 */
function disableButtons(buttons) {
  buttons.forEach(btn => {
    btn.disabled = true;
  });
}

/**
 * Pokazanie punktów dla wszystkich odpowiedzi
 */
function revealAllAnswers(buttons, question) {
  buttons.forEach(btn => {
    const answerText = btn.textContent;
    const matchingAnswer = question.answers.find(a => a.text === answerText);
    
    if (matchingAnswer) {
      btn.classList.add("revealed-answer");
      btn.classList.add(`hover-${getScoreClass(matchingAnswer.points)}`);
      btn.innerHTML = Templates.answerWithPoints(matchingAnswer);
    }
  });
}

/**
 * Podświetlenie wybranej odpowiedzi
 */
function highlightSelectedAnswer(buttons, selectedAnswer) {
  const selectedButton = Array.from(buttons).find(btn => 
    btn.textContent.includes(selectedAnswer.text)
  );

  if (selectedButton) {
    selectedButton.classList.remove(
      "hover-positive", "hover-neutral", "hover-warning", "hover-negative"
    );
    selectedButton.classList.remove("revealed-answer");
    selectedButton.classList.add(getScoreClass(selectedAnswer.points));
  }
}

/**
 * Zapisanie wyniku do tablicy results
 */
function saveResult(question, selectedAnswer) {
  const bestAnswer = findBestAnswer(question.answers);
  
  results.push({
    questionId: question.id,
    question: question.question,
    tag: question.tag,
    media: question.media,
    type: question.type,
    selectedAnswer: selectedAnswer.text,
    points: selectedAnswer.points,
    explanation: selectedAnswer.explanation,
    bestAnswer: bestAnswer.text,
    bestPoints: bestAnswer.points,
    bestExplanation: bestAnswer.explanation
  });
}

/**
 * Znalezienie najlepszej odpowiedzi
 */
function findBestAnswer(answers) {
  return answers.reduce((best, current) => 
    current.points > best.points ? current : best
  );
}

/**
 * Pokazanie feedbacku po odpowiedzi
 */
function showFeedback(answer) {
  const answersContainer = document.getElementById("answers-container");
  const isLastQuestion = currentQuestionIndex + 1 >= selectedQuestions.length;
  
  const feedbackBox = document.createElement("div");
  feedbackBox.innerHTML = Templates.feedbackBox(answer, isLastQuestion);
  answersContainer.appendChild(feedbackBox);
  
  // Event listener dla przycisku "Następne"
  const nextBtn = feedbackBox.querySelector(".next-btn");
  nextBtn.addEventListener("click", handleNextQuestion);
}

/**
 * Obsługa przejścia do następnego pytania
 */
function handleNextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= selectedQuestions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

/**
 * Pokazanie ekranu z wynikami
 */
function showResults() {
  const wrapper = document.getElementById("quiz-box");
  
  // Obliczenie statystyk
  const totalPoints = calculateTotalPoints();
  const categoryStats = calculateCategoryStats();
  
  // Aktualizacja UI
  updateProgressText("Podsumowanie");
  wrapper.innerHTML = Templates.resultsScreen(totalPoints, categoryStats, results);
}

/**
 * Obliczenie łącznej liczby punktów
 */
function calculateTotalPoints() {
  return results.reduce((sum, result) => sum + result.points, 0);
}

/**
 * Obliczenie statystyk per kategoria
 */
function calculateCategoryStats() {
  const stats = {};
  
  results.forEach(result => {
    if (!stats[result.tag]) {
      stats[result.tag] = {
        positive: 0,
        neutral: 0,
        warning: 0,
        negative: 0,
        total: 0
      };
    }
    
    stats[result.tag].total++;
    
    // Klasyfikacja wyniku
    if (result.points >= 5) {
      stats[result.tag].positive++;
    } else if (result.points >= 1) {
      stats[result.tag].neutral++;
    } else if (result.points <= -5) {
      stats[result.tag].negative++;
    } else {
      stats[result.tag].warning++;
    }
  });
  
  return stats;
}

/**
 * Powrót do ekranu startowego
 */
function returnToStart() {
  const wrapper = document.getElementById("quiz-box");
  
  updateProgressText("Quiz taktyczny");
  wrapper.innerHTML = Templates.startScreen();
  
  // Ponowne podpięcie event listenera
  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", startQuiz);
}

/**
 * Aktualizacja tekstu progressu
 */
function updateProgressText(text) {
  const progress = document.getElementById("progress");
  progress.textContent = text;
}

/**
 * Określenie klasy CSS na podstawie punktów
 */
function getScoreClass(points) {
  if (points >= 5) return "positive";
  if (points >= 1) return "neutral";
  if (points <= -5) return "negative";
  return "warning";
}

/**
 * Losowanie elementów w tablicy (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Pomocnicze funkcje DOM
 */
function showElement(id) {
  const element = document.getElementById(id);
  if (element) element.style.display = "block";
}

function hideElement(id) {
  const element = document.getElementById(id);
  if (element) element.style.display = "none";
}

function clearContainer(id) {
  const container = document.getElementById(id);
  if (container) container.innerHTML = "";
}
