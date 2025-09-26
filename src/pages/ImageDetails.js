import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getImageById } from "../lib/pixabay";

export default function ImageDetails() {
  const { id } = useParams();
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setErr("");
      try {
        const data = await getImageById(id);
        if (!cancelled) setImg(data);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Loading error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className="meta">Load...</p>;
  if (err) return <p className="meta" style={{ color: "var(--danger)" }}>{err}</p>;
  if (!img) return <p className="meta">Image not found.</p>;

  const bestUrl = img.fullHDURL || img.largeImageURL || img.webformatURL;
  const tags = img?.tags ? img.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const avatar = img.userImageURL || "https://i.pravatar.cc/64?img=5";

  return (
    <div className="details">
      <div className="details-media">
        <img src={bestUrl} alt={img.tags} />
      </div>

      <aside className="panel details-aside">
        <div className="licence-row">
          <span className="check-pill">✓</span>
          <div className="licence-text">
            <b>Free for use</b> under the Pixabay <a href="https://pixabay.com/service/license/" target="_blank" rel="noreferrer">Content License</a>
          </div>
        </div>

        <div className="btn-row">
          <a className="btn secondary" href="https://www.canva.com" target="_blank" rel="noreferrer">Edit image</a>
          <a className="btn" href={bestUrl} download={`pixabay_${img.id}.jpg`}>Download</a>
        </div>

        <div className="action-bar">
          <button className="chip">❤️ {img.likes}</button>
          <button className="chip">🔖 Save</button>
          <button className="chip">↗ Share</button>
        </div>

        <div className="stat-grid">
          <div className="stat">
            <div className="stat-label">Views</div>
            <div className="stat-value">{(img.views || 0).toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Downloads</div>
            <div className="stat-value">{(img.downloads || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="author-card">
          <img src={avatar} alt={img.user} />
          <div className="author-info">
            <Link to={`/author/${img.user_id}`} className="author-name">{img.user}</Link>
            <div className="meta">Pixabay user</div>
          </div>
          <Link to={`/author/${img.user_id}`} className="btn follow-btn secondary">Follow</Link>
        </div>

        {tags.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="meta" style={{ marginBottom: 6 }}>Tags</div>
            <div className="tags">
              {tags.map((t) => <span key={t} className="tag">#{t}</span>)}
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <a href={img.pageURL} target="_blank" rel="noreferrer" className="meta">Open on Pixabay ↗</a>
        </div>
      </aside>
    </div>
  );
}