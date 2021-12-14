import React, {useState, useEffect}  from 'react'
import ChessBoard from 'chessboardjsx'
import Chess, { ChessInstance, ShortMove } from 'chess.js'


const chess = new Chess()

const Chessboard = (props) => {


  //  Forsyth - Edwards Notation / current position
  const [currentFen, setCurrentFen] = useState(chess.fen())
  const [moves, setMoves] = useState(chess.moves())
  // game is a draw
  const [draw, setDraw] = useState(false)
  // game over
  const [gameStatus, setGameStatus] = useState("playing")
  const [toMove, setToMove] = useState("White")
  const [winner, setWinner] = useState("")
  const [gameEndedBy, setGameEndedBy] = useState("")
  const [resetWasClicked, setResetButton] = useState(false)
  const [resignWasClicked, setResignButton] = useState(false)
  const [askForTB, setAskForTB] = useState(false)
  const [askedforTakeBackThisMove, setTakeBackStatus] = useState(false)

  useEffect(() => {
    if(draw) {
      setGameStatus("draw")
    }
  },[draw])

  useEffect(() => {
    if(winner != "") {
      setGameStatus("Game Over")
    }
  }, [winner])

  function handleResetButton() {
    setResetButton(true)
  }

  function confirmReset() {
    chess.reset()
    setCurrentFen(chess.fen())
    setResetButton(false)
  }

  function handleResignButton () {
    setResignButton(true)
  }

  function confirmResign() {
    setResignButton(false)
    if (chess.turn() === 'w') {
      setGameEndedBy("White Resigned!")
      setWinner("Black")
    } else {
      setGameEndedBy("Black Resigned!")
      setWinner("White")
    }
  }



  function handleMove(action){
    //  First, make sure the game is still in progress
    if(chess.game_over()) {
      return
    }

    // .move will attempt to move a piece and return the move object if successful or null
    if(action.sourceSquare !== action.targetSquare) {
      const loggedMove = chess.move({
        from: action.sourceSquare,
        to: action.targetSquare,
      })

      // check for valid move made
      if(loggedMove) {
        // reset takeBackstatus
        setTakeBackStatus(false)

        // set new board position for UI
        setCurrentFen(chess.fen())
        // check for winner
        if (chess.in_checkmate()) {
          if (chess.turn() === 'w') {
            setWinner("Black")
          } else {
            setWinner("White")
          }
          setGameEndedBy("Check Mate!")
        }
        // check if draw by material
        if (chess.insufficient_material()) {
          setDraw(true)
          setGameEndedBy("Insufficient Material")
        }
        // check for threefold repetition
        if (chess.in_threefold_repetition()) {
          setDraw(true)
          setGameEndedBy("Three Fold Repitition")
        }
        // check for staleMate
        if (chess.in_stalemate()) {
          setDraw(true)
          setGameEndedBy("Stalemate!")
        }
        // change to move

        switch (chess.turn()) {
          case 'w':
            return setToMove("White")
          case 'b':
            return setToMove("Black")
          default:
            return "something went wrong: i'm a bug fix me!"
        }
      }
    }
  }

  return (
    <div className='chessBoard'>
      {winner
      ? `${winner} Wins!`
      : null
      }
      <h2> TOTALLY NOT A CHESS CLONE </h2>
      <p> Game State: {gameStatus}</p>
      {!chess.game_over()
      ? <p> {toMove} to move </p>
      : <p>{gameEndedBy}</p>
      }
      <ChessBoard id="chessBoard1" width={600} position={currentFen} onDrop={
        // (e)=> console.log(e)
        (action) => handleMove(action)
      }/>
      {/* buttons for reseting the board */}
      <div>
        {resetWasClicked
        ? <button onClick={confirmReset}> Are you Sure ?</button>
        : <button onClick={handleResetButton}> Reset Game</button>
        }
      </div>
      {/* buttons for resigning */}
      <div>
        {resignWasClicked
        ? <button onClick={confirmResign}> Confirm Resignation</button>
        : <button onClick={handleResignButton}> Resign </button>
        }
      </div>
      {/* buttons for ask for TakeBack */}
      <div>
        {
          <button onClick={askForTakeBack}> Ask For Take Back</button>

        }
      </div>

    </div>
  )
}

export default Chessboard
