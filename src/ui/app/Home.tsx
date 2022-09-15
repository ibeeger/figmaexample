import './Home.scss';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Env } from '../env';

const Home = ({}) => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    fetch(`${Env.API_BASE}/events`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    })
      .then(res => res.json())
      .then(result => setEvents(result), err => console.error('Ups! error fetching the event list', err))
  }, []);

  return (
    <div>
      <h1>Our events!</h1>
      <ul className="list">
        {events.map(event => (
          <li className="list__item" key={event.id}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
