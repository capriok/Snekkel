import React from 'react'
import Navbar from 'godspeed/build/Navbar'
import NavLink from 'godspeed/build/NavLink'
import Drawer from 'godspeed/build/Drawer'

const Nav = ({ drawer, setDrawer, toggleHelp, toggleDifficulty, isMobile }) => {
  return (
    <>
      <Drawer onClick={() => setDrawer(false)} open={drawer} bg="rgb(17, 17, 17)" color="white" padding="0px" >
        <div className="drawer">
          {!isMobile && <>
            <h1>Game</h1>
            <p onClick={() => {
              toggleHelp()
            }}>Objective</p>
            <p onClick={() => {
              toggleDifficulty()
            }}>
              Change Difficulty</p>
          </>}
          <h1>Navigation</h1>
          <p><a href="https://www.kylecaprio.dev">Portfolio</a></p>
          <p><a href="https://disarray.kylecaprio.dev">Disarray</a></p>
        </div>
      </Drawer>
      <Navbar className="nav" title="Kyle Caprio" to="/" shadow>
        <NavLink onClick={() => setDrawer(!drawer)}><h1>≡</h1></NavLink>
      </Navbar>
    </>
  )
}

export default Nav
