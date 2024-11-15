import React from 'react'
import Image from 'next/image'
import Searchbar from '@/components/Searchbar'
import HeroCarousel from '@/components/HeroCarousel'
const Home = () => {
  return (
    <>
    <div className="bg-black-200"></div>
      <section className="px-6 md: px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Intersectionality of Music and Politics:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Unleash the Power of
              <span className="text-primary"> Campaigning</span>
            </h1>

            <p className="mt-6">
              Powerful, self-serve analytics to help you convert, engage, and attract more.
            </p>

            <Searchbar/>
          </div>

          <HeroCarousel/>

        
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {['Taylor Swift', 'Beyonce', 'Kendrick Lamar'].map((product) => (
            <div key={product}>{product}</div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home