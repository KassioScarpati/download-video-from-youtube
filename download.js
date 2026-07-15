const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { constants } = require("youtube-dl-exec");

// URL usada quando nenhum link é passado na linha de comando.
const DEFAULT_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

// Pasta onde os vídeos serão salvos.
const outputDir = path.join(__dirname, "downloads");

// ==========================================================
// Lê os argumentos da linha de comando.
//
//   node download.js                      -> URL padrão, qualidade baixa
//   node download.js <url>                -> vídeo escolhido, qualidade baixa
//   node download.js <url> --4k           -> melhor qualidade (4K/máxima)
//   node download.js <url> --mp3          -> apenas áudio em mp3
//
// As flags (--4k, --mp3) podem vir antes ou depois da URL.
// ==========================================================
function mostrarAjuda() {
  console.log(`
Uso: node download.js [url] [flag]

Baixa um vídeo do YouTube. Sem argumentos, baixa um vídeo de exemplo.
A flag pode vir antes ou depois da URL.

Flags:
  (nenhuma)   Vídeo em qualidade padrão (até ~720p)
  --4k        Melhor qualidade disponível (1080p/4K)   [requer ffmpeg]
  --mp3       Apenas o áudio, convertido para mp3       [requer ffmpeg]
  --help      Mostra esta ajuda

Exemplos:
  node download.js "https://youtu.be/ID"
  node download.js "https://youtu.be/ID" --4k
  node download.js --mp3 "https://youtu.be/ID"
`);
}

function lerArgumentos(argv) {
  const args = argv.slice(2);

  const flags = args.filter((arg) => arg.startsWith("--"));
  const url = args.find((arg) => !arg.startsWith("--")) || DEFAULT_URL;

  if (flags.includes("--help") || flags.includes("-h")) {
    mostrarAjuda();
    process.exit(0);
  }

  const quer4k = flags.includes("--4k");
  const querMp3 = flags.includes("--mp3");

  // Avisa sobre flags desconhecidas, mas segue com as reconhecidas.
  const flagsValidas = ["--4k", "--mp3", "--help", "-h"];
  flags
    .filter((flag) => !flagsValidas.includes(flag))
    .forEach((flag) => console.warn(`Aviso: flag desconhecida ignorada: ${flag}`));

  const formato = querMp3 ? "mp3" : "mp4";
  // Para mp3 o ffmpeg é sempre necessário; para 4K também.
  const usarFfmpeg = querMp3 || quer4k;

  return { url, formato, usarFfmpeg };
}

const { url: videoUrl, formato, usarFfmpeg } = lerArgumentos(process.argv);

function baixarVideo(url) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Caminho do binário do yt-dlp que o youtube-dl-exec baixou.
    const binPath = constants.YOUTUBE_DL_PATH;

    const args = [
      url,
      "--no-playlist",
      "-o",
      path.join(outputDir, "%(title)s.%(ext)s"),
    ];

    if (formato === "mp3") {
      // Baixa apenas o áudio e converte para mp3 (requer ffmpeg).
      args.push(
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0"
      );
    } else {
      // Sem ffmpeg: pega o melhor arquivo único que já contém vídeo + áudio.
      // Com ffmpeg: pega o melhor vídeo + melhor áudio e junta em .mp4.
      args.push(
        "-f",
        usarFfmpeg ? "bestvideo*+bestaudio/best" : "best[ext=mp4]/best"
      );

      if (usarFfmpeg) {
        args.push("--merge-output-format", "mp4");
      }
    }

    const descricao =
      formato === "mp3"
        ? "áudio (mp3)"
        : usarFfmpeg
        ? "vídeo (melhor qualidade / 4K)"
        : "vídeo (qualidade padrão)";
    console.log(`Iniciando download de ${url}`);
    console.log(`Modo: ${descricao}`);

    // Executamos o binário diretamente com o spawn do Node, que lida
    // corretamente com espaços no caminho (ao contrário do youtube-dl-exec).
    const proc = spawn(binPath, args, { stdio: "inherit" });

    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`yt-dlp finalizou com código de erro ${code}`));
      }
    });
  });
}

baixarVideo(videoUrl)
  .then(() => {
    console.log("\nDownload concluído com sucesso!");
    console.log(`Arquivo salvo na pasta: ${outputDir}`);
  })
  .catch((erro) => {
    console.error("\nOcorreu um erro ao baixar o vídeo:");
    console.error(erro.message || erro);
    process.exit(1);
  });
