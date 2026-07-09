import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./product-visual";
import { AddToCartButton } from "./add-to-cart-button";

export function formatINR(paise: number) {
  return `₹${paise.toLocaleString("en-IN")}`;
}

/**
 * ProductCard — renders a single product in a grid.
 *
 * SEO: Uses schema.org microdata (itemScope/itemType/itemProp) so that
 * search engine crawlers can extract product info even without JS.
 * This supplements the JSON-LD structured data on each listing page.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      className="group h-full p-0 overflow-hidden transition-shadow hover:shadow-lg"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Image + title/blurb are one tap-target through to the detail page;
          the Add button stays outside the Link so it's its own control. */}
      <Link href={`/shop/${product.category}/${product.slug}`} className="contents" itemProp="url">
        <CardHeader className="relative p-6 pb-0">
          {product.badge && (
            <Badge className="absolute right-6 top-6">{product.badge}</Badge>
          )}
          {/* Placeholder art — swap for next/image when real product
              photography exists; ProductVisual keeps the aspect-square
              slot so layout won't shift when you do. */}
          <ProductVisual
            category={product.category}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </CardHeader>

        <CardContent className="flex-1 px-6">
          <CardTitle itemProp="name">{product.name}</CardTitle>
          <Text variant="small" muted className="mt-1" itemProp="description">
            {product.blurb}
          </Text>

          <div className="mt-3 flex items-center gap-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
            <Star className="size-3.5 fill-warning text-warning" />
            <Text variant="xs" muted>
              <span itemProp="ratingValue">{product.rating}</span> (<span itemProp="reviewCount">{product.reviewCount}</span>)
            </Text>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="justify-between px-6 pb-6">
        <div className="flex items-baseline gap-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="INR" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <Text className="font-semibold" itemProp="price" content={product.price.toString()}>
            {formatINR(product.price)}
          </Text>
          {product.compareAtPrice && (
            <Text variant="small" muted className="line-through">
              {formatINR(product.compareAtPrice)}
            </Text>
          )}
        </div>
        <AddToCartButton productId={product.id} />
      </CardFooter>
    </Card>
  );
}
