export const getImageMime = (base64) => {
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('iVBOR')) return 'image/png';
    if (base64.startsWith('R0lGOD')) return 'image/gif';
    if (base64.startsWith('UklGR')) return 'image/webp';
    return 'image/jpeg';
}

export const getFileFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], "sample.jpg", { type: blob.type });
}