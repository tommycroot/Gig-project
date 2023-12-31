import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import Error from '../error/Error'

import { getPayloadSub, removeToken } from '../helpers/Auth'
import humps from 'humps'


const Profile = () => {

  const { id } = useParams()

  const sub = getPayloadSub()

  const navigate = useNavigate()

  const [profile, setProfile] = useState({})

  const [loggedUser, setLoggedUser] = useState({})

  const [error, setError] = useState('')

  const [gigView, setGigView] = useState(true)

  const [followButtonVal, setFollowButtonVal] = useState('Follow this user')

  const [buttonUserData, setButtonUserData] = useState({})
  const [buttonAccountData, setButtonAccountData] = useState({})


  useEffect(() => {
    const getProfile = async () => {
      try {

        const { data } = await axios.get(`/api/auth/${id}/`)
        console.log('USER DATA', data)
        setProfile(data)
        console.log('PROFILE', data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getProfile()

  }, [id])

  useEffect(() => {
    const getLoggedUser = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${sub}/`)
        console.log('LOGGED USER DATA', data)
        setLoggedUser(data)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    }
    getLoggedUser()
  }, [])

  useEffect(() => {
    const buttonVal = async () => {

      try {
        const data1 = await axios.get(`/api/auth/${sub}/`)
        setButtonUserData(data1.data)
        const data2 = await axios.get(`/api/auth/${id}/`)

        setButtonAccountData(data2.data)

        const user = data1.data
        const account = data2.data
        console.log('USER', user)
        console.log('ACCOUNT', account)

        console.log('FUNCTION WORKING')
        console.log('OBJECT 1', Object.values(account)[0])
        console.log('loggedUserTest', user.following)

        const master = []



        user.following.forEach(item => {
          console.log('TEST VALS', Object.values(item)[0])
          master.push(Object.values(item)[0])
        })

        if (master.includes(Object.values(account)[0])) {
          setFollowButtonVal('Unfollow this user')
          console.log('FOLLOW BUTTON VALUE', followButtonVal)
        } else {
          setFollowButtonVal('Follow this user')
          console.log('FOLLOW BUTTON VALUE', followButtonVal)
        }

        console.log('TEST MASTER', master)
      } catch (err) {
        console.log(err)
        setError(err.message)
      }


    }
    buttonVal()
  }, [id])


  const toggleGigView = (e) => {
    if (gigView) {
      setGigView(false)
      e.target.innerText = 'Show gigs'
    } else {
      setGigView(true)
      e.target.innerText = 'Show upcoming'
    }
    console.log('GIG VIEW', gigView)
    console.log(e.target)
  }

  const followUnfollow = async (e) => {
    console.log(profile.id)
    console.log(sub)
    console.log('Logged user', loggedUser.following)
    console.log('condition', Object.values(profile)[0])
    const otherId = Object.values(profile)[0]

    const master = []

    loggedUser.following.forEach(item => {
      console.log('vals', Object.values(item)[0])
      master.push(Object.values(item)[0])
    })

    console.log('FILTERED', master)

    if (master.includes(otherId) === true) {
      try {
        await axios.put(`/api/auth/${sub}/unfollow/${profile.id}/`)
        const { data } = await axios.get(`/api/auth/${sub}/`)
        console.log('LOGGED USER DATA', data)
        setLoggedUser(data)
        setFollowButtonVal('Follow this user')
      } catch (err) {
        console.log(err)
        setError(err.message)
      }
    } else {
      try {
        await axios.put(`/api/auth/${sub}/follow/${profile.id}/`)
        const { data } = await axios.get(`/api/auth/${sub}/`)
        console.log('LOGGED USER DATA', data)
        setLoggedUser(data)
        setFollowButtonVal('Unfollow this user')
        console.log('FOLLLOWING')
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


  return (


    <main>
      <Container className='primary-container'>
        <Row className='top-row'>
          <Col xs={12} sm={12} md={6} lg={6} className='left-col'>
            <Row className='user-info'>
              <>
                {profile.profile_image ? <img src={profile.profile_image} alt="profile picture" className='profile-pic'></img> : <img src='https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg' alt="profile picture" className='profile-pic'></img>}
                <div className='user-info'>
                  <h2 className='username text-wrap'>{profile.username}</h2>
                  {profile.gigs ? <p>Gigs attended: {profile.gigs.length}</p> : <p>Gigs: 0</p>}
                  {profile.following ? <p>Following: {profile.following.length}</p> : <p>Following: 0</p>}
                  {profile.reviews ? <p>Reviews: {profile.reviews.length}</p> : <p>Reviews: 0</p>}
                  <button className='toggle-button' onClick={toggleGigView}>Show Upcoming</button>
                  <button onClick={followUnfollow} className={sub === profile.id ? 'd-none' : 'toggle-button'}>{followButtonVal}</button>
                  <Link to={`/auth/${id}/edit`} state={{ info: profile }} className={sub !== profile.id ? 'd-none' : 'toggle-button'}>Edit Profile</Link>
                  <button className={sub !== profile.id ? 'd-none' : 'toggle-button delete'} onClick={deleteAccount}>Delete Account</button>
                </div>
              </>
            </Row>
            <div className='following-collection-wrapper'>
              <h4>Following:</h4>
              <Row className='content-slider'>
                {/* eslint-disable-next-line camelcase */}
                {profile.following && profile.following.length > 0 ? (
                  profile.following.map(item => {
                    {/* eslint-disable-next-line camelcase */ }
                    const { profile_image, username, id } = item
                    return (
                      <Col key={id}>
                        {/* eslint-disable-next-line camelcase */}
                        <img src={profile_image} height='100' />
                        <h4><Link to={`/auth/${id}`}>{username}</Link></h4>

                      </Col>
                    )
                  })
                ) : (
                  <>
                    {sub === profile.id ? <p>Find friends to follow <Link to={'/search-users'}>here</Link></p> : <p>{profile.username} is not following anyone</p>}
                  </>
                )}
              </Row>
            </div>
            <div className='following-collection-wrapper d-md-none'>
              {gigView ? <h4 className='d-md-none'>Gigs:</h4> : <h4 className='d-md-none'>Upcoming Gigs:</h4>}
              <Row className='content-slider d-md-none' xs={12} sm={12}>
                {gigView ?
                  profile.gigs && profile.gigs.length > 0 ?
                    profile.gigs.map(gig => {
                      const { id, band, image, venue, date } = gig
                      return (
                        <Col key={id}>
                          <Link to={`/gigs/${id}`}>
                            <img src={image} height='100' alt={`${band} at ${venue} on ${date}`} />
                            <span>{band} {venue} {date}</span>
                          </Link>
                        </Col>
                      )
                    })
                    :
                    <>
                      <p>No attended gigs.</p>
                    </>

                  :
                  profile.upcoming && profile.upcoming.length > 0 ?
                    profile.upcoming.map(gig => {
                      const { id, band, image, venue, date } = gig
                      return (
                        <Col key={id}>
                          <Link to={`/gigs/${id}`}>
                            <img src={image} height='100' alt={`${band} at ${venue} on ${date}`} />
                            <span>{band} {venue} {date}</span>
                          </Link>
                        </Col>
                      )
                    })
                    :
                    <>
                      <p>No gigs in upcoming</p>
                    </>
                }
              </Row>

            </div>
            <div className='buffer'></div>
          </Col>

          <Col xs={0} sm={0} md={6} lg={6} className='d-none d-md-block right'>
            {gigView ? <h4>Gigs:</h4> : <h4>Upcoming gigs:</h4>}
            <Row className='content-slider-vert'>
              {gigView ?
                profile.gigs && profile.gigs.length > 0 ?
                  profile.gigs.map(gig => {
                    const { id, image, band, venue, date } = gig
                    return (
                      <Col key={id} md={8} lg={4} className='gig-container'>
                        <Link to={`/gigs/${id}`}>
                          <Card className='gig-card'>
                            {image ? (
                              <Card.Img variant='top' src={image} alt={`${band} at ${venue} on ${date}`} />
                            ) : (
                              <div>
                                {/* Some fallback content when image is missing */}
                                No Image Available
                              </div>
                            )}
                          </Card>
                        </Link>
                      </Col>
                    )
                  })
                  :
                  <>
                    <p>No attended gigs.</p>
                  </>

                :
                profile.upcoming && profile.upcoming.length > 0 ?
                  profile.upcoming.map(gig => {
                    const { id, image, band, venue, date } = gig
                    return (
                      <Col key={id} md={8} lg={4} className='gig-container'>
                        <Link to={`/gigs/${id}`}>
                          <Card className='gig-card'>
                            <Card.Img variant='top' src={image} alt={`${band} at ${venue} on ${date}`} />
                            <Card.Body>
                              <Card.Title>{band}</Card.Title>
                              <Card.Text>{venue}</Card.Text>
                              <Card.Text>{date}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                    )
                  })
                  :
                  <>
                    <p>No upcoming gigs</p>
                  </>
              }
            </Row>

          </Col>
        </Row>
      </Container>
    </main >
  )
}

export default Profile