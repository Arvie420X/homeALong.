import React from 'react';
import GoogleMapReact from 'google-map-react';

const GMapCard = ({ ad }) => {

    const defaultProps = {
        center: {
            lat: ad?.location?.coordinates[1],
            lng: ad?.location?.coordinates[0]
        },
        zoom: 11
    }

    const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    
    // encoutered a bug, so  i need to check if there is coordinates arrays first
  if(ad?.location?.coordinates?.length){
    return (
    <div style={{ width: "100%", height: "350px"}} className="w-full h-350 rounded-md overflow-hidden my-4">
        <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
        >
            <div lat={ad?.location?.coordinates[1]} lng={ad?.location?.coordinates[0]}>
                <span className='text-2xl'>📍</span>
            </div>
        </GoogleMapReact>
    </div>
  )
}
}

export default GMapCard