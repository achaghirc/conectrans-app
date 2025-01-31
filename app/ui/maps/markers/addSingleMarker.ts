import React from 'react'

export const addSingleMarker = async ({
  locations, 
  map
}: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
  map: google.maps.Map | null | undefined;
})  =>{
  if (!map) {
    return;
  }
  const {AdvancedMarkerElement} = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
  locations.map(
    (position) => new AdvancedMarkerElement({
      position,
      map,
      title: 'Hello World!',
    }) )
  
}
