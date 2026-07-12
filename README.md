# Download de Vídeo do YouTube (Node.js)

Script simples em Node.js que baixa um vídeo do YouTube a partir de um link salvo em uma variável.

Internamente ele usa o [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) (através do pacote `youtube-dl-exec`), que é a ferramenta mais estável e atualizada para baixar vídeos do YouTube. Isso evita o erro `403` comum nas bibliotecas JavaScript puras como o `ytdl-core`.

## Pré-requisitos

- **Node.js** versão 16 ou superior.

O binário do `yt-dlp` é baixado automaticamente na instalação das dependências — você não precisa instalar Python nem nada além.

## Instalação das dependências

Dentro da pasta do projeto:

```bash
npm install
```

> Esse comando também baixa o binário do `yt-dlp`, então precisa de acesso à internet.

## Como usar

1. Abra o arquivo `download.js`.
2. Altere o valor da variável `videoUrl` para o link do vídeo que deseja baixar:

```js
const videoUrl = "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI";
```

3. Execute o script:

```bash
npm start
```

ou

```bash
node download.js
```

O vídeo será salvo na pasta `downloads/` com o título do vídeo como nome do arquivo.

## Baixar em alta qualidade (1080p ou mais)

Por padrão, o script baixa o melhor arquivo único que já contém **vídeo + áudio juntos** (geralmente até 720p), pois isso não exige o `ffmpeg`.

Para baixar em resoluções mais altas (1080p, 1440p, 4K), o YouTube entrega vídeo e áudio em arquivos separados, e é necessário o `ffmpeg` para juntá-los:

1. Instale o ffmpeg:

**Linux (Debian/Ubuntu):**

```bash
sudo apt install ffmpeg
```

**Windows:**

A forma mais rápida é usar o [winget](https://learn.microsoft.com/pt-br/windows/package-manager/winget/) (já vem no Windows 10/11). Abra o PowerShell e rode:

```powershell
winget install ffmpeg
```

Depois feche e abra o terminal novamente para o `ffmpeg` ficar disponível no `PATH`. Para conferir, rode:

```powershell
ffmpeg -version
```

> Se preferir, você também pode usar o [Chocolatey](https://chocolatey.org/) (`choco install ffmpeg`) ou baixar o binário manualmente em [ffmpeg.org/download.html](https://ffmpeg.org/download.html) e adicionar a pasta `bin` ao `PATH`.

2. No arquivo `download.js`, mude a variável:

```js
const usarFfmpeg = true;
```

## Observações

- Baixe apenas conteúdos que você tem permissão para baixar, respeitando os Termos de Serviço do YouTube.
- Se o download parar de funcionar no futuro, atualize o `yt-dlp` rodando `npm install` novamente (ele pega a versão mais recente).
