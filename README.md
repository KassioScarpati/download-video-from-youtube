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

Você passa o link do vídeo (e opcionalmente uma flag de qualidade/formato) direto na linha de comando — não precisa editar o código.

**Baixar o vídeo padrão em qualidade normal:**

```bash
node download.js
```

**Baixar um vídeo específico em qualidade normal:**

```bash
node download.js "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI"
```

> Coloque a URL entre aspas para evitar problemas com caracteres especiais (como `&`) no terminal.

O vídeo será salvo na pasta `downloads/` com o título do vídeo como nome do arquivo.

### Flags disponíveis

| Flag | O que faz | Precisa de ffmpeg? |
|------|-----------|--------------------|
| _(nenhuma)_ | Vídeo em qualidade padrão (arquivo único, até ~720p) | Não |
| `--4k` | Melhor qualidade disponível (1080p, 1440p, 4K), juntando vídeo + áudio | Sim |
| `--mp3` | Baixa apenas o áudio e converte para `mp3` | Sim |

A flag pode vir antes ou depois da URL do YouTube:

```bash
node download.js "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI" --4k
node download.js --4k "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI"

node download.js "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI" --mp3
node download.js --mp3 "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI"
```

> **Atenção:** a flag precisa vir **depois** de `download.js`. Não use `node --4k download.js ...`, pois o Node interpreta a flag como opção dele e o comando falha.

Para ver um resumo das opções, use `--help`:

```bash
node download.js --help
```

Você também pode rodar o vídeo padrão com `npm start`. Para passar argumentos via npm, use `--` como separador:

```bash
npm start -- "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI" --4k
```

## Alta qualidade (`--4k`) e mp3 (`--mp3`) exigem o ffmpeg

As flags `--4k` e `--mp3` precisam do `ffmpeg` instalado:

- **`--4k`**: por padrão o YouTube entrega o vídeo em qualidade alta com vídeo e áudio em arquivos separados, e o `ffmpeg` é quem os junta.
- **`--mp3`**: o `ffmpeg` é quem converte a faixa de áudio para `mp3`.

Se você usar essas flags sem o `ffmpeg` instalado, o download falha. Para instalá-lo:

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

Com o `ffmpeg` instalado, é só usar as flags:

```bash
node download.js "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI" --4k
node download.js "https://www.youtube.com/watch?v=SEU_VIDEO_AQUI" --mp3
```

## Reproduzindo os vídeos (use o VLC)

Recomendamos usar o [VLC](https://www.videolan.org/vlc/) para assistir aos vídeos baixados, principalmente os de alta qualidade (`--4k`).

Nessas resoluções o YouTube entrega o vídeo em codecs modernos (como VP9 e AV1), que o player padrão do Ubuntu (GNOME Vídeos) muitas vezes **não consegue reproduzir**. O VLC já vem com os codecs necessários embutidos e abre esses arquivos sem problema.

No Ubuntu, você pode instalar o VLC com:

```bash
sudo apt install vlc
```

## Observações

- Baixe apenas conteúdos que você tem permissão para baixar, respeitando os Termos de Serviço do YouTube.
- Se o download parar de funcionar no futuro, atualize o `yt-dlp` rodando `npm install` novamente (ele pega a versão mais recente).
