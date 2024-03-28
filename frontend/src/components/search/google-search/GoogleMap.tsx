import React, { useEffect } from "react";

interface GoogleMapProps {
    searchInput: string;
    onInputChange: (value: string) => void;
}

interface ChildProps {
    sendDataToParent: (data: string[], place: string) => void;

}

type Props = GoogleMapProps & ChildProps;

const GoogleMap: React.FC<Props> = ({ searchInput, onInputChange, sendDataToParent }) => {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onInputChange(value);
    }

    useEffect(() => {
        const initMap = async () => {
            if (navigator.geolocation && window.google && window.google.maps) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const map = new window.google.maps.Map(document.getElementById("map")!, {
                        center: { lat: lat, lng: lng },
                        zoom: 10,
                    });

                    // Autocomplete input fieldss
                    const input = document.getElementById("search-input") as HTMLInputElement;
                    const autocomplete = new window.google.maps.places.Autocomplete(input);

                    // Places service for & searching and place details
                    const placesService = new window.google.maps.places.PlacesService(map);

                    // Autocompletion see
                    autocomplete.addListener("place_changed", () => {
                        const place = autocomplete.getPlace();
                        if (!place.geometry) {
                            console.error("Place details not found for input:", input.value);
                            return;
                        }
                        console.log("Place details:", place.formatted_address);

                        const placeId = place.place_id;
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ placeId: placeId }, (results, status) => {
                            if (status === 'OK') {
                                if (results[0]) {
                                    const location = results[0].geometry.location;
                                    const lati = location.lat();
                                    const long = location.lng();

                                    // Search nearby hotels
                                    const request: google.maps.places.PlaceSearchRequest = {
                                        location: { lat: lati, lng: long },
                                        radius: 1000,
                                        type: 'lodging',
                                    };

                                    placesService.nearbySearch(request, (results, status) => {
                                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                            console.log("Nearby hotels:", results);
                                            const hotelNames = results.map(result => result.name);
                                            if(hotelNames && place.formatted_address)
                                            sendDataToParent(hotelNames, place.formatted_address)
                                        } else {
                                            console.error("Error fetching nearby hotels:", status);
                                        }
                                    });
                                } else {
                                    console.error('No results found');
                                }
                            } else {
                                console.error('Geocoder failed due to: ' + status);
                            }
                        });
                    });

                });
            } else {
                console.error("Google Maps API not loaded.");
            }
        };

        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded.");
            return;
        }

        initMap();

    }, []);

    return (
        <div>
            <input
                type="text"
                style={{ width: '100%', maxWidth: '485px', fontSize: 'larger', margin: '0 auto', display: 'block' }}
                id='search-input'
                placeholder="  Google here..."
                value={searchInput}
                onChange={handleChange}
            />
            <div id="map" style={{ height: "400px", maxWidth: '100%', margin: '0 auto' }} hidden></div>
        </div>
    );
}

export default GoogleMap;
