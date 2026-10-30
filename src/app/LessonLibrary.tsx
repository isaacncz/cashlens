import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { learningPaths, lessons, pathForLesson, routeHref } from './lessons';
import type { LessonId } from './lessons';

export default function LessonLibrary({ lastLesson, visitedLessons }: { lastLesson: LessonId | null; visitedLessons: LessonId[] }) {
  const [filter, setFilter] = useState('all');
  const resume = lessons.find(lesson => lesson.id === lastLesson);
  const resumePath = resume ? pathForLesson(resume.id) : null;
  const groups = learningPaths.filter(path => filter === 'all' || path.id === filter);
  const visibleCount = groups.reduce((count, path) => count + path.lessonIds.length, 0);
  return <div className="app-page library-page">
    <header className="page-heading"><h1>Learn at your pace.</h1></header>
    {resume && resumePath && <a className="continue-card" href={routeHref(resume.id)}><span><small>Continue</small><strong>{resume.title}</strong><small>{resumePath.title} · lesson {resumePath.lessonIds.findIndex(id => id === resume.id) + 1} of 3</small></span><ArrowRight size={22} aria-hidden="true" /></a>}
    <div className="path-filter" role="group" aria-label="Learning path">
      {[{ id: 'all', short: 'All' }, ...learningPaths].map(path => <button key={path.id} type="button" aria-pressed={filter === path.id} onClick={() => setFilter(path.id)}>{path.short}</button>)}
    </div>
    <p className="library-status" role="status" aria-atomic="true">{visibleCount} lessons{filter !== 'all' ? ` · ${groups[0].title}` : ' · explore in any order'}</p>
    <div className="learning-paths">{groups.map(path => {
      const visitedCount = path.lessonIds.filter(id => visitedLessons.includes(id)).length;
      return <section key={path.id} className="learning-path" aria-labelledby={`path-${path.id}`}>
        <header><h2 id={`path-${path.id}`}>{path.title}</h2><span className="path-count">{visitedCount} of 3 visited</span><span className="meter meter-positive" aria-hidden="true"><span style={{ width: `${visitedCount / 3 * 100}%` }} /></span></header>
        <ol className="lesson-list">{path.lessonIds.map((id, index) => {
          const lesson = lessons.find(lesson => lesson.id === id)!;
          const visited = visitedLessons.includes(id);
          return <li key={id}><a href={routeHref(id)} className="lesson-link" data-resume={lastLesson === id || undefined}><span className="lesson-marker" data-visited={visited} data-current={lastLesson === id}>{visited ? <><Check size={16} strokeWidth={2.5} aria-hidden="true" /><span className="sr-only">Visited:</span></> : index + 1}</span><div><h3>{lesson.title}</h3><p>{lesson.description}</p></div><ArrowRight size={18} aria-hidden="true" /></a></li>;
        })}</ol>
      </section>;
    })}</div>
    <p className="learning-footnote">Explore in any order. Visited marks reset when you close the app.</p>
  </div>;
}
