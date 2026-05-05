import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function NotFound() {
  const navigate = useNavigate()
  const green = '#709921'
  const orange = '#fb923c'
  const beige = '#fef3c7'
  const [hoverLeft,  setHoverLeft]  = useState(false)
  const [hoverRight, setHoverRight] = useState(false)

  return (
    <div className="relative w-full h-screen flex overflow-hidden font-serif">

      {/* Bouton de gauche — orange */}
      <button
        onClick={() => navigate('/')}
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
        className="group flex-1 h-full flex flex-col justify-end p-10
                   transition-colors duration-200"
        style={{ backgroundColor: hoverLeft ? 'orange'  : 'beige' }}
      >
        <div className="flex flex-col gap-3 items-start">
          <span className="text-[13px] font-black uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: hoverLeft ? 'white' : 'orange' }}>
            Retour au potager
          </span>
          <div className={`flex items-center transition-transform duration-300 ${hoverLeft ? '-translate-x-3' : ''}`}>
            <svg width="100" height="24" viewBox="0 0 100 24" fill="none"
                 style={{ color: hoverLeft ? 'white' : 'orange' }}
                 className="transition-colors duration-200">
              <path d="M98 12 L10 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
              <path d="M22 3 L3 12 L22 21" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Bouton de droite — vert */}
      <button
        onClick={() => navigate(-1)}
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
        className="group flex-1 h-full flex flex-col justify-end p-10 transition-colors duration-200"
        style={{ backgroundColor: hoverRight ? green : 'beige' }}
      >
        <div className="flex flex-col gap-3 items-end">
          <span className="text-[13px] font-black uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: hoverRight ? 'white' : green }}>
            Retour page précédante
          </span>
          <div className={`flex items-center transition-transform duration-300 ${hoverRight ? 'translate-x-3' : ''}`}>
            <svg width="100" height="24" viewBox="0 0 100 24" fill="none"
                 style={{ color: hoverRight ? 'white' : green }}
                 className="transition-colors duration-200">
              <path d="M2 12 L90 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
              <path d="M78 3 L97 12 L78 21" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      {/* 404 par-dessus au milieu */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-6">
        <h1 className="text-[10rem] font-bold italic leading-none">
          <span style={{ color: hoverLeft ? green : 'orange' }} className="transition-colors duration-200">4</span>
          <span className="text-orange-400">🥕</span>
          <span className="text-orange-400">4</span>
        </h1>
        <h2 className="text-2xl font-bold italic mt-4">
          <span style={{ color: (hoverLeft || hoverRight) ? green : 'orange' }} className="transition-colors duration-200">. . . Légume n</span>
          <span className="text-orange-400">on trouvé . . .</span>
        </h2>
        <p className="text-sm italic text-orange-300 mt-2">
          Michel Dumas est formel : il n'y a rien à cuisiner ici.
        </p>
      </div>

    </div>
  )
}