import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>404</h2>
        <p className="muted">Page not found</p>
        <Link to="/freshers" className="btn btn-primary btn-block">Go home</Link>
      </div>
    </div>
  );
}