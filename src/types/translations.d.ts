declare module '*/translations.json' {
  interface TranslationStructure {
    navigation: {
      home: string;
      drawCards: string;
      viewDeck: string;
      tutorial: string;
      admin: string;
    };
    header: {
      title: string;
    };
    pageTitle: {
      main: string;
    };
    homePage: {
      welcome: string;
      description: string;
      drawCardsSection: {
        title: string;
        description: string;
        button: string;
      };
      exploreDeckSection: {
        title: string;
        description: string;
        button: string;
      };
      learnTarotSection: {
        title: string;
        description: string;
        button: string;
      };
    };
    languageSwitcher: {
      english: string;
      spanish: string;
    };
    deckPage: {
      loading: string;
      error: {
        title: string;
        message: string;
        retry: string;
      };
      filters: {
        clearFilters: string;
        clearAllFilters: string;
        arcana: {
          label: string;
          allCards: string;
          majorArcana: string;
          minorArcana: string;
        };
        suit: {
          label: string;
          allSuits: string;
          wands: string;
          cups: string;
          swords: string;
          pentacles: string;
        };
        cardType: {
          label: string;
          allTypes: string;
          numberCards: string;
          courtCards: string;
        };
      };
      stats: {
        showing: string;
        filtered: string;
      };
      emptyState: {
        title: string;
        message: string;
      };
    };
    adminPage: {
      loading: string;
      error: {
        message: string;
        loadFailed: string;
        saveFailed: string;
        retry: string;
      };
      title: string;
      description: string;
      filters: {
        allCards: string;
        majorArcana: string;
        minorArcana: string;
      };
      table: {
        id: string;
        type: string;
        actions: string;
      };
      status: {
        saving: string;
        saveChanges: string;
        cancelChanges: string;
      };
      hints: {
        clickToEdit: string;
      };
      emptyState: {
        message: string;
      };
    };
    tutorialPage: {
      title: string;
      description: string;
      error: {
        title: string;
        message: string;
        retry: string;
      };
      loading: string;
    };
    tutorialComponents: {
      sections: {
        history: string;
        cards: string;
        majorArcana: string;
        minorArcana: string;
        interestingTrivia: string;
        characteristics: string;
        numbering: string;
        themes: string;
        structure: string;
        numberCards: string;
        courtCards: string;
        chooseSuit: string;
        chooseCard: string;
        combinedInterpretation: string;
      };
      fallbacks: {
        noCharacteristics: string;
        noThemes: string;
        noSuitInfo: string;
        historyNotAvailable: string;
        cardsOverviewNotAvailable: string;
        majorArcanaOverviewNotAvailable: string;
        minorArcanaOverviewNotAvailable: string;
        triviaNotAvailable: string;
      };
    };
    tarotCard: {
      cardNotFound: string;
      interactions: {
        clickToFlip: string;
        clickToFlipBack: string;
      };
      sections: {
        uprightMeaning: string;
        reversedMeaning: string;
        description: string;
      };
    };
    readerPage: {
      retry: string;
      welcome: string;
      instruction: string;
      readingTips: string;
      tip1: string;
      tip2: string;
      tip3: string;
      tip4: string;
      drawCard: string;
      drawing: string;
      yourReading: string;
      readingSubtitle: string;
      shuffling: string;
      revealing: string;
      drawAnother: string;
      howToInterpret: string;
      uprightMeaning: string;
      uprightDescription: string;
      reversedMeaning: string;
      reversedDescription: string;
      personalConnection: string;
      personalDescription: string;
      intuition: string;
      intuitionDescription: string;
      noCard: string;
      drawAgain: string;
      mysticalInterference: string;
      cardsNotResponding: string;
      tryAgain: string;
      tarotDeck: string;
    };
  }

  const translations: {
    en: TranslationStructure;
    es: TranslationStructure;
  };

  export default translations;
} 