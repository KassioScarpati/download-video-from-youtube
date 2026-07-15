# Download de Vídeo do YouTube (Node.js)

Script simples em Node.js que baixa um vídeo do YouTube a partir de um link salvo em uma variável.

Internamente ele usa o [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) (através do pacote `youtube-dl-exec`), que é a ferramenta mais estável e atualizada para baixar vídeos do YouTube. Isso evita o erro `403` comum nas bibliotecas JavaScript puras como o `ytdl-core`.

## Pré-requisitos

- **Node.js** versão 16 ou superior.
- **Python 3.9 ou superior**, disponível no sistema como `python3` (ou `python` no Windows).

> O `Python 3` é exigido pelo pacote `youtube-dl-exec`, que faz uma verificação de versão durante o `npm install`. Sem ele, a instalação falha. Você **não** precisa instalar o `yt-dlp` manualmente: o binário é baixado automaticamente ao instalar as dependências.

## Instalação das dependências

Dentro da pasta do projeto:

```bash
npm install
```

> Esse comando também baixa o binário do `yt-dlp`, então precisa de acesso à internet.

## Configuração no Windows

No Windows pode ser necessário alguns passos extras antes do `npm install` funcionar. Todos os comandos abaixo devem ser executados no **PowerShell**.

1. **Liberar a execução de scripts** (resolve erros ao rodar o `npm`, que no Windows é um script `.ps1`):

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

2. **Instalar o Python 3** (exigido pelo `youtube-dl-exec`):

```powershell
winget install python
```

Feche e reabra o PowerShell depois de instalar, para o `python` ficar disponível no `PATH`. Para conferir:

```powershell
python --version
```

3. **Instalar as dependências:**

```powershell
npm install
```

> **Se o `npm install` já tiver falhado antes** (por exemplo, por causa da política de execução ou da falta do Python), apague a pasta `node_modules` e rode o `npm install` de novo para uma instalação limpa:
>
> ```powershell
> Remove-Item -Recurse -Force .\node_modules
> npm install
> ```

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

## Baixar apenas o áudio (mp3)

O YouTube guarda vídeo e áudio separadamente, então o `mp4` é apenas o formato que o script monta — dá pra baixar somente o áudio e convertê-lo em `mp3`.

Para isso, no arquivo `download.js`, mude a variável:

```js
const formato = "mp3"; // "mp4" (padrão) ou "mp3"
```

Com `formato = "mp3"`, o script baixa apenas a faixa de áudio na melhor qualidade e a converte para `mp3`.

> A conversão para mp3 **exige o `ffmpeg` instalado** (veja a seção acima). A variável `usarFfmpeg` é ignorada nesse modo, pois o `ffmpeg` é sempre necessário.

## Observações

- Baixe apenas conteúdos que você tem permissão para baixar, respeitando os Termos de Serviço do YouTube.
- Se o download parar de funcionar no futuro, atualize o `yt-dlp` rodando `npm install` novamente (ele pega a versão mais recente).
