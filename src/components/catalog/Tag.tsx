import type { ProductTag } from "@/data/catalog";
import { TAG_LABELS } from "@/data/catalog";

const tone: Record<ProductTag, string> = {
  hit: "bg-primary text-primary-foreground",
  new: "bg-stone-900 text-white",
  lenten: "bg-apple text-white",
  spicy: "bg-secondary text-secondary-foreground",
};

const Tag = ({ tag }: { tag: ProductTag }) => (
  <span
    className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone[tag]}`}
  >
    {TAG_LABELS[tag]}
  </span>
);

export default Tag;
