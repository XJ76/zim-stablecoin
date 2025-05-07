"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Coin class
    class Coin {
      x: number
      y: number
      radius: number
      color: string
      speed: number
      angle: number
      rotationSpeed: number
      rotation: number
      symbol: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 15 + 10
        this.color = Math.random() > 0.5 ? "#f59e0b" : "#10b981"
        this.speed = Math.random() * 0.5 + 0.2
        this.angle = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.rotation = 0
        this.symbol = Math.random() > 0.5 ? "$" : "Z$"
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.rotation += this.rotationSpeed

        // Bounce off edges
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          if (this.x < this.radius || this.x > rect.width - this.radius) {
            this.angle = Math.PI - this.angle
          }
          if (this.y < this.radius || this.y > rect.height - this.radius) {
            this.angle = -this.angle
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        // Draw coin
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw symbol
        ctx.fillStyle = "#ffffff"
        ctx.font = `${this.radius * 0.8}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.symbol, 0, 0)

        ctx.restore()
      }
    }

    // Create coins
    const coins: Coin[] = []
    const coinCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 15000))

    for (let i = 0; i < coinCount; i++) {
      const rect = canvas.getBoundingClientRect()
      const x = Math.random() * rect.width
      const y = Math.random() * rect.height
      coins.push(new Coin(x, y))
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw connection lines
      ctx.strokeStyle = "rgba(100, 100, 100, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < coins.length; i++) {
        for (let j = i + 1; j < coins.length; j++) {
          const dx = coins[i].x - coins[j].x
          const dy = coins[i].y - coins[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(coins[i].x, coins[i].y)
            ctx.lineTo(coins[j].x, coins[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw coins
      coins.forEach((coin) => {
        coin.update()
        coin.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[400px] w-full max-w-[500px] rounded-lg border bg-background shadow-xl"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full rounded-lg"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-full bg-primary p-6 shadow-lg"
        >
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-4xl font-bold text-primary-foreground"
          >
            Z$
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
