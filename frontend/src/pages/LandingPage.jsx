import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const LandingPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.offsetWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.offsetHeight) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex overflow-hidden relative">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Left Section: AI Theme Banner (60%) */}
      <div className="w-3/5 relative flex items-center justify-center p-12">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        
        <div className="relative z-10 max-w-2xl">
          <div className="mb-8 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 leading-tight">
                AI-Powered<br />Fitness Diagnosis<br />System
              </h1>
            </div>
          </div>

          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Harnessing <span className="text-indigo-400 font-semibold">Deep Learning</span> and{' '}
            <span className="text-purple-400 font-semibold">Predictive Analytics</span> to define your
            personalized path to health optimization.
          </p>

          <div className="space-y-6">
            {[
              { icon: '🎯', text: 'Predictive Health Risk Analysis', delay: '0s' },
              { icon: '📸', text: 'Image-Based Calorie Estimation', delay: '0.1s' },
              { icon: '💪', text: 'Dynamic Diet & Workout Plans', delay: '0.2s' }
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-center space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2"
                style={{ animationDelay: item.delay }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-lg text-slate-200 font-medium group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Floating elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-bounce animation-delay-1000"></div>
        </div>
      </div>

      {/* Right Section: Login/Register (40%) */}
      <div className="w-2/5 relative flex items-center justify-center p-12 bg-gradient-to-bl from-slate-900/50 to-transparent backdrop-blur-sm">
        <div className="w-full max-w-md relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="mb-8 text-center">
              <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                System Access
              </h2>
              <p className="text-slate-400 text-sm">
                Use <span className="text-indigo-400 font-mono">test@example.com</span> /{' '}
                <span className="text-purple-400 font-mono">password123</span> to access the mock data.
              </p>
            </div>

            <AuthForm onAuthSuccess={onAuthSuccess} />

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secured with 256-bit encryption</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-20 blur-2xl animate-pulse animation-delay-2000"></div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;