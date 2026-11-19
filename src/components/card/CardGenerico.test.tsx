// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { CardGenerico } from "./CardGenerico";

vi.mock("next/image", async () => {
    const { createElement } = await import("react");
    return {
        default: ({ src, alt, onError }: ComponentProps<"img">) =>
            createElement("img", { src, alt, onError }),
    };
});

afterEach(cleanup);

it("usa a alternativa e depois a imagem padrão se ambas falharem", () => {
    render(
        <CardGenerico
            title="Pesquisadora"
            image="/principal.png"
            fallbackImage="/alternativa.png"
        />
    );
    fireEvent.error(screen.getByAltText("Pesquisadora"));
    expect(screen.getByAltText("Pesquisadora").getAttribute("src")).toBe(
        "/alternativa.png"
    );
    fireEvent.error(screen.getByAltText("Pesquisadora"));
    expect(screen.getByAltText("Default logo")).toBeTruthy();
});

it("mostra uma nova imagem recebida mesmo depois da falha anterior", () => {
    const { rerender } = render(<CardGenerico title="Escola" image="/antiga.png" />);
    fireEvent.error(screen.getByAltText("Escola"));
    rerender(<CardGenerico title="Escola" image="/nova.png" />);
    expect(screen.getByAltText("Escola").getAttribute("src")).toBe("/nova.png");
});
