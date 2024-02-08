import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { authenticated, isAuthenticated, userIsOwner } from '../helpers/Auth.js'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import favicon from '../../images/favicon.png'

import humps from 'humps'

const EditGig = () => {
  const navigate = useNavigate()
  const { gigId } = useParams()
  const [gig, setGig] = useState(null)
  const [error, setError] = useState('')
  const [bandSuggestions, setBandSuggestions] = useState([])
  const [displayedResults, setDisplayedResults] = useState(5)
  const [formFields, setFormFields] = useState({
    date: '',
    band: '',
    price: '',
    venue: '',
    image: '',
    setlist: '',
    reviews: [],
  })

  console.log('GIG ID', gigId)
  useEffect(() => {
    if (gigId) {
      const getGigInfo = async () => {
        try {
          const { data } = await authenticated.get(`/api/gigs/${gigId}`)
          console.log('DATA', data)
          setGig(data)
        } catch (error) {
          // Handle error
          console.error('Error fetching gig info:', error)
        }
      }
      getGigInfo()
    }
  }, [gigId])

  useEffect(() => {
    const getGig = async () => {
      try {
        const { data } = await axios.get(`/api/gigs/${gigId}`)
        console.log('YO DATA', data)
        // if (!isAuthenticated() || !userIsOwner(data)) navigate(`/gigs/${gigId}`)

        // Create a new object with the gig data mapped to formFields keys
        const newFormFields = {
          date: data.date || '',
          band: data.band || '',
          price: data.price || '',
          venue: data.venue || '',
          image: data.image || '',
          setlist: data.setlist || '',
          reviews: data.reviews || [],
        }

        setFormFields(newFormFields)
      } catch (err) {
        console.log(err)
      }
    }
    getGig()
  }, [gigId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formFieldsRefact = {
        ...formFields,
      }
      console.log('formFieldsRefact', formFieldsRefact)
      console.log('id', gigId)
      await authenticated.put(`/api/gigs/${gigId}/`, formFieldsRefact)
      navigate(`/gigs/${gigId}/`)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchBandSuggestions = async (bandName) => {
    try {
      const apiKey = '79ed5b7b15ccda2a23fe2df661c9b0f0'
      const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
        bandName
      )}&api_key=${apiKey}&format=json`

      const response = await axios.get(apiUrl)
      setBandSuggestions(response.data.results.artistmatches.artist)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleBandChange = (e) => {
    const bandName = e.target.value
    setFormFields({ ...formFields, band: bandName })
    if (bandName.length > 2) {
      fetchBandSuggestions(bandName)
    }
  }

  const selectBandSuggestion = async (suggestion) => {
    try {
      const apiKey = '79ed5b7b15ccda2a23fe2df661c9b0f0'
      const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
        suggestion.name
      )}&api_key=${apiKey}&format=json`

      const response = await axios.get(apiUrl)
      const artistInfo = response.data.artist

      setFormFields({
        ...formFields,
        band: suggestion.name,
        setlist: artistInfo.bio.summary, // Set the setlist to band information
      })

      setBandSuggestions([])
    } catch (err) {
      setError(err.message)
    }
  }


  const handleShowMore = () => {
    setDisplayedResults(prev => prev + 5)
  }

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })

  }



  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>



          <Col xs={12} sm={12} md={6} lg={6} className='add-gig'>

            <Row>

              <Form onSubmit={handleSubmit} >
                <div className='form-container'>
                  <h2>Edit GIG</h2>
                  <img className='form-img' src={favicon} />
                  {/* <p className='text-center'>Enter the gig&apos;s info into the form to add it to the ENCORE database.</p> */}
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      name='band'
                      placeholder='Artist'
                      onChange={handleBandChange}
                      value={formFields.band}
                    />
                    <ul className='band-suggestions'>
                      {bandSuggestions.slice(0, displayedResults).map((suggestion) => (
                        <li key={suggestion.mbid} onClick={() => selectBandSuggestion(suggestion)}>
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                    {bandSuggestions.length > displayedResults && (
                      <Button className='show-more-button' onClick={handleShowMore}>
                        Show More
                      </Button>
                    )}
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="date" placeholder='Date' onChange={handleChange} value={formFields.date} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="venue" placeholder='Venue' onChange={handleChange} value={formFields.venue} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="price" placeholder='Price' onChange={handleChange} value={formFields.price} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control
                      type="text"
                      name="gigImage"

                      onChange={handleChange}
                      value={formFields.image}
                      placeholder={'Gig Picture (insert image URL)'}
                    />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="setlist" placeholder='Set List' onChange={handleChange} value={formFields.setlist} />
                  </Form.Group>

                  <Button variant='primary' type='submit' className='mb-3'>
                    Add Show
                  </Button>

                  {error && <p className='text-danger text-center'>{error}</p>}

                </div>

              </Form>

            </Row>


          </Col>
        </Row>


      </Container>

    </main>
  )
}

export default EditGig