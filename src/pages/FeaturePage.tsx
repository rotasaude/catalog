import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useOpenModules } from "../components/OpenModules";
import { Brand, Chevron, SurfaceIcon } from "../components/icons";
import { StatusBadge } from "../components/StatusBadge";
import { catalog, featurePath, findFeature, moduleAnchor, neighbours } from "../data/catalog";

function BackLink({ moduleId }: { moduleId?: string }) {
  return (
    <Link className="back" to={moduleId ? { pathname: "/", hash: moduleAnchor(moduleId) } : "/"}>
      <Chevron direction="left" />
      Todas as funcionalidades
    </Link>
  );
}

export function FeaturePage() {
  const { slug = "" } = useParams();
  const hit = findFeature(slug);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { setLastVisited } = useOpenModules();

  useEffect(() => {
    document.title = hit ? `${hit.feature.title} · Rota Saúde` : "Funcionalidade não encontrada · Rota Saúde";
    if (hit) setLastVisited(hit.module.id);
    window.scrollTo?.(0, 0);
    titleRef.current?.focus({ preventScroll: true });
  }, [hit, setLastVisited]);

  if (!hit) {
    return (
      <>
        <Brand />
        <BackLink />
        <main className="d-card">
          <h1 ref={titleRef} tabIndex={-1}>Funcionalidade não encontrada</h1>
          <p>O endereço não corresponde a nenhuma funcionalidade do {catalog.meta.cycle.label}.</p>
        </main>
      </>
    );
  }

  const { feature: f, module: m } = hit;
  const { prev, next } = neighbours(hit);

  return (
    <>
      <Brand />
      <BackLink moduleId={m.id} />
      <main className="detail">
        <article className="d-card">
          <p className="d-eyebrow">
            <span>Módulo {m.id} · {m.name}</span>
            <span className="id">{f.id}</span>
          </p>
          <h1 ref={titleRef} tabIndex={-1}>{f.title}</h1>
          <div>
            <StatusBadge status={f.status} />
          </div>
          <p className="d-benefit">{f.benefit}</p>
          {f.note && <p className="d-note">{f.note}</p>}
          <section className="d-sec" aria-labelledby="d-faz">
            <h2 id="d-faz">O que faz</h2>
            <p className="d-desc">{f.description}</p>
          </section>
          <section className="d-sec" aria-labelledby="d-onde">
            <h2 id="d-onde">Onde aparece</h2>
            {f.surfaces.length > 0 ? (
              <ul className="surfaces">
                {f.surfaces.map((s) => (
                  <li key={s}>
                    <SurfaceIcon surface={s} />
                    <div>
                      <b>{catalog.surfaces[s].label}</b>
                      <span>{catalog.surfaces[s].text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="d-note">Sem tela em uso: depende de um canal desativado.</p>
            )}
          </section>
        </article>
        {(prev || next) && (
          <nav className="pager" aria-label="Outras funcionalidades do módulo">
            {prev && (
              <Link className="prev" to={featurePath(prev.slug)}>
                <small>← Anterior</small>
                {prev.title}
              </Link>
            )}
            {next && (
              <Link className="next" to={featurePath(next.slug)}>
                <small>Próxima →</small>
                {next.title}
              </Link>
            )}
          </nav>
        )}
      </main>
    </>
  );
}
