import React, { useState, useEffect } from 'react';
import './App.scss';
import './Index.scss';
import snakeBg from './gallery/snake-bg.jpg'
import Navbar from 'godspeed/build/Navbar'
import NavLink from 'godspeed/build/NavLink'
import Drawer from 'godspeed/build/Drawer'
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'

function App() {
  const isMobile = window.innerWidth < 500
  const [drawer, openDrawer] = useState(false)

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
  const [snake, setSnake] = useState({ head: { row: Math.floor(32), col: Math.floor((cols) / 2) }, tail: [] })
  const [food, setFood] = useState(getRandomFoodPos)
  const [currentDirection, setDirection] = useState('up')


  const getDirection = (curr, prev, next) => {
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
          let isTail = false;
          let isLastTail = false;
          let direction = "";
          snake.tail.forEach((t, index) => {
            if (t.row === row && t.col === col) {
              isTail = true;
              direction = getDirection(t, snake.tail[index - 1], snake.tail[index + 1]);
              isLastTail = snake.tail.length - 1 === index;
            }
          })

          population.push({ row, col, isFood, isHead, isTail, isLastTail, direction })
        }
      }
      setGrid(population)

    }
  }, [ticker])

  // game tick effect
  useEffect(() => {
    document.addEventListener('keydown', handleControls)
    let { row, col } = snake.head
    let tail = snake.tail
    //tick the game
    const gameTick = setTimeout(() => {
      !dead && setTick(ticker + tickTime)
      // if head collides with food then eat

      if (snake.head.row === food.row && snake.head.col === food.col) {
        setFood(getRandomFoodPos)
        snake.tail.push({
          row: snake.head.row,
          col: snake.head.col,
          isBody: true
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
    snake.tail.forEach((piece) => {
      if (piece.row === snake.head.row && piece.col === snake.head.col) {
        isDead(true)
        clearTimeout(gameTick)
      }
    })

    // move tail
    tail.unshift({ row: row, col: col, })
    tail.pop()
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
        console.log('tickTime', tickTime);
        break;
      case 'hard':
        setTickTime(70)
        console.log('tickTime', tickTime);
        break;
      case 'insane':
        setTickTime(40)
        console.log('tickTime', tickTime);
        break;
      default:
        console.log('difficulty', difficulty);
        ;
    }
    setFood(getRandomFoodPos)
    setDirection('up')
    setSnake({ head: { row: Math.floor(30), col: Math.floor(15) }, tail: [] })
    isDead(false)
  }

  const paintGrid = (isFood, isHead, isTail, isLastTail, direction) => {

    let baseGridItem = "grid-item";

    if (isHead) { return baseGridItem + " is-head " + currentDirection; }
    if (isLastTail) { return baseGridItem + " is-last-tail " + direction; }
    if (isTail) { return baseGridItem + " snake-body " + direction; }
    if (isFood) { return baseGridItem + " is-food "; }
    return baseGridItem;

  }


  // isHead
  // ? "grid-item is-head " + currentDirection : isFood
  //   ? "grid-item is-food" : isTail
  //     ? "grid-item snake-body" : isLastTail
  //       ? "grid-item isLastTail" : "grid-item"


  return (
    <>
      {drawer &&
        <Drawer onClick={() => openDrawer(false)} open={drawer} bg="rgb(17, 17, 17)" color="white" >
          <h1>Title</h1>
          <p>This is some placeholder content</p>
        </Drawer>
      }
      <div className="App">
        <Navbar className="nav" title="Kyle Caprio" shadow>
          <NavLink onClick={() => openDrawer(!drawer)}><h1>≡</h1></NavLink>
        </Navbar>
        {help && <div className="help">
          <div>WASD to move</div>
          <div>Only your tail kills you</div>
        </div>}
        {isMobile
          ? <div className="unavailable">
            <p>Mobile version not avaibale</p>
            <p>Try again later</p>
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
              : !dead && grid.map(({ row, col, isFood, isHead, isTail, isLastTail, direction }) => (
                <div key={`${row}-${col}`} className={paintGrid(isFood, isHead, isTail, isLastTail, direction)}></div>
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
                          title="100ms/tick || -2ms/meal, || Tail kills you"
                          position="bottom"
                          trigger="mouseenter">
                          <button className="easybtn" onClick={() => {
                            setDifficulty('easy');
                            isSelectingDifficulty(false)
                          }}>Easy
                        </button>
                        </Tooltip>
                        <Tooltip
                          title="70ms/tick || -3ms/meal, || Tail & Walls kill you"
                          position="bottom"
                          trigger="mouseenter">
                          <button className="hardbtn" onClick={() => {
                            setDifficulty('hard')
                            isSelectingDifficulty(false)
                          }}>Hard</button>
                        </Tooltip>
                        <Tooltip
                          title="40ms/tick || -4ms/meal, || Tail & Walls kill you"
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
                      <h1>Score: {snake.tail.length} </h1>
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