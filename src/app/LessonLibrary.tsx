import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { learningPaths, lessons, routeHref } from './lessons';
import type { LessonId } from './lessons';

export default function LessonLibrary({ lastLesson }: { lastLesson: LessonId | null }) {
  const [filter, setFilter] = useState('all');
  const resume = lessons.find(lesson => lesson.id === lastLesson);
  const groups = learningPaths.filter(path => filter === 'all' || path.id === filter);
  const visibleCount = groups.reduce((count, path) => count + path.lessonIds.length, 0);
  return <div className="app-page library-page">
    <header className="page-heading"><h1>Learn at your pace.</h1></header>
    {resume && <a className="learning-resume" href={routeHref(resume.id)}><span>Continue {resume.title}</span><ArrowRight size={20} aria-hidden="true" /></a>}
    <div className="library-filter"><label htmlFor="learning-path">Learning path</label><select id="learning-path" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All lessons</option>{learningPaths.map(path => <option key={path.id} value={path.id}>{path.title}</option>)}</select></div>
    <div className="library-heading"><span role="status" aria-atomic="true">{visibleCount} lessons{filter !== 'all' ? ` · ${groups[0].title}` : ' · explore in any order'}</span></div>
    <div className="learning-paths">{groups.map(path => <section key={path.id} className="learning-path" aria-labelledby={`path-${path.id}`}>
      <header><h2 id={`path-${path.id}`}>{path.title}</h2></header>
      <ol className="lesson-list">{path.lessonIds.map(id => {
        const lesson = lessons.find(lesson => lesson.id === id)!;
        return <li key={id}><a href={routeHref(id)} className="lesson-link" data-resume={lastLesson === id || undefined}><div><h3>{lesson.title}</h3><p>{lesson.description}</p>{lastLesson === id && <span className="lesson-resume-badge">Last opened</span>}</div><ArrowRight size={18} aria-hidden="true" /></a></li>;
      })}</ol>
    </section>)}</div>
    <p className="learning-footnote">Explore in any order. Your inputs stay in this session.</p>
  </div>;
}
