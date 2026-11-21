# ICTITE Frontend

Aplicação Next.js com dois perfis autenticados: `ADMIN` para o console geral e `SCHOOL_ADMIN` para o console e o rascunho da própria escola. A publicação do formulário depende de aprovação administrativa.

## Desenvolvimento

Use Node.js 20 ou posterior e copie `.env.example` para `.env`.

```sh
npm ci
npm run dev
```

No desenvolvimento sem prefixo, a aplicação fica em `http://localhost:3000`. Configure `NEXT_PUBLIC_BASE_URL` com o endereço da API acessível pelo navegador. Para esse caso, `http://localhost:8000` é uma configuração explícita, não um endereço fixado no código.

## API, produção e cookies

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | URL pública da API, incluindo seu prefixo quando houver. É incorporada ao JavaScript durante o build. |
| `API_INTERNAL_URL` | Opcional. URL privada da API usada pelo servidor Next em tempo de execução. Se ausente, o servidor usa a URL pública. |
| `NEXT_PUBLIC_BASE_PATH` | Prefixo da interface, definido no build. Se omitido, produção usa `/ictite/v1/web` e desenvolvimento usa vazio. Valor vazio explícito permite produção sem prefixo. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Identificador público opcional do Analytics, definido no build. |

Exemplo de produção com proxy reverso no mesmo hostname público:

```dotenv
NEXT_PUBLIC_BASE_URL=https://ictite.example.test/ictite/v1/api
NEXT_PUBLIC_BASE_PATH=/ictite/v1/web
API_INTERNAL_URL=http://api:8000
```

O proxy reverso encaminha `/ictite/v1/api/` para a API e `/ictite/v1/web/` para o frontend. A API deve usar uma `DOMAIN` pública coerente para imagens e downloads e incluir a origem da interface em `ALLOWED_ORIGINS` (apenas protocolo, hostname e porta, sem caminho).

A API e a interface devem compartilhar o hostname público para que o cookie host-only `access_token`, com `Path=/`, seja recebido também pelo servidor Next. A URL interna pode usar o nome do serviço Docker. Hospedar a API em outro hostname exige uma estratégia adicional de cookies/proxy; trocar apenas a URL não compartilha cookies entre hosts.

Em produção, configure HTTPS e `ENVIROMENT=prod` ou `production` na API para o cookie `Secure`. A sessão é HttpOnly; o frontend não armazena tokens em localStorage. Não é necessário configurar `JWT_SECRET` no frontend: os consoles consultam `/auth/me` na API, que valida a assinatura, expiração, existência da conta, perfil atual e vínculo escolar. A API continua aplicando suas próprias regras de autorização em cada operação.

O redirecionamento ao login preserva o prefixo e o destino autorizado. Destinos externos e consoles de outro perfil são recusados. Se a API estiver indisponível, o console responde 503 sem apagar uma sessão que não pôde ser verificada.

## Docker

```sh
docker compose up --build -d
```

O Compose fornece `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_BASE_PATH` e Analytics como argumentos de build. Alterar uma variável pública exige reconstruir a imagem; alterar `API_INTERNAL_URL` exige recriar o container. Não forneça chaves JWT, senhas ou outros segredos em argumentos de build. O `.dockerignore` exclui `.env`, `.git`, caches e resultados de testes.

Build direto:

```sh
docker build --build-arg NEXT_PUBLIC_BASE_URL=https://ictite.example.test/ictite/v1/api --build-arg NEXT_PUBLIC_BASE_PATH=/ictite/v1/web -t ictite-frontend .
docker run --rm -p 8010:8010 -e API_INTERNAL_URL=http://api:8000 --network ictite-novo-network ictite-frontend
```

As fontes Geist são empacotadas pelo pacote oficial `geist`; o build não consulta Google Fonts. A imagem executa `node server.js` da saída standalone. O endereço privado precisa ser alcançável na rede configurada. Os serviços existentes não são necessários para o build, mas a execução precisa da API.

## Proxy de imagens de notícias

`/api/image/?url=...`, sob o prefixo da interface, aceita somente HTTPS na porta 443 para `cdninstagram.com`, `fbcdn.net` e seus subdomínios. São os domínios encontrados nas notícias cadastradas. Não aceite domínios arbitrários a partir de dados da API.

O proxy verifica os endereços IP no lookup do próprio socket, bloqueia destinos internos/reservados e valida cada redirecionamento (até três). O tempo total é limitado a 8 segundos e a resposta a 8 MiB, incluindo leitura sem Content-Length. Apenas JPEG, PNG, GIF, WebP e AVIF com assinatura compatível são entregues. SVG, JSON, HTML e conteúdo compactado são recusados.

