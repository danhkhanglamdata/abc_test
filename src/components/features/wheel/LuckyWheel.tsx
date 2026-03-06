import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { WheelItem } from '@/types';

// Utility function to merge tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default 8-segment wheel colors
const DEFAULT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
];

// LuckyWheel component props
export interface LuckyWheelProps {
  items?: WheelItem[];
  onSpinStart?: () => void;
  onSpinEnd?: (winner: WheelItem) => void;
  className?: string;
  size?: number;
}

// Default wheel items (8 segments)
const DEFAULT_WHEEL_ITEMS: WheelItem[] = [
  { id: '1', label: 'Prize 1', color: DEFAULT_COLORS[0] },
  { id: '2', label: 'Prize 2', color: DEFAULT_COLORS[1] },
  { id: '3', label: 'Prize 3', color: DEFAULT_COLORS[2] },
  { id: '4', label: 'Prize 4', color: DEFAULT_COLORS[3] },
  { id: '5', label: 'Prize 5', color: DEFAULT_COLORS[4] },
  { id: '6', label: 'Prize 6', color: DEFAULT_COLORS[5] },
  { id: '7', label: 'Prize 7', color: DEFAULT_COLORS[6] },
  { id: '8', label: 'Prize 8', color: DEFAULT_COLORS[7] },
];

export function LuckyWheel({
  items = DEFAULT_WHEEL_ITEMS,
  onSpinStart,
  onSpinEnd,
  className,
  size = 400,
}: LuckyWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const wheelItems = items.length > 0 ? items : DEFAULT_WHEEL_ITEMS;
  const segmentAngle = 360 / wheelItems.length;

  // Draw the wheel on canvas
  const drawWheel = useCallback(
    (currentRotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw segments
      wheelItems.forEach((item, index) => {
        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180) + (currentRotation * Math.PI / 180);
        const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180) + (currentRotation * Math.PI / 180);

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(item.label, radius - 20, 6);
        ctx.restore();
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw center text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SPIN', centerX, centerY);

      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX, 10);
      ctx.lineTo(centerX - 15, 35);
      ctx.lineTo(centerX + 15, 35);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [wheelItems, segmentAngle]
  );

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    drawWheel(rotation);
  }, [size, drawWheel, rotation]);

  // Trigger confetti effect
  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: wheelItems.map((item) => item.color || DEFAULT_COLORS[0]),
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: wheelItems.map((item) => item.color || DEFAULT_COLORS[0]),
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [wheelItems]);

  // Spin the wheel
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    onSpinStart?.();

    // Calculate random spin duration and final angle
    const spinDuration = 5000; // 5 seconds
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 extra full rotations
    const randomSegment = Math.floor(Math.random() * wheelItems.length);
    const randomOffset = Math.random() * segmentAngle;
    const finalAngle = extraSpins * 360 + randomSegment * segmentAngle + randomOffset;

    // Animate the wheel
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + finalAngle * easeOut;

      setRotation(currentRotation);
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Spin complete
        setIsSpinning(false);

        // Calculate winner
        const normalizedAngle = currentRotation % 360;
        const winningIndex = Math.floor(((360 - normalizedAngle) % 360) / segmentAngle);
        const winningItem = wheelItems[winningIndex];

        setWinner(winningItem);
        setShowWinnerModal(true);
        triggerConfetti();
        onSpinEnd?.(winningItem);
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, rotation, wheelItems, segmentAngle, drawWheel, onSpinStart, onSpinEnd, triggerConfetti]);

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* Wheel container */}
      <div className="relative">
        <motion.div
          className="relative"
          animate={{ rotate: 0 }}
          transition={{ duration: 0 }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-full shadow-xl"
            style={{ cursor: isSpinning ? 'not-allowed' : 'pointer' }}
          />
        </motion.div>
      </div>

      {/* Spin button */}
      <motion.button
        onClick={handleSpin}
        disabled={isSpinning}
        className={cn(
          'px-8 py-3 text-lg font-semibold rounded-full',
          'bg-gradient-to-r from-violet-600 to-indigo-600',
          'text-white shadow-lg',
          'hover:from-violet-700 hover:to-indigo-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2'
        )}
        whileHover={!isSpinning ? { scale: 1.05 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
      >
        {isSpinning ? 'Spinning...' : 'SPIN NOW'}
      </motion.button>

      {/* Winner modal */}
      <AnimatePresence>
        {showWinnerModal && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowWinnerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={cn(
                'bg-white dark:bg-slate-800 rounded-2xl p-8',
                'shadow-2xl text-center max-w-sm mx-4'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center',
                  'text-5xl'
                )}
                style={{ backgroundColor: winner.color || DEFAULT_COLORS[0] }}
              >
                {winner.icon || '🎉'}
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Congratulations!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                You won: <span className="font-semibold">{winner.label}</span>
              </p>
              <button
                onClick={() => setShowWinnerModal(false)}
                className={cn(
                  'px-6 py-2 rounded-full font-medium',
                  'bg-violet-600 text-white',
                  'hover:bg-violet-700',
                  'transition-colors duration-200'
                )}
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LuckyWheel;
