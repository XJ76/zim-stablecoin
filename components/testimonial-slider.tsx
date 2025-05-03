"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Tendai Moyo",
    role: "Small Business Owner",
    content:
      "This stablecoin has transformed how I run my business. I no longer worry about inflation eating away my profits overnight. Transactions are fast and reliable.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Chiedza Nyathi",
    role: "Teacher",
    content:
      "As someone who sends money to family in rural areas, this platform has been a lifesaver. The fees are minimal, and my relatives can easily convert to local currency when needed.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Farai Mutasa",
    role: "Tech Entrepreneur",
    content:
      "The stability this coin provides has allowed me to focus on growing my startup instead of constantly worrying about currency fluctuations. The user experience is also excellent.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }

  const prev = () => {
    setCurrent((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [autoplay])

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="absolute right-6 top-6 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={prev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={next}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center md:px-10"
          >
            <Quote className="mb-6 h-12 w-12 text-primary opacity-20" />
            <p className="mb-6 text-lg md:text-xl">{testimonials[current].content}</p>
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src={testimonials[current].avatar} alt={testimonials[current].name} />
                <AvatarFallback>
                  {testimonials[current].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 text-center">
                <h4 className="font-semibold">{testimonials[current].name}</h4>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === current ? "bg-primary" : "bg-muted-foreground/30"}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

