import './Detail.scss';

import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Env } from '../env';
import { ImageToBytes } from './utils/image-to-bytes';

const Detail = ({}) => {
  const { eventId } = useParams();
  const [event, setEvent] = React.useState(null);
  const imageToBytes = new ImageToBytes();

  React.useEffect(() => {
    fetch(`${Env.API_BASE}/events/${eventId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    })
      .then(res => res.json())
      .then(result => setEvent(result), err => console.error('Ups! error fetching the event', err))
  }, []);

  function setEventText(name: string): void {
    parent.postMessage({
      pluginMessage: {
        type: 'set-text',
        data: name
      }
    }, '*');
  }

  function setEventImage(image: string): void {
    imageToBytes.load(image).then(bytes => {
      parent.postMessage({
        pluginMessage: {
          type: 'set-image',
          data: bytes
        }
      }, '*');
    });
  }

  return (
    <div>
      <h1 className="detail-title"><span>{event?.name}</span><Link to="/">Go back</Link></h1>
      <dl className="detail">
        <dt>Name</dt>
        <dd className="detail__item" onClick={() => setEventText(event?.name)}>{event?.name}</dd>
        <dt>Image</dt>
        <dd><img className="detail__item" src={event?.image} width="100" height="100" onClick={() => setEventImage(event?.image)} /></dd>
      </dl>
    </div>
  );
};

export default Detail;
