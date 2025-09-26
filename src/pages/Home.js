import { useEffect, useRef, useState } from "react";
import ImageGrid from "../components/ImageGrid";
import { searchImages } from "../lib/pixabay";

const PER_PAGE = 24;

export default function Home() {
  const [q, setQ] = useState("fruits");
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);

  async function fetchImages(term, pageNum = 1, { append = false } = {}) {
    if (!term || loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    setErr("");
    try {
      const data = await searchImages({ q: term.trim(), perPage: PER_PAGE, page: pageNum });
      setTotalHits(data.totalHits || 0);
      setHasMore(pageNum * PER_PAGE < (data.totalHits || 0));

      if (append) {
        setHits(prev => [...prev, ...(data.hits || [])]);
      } else {
        setHits(data.hits || []);
      }
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
    fetchImages(q, 1, { append: false });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    fetchImages(q, 1, { append: false });
  };

  useEffect(() => {
    if (!hasMore) return;

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingRef.current && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchImages(q, nextPage, { append: true });
        }
      },
      { rootMargin: "400px 0px 400px 0px", threshold: 0 } 
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, q, hasMore]);

  const manualLoad = () => {
    if (!hasMore || loadingRef.current) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(q, nextPage, { append: true });
  };

  return (
    <div>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Searh images..."
        />
        <button type="submit" className="btn">Search...</button>
      </form>

      {err && <p className="meta" style={{ color: "var(--danger)" }}>{err}</p>}

      <ImageGrid hits={hits} />

      {loading && <p className="meta" style={{ marginTop: 12 }}>Load</p>}

      <div ref={loadMoreRef} className="sentinel" />

      {!loading && hasMore && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <button className="btn secondary" onClick={manualLoad}>Load more</button>
        </div>
      )}

      {!hasMore && hits.length > 0 && (
        <p className="meta" style={{ textAlign: "center", marginTop: 12 }}>
          No more sesults
        </p>
      )}
    </div>
  );
}