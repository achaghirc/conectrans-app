'use client';

import { MapComponentProps } from '@/lib/definitions';
import React, { useEffect, useRef } from 'react'
import { addSingleMarker } from './markers/addSingleMarker';
// 38.956600744288735, -5.878132026448462
const DEFAULT_CENTER = { lat: 38.956600744288735, lng: -5.878132026448462 }; // Gurgaon coordinates
const DEFAULT_ZOOM = 7; // You can change this according to your needs, or you can also recive this as a prop to make map component more reusable.

const GoogleMaps: React.FC<MapComponentProps> = (
  { width, height, center, zoom, locations }
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if(ref.current){
      const map = new window.google.maps.Map(ref.current, {
        mapId: 'caa1bcadc42b46f', // This is a fake mapId, you should replace it with your own.
        center: center ?? DEFAULT_CENTER,
        zoom: zoom ?? DEFAULT_ZOOM,
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }] // Turn off points of interest.
          }
        ]
      });
      addSingleMarker({ locations: locations, map: map });
    }
  }, [ref, locations]);

  return (
    <div 
      ref={ref}
      style={{ height: height ?? '100%', width: width ?? '100%', borderRadius: '5%' }}
    />
  )
}

export default GoogleMaps
