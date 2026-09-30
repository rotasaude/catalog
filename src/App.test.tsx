import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRoutes } from "./App";
import { findFeature } from "./data/catalog";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

const moduleToggle = (name: RegExp) => screen.getByRole("button", { name });

beforeEach(() => {
  sessionStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

describe("lista de módulos", () => {
  it("mostra o cabeçalho e um bloco por módulo, todos fechados", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1, name: "Funcionalidades do MVP · Ciclo 1" })).toBeInTheDocument();
    expect(screen.getByText("MVP · Ciclo 1 · módulos 01 a 14")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(14);
    expect(screen.queryAllByRole("link", { name: /Classificação previsível/ })).toHaveLength(0);
    expect(document.title).toBe("Funcionalidades Rota Saúde");
  });

  it("mostra status e contagem de cada módulo", () => {
    renderAt("/");
    const m10 = screen.getByRole("region", { name: /Profissionais/ });
    expect(within(m10).getByText("5 de 7 entregues")).toBeInTheDocument();
    expect(within(m10).getByText("Disponível e verificado")).toBeInTheDocument();
    const m13 = screen.getByRole("region", { name: /Acompanhamento/ });
    expect(within(m13).getByText("Disponível e verificado")).toBeInTheDocument();
    expect(within(m13).getByText("6 funcionalidades")).toBeInTheDocument();
    const m14 = screen.getByRole("region", { name: /Analytics/ });
    expect(within(m14).getByText("Planejado")).toBeInTheDocument();
    expect(within(m14).getByText("Funcionalidades a definir")).toBeInTheDocument();
    const m04 = screen.getByRole("region", { name: /Relatórios/ });
    expect(within(m04).getByText("7 funcionalidades")).toBeInTheDocument();
    expect(within(m04).getByText("Disponível e verificado")).toBeInTheDocument();
  });

  it("módulo sem funcionalidades definidas mostra aviso ao abrir", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(moduleToggle(/Analytics/));
    expect(screen.getByText("As funcionalidades deste módulo ainda estão sendo definidas.")).toBeInTheDocument();
  });

  it("o rodapé resume o estado dos módulos", () => {
    renderAt("/");
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Os módulos 02 a 13 estão disponíveis e verificados; o 14 está planejado."
    );
  });

  it("abre e fecha um módulo", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const toggle = moduleToggle(/Triagem/);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: /Classificação previsível/ })).toHaveLength(1);

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: /Classificação previsível/ })).not.toBeInTheDocument();
  });

  it("abre pelo teclado", async () => {
    const user = userEvent.setup();
    renderAt("/");
    moduleToggle(/Triagem/).focus();
    await user.keyboard("{Enter}");
    expect(moduleToggle(/Triagem/)).toHaveAttribute("aria-expanded", "true");
  });

  it("mostra o status do item quando difere do módulo", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(moduleToggle(/Triagem/));
    const item = screen.getByRole("link", { name: /Perguntas adaptadas ao WhatsApp/ });
    expect(item).toHaveTextContent("Canal desativado");
    expect(screen.getByRole("link", { name: /Classificação por pontuação/ })).not.toHaveTextContent("Disponível");
  });

  it("marca os itens fora do ciclo dentro de um módulo disponível", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(moduleToggle(/Profissionais/));
    expect(screen.getByRole("link", { name: /CNES/ })).toHaveTextContent("Planejado");
    expect(screen.getByRole("link", { name: /Turnos com data/ })).not.toHaveTextContent("Planejado");
  });
});

describe("página da funcionalidade", () => {
  it("mostra título, status, benefício, telas e move o foco para o h1", () => {
    renderAt("/funcionalidades/f-04.3");
    const h1 = screen.getByRole("heading", { level: 1, name: "Link seguro e temporário (30 dias)" });
    expect(h1).toHaveFocus();
    expect(screen.getByText("F-04.3")).toBeInTheDocument();
    expect(screen.getByText("Módulo 04 · Relatórios")).toBeInTheDocument();
    expect(screen.getByText("Disponível e verificado")).toBeInTheDocument();
    expect(screen.getByText(/Link desconhecido, adulterado/)).toBeInTheDocument();
    expect(screen.getByText("Tela do cidadão")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "O que faz" })).toBeInTheDocument();
    expect(screen.getByText(findFeature("f-04.3")!.feature.description)).toBeInTheDocument();
    expect(document.title).toBe("Link seguro e temporário (30 dias) · Rota Saúde");
  });

  it("mostra a nota e o aviso de sem tela quando surfaces está vazio", () => {
    renderAt("/funcionalidades/f-03.3");
    expect(screen.getByText("Ligada ao canal WhatsApp, desativado em 27/09/2026.")).toBeInTheDocument();
    expect(screen.getByText("Sem tela em uso: depende de um canal desativado.")).toBeInTheDocument();
  });

  it("navega entre anterior e próxima dentro do módulo", async () => {
    const user = userEvent.setup();
    renderAt("/funcionalidades/f-04.1");
    expect(screen.queryByRole("link", { name: /Anterior/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /Próxima.*Relatório congelado/ }));
    expect(screen.getByRole("heading", { level: 1, name: /Relatório congelado/ })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /Anterior.*Geração automática/ }));
    expect(screen.getByRole("heading", { level: 1, name: /Geração automática/ })).toBeInTheDocument();
  });

  it("última do módulo não aponta para o módulo seguinte", () => {
    renderAt("/funcionalidades/f-04.7");
    expect(screen.queryByRole("link", { name: /Próxima/ })).not.toBeInTheDocument();
  });

  it("slug inválido mostra 'não encontrada' com link para a lista", async () => {
    const user = userEvent.setup();
    renderAt("/funcionalidades/f-99.9");
    expect(screen.getByRole("heading", { level: 1, name: "Funcionalidade não encontrada" })).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: /Todas as funcionalidades/ }));
    expect(screen.getByRole("heading", { level: 1, name: "Funcionalidades do MVP · Ciclo 1" })).toBeInTheDocument();
  });
});

describe("ida e volta", () => {
  it("volta da funcionalidade para a lista com o módulo aberto e rolado até a vista", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(moduleToggle(/Relatórios/));
    await user.click(screen.getByRole("link", { name: /Tela do relatório para o cidadão/ }));
    expect(screen.getByRole("heading", { level: 1, name: "Tela do relatório para o cidadão" })).toBeInTheDocument();

    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    await user.click(screen.getByRole("link", { name: /Todas as funcionalidades/ }));

    expect(moduleToggle(/Relatórios/)).toHaveAttribute("aria-expanded", "true");
    expect(moduleToggle(/Triagem/)).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  });

  it("chegando direto numa funcionalidade, a volta abre o módulo dela", async () => {
    const user = userEvent.setup();
    renderAt("/funcionalidades/f-08.2");
    await user.click(screen.getByRole("link", { name: /Todas as funcionalidades/ }));
    expect(moduleToggle(/Agendamento/)).toHaveAttribute("aria-expanded", "true");
  });
});
