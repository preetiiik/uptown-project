import {useEffect,useRef} from 'react';

const FRAME_COUNT=193;

// Keep the last decoded frame visible while the next image loads. Mobile video
// seeking can stall during touch scrolling, even with an all-keyframe encode.
export default function MobileScrollFrames({sectionId}:{sectionId:string}){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;
  const section=document.getElementById(sectionId);
  if(!canvas||!section)return;
  const context=canvas.getContext('2d');
  if(!context)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const cache=new Map<number,HTMLImageElement>();
  const pending=new Set<number>();
  const failed=new Set<number>();
  let queue:number[]=[];
  let active=true;
  let raf=0;
  let target=0;
  let position=0;
  let previousTime=0;
  let displayed=-1;
  let lastImage:HTMLImageElement|null=null;
  let needsDraw=true;
  const draw=(image:HTMLImageElement,index:number)=>{
   const scale=Math.max(canvas.width/image.naturalWidth,canvas.height/image.naturalHeight);
   const width=image.naturalWidth*scale;
   const height=image.naturalHeight*scale;
   context.drawImage(image,(canvas.width-width)/2,(canvas.height-height)/2,width,height);
   canvas.dataset.frame=String(index);
   displayed=index;lastImage=image;needsDraw=false;
  };
  const schedule=()=>{if(active&&!raf)raf=requestAnimationFrame(tick)};
  const pump=()=>{
   while(active&&pending.size<4&&queue.length){
    const index=queue.shift()!;
    if(cache.has(index)||pending.has(index)||failed.has(index))continue;
    pending.add(index);
    const image=new Image();
    image.decoding='async';
    const finish=(success:boolean)=>{
     pending.delete(index);
     if(!active)return;
     if(success){
      cache.set(index,image);
      while(cache.size>32)cache.delete(cache.keys().next().value!);
     }else failed.add(index);
     schedule();pump();
    };
    image.onload=()=>{image.decode().then(()=>finish(true),()=>finish(false))};
    image.onerror=()=>finish(false);
    image.src=`/home-hero-mobile-frames/frame-${String(index).padStart(3,'0')}.webp`;
   }
  };
  function tick(now:number){
   raf=0;
   const elapsed=previousTime?Math.min(64,now-previousTime):16;
   previousTime=now;
   position+= (target-position)*(1-Math.exp(-elapsed/90));
   if(Math.abs(target-position)<.1)position=target;
   const index=Math.round(position);
   const direction=target>=position?1:-1;
   queue=[index];
   for(let distance=1;distance<=4;distance++)queue.push(index+distance*direction,index-distance*direction);
   queue=queue.filter(value=>value>=0&&value<FRAME_COUNT);
   const image=cache.get(index);
   if(image){
    // Refresh the entry so recently displayed frames survive cache eviction.
    cache.delete(index);cache.set(index,image);
    if(displayed!==index||needsDraw)draw(image,index);
   }else if(needsDraw&&lastImage)draw(lastImage,displayed);
   pump();
   if(position!==target)schedule();
  }
  const update=()=>{
   const rect=section.getBoundingClientRect();
   const height=section.firstElementChild?.clientHeight||window.innerHeight;
   const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-height)));
   section.style.setProperty('--video-progress',String(progress));
   target=reduced.matches?0:progress*(FRAME_COUNT-1);
   schedule();
  };
  const resize=()=>{
   const rect=canvas.getBoundingClientRect();
   const density=Math.min(window.devicePixelRatio||1,1.5);
   const width=Math.max(1,Math.round(rect.width*density));
   const height=Math.max(1,Math.round(rect.height*density));
   if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;needsDraw=true}
   update();
  };
  const observer=new ResizeObserver(resize);
  observer.observe(canvas);observer.observe(section);
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',resize);
  reduced.addEventListener('change',update);
  resize();
  return()=>{
   active=false;cancelAnimationFrame(raf);observer.disconnect();
   window.removeEventListener('scroll',update);
   window.removeEventListener('resize',resize);
   reduced.removeEventListener('change',update);
   cache.clear();queue=[];
  };
 },[sectionId]);
 return <canvas ref={canvasRef} className="inspire-hero-video mobile-hero-frames" aria-hidden="true" style={{backgroundImage:'url(/home-hero-poster.jpg)',backgroundSize:'cover',backgroundPosition:'center'}}/>;
}
