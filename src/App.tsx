
import {useState,useEffect,useRef} from 'react';
import {motion,AnimatePresence,useScroll,useTransform,useReducedMotion,useInView,animate,type MotionValue} from 'framer-motion';
import {Sun,House,Maximize,ArrowUpRight,ArrowRight,MapPin,Phone,Mail,MessageCircle,ChevronLeft,ChevronRight,Instagram,Check,MoveUpRight,MessagesSquare,ClipboardList,Package,HardHat,KeyRound} from 'lucide-react';
import './style.css';
import ProjectExperience from './ProjectExperience';
import ProcessShowcase from './ProcessShowcase';
import CustomCursor from './CustomCursor';
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
 const[detailLight,setDetailLight]=useState(false);
 const[logoVisible,setLogoVisible]=useState(()=>window.location.hash.startsWith('#/'));
 const menuButton=useRef<HTMLButtonElement>(null);
 const[scrolled,setScrolled]=useState(()=>window.location.hash.startsWith('#/'));
 useEffect(()=>{
  const update=()=>{const home=document.getElementById('home');const stage=document.querySelector('.hero-overlap-stage');const projectRoute=window.location.hash.startsWith('#/');setScrolled(projectRoute||!home||home.getBoundingClientRect().bottom<=82);const distance=Math.max(1,home?.getBoundingClientRect().height||window.innerHeight);const progress=stage?-stage.getBoundingClientRect().top/distance:1;setLogoVisible(projectRoute||!home||progress>=.75);setDetailLight(!!document.elementFromPoint(window.innerWidth/2,110)?.closest('.project-immersive-light'))};
  const onRoute=()=>{requestAnimationFrame(update)};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);window.addEventListener('hashchange',onRoute);
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);window.removeEventListener('hashchange',onRoute)};
 },[]);
 return <header className={'header '+(scrolled?'is-scrolled':'is-hero-menu')+(logoVisible?' logo-is-visible':'')+(detailLight?' is-detail-light':'')} onKeyDown={event=>{if(event.key==='Escape'&&menuOpen){setMenuOpen(false);menuButton.current?.focus()}}}>
  <a href="#home" className="brand" aria-hidden={!logoVisible} tabIndex={logoVisible?0:-1}><img src="/images/logo.png" alt="Uptown Projects"/></a>
  <button ref={menuButton} type="button" className={'mobile-menu-toggle'+(menuOpen?' is-open':'')} aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={()=>setMenuOpen(value=>!value)}><span/><span/><span/></button>
  <nav id="main-navigation" aria-label="Main navigation" className={'nav'+(menuOpen?' mobile-open':'')}>{[['Home','#home'],['About','#about'],['Projects','#projects'],['Services','#services'],['Testimonials','#testimonies']].map(([l,h])=><a key={l} href={h} onClick={()=>setMenuOpen(false)}>{l}</a>)}</nav>
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
 const [entering,setEntering]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&(!window.location.hash||window.location.hash==='#home')&&window.scrollY<80);
 const photos=['/images/gokulam/cover.webp','/images/ubud/cover.webp','/images/evara/cover.webp','/images/concept/cover.webp'];
 const [slide,setSlide]=useState(0);
 const section=useRef<HTMLDivElement>(null);
 const {scrollYProgress:exitProgress}=useScroll({target:section,offset:['start start','end end']});
 const exitShade=useTransform(exitProgress,[0,1],[0,.4]);
 const contentY=useTransform(exitProgress,value=>-value*(section.current?.clientHeight||window.innerHeight*2)/2);
 const imageY=useTransform(contentY,value=>value*.18);
 const loaded=useRef(new Set<number>());
 const visible=useInView(section,{amount:.15});
 useEffect(()=>{if(reduceMotion)setEntering(false)},[reduceMotion]);
 useEffect(()=>{
  if(entering||reduceMotion||!visible)return;
  const timer=window.setInterval(()=>{
   if(document.hidden)return;
   setSlide(current=>{for(let step=1;step<photos.length;step++){const next=(current+step)%photos.length;if(loaded.current.has(next))return next}return current});
  },5000);
  return()=>window.clearInterval(timer);
 },[entering,reduceMotion,visible,slide]);
 useEffect(()=>{
  if(!entering)return;
  const timer=window.setTimeout(()=>setEntering(false),4200);
  const finishOnScroll=()=>{if(window.scrollY>80)setEntering(false)};
  window.addEventListener('scroll',finishOnScroll,{passive:true});
  return()=>{window.clearTimeout(timer);window.removeEventListener('scroll',finishOnScroll)};
 },[entering]);
 return <div ref={section} className="hero-overlap-stage">
 <section id="home" className={'reference-home-hero'+(entering?' is-entering':'')} aria-labelledby="hero-title">
  <motion.div className="reference-home-media" style={{y:reduceMotion?0:imageY}}><div className="reference-home-slides" aria-hidden="true">{photos.map((src,index)=><img key={src} src={src} alt="" className={slide===index?'is-active':''} fetchPriority={index===0?'high':'auto'} decoding="async" onLoad={()=>loaded.current.add(index)}/>)}</div><div className="reference-home-wash"/></motion.div>
  <motion.div className="reference-home-wordmark" style={{y:reduceMotion?0:contentY}} aria-hidden="true"><span className="reference-home-first">UPTOWN</span><span className="reference-home-last">PROJECTS</span></motion.div>
  <motion.div className="reference-home-copy" style={{y:reduceMotion?0:contentY}}>
   <h1 id="hero-title">CRAFTING LUXURY SPACES.</h1>
   <p>Premium villas, luxury farmhouses, and nature retreats for slow living and peaceful escapes.</p>
   <div className="reference-home-actions"><a href="#projects">EXPLORE <ArrowUpRight size={15}/></a><a href="#contact">CONTACT <ArrowUpRight size={15}/></a></div>
  </motion.div>
  <motion.div className="reference-home-exit-shade" style={{opacity:reduceMotion?0:exitShade}} aria-hidden="true"/>
 </section>
 </div>
}
function HeroMeta(){return <div className="reference-home-meta"><a href="#/projects/arihant-farms"><span>FEATURED RESIDENCE</span><strong>Arihant Farms <ArrowUpRight size={12}/></strong></a><a href="#about">SCROLL TO DISCOVER <ArrowRight size={13}/></a><a href="#projects">HUBBALLI, KARNATAKA <ArrowUpRight size={13}/></a></div>}

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
function AboutRevealWord({word,index,total,progress,reduced}:{word:string;index:number;total:number;progress:MotionValue<number>;reduced:boolean}){
 const opacity=useTransform(progress,[index/total*.88,(index+1)/total*.88],[.18,1]);
 return <motion.span style={{opacity:reduced?1:opacity}}>{word}{' '}</motion.span>
}
function About(){
 const prose=useRef<HTMLDivElement>(null);
 const image=useRef<HTMLDivElement>(null);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress:reading}=useScroll({target:prose,offset:['start 85%','end 45%']});
 const {scrollYProgress:picture}=useScroll({target:image,offset:['start end','start 8%']});
 const width=useTransform(picture,[0,.95],['82%','100%']);
 const radius=useTransform(picture,[0,.95],[65,0]);
 const {scrollYProgress:photoExit}=useScroll({target:image,offset:['start start','end end']});
 const photoY=useTransform(photoExit,[0,1],[0,-100]);
 const photoShade=useTransform(photoExit,[0,1],[0,.3]);
 const description='Uptown Projects is a premier lifestyle, architectural, and staycation experience company. We design, build, and manage bespoke residential spaces, modern farmhouses, and nature retreats that bring architectural excellence and absolute calm to families seeking the ultimate slow-living escape.';
 const words=description.split(' ');
 return <section id="about" className="about-reading" aria-labelledby="about-reading-title">
  <div className="about-reading-top"><span>02 / ABOUT UPTOWN</span><h2 id="about-reading-title">UPTOWN PROJECTS</h2><a href="#contact">LET&#8217;S CONNECT <ArrowUpRight size={15}/></a></div>
  <div ref={prose} className="about-reading-prose"><span className="about-reading-label">WHERE NATURE MEETS LUXURY.</span><p><span className="about-reading-first-line">{words.slice(0,2).map((word,index)=><AboutRevealWord key={index} word={word} index={index} total={words.length} progress={reading} reduced={!!reduceMotion}/>)}</span>{words.slice(2).map((word,index)=><AboutRevealWord key={index+2} word={word} index={index+2} total={words.length} progress={reading} reduced={!!reduceMotion}/>)}</p></div>
  <div className="about-photo-overlap"><div ref={image} className="about-reading-image-track"><motion.figure className="about-reading-image" style={{width:reduceMotion?'100%':width,borderRadius:reduceMotion?0:radius,y:reduceMotion?0:photoY}}><img src="/images/arihant-farms/gallery-8.webp" alt="Thoughtfully designed living space at Arihant Farms" loading="lazy"/><motion.div className="about-reading-photo-shade" style={{opacity:reduceMotion?0:photoShade}} aria-hidden="true"/><figcaption><span>Arihant Farms</span><span>Living space</span></figcaption></motion.figure></div>
  <div className="about-photo-cover"><div className="about-reading-details"><div><span>OUR PHILOSOPHY</span><strong>100%</strong><span>CURATED EXCLUSIVITY</span></div><div className="about-reading-links"><a href="#contact">DISCOVER UPTOWN <ArrowUpRight size={16}/></a><span><MapPin size={15}/> HUBBALLI, KARNATAKA</span></div></div>
  <div className="about-reading-bottom"><span>ARCHITECTURE / NATURE / SLOW LIVING</span><span>SCROLL TO DISCOVER <ArrowRight size={13}/></span></div>
  </div></div>
 </section>
}

