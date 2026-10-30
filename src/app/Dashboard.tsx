import { learningPaths, lessons, pathForLesson, routeHref } from '../app/lessons';
import type { LessonId } from '../app/lessons';
import { ArrowRight, ChevronRight, Gauge, Sprout, Wallet } from 'lucide-react';

export default function Dashboard({ lastLesson, visitedLessons }: { lastLesson: LessonId | null; visitedLessons: LessonId[] }) {
  const resume = lessons.find(lesson => lesson.id === lastLesson);
  const resumePath = resume ? pathForLesson(resume.id) : null;
  const questions = [
    ...(resume ? [{ href: 'money-mirror', icon: Wallet, title: 'What do I really earn?' }] : []),
    { href: 'wealth-thermometer', icon: Gauge, title: 'How long would my savings last?' },
    { href: 'compounding', icon: Sprout, title: 'What could repeat sales build?' },
  ];
  return <div className="app-page dashboard">
    <header className="page-heading"><h1>Make sense of your money.</h1></header>
    {resume && resumePath ? <section className="dashboard-start" aria-labelledby="dashboard-start-title">
      <div className="start-copy">
        <p className="start-eyebrow">Pick up where you left off</p>
        <h2 id="dashboard-start-title">{resume.title}</h2>
        <p>{resumePath.title} · lesson {resumePath.lessonIds.findIndex(id => id === resume.id) + 1} of 3</p>
      </div>
      <a href={routeHref(resume.id)} className="primary-button dashboard-primary">Continue <ArrowRight size={20} aria-hidden="true" /></a>
    </section> : <section className="dashboard-start" aria-labelledby="dashboard-start-title">
      <div className="start-copy">
        <h2 id="dashboard-start-title">What do I really earn?</h2>
        <p>Find your hourly pay after work costs.</p>
      </div>
      <a href={routeHref('money-mirror')} className="primary-button dashboard-primary">Check my cashflow <ArrowRight size={20} aria-hidden="true" /></a>
    </section>}
    <section className="dashboard-section" aria-labelledby="dashboard-questions">
      <h2 id="dashboard-questions">Quick questions</h2>
      <div className="dashboard-tools">{questions.map(({ href, icon: Icon, title }) => <a key={href} href={routeHref(href)} className="tool-card"><Icon size={22} aria-hidden="true" /><div><h3>{title}</h3></div><ChevronRight size={18} aria-hidden="true" /></a>)}</div>
    </section>
    <section className="dashboard-section" aria-labelledby="dashboard-paths">
      <div className="section-heading"><h2 id="dashboard-paths">Learning paths</h2><a href={routeHref('learn')}>All 9 lessons</a></div>
      <div className="dashboard-paths">{learningPaths.map(path => {
        const visitedCount = path.lessonIds.filter(id => visitedLessons.includes(id)).length;
        const nextId = path.lessonIds.find(id => !visitedLessons.includes(id)) ?? path.lessonIds[0];
        return <a key={path.id} href={routeHref(nextId)} className="path-card"><strong>{path.title}</strong><span><span className="meter meter-positive" aria-hidden="true"><span style={{ width: `${visitedCount / 3 * 100}%` }} /></span>{visitedCount} of 3 visited</span></a>;
      })}</div>
    </section>
  </div>;
}
