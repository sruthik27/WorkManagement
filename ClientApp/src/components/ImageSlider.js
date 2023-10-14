import React, { useState } from 'react';
import { SliderData } from './SliderData';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import "./ImageSlider.css";

const ImageSlider = ({ slides }) => {
    const [current, setCurrent] = useState(0);
    const length = slides.length;

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };
    
    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    return (
        <>
            <div>
                {SliderData.map((obj, index) => {
                    return (
                        <div>
                            <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
                            <FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} />
                            {obj.image.map((images, i) => {
                                return (
                                    <div className={'slide active'} key={i}>
                                        {i === current && (
                                            <img className='image' src={images.url}/>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default ImageSlider;
