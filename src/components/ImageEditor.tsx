import React, { useState, useRef } from 'react';
import { X, Save, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ImageEditorProps {
  imageSrc: string;
  onSave: (croppedImage: string) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [objectFit, setObjectFit] = useState<'contain' | 'cover' | 'fill'>('cover');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const createCroppedImage = async () => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // حجم الـ canvas
      canvas.width = 1200;
      canvas.height = 675; // 16:9

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // ملء الخلفية
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // حساب الموضع على أساس الـ zoom والمحازاة
      let drawWidth = image.width * zoom;
      let drawHeight = image.height * zoom;
      let drawX = offsetX;
      let drawY = offsetY;

      // محازاة أفقية
      if (alignment === 'center') {
        drawX = (canvas.width - drawWidth) / 2;
      } else if (alignment === 'right') {
        drawX = canvas.width - drawWidth;
      } else {
        drawX = 0;
      }

      // رسم الصورة
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      // تحويل إلى Base64
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64String = reader.result as string;
            onSave(base64String);
          };
        }
      }, 'image/jpeg', 0.95);
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Edit Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Preview Area */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Adjust Image</label>
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative bg-gray-100 rounded-lg overflow-hidden cursor-move border-2 border-dashed border-gray-300"
              style={{ height: '400px' }}
            >
              <img
                src={imageSrc}
                alt="Preview"
                style={{
                  width: `${100 * zoom}%`,
                  height: 'auto',
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  objectFit: objectFit,
                }}
                className="transition-transform"
              />
              <div className="absolute inset-0 border-4 border-omega-blue pointer-events-none opacity-50"></div>
            </div>
            <p className="text-xs text-gray-500">Drag to reposition image</p>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Zoom Level</label>
            <div className="flex items-center gap-4">
              <ZoomOut size={18} className="text-gray-500" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <ZoomIn size={18} className="text-gray-500" />
              <span className="text-sm font-bold w-12">{zoom.toFixed(2)}x</span>
            </div>
          </div>

          {/* Alignment Options */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Horizontal Alignment</label>
            <div className="flex gap-3">
              <button
                onClick={() => setAlignment('left')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  alignment === 'left'
                    ? 'bg-omega-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlignLeft size={18} /> Left
              </button>
              <button
                onClick={() => setAlignment('center')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  alignment === 'center'
                    ? 'bg-omega-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlignCenter size={18} /> Center
              </button>
              <button
                onClick={() => setAlignment('right')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  alignment === 'right'
                    ? 'bg-omega-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlignRight size={18} /> Right
              </button>
            </div>
          </div>

          {/* Object Fit Options */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Fit Style</label>
            <div className="grid grid-cols-3 gap-3">
              {(['contain', 'cover', 'fill'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setObjectFit(fit)}
                  className={`py-2 px-3 rounded-lg font-bold transition capitalize ${
                    objectFit === fit
                      ? 'bg-omega-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={createCroppedImage}
            className="flex-1 py-3 bg-omega-blue text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Save size={18} /> Save Image
          </button>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageEditor;
