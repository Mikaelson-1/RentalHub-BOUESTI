export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #E8DFD0", borderTopColor: "#C4763A", animation: "rh-spin 0.75s linear infinite" }} />
      <style>{`@keyframes rh-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
