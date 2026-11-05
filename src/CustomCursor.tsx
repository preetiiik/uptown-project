import {useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import './custom-cursor.css';

export default function CustomCursor(){
 const cursor=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=cursor.current;if(!node)return;
  let x=0,y=0,ringX=0,ringY=0,seen=false,frame=0;
  const ring=node.querySelector<HTMLDivElement>('.uptown-cursor-ring');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render=()=>{frame=0;const target=document.elementFromPoint(x,y);const editing=!!target?.closest('input,textarea,select,[contenteditable="true"]');node.classList.toggle('is-visible',seen&&!editing);node.classList.toggle('is-project',!!target?.closest('a[href^="#/projects/"]'));node.classList.toggle('is-interactive',!!target?.closest('a,button,summary,[role="button"]'));node.style.transform=`translate3d(${x}px,${y}px,0)`;ringX+=(x-ringX)*(reduced?1:.16);ringY+=(y-ringY)*(reduced?1:.16);if(ring)ring.style.transform=`translate3d(${ringX-x}px,${ringY-y}px,0)`;if(seen&&(Math.abs(x-ringX)>.1||Math.abs(y-ringY)>.1))update()};
  const update=()=>{if(!frame)frame=requestAnimationFrame(render)};
  const hide=()=>{seen=false;node.classList.remove('is-visible');document.documentElement.classList.remove('has-custom-cursor')};
  const move=(event:PointerEvent)=>{if(event.pointerType==='touch'){hide();return}x=event.clientX;y=event.clientY;if(!seen){ringX=x;ringY=y}seen=true;document.documentElement.classList.add('has-custom-cursor');update()};
  const touch=(event:PointerEvent)=>{if(event.pointerType==='touch')hide()};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',touch,{passive:true});window.addEventListener('scroll',update,{passive:true});window.addEventListener('blur',hide);document.addEventListener('pointerleave',hide);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',touch);window.removeEventListener('scroll',update);window.removeEventListener('blur',hide);document.removeEventListener('pointerleave',hide);document.documentElement.classList.remove('has-custom-cursor')};
 },[]);
 return createPortal(<div ref={cursor} className="uptown-cursor" aria-hidden="true"><div className="uptown-cursor-ring"/><div className="uptown-cursor-shape"><span className="uptown-cursor-label">View Project <span className="uptown-cursor-arrow">&#8599;</span></span></div></div>,document.body);
}
