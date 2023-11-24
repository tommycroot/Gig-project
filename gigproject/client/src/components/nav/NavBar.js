import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { isAuthenticated, removeToken, getPayloadSub } from '../helpers/Auth'

import logo from '../../images/favicon.png'





const NavBar = () => {

  const sub = getPayloadSub()
  const location = useLocation()
  const navigate = useNavigate()

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