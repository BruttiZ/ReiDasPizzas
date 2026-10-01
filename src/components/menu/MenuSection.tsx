import { Search, X, Info } from 'lucide-react';
import { categories, calzoneSizes, savoryNote } from '../../data/menu';
import { money } from '../../utils/format';
import type { CategoryId, Product } from '../../types/menu';
import { getMenuResults } from '../../utils/catalog';
import { ProductCard } from './ProductCard';
interface MenuSectionProps {
  category: CategoryId;
  query: string;
  setQuery: (query: string) => void;
  chooseCategory: (id: CategoryId) => void;
  onChoose: (product: Product) => void;
}
export function MenuSection({
  category,
  query,
  setQuery,
  chooseCategory,
  onChoose,
}: MenuSectionProps) {
  const { searchQuery, filtered, title } = getMenuResults(category, query);
  return (
    <section className="section container" id="cardapio">
      <div className="menu-intro">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DO SEU JEITO</span>
            <h2>O que vai ser hoje?</h2>
          </div>
          <p>
            Encontre seu sabor.
            <br />A gente conversa pelo WhatsApp.
          </p>
        </div>
        <label className="search">
          <Search size={21} />
          <input
            type="search"
            placeholder="Buscar pelo nome do produto…"
            aria-label="Buscar produto por nome"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="icon-button" aria-label="Limpar busca" onClick={() => setQuery('')}>
              <X size={18} />
            </button>
          )}
        </label>
      </div>
      <nav className="category-nav" aria-label="Categorias do cardápio">
        {categories.map((c) => (
          <button
            key={c.id}
            aria-pressed={!searchQuery && category === c.id}
            className={!searchQuery && category === c.id ? 'active' : ''}
            onClick={() => chooseCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </nav>
      <div className="menu-heading">
        <h3>{title}</h3>
        <span>
          {filtered.length} {filtered.length === 1 ? 'opção' : 'opções'}
        </span>
      </div>
      {((!searchQuery && (category === 'tradicionais' || category === 'premium')) ||
        searchQuery) && (
        <p className="category-note">
          <Info size={17} />
          {savoryNote}
        </p>
      )}
      {!searchQuery && category === 'calzones' && (
        <p className="category-note">
          Todos os sabores de pizza também estão disponíveis como calzones.{' '}
          {calzoneSizes
            .map(
              (s) =>
                s.name +
                ': ' +
                s.slices +
                ' fatias · até ' +
                s.maxFlavors +
                ' sabores · ' +
                money(s.price!),
            )
            .join('. ')}
          .
        </p>
      )}
      {!searchQuery && category === 'bordas' && (
        <p className="category-note">
          4 opções salgadas e 4 doces. A borda é adicionada durante a montagem de uma pizza.
        </p>
      )}
      <div className="product-grid">
        {filtered.map((p, index) => (
          <ProductCard
            key={p.id}
            product={p}
            index={index}
            onChoose={onChoose}
            onChoosePizza={() => {
              chooseCategory('tradicionais');
              document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty">
          <Search size={32} />
          <h3>Nenhum produto encontrado</h3>
          <p className="muted">Tente outro nome ou escolha uma categoria.</p>
          <button className="button outline" onClick={() => setQuery('')}>
            Limpar busca
          </button>
        </div>
      )}
      <p className="menu-help">
        <Info size={16} />
        Sabores mistos: vale o maior preço entre os sabores escolhidos. A borda recheada é
        acrescentada uma única vez por pizza, conforme o tamanho.
      </p>
    </section>
  );
}
