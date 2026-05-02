const questions = [
  {
    id: 1,
    type: "video",

    media: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    question: "Co robisz w tej sytuacji?",

    tag: "Unit gameplay",

    answers: [
      {
        text: "Pushujesz razem z drużyną",
        points: 5,
        explanation: "Najlepsza opcja  grasz z teamem"
      },
      {
        text: "Czekasz na resp",
        points: 1,
        explanation: "Nie jest źle, ale tracisz tempo"
      },
      {
        text: "Idziesz solo",
        points: -5,
        explanation: "Prawdopodobnie umrzesz bez wsparcia"
      },
      {
        text: "Stoisz AFK",
        points: -3,
        explanation: "Brak wpływu na sytuację"
      }
    ]
  },

  {
    id: 2,
    type: "image",

    media: "https://cdn.jsdelivr.net/gh/Bokiczownik/resources_for_kr@main/knowledgeBase_res/kotsmiech.png",

    question: "Co bys zrobił w tej sytuacji?",

    tag: "Hero gameplay",

    answers: [
      {
        text: "Opcja A",
        points: 5,
        explanation: "Najlepszy wybór"
      },
      {
        text: "Opcja B",
        points: -1,
        explanation: "Średnia decyzja"
      },
      {
        text: "Opcja C",
        points: -5,
        explanation: "Fatalna decyzja"
      }
    ]
  }
];
