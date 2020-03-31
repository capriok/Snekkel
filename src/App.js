import React, { useState, useEffect } from 'react';
import './App.scss';

function App() {
  let rows = 31
  let cols = 31
  let tickTime = 100

  const [dead, isDead] = useState(false)
  const getRandomFoodPos = () => {
    return {
      row: Math.floor((Math.random() * rows)),
      col: Math.floor((Math.random() * cols))
    }
  }

  const [grid, setGrid] = useState([])
  const [ticker, setTick] = useState(0)
  const [currentDirection, setDirection] = useState('up')
  const [food, setFood] = useState({
    row: 15,
    col: 15

  })
  const [snake, setSnake] = useState({
    head: {
      row: Math.floor(30),
      col: Math.floor((cols) / 2)
    },
    tail: []
  })

  // draw grid and place food and head
  useEffect(() => {
    // console.log(snake.tail);

    let population = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isFood = (food.row === row && food.col === col)
        const isHead = (snake.head.row === row && snake.head.col === col)
        let isTail = false;
        snake.tail.forEach(t => {
          if (t.row === row && t.col === col) {
            isTail = true;
          }
        })
        population.push({ row, col, isFood, isHead, isTail })
      }
    }
    setGrid(population)
  }, [ticker])

  // eat food
  const eatFood = () => {
    console.log(snake.tail);
    snake.tail.push({
      row: snake.head.row,
      col: snake.head.col
    })
    setFood(getRandomFoodPos)
  }


  // game tick
  useEffect(() => {
    const gameTick = setTimeout(() => {
      setTick(ticker + tickTime)

      const isEating = (snake.head.row === food.row && snake.head.col === food.col)
      isEating && eatFood()
    }, tickTime)

    let { row, col } = snake.head
    let tail = snake.tail


    snake.tail.forEach((piece) => {
      if (piece.row === snake.head.row && piece.col === snake.head.col) {
        isDead(true)
        console.log(dead);
        clearTimeout(gameTick)
      }
    })
    // isDead && 

    tail.unshift({
      row: row,
      col: col,
    })

    tail.pop()


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
        setDirection(currentDirection => currentDirection !== 'down' ? 'up' : currentDirection)
        break;
      case 68:
        setDirection(currentDirection => currentDirection !== 'left' ? 'right' : currentDirection)
        break;
      case 83:
        setDirection(currentDirection => currentDirection !== 'up' ? 'down' : currentDirection)
        break;
      case 65:
        setDirection(currentDirection => currentDirection !== 'right' ? 'left' : currentDirection)
        break;
      default:
        break;
    }
  }

  return (
    <div className="App" tabIndex="0"
      onKeyDown={() => document.addEventListener('keydown', handleControls)}
    >
      <div className="grid">
        {grid.map(({ row, col, isFood, isHead, isTail }) => (
          <div key={`${row}-${col}`} className={
            isHead
              ? "grid-item is-head" : isFood
                ? "grid-item is-food" : isTail
                  ? "grid-item is-tail" : "grid-item"
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
