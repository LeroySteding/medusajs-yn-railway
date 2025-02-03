import Image from "next/image"
import { getCollectionsList } from "@lib/data/collections"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import { Button } from "react-aria-components"
export const CollectionsSection: React.FC<{ className?: string }> = async ({
                                                                             className,
                                                                           }) => {
  const collections = await getCollectionsList(0, 20, [
    "id",
    "title",
    "handle",
    "metadata",
  ])

  if (!collections) {
    return null
  }

  return (
    <section className={`${className} px-20`}>
      <div className="flex flex-row justify-between items-center mb-8">
        <div><h3 className="text-lg md:text-2xl">Brands</h3></div>
        <LocalizedButtonLink
          href="/brands"
          size="md"
        >
          View All
        </LocalizedButtonLink>

      </div>

      <div className="masonry sm:masonry-sm md:masonry-md lg:masonry-lg">
        {collections.collections.map((collection) => (
          <div className="masonry-item break-inside mb-4" key={collection.id}>
            <LocalizedLink href={`/collections/${collection.handle}`}>
              {typeof collection.metadata?.image === "object" &&
                collection.metadata.image &&
                "url" in collection.metadata.image &&
                typeof collection.metadata.image.url === "string" && (
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src="/images/collection/arte-antwerp/arte-header.png"
                      alt={collection.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              <h3 className="md:text-lg mt-2 mb-1">{collection.title}</h3>
              {typeof collection.metadata?.description === "string" &&
                collection.metadata?.description.length > 0 && (
                  <p className="text-xs text-grayscale-500 md:text-md">
                    {collection.metadata.description}
                  </p>
                )}
            </LocalizedLink>
          </div>
        ))}
      </div>
    </section>
  )
}