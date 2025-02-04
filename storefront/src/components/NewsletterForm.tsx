"use client"

// External components
import * as React from "react"

// Components
import { Button } from "@/components/Button"
import { Input } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"

export const NewsletterForm: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  return (
    <div className={className}>
      <h2 className="text-md md:text-lg mb-2 md:mb-1">Nieuwsbrief</h2>
      {isSubmitted ? (
        <p className="max-md:text-xs">
          Bedankt voor het abonneren op onze nieuwsbrief!
        </p>
      ) : (
        <>
          <p className="max-md:text-xs mb-4">
              Ontvang nieuwe collectie updates, events, en kortingsacties in je mail.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault()

              setIsSubmitted(true)
            }}
          >
            <div className="flex gap-2 pt-2">
              <Input
                uiSize="sm"
                name="email"
                type="email"
                placeholder="Your email"
                wrapperClassName="mb-4 flex-1"
                className="rounded-xs"
              />
              <Button type="submit" size="sm" className="h-9 text-xs">
                Subscribe
              </Button>
            </div>
          </form>
          <p className="text-xs text-grayscale-500">
            Door te abonneren ga je akkoord met onze{" "}
            <LocalizedLink
              href="/privacy-policy"
              variant="underline"
              className="!pb-0"
            >
              privacybeleid
            </LocalizedLink>{" "}
            en geef toestemming om updates te ontvangen van onze bedrijf.
          </p>
        </>
      )}
    </div>
  )
}
