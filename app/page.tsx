import TicTacToe from "@/components/tic-tac-toe"
import LetterGlitch from "@/components/letter-glitch"

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchColors={["#8b5cf6", "#a855f7", "#c084fc", "#e879f9", "#7c3aed", "#6d28d9"]}
          glitchSpeed={30}
          centerVignette={false}
          outerVignette={false}
          smooth={true}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <TicTacToe />
      </div>
    </div>
  )
}
