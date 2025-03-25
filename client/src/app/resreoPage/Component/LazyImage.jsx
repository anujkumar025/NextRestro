import React from "react";

const LazyImage = ({ src, alt, className }) => {
    return <img loading="lazy" src={src.replace(".jpg", ".webp")} alt={alt} className={className} />;
};

export default LazyImage;