import { useReveal } from "../../hooks/useReveal";
import GoldDivider from "../common/GoldDivider";
import ChandraSecretMessage from "../features/ChandraSecretMessage";
import { FRIENDS } from "../../constants/data";

export default function FriendsSection() {
  const ref = useReveal();

  return (
    <section id="friends" ref={ref} style={{ padding: "120px 24px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: "80px" }}>
        <p style={{ fontSize: "10px", letterSpacing: ".4em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "16px" }}>Chapter Three</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F2EDE4", letterSpacing: "-0.02em" }}>
          Bonds & <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>Brotherhood</em>
        </h2>
        <GoldDivider style={{ marginTop: "32px", maxWidth: "300px", margin: "32px auto 0" }} />
      </div>

      {/* Friend cards */}
      {FRIENDS.map((friend, i) => (
        <div
          key={i}
          className={`reveal reveal-delay-${i + 1}`}
          style={{
            display: "grid",
            gridTemplateColumns: friend.reverse ? "1.5fr 1fr" : "1fr 1.5fr",
            gap: "48px", alignItems: "center", marginBottom: "48px",
            background: "linear-gradient(135deg,rgba(191,141,60,.07) 0%,rgba(191,141,60,.02) 100%)",
            border: "0.5px solid rgba(191,141,60,.2)", borderRadius: "2px", padding: "48px",
          }}
        >
          {/* Image on left for non-reversed */}
          {!friend.reverse && <FriendImage friend={friend} />}

          {/* Text */}
          <div>
            <p style={{ fontSize: "36px", marginBottom: "18px", animation: "float 4s ease-in-out infinite" }}>{friend.icon}</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 400, color: "#F2EDE4", marginBottom: "6px" }}>{friend.name}</h3>
            <p style={{ fontSize: "10px", letterSpacing: ".25em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "18px" }}>{friend.role}</p>
            <p style={{ color: "#9E9588", lineHeight: 1.9, fontSize: "15px", fontWeight: 300, marginBottom: "16px" }}>{friend.body}</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontStyle: "italic", color: "#BF8D3C" }}>"{friend.quote}"</p>
          </div>

          {/* Image on right for reversed */}
          {friend.reverse && <FriendImage friend={friend} />}
        </div>
      ))}

      {/* Career strip */}
      <div className="reveal reveal-delay-3" style={{ padding: "40px 48px", borderTop: "0.5px solid rgba(191,141,60,.15)", borderBottom: "0.5px solid rgba(191,141,60,.15)", display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "36px", alignItems: "center", marginBottom: "80px" }}>
        <div style={{ overflow: "hidden", borderRadius: "2px", width: "130px", height: "130px", flexShrink: 0 }}>
          <img src="https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?w=400&q=80" alt="Career" className="img-cinematic" style={{ borderRadius: "2px" }} />
        </div>
        <div>
          <p style={{ fontSize: "10px", letterSpacing: ".35em", color: "#BF8D3C", textTransform: "uppercase", marginBottom: "10px" }}>💼 Career</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 400, color: "#F2EDE4", lineHeight: 1.2 }}>
            Balancing Dreams &amp; Reality
          </h3>
        </div>
        <p style={{ color: "#9E9588", lineHeight: 1.9, fontSize: "15px", fontWeight: 300 }}>
          Though his heart beats for dance, life led him to IT — and he embraced it with responsibility. Today, he stands strong with not just one, but <em style={{ fontStyle: "italic", color: "#BF8D3C" }}>two accounts</em> in his professional journey, proving you can be practical without giving up on your passion.
        </p>
      </div>

      {/* Chandra's secret letter */}
      <div className="reveal reveal-delay-4">
        <ChandraSecretMessage />
      </div>
    </section>
  );
}

function FriendImage({ friend }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "2px", aspectRatio: "3/4" }}>
      <img src={friend.img} alt={friend.name} className="img-cinematic" />
      <div style={{ position: "absolute", inset: "10px", border: "0.5px solid rgba(191,141,60,.35)", borderRadius: "1px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top,rgba(8,8,8,.8),transparent)", pointerEvents: "none" }} />
      <p style={{ position: "absolute", bottom: "16px", left: "16px", fontSize: "9px", letterSpacing: ".3em", color: "#BF8D3C", textTransform: "uppercase" }}>
        {friend.label}
      </p>
    </div>
  );
}