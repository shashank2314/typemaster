const easyWords = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'car', 'eat', 'far', 'fun', 'got', 'let', 'put', 'run', 'sat', 'set', 'sit', 'ten', 'try', 'use', 'win', 'yes', 'big'
];

const mediumWords = [
  'about', 'after', 'again', 'against', 'because', 'before', 'being', 'between', 'during', 'every', 'first', 'great', 'group', 'house', 'important', 'interest', 'large', 'last', 'life', 'little', 'long', 'make', 'most', 'move', 'much', 'must', 'name', 'need', 'never', 'next', 'night', 'number', 'often', 'other', 'people', 'place', 'point', 'problem', 'program', 'public', 'question', 'right', 'same', 'school', 'seem', 'several', 'small', 'social', 'some', 'something'
];

const hardWords = [
  'administration', 'beautiful', 'characteristic', 'development', 'environment', 'establishment', 'experimental', 'functionality', 'governmental', 'implementation', 'international', 'investigation', 'knowledge', 'literature', 'management', 'necessary', 'organization', 'particular', 'performance', 'possibility', 'professional', 'psychological', 'representative', 'responsibility', 'significant', 'sophisticated', 'temperature', 'traditional', 'understanding', 'university', 'accommodate', 'beginning', 'calendar', 'definitely', 'embarrass', 'fluorescent', 'government', 'harass', 'independent', 'judgment', 'knowledge', 'lightning', 'maintenance', 'necessary', 'occurrence', 'personnel', 'questionnaire', 'restaurant', 'separate', 'tomorrow'
];

const punctuationMarks = [',', '.', '!', '?', ';', ':', '"', "'", '-', '(', ')'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function generateText(wordCount: number, difficulty: 'easy' | 'medium' | 'hard', includePunctuation: boolean, includeNumbers: boolean): string {
  let wordPool: string[] = [];
  
  switch (difficulty) {
    case 'easy':
      wordPool = easyWords;
      break;
    case 'medium':
      wordPool = [...easyWords, ...mediumWords];
      break;
    case 'hard':
      wordPool = [...easyWords, ...mediumWords, ...hardWords];
      break;
  }

  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    let word = wordPool[Math.floor(Math.random() * wordPool.length)];
    
    // Add numbers randomly
    if (includeNumbers && Math.random() < 0.1) {
      const numberCount = Math.floor(Math.random() * 3) + 1;
      let numberString = '';
      for (let j = 0; j < numberCount; j++) {
        numberString += numbers[Math.floor(Math.random() * numbers.length)];
      }
      word = Math.random() < 0.5 ? numberString + word : word + numberString;
    }
    
    // Add punctuation randomly
    if (includePunctuation && Math.random() < 0.15) {
      const punct = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      if (punct === '"' || punct === "'") {
        word = punct + word + punct;
      } else if (punct === '(' || punct === ')') {
        word = '(' + word + ')';
      } else {
        word = word + punct;
      }
    }
    
    words.push(word);
  }
  
  return words.join(' ');
}