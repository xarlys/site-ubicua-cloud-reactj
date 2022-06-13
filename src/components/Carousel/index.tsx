import React, { useState, useRef, useEffect } from 'react';
import { Swiper } from './styles';
import { getRefValue, useStateRef } from '../../lib/hooks';
import { getTouchEventData } from '../../lib/dom';
import api from '../../services/api';

type CarouselItemProps = {
  imageSrc: string;
  imageAlt: string;
}

interface CarouselProps {
  items: Array<CarouselItemProps>;
}

// interface IImagesProps {
//   title: string;
//   image: string;
// }

const MIN_SWIPE_REQUIRED = 40;

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };

  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = getRefValue(containerWidthRef);
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        // swipe to the right if diff is positive
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        // swipe to the left if diff is negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      // remain in the current image
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('mouseup', onTouchEnd);
    window.removeEventListener('mousemove', onTouchMove);
  };

  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setIsSwiping(true);

    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    containerWidthRef.current = containerWidth;
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth;

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);
  };

  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    setCurrentIdx(idx);
    setOffsetX(-(containerWidth * idx));
  };

  // const [images, setImages] = useState<IImagesProps[]>([]);

  // useEffect(() => {
  //   async function fetchHeader() {
  //     const responseImage = await api.get('v1/home');

  //     setImages(responseImage.data);
  //   }

  //   fetchHeader();
  // },[])

  function CarouselItem({ imageSrc, imageAlt }: CarouselItemProps) {
    return (
      <li>
        {/*     {images.map(img => (
          <img src={img.image} alt={img.title} draggable={false}/>
        ))} */}
        <img src={imageSrc} alt={imageAlt} draggable={false} />
      </li>
    )
  }

  return (
    <Swiper
      onTouchStart={onTouchStart}
      onMouseDown={onTouchStart}
    >
      <ul
        ref={containerRef}
        className={`swiper-list ${isSwiping ? 'is-swiping' : ''}`}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
      >
        {items.map((item, idx) => (
          <CarouselItem key={idx} {...item} />
        ))}
      </ul>
      <ul className="swiper-indicator">
        {items.map((_item, idx) => (
          <li
            key={idx}
            className={`swiper-indicator-item ${currentIdx === idx ? 'active' : ''
              }`}
            onClick={() => indicatorOnClick(idx)}
            data-testid="indicator"
          />
        ))}
      </ul>
    </Swiper>
  );
}

export default Carousel;