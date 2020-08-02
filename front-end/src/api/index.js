import axios from 'axios';

exports.getAllTours = (setAllTours, setLoading) => {
  axios
    .get('http://localhost:8080/api/v1/campgrounds')
    .then((response) => setAllTours(response.data.campgrounds))
    .then(() => setTimeout(() => setLoading(false), 1000));
};
