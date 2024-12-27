import React from 'react'
import { Wrapper } from '@googlemaps/react-wrapper';
const GoogleMapsWrapper = ({children} : {children:React.ReactNode}) => {

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Oops! Cannot display the map: Google Maps API key missing</div>;
  }
  return (
    <Wrapper apiKey={apiKey}>
      {children}
    </Wrapper>
  )
}

export default GoogleMapsWrapper
