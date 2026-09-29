import { useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Flame, Plus } from 'lucide-react';
import { products, categories } from '../data/menu';
import { business } from '../data/config';
import { money, buildWhatsAppUrl } from '../utils/whatsapp';
import type { CategoryId, Product } from '../types/menu';
import { WhatsAppIcon } from './UI';

const showcase: { category: CategoryId; productId: string; label: string }[] = [
 {category:'tradicionais',productId:'tradicionais-calabresa',label:'Tradicionais'},
 {category:'premium',productId:'premium-americana',label:'Premium'},
 {category:'doces',productId:'doces-brigadeiro',label:'Doces'},
 {category:'xis',productId:'xis-bacon',label:'Xis'},
];

export function HeroExperience({onChoose,onNavigate}:{onChoose:(product:Product)=>void;onNavigate:(category:CategoryId)=>void}) {
 const [selected,setSelected]=useState(0);
 const reducedMotion=useReducedMotion();
 const current=showcase[selected];
 const product=products.find(item=>item.id===current.productId)!;
 const categoryName=categories.find(item=>item.id===current.category)!.name;
 const productCount=products.filter(item=>item.category===current.category).length;
 const price=product.category==='xis'?product.prices?.Regular:product.prices?.broto;
 const change=(next:number)=>setSelected((next+showcase.length)%showcase.length);
 const viewCategory=()=>{onNavigate(current.category);document.getElementById('cardapio')?.scrollIntoView({behavior:reducedMotion?'instant':'smooth'});};
 return <section id="inicio" className="hero hero-redesign">
  <div className="container hero-layout">
   <motion.div className="hero-copy" initial={{opacity:0,y:reducedMotion?0:18}} animate={{opacity:1,y:0}} transition={{duration:0.52}}>
    <div className="eyebrow"><span/>REI DAS PIZZAS <span className="eyebrow-rule" aria-hidden="true"/></div>
    <h1>Seu próximo <br/>pedido começa <br/><em>aqui.</em></h1>
    <p>Pizzas de forno a lenha. Escolha seus sabores, monte o pedido e envie pelo WhatsApp.</p>
    <div className="hero-actions">
     <a className="button primary" href="#cardapio">Ver cardápio<ArrowDown size={18}/></a>
     <a className="button outline" href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>Pedir pelo WhatsApp</a>
    </div>
    <div className="hero-bottomline"><Flame size={18}/><span>Forno a lenha</span><i aria-hidden="true"/><span>Monte do seu jeito</span></div>
   </motion.div>
   <motion.div className="hero-showcase" initial={{opacity:0,scale:reducedMotion?1:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.55,delay:0.1}}>
    <div className="showcase-visual" aria-hidden="true">
     <div className="showcase-grain"/>
     <div className="showcase-orbit orbit-one"/>
     <div className="showcase-orbit orbit-two"/>
     <div className="showcase-glow"/>
     <div className="showcase-embers">{Array.from({length:9},(_,i)=><span key={i} style={{left:`${10+i*9}%`,animationDuration:`${3+i*.25}s`,animationDelay:`${-i*.43}s`} as CSSProperties}/>)}</div>
     <div className="showcase-brand"><img src={business.logo} alt="" width="501" height="501"/></div>
     <span className="showcase-side">REI DAS PIZZAS • FORNO A LENHA</span>
    </div>
    <div className="showcase-content">
     <div className="showcase-kicker"><span>EXPLORE O CARDÁPIO</span><span>{String(selected+1).padStart(2,'0')} / {String(showcase.length).padStart(2,'0')}</span></div>
     <div aria-live="polite" aria-atomic="true">
     <AnimatePresence mode="wait">
      <motion.div key={current.productId} className="showcase-product" initial={{opacity:0,y:reducedMotion?0:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reducedMotion?0:-8}} transition={{duration:0.22}}>
       <span className="showcase-category">{categoryName} · {productCount} opções</span>
       <h2>{product.name}</h2>
       <p>{product.description || 'Escolha a versão e monte seu pedido.'}</p>
       <div className="showcase-product-bottom"><span>{price==null?'Valor a confirmar':product.category==='xis'?'Regular · '+money(price):'Broto · '+money(price)}</span><button type="button" className="showcase-add" onClick={()=>onChoose(product)} aria-label={'Montar pedido: '+product.name}><Plus size={17}/>Montar pedido</button></div>
      </motion.div>
     </AnimatePresence>
     </div>
     <div className="showcase-controls">
      <div className="showcase-tabs" role="group" aria-label="Explorar categorias">{showcase.map((item,index)=><button key={item.category} type="button" aria-pressed={selected===index} onClick={()=>change(index)}>{item.label}</button>)}</div>
      <div className="showcase-arrows"><button type="button" aria-label="Categoria anterior" onClick={()=>change(selected-1)}><ChevronLeft size={18}/></button><button type="button" aria-label="Próxima categoria" onClick={()=>change(selected+1)}><ChevronRight size={18}/></button></div>
     </div>
     <button type="button" className="showcase-view" onClick={viewCategory}>Ver {categoryName.toLowerCase()} <ArrowRight size={16}/></button>
    </div>
   </motion.div>
  </div>
 </section>;
}
