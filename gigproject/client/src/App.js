import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

import NavBar from './components/nav/NavBar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Profile from './components/user/Profile'
import GigPage from './components/gigs/GigPage'
import AddReview from './components/user/AddReview'
import AddGig from './components/user/AddGig'
import EditProfile from './components/user/EditProfile'
import SearchGigs from './components/user/SearchGigs'
import SearchUsers from './components/user/SearchUsers'
import EditGig from './components/user/EditGig'

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/gigs/') 
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
          <Route path='/auth/:id/edit' element={<EditProfile />}></Route>
          <Route path='/gigs/:gigId/' element={<GigPage />}></Route>
          <Route path='/gigs/:gigId/edit/' element={<EditGig />}></Route>
          <Route path='/add-review/:gigId/:sub' element={<AddReview />}></Route>
          <Route path='/gigs/:gigId/reviews/:reviewId' element={<GigPage />}></Route>
          <Route path='/search-gigs' element={<SearchGigs />}></Route>
          <Route path='/add-gig' element={<AddGig />}></Route>
          <Route path='/search-users' element={<SearchUsers />}></Route>
        </Routes>
        <footer className='text-center'><small>Encore was created by <a href='https://thomascroot.com' target='_blank' rel='noreferrer'>Tommy Croot</a></small></footer>
      </BrowserRouter>
    </div>



  )
}

export default App