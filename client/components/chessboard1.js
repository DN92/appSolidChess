import React, {useState, useEffect}  from 'react'
import ChessBoard from 'chessboardjsx'
import chess from '../../util/chessGame'
import {upOne, getCounter} from '../../util/utilCounter'




const Chessboard = (props) => {


  //  Forsyth - Edwards Notation / current position
  const [currentFen, setCurrentFen] = useState(chess.fen())
  const [moves, setMoves] = useState(chess.moves())
  // game is a draw
  const [draw, setDraw] = useState(false)
  const [playingWhite, setWhite] = useState("Playing White: anon")
  const [playingBlack, setBlack] = useState("Playing Black: anon")
  const [gameStatus, setGameStatus] = useState("In Progress")
  const [toMove, setToMove] = useState("White")
  const [winner, setWinner] = useState("")
  const [gameEndedBy, setGameEndedBy] = useState("")
  const [resetWasClicked, setResetButton] = useState(false)
  const [resignWasClicked, setResignButton] = useState(false)
  const [askForTB, setAskForTB] = useState(false)
  const [askedforTakeBackThisMove, setTakeBackStatus] = useState(false)
  const [drawOffered, setDrawOffered] = useState(false)
  const [recentDrawOffer, setRecentDrawOffer] = useState(false)
  const [gameHistory, setGameHistory] = useState(chess.history())
  const [log, setLog] = useState([])

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

  useEffect(()=>{
    const gameMoves = []
    for(let i = 0; i < gameHistory.length; i+=2) {
      if (i + 1 < gameHistory.length) {
       gameMoves.push(`${gameHistory[i]} ${gameHistory[i+1]}`)
      } else {
        gameMoves.push(`${gameHistory[i]}`)
      }
    }
    setLog(gameMoves)
  }, [gameHistory])

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

  function handleAcceptDraw() {
    setDrawOffered(false)
    setDraw(true)
    setGameStatus("Draw!")
    setGameEndedBy("Draw Offer Accepted")
  }

  function handleDeclineDraw() {
    setDrawOffered(false)
    window.alert("Draw Offer Declined")
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
        // log move
        setGameHistory(chess.history())
        // reset takeBackstatus
        setTakeBackStatus(false)
        // reset recent draw offer status
        setRecentDrawOffer(false)
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
        // change visual element for whose turn it is

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
          ? <div>
              <p >{playingWhite}</p>
              <p >{playingBlack}</p>
              <p >{winner} Wins!</p>
            </div>
          : <div>
              <p >{playingWhite}</p>
              <p >{playingBlack}</p>
            </div>
          }
          <p > Game State: {gameStatus}</p>
          {!chess.game_over()
          ? <p> {toMove} to move </p>
          : <p>{gameEndedBy}</p>
          }
        </div>
        <h4>Chat Room</h4>
        <div className="chatBox">
        </div>
      </div>

      <div className="boardContainer">
        <ChessBoard className="chessBoard" id="chessBoard1" width={600} position={currentFen} onDrop={
          (action) => handleMove(action)
        }/>
      </div>

      <div className="gameLogAndActions">
        <div className="gameLog">
        <h4>Game Notation</h4>
          <ol>
            {log.map((movePair)=>{
              upOne()
              return <li key={getCounter()}>{movePair}   </li>
            })}
          </ol>
        </div>

        <div className="gameActions">
          {/* buttons for ask for TakeBack */}
          {/* This will just work on click for now. Later Change to ask the opponent */}
          <div className='gA'>
            {/* { askForTB ? */}
            <button onClick={handleAskForTakeBack}> Ask For Take Back</button>
            {/* : <button>Cancel</button> */}
            {/* } */}
          </div>
          {/* buttons for offer draw */}
          <div className='gA'>
            {!drawOffered
            ? <button onClick={handleDrawOffer}>Offer Draw</button>
            : <div>
                <button onClick={handleAcceptDraw}>Accept Draw Offer</button>
                <button onClick={handleDeclineDraw}>Decline Draw Offer</button>
              </div>
            }
          </div>
          {/* buttons for resigning */}
          <div className='gA'>
            {resignWasClicked
            ? <button onClick={confirmResign}> Confirm Resignation</button>
            : <button onClick={handleResignButton}> Resign </button>
            }
          </div>
          {/* buttons for reseting the board */}
          <div className='gA'>
            {resetWasClicked
            ? <button onClick={confirmReset}> Are you Sure ?</button>
            : <button onClick={handleResetButton}> Reset Game</button>
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default Chessboard
