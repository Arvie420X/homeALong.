import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ImageGallery from '../components/misc/ImageGallery';
import logo from '../preview.png';
import AdFeatures from '../components/cards/AdFeatures';
import { formatNumber } from '../helpers/ad';
import dayjs from "dayjs";
// import HTMLRenderer from 'react-html-renderer';
import parse from 'html-react-parser';

import relativeTime from "dayjs/plugin/relativeTime";
import LikeAndUnlike from '../components/misc/LikeAndUnlike';
import GMapCard from '../components/cards/GMapCard';
import AdCard from '../components/cards/AdCard';
import ContactSeller from '../components/forms/ContactSeller';

dayjs.extend(relativeTime); // fromNow();

const AdView = () => {
    // state
    const [ad, setAd] = useState({});
    // console.log("🚀 ~ file: AdView.jsx:22 ~ AdView ~ ad:", ad)
    const [related, setRelated] = useState([]);
    // hooks
    const params = useParams();
    useEffect(() => {
        if(params?.slug) fetchAd();
    }, [params?.slug]);

    const fetchAd = async () => {
        try {
            const { data } = await axios.get(`/ad/${params.slug}`);
            setAd(data?.ad);
            // console.log("🚀 ~ file: AdView.jsx:35 ~ fetchAd ~ data:", data.ads._id)
            setRelated(data?.related);
        } catch (error) {
            console.log(error);
        }
    };

    const generatePhotosArray = (photos) => {
      if (photos?.length > 0) {
          const x = photos?.length === 1 ? 2 : 4;
          let arr = [];

          photos.map((p) => arr.push({
              src: p.Location,
              width: x,
              height: x
          }));
          
          return arr;
      } else {
          return [{
              src: logo,
              width: 2,
              height: 1
          }];
      }
  }

  const htmlWithLineBreaks = ad?.description ? ad?.description?.replace(/\./g, '.<br/><br/>') : "";

  return (
    
    <div className="container mx-auto mt-16 px-4">
      {/* {JSON.stringify(import.meta.env)} */}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 text-center md:text-left text-lg font-bold">
          <div className='flex justify-between items-center'>
            <div className={`${ad?.action === "Sell" ? "bg-[#EB455F] text-white" : "bg-[#2B3467] text-[#BAD7E9]" } px-2 py-1 rounded-md`}>
              <h1 className='text-lg'>{ad.type} for {ad.action}</h1>
            </div>
            <div className='p-2 mr-5'>
              <LikeAndUnlike ad={ad} />
            </div>
          </div>
          <div className='grid justify-items-start p-2 my-3 text-[#2B3467]'>
            {ad?.sold ? "❌Off market" : "✅In market"}
          </div>
          <div className='grid justify-items-start py-3 pr-3 text-[#2B3467]'>
            <h1 className='text-3xl'>{ad?.address}</h1>
          </div>
          <div className=''>
            <div className='w-80 mb-5'><AdFeatures ad={ad}/></div>
            <h3 className='text-[#2B3467] text-2xl'><span className='text-[#EB455F]'>&#8369;</span> {formatNumber(ad.price)}</h3>
            <p className='text-[#BAD7E9] text-base mt-4'>{dayjs(ad?.createdAt).fromNow()}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          {/* <ImageGallery photos={generatePhotosArray(ad?.photos)} /> */}
          <ImageGallery photos={generatePhotosArray(ad?.photos)} />
          {/* {console.log(ad?.photos)} */}
          {/* {ad?.photos[0].Location} */}
          {/* <pre>{JSON.stringify({ad}, null, 4)}</pre> */}
        </div>
      </div>
      <div className='sm:px-8 lg:px-20 my-16'>
        <GMapCard ad={ad} />
        <h1 className='text-2xl text-[#2B3467]'>
          {ad?.type} in {ad?.address} for {ad?.action} <span className='text-[#EB455F]'>&#8369;</span> {formatNumber(ad.price)}
        </h1>
        <div className='px-5 my-5'>
          <AdFeatures ad={ad} showCarpark={true}/>
        </div>

        <hr className='text-[#BAD7E9]'/>

        <h3 className='text-[#EB455F] text-xl mt-16 mb-5'>{ad?.title}</h3>

        {/* the replaceAll() is just to break all the sentences, you could also use react-quill */}
        <div className='leading-5'>
          <p className='text-sm font-thin text-[#2B3467]'>{parse(htmlWithLineBreaks)}</p>
        </div>
      </div>

      <div className='flex justify-start'>
        <ContactSeller ad={ad} />
      </div>

      <div className='mt-7'>
        <div className='flex justify-center'>
          <div className='text-[#2B3467] w-3/5'>
            <h4 className='text-center mb-3'>Related Properties</h4>
            <hr className='mx-auto' style={{width: '60%'}} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
            {related?.map((ad) => (
              <div className="hoverable" key={ad._id}>
                <AdCard ad={ad} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default AdView