import axios from "axios";
import { MarkerData } from "../models/models";

const BASE_URL = 'https://points-4eabb-default-rtdb.europe-west1.firebasedatabase.app/markers';

export default class MarkerService {
    static async getAllMarkers() {
        try {
            const response = await axios.get(`${BASE_URL}.json`);
            const fetchedMarkers: MarkerData[] = [];

            for (const key in response.data) {
                fetchedMarkers.push({
                    id: key,
                    position: response.data[key].position,
                    label: response.data[key].label,
                    timestamp: response.data[key].timestamp,
                });
            }
            return fetchedMarkers;
        } catch (e) {
            console.error('Error fetching markers:', e);
            throw e; 
        }
    }

    static async addMarker(newMarker: MarkerData) {
        try {
            await axios.post(`${BASE_URL}.json`, newMarker);
        } catch (e) {
            console.error("Error adding marker:", e);
            throw e;
        }
    }

    static async updateMarker(id: string, updatedMarker: MarkerData) {
        try {
            await axios.put(`${BASE_URL}/${id}.json`, updatedMarker);
        } catch (e) {
            console.error("Error updating marker:", e);
            throw e;
        }
    }

    static async deleteMarker(id: string) {
        try {
            await axios.delete(`${BASE_URL}/${id}.json`);
        } catch (e) {
            console.error("Error deleting marker:", e);
            throw e;
        }
    }

    static async deleteAllMarkers() {
        try {
            await axios.delete(`${BASE_URL}.json`);
        } catch (e) {
            console.error("Error deleting all markers:", e);
            throw e;
        }
    }
}
