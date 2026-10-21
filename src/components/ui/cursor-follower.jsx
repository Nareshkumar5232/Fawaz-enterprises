import React, { useEffect, useRef, useState } from "react";

export const CursorFollower = () => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const borderDotPosition = useRef({ x: 0, y: 0 });

  const [renderPos, setRenderPos] = useState({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  });

  const [isHovering, setIsHovering] = useState(false);

  const DOT_SMOOTHNESS = 0.25;
  const BORDER_DOT_SMOOTHNESS = 0.12;

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Elements that should trigger the expanded cursor
    const interactiveElements = document.querySelectorAll(
      "a, button, img, input, textarea, select, [role='button']"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    let animationId;

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      dotPosition.current.x = lerp(
        dotPosition.current.x,
        mousePosition.current.x,
        DOT_SMOOTHNESS
      );

      dotPosition.current.y = lerp(
        dotPosition.current.y,
        mousePosition.current.y,
        DOT_SMOOTHNESS
      );

      borderDotPosition.current.x = lerp(
        borderDotPosition.current.x,
        mousePosition.current.x,
        BORDER_DOT_SMOOTHNESS
      );

      borderDotPosition.current.y = lerp(
        borderDotPosition.current.y,
        mousePosition.current.y,
        BORDER_DOT_SMOOTHNESS
      );

      setRenderPos({
        dot: {
          x: dotPosition.current.x,
          y: dotPosition.current.y,
        },
        border: {
          x: borderDotPosition.current.x,
          y: borderDotPosition.current.y,
        },
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });

      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      aria-hidden="true"
    >
      {/* INNER DOT */}
      <div
        className="absolute rounded-full bg-neutral-900 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        style={{
          width: "6px",
          height: "6px",
          transform: "translate(-50%, -50%)",
          left: `${renderPos.dot.x}px`,
          top: `${renderPos.dot.y}px`,
          transition: "transform 0.15s ease-out, opacity 0.2s ease",
        }}
      />

      {/* OUTER FOLLOWER */}
      <div
        className="absolute rounded-full border border-neutral-700/60"
        style={{
          width: isHovering ? "46px" : "28px",
          height: isHovering ? "46px" : "28px",
          transform: "translate(-50%, -50%)",
          left: `${renderPos.border.x}px`,
          top: `${renderPos.border.y}px`,
          opacity: isHovering ? 0.8 : 0.4,
          transition:
            "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), " +
            "height 0.35s cubic-bezier(0.22, 1, 0.36, 1), " +
            "opacity 0.3s ease",
        }}
      />
    </div>
  );
};

export default CursorFollower;
