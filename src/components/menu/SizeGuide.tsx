import { motion } from 'motion/react';
import { pizzaSizes, calzoneSizes } from '../../data/menu';
import { money } from '../../utils/format';
export function SizeGuide() {
  return (
    <section id="tamanhos" className="sizes-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ESCOLHA O TAMANHO</span>
            <h2>Seu pedido, na medida.</h2>
          </div>
          <p>Uma pizza, seus sabores.</p>
        </div>
        <div className="size-guide">
          {pizzaSizes.map((s, i) => (
            <article key={s.id}>
              <div className="size-illustration" aria-hidden="true">
                <motion.span
                  initial={{ rotate: -25, scale: 0.8 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, damping: 14, delay: i * 0.08 }}
                  whileHover={{ rotate: 15, scale: 1.06 }}
                  style={{ width: 58 + i * 15, height: 58 + i * 15 }}
                />
              </div>
              <h3>{s.name}</h3>
              <p>
                {s.diameter} cm <span>·</span> {s.slices} fatias
              </p>
              <p>
                Até {s.maxFlavors} {s.maxFlavors === 1 ? 'sabor' : 'sabores'}
              </p>
              <strong>
                Tradicional: {money(s.range![0])}
                <br />
                Premium: {money(s.range![1])}
              </strong>
            </article>
          ))}
        </div>
        <p className="size-note">
          O valor varia conforme a escolha dos sabores: tradicionais ou Premium.
        </p>
        <p className="muted small centered">
          Monte a pizza para ver o preço dos sabores, da borda e das bebidas.
        </p>
        <details className="calzone-guide">
          <summary>Tamanhos dos calzones</summary>
          <div>
            {calzoneSizes.map((s) => (
              <p key={s.id}>
                <strong>{s.name}</strong> · {s.slices} fatias · Até {s.maxFlavors} sabores ·{' '}
                {money(s.price!)}
              </p>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
