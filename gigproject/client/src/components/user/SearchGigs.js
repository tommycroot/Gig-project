import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import Error from '../error/Error'
import Spinner from '../Spinner.js'


const SearchGigs = () => {


  //! STATE

  const [gigs, setGigs] = useState([])

  const [filters, setFilters] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const [filteredGigs, setFilteredGigs] = useState([])

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  //! Executions

  useEffect(() => {

    const getGigs = async () => {
      try {
        setIsLoading(true)
        const { data } = await axios.get('/api/gigs/')
        console.log(data)
        setGigs(data.sort((a, b) => a.band > b.band ? 1 : -1))
        setIsLoading(false)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }

    getGigs()
  }, [])

  useEffect(() => {

    setFilteredGigs(gigs)

  }, [gigs])


  useEffect(() => {
    const regex = RegExp(filters, 'i')
    const newFilteredGigs = gigs.filter(gig => {
      return regex.test(gig.band) || regex.test(gig.venue)// Check both band and venue
    })

    const filteredByDate = dateFilter
      ? newFilteredGigs.filter((gig) => gig.date.includes(dateFilter))
      : newFilteredGigs

    setFilteredGigs(filteredByDate)
  }, [filters, gigs, dateFilter])

  const handleChange = (e) => {
    setFilters(e.target.value)
  }

  const handleDateChange = (e) => {
    setDateFilter(e.target.value)
  }

  return (
    <main>

      <Container>

        <Row>
          <Col className='text-center'>
            <h1 className='search-h1'>SEARCH SHOWS</h1>
            <h3 className='search-h3'>Use the search bar below to find shows to add.</h3>
            <Link className='search-link' to={'/add-gig'}>Can&apos;t see the show you&apos;re looking for? Click here to add it to the our database!</Link>
            <div className='search-field-wrapper'>
              <div className='search-field-wrapper'>
                <input
                  type='text'
                  name='artist'
                  placeholder='Artist or Venue Name'
                  onChange={handleChange}
                  value={filters}
                />

                <input
                  type='text'
                  name='date'
                  placeholder='YYYY-MM-DD'
                  onChange={handleDateChange}
                  value={dateFilter}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row className='search-mob'>
          {isLoading ? (
            <Col className="text-center">
              <Spinner />
              <h1 id='loader'>Loading...</h1>
            </Col>
          ) : filteredGigs.length > 0 ? (
            filteredGigs.map(gig => {
              const { id, band, date, venue, image } = gig
              return (
                <Col key={id} lg={2} md={2} sm={4} xs={4} className='gig-container'>
                  <Link to={`/gigs/${id}`}>
                    <Card>
                      <Card.Img variant='top' src={image}></Card.Img>
                      <Card.Body>
                        <Card.Title>{band}</Card.Title>
                        <Card.Text>{venue}</Card.Text>
                        <Card.Text>{date}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )
            })
          ) : (
            <Col className="text-center">
              <h3>No matching gigs</h3>
            </Col>
          )}
        </Row>
      </Container>
    </main>
  )
}

export default SearchGigs