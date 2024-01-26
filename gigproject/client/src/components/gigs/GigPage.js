import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { camelizeKeys } from 'humps'


import Error from '../error/Error'

import { getPayloadSub } from '../helpers/Auth'

const GigPage = () => {

  const { gigId } = useParams()

  const [gig, setGig] = useState([])

  const [error, setError] = useState('')

  const [user, setUser] = useState([])

  const [addedToGigs, setAddedToGigs] = useState(false)
  const [addedToUpcoming, setAddedToUpcoming] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [addToUpcomingClicked, setAddToUpcomingClicked] = useState(false)
  const [addToCollectionClicked, setAddToCollectionClicked] = useState(false)
  
  

  const sub = getPayloadSub()

  useEffect(() => {
    const getGig = async () => {
      try {
        const { data } = await axios.get(`/api/gigs/${gigId}/`)
        const camelizedData = camelizeKeys(data)
        console.log('GIG DATA', camelizedData)
        setGig(camelizedData)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getGig()
  }, [])



  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${sub}/`)
        console.log('USER DATA', data)
        setUser(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getUser()
  }, [])

  const addToGigs = async () => {
    try {
      const currentDate = new Date()
      const gigDate = new Date(gig.date)

      if (gigDate <= currentDate) {
        // Gig is in the past
        await axios.put(`/api/auth/${sub}/gigs/${gigId}/`)
        setAddedToGigs(true)
        setAddToCollectionClicked(true)
      } else {
        // Gig is in the future
        // You can handle future gigs differently if needed
        console.log('Cannot add a future gig to gigs collection.')
        setAddToCollectionClicked(true)
      }
    } catch (err) {
      console.log(err)
      setError(err.message)
      setAddToCollectionClicked(true)
    }
  }

  const addToUpcoming = async () => {
    try {
      const currentDate = new Date()
      const gigDate = new Date(gig.date)

      if (gigDate >= currentDate) {
        // Gig is in the future or today
        await axios.put(`/api/auth/${sub}/upcoming/${gigId}/`)
        setAddedToUpcoming(true)
        setAddToUpcomingClicked(true)
      } else {
        // Gig is in the past
        console.log('Cannot add a past gig to upcoming gigs collection.')
        setAddToUpcomingClicked(true)
      }
    } catch (err) {
      console.log(err)
      setError(err.message)
      setAddToUpcomingClicked(true)
    }
  }

  useEffect(() => {
    if (gig.reviews && gig.reviews.length > 0) {
      // Calculate the average rating
      const totalRatings = gig.reviews.reduce((total, review) => {
        return total + review.rating
      }, 0)
      const avgRating = totalRatings / gig.reviews.length
      setAverageRating(avgRating)
    }
  }, [gig.reviews])

  return (
    <main>
      <Container className='primary-container'>
        <Row className='top-row'>

          <Col xs={0} sm={0} md={0} lg={6} className='d-none d-md-block left' >
            <div className='desktop-img'>
              <img src={gig.image}></img>
            </div>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className='right'>
            <Row >
              <>
                <Col className='gig-info'>
                  <img className='d-md-none mobile-image' src={gig.image} alt='gig pic'></img>
                  <h1>{gig?.band}</h1>
                  <h2>@ {gig?.venue}</h2>
                  <p>Date: {gig?.date}</p>
                  <p>Price: {gig?.price}</p>
                  <p>Setlist: {gig?.setlist}</p>
                  {gig.reviews && gig.reviews.length > 0 ? (
                    <p>Average Rating: {averageRating}</p>
                  ) : (
                    <p>No reviews yet</p>
                  )}
                  <button className='toggle-button' onClick={addToGigs}>
                    Add gig to your gigs
                  </button>
                  {addToCollectionClicked && (
                    <>
                      {addedToGigs ? (
                        <p>Gig successfully added to your gig collection!</p>
                      ) : (
                        <p>Cannot add a future gig to past gig collection.</p>
                        
                      )}
                    </>
                  )}

                  <button className='toggle-button' onClick={addToUpcoming}>
                    Add gig to your upcoming gigs
                  </button>
                  {addToUpcomingClicked && (
                    <>
                      {addedToUpcoming ? (
                        <p>Gig successfully added to your upcoming gigs!</p>
                      ) : (
                        <p>Cannot add a past gig to upcoming gig collection.</p>
                      )}
                    </>
                  )}
                  <Link className='toggle-button toggle-button-link' to={`/add-review/${gigId}/${sub}`}>Submit gig review</Link>
                </Col>
              </>
            </Row>

            <Row>
              <>
                <Col className='review-info slider'>
                  <h2>REVIEWS</h2>
                  {gig.reviews && gig.reviews.length > 0 ?
                    gig.reviews.map(review => {
                      const { id, reviewText, rating, owner } = review
                      if (review) {
                        return (
                          <div key={id} className='review-container'>
                            <p className='review-content'><Link to={`/profile/${owner.id}`}>{owner.username}</Link></p>
                            <p className='review-content'>Rating: {rating}/5</p>
                            <p className='review-content'>{reviewText}</p>
                          </div>
                        )
                      }
                    })
                    :
                    <>
                      <p>No reviews for this gig. Click the link to add one.</p>
                    </>
                  }
                </Col>
              </>
              <div className='buffer'></div>
            </Row>
          </Col>
        </Row>
      </Container>
    </main >
  )
}

export default GigPage