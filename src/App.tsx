import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Search, ShoppingBag, Plus, Instagram, Menu, X, Check, Info } from 'lucide-react';
import { categories, products, pizzaSizes, calzoneSizes, savoryNote, normalize } from './data/menu';
import { business } from './data/config';
import { money, buildWhatsAppUrl, orderTotal } from './utils/whatsapp';
import type { CategoryId, Product, OrderItem } from './types/menu';
import { Brand, WhatsAppIcon } from './components/UI';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import { HeroExperience } from './components/HeroExperience';
export default function App() {
 const [category,setCategory]=useState<CategoryId>('tradicionais');
 const [query,setQuery]=useState('');
 const [product,setProduct]=useState<Product|null>(null);
 const [items,setItems]=useState<OrderItem[]>([]);
 const [cartOpen,setCartOpen]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const [announcement,setAnnouncement]=useState('');
 useEffect(()=>{if(!announcement)return;const timer=window.setTimeout(()=>setAnnouncement(''),4000);return ()=>window.clearTimeout(timer);},[announcement]);
 const count=items.reduce((sum,item)=>sum+item.quantity,0);
 const total=orderTotal(items);
 const searchQuery=normalize(query.trim());
 const filtered=products.filter(p=>p.available!==false&&(searchQuery?normalize(p.name).includes(searchQuery):p.category===category));
 const title=searchQuery?'Resultados da busca':categories.find(c=>c.id===category)!.name;
 const chooseCategory=(id:CategoryId)=>{setCategory(id);setQuery('');};
 const wa=buildWhatsAppUrl();
 return <>
 <a className="skip-link" href="#cardapio">Ir para o cardápio</a>
 <header className="site-header"><div className="container header-inner"><a href="#inicio" className="brand" aria-label="Rei das Pizzas — início"><Brand/></a><nav className={'main-nav '+(menuOpen?'open':'')} aria-label="Navegação principal"><a href="#cardapio" onClick={()=>setMenuOpen(false)}>Cardápio</a><a href="#tamanhos" onClick={()=>setMenuOpen(false)}>Tamanhos</a><a href="#contato" onClick={()=>setMenuOpen(false)}>Contato</a></nav><div className="header-actions"><button className="button cart-trigger" onClick={()=>setCartOpen(true)}><ShoppingBag size={18}/><span className="desktop-label">Ver pedido</span><motion.span className="count" key={count} initial={{scale:0.7}} animate={{scale:1}} transition={{type:"spring",stiffness:400,damping:15}}>{count}</motion.span></button><button className="icon-button mobile-menu" aria-label={menuOpen?'Fechar menu':'Abrir menu'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div></div></header>
 <main>
 <HeroExperience onChoose={setProduct} onNavigate={chooseCategory}/>
 <div className="steps-strip"><div className="container steps"><span><b>01</b> Escolha no cardápio</span><ArrowRight/><span><b>02</b> Monte seu pedido</span><ArrowRight/><span><b>03</b> Finalize pelo WhatsApp</span></div></div>
 <section className="section container" id="cardapio"><div className="section-heading"><div><span className="eyebrow">DO SEU JEITO</span><h2>O que vai ser hoje?</h2></div><p>Encontre seu sabor.<br/>A gente conversa pelo WhatsApp.</p></div>
 <label className="search"><Search size={21}/><input type="search" placeholder="Buscar pelo nome do produto…" aria-label="Buscar produto por nome" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button className="icon-button" aria-label="Limpar busca" onClick={()=>setQuery('')}><X size={18}/></button>}</label>
 <nav className="category-nav" aria-label="Categorias do cardápio">{categories.map(c=><button key={c.id} aria-pressed={!searchQuery&&category===c.id} className={!searchQuery&&category===c.id?'active':''} onClick={()=>chooseCategory(c.id)}>{c.name}</button>)}</nav>
 <div className="menu-heading"><h3>{title}</h3><span>{filtered.length} {filtered.length===1?'opção':'opções'}</span></div>
 {(!searchQuery&&(category==='tradicionais'||category==='premium')||searchQuery)&&<p className="category-note"><Info size={17}/>{savoryNote}</p>}
 {!searchQuery&&category==='calzones'&&<p className="category-note">Todos os sabores de pizza também estão disponíveis como calzones. {calzoneSizes.map(s=>s.name+': '+s.slices+' fatias · até '+s.maxFlavors+' sabores · '+money(s.price!)).join('. ')}.</p>}
 {!searchQuery&&category==='bordas'&&<p className="category-note">4 opções salgadas e 4 doces. A borda é adicionada durante a montagem de uma pizza.</p>}
 <div className="product-grid">{filtered.map((p,index)=><motion.article className="product-card" key={p.id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}} transition={{duration:0.32,delay:(index%3)*0.04}} whileHover={{y:-4}}><div className="product-top"><span className="product-number">{String(index+1).padStart(2,'0')}</span><span className="product-category">{categories.find(c=>c.id===p.category)?.name}</span></div><h4>{p.name}</h4>{p.description&&<p className="ingredients">{p.description}.</p>}<div className="product-bottom"><div className="product-price">{p.category==='xis'?<><span>Regular <b>{p.prices?.Regular==null?'A confirmar':money(p.prices.Regular)}</b></span><span>Calota <b>{money(p.prices!.Calota!)}</b></span></>:p.category==='calzones'?<>{calzoneSizes.map(s=><span key={s.id}>{s.name} <b>{money(s.price!)}</b></span>)}</>:p.category==='bebidas'?<b>{money(p.prices!.Unidade!)}</b>:<span className={p.category==='bordas'?'border-price-list':undefined}>{p.category==='bordas'?pizzaSizes.map(s=><span key={s.id}>{s.name}: {p.prices?.[s.id]==null?'a confirmar':money(p.prices[s.id]!)}</span>):p.prices?'Consulte os preços por tamanho':'Valor a confirmar pelo WhatsApp'}</span>}</div>{p.category==='bordas'?<button className="add-product" onClick={()=>{chooseCategory('tradicionais');document.getElementById('cardapio')?.scrollIntoView({behavior:'smooth'});}} aria-label={'Escolher pizza para '+p.name}><ArrowRight size={19}/><span>Escolher pizza</span></button>:<button className="add-product" onClick={()=>setProduct(p)} aria-label={'Adicionar ao pedido: '+p.name}><Plus size={19}/><span>Adicionar</span></button>}</div></motion.article>)}</div>
 {filtered.length===0&&<div className="empty"><Search size={32}/><h3>Nenhum produto encontrado</h3><p className="muted">Tente outro nome ou escolha uma categoria.</p><button className="button outline" onClick={()=>setQuery('')}>Limpar busca</button></div>}
 <p className="menu-help"><Info size={16}/>Sabores mistos: média proporcional em partes iguais. Valores pendentes serão confirmados no atendimento.</p>
 </section>
 <section id="tamanhos" className="sizes-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">ESCOLHA O TAMANHO</span><h2>Seu pedido, na medida.</h2></div><p>Uma pizza, seus sabores.</p></div><div className="size-guide">{pizzaSizes.map((s,i)=><article key={s.id}><div className="size-illustration" aria-hidden="true"><motion.span initial={{rotate:-25,scale:0.8}} whileInView={{rotate:0,scale:1}} viewport={{once:true}} transition={{type:"spring",stiffness:100,damping:14,delay:i*0.08}} whileHover={{rotate:15,scale:1.06}} style={{width:58+i*15,height:58+i*15}}/></div><h3>{s.name}</h3><p>{s.diameter} cm <span>·</span> {s.slices} fatias</p><p>Até {s.maxFlavors} {s.maxFlavors===1?'sabor':'sabores'}</p><strong>{money(s.range![0])} a {money(s.range![1])}</strong></article>)}</div><p className="size-note">O valor varia conforme a escolha dos sabores: tradicionais ou Premium.</p><p className="muted small centered">Monte a pizza para ver o preço dos sabores, da borda e das bebidas. Valores pendentes serão confirmados pelo WhatsApp.</p><details className="calzone-guide"><summary>Tamanhos dos calzones</summary><div>{calzoneSizes.map(s=><p key={s.id}><strong>{s.name}</strong> · {s.slices} fatias · Até {s.maxFlavors} sabores · {money(s.price!)}</p>)}</div></details></div></section>
 <section id="contato" className="section container contact"><div><span className="eyebrow">VAMOS CONVERSAR?</span><h2>Seu pedido.<br/><em>Nosso WhatsApp.</em></h2><p className="muted">Confirme os valores e combine os detalhes do pedido<br className="desktop-label"/> diretamente com a Rei das Pizzas.</p><a className="button primary" href={wa} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>Pedir pelo WhatsApp<ArrowUpRight size={18}/></a></div><div className="contact-links"><a href={wa} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={28}/><div><span>WHATSAPP</span><strong>{business.phone}</strong></div><ArrowUpRight size={20}/></a><a href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={28}/><div><span>INSTAGRAM</span><strong>{business.instagram}</strong></div><ArrowUpRight size={20}/></a></div></section>
 </main>
 <footer><div className="container footer-main"><a href="#inicio" className="brand" aria-label="Rei das Pizzas — início"><Brand/></a><p>Pizzas de forno a lenha.<br/>Seu próximo pedido começa aqui.</p><nav aria-label="Navegação do rodapé"><a href="#cardapio">Cardápio</a><a href="#tamanhos">Tamanhos</a><a href="#contato">Contato</a></nav><a href={wa} className="footer-cta" target="_blank" rel="noopener noreferrer">Pedir pelo WhatsApp<ArrowUpRight size={18}/></a></div><div className="container footer-bottom"><span>Rei das Pizzas</span><a href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={15}/>{business.instagram}</a></div></footer>
 <a className={'floating-whatsapp '+(count?'with-cart':'')} href={wa} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Rei das Pizzas pelo WhatsApp" title="Pedir pelo WhatsApp"><WhatsAppIcon size={27}/></a>
 {count>0&&<button className="mobile-cart" onClick={()=>setCartOpen(true)}><ShoppingBag size={20}/><strong>Ver pedido <span>({count})</span></strong><span>{total===null?'Confirmar valor':money(total)}</span><ArrowRight size={18}/></button>}
 <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
 {announcement&&<div className="toast" aria-hidden="true"><Check size={17}/>{announcement}<button className="icon-button" onClick={()=>setAnnouncement('')} aria-label="Fechar aviso"><X size={16}/></button></div>}
 {product&&<ProductModal key={product.id} product={product} onClose={()=>setProduct(null)} onAdd={item=>{setItems(current=>[...current,item]);setAnnouncement(item.name+' adicionado ao pedido');}}/>}
 {cartOpen&&<Cart items={items} onChange={setItems} onClose={()=>setCartOpen(false)}/>}
 </>;
}
