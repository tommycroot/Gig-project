import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

import NavBar from './components/nav/NavBar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Profile from './components/user/Profile'
import GigPage from './components/gigs/GigPage'

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/gigs/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()
  })

  return (

    <div className='site-wrapper'>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/profile/:id' element={<Profile />}></Route>
          <Route path='/gigs/:gigId/' element={<GigPage />}></Route>
          
        </Routes>
        <footer className='text-center'><small>Encore was created by <a href='https://github.com/tommycroot' target='_blank' rel='noreferrer'>Tommy Croot</a></small></footer>
      </BrowserRouter>
    </div>



  )
}

export default App