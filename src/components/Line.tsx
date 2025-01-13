import { createEffect, createSignal } from "solid-js";

export default function Line(props: { fromDivId: string; toDivId: string }) {
  const [lineStyle, setLineStyle] = createSignal({});

  const updateLine = () => {
    const fromElem = document.getElementById(props.fromDivId);
    const toElem = document.getElementById(props.toDivId);

    if (!fromElem || !toElem) return;

    const fromRect = fromElem.getBoundingClientRect();
    const toRect = toElem.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left + toRect.width / 2;
    const endY = toRect.top + toRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    setLineStyle({
      width: distance + "px",
      transform: `rotate(${angle}deg)`,
      left: startX + "px",
      top: startY + "px",
    });
  };

  createEffect(() => {
    updateLine();
    window.addEventListener("resize", updateLine);
    return () => window.removeEventListener("resize", updateLine);
  });

  return <div class="line" style={lineStyle()}></div>;
}
