"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

const currencies = [
  { code: "USD/ZWL", rate: "3,500.00", change: "+1.2%" },
  { code: "EUR/ZWL", rate: "3,780.00", change: "+0.8%" },
  { code: "GBP/ZWL", rate: "4,480.00", change: "+1.5%" },
  { code: "ZAR/ZWL", rate: "190.00", change: "-0.3%" },
  { code: "BTC/USD", rate: "68,245.00", change: "+2.1%" },
  { code: "ETH/USD", rate: "3,450.00", change: "+1.7%" },
  { code: "GOLD/USD", rate: "2,320.00", change: "+0.5%" },
  { code: "USD/ZWL", rate: "3,500.00", change: "+1.2%" }, // Duplicated to create seamless loop
]

export default function LiveRatesTicker() {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="bg-background/80 backdrop-blur-sm border-y py-2 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: isHovered ? 0 : "-50%",
        }}
        transition={{
          x: {
            duration: 20,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          },
        }}
      >
        {currencies.map((currency, index) => (
          <div key={`${currency.code}-${index}`} className="inline-flex items-center mx-6">
            <span className="font-medium">{currency.code}</span>
            <span className="mx-2 text-muted-foreground">{currency.rate}</span>
            <span className={`text-xs ${currency.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {currency.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

