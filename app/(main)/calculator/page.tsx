"use client"

import { checkLogin } from "@/utils/login"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const btn = "size-12 rounded-[10px] border-[1.5px] border-[#808080] text-center text-lg sm:size-18 sm:rounded-[15px] sm:text-2xl disabled:cursor-not-allowed disabled:bg-[#555] disabled:text-[#999] disabled:opacity-60"
const green = `${btn} bg-[rgb(126,177,126)] text-[#008000]`
const purple = `${btn} bg-[rgb(193,148,223)]`
const red = `${btn} bg-[rgb(213,140,140)]`
const btnRow = "flex gap-1.5 sm:gap-3"

const insertSeparator = (str: string, separator = " ") => {
  let sign = ""
  if (str.startsWith("-")) {
    sign = "-"
    str = str.slice(1)
  }

  const [integer, decimal] = str.split(".")

  let resultString = ""
  let count = 0
  for (let index = integer.length - 1; index >= 0; index--) {
    resultString = integer[index] + resultString
    count++
    if (count % 3 === 0 && index !== 0) {
      resultString = separator + resultString
    }
  }

  if (str.includes(".")) {
    resultString = resultString + "." + decimal
  }
  return sign + resultString
}

export default function Page() {
  const [state, setState] = useState("first")
  const [display, setDisplay] = useState("0")
  const [first, setFirst] = useState(0)
  const [second, setSecond] = useState(0)
  const [operator, setOperator] = useState("?")
  const router = useRouter();
  useEffect(() => checkLogin(router, "/calculator"), [router])

  const calculate = (a: number, b: number) => {
    let result = a
    if (operator === "+") {
      result = a + b
    } else if (operator === "-") {
      result = a - b
    }
    return Number(result.toPrecision(12))
  }

  const numClick = (num: number) => {
    switch (state) {
      case "first":
        if (display === "0") {
          setDisplay(String(num))
        } else if (display.length < 9) {
          setDisplay(display + num)
        }
        break
      case "operator":
        setDisplay(String(num))
        setState("second")
        break
      case "second":
        if (display === "0") {
          setDisplay(String(num))
        } else if (display.length < 9) {
          setDisplay(display + num)
        }
        break
    }
  }

  const dotClick = () => {
    switch (state) {
      case "first":
        if (!display.includes(".")) {
          setDisplay(display + ".")
        }
        break
      case "operator":
        setDisplay("0.")
        setState("second")
        break
      case "second":
        if (!display.includes(".")) {
          setDisplay(display + ".")
        }
        break
    }
  }

  const opeClick = (op: string) => {
    let result = 0
    switch (state) {
      case "first":
        setFirst(Number(display))
        setOperator(op)
        setState("operator")
        break
      case "operator":
        setOperator(op)
        break
      case "second":
        result = calculate(first, Number(display))
        setFirst(result)
        setDisplay(String(result))
        setOperator(op)
        setState("operator")
        break
    }
  }

  const ceClick = () => {
    setState("first")
    setDisplay("0")
    setFirst(0)
    setSecond(0)
    setOperator("?")
  }

  const equalClick = () => {
    let result = 0
    switch (state) {
      case "first":
        result = calculate(Number(display), second)
        break
      case "operator":
        result = calculate(first, first)
        setSecond(first)
        break
      case "second":
        result = calculate(first, Number(display))
        setSecond(Number(display))
        break
    }
    setFirst(result)
    setDisplay(String(result))
    setState("first")
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        numClick(Number(e.key))
      } else if (e.key === "-") {
        opeClick("-")
      } else if (e.key === "+") {
        opeClick("+")
      } else if (e.key === ".") {
        dotClick()
      } else if (e.key === "=" || e.key === "Enter") {
        equalClick()
      } else if (e.key === "Escape" || e.key === "Backspace") {
        ceClick()
      } else {
        return
      }
      e.preventDefault()
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  useEffect(() => {
    console.log(`[${state}] first: ${first}, second: ${second}, operator: ${operator}, display: ${display}`)
  }, [state, first, second, operator, display])

  return (
    <main className="calculator-page mb-8 flex justify-center">
      <div className="border-2 border-red-500 p-1">
        <div className="rounded-t-[30px] bg-[rgb(49,49,49)] px-2.5 pt-2.5 pb-1 sm:px-3.5 sm:pt-3.5">
          <div className="rounded-3xl bg-[rgb(202,200,200)] p-2.5 text-end sm:p-3.5">
            <div className="mb-4 rounded-[15px] border-[1.5px] border-[#808080] bg-[rgb(109,188,245)] p-3 text-3xl break-all sm:mb-6 sm:text-5xl">
              {insertSeparator(display)}
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-3">
              <div className={btnRow}>
                <button disabled className={green}>MC</button>
                <button disabled className={green}>MR</button>
                <button disabled className={green}>M+</button>
                <button disabled className={green}>M-</button>
                <button className={red} onClick={ceClick}>CE</button>
              </div>
              <div className={btnRow}>
                <button className={purple} onClick={() => numClick(7)}>7</button>
                <button className={purple} onClick={() => numClick(8)}>8</button>
                <button className={purple} onClick={() => numClick(9)}>9</button>
                <button disabled className={green}>&divide;</button>
                <button disabled className={green}>&radic;</button>
              </div>
              <div className={btnRow}>
                <button className={purple} onClick={() => numClick(4)}>4</button>
                <button className={purple} onClick={() => numClick(5)}>5</button>
                <button className={purple} onClick={() => numClick(6)}>6</button>
                <button disabled className={green}>x</button>
                <button disabled className={green}>%</button>
              </div>
              <div className={btnRow}>
                <button className={purple} onClick={() => numClick(1)}>1</button>
                <button className={purple} onClick={() => numClick(2)}>2</button>
                <button className={purple} onClick={() => numClick(3)}>3</button>
                <button className={green} onClick={() => opeClick("-")}>&minus;</button>
                <button disabled className={green}>
                  <sup>1</sup>&frasl;<sub><i>x</i></sub>
                </button>
              </div>
              <div className={btnRow}>
                <button className={purple} onClick={() => numClick(0)}>0</button>
                <button className={purple} onClick={dotClick}>.</button>
                <button disabled className={purple}>&plusmn;</button>
                <button className={green} onClick={() => opeClick("+")}>+</button>
                <button className={green} onClick={equalClick}>=</button>
              </div>
            </div>
          </div>

          <div className="flex justify-between px-4 py-2 text-base text-white sm:px-6 sm:text-2xl">
            <div>68000639</div>
            <div>นายรพีภัทร</div>
            <div>เอติยัติ</div>
          </div>
        </div>
      </div>
    </main>
  )
}