function FounderNote(){
 const portrait=useRef<HTMLDivElement>(null);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress}=useScroll({target:portrait,offset:['start end','start 15%']});
 const radius=useTransform(scrollYProgress,[0,.9],[150,0]);
 return <section id="founder" className="founder-reference" aria-labelledby="founder-note-title">
  <Fade className="founder-reference-heading"><span className="founder-reference-kicker">Founder's Note</span><h2 id="founder-note-title">Vivek Laddha</h2><p>Founder, Uptown Projects</p></Fade>
  <div className="founder-reference-grid">
   <Fade className="founder-reference-story">
    <blockquote><strong>At Uptown Projects, we aspire to build more than properties — we aim to create places people are proud to call their own.</strong></blockquote>
    <p>My entrepreneurial journey began in 2010 with the launch of my own coffee shop brand, Sevenbeans Cafe, driven by a passion for creating experiences and building something meaningful. Along the way, I was also a founding member of Laughing Tree Events, Hubli, where I gained valuable experience in bringing ideas to life and creating memorable experiences.</p>
    <p>Over time, my entrepreneurial interests led me towards real estate, where I explored distinctive concepts and niche developments, including Balinese Farms and Vantara Farms. These ventures helped shape my perspective on lifestyle-driven developments and inspired me to pursue real estate as my full-time passion.</p>
    <p>With Uptown Projects, my vision is to create exceptional weekend homes, thoughtfully planned residential communities, and well-designed commercial spaces. I believe that great developments should go beyond structures and spaces — they should offer lasting value, thoughtful design, and a lifestyle people aspire to experience.</p>
    <p>As we move forward, our focus remains on creating distinctive projects that combine quality, functionality, and a strong sense of identity.</p>
   </Fade>
   <div ref={portrait} className="founder-reference-portrait"><motion.figure style={{borderTopLeftRadius:reduceMotion?0:radius,borderTopRightRadius:reduceMotion?0:radius}}><img src="/images/vivek%20laddha%20founder.png" alt="Vivek Laddha, Founder of Uptown Projects" width={1086} height={1448} loading="lazy" decoding="async"/></motion.figure></div>
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
 return <section id="projects" className="project-editorial" aria-labelledby="project-reveal-title">
  <div className="project-editorial-heading"><div><span>05 / OUR COLLECTION</span><p>BESPOKE SPACES &amp; PREMIUM RETREATS</p></div><h2 id="project-reveal-title">Projects</h2></div>
  <div className="project-editorial-grid">{[0,1].map(column=><div className="project-editorial-column" key={column}>{projects.map((project,index)=>index%2===column?<Fade key={project.slug} className={'project-editorial-card project-editorial-shape-'+index%4}>
   <a href={'#/projects/'+project.slug}>
    <div className="project-editorial-photo"><img src={asset(project.slug)} alt={project.name} loading="lazy"/><span className="project-editorial-open"><ArrowUpRight size={22}/></span></div>
    <div className="project-editorial-caption"><div><h3>{project.name}</h3><p>{project.place}</p></div><div className="project-editorial-facts"><span>{project.type}</span><span>{project.status}</span><span>{project.year}</span></div></div>
   </a>
  </Fade>:null)}</div>)}</div>
  <div className="project-editorial-bottom"><div><h3>Spaces to slow down. Places to feel at home.</h3><p>Browse our completed architectural achievements, ongoing private villa developments, and upcoming boutique nature staycations designed with meticulous care.</p></div><a href="#/projects">VIEW ALL PROJECTS <ArrowUpRight size={16}/></a></div>
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
function ProjectDetails({slug}:{slug:string}){return <ProjectExperience slug={slug} projects={projects}/>}

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
 const reduceMotion=useReducedMotion();
 return <section id="footprint" className="footprint-glass" aria-labelledby="footprint-title">
  <img className="footprint-glass-background" src="/images/arihant-farms/cover.webp" alt="Arihant Farms set within a lush natural landscape" loading="lazy"/>
  <div className="footprint-glass-shade" aria-hidden="true"/>
  <div className="footprint-glass-intro"><span className="footprint-glass-kicker">01 / OUR FOOTPRINT</span><h2 id="footprint-title">Curating luxury escapes.<br/>By the numbers.</h2><p>Luxury &amp; calm<br/>Bespoke destinations<br/>Spaces that inspire</p><a href="#/projects">EXPLORE OUR PROJECTS <ArrowRight size={16}/></a></div>
  <div className="footprint-glass-grid">{stats.map((stat,index)=><motion.article key={stat.label} className="footprint-glass-card" initial={reduceMotion?false:{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:reduceMotion?0:.65,delay:reduceMotion?0:index*.1,ease:[.22,1,.36,1]}}>
   <CountUpStat value={stat.num}/><div className="footprint-glass-card-copy"><h3>{stat.label}</h3><p>{stat.desc}</p></div>
  </motion.article>)}</div>
 </section>
}

