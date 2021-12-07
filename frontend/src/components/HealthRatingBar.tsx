import React from 'react';
import { Rating } from 'semantic-ui-react';
import '../styles/general.css';
import { HealthCheckRating } from '../types/types';

type BarProps = {
  rating: number;
  showText: boolean;
  inlineText?: boolean;
};

const HEALTHBAR_TEXTS = [
  'The patient is in great shape',
  'The patient has a low risk of getting sick',
  'The patient has a high risk of getting sick',
  'The patient has a diagnosed condition',
  'Health rating undetermined'
];

const HealthRatingBar = ({ rating, showText, inlineText = false }: BarProps) => {
  return (
    <div className="health-bar">
      {rating === HealthCheckRating.Undetermined
        ? <Rating icon="heart" disabled rating={0} maxRating={4} style={{ opacity: 0.2, filter: 'grayscale(100%)'}} />
        : <Rating icon="heart" disabled rating={4 - rating} maxRating={4} />
      }
      
      {showText
        ? <p style={{ display: inlineText ? 'inline' : undefined }}
          className={inlineText ? 'health-rating-text-inline' : undefined}>{HEALTHBAR_TEXTS[rating] || HEALTHBAR_TEXTS[4]}</p> 
        : null
      }
    </div>
  );
};

export default HealthRatingBar;
