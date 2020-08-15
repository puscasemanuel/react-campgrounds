import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

function CampgroundDetails() {
  const [item, setItem] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [updatedComment, setUpdatedComment] = useState('');
  const [editComment, setEditComment] = useState({
    edit: false,
    id: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  let { id } = useParams();
  let postId = item._id;

  useEffect(() => {
    const userData = window.localStorage.getItem('data');
    const parsedData = JSON.parse(userData);

    setData(parsedData);
  }, [id]);

  useEffect(() => {
    const fetchCampground = async () => {
      const result = await axios(`/api/v1/campgrounds/${id}`, {
        withCredentials: true,
      });
      setItem(result.data.data.campground);
      setIsLoading(false);
    };
    fetchCampground();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (postId) {
        const result = await axios(`/api/v1/comments/${postId}`, {
          withCredentials: true,
        });
        setComments(result.data.comments);
        console.log(result.data.comments);
      }
    };
    fetchComments();
  }, [postId]);

  const deleteCampground = () => {
    if (window.confirm('Are you sure?')) {
      axios
        .delete(`/api/v1/campgrounds/${id}`, {
          withCredentials: true,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    window.location = '/';
  };

  const updateComment = (id) => {
    axios
      .put(
        `/api/v1/comments/${id}`,
        { text: updatedComment },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        window.location = `/campground/${item.slug}`;
      });
  };

  const deleteComment = (id) => {
    if (window.confirm('Are you sure?')) {
      axios
        .delete(`/api/v1/comments/${id}`, {
          withCredentials: true,
        })
        .then((data) => {
          window.location = `/campground/${item.slug}`;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const checkComment =
    comments &&
    comments.map((comment, index) => (
      <div className="row mt-5 mb-5" key={comment._id}>
        <div className="col-6 shadow-lg p-3 mb-5 bg-white rounded">
          <div className="card card-white post">
            <div className="post-heading">
              <div className="float-left image">
                <img
                  src={`/${comment.author.photo}`}
                  className="img-circle avatar img-fluid"
                  width="100"
                  height="100"
                  alt=""
                />
              </div>
              <div className="float-left meta">
                <div className="title h5 p-2">
                  <b>{comment.author.username}</b>
                </div>
                <h6 className="text-muted time p-2">
                  {dayjs(comment.createdAt).fromNow()}
                </h6>
              </div>
            </div>
            <div className="post-description mt-3 p-3">
              {editComment.edit && editComment.id === comment._id ? (
                <>
                  <p>{comment.text}</p>
                  <Form.Group controlId="formBasic">
                    <Form.Control
                      name="text2"
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      type="text"
                      placeholder="Type new comment"
                    />

                    <div>
                      <Button
                        size="xs"
                        variant="primary"
                        className="mt-2"
                        onClick={() => updateComment(comment._id)}
                      >
                        Update
                      </Button>
                      <Button
                        size="xs"
                        variant="danger"
                        className="mt-2 ml-2"
                        onClick={() => setEditComment({ edit: false, id: '' })}
                      >
                        Close
                      </Button>
                    </div>
                  </Form.Group>
                </>
              ) : (
                <p>{comment.text}</p>
              )}
            </div>

            {comment.author.username === data.name ? (
              <>
                <Button
                  onClick={() =>
                    setEditComment({ edit: true, id: comment._id })
                  }
                  className="mt-2"
                  variant="success"
                >
                  Edit comment
                </Button>

                <Button
                  onClick={() => deleteComment(comment._id)}
                  className="mt-2"
                  variant="danger"
                >
                  Delete comment
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    ));

  const submitComment = (e) => {
    e.preventDefault();
    console.log(newComment);
    axios
      .post(
        `/api/v1/campgrounds/${item._id}/comment`,
        { text: newComment },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        window.location = `/campground/${item.slug}`;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return isLoading || !item ? (
    <div className="text-center">
      <img
        height="500"
        width="500"
        src="https://i.ya-webdesign.com/images/loading-gif-png-5.gif"
        alt="Loading gif"
      />
    </div>
  ) : (
    <Container>
      <Link to="/">
        <Button className="mt-5" size="lg" variant="success">
          BACK
        </Button>
      </Link>
      <h1 className="text-center mt-5 mb-5">{item.name}</h1>
      <Row className="shadow-lg p-3 mb-5 bg-white rounded">
        <Col>
          <Image className="mt-5" src={item.image} fluid />
        </Col>
        <Col>
          <div className="info mt-5">
            <p>
              <b>Author:</b> {item.author.username}
            </p>
            <p>
              <b>Description:</b> {item.description}
            </p>
            <p>
              <b>Price:</b> {item.price !== 'Free' ? `$` : ''}
              {item.price}
            </p>

            {item.author.username === data.name ? (
              <>
                <Link to={`/update-campground/${id}`}>
                  <Button className="mt-2" variant="primary">
                    Update
                  </Button>
                </Link>

                <Button
                  onClick={deleteCampground}
                  className="mt-2 ml-3"
                  variant="danger"
                >
                  Delete
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
      <Form
        onSubmit={submitComment}
        className="mt-5 p-5 shadow-lg p-3 mb-5 bg-white rounded"
      >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Add a new comment</Form.Label>
          <Form.Control
            name="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            type="text"
            placeholder="Enter comment"
          />
        </Form.Group>

        <Button variant="warning" type="submit">
          Add Comment
        </Button>
      </Form>
      {!checkComment ? <Spinner animation="border" /> : checkComment}
    </Container>
  );
}
export default CampgroundDetails;
