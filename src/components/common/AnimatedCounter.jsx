import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter — animates from 0 to a numeric value with easing.
 * For non-numeric strings (like "₹42.8L"), renders them directly.
 */
export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 900 }) {
  const [displayVal, setDisplayVal] = useState(0);
  const rafRef = useRef(null);

  // Detect if value is a plain formatted string (like ₹42.8L)
  const isFormattedString = typeof value === 'string';

  const numericValue = isFormattedString
    ? 0
    : typeof value === 'number'
    ? value
    : parseFloat(String(value)) || 0;

  useEffect(() => {
    if (isFormattedString) return;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.floor(eased * numericValue));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayVal(numericValue);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [numericValue, duration, isFormattedString]);

  if (isFormattedString) {
    return <span>{prefix}{value}{suffix}</span>;
  }

  return (
    <span>
      {prefix}
      {displayVal.toLocaleString()}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
