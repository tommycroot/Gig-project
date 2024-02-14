import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { camelizeKeys } from 'humps'


import Error from '../error/Error'

import { userIsOwner, authenticated, getPayloadSub } from '../helpers/Auth'

const GigPage = () => {
  const navigate = useNavigate()
  const { gigId, reviewId } = useParams()

  const [gig, setGig] = useState([])

  const [error, setError] = useState('')

  const [user, setUser] = useState([])

  const [addedToGigs, setAddedToGigs] = useState(false)
  const [addedToUpcoming, setAddedToUpcoming] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [addToUpcomingClicked, setAddToUpcomingClicked] = useState(false)
  const [addToCollectionClicked, setAddToCollectionClicked] = useState(false)
  const [alreadyOwned, setAlreadyOwned] = useState(false)
  const [userIsOwnerState, setUserIsOwnerState] = useState(false)
  const [reviewDeleted, setReviewDeleted] = useState(false)



  const sub = getPayloadSub()




  useEffect(() => {
    const getUser = async () => {
      try {

        const { data } = await axios.get(`/api/auth/${sub}/`)
        // const { gigId } = await axios.get(`/api/gigs/${gigId}`)
        console.log('USER DATA', data.gigs)
        console.log('GIG ID', gigId)
        setUser(data)

        const master = []
        data.gigs.forEach(gig => {
          console.log('GIG VALS', Object.values(gig)[0])
          master.push(Object.values(gig)[0])
        })

        console.log('MASTER', master)
        console.log(Array.isArray(master))
        console.log(typeof master[0])

        if (master.includes(parseInt(gigId))) {
          setAddedToGigs(true)
          setAlreadyOwned(true)
          console.log('GIG MATCH')
        } else {
          setAddedToGigs(false)
          setAddToCollectionClicked(false)
          console.log('GIG NOT MATCHING')
        }

        const master2 = []
        data.upcoming.forEach(gig => {
          console.log('UP GIG VALS', Object.values(gig)[0])
          master2.push(Object.values(gig)[0])
        })

        console.log('MASTER 2', master2)
        console.log(Array.isArray(master2))
        console.log(typeof master2[0])

        if (master2.includes(parseInt(gigId))) {
          setAddedToUpcoming(true)
          setAlreadyOwned(true)
          console.log('UP GIG MATCH')
        } else {
          setAddedToUpcoming(false)
          setAddToUpcomingClicked(false)
          console.log('UP GIG NO MATCH')
        }

        // Check if the gig is already in the user's upcoming gigs collection
        if (data.upcoming.includes(gigId)) {
          setAddedToUpcoming(true)
        }
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
      if (userIsOwner) {
        console.log('USER IS OWNER')
        setUserIsOwnerState(true)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const getGig = async () => {
      try {
        const { data } = await authenticated.get(`/api/gigs/${gigId}/`)
        console.log('CURRENCY', data.currency)
        const camelizedData = camelizeKeys(data)
        console.log('GIG DATA', camelizedData)
        setGig(camelizedData)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getGig()
  }, [reviewDeleted])

  const addToGigs = async () => {
    try {
      if (addedToGigs) {
        // If already added, remove from gigs
        await axios.put(`/api/auth/${sub}/delete-gigs/${gigId}/`)
        setAddedToGigs(false)
        setAddToCollectionClicked(true)
      } else {
        // If not added, add to gigs
        const currentDate = new Date()
        const gigDate = new Date(gig.date)

        if (gigDate <= currentDate) {
          await axios.put(`/api/auth/${sub}/gigs/${gigId}/`)
          setAddedToGigs(true)
          setAddToCollectionClicked(true)
        } else {
          // Show message if gig is in the future
          console.log('Cannot add a future gig to gigs collection.')
          setError('Cannot add a future gig to gigs!')
        }
      }
    } catch (err) {
      console.log(err)
      setError(err.message)
      setAddToCollectionClicked(true)
    }
  }

  const addToUpcoming = async () => {
    try {
      if (addedToUpcoming) {
        // If already added, remove from upcoming
        await axios.put(`/api/auth/${sub}/delete-upcoming/${gigId}/`)
        setAddedToUpcoming(false)
        setAddToUpcomingClicked(true)
      } else {
        // If not added, add to upcoming
        const currentDate = new Date()
        const gigDate = new Date(gig.date)

        if (gigDate >= currentDate) {
          await axios.put(`/api/auth/${sub}/upcoming/${gigId}/`)
          setAddedToUpcoming(true)
          setAddToUpcomingClicked(true)
        } else {
          // Show message if gig is in the past
          console.log('Cannot add a past gig to upcoming gigs collection.')
          setError('Cannot add a past gig to upcoming gigs!')
        }
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

  const handleDelete = async () => {
    try {
      const confimation = window.confirm('Are you sure you want to permanently delete this gig?')
      if (confimation) {
        await authenticated.delete(`/api/gigs/${gigId}/`)
        console.log('deleted')
        navigate(`/profile/${sub}`)
      } else {
        console.log('Deletion canceled')
      }

    } catch (err) {
      console.log(err)
    }
  }
  const handleReviewDelete = async (reviewId) => {
    try {

      console.log('REVIEW ID', reviewId)
      const confimation = window.confirm('Are you sure you want to permanently delete this review?')
      if (confimation) {
        await axios.delete(`/api/reviews/${reviewId}/`)
        console.log('deleted')
        setReviewDeleted(true)
        console.log(reviewDeleted)
        navigate(`/gigs/${gigId}`)
      } else {
        console.log('Deletion canceled')
      }

    } catch (err) {
      console.log(err)
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

          <Col xs={12} sm={12} md={6} lg={6} className='right'>
            <Row >
              <>
                <Col className='gig-info'>
                  <img className='d-md-none mobile-image' src={gig.image} alt='gig pic'></img>

                  <h1>{gig?.band}</h1>
                  <h2>@ {gig?.venue}</h2>
                  <p>Date: {new Date(gig?.date).toLocaleDateString('en-GB')}</p>
                  <p>Price: {gig?.currency}{gig?.price}</p>
                  <div className='edit-delete'>
                    {userIsOwnerState && <Link className='toggle-button-edit toggle-button-link' id="edit" to={`/gigs/${gigId}/edit`}>Edit Gig</Link>}
                    {userIsOwnerState && <Link className='toggle-button-delete toggle-button-link' id="delete" onClick={handleDelete}>Delete Gig</Link>}
                  </div>
                  <p>Setlist: {gig?.setlist}</p>
                  {gig.reviews && gig.reviews.length > 0 ? (
                    <p>Average Rating: {averageRating}</p>
                  ) : (
                    <p>No reviews yet</p>
                  )}
                  {error && <p className="error-message">{error}</p>}
                  
                  <button className='toggle-button' onClick={addToGigs}>
                    {addedToGigs ? 'Remove Gig from Gigs' : 'Add Gig to Gigs'}
                  </button>
                  {addToCollectionClicked && (
                    <>
                      {!alreadyOwned ? (
                        <p>Gig successfully added to your gig collection!</p>

                      ) : (
                        <p>Gig succesfully removed from your gig collection!</p>


                      )}
                    </>
                  )}

                  <button className='toggle-button' onClick={addToUpcoming}>
                    {addedToUpcoming ? 'Remove Gig from Upcoming' : 'Add Gig to Upcoming'}
                  </button>
                  {addToUpcomingClicked && (
                    <>
                      {!alreadyOwned ? (
                        <p>Gig successfully added to your upcoming gigs!</p>
                      ) : (
                        <p>Gig succesfully removed from your upcoming gigs!</p>
                      )}
                    </>
                  )}
                  <Link className='toggle-button toggle-button-link' to={`/add-review/${gigId}/${sub}`}>Submit Gig Review</Link>

                </Col>
              </>
            </Row>

            <Row>
              <>
                <Col className='review-info slider'>
                  <h2>REVIEWS</h2>
                  <p>{gig.reviews ? `Number of Reviews: ${gig.reviews.length}` : 'No reviews yet'}</p>
                  {gig.reviews && gig.reviews.length > 0 ?
                    gig.reviews.map(review => {
                      const { id, reviewText, rating, owner } = review
                      console.log('OWNER', owner.id, 'SUB', sub)
                      if (review) {
                        return (
                          <div key={id} className='review-container'>
                            
                            <p className='review-content' id='review-owner'><Link to={`/profile/${owner.id}`}>{owner.username}</Link></p>
                            <p className='review-content'>{rating}/5</p>
                            <p className='review-content' id='review-text'>{reviewText}</p>
                            <p className='toggle-button-delete toggle-button-link' id="delete-review" >{owner.id === sub && <Link  onClick={() => handleReviewDelete(review.id)}>Delete</Link>}</p>
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