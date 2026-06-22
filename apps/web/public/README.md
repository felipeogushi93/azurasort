# public/

Arquivos estaticos servidos na raiz do site.

## Video real do palco (cena "Palco com Apresentadora")

1. Coloque seu MP4 aqui, ex: `apps/web/public/stage.mp4`
   (clipe gerado por IA — Runway/Veo/Kling/Luma — ou stock licenciado).
2. Em `apps/web/lib/demoSpecs.ts`, troque `STAGE_VIDEO_URL` para `"/stage.mp4"`.

O player (`VideoReveal`) usa o video como fundo e sobrepoe a frase localizada
("E o premio vai para...") + o cartao que abre no @ do vencedor — tudo
sincronizado pela mesma timeline. Sem video, mostra o placeholder de palco em CSS.

Formato ideal: vertical 1080x1920 (9:16), ~8-9s, mudo.
