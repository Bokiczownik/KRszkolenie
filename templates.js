/**
 * HTML Templates dla aplikacji TestC
 */

const Templates = {
  /**
   * Ekran startowy quizu
   */
  startScreen: () => `
    <div id="start-screen">
      <h2>Witaj w TestC</h2>
      <p class="quiz-description">
        Quiz losuje pytania z bazy i ocenia Twoje decyzje.
      </p>
      <button id="start-btn" class="main-btn">
        Rozpocznij Quiz
      </button>
    </div>
    <div id="quiz-screen" style="display:none;">
      <div id="media-container"></div>
      <h2 id="question-text"></h2>
      <div id="answers-container"></div>
    </div>
  `,

  /**
   * Przycisk odpowiedzi z punktami (po wyborze)
   */
  answerWithPoints: (answer) => `
    <span class="answer-label">${answer.text}</span>
    <span class="answer-points">
      ${answer.points > 0 ? '+' : ''}${answer.points} pkt
    </span>
  `,

  /**
   * Box z feedbackiem po odpowiedzi
   */
  feedbackBox: (answer, isLastQuestion) => `
    <div class="feedback-box">
      <div class="feedback-points ${getScoreClass(answer.points)}">
        ${answer.points > 0 ? '+' : ''}${answer.points} pkt
      </div>
      <div class="feedback-explanation">
        ${answer.explanation}
      </div>
      <button class="main-btn next-btn">
        ${isLastQuestion ? 'Zakończ Quiz' : 'Następne Pytanie'}
      </button>
    </div>
  `,

  /**
   * Wiersz kategorii w wykresie wydajności
   */
  categoryRow: (tag, stats) => {
    const total = stats.total;
    const positiveWidth = (stats.positive / total) * 100;
    const neutralWidth = (stats.neutral / total) * 100;
    const warningWidth = (stats.warning / total) * 100;
    const negativeWidth = (stats.negative / total) * 100;

    return `
      <div class="category-row">
        <div class="category-name">${tag}</div>
        <div class="stacked-bar">
          <div class="bar-positive" style="width:${positiveWidth}%"></div>
          <div class="bar-neutral" style="width:${neutralWidth}%"></div>
          <div class="bar-warning" style="width:${warningWidth}%"></div>
          <div class="bar-negative" style="width:${negativeWidth}%"></div>
        </div>
        <div class="category-score">${total} pytań</div>
      </div>
    `;
  },

  /**
   * Sekcja z wykresem wydajności per kategoria
   */
  categoryPerformanceChart: (categoryStats) => `
    <div class="summary-chart-section">
      <div class="category-performance-title">
        Wydajność per kategoria
      </div>
      <div class="category-bars">
        ${Object.entries(categoryStats)
          .map(([tag, stats]) => Templates.categoryRow(tag, stats))
          .join('')}
      </div>
    </div>
  `,

  /**
   * Preview medium (obraz lub wideo)
   */
  mediaPreview: (result) => {
    if (result.type === "image") {
      return `<img src="${result.media}" class="summary-media" alt="Question media">`;
    }
    return `<iframe src="${result.media}" class="summary-video-preview" frameborder="0" allowfullscreen></iframe>`;
  },

  /**
   * Pojedynczy element wyniku
   */
  resultItem: (result) => `
    <div class="result-item">
      <div class="result-question-block">
        <div class="result-question">${result.question}</div>
        <div class="result-media-preview">
          ${Templates.mediaPreview(result)}
        </div>
      </div>
      
      <div class="result-answer ${getScoreClass(result.points)}">
        Twoja odpowiedź: ${result.selectedAnswer} (${result.points} pkt)
      </div>
      
      <div class="result-explanation">
        ${result.explanation}
      </div>
      
      <div class="best-answer-box">
        <div class="best-answer-title">Najlepsza decyzja</div>
        <div class="result-answer ${getScoreClass(result.bestPoints)}">
          ${result.bestAnswer} (${result.bestPoints} pkt)
        </div>
        <div class="result-explanation">
          ${result.bestExplanation}
        </div>
      </div>
    </div>
  `,

  /**
   * Ekran z wynikami quizu
   */
  resultsScreen: (totalPoints, categoryStats, results) => `
    <h2>Quiz zakończony</h2>
    
    <div class="score-box">
      Wynik końcowy: ${totalPoints} pkt
    </div>
    
    <button class="main-btn" onclick="returnToStart()">
      Powrót do Startu
    </button>
    
    ${Templates.categoryPerformanceChart(categoryStats)}
    
    <div class="results-list">
      ${results.map(result => Templates.resultItem(result)).join('')}
    </div>
  `
};
