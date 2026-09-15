'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ProctorCameraProps {
  attemptId: string;
  onAutoSubmit?: () => void;
  className?: string;
}

export default function ProctorCamera({
  attemptId,
  onAutoSubmit,
  className = '',
}: ProctorCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [violationsCount, setViolationsCount] = useState(0);
  const [warningModal, setWarningModal] = useState<{
    show: boolean;
    level: number;
    title: string;
    message: string;
  }>({
    show: false,
    level: 0,
    title: '',
    message: '',
  });

  const [faceStatus, setFaceStatus] = useState<'OK' | 'NO_FACE' | 'SUSPICIOUS'>('OK');
  const [isMinimized, setIsMinimized] = useState(false);

  // Send proctoring violation to backend
  const logViolation = useCallback(
    async (eventType: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'TERMINATION', metadata: any = {}) => {
      try {
        const { LocalMonitoringRepository } = await import('@/lib/repositories');
        await LocalMonitoringRepository.persistLog(attemptId, eventType, JSON.stringify(metadata));
        
        setViolationsCount(prev => {
          const vCount = prev + 1;
          if (vCount === 3) {
            setWarningModal({
              show: true,
              level: 3,
              title: 'Exam Terminated',
              message: 'Maximum proctoring violation threshold reached. Your exam is being automatically submitted.',
            });
            if (onAutoSubmit) {
              setTimeout(() => onAutoSubmit(), 2000);
            }
          } else if (vCount === 2) {
            setWarningModal({
              show: true,
              level: 2,
              title: 'Final Warning (Strike 2)',
              message: 'Multiple proctoring infractions recorded. A third violation will result in immediate exam termination.',
            });
          } else if (vCount === 1) {
            setWarningModal({
              show: true,
              level: 1,
              title: 'Proctoring Advisory Notice',
              message: 'Unusual activity detected (tab switch, window blur, or face not centered). Please maintain focus on the exam window.',
            });
          }
          return vCount;
        });
      } catch (e) {
        console.error('Failed to log proctor event:', e);
      }
    },
    [attemptId, onAutoSubmit]
  );

  // Initialize webcam
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false,
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setStreamActive(true);
          };
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError('Camera access required for AI proctoring verification.');
      }
    }

    setupCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Event listeners for window blur, tab hidden, and fullscreen exit
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('TAB_HIDDEN', 'WARNING', { note: 'Candidate switched tabs or minimized browser' });
      }
    };

    const handleBlur = () => {
      logViolation('WINDOW_BLUR', 'WARNING', { note: 'Candidate clicked outside exam window' });
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation('FULLSCREEN_EXITED', 'WARNING', { note: 'Candidate exited fullscreen mode' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [logViolation]);

  // Canvas-based computer vision face presence tracker
  useEffect(() => {
    if (!streamActive) return;

    let animId: number;
    let noFaceCounter = 0;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const { data, width, height } = frame;

          // Simple skin-tone pixel luminosity & distribution detector
          let skinPixels = 0;
          let sumX = 0;
          let sumY = 0;

          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Standard skin color filter in RGB space
            if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
              skinPixels++;
              const pixelIdx = i / 4;
              sumX += pixelIdx % width;
              sumY += Math.floor(pixelIdx / width);
            }
          }

          const sampledTotal = data.length / 16;
          const ratio = skinPixels / sampledTotal;

          if (ratio < 0.05) {
            noFaceCounter++;
            if (noFaceCounter > 25) {
              setFaceStatus('NO_FACE');
            }
          } else {
            noFaceCounter = 0;
            setFaceStatus('OK');

            // Draw clean subtle proctoring bounding box around face center
            const avgX = (sumX / skinPixels) || width / 2;
            const avgY = (sumY / skinPixels) || height / 2;
            const boxW = width * 0.45;
            const boxH = height * 0.55;

            ctx.strokeStyle = '#06b6d4'; // Cyan bounding box
            ctx.lineWidth = 2;
            ctx.strokeRect(avgX - boxW / 2, avgY - boxH / 2, boxW, boxH);

            // Draw target crosshairs
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(avgX, avgY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      animId = requestAnimationFrame(processFrame);
    };

    animId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(animId);
  }, [streamActive]);

  return (
    <>
      {/* Proctoring Card in Exam Session */}
      <div
        className={`bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 shadow-2xl backdrop-blur-xl transition-all ${
          isMinimized ? 'w-48' : 'w-64'
        } ${className}`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                faceStatus === 'OK'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-rose-500 animate-ping'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Proctor
            </span>
          </div>

          <div className="flex items-center gap-1">
            {violationsCount > 0 && (
              <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold rounded border border-rose-500/30">
                {violationsCount} {violationsCount === 1 ? 'Strike' : 'Strikes'}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-slate-200 text-xs px-1"
            >
              {isMinimized ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3]">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <canvas
              ref={canvasRef}
              width={160}
              height={120}
              className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
            />

            {/* Status overlay */}
            <div className="absolute bottom-1 left-1 right-1 px-2 py-1 bg-slate-950/80 backdrop-blur rounded flex items-center justify-between text-[10px]">
              <span className="text-slate-300">Face Visibility:</span>
              <span
                className={`font-semibold ${
                  faceStatus === 'OK' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {faceStatus === 'OK' ? 'Verified' : 'Out of Frame'}
              </span>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-2 text-center text-xs text-amber-400">
                {cameraError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warning Modal */}
      {warningModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">
                ⚠
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{warningModal.title}</h4>
                <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                  Proctoring Violation Recorded
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {warningModal.message}
            </p>

            <button
              type="button"
              onClick={() => setWarningModal((prev) => ({ ...prev, show: false }))}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              I Understand & Resume Exam
            </button>
          </div>
        </div>
      )}
    </>
  );
}
