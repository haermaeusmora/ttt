"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SplashCursor from "./splash-cursor"

type Player = "X" | "O" | null
type Board = Player[]

interface GameState {
  board: Board
  currentPlayer: Player
  winner: Player
  gameOver: boolean
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    gameOver: false,
  })

  const checkWinner = useCallback((board: Board): Player => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }, [])

  const makeMove = useCallback(
    (index: number) => {
      if (gameState.board[index] || gameState.gameOver) return

      const newBoard = [...gameState.board]
      newBoard[index] = gameState.currentPlayer

      const winner = checkWinner(newBoard)
      const isDraw = !winner && newBoard.every((cell) => cell !== null)

      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
        winner,
        gameOver: winner !== null || isDraw,
      })
    },
    [gameState, checkWinner],
  )

  const resetGame = useCallback(() => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      gameOver: false,
    })
  }, [])

  const getStatusMessage = () => {
    if (gameState.winner) {
      return `Player ${gameState.winner} wins!`
    }
    if (gameState.gameOver) {
      return "It's a draw!"
    }
    return `Player ${gameState.currentPlayer}'s turn`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-transparent">
      <SplashCursor BACK_COLOR={{ r: 0.03, g: 0.05, b: 0.15 }} TRANSPARENT={true} />

      <Card className="p-6 bg-card border-border shadow-2xl backdrop-blur-sm relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bubble-sans font-bold mb-2 tracking-wide text-muted-foreground">
            TTT by haermaeus_mora
          </h1>
          <div className="text-base text-muted-foreground font-medium">{getStatusMessage()}</div>

          <div className="grid grid-cols-3 gap-2 w-64 mx-auto">
            {gameState.board.map((cell, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 w-20 text-2xl font-bold border-2 border-border hover:border-primary transition-all duration-200 bg-secondary/50 hover:bg-secondary"
                onClick={() => makeMove(index)}
                disabled={gameState.gameOver || cell !== null}
              >
                <span className={cell === "X" ? "text-primary" : cell === "O" ? "text-accent" : ""}>{cell}</span>
              </Button>
            ))}
          </div>

          <Button
            onClick={resetGame}
            className="hover:bg-primary/90 px-6 py-2 text-base font-semibold transition-all duration-200 text-muted-foreground bg-muted"
          >
            New Game
          </Button>
        </div>
      </Card>
    </div>
  )
}
