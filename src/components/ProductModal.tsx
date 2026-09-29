import { useState } from 'react';
import { business } from '../data/config';
import { Plus, Search, Check, Info } from 'lucide-react';
import { borders, drinks, pizzas, categories, normalize, pizzaSizes, calzoneSizes } from '../data/menu';
import type { Product, OrderItem } from '../types/menu';
import { pizzaPrice, withBorder } from '../utils/pricing';
import { money } from '../utils/whatsapp';
import { Dialog, Quantity } from './UI';
export default function ProductModal({product,onClose,onAdd}:{product:Product;onClose:()=>void;onAdd:(item:OrderItem)=>void}) {
 const isCalzone=product.category==='calzones';
 const isPizza=['tradicionais','premium','doces','doces-premium'].includes(product.category);
 const customizable=isPizza || isCalzone;
 const sizes=isCalzone?calzoneSizes:pizzaSizes;
 const [sizeId,setSizeId]=useState(sizes[0].id);
 const [variant,setVariant]=useState('Regular');
 const initialFlavor=isCalzone?product.id.replace('calzone-',''):product.id;
 const [selected,setSelected]=useState<string[]>(customizable?[initialFlavor]:[]);
 const [border,setBorder]=useState('');
 const [quantity,setQuantity]=useState(1);
 const [drinkQuantities,setDrinkQuantities]=useState<Record<string,number>>({});
 const [query,setQuery]=useState('');
 const [flavorCategory,setFlavorCategory]=useState('all');
 const size=sizes.find(s=>s.id===sizeId)!;
 const selectedBorder=borders.find(b=>b.name===border);
 const basePrice=isPizza?pizzaPrice(selected.map(id=>pizzas.find(p=>p.id===id)!),sizeId):isCalzone?size.price!:product.prices?.[product.category==='bebidas'?'Unidade':variant]??null;
 const price=withBorder(basePrice,selectedBorder,sizeId);
 const borderLabel=(b:Product)=>b.name+' — '+(b.prices?.[sizeId]!=null?money(b.prices[sizeId]!):'valor a confirmar');
 const drinkTotal=drinks.reduce((sum,d)=>sum+(drinkQuantities[d.id]||0)*d.prices!.Unidade!,0);
 const eligible=pizzas.filter(p=>p.available!==false && normalize(p.name).includes(normalize(query)) && (flavorCategory==='all'||p.category===flavorCategory));
 const changeSize=(id:string)=>{setSizeId(id);const max=sizes.find(s=>s.id===id)!.maxFlavors;setSelected(current=>current.slice(0,max));};
 if (product.category === 'bordas') return <Dialog title={product.name} onClose={onClose}>
  <p className="notice"><Info size={18}/>A borda é escolhida durante a montagem de uma pizza.</p>
  <button type="button" className="button primary full" onClick={onClose}>Voltar ao cardápio</button>
 </Dialog>;
 return <Dialog title={product.name} onClose={onClose} wide={customizable}>
 {product.description && <p className="muted modal-description">{product.description}.</p>}
 {customizable ? <>
 <fieldset><legend>1. Escolha o tamanho</legend><div className="size-options">{sizes.map(s=><label className={'size-option '+(sizeId===s.id?'selected':'')} key={s.id}><input type="radio" name="size" value={s.id} checked={sizeId===s.id} onChange={()=>changeSize(s.id)}/><strong>{s.name}</strong><span>{s.diameter?s.diameter+' cm · ':''}{s.slices} fatias</span><span>Até {s.maxFlavors} {s.maxFlavors===1?'sabor':'sabores'}</span>{s.price!==undefined && <b>{money(s.price)}</b>}</label>)}</div></fieldset>
 <fieldset><legend>2. Escolha os sabores <span className="legend-count">{selected.length}/{size.maxFlavors}</span></legend><p className="muted small">Os sabores dividem a pizza em partes iguais. Ao reduzir o tamanho, serão mantidos os primeiros sabores selecionados.</p>
 <div className="selected-flavors">{selected.map(id=><span key={id}><Check size={14}/>{pizzas.find(p=>p.id===id)?.name}</span>)}</div>
 <label className="search compact"><Search size={18}/><input aria-label="Buscar sabor na montagem" placeholder="Buscar sabor" value={query} onChange={e=>setQuery(e.target.value)}/></label>
 <label className="field">Categoria de sabores<select value={flavorCategory} onChange={e=>setFlavorCategory(e.target.value)}><option value="all">Todas as pizzas</option>{categories.slice(0,4).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
 <div className="flavor-list">{eligible.map(p=><label key={p.id} className={'flavor '+(selected.includes(p.id)?'selected':'')}><input type="checkbox" checked={selected.includes(p.id)} disabled={!selected.includes(p.id)&&selected.length>=size.maxFlavors} onChange={()=>setSelected(current=>current.includes(p.id)?current.filter(id=>id!==p.id):[...current,p.id])}/><span><strong>{p.name}</strong>{p.description&&<small>{p.description}</small>}{isPizza&&<small>{p.prices?.[sizeId]!=null?money(p.prices[sizeId]!)+" · pizza de um sabor":"Valor a confirmar"}</small>}</span></label>)}{eligible.length===0&&<p className="muted">Nenhum sabor encontrado.</p>}</div>
 </fieldset>
 {isPizza && <label className="field">3. Borda (opcional)<select value={border} onChange={e=>setBorder(e.target.value)}><option value="">Sem borda adicional</option><optgroup label="Salgadas">{borders.slice(0,4).map(b=><option key={b.id} value={b.name}>{borderLabel(b)}</option>)}</optgroup><optgroup label="Doces">{borders.slice(4).map(b=><option key={b.id} value={b.name}>{borderLabel(b)}</option>)}</optgroup></select></label>}
 </> : product.category==='xis' ? <fieldset><legend>Escolha a versão</legend><div className="size-options">{['Regular','Calota'].map(v=><label className={'size-option '+(variant===v?'selected':'')} key={v}><input type="radio" name="variant" checked={variant===v} onChange={()=>setVariant(v)}/><strong>{v}</strong><span>{product.prices?.[v]===null?'Consulte o valor pelo WhatsApp':money(product.prices![v]!)}</span></label>)}</div></fieldset> : null}
 {isPizza&&<p className="small pricing-rule">Preço da pizza: média proporcional dos sabores em partes iguais. Borda e bebidas são somadas à parte. A média é arredondada para cima no centavo por pizza, antes da borda e das bebidas.</p>}
 {isPizza&&price===null&&<p className="notice"><Info size={18}/>Há um sabor ou borda com preço pendente. O valor será confirmado pelo WhatsApp.</p>}
 {(customizable||product.category==='xis')&&<details className="drink-extras"><summary>Bebidas (opcional)</summary><p className="small muted">As quantidades de bebidas são independentes da quantidade de pizzas ou lanches.</p><div className="drink-options">{drinks.map(d=><div className="drink-option" key={d.id}><label><input type="checkbox" checked={!!drinkQuantities[d.id]} onChange={e=>setDrinkQuantities(current=>({...current,[d.id]:e.target.checked?1:0}))}/><span>{d.name}<small>{money(d.prices!.Unidade!)}</small></span></label>{!!drinkQuantities[d.id]&&<Quantity value={drinkQuantities[d.id]} onChange={q=>setDrinkQuantities(current=>({...current,[d.id]:q}))} label={d.name}/>}</div>)}</div>{drinkTotal>0&&<p className="drink-subtotal">Bebidas: {money(drinkTotal)}</p>}</details>}
 {(customizable||product.category==="xis")&&<dl className="price-breakdown" aria-label="Composição do valor"><div><dt>{isPizza?"Pizza por unidade":isCalzone?"Calzone por unidade":"Lanche por unidade"}</dt><dd>{basePrice==null?"A confirmar":money(basePrice)}</dd></div>{selectedBorder&&<div><dt>Borda por pizza</dt><dd>{selectedBorder.prices?.[sizeId]==null?"A confirmar":money(selectedBorder.prices[sizeId]!)}</dd></div>}{drinkTotal>0&&<div><dt>Bebidas selecionadas</dt><dd>{money(drinkTotal)}</dd></div>}</dl>}<div className="add-footer"><div><span className="muted small">Quantidade</span><Quantity value={quantity} onChange={setQuantity} label={product.name}/></div><div className="price-summary">{price===null?'Valor a confirmar pelo WhatsApp':money(price*quantity+drinkTotal)}{drinkTotal>0&&<small className="small"> · inclui bebidas</small>}</div></div>
 <p className="small muted">Entrega de {money(business.deliveryFee)} adicionada uma única vez no carrinho.</p><button className="button primary full" disabled={customizable&&selected.length===0} onClick={()=>{onAdd({id:crypto.randomUUID(),productId:product.id,name:isPizza?'Pizza':isCalzone?'Calzone':product.name,quantity,variant:customizable?size.name:product.category==='xis'?variant:undefined,flavors:customizable?selected.map(id=>pizzas.find(p=>p.id===id)!.name):undefined,border:border||undefined,borderPrice:selectedBorder?selectedBorder.prices?.[sizeId]??null:undefined,unitPrice:price});for(const d of drinks){if(drinkQuantities[d.id])onAdd({id:crypto.randomUUID(),productId:d.id,name:d.name,quantity:drinkQuantities[d.id],unitPrice:d.prices!.Unidade!});}onClose();}}><Plus size={18}/>Adicionar ao pedido</button>
 </Dialog>;
}
