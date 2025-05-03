"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// Zimbabwe provinces data
const provinces = [
  { id: "harare", name: "Harare", x: 58, y: 38, r: 8, users: 8500, transactions: 42000 },
  { id: "bulawayo", name: "Bulawayo", x: 20, y: 65, r: 7, users: 6200, transactions: 31000 },
  { id: "manicaland", name: "Manicaland", x: 75, y: 55, r: 6, users: 2800, transactions: 14000 },
  { id: "mashonaland_central", name: "Mashonaland Central", x: 50, y: 25, r: 5, users: 1500, transactions: 7500 },
  { id: "mashonaland_east", name: "Mashonaland East", x: 65, y: 35, r: 5, users: 1800, transactions: 9000 },
  { id: "mashonaland_west", name: "Mashonaland West", x: 30, y: 30, r: 5, users: 1600, transactions: 8000 },
  { id: "masvingo", name: "Masvingo", x: 55, y: 70, r: 5, users: 1400, transactions: 7000 },
  { id: "matabeleland_north", name: "Matabeleland North", x: 25, y: 45, r: 5, users: 900, transactions: 4500 },
  { id: "matabeleland_south", name: "Matabeleland South", x: 35, y: 80, r: 5, users: 800, transactions: 4000 },
  { id: "midlands", name: "Midlands", x: 40, y: 55, r: 6, users: 2000, transactions: 10000 },
]

export default function ZimbabweMap() {
  const [activeProvince, setActiveProvince] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleProvinceHover = (provinceId: string, x: number, y: number) => {
    setActiveProvince(provinceId)
    setTooltipPosition({ x, y })
  }

  const handleProvinceLeave = () => {
    setActiveProvince(null)
  }

  const getProvinceData = (provinceId: string) => {
    return provinces.find((province) => province.id === provinceId)
  }

  return (
    <div className="relative h-[400px] w-full">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        style={{ background: "url('/placeholder.svg?height=400&width=400') center/cover" }}
      >
        {/* Connection lines between provinces */}
        {provinces.map((province, i) =>
          provinces
            .slice(i + 1)
            .map((otherProvince, j) => (
              <motion.line
                key={`${province.id}-${otherProvince.id}`}
                x1={province.x}
                y1={province.y}
                x2={otherProvince.x}
                y2={otherProvince.y}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-primary/20"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
              />
            )),
        )}

        {/* Province circles */}
        {provinces.map((province, index) => (
          <g key={province.id}>
            <motion.circle
              cx={province.x}
              cy={province.y}
              r={province.r}
              className={`cursor-pointer ${
                activeProvince === province.id
                  ? "fill-primary stroke-primary-foreground"
                  : "fill-primary/40 stroke-primary/60"
              }`}
              strokeWidth="0.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                handleProvinceHover(province.id, rect.left + rect.width / 2, rect.top)
              }}
              onMouseLeave={handleProvinceLeave}
            />
            <motion.text
              x={province.x}
              y={province.y + province.r + 2}
              textAnchor="middle"
              fontSize="2"
              className="fill-current text-muted-foreground pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              {province.name}
            </motion.text>
          </g>
        ))}

        {/* Pulse animations for top provinces */}
        {provinces.slice(0, 3).map((province) => (
          <motion.circle
            key={`pulse-${province.id}`}
            cx={province.x}
            cy={province.y}
            r={province.r}
            className="fill-primary/0 stroke-primary"
            strokeWidth="0.5"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {activeProvince && (
        <div
          className="absolute z-10 rounded-lg border bg-background p-3 shadow-md"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 120}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-sm font-semibold">{getProvinceData(activeProvince)?.name}</div>
          <div className="mt-1 grid grid-cols-2 gap-x-4 text-xs">
            <div className="text-muted-foreground">Users:</div>
            <div className="text-right font-medium">{getProvinceData(activeProvince)?.users.toLocaleString()}</div>
            <div className="text-muted-foreground">Transactions:</div>
            <div className="text-right font-medium">
              {getProvinceData(activeProvince)?.transactions.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

