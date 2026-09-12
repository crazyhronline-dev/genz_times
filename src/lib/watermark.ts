export interface WatermarkOptions {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  opacity?: number;
  tagline?: string;
}

/**
 * Automatically applies the GenZ Time official logo & branding watermark to an image file.
 * Returns a data URL (image/webp) that can be previewed or uploaded to /api/upload.
 */
export async function applyWatermark(
  file: File | Blob,
  options: WatermarkOptions = {}
): Promise<{ dataUrl: string; blob: Blob }> {
  const {
    position = 'bottom-right',
    opacity = 0.95,
    tagline = 'genztime.com',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas context could not be created'));
          }

          canvas.width = img.width;
          canvas.height = img.height;

          // 1. Draw source image
          ctx.drawImage(img, 0, 0);

          // 2. Compute watermark dimensions relative to image
          const scale = Math.max(0.6, Math.min(canvas.width / 1200, 2.0));
          const pillWidth = 220 * scale;
          const pillHeight = 52 * scale;
          const padding = 24 * scale;
          const cornerRadius = 14 * scale;

          let x = canvas.width - pillWidth - padding;
          let y = canvas.height - pillHeight - padding;

          if (position === 'bottom-left') {
            x = padding;
            y = canvas.height - pillHeight - padding;
          } else if (position === 'top-right') {
            x = canvas.width - pillWidth - padding;
            y = padding;
          } else if (position === 'top-left') {
            x = padding;
            y = padding;
          }

          ctx.save();
          ctx.globalAlpha = opacity;

          // 3. Draw dark glassmorphic backplate
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 12 * scale;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4 * scale;

          ctx.fillStyle = 'rgba(6, 10, 23, 0.88)';
          ctx.beginPath();
          ctx.roundRect
            ? ctx.roundRect(x, y, pillWidth, pillHeight, cornerRadius)
            : ctx.rect(x, y, pillWidth, pillHeight);
          ctx.fill();

          // Border stroke with cyan glow
          ctx.shadowColor = 'rgba(0, 245, 255, 0.4)';
          ctx.shadowBlur = 6 * scale;
          ctx.strokeStyle = 'rgba(0, 245, 255, 0.6)';
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();

          // Reset shadow for text and icons
          ctx.shadowColor = 'transparent';

          // 4. Draw Logo Circle Emblem
          const emblemRadius = 16 * scale;
          const emblemCenterX = x + 14 * scale + emblemRadius;
          const emblemCenterY = y + pillHeight / 2;

          // Gradient ring around emblem
          const ringGrad = ctx.createLinearGradient(
            emblemCenterX - emblemRadius,
            emblemCenterY - emblemRadius,
            emblemCenterX + emblemRadius,
            emblemCenterY + emblemRadius
          );
          ringGrad.addColorStop(0, '#00F5FF');
          ringGrad.addColorStop(0.5, '#8B5CF6');
          ringGrad.addColorStop(1, '#EC4899');

          ctx.fillStyle = '#040711';
          ctx.beginPath();
          ctx.arc(emblemCenterX, emblemCenterY, emblemRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = ringGrad;
          ctx.lineWidth = 2 * scale;
          ctx.stroke();

          // "GZ" letters inside emblem
          ctx.fillStyle = '#00F5FF';
          ctx.font = `900 ${12 * scale}px monospace, ui-monospace, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('GZ', emblemCenterX, emblemCenterY + 0.5 * scale);

          // 5. Draw Brand Name & Tagline
          const textStartX = emblemCenterX + emblemRadius + 10 * scale;

          // "GenZ Time" Title
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${14 * scale}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText('GenZ Time', textStartX, y + 11 * scale);

          // Subtitle / Tagline
          ctx.fillStyle = '#00F5FF';
          ctx.font = `bold ${9 * scale}px monospace, ui-monospace, sans-serif`;
          ctx.fillText(tagline.toUpperCase(), textStartX, y + 29 * scale);

          ctx.restore();

          // 6. Output as WebP (or JPEG fallback)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Canvas toBlob failed'));
              }
              const dataUrl = canvas.toDataURL('image/webp', 0.92);
              resolve({ dataUrl, blob });
            },
            'image/webp',
            0.92
          );
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for watermarking'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
