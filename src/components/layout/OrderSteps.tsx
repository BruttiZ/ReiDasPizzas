import { ArrowRight } from 'lucide-react';
export function OrderSteps() {
  return (
    <div className="steps-strip">
      <div className="container steps">
        <span>
          <b>01</b> Escolha no cardápio
        </span>
        <ArrowRight />
        <span>
          <b>02</b> Monte seu pedido
        </span>
        <ArrowRight />
        <span>
          <b>03</b> Finalize pelo WhatsApp
        </span>
      </div>
    </div>
  );
}
