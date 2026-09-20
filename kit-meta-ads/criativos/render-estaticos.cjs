// Playwright instalado fora do site. Veja LEIA-ME.txt para executar novamente.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {pathToFileURL} = require('node:url');
const runtime = process.env.ADS_RENDER_RUNTIME || path.join(os.tmpdir(), 'edevshub-ads-render');
const {chromium} = require(path.join(runtime, 'node_modules/playwright'));
const sharp = require(path.resolve(__dirname, '../../node_modules/sharp'));
const chrome = process.env.ADS_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const heights = {'4x5':1350,'1x1':1080,'9x16':1920};
const bg = [10,12,11];
(async () => {
  fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});
  const browser = await chromium.launch({executablePath:chrome,headless:true});
  const report = [];
  try {
    for (const [ratio,height] of Object.entries(heights)) for (const concept of ['c3','c4']) {
      const name = `${concept==='c3'?'c3-sistema-dor':'c4-sistema-prova'}-${ratio}.png`;
      const page = await browser.newPage({viewport:{width:1080,height},deviceScaleFactor:1});
      const url = pathToFileURL(path.join(__dirname,'template-estatico.html'));
      url.searchParams.set('concept',concept); url.searchParams.set('ratio',ratio);
      await page.goto(url.href);
      await page.evaluate(async () => {
        await Promise.all([document.fonts.load('700 116px "Space Grotesk"'),document.fonts.load('400 46px Inter'),document.fonts.load('600 30px Inter')]);
        await document.fonts.ready;
        const loaded=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replaceAll('"',''));
        if(!loaded.includes('Space Grotesk')||!loaded.includes('Inter'))throw new Error('Fonte real não carregou');
      });
      const geometry = await page.evaluate(() => {
        const rect=r=>({x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom});
        const elements=[...document.querySelectorAll('h1 .line,.offer .line,.price,.sig')].map(el=>{
          const range=document.createRange();range.selectNodeContents(el);
          return {text:el.textContent,rect:rect(range.getBoundingClientRect()),lines:range.getClientRects().length,font:getComputedStyle(el).fontSize};
        });
        const shared=Object.fromEntries(['.offer','.price','.rule','.sig'].map(sel=>[sel,{...rect(document.querySelector(sel).getBoundingClientRect()),font:getComputedStyle(document.querySelector(sel)).fontSize}]));
        return {elements,shared,titleLines:document.querySelectorAll('h1 .line').length};
      });
      assert.equal(geometry.titleLines,4);
      assert.deepEqual(geometry.elements.map(e=>e.text),[
        ...(concept==='c3'?['Sua operação','cresceu.','Seus sistemas,','não.']:['176 sistemas','entregues.','37 clientes voltaram','a me contratar.']),
        'Sistema ou app sob medida','para o jeito que você trabalha','A partir de R$ 5 mil · 2 a 4 semanas','Eduardo Gouveia · EDevsHub'
      ]);
      for(const e of geometry.elements){
        assert.equal(e.lines,1,`${name}: linha quebrada ${e.text}`);
        assert(e.rect.x>=65&&e.rect.right<=1015,`${name}: transbordamento horizontal ${e.text}`);
        assert(e.rect.y>=(ratio==='9x16'?269:0)&&e.rect.bottom<=(ratio==='9x16'?1248:height),`${name}: transbordamento vertical ${e.text}`);
      }
      const session=await page.context().newCDPSession(page);
      await session.send('DOM.enable');
      await session.send('CSS.enable');
      const {root}=await session.send('DOM.getDocument');
      const actualFonts={};
      for(const selector of ['h1','.offer','.price','.sig']){
        const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector});
        const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
        assert(fonts.length&&fonts.every(f=>f.isCustomFont),`${name}: fonte fallback ${selector}`);
        assert(fonts.every(f=>f.familyName.includes(selector==='h1'||selector==='.offer'?'Space Grotesk':'Inter')),`${name}: família de fonte incorreta`);
        actualFonts[selector]=fonts;
      }
      const buffer=await page.locator('#art').screenshot({type:'png'});
      const metadata=await sharp(buffer).metadata();
      assert.equal(metadata.width,1080);assert.equal(metadata.height,height);
      const {data,info}=await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
      const index=(10*info.width+10)*info.channels;
      assert.deepEqual([...data.subarray(index,index+3)],bg);
      const bounds={left:1080,top:height,right:0,bottom:0};
      const paletteCounts={'#e8efec':0,'#3fcf7f':0};
      for(let y=0;y<height;y++)for(let x=0;x<1080;x++){
        const i=(y*1080+x)*info.channels;
        if(data[i]===232&&data[i+1]===239&&data[i+2]===236)paletteCounts['#e8efec']++;
        if(data[i]===63&&data[i+1]===207&&data[i+2]===127)paletteCounts['#3fcf7f']++;
        if(data[i]!==bg[0]||data[i+1]!==bg[1]||data[i+2]!==bg[2]){
          bounds.left=Math.min(bounds.left,x);bounds.right=Math.max(bounds.right,x);
          bounds.top=Math.min(bounds.top,y);bounds.bottom=Math.max(bounds.bottom,y);
        }
      }
      assert(paletteCounts['#e8efec']>0&&paletteCounts['#3fcf7f']>0,`${name}: cor principal ausente`);
      assert(bounds.left>0&&bounds.right<1079&&bounds.top>0&&bounds.bottom<height-1,`${name}: conteúdo encostado no limite`);
      if(ratio==='9x16')assert(bounds.left>=65&&bounds.right<1015&&bounds.top>=269&&bounds.bottom<1248,`${name}: pixel fora da área segura`);
      const partner=report.find(r=>r.ratio===ratio);
      const sharedStart=Math.floor(geometry.shared['.offer'].y);
      const sharedHash=createHash('sha256').update(data.subarray(sharedStart*1080*info.channels)).digest('hex');
      if(partner)assert.deepEqual(geometry.shared,partner.geometry.shared,`${name}: bloco comum mudou de posição/tamanho`);
      if(partner)assert.equal(sharedHash,partner.sharedHash,`${name}: pixels do bloco comum diferem`);
      const mobile=path.join(__dirname,'qa',name.replace('.png','-360.png'));
      await sharp(buffer).resize({width:360}).png().toFile(mobile);
      fs.writeFileSync(path.join(__dirname,name),buffer);
      report.push({file:name,concept,ratio,width:metadata.width,height:metadata.height,background:'#0a0c0b',paletteCounts,titleLines:4,titleBreaks:concept==='c1'?'4':'2 + 2',noOverflow:true,safePixels:bounds,sharedHash,geometry,actualFonts,mobilePreview:path.relative(__dirname,mobile),mobileOfferPx:parseFloat(geometry.elements[4].font)/3,mobilePricePx:parseFloat(geometry.elements[6].font)/3,mobileVisualReview:'pending'});
      await page.close();
      console.log(`${name}: ${metadata.width}x${height}, fundo exato, 4 linhas, sem overflow; oferta/preço a 360px: ${report.at(-1).mobileOfferPx.toFixed(1)}/${report.at(-1).mobilePricePx.toFixed(1)}px`);
    }
    fs.writeFileSync(path.join(__dirname,'qa/verificacao.json'),JSON.stringify(report,null,2)+'\n');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
