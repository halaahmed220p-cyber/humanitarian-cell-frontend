import { useEffect, useState } from 'react'

export default function BackgroundAnimation() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${10 + i * 20}%`,
      delay: `${i * 3}s`,
      duration: `${10 + Math.random() * 10}s`
    }))
    setParticles(newParticles)
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-float1 bg-amber-400/20 -top-[150px] -right-[100px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 animate-float2 bg-blue-400/20 -bottom-[100px] -left-[100px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 animate-float3 bg-amber-400/20 top-1/2 left-1/2" />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed w-1 h-1 rounded-full bg-amber-400/30 pointer-events-none z-[1]"
          style={{
            left: p.left,
            animation: `particleFloat ${p.duration} infinite linear`,
            animationDelay: p.delay
          }}
        />
      ))}
    </>
  )
}