import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import humps from 'humps'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import hero from '../../images/hero.jpg'
import png from '../../images/png.png'

const Register = () => {

  const navigate = useNavigate()

  //! STATE

  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    reviews: [],
  })

  const [error, setError] = useState('')

  //! Executions

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const vals = humps.decamelizeKeys(formFields)
      await axios.post('/api/auth/register/', vals)
      navigate('/login')
    } catch (error) {
      console.log('error', error)
      setError(error.response.data.detail)
      console.log('ERROR FE', error)
    }

  }

  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>

          <Col xs={0} sm={0} md={0} lg={6} className='d-none d-lg-block left'>
            <div className='img-container'>
              <img alt='record collection' src={hero}></img>
              <p className='text-center-neon'>Remember your gigs with your friends forever.</p>
            </div>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Row className='form-logo-row'>
              <Col className='title-container'>
                <img alt='goldfinger' src={png} className='glowing-img'></img>

              </Col>
            </Row>

            <Row>

              <Form onSubmit={handleSubmit} >
                <div className='form-container'>
                  <h2>Register</h2>
                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name='username' placeholder='Username' onChange={handleChange} value={formFields.username} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type="password" name="passwordConfirmation" placeholder='Password Confirmation' onChange={handleChange} value={formFields.passwordConfirmation} />
                  </Form.Group>
                  <br></br>
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
                    Register
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

export default Register


