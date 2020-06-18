// This is the container of all Entities
const rootElement = document.getElementById('root');

// DESAFIO
const score = new Counter(rootElement, 'score');

const grid = new Grid(rootElement, 10, 10);

const timer = new Counter(rootElement, 'timer');
timer.setTimer();