
"use client"

import {
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleStopIcon,
  XIcon,
} from "lucide-react"

import {collapsePanel, field, mono, ShimmerLabel} from "./surfaces.js"
import {cn} from "../utils/cn.js"
import {
  CollapsibleRoot as Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible-root.js"
import type {ToolOutcome} from "../../toolkit/tool-state.js"

export type ToolCallStatus = ToolOutcome

export interface ToolCallProps {
  label: string
  activeLabel: string
  query: string
  request: string
  result: string
  status: ToolCallStatus
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}

export function ToolCall({
  label,
  activeLabel,
  query,
  request,
  result,
  status,
  open,
  onOpenChange,
  className,
}: ToolCallProps) {
  return (
    <Collapsible
      data-slot="tool-call"
      open={open}
      onOpenChange={onOpenChange}
      className={cn("w-full max-w-sm", className)}
    >
      <CollapsibleTrigger className="group/trigger text-muted-foreground hover:text-foreground/90 flex w-full items-center gap-2 rounded-md py-1 text-[13.5px] transition-colors outline-none">
        <ChevronRightIcon className="size-3.5 shrink-0 opacity-60 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/trigger:rotate-90 group-data-open/trigger:rotate-90 group-data-panel-open/trigger:rotate-90 motion-reduce:transition-none" />
        <ShimmerLabel
          active={status === "running"}
          className="shrink-0 text-start whitespace-nowrap leading-none"
        >
          {status === "running" ? activeLabel : label}
        </ShimmerLabel>
        {query && <span
          className={cn(
            mono,
            "bg-foreground/[0.06] text-foreground/70 min-w-0 truncate rounded-md px-1.5 py-0.5",
          )}
        >
          {query}
        </span>}
        <span className="flex w-4 shrink-0 items-center justify-center">
          {status === "running" ? null : status === "failed" ? (
            <XIcon
              role="img"
              aria-label="Failed"
              className="fade-in zoom-in-90 animate-in size-3.5 text-red-500 duration-200"
            />
          ) : status === "cancelled" ? (
            <CircleStopIcon role="img" aria-label="Stopped" className="size-3.5" />
          ) : status === "incomplete" ? (
            <CircleAlertIcon
              role="img"
              aria-label="Incomplete"
              className="size-3.5"
            />
          ) : (
            <CheckIcon className="fade-in zoom-in-90 animate-in size-3.5 text-emerald-500 duration-200" />
          )}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className={cn(collapsePanel, "outline-none")}>
        <div className={cn(field, "mt-2 overflow-hidden rounded-2xl text-xs")}>
          <div className="px-3.5 pt-2.5 pb-2">
            <p className={cn(mono, "text-muted-foreground mb-1")}>Request</p>
            <p className="text-muted-foreground font-mono break-words">
              {request}
            </p>
          </div>
          <div className="bg-foreground/[0.06] mx-3.5 h-px" />
          <div className="px-3.5 pt-2 pb-2.5">
            <p className={cn(mono, "text-muted-foreground mb-1")}>Result</p>
            <p className="text-foreground/90 break-words">{result}</p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

