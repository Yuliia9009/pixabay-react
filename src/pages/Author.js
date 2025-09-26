import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getAuthorImages } from "../lib/pixabay";
import ImageGrid from "../components/ImageGrid";

const PER_PAGE = 30;

export default function Author() {
  const { userId } = useParams();
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);

  async function load(p = 1, { append = false } = {}) {
    if (loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    setErr("");
    try {
      const data = await getAuthorImages({ userId, perPage: PER_PAGE, page: p });
      setTotalHits(data.totalHits || 0);
      setHasMore(p * PER_PAGE < (data.totalHits || 0));
      if (append) {
        setHits(prev => [...prev, ...(data.hits || [])]);
      } else {
        setHits(data.hits || []);
      }
      if (data.hits?.[0]) setAuthorName(data.hits[0].user);
    } catch (e) {
      setErr(e.message || "Loading error");
      if (!append) {
        setHits([]);
        setTotalHits(0);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setHits([]);
    load(1, { append: false });
  }, [userId]);

  useEffect(() => {
    if (!hasMore) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        const nextPage = page + 1;
        setPage(nextPage);
        load(nextPage, { append: true });
      }
    }, { rootMargin: "400px" });

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, userId, hasMore]);

  return (
    <div>
      <p><Link to=".." className="meta">← Back</Link></p>
      <h2 style={{ marginTop: 0 }}>Works of the author: {authorName || `ID ${userId}`}</h2>

      {err && <p className="meta" style={{ color: "var(--danger)" }}>{err}</p>}

      <ImageGrid hits={hits} />

      {loading && <p className="meta">Load...</p>}
      <div ref={loadMoreRef} className="sentinel" />
      {!hasMore && !loading && (
        <p className="meta" style={{ textAlign: "center", marginTop: 12 }}>
          All the author's works have been loaded
        </p>
      )}
    </div>
  );
}