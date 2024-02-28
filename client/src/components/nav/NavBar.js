import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { isAuthenticated, removeToken, getPayloadSub } from '../helpers/Auth'

import logo from '../../images/favicon.png'

import axios from 'axios'
import { useState, useEffect } from 'react'





const NavBar = () => {

  const sub = getPayloadSub()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        // Fetch the user's profile data to get the profile image URL
        const { data } = await axios.get(`/api/auth/${sub}/`)
        if (data.profile_image) {
          setProfileImage(data.profile_image) // Set the profile image URL in state
        }
      } catch (err) {
        console.error(err)
        // Handle error if needed
      }
    }

    if (isAuthenticated()) {
      fetchProfileImage() // Fetch the profile image URL if the user is authenticated
    }
  }, [sub])

  const handleLogOut = () => {
    removeToken()
    navigate('/login')
  }

  return (

    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand href={isAuthenticated() ? `/profile/${sub}` : '/'}>
          <img 
            alt='Encore logo'
            src={logo}
            className='d-inline-block align-top logo'
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='encore-nav' />
        <Navbar.Collapse id='encore-nav' className='justify-content-end'>
          <Nav>
            {!isAuthenticated() ?
              <>
                <Nav.Link to='/login' as={Link}>Login</Nav.Link>

              </>
              :
              <>
                <Nav.Link to='/add-gig' as={Link}>Add Show</Nav.Link>
                <Nav.Link to='/search-gigs' as={Link}>Search Shows</Nav.Link>
                <Nav.Link to='/search-users' as={Link}>Search Users</Nav.Link>
                <span className='nav-link' onClick={handleLogOut}>Sign Out</span>

              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )

}

export default NavBar