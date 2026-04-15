import "../styles/page.css";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="card">
        <h1>📜 Terms of Service</h1>
        <p>By using this game, you agree to:</p>

        <ul>
          <li>Be respectful to other players</li>
          <li>Avoid offensive drawings or words</li>
          <li>Not spam or abuse the system</li>
        </ul>

        <button className="button" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}