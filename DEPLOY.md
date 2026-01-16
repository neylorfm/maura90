# Guia de Publicação no Vercel

Este projeto está pronto para ser publicado gratuitamente no Vercel. Siga os passos abaixo:

## Passo 1: Enviar para o GitHub
Se o seu projeto já está no GitHub, pule para o Passo 2. Caso contrário:
1.  Crie um novo repositório no GitHub.
2.  Envie o código:
    ```bash
    git add .
    git commit -m "Versão final para publicação"
    git branch -M main
    git remote add origin SEU_LINK_DO_GITHUB
    git push -u origin main
    ```

## Passo 2: Importar no Vercel
1.  Acesse [vercel.com](https://vercel.com) e faça login.
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Selecione seu repositório do GitHub (maura-90th-journey).
4.  Clique em **Import**.

## Passo 3: Configuração
O Vercel detectará automaticamente que é um projeto **Vite**.
-   **Framework Preset**: Vite
-   **Root Directory**: ./ (padrão)
-   **Build Command**: `vite build` (ou `npm run build`)
-   **Output Directory**: `dist`

Clique em **Deploy**.

## Passo 4: Acessar a Versão Automática
Após a publicação, você terá um link como `https://maura-90th.vercel.app`.

-   A versão normal estará na página inicial.
-   A versão automática para gravar o vídeo estará acessível clicando no **ícone de Play/Display** no canto superior direito, ou acessando diretamente:
    `https://SEU-SITE.vercel.app/video.html`

## Dica para Instagram
Para gravar o vídeo final usando o site publicado:
1.  Abra o link `/video.html` publicado.
2.  Use o gravador nativo do seu computador ou a função de gravar do próprio site (se funcionar no seu dispositivo móvel/desktop).
3.  A sincronização da música funcionará perfeitamente online.
