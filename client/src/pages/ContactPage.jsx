import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <Link className="legal-back" to="/">Back to Home</Link>
        <h1>Contact</h1>
        <div className="legal-card">
          <p>Contact: contact@skribbl.io</p>
          <p>Contact: skribblcontact@gmail.com</p>
        </div>
      </section>
    </main>
  );
}
