import { useRef, useEffect } from "react";

/**
 * useReveal
 * Attaches an IntersectionObserver to all `.reveal` children
 * inside the returned ref container. When an element enters
 * the viewport it receives the `.visible` class, triggering
 * the CSS scroll-reveal transition defined in index.css.
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return ref;
}