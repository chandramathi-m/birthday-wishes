/**
 * GoldDivider
 * A decorative horizontal rule with a centred gold diamond.
 * Pass an optional `style` prop to override container styles.
 */
export default function GoldDivider({ style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", ...style }}>
      <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(to right, transparent, #BF8D3C)" }} />
      <div style={{ width: "6px", height: "6px", background: "#BF8D3C", transform: "rotate(45deg)", flexShrink: 0 }} />
      <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(to left, transparent, #BF8D3C)" }} />
    </div>
  );
}