import React from 'react';
import { Rating } from 'semantic-ui-react';
import '../styles/general.css';

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
];

const HealthRatingBar = ({ rating, showText, inlineText = false }: BarProps) => {
  return (
    <div className="health-bar">
      <Rating icon="heart" disabled rating={4 - rating} maxRating={4} />
      {showText
        ? <p style={{ display: inlineText ? 'inline' : undefined }}
          className={inlineText ? 'health-rating-text-inline' : undefined}>{HEALTHBAR_TEXTS[rating]}</p> 
        : null
      }
    </div>
  );
};

export default HealthRatingBar;