Somente imagens aprovadas recebem cache público de um dia; erros usam `no-store`. A interface usa uma imagem local de fallback caso a origem expire ou falhe. Para adicionar outra origem, revise a necessidade, os limites e os testes de destino.

## Testes

```sh
npm test
npm run lint
npm run build
```

A suíte Vitest cobre formulário, normalização de opcionais, a tela de login, convite, restauração/logout/expiração de sessão, autorização, configuração de API, navegação de login e segurança do proxy. Os testes de rede do proxy usam respostas controladas e não consultam serviços internos. Estes testes não substituem uma jornada automatizada completa no navegador, que ainda será ampliada.

Referências: [autenticação no Next.js](https://nextjs.org/docs/app/guides/authentication), [basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath).
# Testes automatizados e produção

- `npm test`: testes de sessão, permissões, configuração da API e validação/revisão do formulário.
- `npm run lint -- --max-warnings 0`: lint sem tolerância a avisos.
- `npm run build`: build e verificação de tipos.
- `npx playwright install chromium`, uma vez, seguido de `npm run test:e2e`: jornada real de navegador.

Para a jornada E2E, mantenha `ictite-backend` ao lado deste repositório, com `poetry install` concluído e Docker em execução. Se estiver em outro diretório, configure `ICTITE_BACKEND_DIR` com seu caminho absoluto. As portas 3100 e 8100 devem estar livres. O teste inicia frontend próprio e API real, migra um PostgreSQL descartável e usa uploads temporários. Não utiliza contas ou dados do ambiente de desenvolvimento. O diretório `.next-e2e` separa o compilador de teste da instância de desenvolvimento. Evite rodar `build` simultaneamente com E2E, porque o Next atualiza seus arquivos de tipos.

O roteiro cobre login inválido/válido, restrição entre perfis, criação administrativa de escola e convite, ativação da conta escolar, CEP/cidade/território, entidades do rascunho, anos opcionais vazios, salvamento/recarga, envio, rejeição com motivo, reabertura, reenvio, aprovação e consulta publicada. Também confere layout em 390 px e foco do modal nos dois temas. Relatório em `playwright-report/`; capturas e rastros de falhas em `test-results/`.

O workflow `checks.yml` executa testes, lint, build e build Docker. Para o job E2E, configure no GitHub:

- variável `BACKEND_REPOSITORY`: `organização/repositório` do backend;
- variável `BACKEND_REF`: branch/ref compatível, com `tests/e2e_server.py`; padrão `dev`;
- secret `BACKEND_READ_TOKEN`, se o backend for privado: token limitado à leitura desse repositório.

Sem essa configuração, o job apresenta erro explícito. Não utiliza credenciais reais. A execução remota só pode ser confirmada após publicar as alterações.

Para produção, configure as variáveis públicas do `.env.example` em `.env.production` e execute `docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build` depois do backend. A rede `ictite-production` é criada pelo Compose do backend; ambos devem usar o mesmo `ICTITE_NETWORK`, caso personalizado. A URL pública da API é fornecida durante o build; as chamadas do servidor usam `http://api:8000`. `FRONTEND_PORT` permite mudar a porta publicada (padrão 8010). Para hospedar na raiz, defina `NEXT_PUBLIC_BASE_PATH=` explicitamente.

Referência da configuração do servidor de testes: [documentação do Playwright](https://playwright.dev/docs/test-webserver).

## Dependências e ambiente de build

Atualização de segurança de 19/11: Next.js e `eslint-config-next` 16.4.6, Zod 4.6.7 e Vitest 4.1.12, com correções compatíveis das dependências transitivas no lockfile. Docker e CI usam Node 24 LTS; o Node 20 anterior já encerrou seu suporte, conforme a [tabela oficial de versões](https://nodejs.org/en/about/previous-releases). Os testes locais também são compatíveis com Node 22.18.

Execute `npm ci` para reproduzir o lockfile. O CI executa `npm audit --audit-level=moderate`, além dos testes, lint e builds. Após atualizar as dependências, reinicie o servidor de desenvolvimento para carregar a nova versão do Next.js. A atualização não altera o código nem a política do proxy de imagens.

## Envio e prorrogação do formulário

O envio cancela um pedido de prorrogação pendente. A concessão de prazo cancela o envio anterior e reabre o formulário, preservando os dados; as confirmações informam essas consequências antes da ação. Pedidos cancelados aparecem como `Cancelado` e permanecem no histórico. O console consulta o estado ao voltar à janela e a cada 15 segundos enquanto houver uma decisão pendente ou o formulário estiver fechado; alterações locais não salvas são preservadas. Esta versão utiliza a API com a migração `d9a6e7b80321` aplicada.
