import React, { useState } from 'react';
import { UploadCloud, Activity, CheckCircle, Loader2, Image as ImageIcon, RotateCcw, ChevronRight } from 'lucide-react';

const STRATA_LINES = Array.from({ length: 8 }, (_, i) => i);

function StrataBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: 'linear-gradient(180deg, #1a1510 0%, #2a1f14 40%, #1e1a12 100%)',
      pointerEvents: 'none'
    }}>
      {STRATA_LINES.map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 0, right: 0,
          top: `${10 + i * 11}%`,
          height: `${2 + (i % 3)}px`,
          background: `rgba(${180 + i * 8}, ${140 + i * 6}, ${80 + i * 4}, ${0.04 + i * 0.01})`,
          transform: `skewY(${(i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.1)}deg)`,
        }} />
      ))}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4
      }} />
    </div>
  );
}

const ROCK_CLASSES = [
  { name: 'Marbre', icon: '◈', color: '#e8d5a3', bg: 'rgba(232,213,163,0.12)' },
  { name: 'Quartzite', icon: '◇', color: '#b8cce0', bg: 'rgba(184,204,224,0.10)' },
  { name: 'Gneiss', icon: '◆', color: '#c4b5a0', bg: 'rgba(196,181,160,0.10)' },
  { name: 'Rhyolite', icon: '◉', color: '#d4a898', bg: 'rgba(212,168,152,0.10)' },
  { name: 'Andésite', icon: '◑', color: '#a0b8a0', bg: 'rgba(160,184,160,0.10)' },
  { name: 'Schiste', icon: '◐', color: '#b0a8c8', bg: 'rgba(176,168,200,0.10)' },
];

const labelStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: '10px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(200,180,140,0.5)',
};

