import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Spinner from '../Spinner.js'
import Error from '../error/Error'

import { getPayloadSub } from '../helpers/Auth'


const SearchUsers = () => {



  //! STATE

  const [users, setUsers] = useState([])

  const [filters, setFilters] = useState('')

  const [filteredUsers, setFilteredUsers] = useState([])

  const [error, setError] = useState('')

  const [sub, setSub] = useState('')
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {

    const getUsers = async () => {
      try {
        setIsLoading(true)
        const { data } = await axios.get('/api/auth/')
        const sub = getPayloadSub()
        console.log('USER DATA', data)
        setUsers(data.sort((a, b) => a.username > b.username ? 1 : -1))
        setIsLoading(false)
        setSub(sub)
      } catch (err) {
        console.log(err.message)
        setError(err.message)
      }
    }
    getUsers()
  }, [])

  useEffect(() => {

    setFilteredUsers(users)

  }, [users])

  useEffect(() => {
    const regex = RegExp(filters, 'i')
    const newFilteredUsers = users.filter(user => {
      return regex.test(user.username)
    })
    setFilteredUsers(newFilteredUsers)
  }, [filters])

  const handleChange = (e) => {
    setFilters(e.target.value)
  }



  return (
    <main>
      <Container>
        <Row>
          <Col className='text-center'>
            <h1 className='search-h1'>FIND NEW PEOPLE TO FOLLOW</h1>
            <h3 className='search-h3'>Use the search bar below to find your friends.</h3>
            <div className='search-user-field-wrapper'>
              <input type='text' name='user' placeholder='Search Username' onChange={handleChange} value={filters} />
            </div>
          </Col>
        </Row>
        <Row className='search-mob'>
          {isLoading ? (
            <Col className="text-center">
              <Spinner />
              <h1 id='loader'>Loading...</h1>
            </Col>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map(user => {
              // eslint-disable-next-line camelcase
              const { id, profile_image, username, gigs, location, reviews } = user
              return (
                <Col key={id} lg={2} md={2} sm={4} xs={4} className={sub === id ? 'gig-container' : 'gig-container'}>
                  <Link to={`/profile/${id}/`}>
                    <Card>
                      {/* eslint-disable-next-line camelcase */}
                      <Card.Img className='card-image' style={{ backgroundImage: `url('${profile_image}')` }}></Card.Img>
                      <Card.Body>
                        <Card.Title id='search-users-title'>{username}</Card.Title>
                        <Card.Text id='search-users-text'><span id='span-card'>Location:</span> {location ? location : 'unknown'}</Card.Text>
                        <Card.Text id='search-users-text'><span id='span-card'>Shows:</span>  {gigs.length}</Card.Text>
                        <Card.Text id='search-users-text'><span id='span-card'>Reviews:</span>  {reviews ? reviews.length : '0'}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )
            })
          ) : (
            <Col className="text-center">
              <h3>No matching users</h3>
            </Col>
          )}
        </Row>
      </Container>
    </main>
  )
}

export default SearchUsers