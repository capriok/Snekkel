import React, { useState, useEffect } from 'react';
import snakeBg from './gallery/snake-bg.jpg'
import Navbar from './components/navbar'
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'

function App() {
  const isMobile = window.innerWidth < 500
  const [drawer, setDrawer] = useState(false)

  let rows = 31
  let cols = 31

  const getRandomFoodPos = () => {
    return {
      row: Math.floor((Math.random() * rows)),
      col: Math.floor((Math.random() * cols))
    }
  }
  const [init, isInit] = useState(true)
  const [help, isHelping] = useState(false)
  const [selectingDifficulty, isSelectingDifficulty] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [dead, isDead] = useState(true)
  const [tickTime, setTickTime] = useState(150)
  const [ticker, setTick] = useState(0)
  const [grid, setGrid] = useState([])
  const [snake, setSnake] = useState({ head: { row: Math.floor(32), col: Math.floor((cols) / 2) }, body: [] })
  const [food, setFood] = useState(getRandomFoodPos)
  const [currentDirection, setDirection] = useState('up')

  const getDirection = (curr, prev) => {
    if (prev) {
      if (curr.col === prev.col && curr.row - 1 === prev.row) {
        return "up";
      } else if (curr.col === prev.col && curr.row + 1 === prev.row) {
        return "down";
      } else if (curr.col + 1 === prev.col && curr.row === prev.row) {
        return "right";
      } else if (curr.col - 1 === prev.col && curr.row === prev.row) {
        return "left";
      }
    }
    return currentDirection
  }

  // draw grid and place food, head, and tail
  useEffect(() => {
    // populate grid
    if (!init) {
      let population = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const isFood = (food.row === row && food.col === col)
          const isHead = (snake.head.row === row && snake.head.col === col)
          let isBody = false;
          let isTail = false;
          let direction = "";
          snake.body.forEach((t, index) => {
            if (t.row === row && t.col === col) {
              isBody = true;
              direction = getDirection(t, snake.body[index - 1]);
              isTail = snake.body.length - 1 === index;
            }
          })
          population.push({ row, col, isFood, isHead, isBody, isTail, direction })
        }
      }
      setGrid(population)
    }
  }, [ticker])

  // game tick effect
  useEffect(() => {
    document.addEventListener('keydown', handleControls)
    let { row, col } = snake.head
    //tick the game
    const gameTick = setTimeout(() => {
      !dead && setTick(ticker + tickTime)
      // if head collides with food then eat
      if (snake.head.row === food.row && snake.head.col === food.col) {
        setFood(getRandomFoodPos)
        snake.body.push({
          row: snake.head.row,
          col: snake.head.col
        })
        // increase snake speed based on difficulty
        switch (difficulty) {
          case 'easy':
            tickTime > 70 && setTickTime(tick => tick - 2)
            break;
          case 'hard':
            tickTime > 40 && setTickTime(tick => tick - 3)
            break;
          case 'insane':
            tickTime > 10 && setTickTime(tick => tick - 4)
            break;
          default:
        }
      }
    }, tickTime)
    // head collides with tail then reset game
    snake.body.forEach((piece) => {
      if (piece.row === snake.head.row && piece.col === snake.head.col) {
        isDead(true)
        clearTimeout(gameTick)
      }
    })
    // move tail
    snake.body.unshift({ row: row, col: col, })
    snake.body.pop()
    if (difficulty === 'easy') {
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
    } else {
      switch (currentDirection) {
        case 'up':
          if (row < 0) {
            isDead(true)
          } else {
            setSnake({ ...snake, head: { ...snake.head, row: row - 1 } })
          }
          break;
        case 'right':
          if (col > 30) {
            isDead(true)
          } else {
            setSnake({ ...snake, head: { ...snake.head, col: col + 1 } })
          }
          break;
        case 'down':
          if (row > 30) {
            isDead(true)
          } else {
            setSnake({ ...snake, head: { ...snake.head, row: row + 1 } })
          }
          break;
        case 'left':
          if (col < 0) {
            isDead(true)
          } else {
            setSnake({ ...snake, head: { ...snake.head, col: col - 1 } })
          }
          break;
        default:
          break;
      }
    }
  }, [ticker, dead])

  // keyboard controls
  const handleControls = (e) => {
    switch (e.keyCode) {
      case 87:
      case 38:
        setDirection(currentDirection => currentDirection !== 'down' ? 'up' : currentDirection)
        break;
      case 68:
      case 39:
        setDirection(currentDirection => currentDirection !== 'left' ? 'right' : currentDirection)
        break;
      case 83:
      case 40:
        setDirection(currentDirection => currentDirection !== 'up' ? 'down' : currentDirection)
        break;
      case 65:
      case 37:
        setDirection(currentDirection => currentDirection !== 'right' ? 'left' : currentDirection)
        break;
      default:
        break;
    }
  }
  // reset game and show help
  const resetGame = () => {
    init && isHelping(true)
    setTimeout(() => {
      isHelping(() => false)
    }, 3000);
    isInit(false)
    // set tick time based on difficulty
    switch (difficulty) {
      case 'easy':
        setTickTime(100)
        break;
      case 'hard':
        setTickTime(70)
        break;
      case 'insane':
        setTickTime(40)
        break;
      default:
        break;
    }
    setFood(getRandomFoodPos)
    setDirection('up')
    setSnake({ head: { row: Math.floor(30), col: Math.floor(15) }, body: [] })
    isDead(false)
  }

  const paintGrid = (isFood, isHead, isBody, isTail, direction) => {
    let baseGridItem = "grid-item";
    if (isHead) { return baseGridItem + " is-head " + currentDirection; }
    if (isTail) { return baseGridItem + " is-tail " + direction; }
    if (isBody) { return baseGridItem + " is-body " + direction; }
    if (isFood) { return baseGridItem + ` is-food ${Math.floor(Math.random(1 * 6))}`; }
    return baseGridItem;
  }

  const toggleHelp = () => {
    isHelping(() => isHelping(true))
    setDrawer(false)
    setTimeout(() => {
      isHelping(() => isHelping(false))
    }, 5000)
  }

  const toggleDifficulty = () => {
    difficulty === 'easy' ? setDifficulty('hard') : difficulty === 'hard' ? setDifficulty('insane') : setDifficulty('easy')
  }

  return (
    <>
      <div className="App">
        <Navbar className="nav" title="Kyle Caprio" to="/" shadow
          drawer={drawer} setDrawer={setDrawer} toggleHelp={toggleHelp}
          toggleDifficulty={toggleDifficulty} difficulty={difficulty}
          isMobile={isMobile} />
        {help && <div className="help">
          <div>WASD or Arrows to move</div>
          <div>Only your body kills you</div>
        </div>}
        {isMobile
          ? <div className="unavailable">
            <p>Mobile version not available</p>
            <p>Try again at a later date</p>
          </div>
          :
          <div className={`grid border ${difficulty}`}>
            {init
              ? <div className="modal">
                <h1>Welcome to Snekkel</h1>
                <div>
                  <button onClick={resetGame}>Start Game</button>
                </div>
              </div>
              : !dead && grid.map(({ row, col, isFood, isHead, isBody, isTail, direction }) => (
                <div key={`${row}-${col}`} className={paintGrid(isFood, isHead, isBody, isTail, direction)}></div>
              ))}
            {(dead && !init) &&
              <div className="modal">
                {
                  selectingDifficulty
                    ?
                    <>
                      <h1>Select Difficulty</h1>
                      <div>
                        <Tooltip
                          title="100ms/tick || -2ms/meal, || Body kills you"
                          position="bottom"
                          trigger="mouseenter">
                          <button className="easybtn" onClick={() => {
                            setDifficulty('easy');
                            isSelectingDifficulty(false)
                          }}>Easy
                        </button>
                        </Tooltip>
                        <Tooltip
                          title="70ms/tick || -3ms/meal, || Body & Walls kill you"
                          position="bottom"
                          trigger="mouseenter">
                          <button className="hardbtn" onClick={() => {
                            setDifficulty('hard')
                            isSelectingDifficulty(false)
                          }}>Hard</button>
                        </Tooltip>
                        <Tooltip
                          title="40ms/tick || -4ms/meal, || Body & Walls kill you"
                          position="bottom"
                          trigger="mouseenter">
                          <button className="insanebtn" onClick={() => {
                            setDifficulty('insane')
                            isSelectingDifficulty(false)
                          }}>Insane</button>
                        </Tooltip>

                      </div>
                    </>
                    :
                    <>
                      <h1>Score: {snake.body.length} </h1>
                      <div>
                        <button className="border" onClick={resetGame}>Restart Game</button>
                        <button className="border" onClick={() => isSelectingDifficulty(true)}>Change Difficulty</button>
                      </div>
                    </>
                }
              </div>
            }
            <img className="img" src={snakeBg} alt="" />
          </div>
        }
      </div>
    </>
  );
}

export default App;