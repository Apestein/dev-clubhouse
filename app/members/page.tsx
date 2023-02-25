"use client"
import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import Lottie from "lottie-react"
import badgeLottie from "public/badge.json"
import { useRef } from "react"
import { dracula } from "@uiw/codemirror-theme-dracula"

export default function Members() {
  const content = `.center-div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: //finish it
  }`
  const lottieRef = useRef<any>()

  function checkAnswer(e: any) {
    if (e.includes("translate(-50%, -50%)")) {
      toggleLottie()
      document.getElementById("badge-message")?.classList.remove("hidden")
      lottieRef.current?.play()
    }
  }

  function toggleLottie() {
    document.getElementById("lottie")?.classList.toggle("hidden")
  }

  return (
    <main className="flex flex-col items-center">
      <Lottie
        className="fixed top-1/2 left-1/2 z-10 hidden -translate-y-1/2 -translate-x-1/2"
        lottieRef={lottieRef}
        id="lottie"
        animationData={badgeLottie}
        autoplay={false}
        loop={false}
        onComplete={toggleLottie}
      />
      <h2 className="text-center font-bold">
        Solve the problem to receive your official developer badge
      </h2>
      <h2 className="text-center font-bold">
        Center a div horizontally and vertically not using flex-box or grid
      </h2>
      <CodeMirror
        theme={dracula}
        value={content}
        height="200px"
        extensions={[css()]}
        onChange={checkAnswer}
        className="w-[80vw]"
      />
      <h2 className="hidden text-xl font-bold" id="badge-message">
        Now you are a certified real web developer!
      </h2>
    </main>
  )
}
