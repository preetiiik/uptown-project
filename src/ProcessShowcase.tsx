import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useInView,useReducedMotion} from 'framer-motion';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import './process-showcase.css';

const steps=[
 {title:'CONSULTATION',description:'Understanding your vision, requirements, and project scope through detailed discovery sessions.',image:'consultation.webp',alt:'Architect and clients discussing a home design'},
 {title:'PLANNING',description:'Comprehensive project planning including design, budgeting, timelines, and regulatory mapping.',image:'planning.webp',alt:'Architects reviewing residential plans and material samples'},
 {title:'PROCUREMENT',description:'Strategic sourcing of premium materials and assembly of skilled construction teams.',image:'procurement.webp',alt:'Selecting natural stone, timber and tile samples'},
 {title:'EXECUTION',description:'Precision construction with rigorous quality control, safety standards, and milestone tracking.',image:'execution.webp',alt:'Craftsman fitting a timber panel with precision'},
 {title:'DELIVERY',description:'Final inspection, finishing touches, documentation, and seamless project handover.',image:'delivery.webp',alt:'Clients receiving the keys to their completed home'},
];
const imagePath=(name:string)=>'/images/process-generated/'+name;

export default function ProcessShowcase(){
 const section=useRef<HTMLElement>(null);
 const visible=useInView(section,{once:true,margin:'300px 0px'});
 const reduced=useReducedMotion();
 const [current,setCurrent]=useState(0);
 const [direction,setDirection]=useState(1);
 const currentRef=useRef(0);
 const active=steps[current];
 useEffect(()=>{if(!visible)return;for(const step of steps){const image=new Image();image.src=imagePath(step.image)}},[visible]);
 useEffect(()=>{
  let frame=0;
  const update=()=>{frame=0;const element=section.current;if(!element)return;const travel=element.offsetHeight-window.innerHeight;const progress=Math.max(0,Math.min(1,-element.getBoundingClientRect().top/Math.max(1,travel)));const next=Math.min(steps.length-1,Math.floor(progress*steps.length));if(next!==currentRef.current){setDirection(next>currentRef.current?1:-1);currentRef.current=next;setCurrent(next)}};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[]);
 const move=(step:number)=>{const element=section.current;if(!element)return;const next=Math.max(0,Math.min(steps.length-1,currentRef.current+step));const travel=element.offsetHeight-window.innerHeight;window.scrollTo({top:window.scrollY+element.getBoundingClientRect().top+travel*((next+.15)/steps.length),behavior:reduced?'instant':'smooth'})};
 return <section ref={section} id="process" className="process-scroll-track" aria-labelledby="process-showcase-title" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1)}if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}}}><div className="process-showcase">
  <div className="process-showcase-heading"><span className="process-showcase-kicker">04 / HOW WE WORK</span><p className="process-showcase-eyebrow"><span/>Our Process<span/></p><h2 id="process-showcase-title">A PROVEN FRAMEWORK FOR<br/>EXCEPTIONAL DELIVERY.</h2></div>
  <div className="process-showcase-window" role="region" aria-roledescription="carousel" aria-label="Our five-step process" tabIndex={0}>
   <div className="process-showcase-live" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" custom={direction} initial={false}>
    <motion.article key={current} className="process-showcase-slide" custom={direction} variants={{enter:(step:number)=>({y:reduced?0:step*85,opacity:reduced?1:0}),center:{y:0,opacity:1},exit:(step:number)=>({y:reduced?0:-step*85,opacity:reduced?1:0})}} initial="enter" animate="center" exit="exit" transition={{duration:reduced?0:.5,ease:[.22,1,.36,1]}} role="group" aria-roledescription="slide" aria-label={'Step '+(current+1)+' of '+steps.length}>
     <motion.div className="process-showcase-pill" initial={reduced?false:{clipPath:'inset(25% 0% 25% 0% round 24px)'}} animate={{clipPath:'inset(0% 0% 0% 0% round 24px)'}} transition={{duration:reduced?0:.65,ease:[.22,1,.36,1]}}><img src={imagePath(active.image)} alt={active.alt} loading="lazy"/></motion.div>
     <h3>{active.title}</h3><p>{active.description}</p>
    </motion.article>
   </AnimatePresence></div>
  </div>
  <div className="process-showcase-footer"><div className="process-showcase-number" aria-hidden="true"><AnimatePresence mode="wait" initial={false}><motion.span key={current} initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:reduced?0:.25}}>{String(current+1).padStart(2,'0')}</motion.span></AnimatePresence></div><p>FROM YOUR FIRST IDEA TO YOUR FINISHED SPACE.</p><div className="process-showcase-controls"><button type="button" className="process-showcase-prev" aria-label="Previous process step" onClick={()=>move(-1)}><ArrowLeft size={15}/> Prev</button><button type="button" className="process-showcase-next" aria-label="Next process step" onClick={()=>move(1)}>Next <ArrowRight size={15}/></button></div></div>
 </div></section>;
}

