import React, { useState } from 'react'
import '../../wsp.css'

import { TbCircleArrowLeftFilled, TbCircleArrowRightFilled, TbCircleX } from "react-icons/tb";

const ImageGallery = ({ photos }) => {
    console.log("🚀 ~ file: LightBoxes.jsx:7 ~ WSPGallery ~ photos:", photos)
    // state
    const [slideNumber, setSlideNumber] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (index) => {
        setSlideNumber(index);
        setOpenModal(true);
    }
    // Close Modal
    const handleCloseModal = () => {
        setOpenModal(false);
    }
    // Previous Image
    const prevSlide = () => {
        // setSlideNumber( photos.length - 1) : if the slide is in index 0  the prev slide will be the last image
        slideNumber === 0 ? setSlideNumber( photos.length - 1) : setSlideNumber( slideNumber - 1);
    }
    
    // Next Image
    const nextSlide = () => {
        slideNumber + 1 ===  photos.length ? setSlideNumber(0) : setSlideNumber( slideNumber + 1);
    }

    return (
        <div>
    
            {openModal && 
                <div className='sliderWrap'>
                  <div className='counter text-2xl'>
                      {`${slideNumber + 1} / ${photos.length}`}
                  </div>
                  <TbCircleX className='btnClose text-4xl' onClick={handleCloseModal}  />
                  <TbCircleArrowLeftFilled className='btnPrev text-2xl' onClick={prevSlide} />
                  <TbCircleArrowRightFilled className='btnNext text-2xl' onClick={nextSlide} />
                  <div className='fullScreenImage'>
                      <img className='rounded-lg' src={photos[slideNumber].src} alt='' />
                  </div>
                </div>
            }
            
            <div className={`${photos.length < 6 ? 'galleryWrap1' : 'galleryWrap2'}`}>
            {
              photos && photos.map((slide, index) => {
                return(
                  <div 
                    className={`${photos.length < 6 ? 'single1' : 'single2'}`} 
                    key={index}
                    onClick={ () => handleOpenModal(index) }
                  >
                    <img className='rounded-lg' src={slide.src} alt='' />
                  </div>
                )
              })
            }
          </div>
    
        </div>
      )

}
export default ImageGallery