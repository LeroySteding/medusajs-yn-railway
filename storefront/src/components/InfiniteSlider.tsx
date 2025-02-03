import React from 'react';
import Image from 'next/image';

const list = [
  {
    title: "Arte",
    img: "/images/brands/arte-logo.png",
  },
  {
    title: "Carhartt WIP",
    img: "/images/brands/carhartt_wip-logo.png",
  },
  {
    title: "Daily Paper",
    img: "/images/brands/daily_paper-logo.png",
  },
  {
    title: "Edwin",
    img: "/images/brands/edwin-logo.png",
  },
  {
    title: "Gramicci",
    img: "/images/brands/gramicci-logo.png",
  },
  {
    title: "Le Bonnet",
    img: "/images/brands/le_bonnet-logo.png",
  },
  {
    title: "Mizuno",
    img: "/images/brands/mizuno-logo.png",
  },
  {
    title: "New Amsterdam",
    img: "/images/brands/new_amsterdam-logo.png",
  },
  {
    title: "Obey",
    img: "/images/brands/obey-logo.png",
  },
  {
    title: "Olaf",
    img: "/images/brands/olaf-logo.png",
  },
  {
    title: "PAL",
    img: "/images/brands/pal-logo.png",
  },
  {
    title: "Pleasures",
    img: "/images/brands/pleasures-logo.png",
  },
  {
    title: "Samsoe Samsoe",
    img: "/images/brands/samsoe_samsoe-logo.png",
  },
  {
    title: "Saucony",
    img: "/images/brands/saucony-logo.png",
  },
  {
    title: "Service Works",
    img: "/images/brands/service_works-logo.png",
  },
  {
    title: "SWC",
    img: "/images/brands/swc-logo.png",
  },
  {
    title: "The New Originals",
    img: "/images/brands/the_new_originals-logo.png",
  },
  {
    title: "Topologie",
    img: "/images/brands/topologie-logo.png",
  },
  {
    title: "Younithy",
    img: "/images/brands/younithy-logo.png",
  },
];

export function InfiniteSlider() {
  return (
    <div
      className="relative py-10 m-auto w-full overflow-hidden bg-white before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-['']"
    >
      <div className="animate-infinite-slider flex w-[calc(250px*40)]">
        {[...list, ...list].map((brand, index) => (
          <div
            key={index}
            className="slide flex w-[250px] items-center justify-center px-4"
          >
            <div className="group relative flex h-20 w-40 items-center justify-center">
              <Image
                src={brand.img}
                alt={brand.title}
                width={160}
                height={80}
                className="max-h-full max-w-full object-contain transition-all duration-300 ease-in-out filter grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

