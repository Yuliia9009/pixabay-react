import { Link } from "react-router-dom";

export default function ImageCard({ h }) {
  const avatar = h.userImageURL || "https://i.pravatar.cc/40?img=5";
  return (
    <div className="card">
      <Link to={`/image/${h.id}`} style={{ display: "block" }}>
        <img src={h.webformatURL} alt={h.tags} loading="lazy" />
      </Link>

      <div className="card-overlay">
        <Link to={`/author/${h.user_id}`} className="author" title={`Author: ${h.user}`}>
          <img src={avatar} alt={h.user} />
          <span>{h.user}</span>
        </Link>
        <span className="like">❤️ {h.likes}</span>
      </div>
    </div>
  );
}