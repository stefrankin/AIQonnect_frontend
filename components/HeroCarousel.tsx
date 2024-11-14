"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel";
import Image from 'next/image';

const heroImages = [
    {imgUrl: 'assets/images/hero-1.svg', alt: 'Taylor Swift'},
    {imgUrl: 'assets/images/hero-2.svg', alt: 'Kendrick Lamar'},
    {imgUrl: 'assets/images/hero-3.svg', alt: 'Beyonce'},
    {imgUrl: 'assets/images/hero-4.svg', alt: 'Justice'},
    {imgUrl: 'assets/images/hero-5.svg', alt: 'Milky Chance'}
]

const HeroCarousel = () => {
  return (
    <div>
        <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            interval={2000}
            showArrows={false}
            showStatus={false}
        >
           {heroImages.map((image) => (
            <Image 
                src={image.imgUrl}
                alt={image.alt}
                width={484}
                height={484}
                className="object-contain"
                key={image.alt}
            />
            ))}
        </Carousel>
    </div>
  )
}

export default HeroCarousel