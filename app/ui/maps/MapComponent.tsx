import React from 'react'
import GoogleMapsWrapper from './GoogleMapsWrapper'
import GoogleMaps from './GoogleMaps'
import { MapComponentProps } from '@/lib/definitions'

const MapComponent: React.FC<MapComponentProps> = (
  { width, height, center, zoom, locations }
) => {
  return (
    <GoogleMapsWrapper>
      <GoogleMaps width={width} height={height} center={center} zoom={zoom} locations={locations} />
    </GoogleMapsWrapper>
  )
}

export default MapComponent
