import { Link } from "react-router-dom";
import "../styles/page.css";

export default function Contact() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <Link className="legal-back" to="/">Back to Home</Link>
        <h1 className="legal-title">Contact</h1>
        <article className="legal-card">
          <p>Contact: contact@skribbl.io</p>
          <p>Contact: skribblcontact@gmail.com</p>
          <p className="legal-muted">For account, room, moderation, or gameplay issues, include your room code and a short description so we can help faster.</p>
        </article>
      </section>
    </main>
  );
}
