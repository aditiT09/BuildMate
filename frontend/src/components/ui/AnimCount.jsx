import { useState, useEffect, useRef } from "react";

export default function AnimCount({
  target,
  duration = 1200,
}) {
  const [value, setValue] = useState(0);

  const previousTarget = useRef(0);
  const frameId = useRef();

  useEffect(() => {
    const startValue = previousTarget.current;
    previousTarget.current = target;

    const difference = target - startValue;

    let startTime = null;

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      const progress = Math.min(elapsed / duration, 1);

      setValue(
        Math.floor(startValue + difference * progress)
      );

      if (progress < 1) {
        frameId.current = requestAnimationFrame(animate);
      }
    };

    frameId.current = requestAnimationFrame(animate);

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [target, duration]);

  return <>{value}</>;
}