import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}
