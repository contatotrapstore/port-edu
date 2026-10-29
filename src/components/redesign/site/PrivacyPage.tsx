import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import SitePage from "./SitePage";
import { getSiteCopy } from "./copy";
import { localePath } from "./paths";

/**
 * Política de privacidade no design novo. O texto em português é o mesmo da
 * página atual, palavra por palavra; a versão em inglês é uma tradução dele,
 * sem condição nova, e diz que é tradução. Ao mudar a política, mudar as duas
 * versões (e a página antiga, enquanto EDH_NEW_SITE não for definitivo).
 */
export default function PrivacyPage({ locale }: { locale: Locale }) {
  const site = getSiteCopy(locale);
  const en = locale === "en";
  const hire = localePath("/contratar", locale).href;
  const email = siteConfig.social.email;
  const contato = email || (en ? "through the channel shown on the hiring page" : "pelo canal indicado na página de contratação");

  return (
    <SitePage locale={locale} ptPath="/politica-de-privacidade" source="politica">
      <section className="edh-pagehead" aria-labelledby="edh-page-title">
        <div className="edh-frame">
          <nav aria-label={site.crumbs.label}>
            <ol className="edh-crumbs">
              <li>
                <Link href={localePath("/", locale).href}>{site.crumbs.home}</Link>
              </li>
              <li aria-current="page">{en ? "Privacy policy" : "Política de privacidade"}</li>
            </ol>
          </nav>
          <h1 id="edh-page-title" className="edh-pagehead-title">
            {en ? "Privacy policy" : "Política de privacidade"}
          </h1>
          <p className="edh-pagehead-lead">{en ? "Last updated: September 2026" : "Última atualização: setembro de 2026"}</p>
        </div>
      </section>

      <section className="edh-ch edh-ch--paper">
        <div className="edh-frame">
          {en ? (
            <p className="edh-prose-note">
              This is an English translation of the Portuguese policy, provided for convenience.{" "}
              <Link href="/politica-de-privacidade" hrefLang="pt-BR" lang="pt-BR">
                Ver a política em português
              </Link>
              .
            </p>
          ) : null}
          {en ? (
            <div className="edh-prose">
              <section>
                <h2>Who processes the data</h2>
                <p>Eduardo Gouveia, independent full stack developer, responsible for the website edevshub.com. The contact for privacy matters is {contato}.</p>
              </section>
              <section>
                <h2>What data is collected</h2>
                <p>
                  <b>What you send.</b> When you start a conversation by WhatsApp or email, you share whatever you write in the message, usually your name, contact details and a description of the project.
                </p>
                <p>
                  <b>Meta ad forms.</b> When you request a project assessment through EDevsHub ads, you provide your name, phone number, optional email, project type and description, and whether the advertised budget suits you. Depending on the form, you may also be asked about the company, your role in the decision or the process you want to improve. Meta collects these answers and makes them available to EDevsHub. Do not include confidential information about your company or your clients.
                </p>
                <p>
                  <b>Browsing data.</b> The website uses Vercel Analytics, which measures page views and clicks without cookies and without identifying individual visitors.
                </p>
                <p>
                  <b>Meta Pixel.</b> The hiring page (<Link href={hire}>{hire}</Link>) and the portfolio pages load the Meta Pixel, from Meta Platforms, used to measure how many people who came from an ad on Facebook or Instagram arrived here and started a conversation. It stores cookies in your browser and sends Meta the address of the page visited and the click on the contact button. This enables remarketing, meaning you may see one of my ads again after visiting the website. The <b>/workana page does not load this pixel</b>.
                </p>
                <p>To opt out: the ad settings in your Meta account let you turn off advertising based on partner data, and blocking third-party cookies in your browser prevents the data from being sent. Neither changes how the website works.</p>
              </section>
              <section>
                <h2>What it is used for</h2>
                <p>To assess your project request, reply by the phone number, WhatsApp or email provided, prepare a proposal and, if you hire, carry out the project. The legal basis is the performance of a contract or the preliminary steps to it, under article 7 of the LGPD (Brazil’s General Data Protection Law).</p>
              </section>
              <section>
                <h2>Who I share it with</h2>
                <p>What you write to me stays in the tools used to serve you: WhatsApp, the email provider and, when hiring happens through the platform, Workana itself, each under its own service policy. Answers to ad forms are also processed by Meta under its own policies. The browsing data described above goes to Vercel and, on pages with the pixel, to Meta. I do not sell data, and I do not send the content of your messages to any advertising platform.</p>
              </section>
              <section>
                <h2>How long it is kept</h2>
                <p>In my records, conversations and form requests that do not become a project are deleted within 12 months. Retention by the platforms used follows each service’s policy. Data from hired projects is kept for the legal period required for tax and contract records.</p>
              </section>
              <section>
                <h2>Your rights</h2>
                <p>You may request at any time confirmation of processing, access, correction, anonymization, portability or deletion of your data, and you may withdraw consent. Just ask through the same channel we used to talk; I reply within 15 days.</p>
              </section>
            </div>
          ) : (
            <div className="edh-prose">
              <section>
                <h2>Quem trata os dados</h2>
                <p>Eduardo Gouveia, desenvolvedor full stack autônomo, responsável pelo site edevshub.com. O contato para assuntos de privacidade é {contato}.</p>
              </section>
              <section>
                <h2>Que dados são coletados</h2>
                <p>
                  <b>Os que você envia.</b> Ao iniciar uma conversa por WhatsApp ou e-mail, você compartilha o que escrever na mensagem — normalmente nome, contato e a descrição do projeto.
                </p>
                <p>
                  <b>Formulários de anúncios da Meta.</b> Ao solicitar uma avaliação de projeto pelos anúncios da EDevsHub, você informa nome, telefone, email opcional, tipo e descrição do projeto e compatibilidade com o investimento anunciado. Conforme o formulário, também podem ser solicitadas informações sobre a empresa, participação na decisão ou processo que deseja melhorar. A Meta coleta essas respostas e as disponibiliza à EDevsHub. Não inclua dados confidenciais da sua empresa ou de clientes.
                </p>
                <p>
                  <b>Dados de navegação.</b> O site usa o Vercel Analytics, que mede páginas vistas e cliques sem cookies e sem identificar visitantes individualmente.
                </p>
                <p>
                  <b>Meta Pixel.</b> A página <Link href={hire}>/contratar</Link> e as páginas de portfólio carregam o Meta Pixel, da Meta Platforms, usado para medir quantas pessoas que vieram de um anúncio no Facebook ou no Instagram chegaram até aqui e iniciaram uma conversa. Ele grava cookies no seu navegador e envia à Meta o endereço da página visitada e o clique no botão de contato. Isso permite remarketing, ou seja, você pode voltar a ver um anúncio meu depois de visitar o site. A página <b>/workana não carrega esse pixel</b>.
                </p>
                <p>Para recusar: as configurações de anúncios da sua conta na Meta permitem desativar a publicidade baseada em dados de parceiros, e bloquear cookies de terceiros no navegador impede o envio. Nenhuma das duas coisas muda o funcionamento do site.</p>
              </section>
              <section>
                <h2>Para que são usados</h2>
                <p>Para avaliar sua solicitação de projeto, responder pelo telefone, WhatsApp ou email informado, elaborar proposta e, se houver contratação, executar o projeto. A base legal é a execução de contrato ou os procedimentos preliminares a ele, conforme o art. 7º da LGPD.</p>
              </section>
              <section>
                <h2>Com quem compartilho</h2>
                <p>O que você me escreve fica nas ferramentas usadas para atender você: WhatsApp, provedor de e-mail e, quando a contratação acontece pela plataforma, a própria Workana, cada um sob a política do respectivo serviço. Respostas aos formulários de anúncios também são tratadas pela Meta conforme suas próprias políticas. Os dados de navegação descritos acima vão para a Vercel e, nas páginas com pixel, para a Meta. Não vendo dados, e não envio o conteúdo das suas mensagens para nenhuma plataforma de anúncio.</p>
              </section>
              <section>
                <h2>Por quanto tempo</h2>
                <p>Nos meus registros, conversas e solicitações de formulário que não viram projeto são descartadas em até 12 meses. A retenção pelas plataformas usadas segue as políticas de cada serviço. Dados de projetos contratados são mantidos pelo prazo legal de guarda fiscal e contratual.</p>
              </section>
              <section>
                <h2>Seus direitos</h2>
                <p>Você pode pedir a qualquer momento confirmação do tratamento, acesso, correção, anonimização, portabilidade ou exclusão dos seus dados, além de revogar o consentimento. Basta pedir pelo mesmo canal em que falamos — respondo em até 15 dias.</p>
              </section>
            </div>
          )}
        </div>
      </section>
    </SitePage>
  );
}
