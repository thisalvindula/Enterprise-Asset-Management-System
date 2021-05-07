import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Card, Row, Col, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { getUserDetails, updateUser } from '../../actions/userActions'
import { USER_UPDATE_RESET } from '../../types/userTypes'
import '../Screens.css'
import userEdit from '../Images/userEdit.jpg'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push('/admin/userslist')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [dispatch, history, userId, user, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: userId, name, email, isAdmin }))
  }

  return (
    <div className="userEditScreen">
      <Card className="userEditCard">
        <Row>
          <Col md={6}>
            <Image className="userEditImage mt-4 ml-2" src={userEdit} />
          </Col>
          <Col className="UserEditFormCol" md={6}>
            <div>
              <h1>Edit User</h1>
              {loadingUpdate && <Loader />}
              {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error}</Message>
              ) : (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="name">
                    <Form.Label className="formFieldDet">Name</Form.Label>
                    <Form.Control
                      className="userEditInput"
                      type="name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="email">
                    <Form.Label className="formFieldDet">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      className="userEditInput"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="isadmin">
                    <Form.Check
                      type="checkbox"
                      label="Is Admin?"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    ></Form.Check>
                  </Form.Group>

                  <Row>
                    <Col md={7}></Col>
                    <Col>
                      <Button type="submit" variant="info">
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default UserEditScreen
