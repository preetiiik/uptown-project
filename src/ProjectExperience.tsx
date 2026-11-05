import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {ArrowDown,ArrowUpRight,ChevronLeft,ChevronRight,MapPin} from 'lucide-react';
import {projectPhotos} from './projectPhotos';
import {projectDetailsContent} from './projectDetailsContent';
import './project-experience.css';

type ProjectInfo={name:string;slug:string;type:string;status:string;year:string;place:string;desc:string};
const cover=(slug:string)=>slug==='balinese-layout'?'/images/balinese-layout/cover-filled.webp':`/images/${slug}/cover.webp`;

export default function ProjectExperience({slug,projects}:{slug:string;projects:ProjectInfo[]}){
 const project=projects.find(item=>item.slug===slug);
 const reduced=useReducedMotion();
 const dialog=useRef<HTMLDialogElement>(null);
 const [active,setActive]=useState<number|null>(null);
 const photos=projectPhotos[slug]||[cover(slug)];
 useEffect(()=>{
  const node=dialog.current;if(!node)return;
  if(active===null){if(node.open)node.close();return}
  if(!node.open)node.showModal();
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous};
 },[active]);
 if(!project)return <section className="project-immersive-missing"><h1>Project not found.</h1><a href="#/projects">VIEW ALL PROJECTS <ArrowUpRight size={17}/></a></section>;
 const details=projectDetailsContent[slug];
 const location=details?.location||project.place;
 const status=details?.status||project.status;
 const enquiry='https://wa.me/919742067751?text='+encodeURIComponent('Hello Uptown Projects, I would like to enquire about '+project.name+'.');
 const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(location);
 const facts=[['LOCATION',location],['PROJECT SCOPE',details?.scope||project.type],...(details?.timeline?[['PROJECT TIMELINE',details.timeline]]:[]),...(details?.architect?[['ARCHITECT',details.architect]]:[]),['STATUS',status],['YEAR',project.year]];
 const related=projects.filter(item=>item.slug!==slug).slice(0,2);
 const move=(direction:number)=>setActive(value=>((value??0)+direction+photos.length)%photos.length);
 return <article className="project-immersive">
  <section className="project-immersive-gallery" aria-labelledby="project-immersive-title">
   <div className="project-immersive-title-stage">
    <a href="#/projects" className="project-immersive-back"><ChevronLeft size={14}/> ALL PROJECTS</a>
    <div className="project-immersive-title-wrap"><a href="#project-photo-1" className="project-immersive-scroll"><ArrowDown size={13}/> SCROLL TO EXPLORE</a><h1 id="project-immersive-title" className={project.name.length>18?'is-long':''}>{project.name}</h1><p>{project.type} / {status}</p></div>
   </div>
   <div className="project-immersive-stream">
    {photos.slice(0,12).map((src,index)=><motion.figure id={'project-photo-'+(index+1)} key={src} className={'project-photo-card project-photo-shape-'+index%4} initial={reduced?false:{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:reduced?0:.8,ease:[.22,1,.36,1]}}>
     {slug==='balinese-layout'&&index===0?<div className="project-photo-window"><video src="/images/balinese-layout/video-filled.mp4" poster={cover(slug)} controls playsInline preload="metadata" aria-label="Balinese Layout project video"/></div>:<button className="project-photo-window" onClick={()=>setActive(index)} aria-label={'Open '+project.name+' photo '+(index+1)}><img src={src} alt={project.name+' — photo '+(index+1)} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'}/><span className="project-photo-expand" aria-hidden="true"><ArrowUpRight size={22}/></span></button>}
     <figcaption><span>{project.type}</span><span>{index+1} / {photos.length}</span></figcaption>
    </motion.figure>)}
    {photos.length>12&&<button className="project-photo-all" onClick={()=>setActive(0)}>VIEW ALL {photos.length} PHOTOS <ArrowUpRight size={15}/></button>}
   </div>
  </section>

  <section className="project-immersive-details project-immersive-light" aria-labelledby="project-details-title">
   <h2 id="project-details-title">Project Details</h2>
   <div className="project-immersive-detail-row"><div className="project-immersive-row-label"><span>ABOUT THIS PROJECT</span><h3>A space to<br/>call your own.</h3></div><p>{details?.description||project.desc}</p></div>
   <div className="project-immersive-detail-row"><span className="project-immersive-row-label">Features</span><dl>{facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
   {details?.testimonial&&<div className="project-immersive-detail-row"><div className="project-immersive-row-label"><span>CLIENT TESTIMONIAL</span><h3>WHAT OUR<br/>CLIENTS SAY.</h3></div><blockquote>{details.testimonial.quote}<cite>{details.testimonial.author}</cite></blockquote></div>}
   <section className="project-immersive-interest" aria-labelledby="project-interest-title"><span>INTERESTED?</span><h2 id="project-interest-title">INTERESTED IN {project.name.toUpperCase()}?</h2><p>Get in touch with our team to learn more about this project, schedule a site visit, or discuss investment opportunities.</p><div><a href="#contact">GET IN TOUCH <ArrowUpRight size={15}/></a><a href={enquiry} target="_blank" rel="noopener noreferrer">WHATSAPP <ArrowUpRight size={15}/></a></div><a href="#/projects" className="project-immersive-return"><ChevronLeft size={15}/> BACK TO ALL PROJECTS</a></section>
  </section>

  <section className="project-immersive-location project-immersive-light" aria-labelledby="project-location-title"><div><h2 id="project-location-title">Location</h2><a href={maps} target="_blank" rel="noopener noreferrer">OPEN IN MAPS <ArrowUpRight size={14}/></a></div><p><MapPin size={16}/>{location}</p><div className="project-immersive-map"><iframe title={project.name+' location'} src={'https://maps.google.com/maps?q='+encodeURIComponent(location)+'&output=embed'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div></section>

  <section className="project-immersive-related project-immersive-light" aria-labelledby="project-related-title"><div className="project-immersive-related-heading"><h2 id="project-related-title">More places to call your own.</h2><a href="#/projects">VIEW ALL PROJECTS <ArrowUpRight size={15}/></a></div><div>{related.map((item,index)=><a key={item.slug} href={'#/projects/'+item.slug} className={'project-related-card project-related-card-'+index}><div><img src={cover(item.slug)} alt={item.name} loading="lazy"/></div><span><strong>{item.name}</strong><small>{item.type} / {item.status}</small></span><p>{item.place}</p></a>)}</div></section>
  <a className="project-immersive-enquire" href={enquiry} target="_blank" rel="noopener noreferrer">ENQUIRE ABOUT THIS PROJECT <ArrowUpRight size={15}/></a>

  <dialog ref={dialog} className="project-photo-dialog" onClose={()=>setActive(null)} onClick={event=>{if(event.target===event.currentTarget)setActive(null)}} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}}} aria-label={project.name+' photo viewer'}>
   <button className="project-photo-close" onClick={()=>setActive(null)} aria-label="Close photo viewer">CLOSE <span aria-hidden="true">&times;</span></button>
   <img src={photos[active??0]} alt={project.name+' — photo '+((active??0)+1)}/>
   <div className="project-photo-dialog-controls"><button onClick={()=>move(-1)} aria-label="Previous photo"><ChevronLeft size={23}/></button><span aria-live="polite">{(active??0)+1} / {photos.length}</span><button onClick={()=>move(1)} aria-label="Next photo"><ChevronRight size={23}/></button></div>
  </dialog>
 </article>;
}
