import { useEffect, useRef, type ReactNode } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { business } from '../data/config';
export function Brand() { return business.logo ? <span className="brand-lockup"><img className="brand-image" src={business.logo} alt="Rei das Pizzas" width="501" height="501"/></span> : <span className="brand-text">Rei das <em>Pizzas</em></span>; }
export function WhatsAppIcon({size=20}:{size?:number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z"/><path d="m8.2 7.5 1.4 2.6-1 1.1c.8 1.7 2 2.9 3.9 3.6l1.1-1.2 2.8 1.3c-.2 1.6-1.5 2.2-2.8 1.8-3.8-1-6.7-3.9-7.1-6.5-.2-1.3.4-2.3 1.7-2.7Z"/></svg>; }
export function Dialog({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const before=document.activeElement as HTMLElement | null;
  const dialog=ref.current!; dialog.showModal();
  const overflow=document.body.style.overflow; document.body.style.overflow='hidden';
  return ()=>{dialog.close();document.body.style.overflow=overflow;before?.focus();};
 },[]);
 return <dialog ref={ref} className={wide?'modal modal-wide':'modal'} aria-labelledby="dialog-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
 <motion.div className="modal-inner" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><header className="modal-header"><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label="Fechar" onClick={onClose}><X/></button></header>{children}</motion.div></dialog>;
}
export function Quantity({value,onChange,label}:{value:number;onChange:(n:number)=>void;label:string}) {
 return <div className="quantity"><button type="button" disabled={value<=1} aria-label={'Diminuir quantidade de '+label} onClick={()=>onChange(value-1)}><Minus size={16}/></button><output aria-label={'Quantidade de '+label}>{value}</output><button type="button" aria-label={'Aumentar quantidade de '+label} onClick={()=>onChange(value+1)}><Plus size={16}/></button></div>;
}
