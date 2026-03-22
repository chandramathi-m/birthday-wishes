import GoldDivider from "../common/GoldDivider";

export default function Footer() {
  return (
    <footer style={{
      padding: "40px 24px",
      borderTop: "0.5px solid rgba(191,141,60,0.15)",
      textAlign: "center",
      background: "#050505",
    }}>
      <GoldDivider style={{ maxWidth: "300px", margin: "0 auto 24px" }} />
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "18px", fontStyle: "italic",
        color: "#BF8D3C", marginBottom: "8px",
      }}>
        Built by pain. Driven by passion. Defined by discipline.
      </p>
      <p style={{ fontSize: "10px", letterSpacing: ".3em", color: "rgba(158,149,136,.5)", textTransform: "uppercase" }}>
        ✦ With Love &amp; Admiration ✦
      </p>
    </footer>
  );
}