const dividerStyle = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(200,170,100,0.2), transparent)',
  margin: '0',
};

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const LOADING_STEPS = [
    'Calibration spectrale...',
    'Extraction des features CNN...',
    'Classification minéralogique...',
  ];

  const handleImageUpload = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleAnalysis = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setLoadingStep(0);
    const stepInterval = setInterval(() => {
      setLoadingStep(s => s + 1);
    }, 900);
    setTimeout(() => {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setResult({
        prediction: 'Marbre',
        confidence: 94.5,
        formation: 'Métamorphique',
        hardness: '3–4 Mohs',
        details: [
          { class: 'Marbre', score: 94.5 },
          { class: 'Quartzite', score: 3.2 },
          { class: 'Gneiss', score: 1.1 },
          { class: 'Rhyolite', score: 0.8 },
          { class: 'Andésite', score: 0.3 },
          { class: 'Schiste', score: 0.1 },
        ],
      });
    }, 2800);
  };

  const reset = () => { setSelectedImage(null); setResult(null); setIsAnalyzing(false); };

  const goldAccent = '#c8a96e';
  const cardBg = 'rgba(255,250,240,0.04)';
  const cardBorder = 'rgba(200,170,100,0.15)';

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Georgia', serif", position: 'relative' }}>
      <StrataBackground />

      {/* HEADER */}
      <header style={{
        position: 'relative', zIndex: 10,
        borderBottom: `1px solid ${cardBorder}`,
        background: 'rgba(20,15,10,0.8)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', border: `1px solid ${goldAccent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(45deg)',
            }}>
              <span style={{ transform: 'rotate(-45deg)', fontSize: '16px' }}>◈</span>
            </div>
            <div>
              <div style={{ color: goldAccent, fontFamily: "'Courier New', monospace", fontSize: '13px', letterSpacing: '0.3em', fontWeight: 'bold' }}>GEOSCANNER</div>
              <div style={{ color: 'rgba(200,180,140,0.4)', fontFamily: "'Courier New', monospace", fontSize: '9px', letterSpacing: '0.2em' }}>SYSTÈME DE CLASSIFICATION IA</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {[
              { icon: <Activity size={12} />, label: '6 CLASSES' },
              { icon: <CheckCircle size={12} />, label: 'CNN ACTIF' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(200,170,100,0.5)', fontFamily: "'Courier New', monospace", fontSize: '10px', letterSpacing: '0.15em' }}>
                {icon}<span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* LEFT — HERO */}
          <div style={{ paddingTop: '16px' }}>
            <div style={{ ...labelStyle, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '30px', height: '1px', background: 'rgba(200,170,100,0.4)' }} />
              PROJET DEEP LEARNING — v2.1
            </div>

            <h1 style={{
              fontSize: '42px', lineHeight: '1.15', fontWeight: 'normal',
              color: '#f0e8d8', margin: '0 0 8px',
              fontStyle: 'italic',
            }}>
              L'intelligence de la{' '}
              <span style={{ color: goldAccent, fontStyle: 'normal', fontFamily: "'Courier New', monospace", fontSize: '36px' }}>
                pierre.
              </span>
            </h1>
            <h2 style={{
              fontSize: '42px', lineHeight: '1.15', fontWeight: 'normal',
              color: 'rgba(240,232,216,0.4)', margin: '0 0 32px',
              fontStyle: 'italic',
            }}>
              Révélée par le réseau.
            </h2>

            <div style={dividerStyle} />

            <p style={{
              marginTop: '28px', marginBottom: '36px',
              fontSize: '15px', lineHeight: '1.8',
              color: 'rgba(210,195,170,0.7)',
              fontFamily: "'Georgia', serif",
            }}>
              Ce système exploite des réseaux de neurones convolutifs entraînés sur des milliers d'échantillons pour identifier la signature minéralogique de 6 familles de roches magmatiques et métamorphiques.
            </p>

            {/* Rock classes grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ROCK_CLASSES.map(({ name, icon, color, bg }) => (
                <div key={name} style={{
                  padding: '10px 14px',
                  background: bg,
                  border: `1px solid rgba(200,170,100,0.1)`,
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ color, fontSize: '14px' }}>{icon}</span>
                  <span style={{ ...labelStyle, color: 'rgba(210,195,170,0.6)', letterSpacing: '0.1em', fontSize: '11px' }}>{name}</span>
                </div>
              ))}
            </div>

            {/* Field notes */}
            <div style={{
              marginTop: '32px', padding: '16px 20px',
              borderLeft: `2px solid rgba(200,170,100,0.3)`,
              background: 'rgba(200,170,100,0.04)',
            }}>
              <div style={{ ...labelStyle, marginBottom: '8px' }}>NOTE DE TERRAIN</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(210,195,170,0.5)', lineHeight: '1.7', fontStyle: 'italic' }}>
                "La roche est la mémoire de la Terre. Chaque cristal, une page d'histoire."
              </p>
            </div>
          </div>

          {/* RIGHT — ANALYSIS PANEL */}
          <div style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Corner accents */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
              const [v, h] = pos.split('-');
              return (
                <div key={pos} style={{
                  position: 'absolute',
                  [v]: 0, [h]: 0,
                  width: '16px', height: '16px',
                  borderTop: v === 'top' ? `1px solid ${goldAccent}` : 'none',
                  borderBottom: v === 'bottom' ? `1px solid ${goldAccent}` : 'none',
                  borderLeft: h === 'left' ? `1px solid ${goldAccent}` : 'none',
                  borderRight: h === 'right' ? `1px solid ${goldAccent}` : 'none',
                }} />
              );
            })}

            {/* Panel header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${cardBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ ...labelStyle }}>ÉCHANTILLON — ANALYSE CNN</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ width: '6px', height: '6px', background: i === 0 ? goldAccent : 'rgba(200,170,100,0.2)' }} />
                ))}
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {/* UPLOAD ZONE */}
              {!selectedImage ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `1px dashed ${isDragging ? goldAccent : 'rgba(200,170,100,0.25)'}`,
                    padding: '48px 24px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    cursor: 'pointer',
                    background: isDragging ? 'rgba(200,170,100,0.06)' : 'rgba(255,250,240,0.02)',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div style={{
                    width: '56px', height: '56px',
                    border: `1px solid rgba(200,170,100,0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: 'rotate(45deg)',
                    marginBottom: '8px',
                  }}>
                    <UploadCloud size={22} style={{ transform: 'rotate(-45deg)', color: goldAccent, opacity: 0.7 }} />
                  </div>
                  <div style={{ color: '#d4c8b0', fontSize: '15px', fontWeight: 'normal' }}>Déposer un échantillon</div>
                  <div style={{ ...labelStyle, fontSize: '10px' }}>JPG · PNG — Drag & Drop ou cliquer</div>
                  <input id="file-input" type="file" style={{ display: 'none' }} accept="image/png,image/jpeg" onChange={(e) => handleImageUpload(e.target.files[0])} />
                </div>
              ) : (
                <div>
                  {/* Image preview */}
                  <div style={{
                    position: 'relative', overflow: 'hidden',
                    height: '220px',
                    border: `1px solid ${cardBorder}`,
                    marginBottom: '20px',
                  }}>
                    <img src={selectedImage} alt="Échantillon" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(20,15,10,0.7) 0%, transparent 50%)',
                    }} />
                    {/* Grid overlay */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 300 220" preserveAspectRatio="none">
                      {[50, 100, 150, 200, 250].map(x => <line key={x} x1={x} y1="0" x2={x} y2="220" stroke={goldAccent} strokeWidth="0.5" />)}
                      {[44, 88, 132, 176].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke={goldAccent} strokeWidth="0.5" />)}
                    </svg>
                    {!isAnalyzing && !result && (
                      <button onClick={reset} style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(20,15,10,0.8)', border: `1px solid ${cardBorder}`,
                        color: goldAccent, cursor: 'pointer', padding: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <RotateCcw size={14} />
                      </button>
                    )}
                    <div style={{ position: 'absolute', bottom: '10px', left: '12px', ...labelStyle, fontSize: '9px', color: 'rgba(200,170,100,0.6)' }}>
                      SAMPLE_REF_{Date.now().toString().slice(-6)}
                    </div>
                  </div>

                  {/* Analyze button */}
                  {!result && (
                    <button
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                      style={{
                        width: '100%', padding: '14px',
                        background: isAnalyzing ? 'rgba(200,170,100,0.08)' : 'rgba(200,170,100,0.12)',
                        border: `1px solid ${isAnalyzing ? 'rgba(200,170,100,0.2)' : goldAccent}`,
                        color: goldAccent,
                        cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '11px', letterSpacing: '0.2em',
                        transition: 'all 0.2s',
                        marginBottom: '20px',
                      }}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          <span>{LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]}</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={14} />
                          <span>LANCER L'INFÉRENCE CNN</span>
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  )}

                  {/* Loading progress */}
                  {isAnalyzing && (
                    <div style={{ marginBottom: '20px' }}>
                      {LOADING_STEPS.map((step, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '6px 0',
                          opacity: i <= loadingStep ? 1 : 0.25,
                          transition: 'opacity 0.4s',
                        }}>
                          <div style={{
                            width: '6px', height: '6px',
                            background: i < loadingStep ? goldAccent : i === loadingStep ? goldAccent : 'transparent',
                            border: `1px solid ${i <= loadingStep ? goldAccent : 'rgba(200,170,100,0.3)'}`,
                            flexShrink: 0,
                          }} />
                          <span style={{ ...labelStyle, color: i <= loadingStep ? 'rgba(200,170,100,0.7)' : 'rgba(200,170,100,0.25)' }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RESULTS */}
                  {result && (
                    <div style={{ animation: 'fadeUp 0.5s ease' }}>
                      {/* Main prediction */}
                      <div style={{
                        padding: '20px',
                        border: `1px solid rgba(200,170,100,0.25)`,
                        background: 'rgba(200,170,100,0.06)',
                        marginBottom: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        <div style={{ ...labelStyle, marginBottom: '6px' }}>CLASSIFICATION PRINCIPALE</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '32px', color: '#f0e8d8', fontStyle: 'italic' }}>{result.prediction}</span>
                          <span style={{ fontSize: '28px', color: goldAccent, fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>
                            {result.confidence}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>
                            <div style={{ ...labelStyle, fontSize: '9px', marginBottom: '2px' }}>FORMATION</div>
                            <div style={{ fontSize: '12px', color: 'rgba(210,195,170,0.7)', fontFamily: "'Courier New', monospace" }}>{result.formation}</div>
                          </div>
                          <div>
                            <div style={{ ...labelStyle, fontSize: '9px', marginBottom: '2px' }}>DURETÉ</div>
                            <div style={{ fontSize: '12px', color: 'rgba(210,195,170,0.7)', fontFamily: "'Courier New', monospace" }}>{result.hardness}</div>
                          </div>
                        </div>
                      </div>

                      {/* Softmax output */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ ...labelStyle, marginBottom: '12px' }}>SORTIE SOFTMAX — TOP 3</div>
                        {result.details.slice(0, 3).map((item, i) => (
                          <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '12px', color: i === 0 ? '#f0e8d8' : 'rgba(210,195,170,0.5)', fontFamily: "'Courier New', monospace", letterSpacing: '0.05em' }}>
                                {item.class.toUpperCase()}
                              </span>
                              <span style={{ fontSize: '12px', color: i === 0 ? goldAccent : 'rgba(200,170,100,0.4)', fontFamily: "'Courier New', monospace" }}>
                                {item.score}%
                              </span>
                            </div>
                            <div style={{ height: '3px', background: 'rgba(200,170,100,0.1)', position: 'relative' }}>
                              <div style={{
                                position: 'absolute', left: 0, top: 0, height: '100%',
                                width: `${item.score}%`,
                                background: i === 0 ? goldAccent : 'rgba(200,170,100,0.3)',
                                transition: 'width 0.8s ease',
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={reset} style={{
                        width: '100%', padding: '12px',
                        background: 'transparent',
                        border: `1px solid rgba(200,170,100,0.2)`,
                        color: 'rgba(200,170,100,0.5)',
                        cursor: 'pointer',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '10px', letterSpacing: '0.2em',
                      }}>
                        ← ANALYSER UN AUTRE ÉCHANTILLON
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}