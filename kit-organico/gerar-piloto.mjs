import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const width = 1080;
const height = 1350;
// Crop an existing real capture. No generative editing of the interface.
const screen = await sharp(path.join(here, '../public/images/projects/mudapaisagens.webp'))
  .extract({ left: 356, top: 151, width: 646, height: 370 })
  .resize(908, 520).png().toBuffer();
const typography = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">
<rect width="1080" height="1350" fill="#07110b" opacity=".18"/>
<g font-family="Arial, sans-serif">
  <text x="72" y="90" fill="#edf5ee" font-size="30" font-weight="700">EDevsHub</text>
  <text x="72" y="152" fill="#9bccaa" font-size="19" letter-spacing="2">INTEGRAÇÕES · MUDA PAISAGENS</text>
  <g font-size="64" font-weight="700" letter-spacing="-2">
    <text x="69" y="255" fill="#f2f5ef">O atendimento termina.</text>
    <text x="69" y="327" fill="#f2f5ef">Os dados chegam</text>
    <text x="69" y="399" fill="#70e497">ao seu CRM?</text>
  </g>
  <text x="72" y="471" fill="#d1ded4" font-size="27">WhatsApp → qualificação → Pipefy</text>
  <rect x="70" y="530" width="940" height="555" rx="12" fill="#101c15" stroke="#739f7e" stroke-opacity=".55"/>
  <text x="73" y="1130" fill="#c9d8cd" font-size="22">Tela original do fluxo no Make.</text>
  <text x="73" y="1165" fill="#c9d8cd" font-size="22">Integração explicada no portfólio.</text>
  <path d="M72 1210 H690" stroke="#91b29b" stroke-opacity=".4"/>
  <text x="72" y="1260" fill="#f0f5ee" font-size="27" font-weight="700">Veja o case em edevshub.com</text>
</g></svg>`);
await sharp(path.join(here, 'midia/fundo-higgsfield.png')).resize(width, height)
  .composite([{ input: typography }, { input: screen, left: 86, top: 547 }])
  .png().toFile(path.join(here, 'midia/piloto-muda-paisagens.png'));
console.log('Criado: kit-organico/midia/piloto-muda-paisagens.png (1080×1350)');
