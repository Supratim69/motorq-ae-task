import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

const containerStyle = {
    width: "100%",
    height: "270px",
};

const center = {
    lat: 28.7041,
    lng: 77.1025,
};

interface MapWithPlacePickerProps {
    onLocationSelect: (
        location: {
            latitude: number;
            longitude: number;
            address: string;
        } | null
    ) => void;
}

export default function MapWithPlacePicker({
    onLocationSelect,
}: MapWithPlacePickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPosition, setMarkerPosition] =
        useState<google.maps.LatLngLiteral | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
        null
    );

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            const clickedLat = e.latLng?.lat();
            const clickedLng = e.latLng?.lng();
            if (clickedLat && clickedLng) {
                // Reverse geocoding to get the address
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode(
                    { location: { lat: clickedLat, lng: clickedLng } },
                    (results, status) => {
                        if (status === "OK" && results && results[0]) {
                            const address = results[0].formatted_address;
                            const newLocation = {
                                latitude: clickedLat,
                                longitude: clickedLng,
                                address,
                            };
                            setMarkerPosition({
                                lat: clickedLat,
                                lng: clickedLng,
                            });
                            onLocationSelect(newLocation);
                        } else {
                            console.error("Geocode failed: " + status);
                            onLocationSelect(null);
                        }
                    }
                );
            }
        },
        [onLocationSelect]
    );

    useEffect(() => {
        if (isLoaded && inputRef.current && window.google) {
            autocompleteRef.current =
                new window.google.maps.places.Autocomplete(inputRef.current, {
                    fields: [
                        "geometry",
                        "formatted_address",
                        "name",
                        "viewport",
                    ],
                });

            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current!.getPlace();
                console.log("Selected place:", place);

                if (!place || !place.geometry || !place.geometry.location) {
                    console.error("Invalid place object:", place);
                    onLocationSelect(null);
                    return;
                }

                const location = place.geometry.location;
                const newLocation = {
                    latitude: location.lat(),
                    longitude: location.lng(),
                    address: place.formatted_address || place.name || "",
                };
                setMarkerPosition({
                    lat: location.lat(),
                    lng: location.lng(),
                });
                onLocationSelect(newLocation);

                if (map) {
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(location);
                        map.setZoom(17);
                    }
                }
            });

            // Handle keyboard "Enter" for selecting the first suggestion
            inputRef.current.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevent form submission if inside a form
                    google.maps.event.trigger(
                        autocompleteRef.current!,
                        "place_changed"
                    );
                }
            });
        }
    }, [isLoaded, map, onLocationSelect]);

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    return (
        <div>
            <Input
                ref={inputRef}
                type="text"
                id="autocomplete"
                placeholder="Enter an address"
                className="border rounded-lg mb-4"
            />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onLoad={onLoad}
                onClick={onMapClick}
            >
                {markerPosition && <MarkerF position={markerPosition} />}
            </GoogleMap>
        </div>
    );
}
