import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Navbar({ program }) {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0f1c3a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#b0b8c8] hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/5"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="font-medium">العودة للبرامج</span>
        </button>

        {program && (
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">{program.icon}</span>
            <span className="text-xl font-extrabold" style={{ color: program.color }}>
              {program.name}
            </span>
          </div>
        )}

        {!program && (
          <Link to="/" className="text-xl font-extrabold text-white">
            خلية <span className="text-[#c9a84c]">الأعمال الإنسانية</span>
          </Link>
        )}

        <div className="w-[120px]" />
      </div>
    </nav>
  )
}