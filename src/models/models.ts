export interface MarkerData {
	id: string;
	position: google.maps.LatLngLiteral;
	label: string;
	timestamp: string; 
}

export interface ButtonProps {
	onClick: () => void; 
	children: React.ReactNode;
}