import { useEffect, useRef, useState } from 'react'
import { Activity, Pause, Play } from 'lucide-react'
import { useTheme } from '../theme/ThemeContext.jsx'

function drawTrace(canvas, timestamp, animated, palette) {
  const bounds = canvas.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D context is unavailable for the simulated waveform.')
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(bounds.width * pixelRatio)
  canvas.height = Math.round(bounds.height * pixelRatio)
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  const width = bounds.width
  const height = bounds.height
  const middle = height / 2
  const phase = animated ? timestamp * 0.0015 : 0
  context.clearRect(0, 0, width, height)

  context.strokeStyle = palette.grid
  context.lineWidth = 1
  for (let x = 0; x <= width; x += 40) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  context.beginPath()
  context.moveTo(0, middle)
  context.lineTo(width, middle)
  context.strokeStyle = palette.center
  context.stroke()

  context.beginPath()
  for (let x = 0; x <= width; x += 2) {
    const y = middle
      + Math.sin(x * 0.045 - phase) * height * 0.09
      + Math.sin(x * 0.12 - phase * 1.7) * height * 0.035
      + Math.sin(x * 0.008 + phase * 0.55) * height * 0.055
    if (x === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.strokeStyle = palette.line
  context.lineWidth = 1.5
  context.shadowColor = palette.glow
  context.shadowBlur = 2
  context.stroke()
  context.shadowBlur = 0
}

export default function SimulatedSeismograph() {
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const styles = getComputedStyle(document.documentElement)
    const palette = {
      grid: styles.getPropertyValue('--resq-wave-grid').trim(),
      center: styles.getPropertyValue('--resq-wave-center').trim(),
      line: styles.getPropertyValue('--resq-wave-line').trim(),
      glow: styles.getPropertyValue('--resq-wave-glow').trim(),
    }
    let frameId = 0
    let disposed = false
    const render = (timestamp) => {
      if (disposed) return
      drawTrace(canvas, timestamp, isPlaying, palette)
      if (isPlaying) frameId = window.requestAnimationFrame(render)
    }

    render(0)
    const observer = new ResizeObserver(() => {
      if (!isPlaying) drawTrace(canvas, 0, false, palette)
    })
    observer.observe(canvas)

    return () => {
      disposed = true
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [isPlaying, theme])

  return (
    <section className="command-panel mb-5 overflow-hidden p-4 sm:p-5" aria-labelledby="simulated-seismograph-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/10 bg-teal-300/[0.06] text-teal-200"><Activity size={16} /></span>
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-amber-200">SIMULATION · NOT A STATION MEASUREMENT</p>
            <h2 id="simulated-seismograph-title" className="mt-1 text-sm font-semibold text-white">Illustrative waveform preview</h2>
            <p className="mt-1 text-[8px] leading-4 text-slate-500">A generated visual only. It is not connected to earthquake events, seismic instruments, or early-warning predictions.</p>
          </div>
        </div>
        <button type="button" aria-pressed={isPlaying} onClick={() => setIsPlaying((playing) => !playing)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[9px] font-medium text-slate-300 transition hover:bg-white/[0.04]">
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          {isPlaying ? 'Pause animation' : 'Play illustrative trace'}
        </button>
      </div>
      <canvas ref={canvasRef} className="mt-3 h-24 w-full rounded-xl border border-white/[0.05] bg-[#080e18]/75 sm:h-28" role="img" aria-label={`Synthetic illustrative waveform preview, animation ${isPlaying ? 'playing' : 'paused'}, not recorded seismic data`} />
      <p className="mt-2 text-[8px] text-slate-600">No amplitude, event count, channel, or instrument readings are reported.</p>
    </section>
  )
}
