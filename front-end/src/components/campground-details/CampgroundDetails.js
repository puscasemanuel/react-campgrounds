import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

function CampgroundDetails() {
  const [item, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  let { id } = useParams();

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
      // console.log(result.data.data.campground);
      setItem(result.data.data.campground);
      setIsLoading(false);
    };
    fetchCampground();
  }, [id]);

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

  return isLoading ? (
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
      <h1 className="text-center mt-5 mb-5">{item.name}</h1>
      <Row>
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
                  <Button className="mt-2" size="lg" variant="primary">
                    Update
                  </Button>
                </Link>

                <Button
                  onClick={deleteCampground}
                  className="mt-2 ml-3"
                  size="lg"
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
      <Link to="/">
        <Button className="mt-2" size="lg" variant="success">
          BACK
        </Button>
      </Link>
    </Container>
  );
}
export default CampgroundDetails;
