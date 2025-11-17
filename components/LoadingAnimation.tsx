'use client';

import { useEffect, useState } from 'react';

export function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void">
      <style>{`
        @keyframes morph {
          0% {
            clip-path: polygon(
              20% 0%, 100% 0%, 100% 100%, 0% 100%
            );
            background: linear-gradient(135deg, #007AFF 0%, #00D4FF 100%);
          }
          25% {
            clip-path: polygon(
              0% 20%, 100% 0%, 100% 80%, 20% 100%
            );
            background: linear-gradient(135deg, #FF1744 0%, #00BCD4 100%);
          }
          50% {
            clip-path: polygon(
              30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%
            );
            background: linear-gradient(135deg, #00D4FF 0%, #FF1744 100%);
          }
          75% {
            clip-path: polygon(
              50% 0%, 100% 50%, 50% 100%, 0% 50%
            );
            background: linear-gradient(135deg, #FF6F00 0%, #00BCD4 100%);
          }
          100% {
            clip-path: polygon(
              20% 0%, 100% 0%, 100% 100%, 0% 100%
            );
            background: linear-gradient(135deg, #007AFF 0%, #00D4FF 100%);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 122, 255, 0.8), 0 0 80px rgba(0, 212, 255, 0.6);
          }
        }

        .morphing-shape {
          animation: morph 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite;
          width: 200px;
          height: 200px;
        }
      `}