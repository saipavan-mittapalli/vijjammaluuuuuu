import { useState, useCallback, useRef, useEffect } from "react";
import confetti from "canvas-confetti";

const GRADIENTS = [
  "linear-gradient(135deg, hsl(340 80% 92%), hsl(320 70% 90%), hsl(280 60% 92%))",
  "linear-gradient(135deg, hsl(200 80% 90%), hsl(220 70% 88%), hsl(260 60% 90%))",
  "linear-gradient(135deg, hsl(120 60% 90%), hsl(160 50% 88%), hsl(180 60% 90%))",
  "linear-gradient(135deg, hsl(30 90% 90%), hsl(50 80% 88%), hsl(40 70% 85%))",
  "linear-gradient(135deg, hsl(280 70% 90%), hsl(300 60% 88%), hsl(320 70% 90%))",
];

const Index = () => {
  const [screen, setScreen] = useState<"404" | "valentine">("404");
  const [accepted, setAccepted] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [noClickCount, setNoClickCount] = useState(0);
  const [noPos, setNoPos] = useState<{ top: string; left: string } | null>(null);
  const [bgGradient, setBgGradient] = useState(GRADIENTS[0]);
  const [gradientIdx, setGradientIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => setScreen("valentine");

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 5000;
    const colors = ["#ff69b4", "#ff1493", "#ff6b6b", "#ffd700", "#ff85a2"];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleYes = () => {
    setAccepted(true);
    fireConfetti();
    setTimeout(() => setShowButtons(false), 1000);
  };

  const handleNo = () => {
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);
    const newIdx = (gradientIdx + 1) % GRADIENTS.length;
    setGradientIdx(newIdx);
    setBgGradient(GRADIENTS[newIdx]);
    // Jump NO button
    const top = Math.random() * 70 + 10;
    const left = Math.random() * 70 + 10;
    setNoPos({ top: `${top}%`, left: `${left}%` });
  };

  const emoji = noClickCount >= 2 ? "😭" : "💔";

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden transition-all duration-1000"
      style={{ background: bgGradient }}
    >
      {/* Floating hearts background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {screen === "valentine" && (
          <>
            <span className="absolute top-[5%] left-[10%] text-4xl opacity-20 animate-float" style={{ animationDelay: "0s" }}>💕</span>
            <span className="absolute top-[15%] right-[15%] text-3xl opacity-15 animate-float" style={{ animationDelay: "1s" }}>💗</span>
            <span className="absolute bottom-[25%] left-[25%] text-5xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>💖</span>
            <span className="absolute bottom-[15%] right-[10%] text-3xl opacity-20 animate-float" style={{ animationDelay: "0.5s" }}>✨</span>
            <span className="absolute top-[40%] left-[5%] text-3xl opacity-15 animate-float" style={{ animationDelay: "1.5s" }}>💝</span>
            <span className="absolute top-[8%] left-[50%] text-4xl opacity-20 animate-float" style={{ animationDelay: "0.8s" }}>💘</span>
            <span className="absolute top-[60%] right-[5%] text-3xl opacity-15 animate-float" style={{ animationDelay: "2.5s" }}>💓</span>
            <span className="absolute bottom-[5%] left-[45%] text-4xl opacity-20 animate-float" style={{ animationDelay: "1.2s" }}>💞</span>
            <span className="absolute top-[30%] right-[30%] text-2xl opacity-15 animate-float" style={{ animationDelay: "3s" }}>❤️</span>
            <span className="absolute bottom-[35%] right-[25%] text-3xl opacity-10 animate-float" style={{ animationDelay: "0.3s" }}>💟</span>
            <span className="absolute top-[70%] left-[15%] text-2xl opacity-20 animate-float" style={{ animationDelay: "1.8s" }}>💗</span>
          </>
        )}
      </div>

      {/* 404 Screen */}
      <div
        className={`absolute flex flex-col items-center gap-6 transition-all duration-700 ${
          screen === "404" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl bg-card/80 backdrop-blur-sm p-10 md:p-16 shadow-xl text-center">
          <p className="text-8xl md:text-9xl font-bold text-primary mb-4">404</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Oops! Looks like this page ran away... 🏃‍♂️
          </p>
          <button
            onClick={handleRefresh}
            className="rounded-xl bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Valentine Screen */}
      <div
        className={`flex flex-col items-center gap-6 transition-all duration-700 ${
          screen === "valentine" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl bg-card/80 backdrop-blur-sm p-8 md:p-14 shadow-xl text-center max-w-md mx-4">
          <p className="text-6xl mb-4 animate-heartbeat">{accepted ? "💖" : emoji}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {accepted ? "Happy Birthday Day my LOVE 💕" : "Will you be my Valentine?"}
          </h2>

          {/* Please Consider text */}
          {!accepted && noClickCount >= 2 && (
            <p className="text-lg text-foreground/70 mb-4 animate-pulse">Please Consider 😢</p>
          )}
          {(accepted || noClickCount < 2) && <div className="mb-4" />}

          {/* Agreement text */}
          <div
            className={`overflow-hidden transition-all duration-700 ${
              accepted ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-xl bg-secondary/60 p-5 text-left">
              <p className="font-semibold text-foreground mb-3">
                By clicking YES you agree to:
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li>💕 Unlimited cuddles</li>
                <li>❤️ Lifetime supply of Love</li>
                <li>🍕 Mutual food stealing rights</li>
              </ul>
              <p className="mt-4 font-semibold text-primary">
                Effective immediately! 🚀
              </p>
              <p className="mt-3 font-bold text-center text-foreground text-lg">
                From your Ammuluuu 💘
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            className={`flex items-center justify-center gap-4 transition-all duration-700 ${
              showButtons ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <button
              onClick={handleYes}
              className="rounded-xl bg-primary px-8 py-3 text-lg font-bold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              YES 💖
            </button>

            {!noPos ? (
              <button
                onClick={handleNo}
                className="rounded-xl bg-muted px-8 py-3 text-lg font-bold text-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                NO {emoji}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Floating NO button */}
      {screen === "valentine" && showButtons && noPos && (
        <button
          onClick={handleNo}
          className="absolute rounded-xl bg-muted px-8 py-3 text-lg font-bold text-foreground shadow-lg transition-all duration-300 z-50 animate-shake"
          style={{ top: noPos.top, left: noPos.left }}
        >
          NO {emoji}
        </button>
      )}
    </div>
  );
};

export default Index;
