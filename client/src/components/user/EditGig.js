import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useNavigation } from 'react-router-dom'
import axios from 'axios'
import { authenticated, isAuthenticated, userIsOwner } from '../helpers/Auth.js'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputMask from 'react-input-mask'
import favicon from '../../images/favicon.png'

import humps from 'humps'

const EditGig = () => {
  const navigate = useNavigate()
  const { gigId } = useParams()
  const [gig, setGig] = useState(null)
  const [error, setError] = useState('')
  const [bandSuggestions, setBandSuggestions] = useState([])
  const [venueSuggestions, setVenueSuggestions] = useState([])
  const [displayedResults, setDisplayedResults] = useState(5)
  const CURRENCY_CHOICES = [
    '$', '£', '€', '¥', '₣', '₤', '₺', '₹', '₩', '₦', '฿', '₿', '₮', '₡', '₫', '₸', '₯', '₢', '₧', '₠'
  ]
  const [formFields, setFormFields] = useState({
    date: '',
    band: '',
    price: '',
    currency: '',
    venue: '',
    image: '',
    setlist: '',
    notes: '',
    support: '',
    reviews: [],
  })


  console.log('GIG ID', gigId)
  useEffect(() => {
    if (gigId) {
      const getGigInfo = async () => {
        try {
          const { data } = await authenticated.get(`/api/gigs/${gigId}/`)
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }


  useEffect(() => {
    const getGig = async () => {
      try {
        const { data } = await authenticated.get(`/api/gigs/${gigId}/`)
        console.log('YO DATA', data)
        console.log('DATE DATE', data.date)


        // Create a new object with the gig data mapped to formFields keys
        const newFormFields = {
          date: data.date ? formatDate(data.date) : '',
          band: data.band || '',
          price: data.price || '',
          currency: data.currency || '$',
          venue: data.venue || '',
          image: data.image || '',
          notes: data.notes || '',
          support: data.support || '',
          setlist: data.setlist || '',
          reviews: data.reviews || [],
        }
        if (!newFormFields.image === 'https://w7.pngwing.com/pngs/104/393/png-transparent-musical-ensemble-musician-rock-band-angle-animals-logo-thumbnail.png') {
          newFormFields.image = ''
        }
        console.log('DATE DATE', data.date)
        setFormFields(newFormFields)
      } catch (err) {
        console.log(err)
      }
    }
    getGig()
  }, [gigId])

  useEffect(() => {
    if (error) {
      const [day, month, year] = formFields.date.split('-')
      const formattedDate = `${year}-${month}-${day}`
      setFormFields({ ...formFields, date: formattedDate })
    }
  }, [error])

  const handleSubmit = async (e) => {

    e.preventDefault()


    try {
      if (!formFields.image) {
        formFields.image = 'https://w7.pngwing.com/pngs/104/393/png-transparent-musical-ensemble-musician-rock-band-angle-animals-logo-thumbnail.png'
      }
      const [day, month, year] = formFields.date.split('-')
      const formattedDate = `${year}-${month}-${day}`
      const updatedFormFields = { ...formFields, date: formattedDate }
      // Update the form fields
      setFormFields(updatedFormFields)

      const vals = humps.decamelizeKeys(updatedFormFields)
      console.log('VALS', vals)
      await authenticated.put(`/api/gigs/${gigId}/`, vals)
      navigate(`/gigs/${gigId}/`)
    } catch (error) {
      console.log(error)
      setError(error.response.data.detail)
      const [day, month, year] = formFields.date.split('-')
      const formattedDate = `${year}-${month}-${day}`
      console.log('New date error', formattedDate)
      // Update date directly instead of formFields.date
      const updatedDate = formattedDate
      setFormFields({ ...formFields, date: updatedDate })
    }
  }

  const fetchBandSuggestions = async (e) => {
    const bandName = e.target.value // Extract the band name from the event object
    try {
      const apiKey = '79ed5b7b15ccda2a23fe2df661c9b0f0'
      const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
        bandName
      )}&api_key=${apiKey}&format=json`

      const response = await axios.get(apiUrl)
      // Ensure that the response data structure is consistent with the venue suggestions
      // Set bandSuggestions to an array of suggestions if available, otherwise set it to an empty array
      setBandSuggestions(response.data.results.artistmatches.artist || [])
    } catch (err) {
      setError(err.message)
    }
  }
  const handleBandChange = (e) => {
    const bandName = e.target.value
    setFormFields({ ...formFields, band: bandName })
    if (bandName.length > 2) {
      fetchBandSuggestions(e) // Pass the event object to fetchBandSuggestions
    }
  }



  const selectBandSuggestion = async (suggestion) => {
    try {
      const apiKey = '79ed5b7b15ccda2a23fe2df661c9b0f0'
      const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
        suggestion.name
      )}&api_key=${apiKey}&format=json`

      const response = await axios.get(apiUrl)
      const artistInfo = response.data.artist

      setFormFields({
        ...formFields,
        band: suggestion.name,
        // setlist: artistInfo.bio.summary, // Set the setlist to band information
      })

      setBandSuggestions([])
    } catch (error) {
      setError(error)
    }
  }


  const handleShowMore = () => {
    setDisplayedResults(prev => prev + 5)
  }

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    console.log('FORM FIELDS', formFields)
  }
  const fetchVenueSuggestions = async (e) => {
    const input = e.target.value
    try {
      const response = await axios.get(`/api/auth/google-places-proxy/?query=${encodeURIComponent(input)}`)
      setVenueSuggestions(response.data.results)
      console.log('RESPONSE', response.data)
    } catch (error) {
      console.error('Error fetching venue suggestions:', error)
    }
  }

  const handleVenueChange = (e) => {
    const venueName = e.target.value
    setFormFields({ ...formFields, venue: venueName })
    if (venueName.length > 2) {
      fetchVenueSuggestions(e)
    }
  }

  const handleSelectVenue = (suggestion) => {
    setFormFields({ ...formFields, venue: suggestion.name })
    setVenueSuggestions([]) // Clear venue suggestions after selection if needed
  }


  const renderVenueSuggestions = () => {
    return (
      <ul className='band-suggestions'>
        {venueSuggestions.slice(0, displayedResults).map((suggestion) => (
          <li key={suggestion.place_id} onClick={() => handleSelectVenue(suggestion)}>
            {suggestion.name}
          </li>
        ))}
        {venueSuggestions.length > displayedResults && (
          <li onClick={handleShowMore}>Show More</li>
        )}
      </ul>
    )
  }

  const renderBandSuggestions = () => {
    return (
      <ul className='band-suggestions'>
        {Array.isArray(bandSuggestions) && bandSuggestions.slice(0, displayedResults).map((suggestion, index) => (
          <li key={index} onClick={() => selectBandSuggestion(suggestion)}>
            {suggestion.name}
          </li>
        ))}
        {bandSuggestions && bandSuggestions.length > displayedResults && (
          <Button className='show-more-button' onClick={handleShowMore}>
            Show More
          </Button>
        )}
      </ul>
    )
  }
  

  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>



          <Col xs={12} sm={12} md={6} lg={6} className='add-gig'>

            <Row>

              <Form onSubmit={handleSubmit} >
                <div className='form-container'>
                  <div className='title-box'>
                    <h2>Edit Show</h2>
                    <img className='form-img' src={favicon} />
                  </div>
                  {/* <p className='text-center'>Enter the gig&apos;s info into the form to add it to the ENCORE database.</p> */}
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      name='band'
                      placeholder='Artist'
                      onChange={handleBandChange}
                      value={formFields.band}
                    />
                    {renderBandSuggestions()}
                  </Form.Group>

                  <InputMask mask="99-99-9999" value={formFields.date} onChange={handleChange}>
                    {(inputProps) => <Form.Control type="text" name="date" placeholder='DD-MM-YYYY' {...inputProps} />}
                  </InputMask>

                  <Form.Group className='mb-3'>
                    <Form.Control
                      type="text"
                      name="venue"
                      placeholder="Venue"
                      onChange={handleVenueChange}
                      value={formFields.venue}
                    />
                    {renderVenueSuggestions()}
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Row className='price-currency'>
                      <Col xs={6} md={4} className='currency-field'>
                        <Form.Select name="currency" onChange={handleChange} value={formFields.currency}>
                          {CURRENCY_CHOICES.map((symbol) => (
                            <option key={symbol} value={symbol}>{symbol}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col xs={6} md={8} className='price-field-edit'>
                        <Form.Control className='price-placeholder-edit'
                          type="text"
                          name="price"
                          placeholder='Price'
                          onChange={handleChange}
                          value={formFields.price}
                        />
                      </Col>

                    </Row>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control
                      type="text"
                      name="image"

                      onChange={handleChange}
                      value={formFields.image}
                      placeholder={'Gig Picture (insert image URL)'}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control className='venue' type="text" name="support" placeholder='Support Bands' onChange={handleChange} value={formFields.support} />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control className='venue' type="text" name="notes" placeholder='Notes' onChange={handleChange} value={formFields.notes} />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control className='setlist-area' type="text" name="setlist" as="textarea" placeholder='Set List' onChange={handleChange} value={formFields.setlist} />
                  </Form.Group>
                  {error && (
                    <ul className="error">
                      {Object.keys(error).map((key) =>
                        error[key].map((errorMessage) => (
                          <li className='text-danger text-center' key={`${key}-${errorMessage}`}>{`${key}: ${errorMessage}`}</li>
                        ))
                      )}
                    </ul>
                  )}
                  <Button variant='primary' type='submit' id='submit' className='mb-3'>
                    Update Show
                  </Button>



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