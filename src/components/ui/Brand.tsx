import { business } from '../../data/config';
export function Brand() {
  return business.logo ? (
    <span className="brand-lockup">
      <img
        className="brand-image"
        src={business.logo}
        alt="Rei das Pizzas"
        width="501"
        height="501"
      />
    </span>
  ) : (
    <span className="brand-text">
      Rei das <em>Pizzas</em>
    </span>
  );
}
