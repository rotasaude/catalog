import { describe, expect, it } from "vitest";
import raw from "./funcionalidades.json";
import { catalog, deliveredCount, findFeature, neighbours, validateCatalog } from "./catalog";
import type { Catalog } from "./types";

const clone = (): Catalog => JSON.parse(JSON.stringify(raw));

describe("validateCatalog", () => {
  it("aceita o conteúdo publicado", () => {
    expect(validateCatalog(clone())).toEqual([]);
  });

  it("acusa slug repetido", () => {
    const data = clone();
    data.modules[1].features[1].slug = data.modules[1].features[0].slug;
    expect(validateCatalog(data)).toContain(`slug repetido: ${data.modules[1].features[0].slug}`);
  });

  it("acusa tela que não existe no mapa de surfaces", () => {
    const data = clone();
    data.modules[1].features[0].surfaces = ["recepcao"];
    expect(validateCatalog(data)).toContain("F-02.1: tela desconhecida recepcao");
  });

  it("acusa funcionalidade sem descrição", () => {
    const data = clone();
    data.modules[1].features[0].description = "  ";
    expect(validateCatalog(data)).toContain("F-02.1: sem descrição");
  });

  it("acusa status que não existe no mapa de statuses", () => {
    const data = clone();
    data.modules[2].status = "beta";
    data.modules[2].features[0].status = "beta";
    expect(validateCatalog(data)).toEqual(
      expect.arrayContaining(["módulo 03: status desconhecido beta", "F-03.1: status desconhecido beta"])
    );
  });
});

describe("consultas", () => {
  it("encontra a funcionalidade pelo slug, com o módulo e a posição", () => {
    const hit = findFeature("f-03.1");
    expect(hit?.feature.title).toMatch(/Classificação previsível/);
    expect(hit?.module.id).toBe("03");
    expect(hit?.index).toBe(0);
  });

  it("devolve undefined para slug inválido", () => {
    expect(findFeature("f-99.1")).toBeUndefined();
  });

  it("anterior e próxima ficam dentro do mesmo módulo", () => {
    const first = findFeature("f-04.1")!;
    expect(neighbours(first)).toEqual({ prev: undefined, next: first.module.features[1] });
    const last = findFeature("f-04.7")!;
    expect(neighbours(last).next).toBeUndefined();
    expect(neighbours(last).prev?.id).toBe("F-04.6");
  });

  it("conta como entregues as funcionalidades que não estão planejadas", () => {
    const m10 = catalog.modules.find((m) => m.id === "10")!;
    expect(deliveredCount(m10)).toBe(5);
    expect(m10.features).toHaveLength(7);
  });
});
