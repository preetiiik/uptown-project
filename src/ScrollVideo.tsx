import {useEffect,useRef,useState} from 'react';

// Seek the paused video to the scroll position. Never start automatic playback.
export default function ScrollVideo({sectionId}:{sectionId:string}){
 const videoRef=useRef<HTMLVideoElement>(null);
 const [mobile,setMobile]=useState(()=>window.matchMedia('(max-width:700px)').matches);
 useEffect(()=>{
  const query=window.matchMedia('(max-width:700px)');
  const update=()=>setMobile(query.matches);
  query.addEventListener('change',update);
  return()=>query.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  const video=videoRef.current;
  const section=document.getElementById(sectionId);
  if(!video||!section)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const update=()=>{
   frame=0;
   const rect=section.getBoundingClientRect();
   const viewport=mobile?(section.firstElementChild?.clientHeight || window.innerHeight):window.innerHeight;
   const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-viewport)));
   section.style.setProperty('--video-progress',String(progress));
   const duration=video.duration;
   if(!Number.isFinite(duration)||duration<=0||video.seeking)return;
   const target=reduced.matches?0:progress*Math.max(0,duration-.05);
   const difference=target-video.currentTime;
   if(Math.abs(difference)>1/48){
    // Ease mobile seeks toward the latest position, including after a fast swipe.
    // Only issue the next seek after the previous frame has decoded.
    video.currentTime=mobile&&!reduced.matches&&Math.abs(difference)>1/24
     ?video.currentTime+difference*.3:target;
   }
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  // A seek may still be decoding when another scroll event arrives.
  // On completion, catch up to the most recent scroll position.
  video.addEventListener('loadedmetadata',schedule);
  video.addEventListener('loadeddata',schedule);
  video.addEventListener('seeked',schedule);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  const observer=new ResizeObserver(schedule);
  observer.observe(section);
  schedule();
  return()=>{
   cancelAnimationFrame(frame);
   video.removeEventListener('loadedmetadata',schedule);
   video.removeEventListener('loadeddata',schedule);
   video.removeEventListener('seeked',schedule);
   window.removeEventListener('scroll',schedule);
   window.removeEventListener('resize',schedule);
   reduced.removeEventListener('change',schedule);
   observer.disconnect();
  };
 },[sectionId,mobile]);
 return <video ref={videoRef} className="inspire-hero-video" src={mobile?'/home-hero-scroll-mobile.mp4':'/home-hero-scroll.mp4'} poster="/home-hero-poster.jpg" preload="auto" muted playsInline disablePictureInPicture aria-hidden="true" tabIndex={-1}/>;
}
