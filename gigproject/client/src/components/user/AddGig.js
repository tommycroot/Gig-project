import { useState } from 'react'
import axios from 'axios'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useNavigate } from 'react-router-dom'
import favicon from '../../images/favicon.png'

import humps from 'humps'

const AddGig = () => {
  const navigate = useNavigate()
  //! STATE

  const [formFields, setFormFields] = useState({
    date: '',
    band: '',
    price: '',
    venue: '',
    image: '',
    setlist: '',
    reviews: [],
  })

  const [bandSuggestions, setBandSuggestions] = useState([])
  const [totalResults, setTotalResults] = useState(10)
  const [displayedResults, setDisplayedResults] = useState(5)

  const [error, setError] = useState('')

  //! Executions

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formFields.image) {
        formFields.image = 'https://w7.pngwing.com/pngs/104/393/png-transparent-musical-ensemble-musician-rock-band-angle-animals-logo-thumbnail.png'
      }

      const vals = humps.decamelizeKeys(formFields)
      const response = await axios.post('/api/gigs/', vals)
      navigate(`/gigs/${response.data.id}`)
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }

  }




  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>



          <Col xs={12} sm={12} md={6} lg={6} className='add-gig'>

            <Row>

              <Form onSubmit={handleSubmit} >
                <div className='form-container'>
                  <h2>ADD GIG</h2>
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

export default AddGig