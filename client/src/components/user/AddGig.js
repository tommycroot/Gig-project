import { useState } from 'react'
import axios from 'axios'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import favicon from '../../images/favicon.png'
import { getPayloadSub } from '../helpers/Auth'
import InputMask from 'react-input-mask'

import humps from 'humps'

const AddGig = () => {
  const navigate = useNavigate()

  const sub = getPayloadSub()
  console.log('SUB', sub)
  //! STATEconst sub = getPayloadSub()

  const [formFields, setFormFields] = useState({
    date: '',
    band: '',
    price: '',
    venue: '',
    image: '',
    currency: '$',
    notes: '',
    support: '',
    setlist: '',
    reviews: [],
    owner: `${sub}`,
  })
  const CURRENCY_CHOICES = [
    '$', '£', '€', '¥', '₣', '₤', '₺', '₹', '₩', '₦', '฿', '₿', '₮', '₡', '₫', '₸', '₯', '₢', '₧', '₠'
  ]
  const [bandSuggestions, setBandSuggestions] = useState([])
  const [totalResults, setTotalResults] = useState(10)
  const [displayedResults, setDisplayedResults] = useState(5)

  const [error, setError] = useState('')

  const [venueSuggestions, setVenueSuggestions] = useState([])

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
  //! Executions
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

  const fetchBandSuggestions = async (bandName) => {
    try {
      const apiKey = '79ed5b7b15ccda2a23fe2df661c9b0f0'
      const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
        bandName
      )}&api_key=${apiKey}&format=json/`

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
        // setlist: artistInfo.bio.summary, // Set the setlist to band information
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
    if (e.target.name === 'setlist') {
      setFormFields({ ...formFields, [e.target.name]: e.target.value })
    } else {
      setFormFields({ ...formFields, [e.target.name]: e.target.value, owner: sub })
    }
  }

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
      console.log('HELP', formFields.date)
      if (!formFields.image) {
        formFields.image = 'https://w7.pngwing.com/pngs/104/393/png-transparent-musical-ensemble-musician-rock-band-angle-animals-logo-thumbnail.png'
      }

      if (!formFields.owner) {
        const ownerSub = getPayloadSub()
        formFields.owner = ownerSub
      }

      console.log('SUB CHECK', formFields)
      const [day, month, year] = formFields.date.split('-')
      const formattedDate = `${year}-${month}-${day}`
      const updatedFormFields = { ...formFields, date: formattedDate }
      setFormFields(updatedFormFields)
      console.log('SUB CHECK 2', updatedFormFields)
      const vals = humps.decamelizeKeys(updatedFormFields)
      const response = await axios.post('/api/gigs/', vals)
      const currentDate = new Date()
      const gigDate = new Date(updatedFormFields.date)
      if (gigDate > currentDate) {
        const sub = getPayloadSub()
        await axios.put(`/api/auth/${sub}/upcoming/${response.data.id}/`)
        navigate(`/profile/${sub}`)
      } else {
        const sub = getPayloadSub()
        await axios.put(`/api/auth/${sub}/gigs/${response.data.id}/`)
        navigate(`/profile/${sub}`)
      }
    } catch (error) {
      console.log('error', error)
      setError(error.response.data.detail)
      const [day, month, year] = formFields.date.split('-')
      const formattedDate = `${year}-${month}-${day}`
      console.log('New date error', formattedDate)
      // Update date directly instead of formFields.date
      const updatedDate = formattedDate
      setFormFields({ ...formFields, date: updatedDate })

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
                  <div className='title-box'>
                    <h2 id='add-show'>Add Show</h2>
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
                      <Col xs={6} md={8} className='price-field'>
                        <Form.Control className='price-placeholder'
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
                    <Form.Control type="text" name="support" placeholder='Support' onChange={handleChange} value={formFields.support} />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="notes" placeholder='Notes' onChange={handleChange} value={formFields.notes} />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control className='setlist-area' as="textarea" type="text" name="setlist" placeholder='Set List' onChange={handleChange} value={formFields.setlist} />
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
                    Add Show
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

export default AddGig