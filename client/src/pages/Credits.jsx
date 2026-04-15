import "../styles/page.css";
import { useNavigate } from "react-router-dom";

export default function Credits() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="card">
        <h1>🏆 Credits</h1>
        <p>This game was built using:</p>

        <ul>
          <li>React ⚛️</li>
          <li>Socket.io 🔌</li>
          <li>Node.js 🚀</li>
        </ul>

        <p><b>Developer:</b> Your Name</p>

        <button className="button" onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}