import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'


import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import hero from '../../images/hero.jpg'
import { getPayloadSub, removeToken } from '../helpers/Auth'


const EditProfile = () => {

  const { id } = useParams()

  const { state } = useLocation()

  const navigate = useNavigate()

  console.log('IMPORTED STATE', state.info.username)
  console.log('LOCATION', state.info.location)

  const { info } = state

  console.log('INFO', info)

  const sub = getPayloadSub()

  const [profile, setProfile] = useState({})
  const [formFields, setFormFields] = useState({
    profile_image: info.profile_image,
    first_name: info.username,
    location: info.location || 'Location',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/auth/${id}/`, formFields)
      navigate(`/profile/${id}`)
    } catch (err) {
      console.log('error', err)
      setError(err.response.data.message)
    }

  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${sub}/`)
        setProfile(data)
        console.log('Profile ID:', data.id) // Log the updated profile id
        console.log('SUB:', sub)
      } catch (err) {
        console.log(err)
      }
    }

    getProfile() // Call getProfile on component mount
  }, [])

  const deleteAccount = async () => {

    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        console.log('Confirmed')
        await axios.delete(`/api/auth/${id}/`)
        handleLogOut()

      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
  }

  const handleLogOut = () => {
    removeToken()
    navigate('/')
  }



  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>

          <Col xs={0} sm={0} md={0} lg={6} className='d-none d-md-block left'>

            <div className='img-container'>
              <img alt='gig picture' id='gig-picture' src={hero}></img>
            </div>
          </Col>

          <Col xs={12} sm={12} md={12} lg={6} className='right-review'>

            <Row className='edit-profile-container' >

              <Form onSubmit={handleSubmit} class-name='review-content'>
                <div className='form-container'>
                  <h2>Account Settings</h2>
                  <Form.Group className='mb-3'>
                    <p id="image-text">Profile Image (Insert URL)</p>
                    <Form.Control type="text" name='profile_image' placeholder={'Insert image URL'} onChange={handleChange} value={formFields.profile_image} />
                  </Form.Group>
                  <p id="image-text">Username</p>
                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="username" placeholder={info.username || 'Username'} onChange={handleChange} value={formFields.username} />
                  </Form.Group>
                  <p id="image-text">Location</p>
                  <Form.Group className='mb-3'>
                    <Form.Control type="text" name="location" placeholder={info.location || 'Location'} onChange={handleChange} value={formFields.location} />

                  </Form.Group>

                  <Button variant='primary' type='submit' id='submit' className='mb-3'>
                    Update
                  </Button>

                  {error && <p className='text-danger text-center'>{error}</p>}

                </div>

              </Form>
            </Row>
            <Row className='edit-profile-container' id='second-container'>
              <Col xs={12} sm={12} md={12} lg={6} className='right-review'>
                <div className='delete-profile'>
                  <button className={sub !== profile.id ? 'd-none' : 'toggle-button delete'} onClick={deleteAccount}>Delete Account</button>
                </div>
              </Col>
            </Row>

          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default EditProfile