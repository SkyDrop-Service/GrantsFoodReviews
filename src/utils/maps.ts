export const openInMaps = (address: string, latitude?: number, longitude?: number) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (latitude && longitude) {
    // Use coordinates if available
    if (isMobile) {
      // iOS = maps://, Android = geo:
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        window.open(`maps://?q=${latitude},${longitude}`);
      } else {
        window.open(`geo:${latitude},${longitude}`);
      }
    } else {
      // Desktop use Google Maps
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`);
    }
  } else {
    // Fallback to address search
    const encodedAddress = encodeURIComponent(address);
    if (isMobile) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        window.open(`maps://?q=${encodedAddress}`);
      } else {
        window.open(`geo:0,0?q=${encodedAddress}`);
      }
    } else {
      // Desktop use Google Maps
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
    }
  }
};