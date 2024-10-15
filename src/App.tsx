import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { MarkerData } from "../src/models/models";
import Button from '../src/Components/Button/button';
import MarkerService from '../src/Service/service'; 

const mapContainerStyle = { width: "100vw", height: "100vh" };
const center = { lat: 12.97, lng: 77.59 };

function App() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDTohQ3VzEFIRtJO4AbkGd9WM_gCg2--Nc",
    });
    const [markers, setMarkers] = useState<MarkerData[]>([]); 

    const fetchMarkers = async () => {
        try {
            const fetchedMarkers = await MarkerService.getAllMarkers();
            setMarkers(fetchedMarkers);
        } catch (error) {
            console.error("Error fetching markers:", error);
        }
    };

    useEffect(() => {
        fetchMarkers();
    }, []);

    const addMarker = useCallback(async (latLng: google.maps.LatLngLiteral) => {
        const newMarker: MarkerData = {
            id: `marker-${markers.length + 1}`,
            position: latLng,
            label: `${markers.length + 1}`,
            timestamp: new Date().toISOString(),
        };

        try {
            await MarkerService.addMarker(newMarker); 
            fetchMarkers();
        } catch (error) {
            console.error("Error adding marker:", error);
        }
    }, [markers]);

    const updateMarkerInDatabase = async (id: string, updatedMarker: MarkerData) => {
        try {
            await MarkerService.updateMarker(id, updatedMarker);
        } catch (error) {
            console.error("Error updating marker:", error);
        }
    };

    const handleMarkerDragEnd = (markerId: string, newPosition: google.maps.LatLngLiteral) => {
        const updatedMarker = markers.find(marker => marker.id === markerId);
        if (updatedMarker) {
            const updatedMarkerData = {
                ...updatedMarker,
                position: newPosition,
            };
            setMarkers(prevMarkers => 
                prevMarkers.map(marker => 
                    marker.id === markerId ? updatedMarkerData : marker
                )
            );
            updateMarkerInDatabase(markerId, updatedMarkerData);
        }
    };

    const deleteMarker = async (markerId: string) => {
        try {
            await MarkerService.deleteMarker(markerId);
            setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
        } catch (error) {
            console.error("Error deleting marker:", error);
        }
    };

    const deleteAllMarkers = async () => {
        try {
            await MarkerService.deleteAllMarkers();
            setMarkers([]);
        } catch (error) {
            console.error("Error deleting markers:", error);
        }
    };

    if (!isLoaded) return <div>Завантаження...</div>;

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={center}
                onClick={(event) => {
                    if (event.latLng) {
                        addMarker(event.latLng.toJSON());
                    }
                }}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        label={marker.label}
                        draggable={true} 
                        onDragEnd={(event) => {
                            if (event.latLng) {
                                handleMarkerDragEnd(marker.id, event.latLng.toJSON()); 
                            }
                        }}
                        onClick={() => deleteMarker(marker.id)} 
                    >
                        <div className="info__kvests">
                            <span>{marker.label}</span>
                        </div>
                    </Marker>
                ))}
                <Button onClick={deleteAllMarkers}>
                    Очистити всі мітки
                </Button>
            </GoogleMap>
        </div>
    );
}

export default App;
