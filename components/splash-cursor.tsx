"use client"
import { useEffect, useRef } from "react"

interface ColorRGB {
  r: number
  g: number
  b: number
}

interface SplashCursorProps {
  SIM_RESOLUTION?: number
  DYE_RESOLUTION?: number
  CAPTURE_RESOLUTION?: number
  DENSITY_DISSIPATION?: number
  VELOCITY_DISSIPATION?: number
  PRESSURE?: number
  PRESSURE_ITERATIONS?: number
  CURL?: number
  SPLAT_RADIUS?: number
  SPLAT_FORCE?: number
  SHADING?: boolean
  COLOR_UPDATE_SPEED?: number
  BACK_COLOR?: ColorRGB
  TRANSPARENT?: boolean
}

export default function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Array<{ x: number; y: number; vx: number; vy: number; color: ColorRGB; life: number }> = []
    let animationFrameId: number

    function generateColor(): ColorRGB {
      const purpleVariants = [
        { r: 0.6, g: 0.4, b: 1.0 },
        { r: 0.5, g: 0.3, b: 0.9 }, 
        { r: 0.4, g: 0.2, b: 0.8 }, 
        { r: 0.7, g: 0.5, b: 1.0 }, 
      ]
      return purpleVariants[Math.floor(Math.random() * purpleVariants.length)]
    }

    function addParticle(x: number, y: number) {
      const color = generateColor()
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color,
          life: 1.0,
        })
      }
    }

    function updateParticles() {
      particles = particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        p.life -= 0.01
        return p.life > 0
      })
    }

    function renderParticles() {
      if (TRANSPARENT) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = `rgb(${Math.floor(BACK_COLOR.r * 255)}, ${Math.floor(BACK_COLOR.g * 255)}, ${Math.floor(BACK_COLOR.b * 255)})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      particles.forEach((p) => {
        ctx.globalAlpha = p.life
        ctx.fillStyle = `rgb(${Math.floor(p.color.r * 255)}, ${Math.floor(p.color.g * 255)}, ${Math.floor(p.color.b * 255)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1.0 
    }

    function animate() {
      updateParticles()
      renderParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    function resizeCanvas() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(e.touches[i].clientX, e.touches[i].clientY)
      }
    }

    resizeCanvas()
    animate()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
  ])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        id="fluid"
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
        }}
      />
    </div>
  )
}