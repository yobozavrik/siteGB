import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "@/data/catalog";
import { pricePer100g, productImage } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import Tag from "@/components/catalog/Tag";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const add = () =>
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      unitLabel: product.unitLabel,
      priceUAH: product.priceUAH,
      image: productImage(product),
    });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={productImage(product)}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.tags.length > 0 && (
          <div className="absolute left-2 top-2 flex gap-1">
            {product.tags.map((t) => (
              <Tag key={t} tag={t} />
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={`/product/${product.slug}`} className="font-bold leading-tight hover:text-primary">
          {product.title}
        </Link>
        <p className="text-xs text-muted-foreground">{product.unitLabel}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <div className="text-lg font-black tabular-nums">{product.priceUAH} ₴</div>
            <div className="text-[11px] text-muted-foreground tabular-nums">
              {pricePer100g(product)} ₴ / 100 г
            </div>
          </div>
          <button
            onClick={add}
            aria-label={`Додати «${product.title}» у кошик`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform active:scale-95"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
