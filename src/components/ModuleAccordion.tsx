import { Link } from "react-router-dom";
import { catalog, deliveredCount, featurePath, moduleAnchor } from "../data/catalog";
import type { Module } from "../data/types";
import { Chevron } from "./icons";
import { StatusBadge } from "./StatusBadge";

interface Props {
  module: Module;
  open: boolean;
  onToggle: (open: boolean) => void;
}

// Accordion no padrão ARIA: h2 > button com aria-expanded/aria-controls. O
// cabeçalho inteiro é clicável; o botão é o alvo de teclado.
export function ModuleAccordion({ module: m, open, onToggle }: Props) {
  const anchor = moduleAnchor(m.id);
  const panelId = `${anchor}-itens`;
  const headingId = `${anchor}-titulo`;
  const delivered = deliveredCount(m);
  const count =
    delivered < m.features.length
      ? `${delivered} de ${m.features.length} entregues`
      : `${m.features.length} funcionalidades`;

  return (
    <section id={anchor} className={`mod${open ? " open" : ""}${m.status === "disabled" ? " off" : ""}`} aria-labelledby={headingId}>
      <div className="summary" onClick={(e) => { if (!(e.target as HTMLElement).closest("button")) onToggle(!open); }}>
        <div className="s-main">
          <h2 id={headingId} className="s-title">
            <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => onToggle(!open)}>
              <span className="num">Módulo {m.id}</span>{" "}
              <span className="name">{m.name}</span>
            </button>
          </h2>
          <p className="s-desc">{m.description}</p>
          <p className="meta">
            <StatusBadge status={m.status} />
            <span>{count}</span>
          </p>
        </div>
        <Chevron direction="down" className="caret" />
      </div>
      {open && (
        <ul className="items" id={panelId}>
          {m.features.map((f) => (
            <li key={f.slug}>
              <Link to={featurePath(f.slug)}>
                <span className="t">{f.title}</span>
                {(f.status !== m.status || f.status === "validating") && (
                  <span className="tag">{catalog.statuses[f.status]}</span>
                )}
                <Chevron className="chev" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
