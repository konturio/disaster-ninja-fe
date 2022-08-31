import { useEffect, useRef, useCallback, memo, useMemo } from 'react';

const createRenderer =
  (dashOffset: number) =>
  (rectEl: SVGRectElement, dashes: string, animationStepSize: number) => {
    const maxOffset = 185;
    const newOffset = dashOffset + animationStepSize;
    dashOffset = newOffset > maxOffset ? 0 : newOffset;
    rectEl.setAttribute('stroke-dashoffset', String(68 + dashOffset));
    rectEl.setAttribute('stroke-dasharray', dashes);
  };

function AnimatedRect({ frame, speed, animationStepSize, dashes }) {
  const timeoutRef = useRef(0);
  const lastTicTimeRef = useRef(0);
  const rectRef = useRef(null);
  const renderAnimationStep = useMemo(() => createRenderer(frame), [frame]);

  const nextFrame = useCallback(() => {
    timeoutRef.current = requestAnimationFrame((timestamp) => {
      const lastTime = lastTicTimeRef.current;
      if (timestamp - lastTime > speed) {
        const el = rectRef.current;
        el && renderAnimationStep(el, dashes, animationStepSize);
        lastTicTimeRef.current = timestamp;
      }
      nextFrame();
    });
  }, [animationStepSize, dashes, speed, renderAnimationStep]);

  useEffect(() => {
    nextFrame();
    return () => cancelAnimationFrame(timeoutRef.current);
  }, [nextFrame]);

  return (
    <rect
      ref={rectRef}
      x="3.5"
      y="3.5"
      width="93"
      height="93"
      stroke="#00D2FF"
      strokeWidth="7"
      strokeMiterlimit="3"
    />
  );
}

interface KonturSpinnerProps {
  /** Dashes pattern */
  dashes?: string;
  /** Animation frame */
  frame?: number;
  /** Animation smooth */
  animationStepSize?: number;
  /** Refresh rate - render every N ms */
  speed?: number;
  /** Spinner size */
  size?: number;
  className?: string;
}

function KonturSpinnerComponent({
  /** Dashes pattern */
  dashes = '130 56',
  /** Animation frame */
  frame = 0,
  /** Animation smooth */
  animationStepSize = 10,
  /** Refresh rate - render every N ms */
  speed = 20,
  /** Spinner size */
  size = 70,
  className,
}: KonturSpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M57.4748 31.1845L42.9629 46.9771C42.8586 47.0928 42.7215 47.1739 42.57 47.2097C42.4185 47.2454 42.2597 47.2342 42.1147 47.1775C41.9697 47.1207 41.8455 47.0212 41.7585 46.892C41.6715 46.7629 41.6259 46.6103 41.6278 46.4546V32.1483C41.6278 31.5785 41.4015 31.0321 40.9987 30.6292C40.5959 30.2263 40.0496 30 39.48 30H36.1481C35.5784 30 35.0321 30.2263 34.6294 30.6292C34.2266 31.0321 34.0003 31.5785 34.0003 32.1483V67.4147C33.9956 67.6992 34.0479 67.9818 34.1539 68.2458C34.2599 68.5098 34.4175 68.75 34.6176 68.9523C34.8176 69.1546 35.0561 69.3148 35.3189 69.4237C35.5817 69.5326 35.8636 69.5878 36.1481 69.5862H39.4684C39.7499 69.5878 40.0289 69.5336 40.2894 69.4269C40.5499 69.3203 40.7868 69.1631 40.9864 68.9646C41.186 68.766 41.3444 68.5299 41.4524 68.2699C41.5605 68.0099 41.6162 67.7312 41.6161 67.4496V59.681C41.7132 59.1313 41.9184 58.6063 42.2198 58.1365C42.6316 57.6894 43.1329 57.3339 43.6911 57.0933C44.2493 56.8527 44.8518 56.7323 45.4596 56.7399C46.0674 56.7476 46.6667 56.8832 47.2187 57.1378C47.7706 57.3924 48.2628 57.7604 48.6631 58.2178L57.4632 68.2857C57.8101 68.6891 58.2392 69.0138 58.7217 69.2381C59.2042 69.4624 59.729 69.5811 60.2611 69.5862H64.6843C64.9794 69.6007 65.2722 69.5268 65.5251 69.374C65.7781 69.2212 65.9797 68.9965 66.1043 68.7285C66.2289 68.4605 66.2709 68.1614 66.2247 67.8695C66.1786 67.5776 66.0465 67.3061 65.8453 67.0896L50.7529 50.6118C50.5436 50.3953 50.4266 50.1059 50.4266 49.8047C50.4266 49.5036 50.5436 49.2142 50.7529 48.9977L65.8453 32.5083C66.0465 32.2918 66.1786 32.0203 66.2247 31.7283C66.2709 31.4364 66.2289 31.1373 66.1043 30.8694C65.9797 30.6014 65.7781 30.3766 65.5251 30.2239C65.2722 30.0711 64.9794 29.9972 64.6843 30.0116H60.203C59.692 30.0082 59.1858 30.1107 58.7162 30.3125C58.2467 30.5144 57.824 30.8113 57.4748 31.1845Z"
        fill="#00D2FF"
      />

      <AnimatedRect
        frame={frame}
        speed={speed}
        dashes={dashes}
        animationStepSize={animationStepSize}
      />
    </svg>
  );
}

export const KonturSpinner = memo(KonturSpinnerComponent);
