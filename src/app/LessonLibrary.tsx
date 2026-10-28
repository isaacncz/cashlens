import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Layers2, Route } from 'lucide-react';
import { learningPaths, lessons, routeHref } from './lessons';
import type { LessonId } from './lessons';
const pathIcons = { understand: BookOpen, build: Layers2, practice: Route };
export default function LessonLibrary({ lastLesson }: { lastLesson: LessonId | null }) {
  const [filter, setFilter] = useState('all');
  const resume = lessons.find(lesson => lesson.id === lastLesson);
  const groups = learningPaths.filter(path => filter === 'all' || path.id === filter);
  const visibleCount = groups.reduce((count, path) => count + path.lessonIds.length, 0);
  return <div className="app-page library-page">
    <header className="page-heading"><h1>Build your money sense.</h1><p>Nine lessons. Three paths. Your pace.</p></header>
    <a className="learning-start" href={routeHref(resume?.id ?? 'money-mirror')}>
      <div><h2>{resume ? `Continue ${resume.title}` : 'Start with Money Mirror'}</h2><p>{resume ? 'Your inputs are still here in this session.' : 'See your real hourly pay.'}</p></div>
      <ArrowRight size={22} aria-hidden="true" />
    </a>
    <div className="learning-filters" role="group" aria-label="Filter learning paths">{[{ id: 'all', label: 'All' }, { id: 'understand', label: 'Understand' }, { id: 'build', label: 'Build' }, { id: 'practice', label: 'Practice' }].map(({ id, label }) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <div className="library-heading"><h2>Your learning paths</h2><span role="status" aria-atomic="true">{visibleCount} lessons{filter !== 'all' ? ` · ${groups[0].title}` : ' · explore in any order'}</span></div>
    <div className="learning-paths">{groups.map(path => {
      const Icon = pathIcons[path.id];
      return <section key={path.id} className="learning-path" aria-labelledby={`path-${path.id}`}>
        <header><Icon size={22} strokeWidth={1.6} aria-hidden="true" /><div><h2 id={`path-${path.id}`}>{path.title}</h2><p>{path.description}</p></div></header>
        <ol className="lesson-list">{path.lessonIds.map((id, index) => {
          const lesson = lessons.find(lesson => lesson.id === id)!;
          return <li key={id}><a href={routeHref(id)} className="lesson-link" data-resume={lastLesson === id || undefined}><span className="lesson-number" aria-hidden="true">{index + 1}</span><div><h3>{lesson.title}</h3><p>{lesson.description}</p>{lastLesson === id && <span className="lesson-resume-badge">Last opened</span>}</div><ArrowUpRight size={20} aria-hidden="true" /></a></li>;
        })}</ol>
      </section>;
    })}</div>
    <p className="learning-footnote">Explore in any order. Examples and calculators stay private to this session.</p>
  </div>;
}
