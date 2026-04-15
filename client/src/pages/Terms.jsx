import { Link } from "react-router-dom";
import "../styles/page.css";

export default function Terms() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <Link className="legal-back" to="/">Back to Home</Link>
        <h1 className="legal-title">skribbl.io Terms of Service and Privacy Policy</h1>

        <article className="legal-card">
          <h2>Terms</h2>
          <p>By accessing the website at http://skribbl.io, you agree to be bound by these terms of service, all applicable laws and regulations, and you are responsible for compliance with any applicable local laws.</p>
          <p>If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
        </article>

        <article className="legal-card">
          <h2>Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on skribbl.io&apos;s website for personal, non-commercial transitory viewing only.</p>
          <ul>
            <li>Do not modify or copy the materials.</li>
            <li>Do not use the materials for any commercial purpose or public display.</li>
            <li>Do not attempt to decompile or reverse engineer any software contained on the website.</li>
            <li>Do not remove copyright or proprietary notices.</li>
            <li>Do not transfer the materials to another person or mirror them on another server.</li>
          </ul>
          <p>This license automatically terminates if you violate these restrictions and may also be terminated by skribbl.io at any time.</p>
        </article>

        <article className="legal-card">
          <h2>Disclaimer and Limitations</h2>
          <p>The materials on skribbl.io&apos;s website are provided on an &quot;as is&quot; basis. skribbl.io makes no warranties, expressed or implied, and disclaims all other warranties including merchantability, fitness for a particular purpose, and non-infringement.</p>
          <p>In no event shall skribbl.io or its suppliers be liable for damages arising out of the use or inability to use the materials on the website, even if notified of the possibility of such damage.</p>
        </article>

        <article className="legal-card">
          <h2>Accuracy, Links, and Modifications</h2>
          <p>The materials appearing on skribbl.io&apos;s website could include technical, typographical, or photographic errors. skribbl.io may make changes to the materials at any time without notice.</p>
          <p>skribbl.io has not reviewed all linked sites and is not responsible for their contents. The inclusion of any link does not imply endorsement.</p>
          <p>skribbl.io may revise these terms of service at any time without notice. These terms are governed by the laws of Germany.</p>
        </article>

        <article className="legal-card">
          <h2>Privacy Policy</h2>
          <p>Your privacy is important to us. We collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.</p>
          <ul>
            <li>We identify the purposes for which information is being collected before or at the time of collection.</li>
            <li>We use personal information solely for the purposes specified by us, unless consent or law allows otherwise.</li>
            <li>We protect personal information with reasonable security safeguards.</li>
            <li>We retain personal information only for as long as necessary for those purposes.</li>
            <li>We make information about our privacy practices readily available.</li>
          </ul>
          <p>skribbl.io may change this privacy policy from time to time at its sole discretion.</p>
        </article>

        <article className="legal-card">
          <h2>Cookies</h2>
          <p>We use third-party advertising companies to serve ads when you visit the website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
          <p>
            For more information, visit{" "}
            <a href="http://www.networkadvertising.org/managing/opt_out.asp" target="_blank" rel="noreferrer">
              the Network Advertising Initiative opt-out page
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
