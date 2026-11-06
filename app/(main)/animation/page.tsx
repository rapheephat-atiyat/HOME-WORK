"use client"

import { checkLogin } from "@/utils/login";
import { Play } from "@tailgrids/icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"

const BALLS: Record<string, { label: string; image: string | null }> = {
  "1": { label: "None", image: null },
  "2": { label: "BasketBall", image: "/basketball.webp" },
  "3": { label: "FootBall", image: "/Football.webp" },
  "4": { label: "VolleyBall", image: "/volleyball.jpg" },
  "5": { label: "Face", image: "/me.gif" },
}

type AnimationState = {
  x: number
  y: number
  goX: number
  goY: number
  rotate: number
}

const FIELD_WIDTH = 600
const FIELD_HEIGHT = 450
const BALL_SIZE = 100

export default function Page() {
  const [ball, setBall] = useState(BALLS["1"])
  const [running, setRunning] = useState(false)
  const [velocity, setVelocity] = useState(10)
  const [animation, setAnimation] = useState<AnimationState>(() => {
    const startX = 0
    const startY = 0

    const goX = Math.round(Math.random()) * 2 - 1
    const goY = Math.round(Math.random()) * 2 - 1

    return { x: startX, y: startY, goX, goY, rotate: 0 }
  })

  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const router = useRouter();
  useEffect(() => checkLogin(router, "/animation"), [router])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (BALLS[e.key]) {
        setBall(BALLS[e.key])
      }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault()
        setRunning((old) => !old)
      }
      if (e.key === "+") {
        setVelocity((old) => old + 5)
      } else if (e.key === "-") {
        setVelocity((old) => Math.max(old - 5, 1))
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => {
        setAnimation((old) => {
          let { x, y, goX, goY, rotate } = old

          const maxX = FIELD_WIDTH - BALL_SIZE
          const maxY = FIELD_HEIGHT - BALL_SIZE

          let nextX = x + goX * velocity
          let nextY = y + goY * velocity

          if (nextX <= 0) {
            nextX = 0
            goX = 1
          } else if (nextX >= maxX) {
            nextX = maxX
            goX = -1
          }

          if (nextY <= 0) {
            nextY = 0
            goY = 1
          } else if (nextY >= maxY) {
            nextY = maxY
            goY = -1
          }

          return { x: nextX, y: nextY, goX, goY, rotate: (rotate + 4) % 360 }
        })
      }, 16)
    } else {
      if (timer.current) {
        clearInterval(timer.current)
        timer.current = null
      }
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
        timer.current = null
      }
    }
  }, [running, velocity])

  return (
    <div className="animation-page flex flex-col items-center gap-4 p-4">
      <h1 className="text-center text-2xl font-bold">
        68000639 นายรพีภัทร เอติยัติ
      </h1>

      <div
        className="relative mx-auto overflow-hidden border-2 border-red-500"
        style={{
          width: `${FIELD_WIDTH}px`,
          height: `${FIELD_HEIGHT}px`,
          backgroundImage: "url('/wood-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute top-0 left-0 rounded-full"
          style={{
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
            backgroundColor: ball.image ? "transparent" : "#E5E4E2",
            border: !ball.image ? "1px solid black" : "none",
            backgroundImage: ball.image ? `url('${ball.image}')` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translate(${animation.x}px, ${animation.y}px) rotate(${animation.rotate}deg)`,
            willChange: "transform",
          }}
        />
      </div>

      <div
        className="mx-auto flex items-center justify-between border-2 border-red-500 p-2"
        style={{ width: "600px" }}
      >
        {!running ? (
          <button
            className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            onClick={() => setRunning(true)}
          >
            <Play size={16} /> Play
          </button>
        ) : (
          <button
            className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => setRunning(false)}
          >
            ⏸ Pause
          </button>
        )}

        <div className="flex gap-2">
          {Object.values(BALLS).map((b) => (
            <button
              key={b.label}
              className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${ball.label === b.label
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              onClick={() => setBall({ label: b.label, image: b.image })}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mx-auto flex flex-col gap-1 border-2 border-red-500 p-3 text-sm"
        style={{ width: "600px" }}
      >
        <div>Velocity = {velocity || 1}</div>
        <div>Ball = {ball.label}</div>
        <div>
          <span className="mr-1 rounded bg-gray-500 px-2 py-0.5 text-xs text-white">
            spacebar
          </span>
          เริ่ม/หยุด
        </div>
        <div>
          <span className="mr-1 rounded bg-gray-500 px-2 py-0.5 text-xs text-white">
            +
          </span>
          เพิ่ม velocity
        </div>
        <div>
          <span className="mr-1 rounded bg-gray-500 px-2 py-0.5 text-xs text-white">
            -
          </span>
          ลด velocity
        </div>
        <div>
          <span className="mr-1 rounded bg-gray-500 px-2 py-0.5 text-xs text-white">
            1 - 5
          </span>
          เปลี่ยนบอล
        </div>
      </div>
    </div>
  )
}
