import ImageCard from "./ImageCard";

export default function ImageGrid({ hits }) {
  if (!hits?.length) return <p className="meta">Nothing found.</p>;
  return (
    <div className="masonry">
      {hits.map((h) => (
        <div key={h.id} className="masonry-item">
          <ImageCard h={h} />
        </div>
      ))}
    </div>
  );
}