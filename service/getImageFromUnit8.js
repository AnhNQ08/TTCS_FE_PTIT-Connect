const getImageMime = (uint8Array) => {
    if (!uint8Array || uint8Array.length < 12) return null;

    const bytes = Array.from(uint8Array.slice(0, 12)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (bytes.startsWith('ffd8ff')) return 'image/jpeg';
    if (bytes.startsWith('89504e47')) return 'image/png';
    if (bytes.startsWith('47494638')) return 'image/gif';
    if (bytes.startsWith('424d')) return 'image/bmp';
    if (bytes.startsWith('52494646') && bytes.includes('57454250')) return 'image/webp'; // "RIFF....WEBP"
    if (bytes.includes('6674797068656963')) return 'image/heic'; // 'ftypheic'
    if (bytes.includes('6674797048656963')) return 'image/heic'; // uppercase variant
    if (bytes.includes('6674797048657669')) return 'image/heif'; // ftyphevi (HEIF)
    if (bytes.includes('667479704d345620')) return 'image/mp4';  // M4V (đôi khi chứa ảnh)

    return null; // Unknown format
};

export default getImageMime