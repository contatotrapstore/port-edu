Análise Técnica Completa — Pioneer "Corn. Revolutionized."
Fiz uma análise profunda desse site, e ele é um exemplo magistral de web experience imersiva criado pelo estúdio Resn (agência premiada da Nova Zelândia). Aqui vai tudo que você precisa saber para recriar esse nível no seu portfólio com Claude Code.

Stack Tecnológico Identificado
O site roda inteiramente em uma única canvas WebGL fullscreen (position: absolute, 1541x905) com body overflow: hidden — ou seja, não existe scroll nativo do browser. Todo o conteúdo visual, texto e interação é renderizado dentro do canvas via Three.js.
Bibliotecas confirmadas:

Three.js r102 (WebGL 1.0) — motor 3D principal
GSAP (TweenMax + TweenLite + TimelineMax) — toda a orquestração de animações e transições
GLTFLoader — para carregar modelos 3D
ShaderMaterial + RawShaderMaterial — shaders customizados
CompressedTextureLoader — texturas KTX comprimidas
BufferGeometry + InstancedBufferGeometry — geometria otimizada para partículas

Arquitetura do bundle:

loader.js → carrega assets antes de mostrar a experiência
vendors~main.js → dependências (Three.js, GSAP, etc.)
main.js → código da aplicação
Tudo com hash Webpack (76ceb4644b28bd9c30b5)


Anatomia dos Efeitos Visuais
1. Modelo 3D do Milho (Hero)

9 modelos GLTF separados: SingleStalk12_db.gltf, KERNAL.gltf, stalk_rigged3.gltf, cobb_test.gltf, hair.gltf, pot3.gltf, bg_pot.gltf
O milho é composto por peças modulares (espiga, folhas, cabelo, caule) cada uma com rigging independente
Texturas tipo SingleStalk_DifF_0007@mipmaps.ktx e revealMap.ktx indicam um sistema de reveal progressivo — a espiga vai se revelando conforme o scroll

2. Partículas DNA (Chapter 1 - Science)

Usa THREE.Points com BufferGeometry para milhares de partículas
As partículas formam uma dupla hélice que gira continuamente
Partículas verdes menores no fundo criam profundidade (efeito de "dados genéticos")
Linhas de partículas douradas/laranjas formam traços com trail effect (provavelmente instanced lines com alpha fadeout)

3. Texturas Comprimidas (KTX)

38 texturas KTX (formato Basis Universal) — compressão GPU-nativa
Inclui texturas de solo (soil_default, soil-normal, soil-displacement, soil_nutrients_clay/loam/sand), nuvens (map-cloud-noise), mapas de campo (map-field-diffuse), e mapas de iluminação (map_matcap_mult, map_matcap_screen)
Matcap shading para iluminação rápida e bonita sem computar luzes

4. Texto Renderizado no WebGL (MSDF)

Fontes Manifold e Gilroy com atlas MSDF (Multi-channel Signed Distance Field)
Cada fonte tem um .json (dados dos glifos) e .png (atlas de textura)
O texto gigante ("CORN. REVOLUTIONIZED.", "FIRST, A SOLID FOUNDATION.") é renderizado como geometria dentro do canvas, permitindo composição perfeita com a cena 3D
Efeito de texto outline/stroke também é feito via shader MSDF

5. Post-Processing

post-noise.png indica efeito de film grain sobreposto
gradient-map.png para color grading (gradiente de cor verde escuro ➝ dourado)


Padrões de Interação
Scroll-jacking total: O scroll do mouse não move a página — ele avança o "tempo" da animação. Cada tick do scroll desloca a câmera 3D e trigger transições entre cenas. Isso é implementado com um normalizer de scroll que converte deltaY em uma progressão 0→1 que alimenta a timeline do GSAP.
Navegação por Capítulos: O menu (hamburger no topo esquerdo) abre um overlay fullscreen com transição suave. Clicar em um capítulo dispara uma transição animada entre cenas com efeito de "diagonal wipe" (cortina diagonal) visível na transição.
Elementos interativos dentro do canvas: O botão "EXPLORE THE LIBRARY" é um elemento circular renderizado no próprio WebGL com detecção de mouse hover/click.
Indicador de progresso lateral: A bolinha à direita funciona como scroll indicator, mostrando a posição dentro do capítulo.

Como Recriar Esse Nível no Seu Portfólio com Claude Code
Aqui está a arquitetura que eu recomendo:
Substituições inteligentes para 2025/2026:
Onde o site da Pioneer usa Three.js r102, você pode usar Three.js r160+ ou React Three Fiber (R3F) se preferir a integração com React. Para animações, GSAP 3.x com ScrollTrigger substituiria o sistema customizado de scroll-jacking com muito menos código. Para texto 3D, a lib troika-three-text é superior ao MSDF manual e funciona out-of-the-box.
Stack recomendada para o portfólio:
O framework base seria Next.js 14+ ou Astro para SSR/SSG e SEO (que o site da Pioneer sacrifica por ser 100% canvas). A camada 3D rodaria com React Three Fiber + Drei (helpers como <Text3D>, <Float>, <Environment>). A animação seria controlada por GSAP 3 + ScrollTrigger para scroll-driven animations, ou Framer Motion para micro-interações. O pós-processamento usaria @react-three/postprocessing com efeitos de bloom, noise e vignette. Os modelos 3D seriam criados em Blender e exportados como .glb comprimidos com Draco.
Estrutura de seções adaptada para portfólio:
A Hero seria uma cena 3D impactante com seu nome e título ("Full Stack Developer") em texto 3D flutuando com partículas ao redor. A seção About teria uma transição de câmera suave descendo para um novo cenário com seu avatar ou objeto representativo. Projects mostraria cards 3D que rotacionam on-hover, com screenshots dos projetos flutuando no espaço. Skills usaria um sistema de partículas onde cada partícula é uma tecnologia, organizadas em clusters por categoria. Contact fecharia com uma cena final atmospheric.
O que pedir ao Claude Code:
Para iniciar o projeto, peça algo como: "Crie um portfólio Next.js com React Three Fiber que tenha scroll-driven 3D scenes com GSAP ScrollTrigger. A hero section deve ter texto 3D com partículas flutuantes, transições suaves entre seções controladas pelo scroll, e um sistema de navegação com capítulos laterais." Quebre em etapas: primeiro a cena base com câmera, depois adicione seções uma a uma, depois as transições, e por último os polimentos (post-processing, partículas, hover effects).
Complexidade estimada: O site da Pioneer levou provavelmente 3-6 meses com uma equipe dedicada da Resn. Uma versão portfólio adaptada, com Claude Code te ajudando, levaria 2-4 semanas de trabalho focado, chegando a 80% do impacto visual com 20% da complexidade.

https://cornrevolution.resn.global/#science

Queria uma analise a fundo gostaria de fazer um site assim porém para meu portfolio de programador full stack mas nesse nivel de animação e ideia no claude code