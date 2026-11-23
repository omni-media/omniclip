
"use client"

import {createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState} from "react"
import {BrainIcon, ChevronDownIcon} from "lucide-react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "../utils/cn.js"
import {CollapsibleRoot as Collapsible, CollapsibleContent, CollapsibleTrigger} from "./collapsible-root.js"

export const ANIMATION_DURATION = 200

const ReasoningPreviewContext = createContext({streaming: false, compact: false})

const reasoningVariants = cva("aui-reasoning-root mb-4 w-full", {
  variants: {
    variant: {
      outline: "rounded-lg border px-3 py-2",
      ghost: "",
      muted: "bg-muted/50 rounded-lg px-3 py-2",
    },
  },
  defaultVariants: {
    variant: "outline",
  },
})

export type ReasoningRootProps = Omit<
  React.ComponentProps<typeof Collapsible>,
  "open" | "onOpenChange"
> &
  VariantProps<typeof reasoningVariants> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    defaultOpen?: boolean
    /**
     * Follow the newest tokens while the disclosure is open and streaming.
     * Pause while the reader is scrolled up.
     */
    streaming?: boolean
    /** Called right before the disclosure animates, on toggle and on streaming transitions. */
    onAnimationStart?: () => void
  }

const ReasoningRoot = forwardRef<
  HTMLDivElement,
  Omit<ReasoningRootProps, "ref">
>(function ReasoningRoot(
  {
    className,
    variant,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    defaultOpen = false,
    streaming,
    onAnimationStart,
    children,
    ...props
  },
  ref,
) {
  const [initialOpen] = useState(defaultOpen)
  const [userOpen, setUserOpen] = useState<boolean | null>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled
    ? controlledOpen
    : (userOpen ?? (streaming || initialOpen))
  const isPreview = streaming === true && isOpen
  const compact = isPreview && !isControlled && userOpen === null && !initialOpen

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onAnimationStart?.()
      if (!isControlled) {
        setUserOpen(open)
      }
      controlledOnOpenChange?.(open)
    },
    [onAnimationStart, isControlled, controlledOnOpenChange],
  )

  return (
    <Collapsible
      ref={ref}
      data-slot="reasoning-root"
      data-variant={variant}
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={cn(
        "group/reasoning-root",
        reasoningVariants({ variant, className }),
      )}
      style={
        {
          "--animation-duration": `${ANIMATION_DURATION}ms`,
        } as React.CSSProperties
      }
      {...props}
    >
      <ReasoningPreviewContext.Provider value={{streaming: isPreview, compact}}>
        {children}
      </ReasoningPreviewContext.Provider>
    </Collapsible>
  )
})

function ReasoningTrigger({
  active,
  duration,
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger> & {
  active?: boolean
  duration?: number | undefined
}) {
  const durationText = duration ? ` (${duration}s)` : ""

  return (
    <CollapsibleTrigger
      data-slot="reasoning-trigger"
      className={cn(
        "aui-reasoning-trigger group/trigger text-muted-foreground hover:text-foreground flex max-w-[75%] origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <BrainIcon
        data-slot="reasoning-trigger-icon"
        className="aui-reasoning-trigger-icon size-4 shrink-0"
      />
      <span
        data-slot="reasoning-trigger-label"
        className={cn(
          "aui-reasoning-trigger-label-wrapper inline-block leading-none tabular-nums",
          active && "shimmer motion-reduce:animate-none",
        )}
      >
        Reasoning{durationText}
      </span>
      <ChevronDownIcon
        data-slot="reasoning-trigger-chevron"
        className="mt-0.5 size-4 shrink-0"
      />
    </CollapsibleTrigger>
  )
}

function ReasoningContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="reasoning-content"
      className={cn(
        "aui-reasoning-content text-muted-foreground relative overflow-hidden text-sm outline-none",
        "group/collapsible-content ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none",
        "data-closed:animate-collapsible-up",
        "data-open:animate-collapsible-down",
        "data-closed:fill-mode-forwards",
        "data-closed:pointer-events-none",
        "[--tw-duration:var(--animation-duration)]",
        className,
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  )
}

function ReasoningText({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const {streaming: isPreview, compact} = useContext(ReasoningPreviewContext)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isPreview) return
    const scrollEl = scrollRef.current
    const contentEl = contentRef.current
    if (!scrollEl || !contentEl) return

    let pinned = true
    let lastScrollTop = scrollEl.scrollTop
    let lastScrollHeight = scrollEl.scrollHeight
    const isAtBottom = () =>
      Math.abs(
        scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight,
      ) <= 1 || scrollEl.scrollHeight <= scrollEl.clientHeight

    const pin = () => {
      if (!pinned) return
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
    // A pin's own scroll event can arrive after new content grew the scroll
    // height and read as "not at bottom"; only an upward move at unchanged
    // scroll height is user intent.
    const onScroll = () => {
      if (isAtBottom()) {
        pinned = true
      } else if (
        scrollEl.scrollTop < lastScrollTop &&
        scrollEl.scrollHeight === lastScrollHeight
      ) {
        pinned = false
      }
      lastScrollTop = scrollEl.scrollTop
      lastScrollHeight = scrollEl.scrollHeight
    }

    pin()
    scrollEl.addEventListener("scroll", onScroll)
    const observer = new ResizeObserver(pin)
    observer.observe(contentEl)
    return () => {
      scrollEl.removeEventListener("scroll", onScroll)
      observer.disconnect()
    }
  }, [isPreview])

  return (
    <div
      ref={scrollRef}
      data-slot="reasoning-text"
      data-compact={compact || undefined}
      className={cn(
        "aui-reasoning-text relative z-0 overflow-y-auto ps-6 pt-2 pb-2 leading-relaxed text-pretty",
        !compact && "max-h-64",
        "transform-gpu transition-[transform,opacity] ease-[cubic-bezier(0.32,0.72,0,1)]",
        "motion-reduce:animate-none",
        "group-data-open/collapsible-content:animate-in",
        "group-data-closed/collapsible-content:animate-out",
        "group-data-open/collapsible-content:fade-in-0",
        "group-data-closed/collapsible-content:fade-out-0",
        "group-data-open/collapsible-content:slide-in-from-top-4",
        "group-data-closed/collapsible-content:slide-out-to-top-4",
        "group-data-open/collapsible-content:blur-in-[2px]",
        "group-data-closed/collapsible-content:blur-out-[2px]",
        "group-data-open/collapsible-content:animation-duration-(--animation-duration)",
        "group-data-closed/collapsible-content:animation-duration-(--animation-duration)",
        className,
      )}
      {...props}
    >
      <div ref={contentRef} className="aui-reasoning-text-content space-y-4">
        {children}
      </div>
    </div>
  )
}

export {
  ReasoningRoot,
  ReasoningTrigger,
  ReasoningContent,
  ReasoningText,
  reasoningVariants,
}

