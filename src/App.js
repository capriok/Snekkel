import React, { useState, useEffect } from 'react';
import './App.scss';

function App() {
  let rows = 31
  let cols = 31
  let tickTime = 125
  let death = false

  const [grid, setGrid] = useState([])
  const [ticker, setTick] = useState(0)
  const [currentDirection, setDirection] = useState('up')
  // const [food, setFood] = useState({
  //   row: Math.floor((Math.random() * rows)),
  //   col: Math.floor((Math.random() * cols))
  // })
  const [food, setFood] = useState({
    row: 15,
    col: 16
  })
  const [snake, setSnake] = useState({
    head: {
      row: Math.floor(34),
      col: Math.floor((cols) / 2)
    },
    tail: []
  })

  // draw grid and initially place food and head
  useEffect(() => {
    let population = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isFood = (food.row === row && food.col === col)
        const isHead = (snake.head.row === row && snake.head.col === col)
        population.push({ row, col, isFood, isHead })
      }
    }
    setGrid(population)
  }, [food, snake.head, snake.tail])

  // game ticker
  const tickGame = () => {
    setTimeout(() => {
      setTick(ticker + tickTime)

      const isEating = (snake.head.row === food.row && snake.head.col === food.col)
      isEating && eatFood()
    }, tickTime)
  }

  const eatFood = () => {
    let { tail } = snake.tail
    let newTail = {
      row: snake.head.row - 1,
      col: snake.head.col - 1
    }
    setSnake({ ...snake, tail: [newTail] })

  }

  // snake direction
  useEffect(() => {
    let { row, col } = snake.head
    switch (currentDirection) {
      case 'up':
        if (row === 0) {
          setSnake({ ...snake, head: { ...snake.head, row: 30 } })
        } else {
          setSnake({ ...snake, head: { ...snake.head, row: row - 1 } })
        }
        break;
      case 'right':
        if (col === 30) {
          setSnake({ ...snake, head: { ...snake.head, col: 0 } })
        } else {
          setSnake({ ...snake, head: { ...snake.head, col: col + 1 } })
        }
        break;
      case 'down':
        if (row === 30) {
          setSnake({ ...snake, head: { ...snake.head, row: 0 } })
        } else {
          setSnake({ ...snake, head: { ...snake.head, row: row + 1 } })
        }
        break;
      case 'left':
        if (col === 0) {
          setSnake({ ...snake, head: { ...snake.head, col: 30 } })
        } else {
          setSnake({ ...snake, head: { ...snake.head, col: col - 1 } })
        }
        break;
      default:
        break;
    }
  }, [ticker])

  // keyboard controls
  const handleControls = (e) => {
    switch (e.keyCode) {
      case 87:
        currentDirection !== 'down' && setDirection('up')
        break;
      case 68:
        currentDirection !== 'left' && setDirection('right')
        break;
      case 83:
        currentDirection !== 'up' && setDirection('down')
        break;
      case 65:
        currentDirection !== 'right' && setDirection('left')
        break;
      default:
        break;
    }
  }

  tickGame()
  console.log(snake);

  return (
    <div className="App" tabIndex="0"
      onKeyDown={() => document.addEventListener('keydown', handleControls)}
    >
      <div className="grid">
        {grid.map(({ row, col, isFood, isHead }) => (
          <div key={`${row}-${col}`} className={
            isHead
              ? "grid-item is-head" : isFood
                ? "grid-item is-food" : "grid-item"
          }></div>
        ))}
      </div>
    </div>
  );
}

export default App;

// draw snakes head for start of game
// after one second food spawns

// useeffect to trigger foos spawn on nstart game, and in a random amount of time after last food was eaten
// add food to grid by pointing food position to random row and col 

// controls switch for keypress
// W 87 // A 65 // S 83 // D 68

// draw snakes tail when food ==== head pos
