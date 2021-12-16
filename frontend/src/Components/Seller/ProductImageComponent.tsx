import { useState, useEffect } from "react";

const ProductImageComponent = ({ imageSource, fallbackSource }) => {

  const [imgUrl, setImgUrl] = useState(imageSource);

  useEffect(() => {
    setImgUrl(imageSource);
  }, [imageSource]);

  return (
    <div>
      <img 
        width="100%"
        height="100%"
        src={imgUrl} 
        onError={() => {
          setImgUrl(fallbackSource)
        }}
        alt="This product." 
      />
    </div>
  )
}

export default ProductImageComponent;