import {useEffect,useRef,useState} from 'react';
import {useReducedMotion} from 'framer-motion';

const photos=[
 {src:'/images/arihant-farms/cover.webp',position:'65% center'},
 {src:'/images/arihant-farms/gallery-4.webp',position:'center'},
 {src:'/images/arihant-farms/gallery-2.webp',position:'60% center'},
];

export default function MobileHeroCarousel(){
 const [index,setIndex]=useState(0);
 const loaded=useRef(new Set<number>());
 const container=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 useEffect(()=>{
  if(reduced)return;
  let visible=true;
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});
  if(container.current)observer.observe(container.current);
  const timer=window.setInterval(()=>{
   if(document.hidden||!visible)return;
   setIndex(current=>{
    for(let step=1;step<photos.length;step++){
     const next=(current+step)%photos.length;
     if(loaded.current.has(next))return next;
    }
    return current;
   });
  },4500);
  return()=>{window.clearInterval(timer);observer.disconnect()};
 },[reduced]);
 return <div ref={container} className="mobile-hero-carousel" aria-hidden="true">{photos.map((photo,number)=><img key={photo.src} src={photo.src} alt="" className={index===number?'is-active':''} style={{objectPosition:photo.position}} fetchPriority={number===0?'high':'auto'} decoding="async" onLoad={()=>loaded.current.add(number)}/>)}</div>;
}
