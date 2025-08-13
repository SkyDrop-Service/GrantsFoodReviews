import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        console.log('RecenterMap center:', center);
        map.setView(center);
    }, [center, map]);
    return null;
}
