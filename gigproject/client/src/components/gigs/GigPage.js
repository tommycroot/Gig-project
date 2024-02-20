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
  const [ownerUsername, setOwnerUsername] = useState('')
  const [ownerSub, setOwnerSub] = useState('')


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
        console.log(sub)
        console.log(camelizedData.owner)
        setGig(camelizedData)
        if (sub === camelizedData.owner) {
          setUserIsOwnerState(true)
          console.log(userIsOwnerState)
        }

        console.log(userIsOwnerState)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getGig()
  }, [reviewDeleted])

  const addToGigs = async () => {
    setError(false)
    try {
      if (addedToGigs) {
        // If already added, remove from gigs
        await axios.put(`/api/auth/${sub}/delete-gigs/${gigId}/`)
        setAddedToGigs(false)
        setAddToCollectionClicked(true)
        setAlreadyOwned(true)
      } else {
        // If not added, add to gigs
        const currentDate = new Date()
        const gigDate = new Date(gig.date)

        if (gigDate <= currentDate) {
          await axios.put(`/api/auth/${sub}/gigs/${gigId}/`)
          setAddedToGigs(true)
          setAddToCollectionClicked(true)
          setAlreadyOwned(false)
          setTimeout(() => setAddToCollectionClicked(false), 5000)
        } else {
          // Show message if gig is in the future
          console.log('Cannot add a future gig to gigs collection.')
          setError('Cannot add a future gig to gigs!')
          setTimeout(() => setAddToCollectionClicked(false), 5000)
        }
      }
    } catch (err) {
      console.log(err)
      setError(err.message)
      setAddToCollectionClicked(true)
    }
  }

  const addToUpcoming = async () => {
    setError(false)
    try {
      if (addedToUpcoming) {
        // If already added, remove from upcoming
        await axios.put(`/api/auth/${sub}/delete-upcoming/${gigId}/`)
        setAddedToUpcoming(false)
        setAddToUpcomingClicked(true)
        setTimeout(() => setAddToUpcomingClicked(false), 2000)
        setAlreadyOwned(true)
      } else {
        // If not added, add to upcoming
        const currentDate = new Date()
        const gigDate = new Date(gig.date)

        if (gigDate >= currentDate) {
          await axios.put(`/api/auth/${sub}/upcoming/${gigId}/`)
          setAddedToUpcoming(true)
          setAddToUpcomingClicked(true)
          setAlreadyOwned(false)
          setTimeout(() => setAddToUpcomingClicked(false), 2000)
        } else {
          // Show message if gig is in the past
          console.log('Cannot add a past gig to upcoming gigs collection.')
          setError('Cannot add a past gig to upcoming gigs!')
          setTimeout(() => setAddToUpcomingClicked(false), 2000)
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
      const avgRating = Math.ceil(totalRatings / gig.reviews.length)
      setAverageRating(avgRating)
    }
  }, [gig.reviews])

  useEffect(() => {
    const findOwner = async () => {
      setError(false)
      try {
        if (gig.owner) {
          const { data } = await axios.get(`/api/auth/${gig.owner}/`)
          console.log('Owner Data:', data)
          setOwnerUsername(data.username)
          setOwnerSub(data.id)
        }
      } catch (error) {
        console.error('Error fetching owner:', error)
        setError('Error fetching owner')
      }
    }
    findOwner()

  }, [gig.owner])


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
            <Col className='review-info slider'>
              <h2>REVIEWS</h2>
              <p style={{ height: '10px' }}>
                <span id="reviews-count-lg">
                  Number of Reviews:
                </span>
                <span id='reviews-number-lg'>
                  {gig.reviews ? ` ${gig.reviews.length}` : 'No reviews yet'}
                </span>

              </p>

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
                        <p className={`toggle-button-delete toggle-button-link ${owner.id === sub ? 'show-delete' : ''}`} id="delete-review">{owner.id === sub && <Link onClick={() => handleReviewDelete(review.id)}>Delete</Link>}</p>

                      </div>
                    )
                  }
                })
                :
                <>
                  <p>No reviews. Click <Link id='here' to={`/add-review/${gigId}/${sub}`}>here </Link>
                    to add one.</p>
                </>
              }
            </Col>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className='right'>
            <Row >
              <>
                <Col className='gig-info'>
                  <img className='d-md-none mobile-image' src={gig.image} alt='gig pic'></img>

                  <h1>{gig?.band}</h1>
                  <h2>@ {gig?.venue}</h2>
                  <p>Added by <p className='review-content' id='review-owner'><Link to={`/profile/${ownerSub}`}>{ownerUsername}</Link></p></p>
                  <div className='edit-delete' style={{ display: userIsOwnerState ? 'block' : 'none' }}>
                    {userIsOwnerState ? <Link className='toggle-button-edit toggle-button-link' id="edit" to={`/gigs/${gigId}/edit`}>Edit Show</Link> : null}

                  </div>
                  <p><span className='span-key'>Date:</span> <span className='span-value'>{new Date(gig?.date).toLocaleDateString('en-GB')}</span></p>
                  <p><span className='span-key'>Price:</span> <span className='span-value'>{gig?.currency}{gig?.price}</span></p>

                  <p><span className='span-key'>Setlist:<br></br></span> <span className='span-value'>{gig?.setlist}</span></p>
                  <p><span className='span-key'>Notes:</span><br></br> <span className='span-value'>{gig?.notes}</span></p>
                  <p><span className='span-key'>Support Bands:</span><br></br> <span className='span-value'>{gig?.support}</span></p>
                  {gig.reviews && gig.reviews.length > 0 ? (
                    <p><span className='span-key'>Average Rating:</span> <span className='span-value'>{averageRating}</span></p>
                  ) : (
                    <p><span className='span-key'>No reviews yet</span></p>
                  )}


                  <button className='toggle-button' id='add-gig-button' onClick={addToGigs}>
                    {addedToGigs ? 'Remove Show' : 'Add Show'}
                  </button>
                  {addToCollectionClicked && (
                    <>
                      {!alreadyOwned ? (
                        <p>Show successfully added to your collection!</p>

                      ) : (
                        <p>Show succesfully removed from your collection!</p>


                      )}
                    </>
                  )}

                  <button className='toggle-button' onClick={addToUpcoming}>
                    {addedToUpcoming ? 'Remove Upcoming Show' : 'Add Upcoming Show'}
                  </button>
                  {addToUpcomingClicked && (
                    <>
                      {!alreadyOwned ? (
                        <p>Show successfully added to your upcoming collection!</p>
                      ) : (
                        <p>Show succesfully removed from your upcoming collection!</p>
                      )}
                    </>
                  )}
                  <Link className='toggle-button toggle-button-link' to={`/add-review/${gigId}/${sub}`}>Submit Review</Link>
                  <br></br>{error && <p className="error-message">{error}</p>}

                  {userIsOwnerState ? <Link className='toggle-button-delete toggle-button-link' id="delete" onClick={handleDelete}>Delete Gig</Link> : null}


                </Col>
              </>
            </Row>

            <Row>
              <>
                <Col xs={12} className='review-info slider d-block d-md-none'>
                  <h2>REVIEWS</h2>
                  <p style={{ height: '10px' }}>
                    <span id="reviews-count">
                      Number of Reviews:
                    </span>
                    <span id='reviews-number'>
                      {gig.reviews ? ` ${gig.reviews.length}` : 'No reviews yet'}
                    </span>

                  </p>

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
                            <p className='toggle-button-delete toggle-button-link' id="delete-review" >{owner.id === sub ? <Link onClick={() => handleReviewDelete(review.id)}>Delete</Link> : null}</p>
                          </div>
                        )
                      }
                    })
                    :
                    <>
                      <p>No reviews. Click <Link id='here' to={`/add-review/${gigId}/${sub}`}>here </Link>
                        to add one.</p>
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