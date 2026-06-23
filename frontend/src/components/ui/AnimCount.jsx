import { useState, useEffect, useRef } from "react";

export default function AnimCount({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    const startVal = prevTargetRef.current;
    prevTargetRef.current = target;
    
    let start = null;
    const diff = target - startVal;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(startVal + progress * diff));
      if (progress < 1) requestAnimationFrame(step);
    };
    
    requestAnimationFrame(step);
  }, [target, duration]);

  return <>{val}</>;
}
