export const lessons = [
  { id: 'money-mirror', title: 'Money Mirror', description: 'Find what you really earn for each hour.', group: 'Your cashflow', icon: 'wallet' },
  { id: 'asset-liability', title: 'Assets & liabilities', description: 'See what puts money in your pocket.', group: 'The foundations', icon: 'arrows' },
  { id: 'cashflow-quadrant', title: 'Cashflow Quadrant', description: 'Explore the four ways to earn.', group: 'The foundations', icon: 'grid' },
  { id: 'income-engine', title: 'Income Engine', description: 'Build an income that needs less of your time.', group: 'Growing wealth', icon: 'layers' },
  { id: 'rat-race', title: 'Rat Race', description: 'Play through the choices that shape your future.', group: 'Practice', icon: 'route' },
  { id: 'debt', title: 'Debt Visualizer', description: 'Understand the cost behind a monthly payment.', group: 'Your cashflow', icon: 'receipt' },
  { id: 'salary-wealth', title: 'Salary & wealth', description: 'Compare earning more with keeping more.', group: 'Growing wealth', icon: 'chart' },
  { id: 'wealth-thermometer', title: 'Wealth Thermometer', description: 'Measure how long your money could support you.', group: 'Your cashflow', icon: 'gauge' },
  { id: 'literacy-playbook', title: 'Your money playbook', description: 'Turn the lessons into a few everyday habits.', group: 'Practice', icon: 'book' },
] as const;
export type LessonId = typeof lessons[number]['id'];
export type Destination = 'home' | 'learn' | 'compounding' | 'settings';
export type Route = Destination | LessonId;
export const isLesson = (route: string): route is LessonId => lessons.some(lesson => lesson.id === route);
export function routeFromHash(): Route {
  const hash = window.location.hash.slice(1);
  if (hash === 'repeat-sales') return 'compounding';
  return ['home', 'learn', 'compounding', 'settings'].includes(hash) || isLesson(hash) ? hash as Route : 'home';
}

/** Full same-document URLs distinguish SPA destinations from in-page skip links. */
export const routeHref = (route: string) => `${window.location.pathname}${window.location.search}#${route}`;


export const learningPaths = [
  { id: 'understand', title: 'Understand your money', description: 'Start with what comes in, what goes out, and why.', lessonIds: ['money-mirror', 'asset-liability', 'cashflow-quadrant'] },
  { id: 'build', title: 'Build breathing room', description: 'Look at debt, spending, and the buffer you have.', lessonIds: ['debt', 'salary-wealth', 'wealth-thermometer'] },
  { id: 'practice', title: 'Put it into practice', description: 'Explore income streams, try decisions, and choose a habit.', lessonIds: ['income-engine', 'rat-race', 'literacy-playbook'] },
] as const;
export const learningOrder = learningPaths.flatMap(path => [...path.lessonIds]);
export const pathForLesson = (id: LessonId) => learningPaths.find(path => path.lessonIds.some(lessonId => lessonId === id))!;
