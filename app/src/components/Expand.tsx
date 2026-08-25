import { Accordion } from "@heroui/react";
import type { ReactNode } from "react";

/**
 * Layered copy. The script's §04 note, applied page-wide: lead with the line
 * that lands, hold the reasoning back for whoever wants it. HeroUI's Accordion
 * gives the disclosure semantics for free.
 */
export function Expand({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Accordion className="expand">
      <Accordion.Item id="more">
        <Accordion.Heading>
          <Accordion.Trigger className="expand-trigger">
            {label}
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body className="expand-body">{children}</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
