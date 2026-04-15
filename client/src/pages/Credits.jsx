import { Link } from "react-router-dom";
import "../styles/page.css";

export default function Credits() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <Link className="legal-back" to="/">Back to Home</Link>
        <h1 className="legal-title">Credits</h1>
        <article className="legal-card">
          <h2>Sound</h2>
          <p>
            "tick.wav" sampled from "Ticking Clock, A.wav" by InspectorJ of Freesound.org
          </p>
        </article>
        <article className="legal-card">
          <h2>Special Thanks</h2>
          <ul>
            <li>Alpha</li>
            <li>ectalite</li>
            <li>fish</li>
            <li>Hex</li>
            <li>HUNT3R</li>
            <li>Maxsl</li>
            <li>omgezlina</li>
            <li>Regen</li>
            <li>tobeh</li>
            <li>Tuc</li>
            <li>Zerberus</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
