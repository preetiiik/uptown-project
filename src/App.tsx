
import {useState,useEffect,useRef} from 'react';
import {motion,AnimatePresence,useScroll,useTransform,useReducedMotion,useInView,animate} from 'framer-motion';
import {ArrowUpRight,ArrowRight,MapPin,Phone,Mail,MessageCircle,ChevronLeft,ChevronRight,Instagram,Check,MoveUpRight,MessagesSquare,ClipboardList,Package,HardHat,KeyRound} from 'lucide-react';
import './style.css';
import ScrollVideo from './ScrollVideo';
import {projectPhotos} from './projectPhotos';
import {projectDetailsContent} from './projectDetailsContent';
const asset=(folder:string,name='cover')=>folder==='balinese-layout'&&name==='cover'?'/images/balinese-layout/cover-filled.webp':`/images/${folder}/${name}.webp`;
const projects=[
 {name:'Vantara Farms',slug:'vantara',type:'Farmland Layout',status:'Completed',year:'2025',place:'Devaragudihalli, Hubballi',desc:'An exclusive farmhouse layout designed for those seeking space, nature and a slower pace of living.'},
 {name:'Arihant Farms',slug:'arihant-farms',type:'Farmhouse',status:'Completed',year:'2025',place:'Devaragudihalli, Hubballi',desc:'A thoughtfully crafted farmhouse destination grounded in nature and everyday tranquility.'},
 {name:'Gokulam',slug:'gokulam',type:'Farmhouse',status:'Completed',year:'2025',place:'Devaragudihalli, Hubballi',desc:'An intimate retreat that balances architecture, open landscapes and meaningful moments.'},
 {name:'Manmeet',slug:'manmeet',type:'Farmhouse',status:'Ongoing',year:'2026',place:'Noolvi Cross, Hubballi',desc:'A bespoke private residence with contemporary design, premium finishes and landscaped gardens.'},
 {name:'Evara Villas',slug:'evara',type:'Villas',status:'Upcoming',year:'2027',place:'Hubballi',desc:'Contemporary villa living, curated for comfort and lasting elegance.'},
 {name:'Balinese Villa',slug:'balinese-villa',type:'Villas',status:'Upcoming',year:'2021',place:'Hubballi',desc:'Tropical-inspired architectural concept surrounded by calm.'},
 {name:'Heritage Layout',slug:'heritage',type:'Residential Layout',status:'Upcoming',year:'2026',place:'Hubballi',desc:'A thoughtfully planned residential destination.'},
 {name:'Ubud Farms',slug:'ubud',type:'Farmhouse',status:'Upcoming',year:'2026',place:'Hubballi',desc:'Nature-led spaces inspired by the easy rhythm of retreat living.'},
 {name:'Concept Villa',slug:'concept',type:'Villas',status:'Upcoming',year:'2027',place:'Hubballi',desc:'Modern, minimal architecture shaped around personal space.'},
 {name:'SevenBeans Cafe Hubballi',slug:'seven-beans',type:'Commercial Projects',status:'Completed',year:'2025',place:'Hubballi',desc:'A distinctive commercial environment designed around the guest experience.'},
 {name:'Nisarga Farms',slug:'nisarga',type:'Farmland Layout',status:'Upcoming',year:'2025',place:'Hubballi',desc:'Nature-first community planning and open living.'}
,
 {name:'Balinese Layout',slug:'balinese-layout',type:'Residential Layout',status:'Completed',year:'2021',place:'Devaragudihalli, Hubballi',desc:projectDetailsContent['balinese-layout'].description},
 {name:'PRN Farms',slug:'prn-farms',type:'Farmhouse',status:'Ongoing',year:'2026',place:'Varur, Hubballi',desc:projectDetailsContent['prn-farms'].description}
].map(project=>{const details=projectDetailsContent[project.slug];return details?{...project,place:details.location,status:details.status.charAt(0)+details.status.slice(1).toLowerCase(),desc:details.description || project.desc}:project});
const services=[
 ['Project Management Services','Complete oversight and coordination from inception to completion, keeping timelines, budgets and quality standards on track.'],
 ['Turnkey Projects','End-to-end development ? from architectural design and approvals through finishing and handover.'],
 ['Project Consultancy','Feasibility analysis, design optimization, regulatory advice and strategic project planning.'],
 ['Material Procurement & Sourcing','Premium material sourcing through our vendor network, focused on quality, value and timely delivery.'],
 ['Landscape Development & Design','Timeless gardens, outdoor environments and landscapes that harmonise architecture with nature.']
];
const serviceContent=[
 {description:'Our project management team provides meticulous oversight for every phase of construction — from site preparation and scheduling to resource allocation and quality auditing. We ensure every milestone is delivered on time, within budget, and to the highest architectural standards.',features:['End-to-end project coordination','Timeline & budget management','Quality control & assurance','Risk mitigation & reporting','Vendor & subcontractor management'],cta:'DISCUSS YOUR PROJECT'},
 {description:'From blueprint to handover, our turnkey solutions cover every aspect of development. We handle architectural design, statutory approvals, construction, interior finishing, and final commissioning — delivering move-in-ready spaces with zero hassle.',features:['Single point of accountability','Design to handover execution','Statutory & regulatory compliance','Premium finishing & interiors','Post-completion support'],cta:'EXPLORE TURNKEY SOLUTIONS'},
 {description:'Leverage decades of industry experience for your next development. Our consultancy services encompass feasibility studies, site analysis, design optimization, cost estimation, and strategic planning — empowering informed decisions at every stage.',features:['Feasibility & viability analysis','Design & architectural optimization','Cost estimation & budgeting','Regulatory & compliance advisory','Market & location intelligence'],cta:'BOOK A CONSULTATION'},
 {description:'Access premium construction materials at competitive prices through our extensive, vetted vendor network. We handle sourcing, quality inspection, logistics, and just-in-time delivery — ensuring your project never faces material delays or compromises.',features:['Extensive vendor network','Quality inspection & certification','Competitive pricing & negotiation','Just-in-time delivery coordination','Premium material access'],cta:'ENQUIRE ABOUT PROCUREMENT'},
 {description:'Our landscape development team crafts immersive outdoor environments that seamlessly extend the architectural narrative of every property. From master-planned gardens and curated plantscapes to elegant hardscape elements and water features — we design landscapes that elevate the living experience and harmonise with nature.',features:['Master landscape planning & design','Curated garden & plantscape design','Outdoor living & entertainment spaces','Water features & hardscape elements','Sustainable & native landscaping'],cta:'DISCUSS LANDSCAPE DESIGN'}
];
const testimonials=[
 ['WE SPENT OUR WEEKEND AT AN UPTOWN FARMHOUSE RETREAT AND IT WAS BREATHTAKING. THE MINIMALIST GLASS ARCHITECTURE, THE ORGANIC FARM DINING, AND THE SHEER CALM OF THE PLACE WAS UNMATCHED.','SIDDHARTH RAO','Entrepreneur','HUBBALLI, KARNATAKA'],
 ['UPTOWN HAS COMPLETELY REDEFINED STAYCATION LUXURY. THE BLEND OF HIGH-END ARCHITECTURAL DETAIL WITH PEACEFUL NATURE CONNECTION IS INCREDIBLY WELL-EXECUTED. A TRUE SLOW-LIVING ESCAPE.','ROHAN MEHTA','Founder & CEO, Zenith Technologies','BENGALURU, KARNATAKA'],
 ["ACQUIRING AN UPTOWN VILLA WAS THE BEST DECISION FOR OUR FAMILY'S LIFESTYLE. THE DESIGN LANGUAGE IS EXCEPTIONALLY PREMIUM, AND THE MANAGEMENT MAKES HOSTING WEEKEND STAYS COMPLETELY EFFORTLESS.",'PRIYA DESAI','Managing Director, Veda Luxury Group','DHARWAD, KARNATAKA']
];
const wa='https://wa.me/919742067751?text='+encodeURIComponent('Hello Uptown Projects, I would like to enquire about your projects.');
const Fade=({children,delay=0,className=''}:{children:React.ReactNode,delay?:number,className?:string})=><motion.div className={className} initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
function Btn({children,href='#contact',light=false}:{children:React.ReactNode,href?:string,light?:boolean}){return <a href={href} className={'btn '+(light?'btn-light':'btn-dark')}>{children}<ArrowUpRight size={17}/></a>}
function Header(){
 const[menuOpen,setMenuOpen]=useState(false);
 const menuButton=useRef<HTMLButtonElement>(null);
 const[scrolled,setScrolled]=useState(()=>window.location.hash.startsWith('#/'));
 useEffect(()=>{
  const update=()=>{const home=document.getElementById('home');setScrolled(window.location.hash.startsWith('#/')||!home||home.getBoundingClientRect().bottom<=82)};
  const onRoute=()=>{requestAnimationFrame(update)};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);window.addEventListener('hashchange',onRoute);
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);window.removeEventListener('hashchange',onRoute)};
 },[]);
 return <header className={'header '+(scrolled?'is-scrolled':'is-hero-menu')} onKeyDown={event=>{if(event.key==='Escape'&&menuOpen){setMenuOpen(false);menuButton.current?.focus()}}}>
  <a href="#home" className="brand"><img src="/images/logo.png" alt="Uptown Projects"/></a>
  <button ref={menuButton} type="button" className={'mobile-menu-toggle'+(menuOpen?' is-open':'')} aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={()=>setMenuOpen(value=>!value)}><span/><span/><span/></button>
  <nav id="main-navigation" aria-label="Main navigation" className={'nav'+(menuOpen?' mobile-open':'')}>{[['Home','#home'],['About','#about'],['Projects','#projects'],['Services','#services'],['Testimonies','#testimonies'],['Contact','#contact']].map(([l,h])=><a key={l} href={h} onClick={()=>setMenuOpen(false)}>{l}</a>)}</nav>
  <a href="#contact" className="header-cta">GET IN TOUCH <ArrowUpRight size={16}/></a>
 </header>
}
function HeroTitle(){
 const reduceMotion=useReducedMotion();
 const [titleComplete,setTitleComplete]=useState(false);
 const showDetails=!!reduceMotion || titleComplete;
 const letters=(text:string,start:number)=>Array.from(text).map((letter,index)=>{
  const position=start+index;
  return <motion.span key={position} className="hero-title-letter" initial={reduceMotion?false:{opacity:0,x:-24,filter:'blur(4px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} transition={{duration:reduceMotion?0:.42,delay:reduceMotion?0:.2+position*.065,ease:[.22,1,.36,1]}} onAnimationComplete={()=>{if(position===20)setTitleComplete(true)}}>{letter}</motion.span>
 });
 return <><h1 id="hero-title" aria-label="CRAFTING LUXURY SPACES."><span className="hero-title-first" aria-hidden="true">{letters('CRAFTING',0)}</span><br/><em className="hero-gold" aria-hidden="true">{letters('LUXURY',8)}</em><br/><span aria-hidden="true">{letters('SPACES.',14)}</span></h1><motion.p className="destination-subheading" initial={reduceMotion?false:{opacity:0,y:16}} animate={{opacity:showDetails?1:0,y:showDetails?0:16}} transition={{duration:reduceMotion?0:.55,ease:[.22,1,.36,1]}} style={{visibility:showDetails?'visible':'hidden'}}>Premium villas, luxury farmhouses, and nature retreats<br className="hero-copy-break"/> for slow living and peaceful escapes.</motion.p><motion.div className="destination-hero-actions" initial={reduceMotion?false:{opacity:0,y:16}} animate={{opacity:showDetails?1:0,y:showDetails?0:16}} transition={{duration:reduceMotion?0:.55,delay:reduceMotion?0:.12,ease:[.22,1,.36,1]}} style={{visibility:showDetails?'visible':'hidden'}}><a href="#projects" tabIndex={showDetails?0:-1}>EXPLORE PROJECTS <ArrowUpRight size={16}/></a><a href="#contact" tabIndex={showDetails?0:-1}>GET IN TOUCH <ArrowUpRight size={16}/></a></motion.div></>
}
function Hero(){
 const reduceMotion=useReducedMotion();
 return <section id="home" className="scroll-video-hero" aria-labelledby="hero-title">
  <div className="inspire-hero scroll-video-stage">
  <ScrollVideo sectionId="home"/>
  <div className="inspire-hero-overlay" aria-hidden="true"/>
  <motion.div className="inspire-hero-content" initial={reduceMotion?false:{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:1.2,delay:.25,ease:[.22,1,.36,1]}}>
   <span className="video-hero-wordmark">UPTOWN PROJECTS</span>
   <h1 id="hero-title">CRAFTING<br/><em>LUXURY SPACES.</em></h1>
   <p className="video-hero-description">Premium villas, luxury farmhouses, and nature retreats for slow living and peaceful escapes.</p>
   <div className="video-hero-actions"><a href="#projects">EXPLORE <ArrowUpRight size={18}/></a><a href="#contact">CONTACT</a></div>
  </motion.div>
  <div className="inspire-hero-bottom">
   <a className="inspire-hero-project" href="#/projects/arihant-farms"><span>FEATURED RESIDENCE</span><strong>Arihant Farms <ArrowUpRight size={12}/></strong></a>
   <a className="inspire-hero-discover" href="#about"><span>SCROLL TO DISCOVER</span><span className="inspire-hero-scroll-line" aria-hidden="true"/></a>
   <a className="inspire-hero-location" href="#projects">HUBBALLI, KARNATAKA <ArrowUpRight size={13}/></a>
  </div>
  <div className="scroll-video-progress" aria-hidden="true"><span/></div>
  </div>
 </section>
}

function Marquee(){
 const galleryRef=useRef<HTMLElement>(null);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress}=useScroll({target:galleryRef,offset:['start end','end start']});
 const topX=useTransform(scrollYProgress,[0,1],['0%','-22%']);
 const bottomX=useTransform(scrollYProgress,[0,1],['-22%','0%']);
 const rows=[projects.slice(0,8),[projects[5],projects[3],projects[0],projects[7],projects[2],projects[4],projects[1],projects[8]]];
 return <section ref={galleryRef} className="scroll-showcase" aria-label="Uptown project showcase">
  {rows.map((row,index)=><motion.div key={index} className="showcase-track" style={{x:reduceMotion?0:index===0?topX:bottomX}}>
   {row.map(project=><a key={project.slug} className="showcase-card" href="#projects" aria-label={'Explore '+project.name}>
    <img src={asset(project.slug)} alt={project.name} loading="lazy"/>
    <span className="showcase-caption"><span><small>{project.type}</small><strong>{project.name}</strong></span><ArrowUpRight size={20}/></span>
   </a>)}
  </motion.div>)}
 </section>
}
function About(){
 const section=useRef<HTMLElement>(null);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress}=useScroll({target:section,offset:['start start','end end']});
 const width=useTransform(scrollYProgress,[0,.72],['26%','100%']);
 const height=useTransform(scrollYProgress,[0,.72],['26%','100%']);
 const titleTop=useTransform(scrollYProgress,[0,.72],['50%','77%']);
 const titleGap=useTransform(scrollYProgress,[0,.72],['30vw','1.5vw']);
 const detailsOpacity=useTransform(scrollYProgress,[.55,.85],[0,1]);
 const detailsY=useTransform(scrollYProgress,[.55,.85],[25,0]);
 return <section id='about' ref={section} className={'about-cinematic'+(reduceMotion?' is-static':'')} aria-labelledby='about-cinematic-title'>
  <div className='about-cinematic-stage'>
   <motion.div className='about-cinematic-image' style={{width:reduceMotion?'100%':width,height:reduceMotion?'100%':height}}><img src={asset('balinese-villa')} alt='Balinese-inspired Uptown villa surrounded by nature' loading='lazy'/><div className='about-cinematic-shade'/></motion.div>
   <div className='about-cinematic-top'><span className='about-cinematic-mark' aria-hidden='true'>✳</span><span>02 / ABOUT UPTOWN</span><a href='#contact'>LET’S CONNECT <ArrowUpRight size={15}/></a></div>
   <motion.h2 id='about-cinematic-title' className='about-cinematic-title' style={{top:reduceMotion?'77%':titleTop,gap:reduceMotion?'1.5vw':titleGap}}><span>UPTOWN</span><span>PROJECTS</span></motion.h2>
   <motion.div className='about-cinematic-story' style={{opacity:reduceMotion?1:detailsOpacity,y:reduceMotion?0:detailsY}}><span className='about-cinematic-label'>WHERE NATURE MEETS LUXURY.</span><p>Uptown Projects is a premier lifestyle, architectural, and staycation experience company. We design, build, and manage bespoke residential spaces, modern farmhouses, and nature retreats that bring architectural excellence and absolute calm to families seeking the ultimate slow-living escape.</p><a href='#contact'>DISCOVER UPTOWN <ArrowUpRight size={16}/></a></motion.div>
   <motion.div className='about-cinematic-notes' style={{opacity:reduceMotion?1:detailsOpacity,y:reduceMotion?0:detailsY}}><div className='about-cinematic-note'><span className='about-cinematic-label'>OUR PHILOSOPHY</span><strong>100%</strong><span>CURATED EXCLUSIVITY</span></div><div className='about-cinematic-location'><MapPin size={15}/><span>HUBBALLI, KARNATAKA</span><span className='about-cinematic-dot'/></div></motion.div>
   <div className='about-cinematic-foot'><span>ARCHITECTURE / NATURE / SLOW LIVING</span><span>SCROLL TO DISCOVER <ArrowRight size={13}/></span></div>
  </div>
 </section>
}
function Services(){
 const [active,setActive]=useState<number|null>(null);
 const [selected,setSelected]=useState<number|null>(null);
 const backButton=useRef<HTMLButtonElement>(null);
 const panelButtons=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{if(selected!==null)backButton.current?.focus({preventScroll:true})},[selected]);
 const closeService=()=>{const previous=selected;setSelected(null);if(previous!==null)panelButtons.current[previous]?.focus({preventScroll:true})};
 const photos=['manmeet','balinese-villa','concept','arihant-farms','gokulam'];
 return <section id="services" className="services section-pad" aria-labelledby="services-title">
  <div className="services-intro"><div><div className="section-kicker">03 / WHAT WE DO</div><h2 id="services-title">OUR SERVICES</h2><p>From first vision to final handover. Expertise at every step.</p></div><span className="services-rule" aria-hidden="true"/></div>
  <div className="services-stage" onKeyDown={e=>{if(e.key==='Escape'&&selected!==null){e.preventDefault();closeService()}}}>
  <div className="service-panels" aria-hidden={selected!==null} onMouseLeave={()=>setActive(null)}>
   {services.map(([title,desc],i)=><button type="button" ref={el=>{panelButtons.current[i]=el}} tabIndex={selected!==null?-1:0} key={title} className={'service-panel'+(active===i?' is-active':'')} aria-expanded={selected===i} aria-controls="service-expanded-view" onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onBlur={()=>setActive(null)} onClick={()=>setSelected(i)}>
    <img className="service-image" src={asset(photos[i])} alt="" loading="lazy"/>
    <span className="service-shade"/>
    <span className="service-panel-index">0{i+1}</span>
    <span className="service-content"><span className="service-title">{title}</span><span className="service-detail" id={'service-detail-'+i} aria-hidden={active!==i}><span>{desc}</span><ArrowUpRight size={22} aria-hidden="true"/></span></span>
    <span className="service-big-number" aria-hidden="true">{i+1}</span>
   </button>)}
  </div>
  {selected!==null&&<div id="service-expanded-view" className="service-expanded" role="region" aria-labelledby="service-expanded-title">
   <img className="service-expanded-image" src={asset(photos[selected])} alt={services[selected][0]+' ? Uptown Projects'}/>
   <div className="service-expanded-overlay"/>
   <div className="service-expanded-top"><button type="button" ref={backButton} className="service-back" onClick={closeService}><ChevronLeft size={18}/> ALL SERVICES</button><span>0{selected+1} / 05</span></div>
   <div className="service-expanded-copy"><span className="service-expanded-label">OUR EXPERTISE / 0{selected+1}</span><h3 id="service-expanded-title">{services[selected][0]}</h3><p>{serviceContent[selected].description}</p><ul className="service-scope" aria-label="Service scope">{serviceContent[selected].features.map(feature=><li key={feature}>{feature}</li>)}</ul><a href="#contact" className="services-contact">{serviceContent[selected].cta} <ArrowUpRight size={17}/></a></div>
  </div>}
  </div>
  <div className="services-foot"><span className="services-hint">EXPLORE OUR EXPERTISE</span><a href="#contact" className="services-contact">DISCUSS YOUR PROJECT <ArrowUpRight size={17}/></a></div>
 </section>
}
function Projects({hero=false}:{hero?:boolean}){
 const [current,setCurrent]=useState(0);
 const [focused,setFocused]=useState(false);
 const [visible,setVisible]=useState(false);
 const [tabVisible,setTabVisible]=useState(()=>!document.hidden);
 const showcaseRef=useRef<HTMLElement>(null);
 const reduceMotion=useReducedMotion();
 const autoplay=hero&&!reduceMotion&&!focused&&visible&&tabVisible;
 useEffect(()=>{if(!hero)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});if(showcaseRef.current)observer.observe(showcaseRef.current);const onVisibility=()=>setTabVisible(!document.hidden);document.addEventListener('visibilitychange',onVisibility);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',onVisibility)}},[hero]);
 useEffect(()=>{if(!autoplay)return;const timer=window.setTimeout(()=>setCurrent(value=>(value+1)%projects.length),6000);return()=>window.clearTimeout(timer)},[autoplay,current]);
 const selected=projects[current];
 const move=(step:number)=>setCurrent(value=>(value+step+projects.length)%projects.length);
 const previewStart=Math.floor(current/3)*3;
 const previews=projects.slice(previewStart,previewStart+3).map((_,index)=>previewStart+index).reverse();
 return <section ref={showcaseRef} id={hero?'home':'projects'} className={'destination-projects'+(hero?' destination-home':'')} aria-labelledby={hero?'hero-title':'featured-projects-title'} onFocusCapture={e=>setFocused(e.target.matches(':focus-visible'))} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setFocused(false)}}>
  <div className="destination-hero" role="region" aria-roledescription="carousel" aria-label={hero?'Uptown destinations':'Featured projects'} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}}>
   <AnimatePresence initial={hero&&!reduceMotion}><motion.img key={selected.slug} className="destination-backdrop" src={asset(selected.slug)} alt={selected.name} initial={{opacity:0,scale:reduceMotion?1:1.035}} animate={{opacity:1,scale:hero&&!reduceMotion?[1.035,1.11]:1,x:hero&&!reduceMotion?['-.7%','.7%']:0,y:hero&&!reduceMotion?['.4%','-.4%']:0}} exit={{opacity:0}} transition={{opacity:{duration:reduceMotion?0:1.1},scale:{duration:reduceMotion?0:hero?10:1.4,repeat:hero&&!reduceMotion?Infinity:0,repeatType:'reverse',ease:'easeInOut'},x:{duration:10,repeat:Infinity,repeatType:'reverse',ease:'easeInOut'},y:{duration:10,repeat:Infinity,repeatType:'reverse',ease:'easeInOut'}}}/></AnimatePresence>
   <div className="destination-wash" aria-hidden="true"/>
   <div className="destination-heading">{!hero&&<div className="section-kicker">05 / OUR COLLECTIONS</div>}{hero?<HeroTitle/>:<h2 id="featured-projects-title">FIND YOUR<br/><span>EXCEPTIONAL SPACE.</span></h2>}</div>
   {!hero&&<div className="destination-copy" aria-live={hero?'off':'polite'} aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.div key={selected.slug} initial={{opacity:0,y:reduceMotion?0:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduceMotion?0:-12}} transition={{duration:reduceMotion?0:.2}}><span className="destination-copy-kicker">DISCOVER UPTOWN</span><h3><a href={'#/projects/'+selected.slug}>{selected.name}</a></h3><p>{selected.desc}</p><a href={'#/projects/'+selected.slug} className="destination-detail-link">EXPLORE PROJECT <ArrowUpRight size={17}/></a></motion.div></AnimatePresence></div>}
   <div className="destination-orbit destination-orbit-selector" aria-label="Choose a featured project">{previews.map((index,position)=><motion.button layout={!reduceMotion} type="button" key={position} className={'destination-orbit-thumb'+(index===current?' selected':'')} transition={{layout:{duration:reduceMotion?0:.8,ease:[.22,1,.36,1]}}} onClick={()=>setCurrent(index)} aria-label={'Show '+projects[index].name} aria-pressed={index===current}>{index===current&&<motion.span layoutId={reduceMotion?undefined:hero?'hero-orbit-halo':'project-orbit-halo'} className="destination-orbit-halo" aria-hidden="true" transition={{duration:reduceMotion?0:.8,ease:[.22,1,.36,1]}}><span className="destination-ring ring-one"/><span className="destination-ring ring-two"/></motion.span>}<span className="destination-orbit-image"><AnimatePresence initial={false}><motion.img key={projects[index].slug} src={asset(projects[index].slug)} alt="" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduceMotion?0:.8}}/></AnimatePresence></span></motion.button>)}</div>
  </div>
  {!hero&&<>
  <div className="destination-info"><div><MapPin size={17}/><span><small>LOCATION</small><strong>{selected.place}</strong></span></div><div><span><small>PROJECT TYPE</small><strong>{selected.type}</strong></span></div><div><span><small>STATUS</small><strong>{selected.status}</strong></span></div><a href={'#/projects/'+selected.slug} aria-label={'View '+selected.name}><span>VIEW PROJECT</span><ArrowUpRight size={21}/></a></div>
  <div className="destination-collection"><div className="destination-collection-heading"><h3>More places to call your own.</h3><a href="#/projects">VIEW ALL PROJECTS <ArrowUpRight size={16}/></a></div><div className="destination-cards">{[1,2,3,4].map(step=>{const index=(current+step)%projects.length;const project=projects[index];return <button type="button" className="destination-card" key={step} onClick={()=>setCurrent(index)} aria-label={'Show '+project.name}><img src={asset(project.slug)} alt="" loading="lazy"/><span className="destination-card-status">{project.status}</span><span className="destination-card-arrow"><ArrowUpRight size={16}/></span><span className="destination-card-copy"><small>{project.type}</small><strong>{project.name}</strong><span>{project.place}</span></span></button>})}</div></div>
  </>}
 </section>
}
function ProjectReveal(){
 const section=useRef<HTMLElement>(null);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress}=useScroll({target:section,offset:['start start','end end']});
 const imageY=useTransform(scrollYProgress,[0,.72],['0%','-100%']);
 const galleryY=useTransform(scrollYProgress,[0,.72],['100%','0%']);
 const titleOpacity=useTransform(scrollYProgress,[0,.35],[1,0]);
 const featured=projects.slice(0,6);
 return <section id="projects" ref={section} className={'project-reveal'+(reduceMotion?' is-static':'')} aria-labelledby="project-reveal-title">
  <div className="project-reveal-sticky">
   <motion.div className="project-reveal-gallery" style={{y:reduceMotion?0:galleryY}}>
    <div className="project-reveal-top"><span>UPTOWN / SELECTED PROJECTS</span><a href="#/projects">VIEW ALL PROJECTS <ArrowUpRight size={15}/></a></div>
    <div className="project-reveal-cards">{featured.map((project,i)=><a className="project-reveal-card" key={project.slug} href={'#/projects/'+project.slug}>
     <div className="project-reveal-photo"><div className="project-reveal-image"><img src={asset(project.slug)} alt={project.name} loading="lazy"/></div><span className="project-reveal-arrow"><ArrowUpRight size={22}/></span><span className="project-reveal-letter" aria-hidden="true">{'UPTOWN'[i]}</span></div>
     <span className="project-reveal-number">0{i+1} / {project.type}</span><h3>{project.name}</h3><span className="project-reveal-place">{project.place}</span>
    </a>)}</div>
    <div className="project-reveal-description"><p>Spaces to slow down. Places to feel at home.</p><span>Browse our completed architectural achievements, ongoing private villa developments, and upcoming boutique nature staycations designed with meticulous care.</span></div>
   </motion.div>
   <motion.div className="project-reveal-cover" style={{y:reduceMotion?0:imageY}}>
    <img src={asset('vantara')} alt="Lush landscape at Vantara Farms" loading="lazy"/><div className="project-reveal-shade"/>
    <span className="project-reveal-eyebrow">05 / OUR COLLECTION</span>
    <motion.h2 id="project-reveal-title" style={{opacity:reduceMotion?1:titleOpacity}}>BESPOKE SPACES  &amp;  PREMIUM <span className="retreats-word">RETREATS</span></motion.h2>
    <div className="project-reveal-bottom"><span>SCROLL TO EXPLORE <ArrowRight size={14}/></span></div> 
   </motion.div>
  </div>
 </section>
}
function AllProjects(){
 const [status,setStatus]=useState('All');const [type,setType]=useState('All');
 const filtered=projects.filter(p=>(status==='All'||p.status===status)&&(type==='All'||p.type===type));
 return <section className="projects section-pad projects-page"><a className="project-back-link" href="#projects"><ChevronLeft size={17}/> BACK TO HOME</a><div className="section-kicker">OUR COMPLETE COLLECTION</div><div className="section-heading"><h2>ALL<br/><em>PROJECTS.</em></h2><p>A collection of thoughtfully designed villas, farmhouses, retreats, residential developments, and architectural projects that reflect our commitment to quality, craftsmanship, and timeless value.</p></div><div className="filters"><div className="filter-group"><small>STATUS</small>{['All','Completed','Ongoing','Upcoming'].map(v=><button key={v} className={status===v?'selected':''} onClick={()=>setStatus(v)}>{v}</button>)}</div><div className="filter-group"><small>TYPE</small><select value={type} onChange={e=>setType(e.target.value)} aria-label="Filter project type">{['All',...Array.from(new Set(projects.map(p=>p.type)))].map(v=><option key={v}>{v}</option>)}</select></div></div><div className="project-grid">{filtered.map(p=><a className="project-card" href={'#/projects/'+p.slug} key={p.slug}><div className="project-cover"><img src={asset(p.slug)} loading="lazy" alt={p.name}/><span className="project-open"><ArrowUpRight/></span></div><div className="project-meta"><span>{p.status.toUpperCase()} / {p.type.toUpperCase()}</span><span>{p.year}</span></div><h3>{p.name}</h3><div className="project-location"><MapPin size={14}/>{p.place}</div></a>)}</div>{!filtered.length&&<p className="no-results">No projects match these filters. Try another category.</p>}</section>
}
function ProjectsCTA(){
 const section=useRef<HTMLElement>(null);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress}=useScroll({target:section,offset:['start start','end end']});
 const leftX=useTransform(scrollYProgress,[0,.65],['0%','-100%']);
 const rightX=useTransform(scrollYProgress,[0,.65],['0%','100%']);
 const titleScale=useTransform(scrollYProgress,[0,.65],[1,.58]);
 const cardY=useTransform(scrollYProgress,[.15,.8],['115%','0%']);
 const cardOpacity=useTransform(scrollYProgress,[.15,.35],[0,1]);
 const symbolRotate=useTransform(scrollYProgress,[.15,1],[0,180]);
 return <section ref={section} className={'invitation-cta'+(reduceMotion?' is-static':'')} aria-labelledby="projects-cta-title">
  <div className="invitation-stage">
   <img className="invitation-photo" src="/images/arihant-farms/gallery-8.webp" alt="A warm timber-lined living space at Arihant Farms" loading="lazy"/>
   <div className="invitation-shade" aria-hidden="true"/>
   <div className="invitation-top"><span>UPTOWN PROJECTS</span><span>SPACES FOR A LIFE WELL LIVED</span><a href="#contact">LET?S TALK <ArrowUpRight size={13}/></a></div>
   <h2 id="projects-cta-title" className="invitation-heading"><motion.span style={{x:reduceMotion?0:leftX,scale:reduceMotion?1:titleScale}}>Find your</motion.span><motion.span style={{x:reduceMotion?0:rightX,scale:reduceMotion?1:titleScale}}>exceptional space.</motion.span></h2>
   <motion.div className="invitation-card" style={{y:reduceMotion?0:cardY,opacity:reduceMotion?1:cardOpacity}}>
    <span className="invitation-eyebrow">YOUR NEXT CHAPTER</span>
    <h3>Make room for<br/>something extraordinary.</h3>
    <motion.svg className="invitation-symbol" style={{rotate:reduceMotion?0:symbolRotate}} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M50 10a20 20 0 0 1 0 40 20 20 0 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="50" cy="30" r="6" fill="currentColor"/><circle cx="50" cy="70" r="6" fill="currentColor"/></motion.svg>
    <ul><li>Explore premium villas and private farmhouses</li><li>Discover thoughtful architecture and natural surroundings</li><li>Talk to our team about your vision</li></ul>
    <a className="invitation-button" href="#contact">LET?S FIND YOUR SPACE <ArrowUpRight size={15}/></a>
    <a className="invitation-whatsapp" href={wa} target="_blank" rel="noopener noreferrer">OR CONNECT ON WHATSAPP <ArrowUpRight size={11}/></a>
   </motion.div>
   <div className="invitation-bottom"><span>DESIGNED AROUND YOU.</span><span>HUBBALLI, KARNATAKA</span></div>
  </div>
 </section>
}
function ProjectDetails({slug}:{slug:string}){
 const project=projects.find(p=>p.slug===slug);const [photo,setPhoto]=useState(0);
 if(!project)return <section className="section-pad projects-page"><h2>Project not found.</h2><Btn href="#/projects" light>VIEW ALL PROJECTS</Btn></section>;
 const details=projectDetailsContent[slug];
 const location=details?.location || project.place;
 const status=details?.status || project.status;
 const photos=projectPhotos[slug]||[asset(slug)];
 const move=(step:number)=>setPhoto(value=>(value+step+photos.length)%photos.length);
 const enquiry='https://wa.me/919742067751?text='+encodeURIComponent('Hello Uptown Projects, I would like to enquire about '+project.name+'.');
 return <article className="project-detail-page section-pad"><a className="project-back-link" href="#/projects"><ChevronLeft size={17}/> ALL PROJECTS</a><div className="project-detail-heading"><div><div className="section-kicker">{project.type.toUpperCase()} / {status.toUpperCase()}</div><h1>{project.name}</h1><p className="project-location"><MapPin size={16}/>{location}</p></div><Btn href={enquiry} light>ENQUIRE ABOUT THIS PROJECT</Btn></div><div className="project-gallery" aria-label={project.name+' photo gallery'} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}}>{slug==='balinese-layout'?<video className="project-gallery-main" src="/images/balinese-layout/video-filled.mp4" poster={asset(slug)} controls playsInline preload="metadata" aria-label="Balinese Layout project video"/>:<img className="project-gallery-main" src={photos[photo]} alt={project.name+' ? photo '+(photo+1)} fetchPriority="high"/>}{photos.length>1&&<><button type="button" className="image-nav prev" onClick={()=>move(-1)} aria-label="Previous photo"><ChevronLeft/></button><button type="button" className="image-nav next" onClick={()=>move(1)} aria-label="Next photo"><ChevronRight/></button></>}<span className="gallery-count" aria-live="polite">{photo+1} / {photos.length}</span></div><div className="project-thumbnails" aria-label="Choose a photo">{photos.map((src,index)=><button key={src} type="button" className={photo===index?'selected':''} aria-label={'Show photo '+(index+1)} aria-pressed={photo===index} onClick={()=>setPhoto(index)}><img src={src} alt="" loading="lazy"/></button>)}</div><div className="project-description"><div><div className="section-kicker">ABOUT THIS PROJECT</div><h2>A space to<br/><em>call your own.</em></h2></div><div><p>{details?.description || project.desc}</p><dl>{[['LOCATION',location],['PROJECT SCOPE',details?.scope || project.type],...(details?.timeline?[['PROJECT TIMELINE',details.timeline]]:[]),...(details?.architect?[['ARCHITECT',details.architect]]:[]),['STATUS',status],['YEAR',project.year]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div></div>{details?.testimonial&&<Fade><section className="project-client-testimonial" aria-labelledby="project-testimonial-title"><div className="section-kicker">CLIENT TESTIMONIAL</div><h2 id="project-testimonial-title">WHAT OUR CLIENTS SAY.</h2><blockquote>{details.testimonial.quote}</blockquote><strong>{details.testimonial.author}</strong></section></Fade>}<Fade><section className="project-interest" aria-labelledby="project-interest-title"><div className="section-kicker">INTERESTED?</div><h2 id="project-interest-title">INTERESTED IN {project.name.toUpperCase()}?</h2><p>Get in touch with our team to learn more about this project, schedule a site visit, or discuss investment opportunities.</p><div className="project-interest-actions"><Btn href="#contact" light>GET IN TOUCH</Btn><a className="text-link" href={enquiry} target="_blank" rel="noopener noreferrer">WHATSAPP <ArrowUpRight size={17}/></a></div><a className="project-interest-back" href="#/projects"><ChevronLeft size={17}/> BACK TO ALL PROJECTS</a></section></Fade></article>
}
function CountUpStat({value}:{value:string}){
 const ref=useRef<HTMLElement>(null);
 const inView=useInView(ref,{once:true,amount:.6});
 const reduceMotion=useReducedMotion();
 const target=parseFloat(value);
 const suffix=value.replace(/^[\d.]+/,'');
 const decimals=(value.match(/\.(\d+)/)?.[1]||'').length;
 const [count,setCount]=useState(0);
 useEffect(()=>{
  if(!inView||reduceMotion)return;
  const controls=animate(0,target,{duration:1.8,ease:[.22,1,.36,1],onUpdate:setCount,onComplete:()=>setCount(target)});
  return()=>controls.stop();
 },[inView,reduceMotion,target]);
 return <strong ref={ref} aria-label={value}><span aria-hidden="true">{reduceMotion?value:count.toFixed(decimals)+suffix}</span></strong>;
}
function Metrics(){
 const stats=[
  {num:'100%',label:'LUXURY & CALM',desc:'Curated for the ultimate slow-living experience.',image:'/images/arihant-farms/gallery-4.webp',alt:'Poolside calm at Arihant Farms'},
  {num:'6+',label:'BESPOKE DESTINATIONS',desc:'Retreats across serene natural landscapes.',image:asset('vantara'),alt:'Uptown Vantara Farms surrounded by nature'},
  {num:'200+',label:'CURATED STAYS',desc:'Memorable escapes hosted and managed.',image:'/images/arihant-farms/gallery-6.webp',alt:'A welcoming bedroom at Arihant Farms'},
  {num:'2.5L+',label:'SQ. FT CURATED',desc:'Of premium architectural spaces.',image:asset('manmeet'),alt:'Architecture at Uptown Manmeet'}
 ];
 return <section className="metrics footprint section-pad" aria-labelledby="footprint-title"><div className="section-kicker">01 / OUR FOOTPRINT</div><Fade><h2 id="footprint-title">CURATING LUXURY<br/>ESCAPES, <em>BY THE NUMBERS.</em></h2></Fade><div className="footprint-grid">{stats.map((stat,index)=><Fade key={stat.label} delay={index*.08} className="footprint-card-wrap"><article className="footprint-card"><div className="footprint-photo"><img src={stat.image} alt={stat.alt} loading="lazy"/><span aria-hidden="true">0{index+1}</span></div><div className="footprint-stat"><CountUpStat value={stat.num}/><h3>{stat.label}</h3><p>{stat.desc}</p></div></article></Fade>)}</div></section>
}
function Process(){
 const reduceMotion=useReducedMotion();
 const timelineRef=useRef<HTMLDivElement>(null);
 const timelineVisible=useInView(timelineRef,{amount:.15});
 const steps=[
  {title:'CONSULTATION',desc:'Understanding your vision, requirements, and project scope through detailed discovery sessions.',Icon:MessagesSquare},
  {title:'PLANNING',desc:'Comprehensive project planning including design, budgeting, timelines, and regulatory mapping.',Icon:ClipboardList},
  {title:'PROCUREMENT',desc:'Strategic sourcing of premium materials and assembly of skilled construction teams.',Icon:Package},
  {title:'EXECUTION',desc:'Precision construction with rigorous quality control, safety standards, and milestone tracking.',Icon:HardHat},
  {title:'DELIVERY',desc:'Final inspection, finishing touches, documentation, and seamless project handover.',Icon:KeyRound}
 ];
 return <section className="process process-timeline section-pad" aria-labelledby="process-timeline-title">
  <div className="section-kicker dark">04 / HOW WE WORK</div>
  <div className="process-timeline-heading"><h2 id="process-timeline-title">Our <em>Process</em></h2><p>A PROVEN FRAMEWORK FOR EXCEPTIONAL DELIVERY.</p></div>
  <div ref={timelineRef} className={'process-timeline-scroll'+(timelineVisible?' timeline-is-visible':'')} role="region" aria-label="Our five-step process" tabIndex={0}>
   <div className="process-timeline-canvas"><div className="timeline-progress-decoration" aria-hidden="true"><motion.div className="timeline-progress-line" initial={false} animate={{scaleX:reduceMotion?1:timelineVisible?[0,1]:0}} transition={reduceMotion?{duration:0}:{duration:4,ease:'linear',repeat:timelineVisible?Infinity:0,repeatDelay:1}}/></div><ol className="process-timeline-track">
    {steps.map(({title,desc,Icon},index)=><li key={title} className={'timeline-step timeline-color-'+index+(index%2===0?' timeline-above':' timeline-below')}>
     <Fade className="timeline-step-copy" delay={index*.08}><Icon className="timeline-step-icon" size={34} strokeWidth={1.4} aria-hidden="true"/><span className="timeline-step-number">0{index+1}</span><h3>{title}</h3><p>{desc}</p></Fade>
     <div className="timeline-node" aria-hidden="true"><span/></div>
    </li>)}
   </ol></div>
  </div>
  <div className="process-timeline-foot"><span>FROM YOUR FIRST IDEA TO YOUR FINISHED SPACE.</span><span className="timeline-scroll-hint">SCROLL TO EXPLORE <ArrowRight size={14}/></span></div>
 </section>
}

function UptownAdvantage(){
 const advantages=[
  ['END-TO-END MANAGEMENT','Complete project lifecycle management from conceptualization to commissioning, with single-point accountability for every deliverable.'],
  ['EXPERIENCED TEAM','A seasoned team of architects, engineers, project managers, and consultants with deep industry expertise and a proven track record.'],
  ['QUALITY ASSURANCE','Rigorous quality control processes, premium material standards, and third-party auditing ensure every project meets exacting benchmarks.'],
  ['TRANSPARENT COMMUNICATION','Real-time project updates, milestone reporting, and open channels of communication so you are always informed and in control.'],
  ['VENDOR NETWORK','An extensive, vetted network of material suppliers, subcontractors, and specialists enabling competitive pricing and reliable sourcing.'],
  ['TIMELY DELIVERY','Disciplined scheduling, proactive risk management, and milestone-driven execution ensure every project is delivered on time.']
 ];
 return <section id="uptown-advantage" className="uptown-advantage section-pad" aria-labelledby="advantage-title"><Fade><div className="section-kicker">THE UPTOWN ADVANTAGE</div><h2 id="advantage-title">WHY DEVELOPERS &amp; LANDOWNERS<br/><em>TRUST UPTOWN PROJECTS.</em></h2></Fade><div className="advantage-grid">{advantages.map(([title,description],index)=><Fade key={title} delay={(index%3)*.08}><article className="advantage-item"><span className="advantage-number">0{index+1}</span><h3>{title}</h3><p>{description}</p></article></Fade>)}</div></section>
}
function Testimonials(){
 const [i,setI]=useState(0);
 const [direction,setDirection]=useState(1);
 const [focused,setFocused]=useState(false);
 const [tabVisible,setTabVisible]=useState(()=>!document.hidden);
 const section=useRef<HTMLElement>(null);
 const visible=useInView(section,{amount:.2});
 const reduceMotion=useReducedMotion();
 const move=(step:number)=>{setDirection(step);setI(value=>(value+step+testimonials.length)%testimonials.length)};
 const playing=visible&&tabVisible&&!focused&&!reduceMotion;
 useEffect(()=>{const update=()=>setTabVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 useEffect(()=>{if(!playing)return;const timer=window.setTimeout(()=>{setDirection(1);setI(value=>(value+1)%testimonials.length)},5000);return()=>window.clearTimeout(timer)},[playing,i]);
 return <div className="testimonial-frame"><section ref={section} id="testimonies" className="testimonials testimonial-retreat" aria-roledescription="carousel" aria-label="Guest and owner testimonials" onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setFocused(false)}} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}}}>
  <img className="testimonial-retreat-photo" src="/images/ubud/cover.webp" alt="Stone villa and pool at Ubud" loading="lazy"/>
  <div className="testimonial-retreat-shade" aria-hidden="true"/>
  <div className="section-kicker">TESTIMONIALS / WORDS FROM OUR GUESTS &amp; OWNERS</div>
  <div className="testimonial-carousel" aria-live={playing?'off':'polite'} aria-atomic="true"><AnimatePresence mode="wait" custom={direction} initial={false}><motion.div key={i} custom={direction} variants={{enter:(step:number)=>({opacity:0,x:reduceMotion?0:step*55}),center:{opacity:1,x:0},exit:(step:number)=>({opacity:0,x:reduceMotion?0:-step*55})}} initial="enter" animate="center" exit="exit" transition={{duration:reduceMotion?0:.5,ease:[.22,1,.36,1]}} className="retreat-quote" role="group" aria-roledescription="slide" aria-label={`${i+1} of ${testimonials.length}`} drag={reduceMotion?false:'x'} dragConstraints={{left:0,right:0}} dragElastic={.15} onDragEnd={(_,info)=>{if(info.offset.x < -45)move(1);else if(info.offset.x > 45)move(-1)}} style={{touchAction:'pan-y'}}><svg className="retreat-bubble" viewBox="0 0 670 390" preserveAspectRatio="none" aria-hidden="true"><path d="M 490 20 H 8 V 330 H 80 L 65 378 L 125 330 H 580 Q 655 330 655 255 V 125" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg><span className="retreat-quote-mark" aria-hidden="true">&#8220;</span><h2>{testimonials[i][1].toLowerCase()}</h2><blockquote>{testimonials[i][0].charAt(0)+testimonials[i][0].slice(1).toLowerCase()}</blockquote><cite><span>{testimonials[i][2]}</span><span>{testimonials[i][3]}</span></cite></motion.div></AnimatePresence></div>

 <div className="testimonial-pagination" aria-label="Choose a testimonial">{testimonials.map((_,index)=><button key={index} type="button" className={index===i?'selected':''} aria-label={`Show testimonial ${index+1}`} aria-current={index===i?'true':undefined} onClick={()=>{setDirection(index>=i?1:-1);setI(index)}}><span/></button>)}</div>
 </section></div>
}
function Contact(){
 const reduceMotion=useReducedMotion();
 const section=useRef<HTMLElement>(null);
 const {scrollYProgress}=useScroll({target:section,offset:['start start','end end']});
 const cardRise=useTransform(scrollYProgress,[.5,.9],['200%','0%'],{clamp:true});
 const introX=useTransform(scrollYProgress,[0,.45],['80%','0%'],{clamp:true});
 const officeX=useTransform(scrollYProgress,[0,.45],['-80%','0%'],{clamp:true});
 const [status,setStatus]=useState<'idle'|'submitting'|'success'|'error'>('idle');
 const [feedback,setFeedback]=useState('');
 const submitting=useRef(false);
 const submitEnquiry=async(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  if(submitting.current)return;
  const form=event.currentTarget;
  const data=new FormData(form);
  submitting.current=true;setStatus('submitting');setFeedback('Submitting your enquiry...');
  try {
   const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(data.entries()))});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error || 'We could not submit your enquiry. Please try again.');
   setStatus('success');setFeedback(result.message);form.reset();
  } catch(error) {setStatus('error');setFeedback(error instanceof Error && error.message !== 'Failed to fetch' ? error.message : 'Unable to connect. Please try again.');}
  finally {submitting.current=false;}
 };
 return <section ref={section} id="contact" className={'contact-invitation contact-scroll'+(reduceMotion?' is-static':'')} aria-labelledby="contact-invitation-title">
  <div className="contact-scroll-stage">
  <img className="invitation-photo" src="/images/arihant-farms/gallery-8.webp" alt="A welcoming Uptown living space at Arihant Farms" loading="lazy"/>
  <div className="invitation-shade" aria-hidden="true"/>
  <div className="contact-invitation-top"><span>07 / CONNECT WITH US</span><a href={wa} target="_blank" rel="noopener noreferrer">CHAT ON WHATSAPP <ArrowUpRight size={13}/></a></div>
  <div className="contact-scroll-grid">
  <motion.div className="contact-scroll-intro" style={{x:reduceMotion?0:introX}}><h2 id="contact-invitation-title">LET'S BUILD<br/><em>SOMETHING</em><br/>EXCEPTIONAL.</h2><p>Whether you are looking to acquire a premium farmhouse or villa, explore our services, or partner on architectural projects, we would love to connect. Our lifestyle concierge will respond within 24 hours.</p><a href={wa} target="_blank" rel="noopener noreferrer" className="contact-scroll-whatsapp"><MessageCircle size={17}/> CHAT ON WHATSAPP <ArrowUpRight size={15}/></a></motion.div>
  <motion.div className="contact-invitation-card" style={{y:reduceMotion?0:cardRise,opacity:1}} onFocusCapture={()=>{if(!window.matchMedia("(max-width:700px)").matches&&!reduceMotion&&section.current&&scrollYProgress.get()<.9){window.scrollTo({top:window.scrollY+section.current.getBoundingClientRect().top+(section.current.offsetHeight-window.innerHeight)*.95,behavior:'instant'})}}}>
   <span className="invitation-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h3>Find your<br/>exceptional space.</h3>
