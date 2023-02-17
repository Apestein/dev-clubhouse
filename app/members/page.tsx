"use client"
import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import { useCallback } from "react"

export default function Members() {
  const content = `.center-div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: //finish it
  }`
  function checkAnswer(e: any) {
    if (e.includes("translate(-50%, -50%)")) console.log("correct")
  }
  return (
    <main>
      <h1>Solve the problem to receive your official developer badge</h1>
      <h2>
        Center a div horizontally and vertically not using flex-box or grid
      </h2>
      <CodeMirror
        value={content}
        height="200px"
        extensions={[css()]}
        onChange={checkAnswer}
      />
    </main>
  )
}
