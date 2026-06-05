import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeViewProps {
    url: string;
    size?: number;
    productName: string;
}

/**
 * QR code display component with download functionality.
 *
 * Renders a QR code on a canvas element and provides a download
 * button that creates a labeled PNG image.
 */
export default function QRCodeView({ url, size = 200, productName }: QRCodeViewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, url, {
                width: size,
                margin: 2,
                color: {
                    dark: '#1a472a',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'H',
            });
        }
    }, [url, size]);

    const handleDownload = (): void => {
        if (!canvasRef.current) return;

        // Create a new canvas with label
        const padding = 30;
        const labelHeight = 40;
        const totalWidth = size + padding * 2;
        const totalHeight = size + padding * 2 + labelHeight;

        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = totalWidth;
        downloadCanvas.height = totalHeight;
        const ctx = downloadCanvas.getContext('2d');

        if (!ctx) return;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw QR code
        ctx.drawImage(canvasRef.current, padding, padding, size, size);

        // Product name label
        ctx.fillStyle = '#1a472a';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(productName, totalWidth / 2, size + padding + labelHeight - 10);

        // Download
        const link = document.createElement('a');
        link.download = `QR-${productName.replace(/\s+/g, '-')}.png`;
        link.href = downloadCanvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="qr-code-view">
            <canvas ref={canvasRef} />
            <button className="btn-download" onClick={handleDownload}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download QR Code
            </button>
        </div>
    );
}
