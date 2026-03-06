import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  download?: boolean;
}

export function QRCode({ value, size = 300, download = false }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    }
  }, [value, size]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} />
      {download && (
        <button
          onClick={handleDownload}
          className="text-sm text-blue-600 hover:underline"
        >
          Tải QR Code (PNG)
        </button>
      )}
    </div>
  );
}

export function generateEventURL(eventId: string): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/event/${eventId}`;
}
