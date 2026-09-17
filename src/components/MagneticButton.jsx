import React, { useRef } from 'react';
import { useMagnetic } from '../animations/useMagnetic';

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  download,
  target,
  rel,
  strength = 0.22,
  ...props
}) {
  const ref = useRef(null);
  useMagnetic(ref, strength);

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        onClick={onClick}
        download={download}
        target={target}
        rel={rel}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
