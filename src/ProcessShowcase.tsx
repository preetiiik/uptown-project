import {useEffect,useRef,useState} from 'react';
import {motion,useInView,useReducedMotion} from 'framer-motion';
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
 const inView=useInView(section,{amount:.3});
 const [hovered,setHovered]=useState(false);
 const [focused,setFocused]=useState(false);

 const reduced=useReducedMotion();
 const [current,setCurrent]=useState(0);

 const active=steps[current];
 useEffect(()=>{if(!visible)return;for(const step of steps){const image=new Image();image.src=imagePath(step.image)}},[visible]);
 useEffect(()=>{if(!inView||reduced||hovered||focused)return;const timer=window.setInterval(()=>{if(!document.hidden)setCurrent(value=>(value+1)%steps.length)},4500);return()=>window.clearInterval(timer)},[inView,reduced,hovered,focused,current]);
 const select=(index:number)=>setCurrent((index+steps.length)%steps.length);
 return <section ref={section} id="process" className="process-gallery-section" aria-labelledby="process-gallery-title" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)}}><div className="process-gallery">
  <div className="process-gallery-heading"><span>HOW WE WORK</span><h2 id="process-gallery-title">Our Process</h2><p>From your first idea to your finished space.<br/>Five considered stages. One shared vision.</p></div>
  <div className="process-gallery-tabs" role="group" aria-label="Choose a process stage">{steps.map((step,index)=><button key={step.title} aria-pressed={current===index} onClick={()=>select(index)}>{step.title.charAt(0)+step.title.slice(1).toLowerCase()}</button>)}</div>
  <div className="process-gallery-photos" role="region" aria-roledescription="carousel" aria-label="Our process" tabIndex={0} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(current+(event.key==='ArrowRight'?1:-1))}}}>
   {steps.map((step,index)=>{const offset=(index-current+steps.length+2)%steps.length-2;if(Math.abs(offset)>1)return null;return <motion.button key={step.title} className={'process-gallery-photo'+(offset===0?' is-active':'')+(Math.abs(offset)===2?' is-distant':'')} style={{zIndex:3-Math.abs(offset)}} initial={false} animate={{x:`${offset*69}%`,scale:1-Math.abs(offset)*.17,opacity:1}} transition={{duration:reduced?0:.6,ease:[.22,1,.36,1]}} onClick={()=>select(index)} aria-label={'View '+step.title.toLowerCase()} aria-pressed={current===index} tabIndex={offset===0?-1:0}><img src={imagePath(step.image)} alt={step.alt} loading="lazy"/><span>{step.title.charAt(0)+step.title.slice(1).toLowerCase()}</span></motion.button>})}
  </div>
  <div className="process-gallery-caption" aria-live={focused?'polite':'off'} aria-atomic="true"><h3>{active.title.charAt(0)+active.title.slice(1).toLowerCase()}</h3><p>{active.description}</p></div>
  <div className="process-gallery-arrows"><button aria-label="Previous process stage" onClick={()=>select(current-1)}><ArrowLeft size={18}/></button><button aria-label="Next process stage" onClick={()=>select(current+1)}><ArrowRight size={18}/></button></div>
 </div></section>;
}