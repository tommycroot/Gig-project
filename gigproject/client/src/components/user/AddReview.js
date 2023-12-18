import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import humps from 'humps'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


const AddReview = () => {

  const { gigId, sub } = useParams()

  console.log('RECORD ID', gigId)
  console.log('SUB', sub)

  const navigate = useNavigate()

  //! STATE

  const [formFields, setFormFields] = useState({
    gig: gigId,
    owner: sub,
    reviewText: '',
    rating: '',
  })

  const [gig, setGig] = useState([])

  const [error, setError] = useState('')

  //! Executions

  useEffect(() => {
    const getGig = async () => {
      try {
        const { data } = await axios.get(`/api/gigs/${gigId}/`)
        console.log('Gig DATA', data)
        setGig(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getGig()
  }, [])

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const vals = humps.decamelizeKeys(formFields)
      await axios.post('/api/reviews/', vals)
      navigate(`/gigs/${gigId}`)
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }

  }

  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>

          <Col xs={0} sm={0} md={0} lg={6} className='d-none d-md-block left' >
            <div className='desktop-img'>
              <img src={gig.image}></img>
            </div>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className='right-review'>
            <Row className='mobile-gig-container'>
              <Col xs={12} sm={12} className='d-md-none mobile-gig-review'>
                <h1>ADD GIG REVIEW</h1>
                <img className='d-md-none mobile-gig-pic' src={gig.image} alt='gig image'></img>
              </Col>
            </Row>

            <Row className='review-content'>

              <Form onSubmit={handleSubmit} className='review' >
                <div className='form-container '>
                  <h2>Review Info</h2>
                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name='reviewText' placeholder='Review text' onChange={handleChange} value={formFields.reviewText} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="number" name="rating" placeholder='Rating out of 5' onChange={handleChange} value={formFields.rating} />
                  </Form.Group>

                  <Button variant='primary' type='submit' className='mb-3'>
                    Submit review
                  </Button>

                  {error && <p className='text-danger text-center'>{error}</p>}

                </div>

              </Form>

            </Row>
            <div className='buffer'></div>

          </Col>

        </Row>



      </Container>


    </main >
  )


}

export default AddReview