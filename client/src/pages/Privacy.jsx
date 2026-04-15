import { Link } from "react-router-dom";
import "../styles/page.css";

export default function Privacy() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <Link className="legal-back" to="/">Back to Home</Link>
        <h1 className="legal-title">Privacy Settings</h1>
        <article className="legal-card">
          <h2>Your Privacy Controls</h2>
          <p>We keep this game lightweight and social, so the privacy controls should stay easy to understand.</p>
          <ul>
            <li>Your display name is shown only inside rooms and active matches.</li>
            <li>Chat messages and guesses are used only to run the live game experience.</li>
            <li>Room activity is temporary and should not be treated as permanent storage.</li>
            <li>Private rooms are intended for invited players and are not listed in public room discovery.</li>
            <li>If moderation features are added later, room safety actions may be logged to prevent abuse.</li>
          </ul>
        </article>
        <article className="legal-card">
          <h2>Choices</h2>
          <p>You can leave any room at any time, change the name you use for play, and avoid joining public rooms if you prefer a private session with friends.</p>
          <p className="legal-muted">This page is a simplified in-app privacy overview and can evolve as the game adds more account or moderation features.</p>
        </article>
      </section>
    </main>
  );
}
