import "../styles/page.css";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="card">
        <h1>🔒 Privacy Policy</h1>
        <p>Your privacy matters to us:</p>

        <ul>
          <li>No personal data is stored</li>
          <li>No tracking without your consent</li>
          <li>Game data is temporary</li>
        </ul>

        <button className="button" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}