<form className="enquiry-form" onSubmit={submitEnquiry} aria-busy={status==='submitting'}><div className="form-header"><span>ENQUIRY FORM</span><ArrowUpRight/></div><label>FULL NAME *<input name="name" maxLength={120} required placeholder="Your full name"/></label><label>EMAIL *<input type="email" name="email" maxLength={254} required placeholder="you@example.com"/></label><label>PHONE<input type="tel" name="phone" maxLength={40} placeholder="+91 ..."/></label><label>INTEREST<select name="interest"><option>Acquiring a Villa</option><option>Farmhouse / Nature Retreat</option><option>Project Management</option><option>Turnkey Projects</option><option>Project Consultancy</option><option>Material Procurement</option><option>Landscape Design</option><option>Other Enquiry</option></select></label><label>MESSAGE<textarea name="message" maxLength={5000} rows={2} placeholder="Tell us what you're looking for..."/></label><button type="submit" className="form-submit" disabled={status==='submitting'}>{status==='submitting'?'SUBMITTING...':'SUBMIT ENQUIRY'} <ArrowUpRight size={18}/></button><small role={status==='error'?'alert':'status'} aria-live="polite">{feedback || 'Our lifestyle concierge will respond within 24 hours.'}</small></form>
  </motion.div>
  <motion.div className="contact-scroll-office" style={{x:reduceMotion?0:officeX}}><span>HEAD OFFICE</span><address>61, Old Income Tax Office Rd,<br/>Near Seven Beans Cafe, Vidya Nagar,<br/>Hubballi, Karnataka 580021</address><div className="contact-office-links"><a href="tel:+919742067751"><Phone size={15}/> +91 97420 67751</a><a href="mailto:vivekvinodladdha@gmail.com"><Mail size={15}/> vivekvinodladdha@gmail.com</a><a href="https://maps.google.com/?q=15.3646,75.1246" target="_blank" rel="noopener noreferrer"><MapPin size={15}/> OPEN IN MAPS <ArrowUpRight size={13}/></a></div></motion.div>
  </div>
  <div className="contact-invitation-bottom"><span>VIDYA NAGAR, HUBBALLI</span><a href="tel:+919742067751"><Phone size={12}/> +91 97420 67751</a><a href="mailto:vivekvinodladdha@gmail.com"><Mail size={12}/> EMAIL US</a></div>
  </div>
 </section>
}
function Footer(){
 const wordmark=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=wordmark.current;
  const text=node?.firstElementChild as HTMLSpanElement | null;
  if(!node || !text)return;
  const baseline=document.createElement('span');
  baseline.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';
  baseline.setAttribute('aria-hidden','true');
  text.appendChild(baseline);
  const context=document.createElement('canvas').getContext('2d');
  const alignBottom=()=>{
   if(!context)return;
   const style=getComputedStyle(text);
   context.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
   const descent=context.measureText('Uptown').actualBoundingBoxDescent;
   const space=node.getBoundingClientRect().bottom-baseline.getBoundingClientRect().top-descent;
   node.style.setProperty('--word-bottom-space',`${Math.max(0,space-1)}px`);
  };
  const observer=new ResizeObserver(alignBottom);
  observer.observe(node);
  alignBottom();
  document.fonts.ready.then(()=>{if(node.isConnected)alignBottom()});
  return()=>{observer.disconnect();baseline.remove()};
 },[]);
 return <footer className="footer-editorial">
  <div className="footer-editorial-top"><div className="footer-editorial-intro"><a className="footer-editorial-logo" href="#home" aria-label="Uptown Projects home"><img src="/images/logo.png" alt="Uptown Projects"/></a><p>Uptown brings architecture and nature together. Thoughtful villas, farmhouses and retreats for a slower, richer way of living.</p><a className="footer-call" href="#contact">LET’S TALK <ArrowUpRight size={13}/></a></div>
   <nav aria-label="Footer company links"><span>Company</span>{[['Home','#home'],['About us','#about'],['Services','#services'],['Testimonies','#testimonies'],['Contact','#contact']].map(([label,href])=><a key={label} href={href}>{label}</a>)}</nav>
   <nav aria-label="Footer project links"><span>Our spaces</span>{projects.slice(0,4).map(project=><a key={project.slug} href={'#/projects/'+project.slug}>{project.name}</a>)}<a href="#/projects">All projects <ArrowUpRight size={11}/></a></nav>
   <div className="footer-editorial-connect"><span>Connect</span><a href="tel:+919742067751"><Phone size={13} aria-hidden="true"/> +91 97420 67751</a><a href="mailto:vivekvinodladdha@gmail.com"><Mail size={13} aria-hidden="true"/> Email us <ArrowUpRight size={11}/></a><a href={wa} target="_blank" rel="noreferrer"><MessageCircle size={13} aria-hidden="true"/> WhatsApp <ArrowUpRight size={11}/></a><a href="https://instagram.com/uptown.projects" target="_blank" rel="noopener noreferrer" aria-label="Instagram: @uptown.projects"><Instagram size={13}/> @uptown.projects <ArrowUpRight size={11}/></a><span className="footer-editorial-address">Hubballi, Karnataka<br/>India</span></div>
  </div>
  <div className="footer-editorial-meta"><span>© 2026 Uptown Projects. All Rights Reserved.</span><a href="#home">Back to top ↑</a><a href="https://spitel.com" target="_blank" rel="noopener noreferrer">Powered by Spitel Pvt. Ltd.</a></div>
  <div ref={wordmark} className="footer-editorial-word" onPointerLeave={()=>wordmark.current?.classList.remove('is-lit')} onPointerMove={event=>{const node=wordmark.current;if(!node)return;node.classList.add('is-lit');const rect=node.getBoundingClientRect();node.style.setProperty('--spot-x',`${event.clientX-rect.left}px`);node.style.setProperty('--spot-y',`${event.clientY-rect.top}px`)}} aria-label="Uptown"><span aria-hidden="true">Uptow<span className="footer-final-letter">n</span></span><span className="footer-word-light" aria-hidden="true">Uptow<span className="footer-final-letter">n</span></span></div>
 </footer>
}
export default function App(){
 const [route,setRoute]=useState(()=>window.location.hash.slice(1));
 useEffect(()=>{const syncRoute=()=>setRoute(window.location.hash.slice(1));window.addEventListener('hashchange',syncRoute);return()=>window.removeEventListener('hashchange',syncRoute)},[]);
 useEffect(()=>{const project=route.startsWith('/projects/')?projects.find(p=>p.slug===route.split('/')[2]):null;document.title=project?project.name+' | Uptown Projects':route==='/projects'?'All Projects | Uptown Projects':'Uptown Projects | Luxury Spaces';const frame=requestAnimationFrame(()=>{if(route.startsWith('/'))window.scrollTo({top:0,behavior:'instant'});else if(route)document.getElementById(route)?.scrollIntoView()});return()=>cancelAnimationFrame(frame)},[route]);
 return <><Header/><main>{route==='/projects'?<><AllProjects/><ProjectsCTA/></>:route.startsWith('/projects/')?<ProjectDetails key={route} slug={route.split('/')[2]}/>:<><Hero/><Marquee/><Metrics/><About/><Services/><Process/><UptownAdvantage/><ProjectReveal/><Testimonials/><Contact/></>}</main><Footer/></>
}
