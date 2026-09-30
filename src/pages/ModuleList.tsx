import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ModuleAccordion } from "../components/ModuleAccordion";
import { useOpenModules } from "../components/OpenModules";
import { Brand } from "../components/icons";
import { catalog, moduleAnchor } from "../data/catalog";

const { meta, modules } = catalog;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
}

export function ModuleList() {
  const { isOpen, setOpen, lastVisited, setLastVisited } = useOpenModules();
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "Funcionalidades Rota Saúde";
  }, []);

  // Voltando de uma funcionalidade (pelo link, com #m-NN, ou pelo "voltar" do
  // navegador, via lastVisited): abre o módulo dela e rola até ele.
  useEffect(() => {
    const fromHash = /^#m-(\d\d)$/.exec(hash)?.[1];
    const target = fromHash ?? lastVisited;
    if (!target) {
      window.scrollTo?.(0, 0);
      return;
    }
    setOpen(target, true);
    setLastVisited(null);
    requestAnimationFrame(() => document.getElementById(moduleAnchor(target))?.scrollIntoView());
    // Só na chegada à lista.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const available = modules.filter((m) => m.status === "available").map((m) => m.id);
  const validating = modules.filter((m) => m.status === "validating").map((m) => m.id);
  const planned = modules.filter((m) => m.status === "planned").map((m) => m.id);

  return (
    <>
      <header className="top">
        <Brand />
        <span className="cycle">
          {meta.cycle.scope} · {meta.cycle.label} · módulos {meta.cycle.modules}
        </span>
        <h1>
          Funcionalidades do {meta.cycle.scope} · {meta.cycle.label}
        </h1>
        <p className="lead">
          As funcionalidades do primeiro ciclo de desenvolvimento, separadas por módulo. Abra um módulo e toque numa
          funcionalidade para ver o que ela faz e onde aparece.
        </p>
      </header>
      <main className="mods">
        {modules.map((m) => (
          <ModuleAccordion key={m.id} module={m} open={isOpen(m.id)} onToggle={(v) => setOpen(m.id, v)} />
        ))}
      </main>
      <footer className="foot">
        Conteúdo verificado até {formatDate(meta.updatedAt)}. Os módulos {available[0]} a {available[available.length - 1]}{" "}
        estão disponíveis e verificados{validating.length > 0 && `; o ${validating.join(", ")} está em validação`}
        {planned.length > 0 && `; o ${planned.join(", ")} está planejado`}.
      </footer>
    </>
  );
}
