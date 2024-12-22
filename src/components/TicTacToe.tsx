import { useState } from "react";
import "./TicTacToe.css";
import Button from "./Button";

export default function TicTacToe() {
  type Square = string | null;
  type Board = Square[];

  const getLocalBoard = (): Board[] => {
    const storedBoardHistory = localStorage.getItem("boardHistory");
    if (storedBoardHistory) {
      try {
        const boardHistory: Board[] = JSON.parse(storedBoardHistory).map(
          (board: Board) =>
            board.map((square: string | null) =>
              square === "null" ? null : square
            )
        );
        return boardHistory;
      } catch (e) {
        console.log(e);
        localStorage.removeItem("boardHistory");
        return [Array(9).fill(null)];
      }
    } else return [Array(9).fill(null)];
  };

  const initialBoardHistory: Board[] = getLocalBoard();
  const initialBoardIndex = initialBoardHistory.length - 1;

  const [{ board, boardIndex }, setBoard] = useState<{
    board: Board[];
    boardIndex: number;
  }>({
    board: initialBoardHistory,
    boardIndex: initialBoardIndex,
  });
  console.log([board, boardIndex]);
  /*
          Winning Combinations based on index of board in a row and column and diagonal
          +---+---+---+
          | 0 | 1 | 2 |
          +---+---+---+
          | 3 | 4 | 5 |
          +---+---+---+
          | 6 | 7 | 8 |
          +---+---+---+

      */
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const analyzeBoard = (board: Board) => {
    //1. check if there is a winning combination in the board and return the winner
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return {
          winner: board[a],
          isFinished: true,
          nextPlayer: null,
        };
      }
    }

    //2. check if the board is full and there is no winner
    const occupiedSquares = board.filter((square) => square !== null).length;
    if (occupiedSquares === board.length) {
      return {
        winner: null,
        isFinished: true,
        nextPlayer: null,
      };
    }

    //3. the board isn't full yet and who is the next player?
    const nextPlayer = occupiedSquares % 2 === 0 ? "X" : "O";
    return {
      nextPlayer,
      isFinished: false,
      winner: null,
    };
  };

  //   console.log(board);
  //   console.log(boardIndex);

  const currentBoard = board[boardIndex];
  if (!currentBoard) {
    // Handle the case where currentBoard is undefined
    setBoard({
      board: initialBoardHistory,
      boardIndex: initialBoardIndex,
    });
    return null;
  }
  const { nextPlayer, isFinished, winner } = analyzeBoard(currentBoard);

  const playerMove = (squareID: number) => {
    // Don't allow moves on filled squares or when game is finished
    if (currentBoard[squareID] || isFinished) {
      return;
    }

    const nextBoard = [...currentBoard];
    nextBoard[squareID] = nextPlayer as Square;

    // When making a new move, we should:
    // 1. Remove any future history after current boardIndex
    // 2. Add the new board state
    // 3. Increment the boardIndex
    const newBoardState = [...board.slice(0, boardIndex + 1), nextBoard];
    setBoard({
      board: newBoardState,
      boardIndex: boardIndex + 1,
    });

    localStorage.setItem("boardHistory", JSON.stringify(newBoardState));
  };

  const loadBoard = (index: number) => {
    if (index >= 0 && index < board.length) {
      const newBoardState = board.slice(0, index);
      setBoard({
        board: newBoardState,
        boardIndex: index,
      });
      localStorage.setItem("boardHistory", JSON.stringify(newBoardState));
    }
  };

  // Reset the board to the initial state
  const resetBoard = () => {
    const initialBoard = Array(9).fill(null);
    setBoard({
      board: [initialBoard],
      boardIndex: 0,
    });
    localStorage.setItem("boardHistory", JSON.stringify([initialBoard]));
  };
  const resetDisabled = boardIndex === 0;

  // Undo the last movement
  const undoDisabled = boardIndex === 0 || isFinished;
  const undoClickHandler = () => loadBoard(boardIndex);

  // Display the board move history
  const moveHistoryHandler = (index: number) => {
    setBoard((prevState) => ({
      ...prevState,
      boardIndex: index,
    }));
  };

  let boardStatus = `Player ${nextPlayer}, it's your turn!`;
  if (isFinished) {
    boardStatus = winner ? `Winner: Player ${winner} 🎉🥳` : `Nobody won.`;
  }

  return (
    <div className="container">
      <h3>{boardStatus}</h3>

      <div className="board">
        {currentBoard.map((box, index) => (
          <div
            key={index}
            onClick={() => !isFinished && playerMove(index)}
            className={`box ${box ? "filled" : ""} ${
              isFinished ? "game-finished" : ""
            }`}
          >
            {box}
          </div>
        ))}
      </div>

      <div className="controls">
        <div className="board-history">
          {board.map((_, index) => (
            <Button
              type="button"
              key={index}
              disabled={isFinished}
              onClick={() => moveHistoryHandler(index)}
              className={index === boardIndex ? "" : "notFocused"}
            >
              {String(index + 1)}
            </Button>
          ))}
        </div>
        <div className="board-btns">
          <Button type="button" onClick={resetBoard} disabled={resetDisabled}>
            Reset
          </Button>
          <Button
            type="button"
            onClick={undoClickHandler}
            disabled={undoDisabled}
          >
            Undo
          </Button>
        </div>
      </div>
    </div>
  );
}
