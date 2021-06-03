import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    let i = 0
    let rows = []
    let cols = []
    for(let row=0; row<3; row++){
      rows = []
      for(let col=0; col<3; col++){
        rows.push(this.renderSquare(i))
        i++
      }
      cols.push(<div className="board-row">{rows}</div>)
    }

    return (
      <div>
        {cols}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: null,
          row: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
      winnerGame: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.winnerGame || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const {col, row} = getColRow(i)
    const {game} = calculateWinner(squares)
    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: col,
          row: row,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winnerGame: game,
    });
  }

  jumpTo(step) {
    const current = this.state.history[step].squares
    const {game} = calculateWinner(current)
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winnerGame: game,
    });
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const {winner} = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const player = (move % 2) === 0 ? "O" : "X" 
      const descAux = move ?
        " Col: " + step.col + " / Row: " + step.row + " / Player: " + player :
        ""
      return (
        <>
          <li key={move}>
            <button
              className={move === this.state.stepNumber ? "btn-list btn-selected" : "btn-list"}
              onClick={() => this.jumpTo(move)}
            >
              {desc}
            </button>
            {descAux}
          </li>
        </>
      );
    });

    if(this.state.isAsc){
      moves.reverse()
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({isAsc: !this.state.isAsc})}>
            {this.state.isAsc ? "/\\" : "\\/"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], game: lines[i] }
    }
  }
  return { winner: null, game: null}
}

function getColRow(i) {

  const row = Math.trunc(i / 3)
  const col = i - (row * 3)

  return {col, row}
}