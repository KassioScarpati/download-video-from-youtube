const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { constants } = require("youtube-dl-exec");

// ==========================================================
// Cole aqui o link do vídeo do YouTube que deseja baixar.
// ==========================================================
const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

// Pasta onde os vídeos serão salvos.
const outputDir = path.join(__dirname, "downloads");

// Formato do download: "mp4" (vídeo) ou "mp3" (apenas áudio).
const formato = "mp3";

// Se você instalar o ffmpeg (sudo apt install ffmpeg), pode trocar para true
// e o script baixará a melhor qualidade disponível (1080p+), juntando
// vídeo e áudio automaticamente.
// (Ignorado quando formato = "mp3", pois o ffmpeg é sempre necessário nesse caso.)
const usarFfmpeg = true;

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

    console.log("Iniciando download...");

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
