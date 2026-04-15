import "../styles/page.css";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="card">
        <h1>📞 Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>

        <p><b>Email:</b> support@skribbleclone.com</p>

        <button className="button" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}