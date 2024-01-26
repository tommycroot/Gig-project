import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import Error from '../error/Error'

import { getPayloadSub } from '../helpers/Auth'


const SearchUsers = () => {

  

  //! STATE

  const [users, setUsers] = useState([])

  const [filters, setFilters] = useState('')

  const [filteredUsers, setFilteredUsers] = useState([])

  const [error, setError] = useState('')

  const [sub, setSub] = useState('')

  useEffect(() => {

    const getUsers = async () => {
      try {
        const { data } = await axios.get('/api/auth/')
        const sub = getPayloadSub()
        console.log('USER DATA', data)
        setUsers(data.sort((a, b) => a.username > b.username ? 1 : -1))
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
        <Row>
          {filteredUsers.length > 0 ?
            filteredUsers.map(user => {
              // eslint-disable-next-line camelcase
              const { id, profile_image, username, gigs } = user
              return (
                <Col key={id} lg={2} md={2} sm={4} xs={4} className={sub === id ? 'd-none' : ''}>
                  <Link to={`/profile/${id}/`}>
                    <Card className='user-container'>
                      {/* eslint-disable-next-line camelcase */}
                      <Card.Img className='card-image' style={{ backgroundImage: `url('${profile_image}')` }}></Card.Img>
                      <Card.Body>
                        <Card.Title>{username}</Card.Title>
                        <Card.Text>Gigs attended: {gigs.length}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )
            })
            :
            <>
              {error ?
                <Error error={error} />
                :
                <h1>Loading</h1>
              }
            </>
          }
        </Row>
      </Container>
    </main>
  )
}

export default SearchUsers