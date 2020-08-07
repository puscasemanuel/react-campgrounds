import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import CampgroundsList from '../components/campgrounds-list/CampgroundsList';
import CampgroundDetails from '../components/campground-details/CampgroundDetails';
import { NewCampground } from '../components/add-campground/NewCampground';
import { UpdateCampground } from '../components/update-campground/UpdateCampground';
import Header from '../components/header/Header';
import { Register } from '../components/register/Register';
import { Login } from '../components/login/Login';
import { ProtectedRoute } from './ProtectedRoute';
//import FooterPagePro from './footer/Footer';

function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const result = await axios('http://localhost:8080/api/v1/campgrounds', {
        withCredentials: true,
      });
      setItems(result.data.data.campgrounds);

      setIsLoading(false);
    };

    fetchItems();
  }, []);

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/register">
          <Register />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/">
          <CampgroundsList isLoading={isLoading} items={items} />
        </Route>

        <ProtectedRoute
          exact
          path="/new-campground"
          component={NewCampground}
        ></ProtectedRoute>

        <Route exact path="/campground/:id">
          <ProtectedRoute component={CampgroundDetails}></ProtectedRoute>
        </Route>

        <Route exact path="/update-campground/:id">
          <ProtectedRoute component={UpdateCampground}></ProtectedRoute>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