function Process(){return <ProcessShowcase/>}

function UptownAdvantage(){
 const advantages=[
  ['END-TO-END MANAGEMENT','Complete project lifecycle management from conceptualization to commissioning, with single-point accountability for every deliverable.'],
  ['EXPERIENCED TEAM','A seasoned team of architects, engineers, project managers, and consultants with deep industry expertise and a proven track record.'],
  ['QUALITY ASSURANCE','Rigorous quality control processes, premium material standards, and third-party auditing ensure every project meets exacting benchmarks.'],
  ['TRANSPARENT COMMUNICATION','Real-time project updates, milestone reporting, and open channels of communication so you are always informed and in control.'],
  ['VENDOR NETWORK','An extensive, vetted network of material suppliers, subcontractors, and specialists enabling competitive pricing and reliable sourcing.'],
  ['TIMELY DELIVERY','Disciplined scheduling, proactive risk management, and milestone-driven execution ensure every project is delivered on time.']
 ];
 const icons=[ClipboardList,House,Check,MessagesSquare,Package,KeyRound];
 return <section id="uptown-advantage" className="advantage-cards-section" aria-labelledby="advantage-title">
  <div className="advantage-cards-heading"><span>THE UPTOWN ADVANTAGE</span><h2 id="advantage-title">Why developers &amp; landowners<br/><em>trust Uptown Projects.</em></h2><p>Thoughtful planning &middot; Uncompromising quality &middot; Complete peace of mind</p></div>
  <div className="advantage-cards-grid">{advantages.map(([title,description],index)=>{const Icon=icons[index];return <article className="advantage-fold-card" key={title}>
   <span className="advantage-fold-number" aria-hidden="true">{index+1}</span><div className="advantage-fold-body"><Icon size={25} strokeWidth={1.5} aria-hidden="true"/><h3>{title}</h3><p>{description}</p></div>
  </article>})}</div>
  <div className="advantage-cards-footer"><a className="reference-link" href="#contact">LET US BUILD TOGETHER <ArrowRight size={16}/></a></div>
 </section>
}
function Testimonials(){
 const heading=useRef<HTMLDivElement>(null);
 const section=useRef<HTMLElement>(null);
 const visible=useInView(section,{amount:.1});
 const [focused,setFocused]=useState(false),[tabVisible,setTabVisible]=useState(()=>!document.hidden);
 const reduceMotion=useReducedMotion();
 const {scrollYProgress}=useScroll({target:heading,offset:['start end','start 30%']});
 const titleX=useTransform(scrollYProgress,[0,1],['0vw','-30vw']);
 useEffect(()=>{const update=()=>setTabVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 const playing=visible&&tabVisible&&!focused&&!reduceMotion;
 return <section ref={section} id="testimonies" className={'reviews-marquee reviews-scroll-reveal'+(playing?' reviews-cards-running':'')} aria-labelledby="reviews-marquee-title">
  <div ref={heading} className="reviews-title-window" aria-hidden="true"><motion.div className="reviews-title-track" style={{x:reduceMotion?0:titleX}}><div className="reviews-title-group">{Array.from({length:8},(_,index)=><span key={index}>Testimonials</span>)}</div></motion.div></div>
  <h2 id="reviews-marquee-title">TESTIMONIALS / WORDS FROM OUR GUESTS &amp; OWNERS</h2>
  <div className="reviews-card-window" tabIndex={0} role="region" aria-label="Guest and owner reviews" onFocusCapture={event=>{if(event.target.matches(':focus-visible'))setFocused(true)}} onBlurCapture={()=>setFocused(false)}><div className="reviews-card-track">{[0,1].map(group=><div className="reviews-card-group" key={group} aria-hidden={group===1?true:undefined}>{testimonials.map(([quote,name,role,location],index)=>{
   const text=quote.charAt(0)+quote.slice(1).toLowerCase();
   const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];
   return <motion.article key={name} className={'reviews-card reviews-card-'+index} initial={reduceMotion?false:'hidden'} whileInView="revealed" viewport={{once:true,amount:.15}} variants={{hidden:{opacity:0,y:25},revealed:{opacity:1,y:0}}} transition={{duration:reduceMotion?0:.7,ease:[.22,1,.36,1]}}>
    <div className="reviews-card-top"><span aria-hidden="true">&#8220;</span><span>{String(index+1).padStart(2,'0')} / {String(testimonials.length).padStart(2,'0')}</span></div>
    <motion.blockquote variants={{hidden:{clipPath:'inset(0% 0% 100% 0%)',opacity:.2},revealed:{clipPath:'inset(0% 0% 0% 0%)',opacity:1}}} transition={{duration:reduceMotion?0:1.2,delay:reduceMotion?0:.1,ease:[.22,1,.36,1]}}>{sentences.map((sentence,sentenceIndex)=><motion.span key={sentenceIndex} variants={{hidden:{opacity:0},revealed:{opacity:1}}} transition={{duration:reduceMotion?0:.5,delay:reduceMotion?0:.15+sentenceIndex*.18}}>{sentence.trim()}{sentenceIndex<sentences.length-1?' ':''}</motion.span>)}</motion.blockquote>
    <motion.div className="reviews-card-author" variants={{hidden:{opacity:0,y:8},revealed:{opacity:1,y:0}}} transition={{duration:reduceMotion?0:.5,delay:reduceMotion?0:.7}}><span className="reviews-avatar" aria-hidden="true">{name.split(' ').map(word=>word[0]).slice(0,2).join('')}</span><div><h3>{name.toLowerCase()}</h3><p>{role}</p><span>{location}</span></div></motion.div>
   </motion.article>
  })}</div>)}</div></div>
 </section>
}

function Contact(){
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
 return <section id="contact" className="contact-framed" aria-labelledby="contact-invitation-title">
  <div className="contact-framed-backdrop" aria-hidden="true"/>
  <div className="contact-framed-sheet">
   <div className="contact-framed-photo"><img src="/images/arihant-farms/gallery-8.webp" alt="A welcoming Uptown living space at Arihant Farms" loading="lazy"/></div>
   <div className="contact-framed-panel">
    <div className="contact-framed-address"><span>HEAD OFFICE</span><address>61, Old Income Tax Office Rd,<br/>Near Seven Beans Cafe, Vidya Nagar,<br/>Hubballi, Karnataka 580021</address><a href="tel:+919742067751">+91 97420 67751</a><a href="mailto:vivekvinodladdha@gmail.com">vivekvinodladdha@gmail.com</a><a href="https://maps.google.com/?q=15.3646,75.1246" target="_blank" rel="noopener noreferrer">OPEN IN MAPS <ArrowUpRight size={10}/></a></div>
    <div className="contact-framed-content"><span className="contact-framed-kicker">LET'S BUILD SOMETHING EXCEPTIONAL.</span><h2 id="contact-invitation-title">Contact</h2><p className="contact-framed-description">Whether you are looking to acquire a premium farmhouse or villa, explore our services, or partner on architectural projects, we would love to connect.</p>
<form className="enquiry-form" onSubmit={submitEnquiry} aria-busy={status==='submitting'}><label>FULL NAME *<input name="name" maxLength={120} required placeholder="Your full name"/></label><label>EMAIL *<input type="email" name="email" maxLength={254} required placeholder="you@example.com"/></label><label>PHONE<input type="tel" name="phone" maxLength={40} placeholder="+91 ..."/></label><label>INTEREST<select name="interest"><option>Acquiring a Villa</option><option>Farmhouse / Nature Retreat</option><option>Project Management</option><option>Turnkey Projects</option><option>Project Consultancy</option><option>Material Procurement</option><option>Landscape Design</option><option>Other Enquiry</option></select></label><label>MESSAGE<textarea name="message" maxLength={5000} rows={2} placeholder="Tell us what you're looking for..."/></label><button type="submit" className="form-submit" disabled={status==='submitting'}>{status==='submitting'?'SUBMITTING...':'SUBMIT ENQUIRY'} <ArrowUpRight size={18}/></button><small role={status==='error'?'alert':'status'} aria-live="polite">{feedback || 'Our lifestyle concierge will respond within 24 hours.'}</small></form>
    <a className="contact-framed-whatsapp" href={wa} target="_blank" rel="noopener noreferrer">CHAT ON WHATSAPP <ArrowUpRight size={11}/></a>
    </div>
   </div>
  </div>
 </section>;
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
function IntroVideo({onComplete}:{onComplete:()=>void}){
 const reduceMotion=useReducedMotion();
 useEffect(()=>{
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const timer=window.setTimeout(onComplete,reduceMotion?1200:4300);
  return()=>{window.clearTimeout(timer);document.body.style.overflow=previous};
 },[onComplete,reduceMotion]);
 const columns=8,rows=3;
 return <motion.div className="intro-video-screen" role="region" aria-label="Welcome to Uptown Projects" initial={{opacity:1}} animate={{opacity:1}}>
  <div className="intro-logo-assembly" role="img" aria-label="Uptown Projects">
   {Array.from({length:columns*rows},(_,index)=>{
    const col=index%columns,row=Math.floor(index/columns);
    const dx=(col-(columns-1)/2)*42;
    const dy=(row-1)*100+(col%2===0?-50:50);
    return <motion.span className="intro-logo-piece" key={index} aria-hidden="true" style={{clipPath:`inset(${row/rows*100}% ${(columns-col-1)/columns*100}% ${(rows-row-1)/rows*100}% ${col/columns*100}%)`}} initial={reduceMotion?false:{opacity:0,x:dx,y:dy,rotate:(index%2===0?-1:1)*(12+col*3),scale:.8}} animate={{opacity:1,x:0,y:0,rotate:0,scale:1}} transition={{duration:reduceMotion?0:1.15,delay:reduceMotion?0:.2+col*.105+row*.17,ease:[.22,1,.36,1]}}><img src="/images/logo.png" alt="" onError={onComplete}/></motion.span>
   })}
  </div>
  <button className="intro-video-skip" onClick={onComplete}>SKIP INTRO <ArrowRight size={16}/></button>
 </motion.div>
}
export default function App(){
 const [route,setRoute]=useState(()=>window.location.hash.slice(1));
 useEffect(()=>{const syncRoute=()=>setRoute(window.location.hash.slice(1));window.addEventListener('hashchange',syncRoute);return()=>window.removeEventListener('hashchange',syncRoute)},[]);
 useEffect(()=>{const project=route.startsWith('/projects/')?projects.find(p=>p.slug===route.split('/')[2]):null;document.title=project?project.name+' | Uptown Projects':route==='/projects'?'All Projects | Uptown Projects':'Uptown Projects | Luxury Spaces';const frame=requestAnimationFrame(()=>{if(route.startsWith('/'))window.scrollTo({top:0,behavior:'instant'});else if(route)document.getElementById(route)?.scrollIntoView()});return()=>cancelAnimationFrame(frame)},[route]);
 return <><CustomCursor/><Header/><main>{route==='/projects'?<><AllProjects/><ProjectsCTA/></>:route.startsWith('/projects/')?<ProjectDetails key={route} slug={route.split('/')[2]}/>:<div className="home-overlap"><Hero/><div className="home-overlap-content"><About/><FounderNote/><HeroMeta/><Metrics/><Services/><Process/><UptownAdvantage/><ProjectReveal/><Testimonials/><Contact/></div></div>}</main><Footer/></>
}

