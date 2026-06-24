import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = 0;
    let my = 0;

    let rx = 0;
    let ry = 0;

    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onHoverIn = () => {
      dotRef.current?.classList.add("hov");
      ringRef.current?.classList.add("hov");
    };

    const onHoverOut = () => {
      dotRef.current?.classList.remove("hov");
      ringRef.current?.classList.remove("hov");
    };

    document.addEventListener("mousemove", onMove);

    document
      .querySelectorAll("a,button,[data-hover]")
      .forEach((el) => {
        el.addEventListener("mouseenter", onHoverIn);
        el.addEventListener("mouseleave", onHoverOut);
      });

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.left = mx + "px";
        dotRef.current.style.top = my + "px";
      }

      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cur" ref={dotRef} />
      <div className="cur-ring" ref={ringRef} />
    </>
  );
}
