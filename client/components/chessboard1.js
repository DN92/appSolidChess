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
  const [playingWhite, setWhite] = useState("anon")
  const [playingBlack, setBlack] = useState("anon")
  const [gameStatus, setGameStatus] = useState("playing")
  const [toMove, setToMove] = useState("White")
  const [winner, setWinner] = useState("")
  const [gameEndedBy, setGameEndedBy] = useState("")
  const [resetWasClicked, setResetButton] = useState(false)
  const [resignWasClicked, setResignButton] = useState(false)
  const [askForTB, setAskForTB] = useState(false)
  const [askedforTakeBackThisMove, setTakeBackStatus] = useState(false)
  const [drawOffered, setDrawOffered] = useState(false)
  const [recentDrawOffer, setRecentDrawOffer] = useState(false)

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
    setGameStatus("playing")
    setWinner("")
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

  function handleAskForTakeBack() {
    chess.undo()
    setCurrentFen(chess.fen())
  }

  function handleDrawOffer() {
    if(!recentDrawOffer) {
      setRecentDrawOffer(true)
      setDrawOffered(true)
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

        console.log(chess.history())

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

// return (<div>TANGO</div>)

  return (
    <div className='megaDiv'>
      <div className='dataAndChat'>
        <div className='metaData'>
          {winner
          ? `${winner} Wins!`
          : null
          }
          <p> Game State: {gameStatus}</p>
          {!chess.game_over()
          ? <p> {toMove} to move </p>
          : <p>{gameEndedBy}</p>
          }
        </div>
        <div className="chatBox">
          <p>Chat Room</p>
        </div>

      </div>
      <div className="boardContainer">
        <ChessBoard className="chessBoard" id="chessBoard1" width={600} position={currentFen} onDrop={
          // (e)=> console.log(e)
          (action) => handleMove(action)
        }/>
      </div>
      <div className="gameActions">
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
        {/* This will just work on click for now. Later Change to ask the opponent */}
        <div>
          {/* { askForTB ? */}
          <button onClick={handleAskForTakeBack}> Ask For Take Back</button>
          {/* : <button>Cancel</button> */}
          {/* } */}
        </div>
        {/* offer draw */}
        <div>
          {!drawOffered
          ? <button onClick={handleDrawOffer}>Offer Draw</button>
          : <div>
              <button>Accept Draw Offer</button>
              <button>Decline Draw Offer</button>
            </div>
          }
        </div>
      </div>

    </div>
  )
}

export default Chessboard
