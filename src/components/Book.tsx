import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Chapter from './Chapter';
import DataTable from './DataTable';
import TeacherButton from './TeacherButton';
import { chapterQuestions } from '../data/questions';
import { UserAnswers, Question } from '../types/questions';
import { loadAnswers, saveAnswers } from '../utils/storage';
import Pagination from './Pagination';
import MinhaVersao from './MinhaVersao';
import ProducaoTexto from './ProducaoTexto';
import ProducaoFinal from './ProducaoFinal';
import ProducaoTextoNoticia from './ProducaoTextoNoticia';
import ProducaoTextoFabula from './ProducaoTextoFabula';
import CaixaTexto from './CaixaTexto';
import QuestionRenderer from './QuestionRenderer';
import ContinuaProximaPagina from './ContinuaProximaPagina';
import CriteriosAvaliacao from './CriteriosAvaliacao';
import DownloadQuestionsButton from './DownloadQuestionsButton';
import DescobertasCard from './DescobertasCard';
import TeacherButtonContentHeading from './TeacherButtonContentHeading';
import BolaDeMeiaQuestion from './BolaDeMeiaQuestion';
import CabriolaTituloInterativo from './CabriolaTituloInterativo';
import MatchConnectQuestion, { type MatchConnectItem } from './MatchConnectQuestion';

const pag16Img = (n: number) => `/images/pag16_img${n}.png`;

const MATCH_PAG16_LEFT: MatchConnectItem[] = [1, 2, 3].map((n) => ({
  id: `pag16-left-${n}`,
  imageSrc: pag16Img(n),
  alt: '',
}));

/** Ordem fixa na coluna da direita (embaralhada em relação à esquerda). */
const MATCH_PAG16_RIGHT_ORDER = [4, 5, 6] as const;

const MATCH_PAG16_RIGHT: MatchConnectItem[] = MATCH_PAG16_RIGHT_ORDER.map((imgNum, i) => ({
  id: `pag16-right-${i}`,
  imageSrc: pag16Img(imgNum),
  alt: '',
}));

function Book() {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showTeacherView, setShowTeacherView] = useState(false);
  const [currentPage, setCurrentPage] = useState(10);

  useEffect(() => {
    setUserAnswers(loadAnswers());
  }, []);

  useEffect(() => {
    // Detecta qual página está visível na viewport
    const updateCurrentPage = () => {
      const paginationElements = document.querySelectorAll('[data-page]');
      let visiblePage = 4; // padrão
      let closestToTop = Infinity;

      paginationElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const page = parseInt(el.getAttribute('data-page') || '4');

        // Verifica se o elemento está visível na viewport
        if (rect.top >= 0 && rect.top < window.innerHeight && rect.bottom > 0) {
          // Se está visível, escolhe a página mais próxima do topo
          if (rect.top < closestToTop) {
            closestToTop = rect.top;
            visiblePage = page;
          }
        }
      });

      // Se nenhuma página está visível no topo, verifica qual está mais próxima do topo
      if (closestToTop === Infinity) {
        paginationElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const page = parseInt(el.getAttribute('data-page') || '4');
          const distanceFromTop = Math.abs(rect.top);

          if (distanceFromTop < closestToTop) {
            closestToTop = distanceFromTop;
            visiblePage = page;
          }
        });
      }

      setCurrentPage(visiblePage);
    };

    // Verifica imediatamente
    updateCurrentPage();

    // Atualiza quando o usuário faz scroll
    window.addEventListener('scroll', updateCurrentPage);
    window.addEventListener('resize', updateCurrentPage);

    // Observa mudanças no DOM
    const observer = new MutationObserver(updateCurrentPage);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('scroll', updateCurrentPage);
      window.removeEventListener('resize', updateCurrentPage);
      observer.disconnect();
    };
  }, []);

  const handleAnswerChange = (questionId: string, answer: any) => {
    const updatedAnswers = {
      ...userAnswers,
      [questionId]: answer,
    };
    setUserAnswers(updatedAnswers);
    saveAnswers(updatedAnswers);
  };


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Atualiza a página após o scroll terminar
    setTimeout(() => {
      setCurrentPage(10);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-200 w-full">
      <div className="mx-auto bg-white shadow-2xl overflow-hidden" style={{ maxWidth: '63%', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="p-8 md:p-12">
          {/* Paginação */}
          <Pagination currentPage={currentPage} />
          <Pagination currentPage={11} />
          {/* Botão do professor – Página 4 */}
          <div className="my-6">
            <TeacherButton

              content={
                <>
                  <TeacherButtonContentHeading>Campos de experiências
                    da BNCC</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>
                      O eu, o outro e o nós
                    </li>
                    <li>
                      Escuta, fala, pensamento
                      e imaginação
                    </li>
                  </ul>
                  <TeacherButtonContentHeading>Objetivos de
                    aprendizagem e
                    desenvolvimento da BNCC</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">EI03EO01; EI03EO03; EI03EO04;
                    EI03EF01; EI03EF06.</p>
                  <TeacherButtonContentHeading>Expectativas de
                    aprendizagem</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Compreender e respeitar os
                      combinados do grupo.</li>
                    <li>Demonstrar atitudes solidárias e
                      colaborativas junto ao grupo em
                      diferentes situações cotidianas.</li>
                    <li>Expressar os próprios sentimentos com clareza.</li>
                    <li>Relatar gostos e necessidades.</li>
                    <li>Utilizar palavras novas em
                      situações comunicativas.</li>
                    <li>Opinar sobre assuntos abor
                      dados em assembleia e/ou nas
                      rodas de conversa.</li>
                    <li>Expressar-se por meio de
                      diferentes linguagens, com
                      acréscimo de detalhes.</li>
                    <li>Contar oralmente histórias do
                      próprio interesse (narrativas
                      ficcionais e/ou pessoais) com
                      acréscimo de detalhes.</li>
                    <li>Produzir histórias com interfe
                      rência, tendo por base narrati
                      vas que já conhece.</li>

                  </ul>
                  <TeacherButtonContentHeading>Você precisa de...</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>
                      Almofadas (1 por criança).
                    </li>
                    <li>
                      Tapete grande.
                    </li>
                  </ul>
                  <TeacherButtonContentHeading>Desenvolvimento das
                    atividades</TeacherButtonContentHeading>
                  <ol className="list-decimal marker:text-[#832c87] marker:font-bold ml-6">
                    <li>
                      Convide as crianças a se acomo
                      darem confortavelmente sobre
                      o tapete e as almofadas. Sugira
                      que se organizem em roda para
                      que toda a turma possa ter o
                      mesmo acesso visual à ilustração
                      de abertura das <strong>páginas 10 e 11</strong>
                      do Livro do aluno. A ilustração de
                      abertura se relaciona, direta ou
                      indiretamente, com o que será
                      visto e vivenciado ao longo das
                      quatro unidades deste bloco.
                    </li>
                    <li>Incentive as crianças a observar
                      o que está acontecendo na abertura, prestando atenção ao cenário e às ações das crianças da
                      Turminha SAE. Pergunte se essa cena é familiar para elas e se já vivenciaram algo semelhante. É importante que as
                      crianças se sintam à vontade para expressar suas ideias, de maneira que respeitem
                      os combinados da turma sobre esses momentos de conversa. Por ser um momento
                      espontâneo, não é necessário que todas as crianças falem, mas aqueles que desejarem contribuir devem se sentir acolhidos.</li>
                    <li>Em seguida, direcione o olhar das crianças para os elementos que aparecem na
                      ilustração: <em>Além dos personagens, o que mais aparece na cena? Você já visitou
                        algum lugar como esse em que eles estão? Como o dia parece estar?</em> </li>
                    <li>Depois, faça algumas perguntas mais direcionadas, de modo que as crianças compartilhem suas vivências em relação ao que está acontecendo na cena: <em>Você já
                      brincou de alguma dessas brincadeiras que os personagens estão participando?
                      De quais? De qual delas você mais gosta? Que objeto diferente está sendo usado
                      no boliche? Quais brincadeiras você conhece que têm regras?</em> </li>
                    <li>Com base nas respostas das crianças, destaque os seguintes elementos: a Amarelinha,
                      desenhada no chão; a bola e os pinos do boliche; a bola e trave no futebol; e a dança,
                      próxima ao aparelho de som com um tecido.</li>
                    <li>Chame a atenção da turma para a cena da dança: <em>Por que será que a personagem
                      Janaína está segurando um tecido enquanto dança? Você já viu alguma dança em
                      que as pessoas usam tecidos ou outros objetos? Será que existem danças que só
                      é possível acontecer em grupo?</em> Compartilhe com a turma que nosso país tem uma
                      grande variedade de músicas e danças, cite o exemplo das quadrilhas de festa
                      junina, que são um exemplo de dança em grupo. </li>
                    <li>Conte às crianças que as brincadeiras ilustradas na imagem de abertura serão experienciadas ao longo do bloco, nas diferentes atividades das quatro unidades. Caso
                      ainda não tenham mencionado ou perguntado, informe às crianças o título do bloco <em>Quanta energia eu tenho para brincar!</em> e peça a elas que comentem a relação que
                      percebem entre o título e a ilustração, bem como o que imaginam que farão ao longo
                      das unidades. Parta da ideia de “energia” e pergunte: <em>O que é energia?</em> É possível
                      que as crianças associem o termo à eletricidade, e não à ação ou à disposição; assim,
                      acolha as possibilidades e direcione a conversa com as crianças: <em>Como nosso corpo
                        fica quando estamos com energia? De onde será que vem a energia para brincar?
                        Como ficamos quando não temos energia?</em>
                    </li>
                    <li>Sempre que possível, aguce a curiosidade das crianças e anime-as a comentar a
                      respeito do assunto ou a levantar hipóteses sobre ele, discutindo e trocando informações e experiências com os colegas.</li>
                  </ol>
                  <TeacherButtonContentHeading>Conteúdo digital</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">No <em>link</em>, você encontra a
                    seção “Observação ativa” e outras sugestões para enriquecer
                    a prática pedagógica.</p>
                  <a href="https://go.sae.digital/OtvnHy">https://go.sae.digital/OtvnHy</a>
                </>
              }
            />
          </div>
          {/* PÁGINA 10 e 11 – título estilizado + imagem de fundo */}
          <div className="flex flex-col items-center mb-4">
            <div
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                borderRadius: '999px',
                backgroundColor: '#ffffff',
                border: '4px solid #832c87',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#00A99D',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
                QUANTA ENERGIA EU TENHO
                <br />
                <span style={{ fontSize: '20px' }}>PARA BRINCAR!</span>
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundImage: 'url("/images/criancas.jpg")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '100%',
              paddingTop: '68.25%', // mantém proporção aproximada 16:9 e ajusta com a largura
            }}
          />

          {/* PÁGINA 12 e 13 – título estilizado + imagem de fundo */}
          <Pagination currentPage={12} />
          <Pagination currentPage={13} />
          {/* Botão do professor – Página 5 */}
          <div className="my-6">
            <TeacherButton

              content={
                <>
                  <TeacherButtonContentHeading>Campos de experiências
                    da BNCC</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>
                      O eu, o outro e o nós
                    </li>
                    <li>
                      Escuta, fala, pensamento
                      e imaginação
                    </li>
                    <li>Espaços, tempos, quantidades,
                      relações e transformações</li>
                  </ul>
                  <TeacherButtonContentHeading>Objetivos de
                    aprendizagem e
                    desenvolvimento da BNCC</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">EI03EO01; EI03EO03; EI03EO04;
                    EI03EF01; EI03EF03; EI03EF06;
                    EI03ET06.</p>
                  <TeacherButtonContentHeading>Expectativas de
                    aprendizagem</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Compreender e respeitar os
                      combinados do grupo.</li>
                    <li>Demonstrar atitudes solidárias e
                      colaborativas junto ao grupo em
                      diferentes situações cotidianas.</li>
                    <li>Expressar os próprios sentimentos com clareza.</li>
                    <li>Utilizar palavras novas em
                      situações comunicativas.</li>
                    <li>Opinar sobre assuntos abordados em assembleia e/ou nas
                      rodas de conversa.</li>
                    <li>Expressar-se por meio de
                      diferentes linguagens, com
                      acréscimo de detalhes.</li>
                    <li>Realizar uma pseudoleitura.</li>
                    <li>Reconhecer ilustração e escrita
                      e diferenciá-las.</li>
                    <li>Contar oralmente histórias do
                      próprio interesse (narrativas
                      ficcionais e/ou pessoais) com
                      acréscimo de detalhes.</li>
                    <li>Produzir histórias com interferência, tendo por base narrativas que já conhece.</li>
                    <li>Relatar oralmente fatos marcantes do cotidiano usando
                      noções temporais.</li>

                  </ul>
                  <TeacherButtonContentHeading>Você precisa de...</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>
                      Almofadas (1 por criança).
                    </li>
                    <li>
                      Tapete grande.
                    </li>
                  </ul>
                  <TeacherButtonContentHeading>Desenvolvimento das
                    atividades</TeacherButtonContentHeading>
                  <ol className="list-decimal marker:text-[#832c87] marker:font-bold ml-6">
                    <li>Proponha às crianças que se
                      sentem em roda sobre as almofadas e o tapete para apreciar
                      novamente uma ilustração, dessa vez referente à abertura da
                      unidade “As brincadeiras e suas
                      regras”. Depois que as <strong>páginas
                        12</strong> e <strong>13</strong> do Livro do aluno forem
                      identificadas, apresente a cena às crianças e não intervenha na leitura da imagem, a fim de que possam interpretá-la com autonomia. Caso elas façam comentários, lembre-as de respeitar a vez
                      de os colegas falarem e de ouvi-los com atenção.</li>
                    <li>Em seguida, direcione o olhar das crianças para outros aspectos que elas podem
                      não ter percebido: <em>Onde estão os personagens? Eles estão na quadra de esportes
                        da escola. Quais elementos na cena podem indicar que este é realmente o ambiente da quadra de esportes? Todas as crianças estão fazendo a mesma coisa?
                        Alguma dessas brincadeiras já apareceu, de alguma forma, na abertura do bloco?</em></li>
                    <li>Prossiga com os questionamentos, dessa vez chamando a atenção da turma para
                      as ações dos personagens: <em>O que Ane, Laura e Pedro estão fazendo? Será que
                        usarão esse brinquedo em alguma atividade? Qual a diferença dessa bola que eles
                        estão segurando para as outras?</em> Explore com as crianças a ideia de que os per
                      sonagens (Ane, Laura e Pedro) estão confeccionando uma bola de meia. Embora
                      seja possível fazê-la sozinho, essa bola pode ser usada em brincadeiras coletivas.</li>
                    <li>Pergunte, ainda: <em>O que Júlia está fazendo? Será que é fácil ou difícil brincar com
                      bambolê? Para que mais os bambolês podem ser utilizados? Do que será que Guto
                      e Toni estão brincando? Parece ser divertido?</em> Reforce com as crianças que os personagens estão em um aula de Educação Física, e se essa for a realidade da turma,
                      peça-lhes que comparem a cena com as aulas que costumam ter. </li>
                    <li>Retome com as crianças que brincadeiras como essas podem acontecer em outros
                      momentos da rotina, não apenas durante a aula de Educação Física. No entanto,
                      alguns jogos, como o basquete que Gui e Janaína estão jogando, podem ser mais bem trabalhados em uma aula de Educação Física, pois exigem mais tempo para
                      aprender as regras e realizar exercícios repetitivos.</li>
                    <li>Finalize a discussão sobre a página dupla dizendo o título da unidade “As brincadeiras e suas regras” e pergunte: <em>O que são regras? Para que elas servem? Onde
                      existem regras? Será que existem regras nas brincadeiras? Se alguém não cumprir
                      uma regra, o que pode acontecer? Quem sabe explicar ou dar um exemplo de uma
                      regra que temos na escola? E que regras temos em nossa turma?</em></li>
                    <li>Para encerrar a exploração da cena, desperte a curiosidade das crianças em relação às próximas páginas, que trazem sequências didáticas sobre diversos tipos de
                      brincadeiras, incluindo aquelas com bolas – um objeto geralmente muito apreciado
                      pelas crianças.</li>
                  </ol>
                  <TeacherButtonContentHeading>Conteúdo digital</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">No <em>link</em>, você encontra a
                    seção “Observação ativa” e outras sugestões para enriquecer
                    a prática pedagógica.</p>
                  <a href="https://go.sae.digital/OtvnHy">https://go.sae.digital/OtvnHy</a>
                </>
              }
            />
          </div>
          <div className="flex flex-col items-center mb-4">
            <div
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                borderRadius: '999px',
                backgroundColor: '#ffffff',
                border: '4px solid #832c87',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#00A99D',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
                AS BRINCADEIRAS E SUAS REGRAS
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundImage: 'url("/images/capa2.jpg")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '100%',
              paddingTop: '68.25%', // mantém proporção aproximada 16:9 e ajusta com a largura
            }}
          />
          <DescobertasCard
            text={`NESTA UNIDADE, VOCE
VAI CONHECER ALGUMAS
BRINCADEIRAS TRADICIONAIS
E SUAS VARIACOES, ALEM DE
COMPREENDER AS REGRAS DE
CADA UMA DELAS. PREPARE-SE
PARA BRINCAR E SE DIVERTIR!`}
          />
          <Pagination currentPage={14} />
          {/* Botão do professor – Página 14 */}
          <div className="my-6">
            <TeacherButton

              content={
                <>
                  <TeacherButtonContentHeading>Campos de experiências
                    da BNCC</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>
                      O eu, o outro e o nós
                    </li>
                    <li>Corpo, gestos e movimentos</li>
                    <li>Traços, sons, cores e formas</li>
                    <li>
                      Escuta, fala, pensamento
                      e imaginação
                    </li>
                    <li>Espaços, tempos, quantidades,
                      relações e transformações</li>
                  </ul>
                  <TeacherButtonContentHeading>Objetivos de
                    aprendizagem e
                    desenvolvimento da BNCC</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">EI03EO01; EI03EO07; EI03CG01;
                    EI03CG05; EI03TS02; EI03EF01;
                    EI03EF02; EI03EF03; EI03EF07;
                    EI03ET01; EI03ET05.</p>
                  <TeacherButtonContentHeading>Expectativas de
                    aprendizagem</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Respeitar as produções
                      dos colegas.</li>
                    <li>Compreender e respeitar os
                      combinados do grupo.</li>
                    <li>Ampliar gradativamente a
                      capacidade de resolver problemas no cotidiano escolar.</li>
                    <li>Cumprir as regras estabelecidas.</li>
                    <li>Ampliar os movimentos direcionados que o próprio corpo
                      pode realizar.</li>
                    <li>Desenvolver ações motoras
                      combinadas para impulsão
                      (saltitar, saltar e pular).</li>
                    <li>Controlar voluntariamente as
                      ações motoras.</li>
                    <li>Ampliar a habilidade motora
                      fina por meio de atividades de
                      desenho e pintura (na totalidade
                      e respeitando o limite da figura).</li>
                    <li>Expressar-se livremente fazendo
                      uso de diferentes linguagens.</li>
                    <li>Opinar sobre assuntos abordados em assembleia e/ou nas
                      rodas de conversa.</li>
                    <li>Expressar-se por meio de diferentes linguagens com acréscimo de detalhes.</li>
                    <li>Brincar com a sonoridade das
                      palavras em situações diversas.</li>
                    <li>Realizar uma pseudoleitura.</li>
                    <li>Identificar a orientação da
                      escrita (da esquerda para a
                      direita, de cima para baixo).</li>
                    <li>Identificar letras conhecidas.</li>
                    <li>Conhecer diferentes gêneros
                      textuais.</li>
                    <li>Comparar diferentes objetos para
                      perceber as diferenças (cores,
                      formas, tamanhos e funções).</li>
                    <li>Classificar objetos de acordo com dois ou mais atributos (cor, tamanho ou forma).</li>
                    <li>Utilizar termos relativos a tamanho (grande, pequeno, maior e menor).</li>

                  </ul>
                  <TeacherButtonContentHeading>Você precisa de...</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Meia (1 por criança). Solicitar com antecedência para as famílias.</li>
                    <li>Papel Kraft.</li>
                    <li>Caneta hidrocor azul.</li>
                    <li>Riscantes diversos, tais como: lápis de cor, giz de cera e caneta hidrocor.</li>
                    <li>Bolas de diferentes tipos, tamanhos e materiais (se não for possível, providenciar
                      imagens de diversas bolas).</li>
                    <li>Página 1 do Material de apoio.</li>
                    <li>Folhas de revista, jornal ou rascunhos.</li>
                    <li>Cola.</li>
                    <li>Lápis-grafite (1 por criança).</li>

                  </ul>
                  <TeacherButtonContentHeading>Desenvolvimento das
                    atividades</TeacherButtonContentHeading>
                  <ol className="list-decimal marker:text-[#832c87] marker:font-bold ml-6">
                    <li>Reúna as crianças em roda e convide-as a compartilhar as suas brincadeiras preferidas. Em seguida, comente que em muitas brincadeiras podemos usar bolas, então
                      pergunte quais brincadeiras com bola elas conhecem e que gostam de brincar.
                      Nesse momento, conforme as crianças forem falando, registre as brincadeiras em
                      um cartaz de papel Kraft, com letra bastão e em tamanho adequado, de modo que
                      toda a turma possa acompanhar a escrita.</li>
                    <li>Assim que o cartaz estiver finalizado, faça a leitura dos nomes das brincadeiras e,
                      para dar mais significado ao cartaz, convide as crianças a desenhar as brincadeiras
                      que mencionaram. Os desenhos podem ser feitos diretamente no cartaz (se houver
                      espaço), ou você pode distribuir pequenos pedaços de papel a cada criança e, em
                      seguida, colar os desenhos juntos ao cartaz.</li>
                    <li>Proponha às crianças que reflitam sobre o que é uma bola e suas características.
                      Pergunte: <em>Se tivéssemos que descrever uma bola para alguém que nunca viu uma,
                        como faríamos isso? Quais são os diferentes tamanhos de bolas que conhecemos?
                        Você já viu bolas feitas de materiais diferentes? </em></li>
                    <li>Na sequência, convide as crianças a participar de uma brincadeira com uma bola
                      diferente. Procure instigar a curiosidade delas sobre qual será a bola utilizada na
                      brincadeira e qual será a brincadeira, contando a elas que vão produzir sua própria
                      bola. Acolha as hipóteses e revele que farão uma bola de meia. Antes de iniciar a
                      produção da bola, explique o passo a passo de como ela será feita. Depois, convide
                      as crianças a destacar as imagens instrucionais da <strong>página 1</strong> do Material de apoio. </li>
                    <li>Entregue, então, a meia e as folhas de papel rascunho, jornal ou revista a cada criança
                      e convide a turma a observar as imagens do Material de apoio e reproduzir cada uma
                      das etapas para confeccionar a bola corretamente. Garanta que todas compreenderam bem o que será feito e, caso não tenham entendido, retome a etapa que gerou
                      dificuldade e, se necessário, explique todo o processo de confecção novamente.</li>
                    <li>Assim que a bola de meia estiver pronta, peça às crianças que colem as imagens
                      destacadas nos espaços correspondentes da <strong>página 14</strong> do Livro do aluno. Leve-as a perceber que as imagens devem ser coladas de acordo com
                      a lista de materiais utilizados e
                      com as etapas de confecção da
                      bola.  Há dois locais de colagem:
                      no primeiro, devem ser coladas
                      apenas as imagens dos materiais e, no segundo, o passo a
                      passo da confecção da bola de
                      acordo com os números de 1 a 4.</li>
                    <li>Faça a leitura das regras da
                      brincadeira Batata quente e, se
                      possível, leve as crianças até
                      um espaço amplo e motive-as
                      a brincar com apenas uma das
                      bolas confeccionadas.</li>
                    <div style={{
                      backgroundColor: '#b0deda',
                      padding: '10px',
                    }}>
                      <p style={{
                        color: '#803494',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '10px',
                      }}>Batata quente</p>
                      <p><strong>Material:</strong></p>
                      <p>- Uma bola de meia.</p>
                      <p><strong>Como brincar:</strong></p>
                      <p>Todas as crianças devem se sentar em roda no chão. Em seguida,
                        devem passar a bola de mão em
                        mão e cantar: “Batata quente,
                        quente, quente, quente, quente,
                        quente... queimou!”. Quando a
                        cantiga terminar, quem ficar com
                        a bola quando for dito “queimou!” deve “pagar uma prenda”.</p>
                    </div>
                    <li>As “prendas” podem ser com
                      binadas com a turma com antecedência e escritas em cartões.
                      Alguns exemplos: “Repita o
                      trava-língua: O rato roeu a roupa do rei de Roma”; “Ande em
                      câmera lenta”; “Dê um salto o
                      mais alto possível”, “Desenhe
                      de olhos fechados”; “Chute uma
                      bola o mais longe que conseguir”; “Imite um cachorro” etc.</li>
                    <li>Em seguida, convide as crianças
                      a conhecer mais uma brincadeira
                      em que a bola de meia será utilizada. Faça a leitura das regras da
                      brincadeira Cabriola, cadê a bola?,
                      disponível na <strong>página 15</strong> do Livro
                      do aluno, e motive-as a localizar
                      e pintar o título da brincadeira.
                      Depois, incentive-as a identificar
                      e contornar as rimas presentes
                      do título: “bola” e “cabriola”. Se
                      necessário, retome as explorações com as rimas vivenciadas
                      em blocos anteriores. Depois de
                      as crianças compreenderem as
                      regras, motive-as a brincar com
                      os colegas.</li>
                    <li>Aproveite para contar às crianças que a palavra “cabriola”
                      significa salto de cabra, pirueta, cambalhota ou salto de uma
                      criança dado por motivo de
                      alegria. Por isso, pode-se dizer
                      que, na brincadeira, a bola “salta” quando é lançada para cima.</li>
                    <li>Pergunte às crianças que outras
                      brincadeiras que têm regras elas
                      conhecem e questione-as: <em>Para
                        que servem as regras nas brincadeiras e jogos? O que pode
                        acontecer se alguém não seguir
                        uma regra?</em> Leve-as a perceber
                      que as regras são importantes
                      porque garantem segurança e
                      organizam a brincadeira ou o
                      jogo. Sem regras, todos os par
                      ticipantes poderiam fazer o que
                      quisessem, gerando confusão.
                      Sem elas, o jogo ficaria confuso
                      e menos divertido. Além disso,
                      reforce que as regras, no geral,
                      ensinam as pessoas a se respeitarem e contribuem para o convívio em sociedade. </li>
                    <li>Em seguida, mostre imagens
                      de diferentes bolas, tanto bolas
                      que são utilizadas em esportes e
                      possivelmente conhecidas pelas
                      crianças (vôlei, futebol, basquete, tênis) como outras bolas diversas (bola de boliche, bolinhas
                      de plástico coloridas, bola de lã).
                      Aproveite esse momento para
                      fazer comparações de tamanhos, de peso e especialmente
                      de  formato e design de cada
                      uma. Pergunte: <em>Alguém tem al
                        guma dessas bolas em casa?
                        Com que tipo de bola vocês
                        mais costumam brincar?</em> Caso
                      seja possível, leve algumas bolas para as crianças vivenciarem
                      uma experiência real de compa
                      ração dos tamanhos e pesos.</li>
                    <li>Após a conversa, peça às crianças que liguem as imagens das
                      bolas aos jogos aos quais elas
                      pertencem na <strong>página 16</strong>. Se você
                      perceber alguma dificuldade das
                      crianças em associar as bolas
                      aos jogos, auxilie e, se necessário, para enriquecer ainda mais
                      o repertório, você pode mostrar
                      um vídeo relacionado ao assunto. Ainda na página 16 do Livro
                      do aluno, peça às crianças que
                      escrevam sua brincadeira ou jogo
                      com bola favorito.</li>
                    <li>Depois de explorar diferentes
                      tipos de bolas, peça às crianças
                      que escrevam, como souberem,
                      o nome dos jogos aos quais as
                      bolas da <strong>página 17</strong> do Livro do
                      aluno pertencem. Ao final, fale
                      sobre a importância de utilizar a
                      bola adequada para determinado tipo de brincadeira ou jogo. </li>
                  </ol>
                  <TeacherButtonContentHeading>Conteúdo digital</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">No <em>link</em>, você encontra a
                    seção “Observação ativa” e outras sugestões para enriquecer
                    a prática pedagógica.</p>
                  <a href="https://go.sae.digital/OtvnHy">https://go.sae.digital/OtvnHy</a>

                  <p className="mb-4 indent-6">
                    <strong>Resposta atividade:</strong>
                  </p>
                  <img src="/images/resposta_pag14.png" alt="" className="noborder" style={{ cursor: 'default' }} />
                </>
              }
            />
          </div>


          <p className="mb-4 indent-6">
            VAMOS BRINCAR COM UMA BOLA DIFERENTE?
          </p>
          <p className="mb-4 indent-6">
            OBSERVE NO MATERIAL DE APOIO AS IMAGENS DO PASSO A PASSO DE
            COMO MONTAR UMA BOLA DE MEIA. DEPOIS, DESTAQUE E COLE AS
            IMAGENS NA ORDEM CORRETA.
          </p>
          <img src="/images/icons-2j.png" alt="" className="noborder" style={{ cursor: 'default', width: '15%', height: 'auto' }} />
          <CaixaTexto title='Bola de meia'>
            <BolaDeMeiaQuestion />

          </CaixaTexto>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>VOCÊ CONHECE A BRINCADEIRA <strong>BATATA QUENTE</strong>? OUÇA AS REGRAS
              QUE O(A) PROFESSOR(A) VAI LER E DIVIRTA-SE COM OS AMIGOS!</li>
          </ul>
          <Pagination currentPage={15} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-4">
                  Espera-se que as crianças pintem o título <em>Cabriola, cadê a bola?</em>
                  </p>
                  <p className="mb-4">
                  Espera-se que as crianças contornem a rima <em>Cabriola</em> e <em>bola</em> no título.
                  </p>
                </>
              }

            />
          </div>
          <p className="mb-4 indent-6">
            QUE TAL CONHECER OUTRA BRINCADEIRA COM BOLA DE MEIA? OUÇA
            A LEITURA DAS REGRAS QUE O(A) PROFESSOR(A) VAI FAZER.
          </p>
          <img src="/images/icons-2a.png" alt="" className="noborder" style={{ cursor: 'default', width: '15%', height: 'auto' }} />
          <CaixaTexto title=''>
            <div className="mb-4 indent-6">
              <CabriolaTituloInterativo />
            </div>
            <p className="mb-4 indent-6">
              <strong>MATERIAL</strong>: BOLA DE MEIA
            </p>

            <p className="mb-4 indent-6">
              <strong>COMO BRINCAR:</strong>
            </p>
            <p className="mb-4 indent-6">
              <span style={{ color: '#00776E', fontWeight: 'bold' }}>1. </span> TODA A TURMA FAZ UMA VOTAÇÃO E ESCOLHE QUEM SERÁ
              A CABRIOLA.
            </p>
            <p className="mb-4 indent-6">
              <span style={{ color: '#00776E', fontWeight: 'bold' }}>2. </span> A CABRIOLA, SEM OLHAR PARA TRÁS, JOGA A BOLA PARA
              O ALTO, EM DIREÇÃO ÀS OUTRAS CRIANÇAS.
            </p>
            <p className="mb-4 indent-6">
              <span style={{ color: '#00776E', fontWeight: 'bold' }}>3. </span> ALGUÉM PEGA E ESCONDE A BOLA ATRÁS DE SI MESMO, SEM
              QUE A CABRIOLA VEJA.
            </p>
            <p className="mb-4 indent-6">
              <span style={{ color: '#00776E', fontWeight: 'bold' }}>4. </span> AS OUTRAS CRIANÇAS TAMBÉM FICAM COM AS MÃOS PARA
              TRÁS PARA DISFARÇAR.
            </p>
            <p className="mb-4 indent-6">
              <span style={{ color: '#00776E', fontWeight: 'bold' }}>5. </span> EM SEGUIDA, TODA A TURMA PERGUNTA: “CABRIOLA, CADÊ
              A BOLA?”, E A CABRIOLA TEM TRÊS CHANCES DE ADIVINHAR
              QUAL CRIANÇA ESTÁ ESCONDENDO A BOLA.
            </p>
            <p className="mb-4 indent-6">
              <span style={{ color: '#00776E', fontWeight: 'bold' }}>6. </span> SE A CABRIOLA CONSEGUIR ADIVINHAR, A CRIANÇA QUE
              ESCONDEU A BOLA VIRA A NOVA CABRIOLA. SE NÃO
              ADIVINHAR, A CABRIOLA CONTINUA A MESMA E O JOGO
              SEGUE.
            </p>
          </CaixaTexto>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>PINTE O TÍTULO DA BRINCADEIRA.</li>
            <li>NO TÍTULO DA BRINCADEIRA TEM UMA RIMA. COM AJUDA DOS 
            COLEGAS, DESCUBRA A RIMA E FAÇA UM CONTORNO NELA.</li>
          </ul>

          <Pagination currentPage={16} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    Respostas:
                  </p>
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q4');
                    if (question && question.type === 'text-input' && question.subQuestions) {
                      return question.subQuestions.map((subQ) => (
                        <p key={subQ.letter} className="mb-3">
                          {question.number !== undefined && (
                            <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                          )}
                          <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                          <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                        </p>
                      ));
                    }
                    return null;
                  })()}
                  <p>Na trilha do texto: EF69LP03, EF69LP16, EF69LP17, EF06LP01, EF67LP03, EF67LP06, EF67LP37. Estimule uma leitura comparativa desde
                    o início do trabalho com o Texto II, mesmo que as atividades de contraste direto apareçam mais adiante no capítulo.
                    A sequência de atividades propostas após a leitura do segundo texto conduz os alunos à observação da estrutura, das
                    escolhas de vocabulário e do ponto de vista da autora, culminando em uma comparação mais sistematizada entre os dois textos. O quadro comparativo contribui para tornar visível a variação na
                    organização dos parágrafos, nos temas priorizados e nos efeitos de sentido
                    produzidos por cada texto. Na atividade final, os alunos devem relacionar
                    essas diferenças aos perfis editoriais dos portais, o que promove a formação
                    de leitores mais críticos e conscientes da influência dos meios de comunicação na construção de notícias.
                  </p>
                </>

              }
            />
          </div>
          <p className="mb-4 indent-6">
          LIGUE AS IMAGENS DAS BOLAS AOS JOGOS EM QUE ELAS SÃO 
          USADAS. DEPOIS, PINTE AS BOLAS COMO DESEJAR. 
          </p>
          <img src="/images/icones_registros.png" alt="" className="noborder" style={{ cursor: 'default', width: '15%', height: 'auto' }} />
          <div className="my-8">
            <MatchConnectQuestion
              leftItems={MATCH_PAG16_LEFT}
              rightItems={MATCH_PAG16_RIGHT}
              storageKey="livro:ligar-pag16-bolas-jogos"
              hint="Clique em uma imagem da esquerda: a linha segue o mouse ou o dedo. Depois clique na imagem correspondente à direita para fechar a ligação."
            />
          </div>

          <Pagination currentPage={9} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    Respostas:
                  </p>
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q5');
                    if (question && question.type === 'true-false' && question.statements) {
                      return question.statements.map((stmt) => {
                        // Se tiver correção, mostra V/F primeiro e depois a correção. Se não, mostra apenas V ou F
                        const correctAnswerText = stmt.correctAnswer ? 'Verdadeiro (V)' : 'Falso (F)';
                        const answerText = stmt.correction
                          ? `${correctAnswerText}. ${stmt.correction}`
                          : correctAnswerText;

                        return (
                          <p key={stmt.letter} className="mb-3">
                            {question.number !== undefined && (
                              <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                            )}
                            <span style={{ color: '#00776E', fontWeight: 'bold' }}>{stmt.letter}) </span>
                            <span dangerouslySetInnerHTML={{ __html: answerText }} />
                          </p>
                        );
                      });
                    }
                    return null;
                  })()}
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q6');
                    if (question && question.type === 'text-input' && question.subQuestions) {
                      return question.subQuestions.map((subQ) => (
                        <p key={subQ.letter} className="mb-3">
                          {question.number !== undefined && (
                            <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                          )}
                          <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                          <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                        </p>
                      ));
                    }
                    return null;
                  })()}
                </>
              }

            />
          </div>
          <CaixaTexto title=''>
            <p className="mb-4 indent-6"><strong>Robôs para a vida</strong></p>
            <p className="mb-4 indent-6">
              As marcas também vão levar opções de robôs que ajudam no dia a dia (ou simplesmente fazem companhia), como aqueles que cozinham, fazem café, distribuem medicamentos, pintam e jogam basquete, por exemplo.
            </p>
            <p className="mb-4 indent-6">
              No “Robot Mall”, os visitantes podem acessar uma área de entretenimento para assistir esportes robóticos, incluindo futebol e eventos de atletismo. Vale lembrar que a China foi o primeiro país do mundo a criar torneios esportivos para robôs, como a World Robot Soccer League, relatada pelo Olhar Digital.
            </p>
            <p className="mb-4 indent-6">
              O formato da nova loja cria uma experiência de “playground de tecnologia”, bem longe do showroom tradicional: aqui, o público é encorajado a interagir com os produtos. No restaurante do shopping, aliás, garçons robôs servem pratos preparados por… chefs robóticos.
            </p>
            <p className="mb-4 indent-6"><strong>O poder da China</strong></p>
            <p className="mb-4 indent-6">
              Com esse projeto, a China tira o foco de novidades futuristas e busca normalizar a interação entre humanos e robôs na vida diária [...]. É uma estratégia que posiciona o país não só como fabricante líder, mas também na integração com estilos de vida.
            </p>
            <p className="mb-4 indent-6">
              E isso vem com apoio financeiro. No ano passado, o governo chinês liberou mais de US$ 20 bilhões (R$ 108 bilhões) em subsídios para ajudar startups de inteligência artificial e robótica – e planeja ampliar o fundo para US$ 137 bilhões (R$ 744 bilhões).
            </p>
            <p className="mb-4 indent-6">
              O shopping foi inaugurado na mesma semana em que é realizada a Conferência Mundial de Robôs de 2025, precedendo também os primeiros Jogos Mundiais de Robôs Humanoides, marcados para o período entre 14 e 17 de agosto.
            </p>
          </CaixaTexto>
          <p
            className="mt-2 mb-6"
            style={{
              fontFamily: 'Ubuntu, sans-serif',
              color: '#000000',
              fontSize: '10px',
            }}
          >
            BARONE, Bruna. <em>China inaugura o primeiro "shopping de robôs" do mundo.</em> Disponível em: <a href="https://epocanegocios.globo.com/tecnologia/noticia/2025/08/china-inaugura-primeira-loja-que-une-venda-servico-e-pecas-para-robos-humanoides.ghtml" target="_blank" rel="noopener noreferrer">https://epocanegocios.globo.com/tecnologia/noticia/2025/08/china-inaugura-primeira-loja-que-une-venda-servico-e-pecas-para-robos-humanoides.ghtml</a>. Acesso em: 23 set. 2025.
          </p>
          {/* Questão intercalada no conteúdo */}
          <QuestionRenderer
            question={chapterQuestions.chapter1[4]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          {/* Questão intercalada no conteúdo */}
          <QuestionRenderer
            question={chapterQuestions.chapter1[5]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          {/* Botão de download das questões */}
          <div className="my-6">
            <DownloadQuestionsButton
              questions={[chapterQuestions.chapter1[4], chapterQuestions.chapter1[5]]}
              userAnswers={userAnswers}
              title="Questões da Página 9"
              fileName="questoes-pagina-9.pdf"
            />
          </div>
          <Pagination currentPage={10} />
          {/* Conteúdo do botão do professor - Tabela comparativa */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    Respostas:
                  </p>
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q7');
                    if (question && question.type === 'table-fill') {
                      return (
                        <>
                          {/* Respostas da tabela */}
                          {question.correctAnswer && (
                            <>
                              <p className="mb-2 font-semibold">
                                {question.number !== undefined && (
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                )}
                                Tabela:
                              </p>
                              {question.rows.map((row) => {
                                const correctAnswers = question.correctAnswer!;
                                // Obtém o primeiro campo da row (primeira coluna)
                                const firstColumnKey = Object.keys(row).find(key => key !== 'id') || 'paragraph';
                                const firstColumnValue = row[firstColumnKey] || '';

                                // Gera os fieldIds para cada coluna (exceto a primeira)
                                const columnAnswers = question.columns.slice(1).map((columnName, colIndex) => {
                                  const fieldId = `${question.id}_${row.id}_col${colIndex + 1}`;
                                  return {
                                    columnName,
                                    answer: correctAnswers[fieldId] || ''
                                  };
                                });

                                return (
                                  <div key={row.id} className="mb-4">
                                    <p className="mb-2 font-semibold" style={{ color: '#0E3B5D' }}>
                                      {question.columns[0]} {firstColumnValue}:
                                    </p>
                                    {columnAnswers.map((colAnswer, idx) => (
                                      <p key={idx} className="mb-1">
                                        <strong>{colAnswer.columnName}:</strong> {colAnswer.answer}
                                      </p>
                                    ))}
                                  </div>
                                );
                              })}
                            </>
                          )}
                          {/* Respostas das subquestões */}
                          {question.subQuestions && question.subQuestions.length > 0 && (
                            <>
                              <p className="mb-2 mt-4 font-semibold">Subquestões:</p>
                              {question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ))}
                            </>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q8');
                    if (question && question.type === 'text-input') {
                      // Se tiver subquestões, renderiza cada uma
                      if (question.subQuestions && question.subQuestions.length > 0) {
                        return question.subQuestions.map((subQ) => (
                          <p key={subQ.letter} className="mb-3">
                            {question.number !== undefined && (
                              <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                            )}
                            <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                            <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                          </p>
                        ));
                      }
                      // Se não tiver subquestões, renderiza a resposta direta
                      if (question.correctAnswer) {
                        return (
                          <p className="mb-3">
                            {question.number !== undefined && (
                              <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                            )}
                            <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                          </p>
                        );
                      }
                    }
                    return null;
                  })()}
                </>
              }
            />
          </div>
          {/* Questão intercalada no conteúdo - Tabela comparativa */}
          <QuestionRenderer
            question={chapterQuestions.chapter1[6]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          {/* Questão intercalada no conteúdo */}
          <QuestionRenderer
            question={chapterQuestions.chapter1[7]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          {/* Botão de download das questões */}
          <div className="my-6">
            <DownloadQuestionsButton
              questions={[chapterQuestions.chapter1[8], chapterQuestions.chapter1[9], chapterQuestions.chapter1[10]]}
              userAnswers={userAnswers}
              title="Questões da Página 10"
              fileName="questoes-pagina-10.pdf"
            />
          </div>
          <Pagination currentPage={11} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    EF69LP06, EF69LP07, EF69LP08, EF67LP09, EF67LP10, EF67LP32, EF67LP33, EF06LP05, EF06LP06, EF06LP11, EF06LP12,
                    EF67LP36. Antes da produção, retome com a turma os elementos essenciais da estrutura da notícia: título, linha-fina, lide,
                    corpo e fechamento. Enfatize que o foco da atividade não é apenas repetir informações, mas selecionar, organizar e redigir
                    uma notícia com um ponto de vista consciente e intencional, respeitando as características do gênero. A proposta favorece a construção da autonomia escritora e o desenvolvimento da habilidade de tomar decisões comunicativas, competências centrais para a formação de leitores e produtores conscientes de textos.

                  </p>
                </>
              }
            />
          </div>
          <MinhaVersao />
          <p className="mb-4 indent-6">
            Você leu duas notícias diferentes sobre a inauguração do Robot Mall, na China. Agora, sua tarefa será produzir uma nova versão dessa notícia, com base nas escolhas que considerar mais importantes, interessantes ou relevantes para o leitor. Para isso, utilize os dados principais dos dois textos, as observações registradas no quadro comparativo e as análises realizadas ao longo do capítulo.
          </p>
          <p className="mb-4 indent-6"><strong>Preparação</strong></p>
          <p className="mb-4 indent-6">Sua notícia deve conter os elementos listados a seguir.
          </p>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li><strong>Título </strong>: chamativo e informativo, que antecipe o assunto e indique o enfoque escolhido
              para o texto.  </li>
            <li><strong>Linha-fina </strong>: complementar ao título, com um dado ou uma ideia que aprofunde o tema.  </li>
            <li><strong>Lide </strong>: com as informações essenciais (o que, quem, quando, onde, como e por quê).  </li>
            <li><strong>Corpo da notícia </strong>: detalhado, com informações adicionais, exemplos, citações (caso
              deseje utilizá-las), contexto e possíveis desdobramentos.  </li>
            <li><strong>Fechamento </strong>: conclusivo, com uma informação final que dê sentido de encerramento.  </li>
          </ul>
          <p className="mb-4 indent-6"><strong>Produção</strong></p>
          <p className="mb-4 indent-6">Durante a produção, refita sobre o tipo de informação que você vai destacar e que
            elementos e dados das duas notícias você considera essenciais e precisa manter em
            sua produção.
          </p>
          <p className="mb-4 indent-6"><strong>Avaliação</strong></p>
          <p className="mb-4 indent-6">Antes de finalizar a sua versão, confira o <em>checklist</em> a seguir para aprimorá-la.
          </p>
          {/* Tabela de Critérios de Avaliação */}
          <CriteriosAvaliacao
            instanceId="producao_texto"
            criterios={[
              {
                id: 'criterio_titulo',
                nome: 'TÍTULO',
                pergunta: 'Apresenta o assunto principal de forma atrativa?',
              },
              {
                id: 'criterio_linha_fina',
                nome: 'LINHA-FINA',
                pergunta: 'Complementa o título com uma informação importante ou que aprofunda o assunto?',
              },
              {
                id: 'criterio_lide',
                nome: 'LIDE',
                pergunta: 'Apresenta as informações essenciais (o quê, quem, quando, onde) de forma clara?',
              },
              {
                id: 'criterio_corpo',
                nome: 'CORPO DA NOTÍCIA',
                pergunta: 'Desenvolve o assunto de forma organizada e completa?',
              },
              {
                id: 'criterio_linguagem',
                nome: 'LINGUAGEM',
                pergunta: 'Utiliza linguagem objetiva e adequada ao gênero notícia?',
              },
              {
                id: 'criterio_foco',
                nome: 'FOCO',
                pergunta: 'Mantém o foco no fato noticiado sem expressar opinião?',
              },
            ]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
          />
          <Pagination currentPage={12} />
          <ProducaoTexto instanceId="producaoTexto1" />
          <Pagination currentPage={13} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    EF69LP16, EF69LP17, EF69LP19, EF06LP01, EF67LP03. Nesta seção, os alunos ampliam sua compreensão sobre o gênero notícia ao explorar como ele é adaptado para veículos audiovisuais, como a televisão. O objetivo é reconhecer as mudanças que ocorrem no texto quando ele é planejado para ser falado e assistido, e não apenas lido.
                  </p>
                  <p className="mb-3">
                    EF69LP16, EF69LP17, EF69LP19, EF06LP01, EF67LP03. Apresente a adaptação da notícia para o telejornal, destacando
                    elementos como entonação, uso de linguagem mais simples, comentários expressivos e sequenciamento mais natural. Oriente os alunos a ler o texto em voz alta para que percebam as marcas de oralidade e a maneira como os temas
                    discutidos anteriormente são apresentados nesse formato. As atividades propostas permitem identificar informações principais (como em uma notícia convencional); reconhecer marcas da linguagem oral e recursos do suporte audiovisual; comparar a estrutura da notícia falada com a da notícia escrita; e refletir sobre os efeitos de sentido criados por
                    cada forma de apresentação.
                  </p>
                </>
              }
            />
          </div>
          <TeacherButtonContentHeading>Quando a notícia vai para a TV</TeacherButtonContentHeading>
          <p className="mb-4 indent-6">A notícia é um texto que informa um fato, com estrutura organizada e linguagem objetiva. Essa estrutura geralmente segue o modelo de pirâmide invertida: primeiro aparecem as informações mais importantes e, depois, os detalhes no corpo da notícia.
          </p>
          <p className="mb-4 indent-6">Mas, quando a notícia é adaptada para outras mídias, como a televisão, o rádio ou os <em>podcasts</em>, alguns elementos mudam.
          </p>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>O título e o lide são falados por quem apresenta a notícia.  </li>
            <li>O tom oral e o ritmo das frases marcam a narração, com pausas naturais e repetições.  </li>
            <li>O corpo da notícia e seu desfecho são frequentemente desenvolvidos de forma multimodal, incorporando recursos linguísticos expressivos, como emoção, jogos de palavras e comentários de efeito, característicos desse tipo de cobertura, e elementos visuais e audiovisuais, como imagens, vídeos do ocorrido ou do local dos fatos, gráficos, infográficos, ilustrações, entre outros.
            </li>

          </ul>

          <p className="mb-4 indent-6">
            Leia, a seguir, a transcrição de duas notícias exibidas em telejornais. Atente à escolha das palavras e às diferenças desse formato em relação às notícias lidas anteriormente.
          </p>
          <p className="mb-4 indent-6"><strong>Texto III</strong></p>
          <CaixaTexto title=''>
            <p className="mb-4 indent-6">
              Em Pequim, robôs humanoides disputam um campeonato nada convencional. Futebol, boxe, atletismo… Em vez de atletas de carne e osso, quem brigou foram as máquinas com cara e corpo de gente. Pequim sediou a Olimpíada dos Robôs Humanoides. Na cerimônia de abertura, breakdance, artes marciais e música ao vivo. Mas, na hora da competição, a coisa era séria. Na partida de futebol, teve goleada e comemoração exagerada, com direito a queda dramática que precisou de socorro humano para sair de campo. O evento testa inteligência artificial, coordenação motora e resistência das máquinas, que ainda tropeçam, mas já dão um show. Engenheiros aproveitaram cada segundo para anotar as categorias e preparar os robôs para a próxima edição do campeonato.
            </p>
          </CaixaTexto>
          <p
            className="mt-2 mb-6"
            style={{
              fontFamily: 'Ubuntu, sans-serif',
              color: '#000000',
              fontSize: '10px',
            }}
          >
            OLIMPÍADAS de robôs humanoides na China. Publicado pelo canal Band Jornalismo. 1 vídeo (1 min 05 s). Disponível em:  <a href="https://www.youtube.com/shorts/UHpLpQPrkrw" target="_blank" rel="noopener noreferrer">https://www.youtube.com/shorts/UHpLpQPrkrw</a>. Acesso em: 24 set. 2025.
          </p>
          <p className="mb-4 indent-6"><strong>Texto IV</strong></p>
          <CaixaTexto title=''>
            <p className="mb-4 indent-6">
              Vou trazer uma notícia agora que envolve tecnologia. Foi realizada a primeira edição dos Jogos Mundiais dos Robôs. Pois é, o evento durou 4 dias e atraiu mais de 280 equipes de 16 países diferentes. Os robôs, que têm forma de humanos, como a gente está vendo, correram, alguns jogaram futebol e outros participaram de competições com obstáculos. Olha só os jogadores aí. Todos eles ali disputando a bola. Realmente chama muita atenção. Esse evento foi realizado na China. E tem um detalhe, foi a primeira edição, mas já tem data marcada para a segunda edição, que será em 2026.
            </p>
          </CaixaTexto>
          <p
            className="mt-2 mb-6"
            style={{
              fontFamily: 'Ubuntu, sans-serif',
              color: '#000000',
              fontSize: '10px',
            }}
          >
            EM ‘OLIMPÍADAS de robôs’, máquinas apostam corrida e jogam futebol. Publicado pelo canal SBT News. Disponível em:  <a href="https://www.youtube.com/watch?v=FJgXK06RHUY" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=FJgXK06RHUY</a>. Acesso em: 18 ago. 2025.
          </p>

          <Pagination currentPage={14} />
          {/* Conteúdo do botão do professor - Tabela comparativa */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    Respostas:
                  </p>
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q9');
                    if (question && question.type === 'text-input' && question.subQuestions) {
                      return question.subQuestions.map((subQ) => (
                        <p key={subQ.letter} className="mb-3">
                          {question.number !== undefined && (
                            <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                          )}
                          <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                          <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                        </p>
                      ));
                    }
                    return null;
                  })()}
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q10');
                    if (question && question.type === 'text-input' && question.subQuestions) {
                      return question.subQuestions.map((subQ) => (
                        <p key={subQ.letter} className="mb-3">
                          {question.number !== undefined && (
                            <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                          )}
                          <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                          <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                        </p>
                      ));
                    }
                    return null;
                  })()}
                  {(() => {
                    const question = chapterQuestions.chapter1.find(q => q.id === 'ch1_q11');
                    if (question && question.type === 'table-fill') {
                      return (
                        <>
                          {/* Respostas da tabela */}
                          {question.correctAnswer && (
                            <>
                              <p className="mb-2 font-semibold">
                                {question.number !== undefined && (
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                )}
                                Tabela:
                              </p>
                              {question.rows.map((row) => {
                                const correctAnswers = question.correctAnswer!;
                                // Obtém o primeiro campo da row (primeira coluna)
                                const firstColumnKey = Object.keys(row).find(key => key !== 'id') || 'paragraph';
                                const firstColumnValue = row[firstColumnKey] || '';

                                // Gera os fieldIds para cada coluna (exceto a primeira)
                                const columnAnswers = question.columns.slice(1).map((columnName, colIndex) => {
                                  const fieldId = `${question.id}_${row.id}_col${colIndex + 1}`;
                                  return {
                                    columnName,
                                    answer: correctAnswers[fieldId] || ''
                                  };
                                });

                                return (
                                  <div key={row.id} className="mb-4">
                                    <p className="mb-2 font-semibold" style={{ color: '#0E3B5D' }}>
                                      {question.columns[0]} {firstColumnValue}:
                                    </p>
                                    {columnAnswers.map((colAnswer, idx) => (
                                      <p key={idx} className="mb-1">
                                        <strong>{colAnswer.columnName}:</strong> {colAnswer.answer}
                                      </p>
                                    ))}
                                  </div>
                                );
                              })}
                            </>
                          )}

                        </>
                      );
                    }
                    return null;
                  })()}

                </>
              }
            />
          </div>
          {/* Questão intercalada no conteúdo - Tabela comparativa */}
          <QuestionRenderer
            question={chapterQuestions.chapter1[8]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          <QuestionRenderer
            question={chapterQuestions.chapter1[9]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          <QuestionRenderer
            question={chapterQuestions.chapter1[10]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            showResults={showTeacherView}
          />
          {/* Botão de download das questões */}
          <div className="my-6">
            <DownloadQuestionsButton
              questions={[chapterQuestions.chapter1[8], chapterQuestions.chapter1[9], chapterQuestions.chapter1[10]]}
              userAnswers={userAnswers}
              title="Questões da Página 14"
              fileName="questoes-pagina-14.pdf"
            />
          </div>
          <Pagination currentPage={15} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    EF69LP06, EF69LP07, EF69LP08, EF67LP09, EF67LP10, EF67LP32, EF67LP33, EF06LP06, EF06LP11, EF06LP12. O objetivo da produção final é consolidar os conhecimentos desenvolvidos ao longo da sequência didática por meio de uma escrita autoral, na qual os alunos devem demonstrar domínio da estrutura, da linguagem e do foco do gênero notícia. A proposta de preparação para a escrita incentiva a busca ativa por informações complementares sobre o evento, favorecendo o protagonismo e a autoria. Adote estratégias de mediação diferenciadas conforme o perfil da turma, como construção coletiva de um texto-modelo na lousa, <em>brainstorming</em> de títulos e enfoques possíveis ou revisão em duplas com apoio do <em>checklist</em> final.
                  </p>
                </>
              }
            />
          </div>
          <ProducaoFinal />
          <p className="mb-4 indent-6">
            Agora, é hora de mostrar tudo o que você aprendeu! Você vai escrever uma notícia completa com base nos textos III e IV, que foram veiculados como notícias oralizadas em telejornais. Sua tarefa será transformar essas versões em uma notícia escrita, pensada para ser publicada em um jornal impresso ou em um <em>site</em> de notícias.
          </p>
          <p className="mb-4 indent-6"><strong>Preparação</strong></p>
          <ol className="list-decimal marker:text-[#832c87] ml-6 mb-4">
            <li>Antes de começar a escrever sua notícia, aprofunde-se mais no tema. Faça uma pesquisa na internet sobre as Olimpíadas de Robôs e descubra as informações principais sobre o evento: Como e quando surgiu? Onde foi realizado? Quem participou? Quais modalidades foram disputadas? </li>
            <li>Em seguida, pense nas decisões que você vai tomar como autor. Qual será o foco da sua notícia: o impacto do evento, os melhores resultados nas competições, os incentivos financeiros do governo ou outro aspecto? Qual será o tom do seu texto: mais técnico e informativo ou mais leve e descritivo?   </li>
          </ol>
          <p className="mb-4 indent-6"><strong>Produção</strong></p>
          <p className="mb-4 indent-6">Produza um texto completo seguindo a estrutura do gênero <strong>notícia</strong>. Organize suas ideias em parágrafos e pense nas suas escolhas como autor. O que incluir? O que não incluir? Como apresentar o conteúdo ao leitor?
          </p>
          <p className="mb-4 indent-6">Sua notícia deve conter título, linha-fina, lide e corpo. Lembre-se das características próprias do gênero e atente à linguagem, aos tempos verbais e à organização dos parágrafos.
          </p>
          <p className="mb-4 indent-6"><strong>Avaliação</strong></p>
          <p className="mb-4 indent-6">Antes de finalizar a sua versão, confira o <em>checklist</em> a seguir para aprimorá-la.
          </p>
          {/* Tabela de Critérios de Avaliação */}
          <CriteriosAvaliacao
            instanceId="producao_final"
            criterios={[
              {
                id: 'criterio_titulo',
                nome: 'TÍTULO',
                pergunta: 'Apresenta o assunto principal de forma atrativa?',
              },
              {
                id: 'criterio_linha_fina',
                nome: 'LINHA-FINA',
                pergunta: 'Complementa o título com uma informação importante ou que aprofunda o assunto?',
              },
              {
                id: 'criterio_lide',
                nome: 'LIDE',
                pergunta: 'Responde às perguntas essenciais sobre o fato?',
              },
              {
                id: 'criterio_corpo',
                nome: 'CORPO DA NOTÍCIA',
                pergunta: 'Desenvolve os detalhes em uma sequência lógica?',
              },
              {
                id: 'criterio_linguagem',
                nome: 'LINGUAGEM',
                pergunta: 'O texto está na terceira pessoa, com verbos no passado e sem expressar opinião pessoal?',
              },
              {
                id: 'criterio_foco',
                nome: 'FOCO INFORMATIVO',
                pergunta: 'Você escolheu o que queria destacar na notícia e manteve esse foco até o fim?',
              },
              {
                id: 'autoria_criacao',
                nome: 'AUTORIA E CRIAÇÃO PESSOAL',
                pergunta: 'Você fez escolhas próprias sobre como escrever a notícia, com base no que leu e no que decidiu destacar?',
              },
            ]}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
          />
          <Pagination currentPage={16} />
          <ProducaoTextoNoticia />

          <Pagination currentPage={17} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <p className="mb-3">
                  EF69LP44. Promova uma escuta atenta e engajada, incentivando os alunos a estabelecer relações entre os comportamentos humanos e as situações representadas nas fábulas. O texto de abertura oferece subsídios para que reconheçam, problematizem e discutam valores sociais, culturais e humanos presentes nesse gênero textual. Inicie com uma conversa que recupere experiências anteriores de leitura de fábulas e convide os alunos a compartilhar situações cotidianas que remetam aos provérbios mencionados como “devagar se vai ao longe”. As perguntas sugeridas buscam estimular a troca de pontos de vista e o amadurecimento da escuta argumentativa. Utilize a imagem do lobo em pele de cordeiro como ponto de partida visual para construir hipóteses com a turma sobre aparências, intenções e disfarces.
                </p>
              }
            />
          </div>
          {/* Conteúdo do Capítulo 2 */}
          <Chapter
            id="chapter2"
            number={2}
            title="Fábulas"
            content={
              <>
                <p className="mb-4 indent-6">
                  Desde os tempos antigos, as pessoas criam histórias em que animais se comportam como seres humanos, capazes de pensar, falar e tomar decisões. Essas histórias divertem, fazem pensar e ensinam sobre como viver em sociedade.
                </p>
                <p className="mb-4 indent-6">
                  Além de entreter, as fábulas convidam à reflexão sobre a convivência com os outros e sobre valores importantes para todos. Isso acontece por meio de situações simbólicas vividas por personagens como raposas astutas, tartarugas persistentes, lobos em pele de cordeiro ou leões orgulhosos.
                </p>
                <p className="mb-4 indent-6">
                  São histórias curiosas, breves e que quase sempre terminam com uma moral, como “devagar se vai ao longe” ou “mais vale prevenir do que remediar”. Esses dizeres nos ajudam a pensar sobre comportamentos e dilemas comuns do dia a dia.
                </p>
                <p className="mb-4 indent-6">
                  Porém, a moral não precisa ser aceita como verdade absoluta. É possível refletir sobre ela de diferentes maneiras. Dessa forma, as fábulas deixam de ser apenas histórias com lições prontas e passam a ser um convite à crítica, à reflexão e ao diálogo.
                </p>
                {/* Conteúdo de lista */}
                <ul className="list-disc marker:text-[#832c87] ml-6">
                  <li>Todas as histórias precisam terminar com uma lição explícita?</li>
                  <li>O que torna uma atitude boa ou ruim? Isso depende da intenção?</li>
                  <li>Todos os comportamentos têm consequências? Por quê?</li>
                </ul>
                {/* Imagem */}
                <div className="flex flex-col items-center my-6">
                  <img src="/images/lobo.png" style={{ width: '75%', marginLeft: '314px' }} />
                  <p className="text-[10px] text-slate-600 mt-2" style={{ marginLeft: '375px' }} >Hennadii H/Shutterstock
                  </p>
                </div>
                <Pagination currentPage={18} />
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          EEF69LP44, EF69LP47, EF69LP49, EF69LP54. Esta seção tem como objetivo ampliar a compreensão dos alunos sobre o gênero <strong>fábula</strong>, articulando repertório histórico, dimensão simbólica e leitura crítica. Essa leitura inicial não visa à memorização de conceitos, mas ao desenvolvimento de repertório analítico que será usado na leitura dos textos e na produção autoral. Ao final da seção, retome com os alunos a estrutura da fábula como narrativa curta e intencionalmente construída, preparando-os para identificar esses elementos nos textos da sequência

                        </p>
                      </>
                    }

                  />
                </div>
                <h3>O que é fábula?</h3>
                <p className="mb-4 indent-6">
                  As fábulas são histórias curtas, simbólicas e protagonizadas por animais que agem como humanos. Essas narrativas existem há milhares de anos e surgiram da tradição oral de povos antigos, mas ainda hoje fazem sentido porque abordam valores humanos importantes em qualquer época, como honestidade, esperteza e respeito.
                </p>
                <p className="mb-4 indent-6">
                  Esses textos comunicam ideias sobre o mundo e sobre o comportamento das pessoas de maneira indireta. O autor de uma fábula escolhe personagens, situações e desfechos para representar maneiras humanas de agir, pensar e se relacionar.
                </p>
                <p className="mb-4 indent-6">
                  Mais do que ensinar uma lição, a fábula apresenta uma maneira de interpretar a vida por meio de metáforas. Isso significa que o autor não precisa escrever “acho que vaidade é um defeito” ou “as aparências enganam”. Em vez disso, ele cria uma situação simbólica em que essas ideias aparecem nas ações dos personagens.
                </p>
                <p className="mb-4 indent-6">
                  Em muitas fábulas, a moral é apresentada de maneira direta, ao final do texto, por meio de uma frase curta que resume o ensinamento da história. No entanto, nem todas seguem esse formato. Em algumas versões, o ensinamento está apenas sugerido, aparecendo nas escolhas dos personagens, nas ações que eles realizam e nas consequências que enfrentam. Ou seja, nesses casos, o ensinamento fica subentendido.
                </p>
                <p className="mb-4 indent-6">
                  Ao longo do tempo, uma mesma fábula pode ser contada de diferentes maneiras, com finais alternativos e mensagens transformadas. Em uma versão, um personagem é criticado. Em outra, pode ser valorizado. E isso muda completamente a interpretação da história.
                </p>
                <TeacherButtonContentHeading>Uma história curta com construção precisa</TeacherButtonContentHeading>
                <p className="mb-4 indent-6">
                  Como são textos curtos, as fábulas exigem uma construção narrativa intencional. O tempo é marcado sem descrições longas, a linguagem é direta e carregada de intenção e os desfechos são rápidos e, muitas vezes, surpreendentes. O autor precisa selecionar com cuidado cada elemento da narrativa para transmitir uma mensagem em poucos parágrafos. Normalmente, as fábulas se organizam em três partes principais.
                </p>
                <ul className="list-disc marker:text-[#832c87] ml-6">
                  <li><strong>Situação inicial</strong>:  apresenta o cenário e os personagens, sugerindo o comportamento de cada um. </li>
                  <li><strong>Conflito</strong>: contém um desafio, uma escolha ou uma situação crítica que leva os personagens a agir. </li>
                  <li><strong>Desfecho</strong>: mostra a consequência direta das ações dos personagens, geralmente com uma surpresa ou inversão de expectativa. </li>

                </ul>
                <p className="mb-4 indent-6">
                  Os verbos são usados no passado, indicando ações concluídas, e os marcadores temporais, como <strong>certo dia, naquela manhã</strong> e <strong>enquanto isso</strong>, ajudam o leitor a acompanhar o avanço da narrativa com agilidade.
                </p>
                <Pagination currentPage={19} />
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          EF69LP44, EF69LP46, EF69LP47, EF69LP49, EF67LP28, EF06LP05, EF67LP37, EF67LP38. Conduza a leitura e análise da fábula <em>A lebre e a tartaruga</em>, um texto clássico com grande potencial para interpretações que vão além da moral tradicionalmente conhecida. Ao longo da leitura guiada e das propostas interpretativas, incentive os alunos a observar como as escolhas narrativas revelam comportamentos simbólicos e constroem possíveis morais implícitas. Esse é um momento oportuno para trabalhar com rodas de conversa, trocas em duplas e valorização de diferentes pontos de vista durante as leituras e as interpretações. Após a realização das atividades, proponha uma conversa com a turma sobre como os comportamentos da lebre (confiança exagerada, falta de constância e descuido) também aparecem em situações do dia a dia. Peça aos alunos que compartilhem exemplos reais e reflitam, de maneira coletiva, sobre as consequências dessas atitudes e como evitá-las.
                        </p>
                      </>
                    }
                  />
                </div>

                <p className="mb-4 indent-6">
                  Leia uma fábula clássica e observe como a estrutura, a linguagem e os personagens contribuem para transmitir uma mensagem.
                </p>
                <p className="mb-4 indent-6">
                  <strong>Texto I</strong>
                </p>
                <CaixaTexto title='A Lebre e a Tartaruga'>
                  <p className="mb-4 indent-6">
                    A Lebre vivia a rir da Tartaruga por
                    causa de sua lentidão.
                  </p>
                  <p className="mb-4 indent-6">
                    — Como consegues ir a algum lugar arrastando-te assim? — zombava
                    ela, entre risos.
                  </p>
                  <p className="mb-4 indent-6">
                    — Posso não correr, mas sei perseverar. Se quiseres, podemos apostar uma corrida. Veremos quem chega primeiro.
                  </p>
                  <p className="mb-4 indent-6">
                    A Lebre, achando a ideia engraçadíssima, aceitou o desafio só para se divertir. A Raposa, respeitada por sua imparcialidade, foi chamada para ser a juíza. Ela marcou o percurso, alinhou os competidores e deu o sinal de partida.
                  </p>
                  <p className="mb-4 indent-6">
                    Num piscar de olhos, a Lebre disparou pelo caminho e logo ficou fora de vista. Já a Tartaruga seguiu em seu ritmo, passo a passo, sem desanimar. Convencida de que venceria com facilidade, a Lebre decidiu descansar um pouco à sombra de uma árvore.
                  </p>
                  <p className="mb-4 indent-6">
                    — Tenho tempo de sobra — pensou — a Tartaruga mal deve ter saído
                    do lugar.
                  </p>
                  <p className="mb-4 indent-6">
                    Mas, enquanto dormia tranquila, a Tartaruga, firme e constante, passou por ela e seguiu em frente, determinada a chegar ao fim.
                  </p>
                  <p className="mb-4 indent-6">
                    Quando despertou, a Lebre levou um susto ao ver a Tartaruga quase cruzando a linha de chegada. Correu com todas as forças, mas já era tarde demais. A lenta Tartaruga venceu a corrida,
                    para surpresa de todos.
                  </p>

                  {/* Imagem */}
                  <div className="flex flex-col items-center my-6">
                    <img src="/images/lebreTartaruga.png" className="max-w-[50%]" />
                    <p className="text-[10px] text-slate-600 mt-2">WINTER, Milo. A lebre e a tartaruga. <em>In: AESOP. The Aesop for children. [S.l.]</em>: Project Gutenberg, 2006. Disponível em: <a href="http://www.gutenberg.org/etext/19994" target="_blank" rel="noopener noreferrer">http://www.gutenberg.org/etext/19994</a>. Acesso em: 24 set. 2025.
                    </p>
                  </div>
                </CaixaTexto>
                <p
                  className="mt-2 mb-6"
                  style={{
                    fontFamily: 'Ubuntu, sans-serif',
                    color: '#000000',
                    fontSize: '10px',
                  }}
                >
                  ESOPO. <em>A lebre e a tartaruga</em>. Domínio público. Texto adaptado para fins didáticos. (Tradução nossa).
                </p>
                <Pagination currentPage={20} />
                {/* Conteúdo do botão do professor - Tabela comparativa */}
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          Respostas:
                        </p>
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q1');
                          if (question && question.type === 'table-fill') {
                            return (
                              <>
                                {/* Respostas da tabela */}
                                {question.correctAnswer && (
                                  <>
                                    <p className="mb-2 font-semibold">
                                      {question.number !== undefined && (
                                        <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                      )}
                                      Tabela:
                                    </p>
                                    {question.rows.map((row) => {
                                      const correctAnswers = question.correctAnswer!;
                                      // Obtém o primeiro campo da row (primeira coluna)
                                      const firstColumnKey = Object.keys(row).find(key => key !== 'id') || 'paragraph';
                                      const firstColumnValue = row[firstColumnKey] || '';

                                      // Gera os fieldIds para cada coluna (exceto a primeira)
                                      const columnAnswers = question.columns.slice(1).map((columnName, colIndex) => {
                                        const fieldId = `${question.id}_${row.id}_col${colIndex + 1}`;
                                        return {
                                          columnName,
                                          answer: correctAnswers[fieldId] || ''
                                        };
                                      });

                                      return (
                                        <div key={row.id} className="mb-4">
                                          <p className="mb-2 font-semibold" style={{ color: '#0E3B5D' }}>
                                            {question.columns[0]} {firstColumnValue}:
                                          </p>
                                          {columnAnswers.map((colAnswer, idx) => (
                                            <p key={idx} className="mb-1">
                                              <strong>{colAnswer.columnName}:</strong> {colAnswer.answer}
                                            </p>
                                          ))}
                                        </div>
                                      );
                                    })}
                                  </>
                                )}

                              </>
                            );
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q2');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q3');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q4');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                      </>
                    }
                  />
                </div>
                {/* Questão intercalada no conteúdo - Tabela comparativa */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[0]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                <QuestionRenderer
                  question={chapterQuestions.chapter2[1]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                <QuestionRenderer
                  question={chapterQuestions.chapter2[2]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                <QuestionRenderer
                  question={chapterQuestions.chapter2[3]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[0], chapterQuestions.chapter2[1], chapterQuestions.chapter2[2], chapterQuestions.chapter2[3]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 21"
                    fileName="questoes-pagina-21.pdf"
                  />
                </div>
                <Pagination currentPage={21} />
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          EF69LP44, EF69LP46, EF69LP47, EF69LP49, EF69LP54, EF67LP27, EF67LP28, EF06LP05, EF67LP37, EF67LP38. Neste segundo momento da sequência didática, o objetivo é ampliar a compreensão do gênero fábula por meio da leitura de um novo texto, agora em versos. A fábula O leão e o rato mantém as características do gênero, como personagens simbólicos, estrutura narrativa concisa e mensagem final,mas adota uma linguagem poética e rítmica que convida os alunos a observar com mais atenção as intenções do autor. Ao conduzir a leitura, oriente os alunos a interpretar as ações e os comportamentos dos personagens com base nos valores humanos que representam, como gratidão, humildade e reconhecimento. As atividades propostas favorecem a análise da estrutura do gênero, o uso do tempo verbal no passado, a identificação de marcadores temporais e a construção da moral – agora explícita. Faça comparações com a fábula anterior para que os alunos reconheçam o que se mantém e o que muda entre os textos.
                        </p>
                      </>
                    }
                  />
                </div>

                <p className="mb-4 indent-6">
                  Agora, leia uma fábula que está organizada em versos. Apesar dessa diferença no modo de contar a história, os elementos principais do gênero continuam presentes.
                </p>
                <p className="mb-4 indent-6">
                  <strong>Texto II</strong>
                </p>
                <CaixaTexto title='O leão e o rato' backgroundColor="white" columns={2}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <p className="mb-4 indent-6">
                        Saiu o rato correndo, <br />
                        assustado e distraído, <br />
                        e foi logo recebido <br />
                        por um leão, sem entender. <br />
                      </p>
                      <p className="mb-4 indent-6">
                        Entre as garras tremeu, <br />
                        mas foi surpreendido então. <br />
                        O leão o protegeu <br />
                        e poupou-lhe a punição. <br />
                      </p>
                      <p className="mb-4 indent-6">
                        Dias passaram ligeiros, <br />
                        e o leão, rei altaneiro, <br />
                        por entre folhas entrou, <br />
                        mas a selva o enganou. <br />
                        Preso em rede traiçoeira, <br />
                        gritou com força certeira, <br />
                        mas sua luta foi em vão. <br />
                        Ficou preso, o valentão. <br />
                      </p>
                    </div>
                    <div>
                      <p className="mb-4 indent-6">
                        O ratinho, sem demora, <br />
                        chega e começa a agir. <br />
                        Rói as cordas, uma hora, <br />
                        e outra, sem desistir. <br />
                        Fino dente, ação constante, <br />
                        vai abrindo a prisão; <br />
                        com esforço perseverante, <br />
                        liberta, enfim, o leão. <br />
                      </p>
                      <p className="mb-4 indent-6">
                        Pagou o bem que recebera, <br />
                        com coragem e humildade, <br />
                        e ensinou que a vida inteira <br />
                        vale a boa gratidão. <br />
                        Ser gentil não custa nada, <br />
                        e a lição dessa jornada, <br />
                        é que até o mais singelo <br />
                        pode ser forte e belo. <br />
                      </p>
                    </div>
                  </div>
                  {/* Imagem */}
                  <div className="flex flex-col items-center my-6">
                    <img src="/images/leao.png" className="max-w-[60%]" />
                    <p className="text-[10px] text-slate-600 mt-2">tada/stock.adobe.com
                    </p>
                  </div>
                </CaixaTexto>
                <p
                  className="mt-2 mb-6"
                  style={{
                    fontFamily: 'Ubuntu, sans-serif',
                    color: '#000000',
                    fontSize: '10px',
                  }}
                >
                  LA FONTAINE. O leão e o rato. Domínio público. Texto adaptado para fins didáticos. (Tradução nossa).
                </p>
                <Pagination currentPage={22} />
                {/* Conteúdo do botão do professor */}
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          Respostas:
                        </p>
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q5');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => {
                                // Se tiver subItems, renderiza com bullets
                                if (subQ.subItems && subQ.subItems.length > 0) {
                                  return (
                                    <div key={subQ.letter} className="mb-4">
                                      <p className="mb-2">
                                        {question.number !== undefined && (
                                          <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                        )}
                                        <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                        <span style={{ color: 'black' }}>{subQ.question}</span>
                                      </p>
                                      <ul className="question-subitems" style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                        {subQ.subItems.map((subItem, index) => (
                                          <li key={index} className="mb-2">
                                            <p className="mb-1">
                                              <span style={{ color: 'black' }}>{subItem.label}: </span>
                                              <span dangerouslySetInnerHTML={{ __html: subItem.correctAnswer || '' }} />
                                            </p>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  );
                                }
                                // Se não tiver subItems, renderiza normalmente
                                return (
                                  <p key={subQ.letter} className="mb-3">
                                    {question.number !== undefined && (
                                      <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                    )}
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                    <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                  </p>
                                );
                              });
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q6');
                          if (question && question.type === 'alternative' && question.options) {
                            const correctOption = question.options[question.correctAnswer];
                            const correctLetter = String.fromCharCode(97 + question.correctAnswer); // a, b, c, d...
                            return (
                              <p className="mb-3">
                                {question.number !== undefined && (
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                )}
                                <span style={{ color: '#00776E', fontWeight: 'bold' }}>{correctLetter}) </span>
                                <span dangerouslySetInnerHTML={{ __html: correctOption || '' }} />
                              </p>
                            );
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q7');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                      </>
                    }
                  />
                </div>
                {/* Questão intercalada no conteúdo - Tabela comparativa */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[4]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                <QuestionRenderer
                  question={chapterQuestions.chapter2[5]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                <QuestionRenderer
                  question={chapterQuestions.chapter2[6]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[4], chapterQuestions.chapter2[5], chapterQuestions.chapter2[6]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 22"
                    fileName="questoes-pagina-22.pdf"
                  />
                </div>

                <Pagination currentPage={23} />
                {/* Conteúdo do botão do professor */}
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          Respostas:
                        </p>
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q8');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q9');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        <p className="mb-4 indent-6">
                          Esta atividade tem como objetivo consolidar o conhecimento sobre o gênero <strong>fábula</strong> e avançar na autonomia autoral dos alunos. Ao propor a mudança de forma (de prosa para verso ou de verso para prosa) e a modificação de pelo menos um dos elementos estruturais do enredo (situação inicial, conflito ou desfecho), a atividade convida os alunos a refletir criticamente sobre as escolhas narrativas e a relação entre estrutura e mensagem. O foco não está apenas em recontar, mas em recriar com intenção, construindo uma nova moral baseada nos personagens e em novos caminhos de ação.
                        </p>
                        <p className="mb-4 indent-6">
                          Minha versão: É importante orientar os alunos a manter os elementos essenciais do gênero, como personagens simbólicos e sequência narrativa, mesmo ao optar por mudanças criativas. A etapa de preparação pode ser realizada individualmente ou em dupla. Atue como mediador, oferecendo exemplos, esclarecendo dúvidas sobre o uso de versos ou a organização de parágrafos e estimulando discussões sobre diferentes valores possíveis. A atividade proporciona um espaço de autoria seguro, permitindo que alunos com diferentes níveis de proficiência se envolvam no processo criativo.

                        </p>
                      </>
                    }
                  />
                </div>
                {/* Questão intercalada no conteúdo - Tabela comparativa */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[7]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                <QuestionRenderer
                  question={chapterQuestions.chapter2[8]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[7], chapterQuestions.chapter2[8]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 23"
                    fileName="questoes-pagina-23.pdf"
                  />
                </div>
                <MinhaVersao />
                <p className="mb-4 indent-6">Você já leu e analisou duas fábulas clássicas: A lebre e a tartaruga e O leão e o rato. Agora, sua tarefa será fazer uma reescrita criativa de uma dessas histórias, mas você terá dois desafios.</p>
                <ol className="list-decimal marker:text-[#832c87] ml-6 mb-4">
                  <li><strong>Mude a forma do texto</strong>: se a fábula escolhida era em prosa, será reescrita em versos; se era em versos, será reescrita em prosa.
                  </li>
                  <li><strong>Modifique algum elemento da narrativa</strong> (a situação inicial, o conflito ou o desfecho): com o objetivo de alterar a moral da história.
                  </li>
                </ol>
                <p className="mb-4 indent-6">Sua produção deve manter os personagens da fábula, mas apresentar uma nova versão do enredo que leve o leitor a refletir sobre uma lição diferente daquela da história original.
                </p>

                <Pagination currentPage={24} />
                {/* Conteúdo do botão do professor */}
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          Respostas:
                        </p>
                        <p className="mb-4 indent-6">
                          Pessoal.
                        </p>
                      </>
                    }
                  />
                </div>
                <p className="mb-4 indent-6"><strong>Preparação</strong></p>
                <p className="mb-4 indent-6">Antes de escrever, siga os passos abaixo para planejar sua nova versão da fábula.</p>
                <ol className="list-decimal marker:text-[#832c87] ml-6 mb-4">
                  <li><strong>Mude a forma do texto</strong>: se a fábula escolhida era em prosa, será reescrita em versos; se era em versos, será reescrita em prosa.
                  </li>
                  <li><strong>Modifique algum elemento da narrativa</strong> (a situação inicial, o conflito ou o desfecho): com o objetivo de alterar a moral da história.
                  </li>
                </ol>
                <QuestionRenderer
                  question={chapterQuestions.chapter2[9]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[9]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 24"
                    fileName="questoes-pagina-24.pdf"
                  />
                </div>
                <Pagination currentPage={25} />
                <p className="mb-4 indent-6"><strong>Produção</strong></p>
                <p className="mb-4 indent-6">Agora é hora de escrever sua fábula. Durante a produção, preste atenção aos seguintes pontos:
                </p>
                <ol className="list-decimal marker:text-[#832c87] ml-6 mb-4">
                  <li>Mesmo com as mudanças, sua história deve manter os três elementos principais da estrutura da fábula: situação inicial, conflito e desfecho. </li>
                  <li>Use os mesmos personagens da história original, mas mude o que acontece com eles para construir uma nova lição de moral. </li>
                  <li>Se estiver escrevendo em versos, lembre-se das rimas, do ritmo e da sonoridade do texto. </li>
                  <li>Se estiver escrevendo em prosa, organize o texto em parágrafos bem estruturados. </li>
                  <li>Use uma linguagem objetiva, expressiva e coerente com o gênero. </li>
                  <li>Seja criativo: pense em valores importantes para você, para sua turma ou para o mundo atual. Como sua fábula pode provocar uma nova reflexão? </li>

                </ol>

                <p className="mb-4 indent-6"><strong>Avaliação</strong></p>
                <p className="mb-4 indent-6">AAntes de finalizar a sua versão da fábula, confira o <em>checklist</em> a seguir para aprimorá-la.
                </p>
                {/* Tabela de Critérios de Avaliação */}
                <CriteriosAvaliacao
                  instanceId="minha_versao_fabulas"
                  criterios={[
                    {
                      id: 'criterio_titulo',
                      nome: 'Forma do texto',
                      pergunta: 'Você transformou sua fábula de prosa para verso ou de verso para prosa?',
                    },
                    {
                      id: 'criterio_linha_fina',
                      nome: 'Estrutura completa',
                      pergunta: 'Sua fábula tem situação inicial, conflito e desfecho bem definidos?',
                    },
                    {
                      id: 'criterio_lide',
                      nome: 'Mudança no enredo',
                      pergunta: 'Você alterou pelo menos um dos elementos do enredo de maneira coerente com a nova moral?',
                    },
                    {
                      id: 'criterio_corpo',
                      nome: 'Nova moral ',
                      pergunta: 'Sua fábula tem uma moral diferente da moral original?',
                    },
                    {
                      id: 'criterio_linguagem',
                      nome: 'Coerência e coesão',
                      pergunta: 'O texto apresenta uma sequência lógica de acontecimentos?',
                    },
                    {
                      id: 'criterio_foco',
                      nome: 'Expressividade',
                      pergunta: 'As ações e os comportamentos dos personagens representam atitudes humanas e ajudam a transmitir a nova mensagem da fábula?',
                    },
                    {
                      id: 'autoria_criacao',
                      nome: 'Autoria e criatividade',
                      pergunta: 'Você fez escolhas inéditas e criativas, usando sua própria forma de contar a história?',
                    },
                  ]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                />
                <Pagination currentPage={26} />
                <ProducaoTexto instanceId="producaoTexto2" />
                <Pagination currentPage={27} />
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          EF69LP44, EF69LP46, EF69LP47, EF69LP49, EF67LP28, EF67LP37, EF67LP38. Nesta etapa, o objetivo é consolidar a compreensão da estrutura do gênero <strong>fábula</strong> e aprofundar a percepção dos alunos sobre as diferentes formas de construção da moral. A fábula <em>A raposa e o corvo</em> retoma os elementos principais trabalhados ao longo do capítulo, mas introduz um enunciado de moral explicitamente separado do corpo do texto. Esse recurso permite aos alunos que comparem essa estratégia com as anteriores e reflitam sobre seus efeitos. As atividades propostas favorecem múltiplos níveis de leitura: da compreensão literal à análise crítica dos comportamentos simbólicos dos personagens. Incentive a análise da figura da raposa como manipuladora e do corvo como símbolo da vaidade, relacionando esses papéis a situações contemporâneas e a possíveis excessos de confiança ao julgar a opinião dos outros. Essa etapa conclui a sequência interpretativa e prepara os alunos para a produção autoral, que será orientada pela escolha de uma moral e pela construção de uma narrativa original com estrutura e intenção definidas.
                        </p>
                      </>
                    }
                  />
                </div>

                <p className="mb-4 indent-6">
                  Leia mais uma fábula. Agora, há moral explícita ao final do texto.
                </p>
                <p className="mb-4 indent-6">
                  <strong>Texto III</strong>
                </p>
                <CaixaTexto title='A raposa e o corvo'>
                  <p className="mb-4 indent-6">
                    Em certa manhã ensolarada, um corvo pousou num alto galho com um belo pedaço de queijo no bico. Estava satisfeito com seu achado e já se preparava para apreciar seu lanche, quando apareceu uma raposa astuta caminhando logo abaixo.
                  </p>
                  <p className="mb-4 indent-6">
                    Ao ver o corvo com o queijo, a raposa parou e pensou consigo: “Não é justo deixá-lo com essa iguaria! Preciso encontrar maneira de fazê-lo largar o queijo, mas sem assustá-lo.” Então, com os olhos brilhando de esperteza, parou sob a árvore, ergueu o focinho em direção ao galho e exclamou:
                  </p>
                  <p className="mb-4 indent-6">
                    — Que criatura esplêndida és tu! Nunca vi penas tão brilhantes!
                    Que elegância, que porte majestoso! Aposto que tens uma voz encantadora, digna de um verdadeiro rei das aves. Se cantasses agora, certeza teríamos de coroar-te soberano do céu!
                  </p>
                  <p className="mb-4 indent-6">
                    Lisonjeado, o corvo sentiu-se honrado com tantos elogios. Envaidecido, pensou: “Ora, por que não mostrar à senhorita minha
                    bela voz?” E, sem pensar nas consequências, abriu o bico para cantar.
                  </p>
                  <p className="mb-4 indent-6">
                    — Cróóó!
                  </p>
                  <p className="mb-4 indent-6">
                    No mesmo instante, o queijo caiu direto no chão. A raposa, sem
                    perder tempo, agarrou-o com os dentes e se afastou tranquilamente. Antes de sumir entre os arbustos, ainda se virou e disse:
                  </p>
                  <p className="mb-4 indent-6">
                    — Cante o quanto quiser, meu caro. De beleza e voz você pode
                    até entender. Mas de inteligência… Ah, ainda lhe falta muito!
                  </p>
                  <p className="mb-4 indent-6">
                    <strong>Moral da história</strong>: Cuidado com os que elogiam demais.
                  </p>


                  {/* Imagem */}
                  <div className="flex flex-col items-center my-6">
                    <img src="/images/raposa.png" className="max-w-[50%]" />
                    <p className="text-[10px] text-slate-600 mt-2">Saenkova Iuliia/stock.adobe.com
                    </p>
                  </div>
                </CaixaTexto>
                <p
                  className="mt-2 mb-6"
                  style={{
                    fontFamily: 'Ubuntu, sans-serif',
                    color: '#000000',
                    fontSize: '10px',
                  }}
                >
                  ESOPO. <em>A raposa e o corvo</em>. Domínio público. Texto adaptado para fins didáticos. (Tradução nossa).
                </p>
                <Pagination currentPage={28} />
                {/* Conteúdo do botão do professor */}
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          Respostas:
                        </p>
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q11');
                          if (question && question.type === 'true-false' && question.statements) {
                            return question.statements.map((stmt) => {
                              // Se tiver correção, mostra V/F primeiro e depois a correção. Se não, mostra apenas V ou F
                              const correctAnswerText = stmt.correctAnswer ? 'Verdadeiro (V)' : 'Falso (F)';
                              const answerText = stmt.correction
                                ? `${correctAnswerText}. ${stmt.correction}`
                                : correctAnswerText;

                              return (
                                <p key={stmt.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{stmt.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: answerText }} />
                                </p>
                              );
                            });
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q12');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q13');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q14');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q15');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}

                      </>
                    }

                  />
                </div>
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[10]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[11]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[12]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[13]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[14]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[10], chapterQuestions.chapter2[11], chapterQuestions.chapter2[12], chapterQuestions.chapter2[13], chapterQuestions.chapter2[14]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 28"
                    fileName="questoes-pagina-28.pdf"
                  />
                </div>

                <Pagination currentPage={29} />
                {/* Conteúdo do botão do professor */}
                <div className="my-6">
                  <TeacherButton
                    content={
                      <>
                        <p className="mb-3">
                          Respostas:
                        </p>
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q16');
                          if (question && question.type === 'true-false' && question.statements) {
                            return question.statements.map((stmt) => {
                              // Se tiver correção, mostra V/F primeiro e depois a correção. Se não, mostra apenas V ou F
                              const correctAnswerText = stmt.correctAnswer ? 'Verdadeiro (V)' : 'Falso (F)';
                              const answerText = stmt.correction
                                ? `${correctAnswerText}. ${stmt.correction}`
                                : correctAnswerText;

                              return (
                                <p key={stmt.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{stmt.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: answerText }} />
                                </p>
                              );
                            });
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q17');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                        {(() => {
                          const question = chapterQuestions.chapter2.find(q => q.id === 'ch2_q18');
                          if (question && question.type === 'text-input') {
                            // Se tiver subquestões, renderiza cada uma
                            if (question.subQuestions && question.subQuestions.length > 0) {
                              return question.subQuestions.map((subQ) => (
                                <p key={subQ.letter} className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span style={{ color: '#00776E', fontWeight: 'bold' }}>{subQ.letter}) </span>
                                  <span dangerouslySetInnerHTML={{ __html: subQ.correctAnswer || '' }} />
                                </p>
                              ));
                            }
                            // Se não tiver subquestões, renderiza a resposta direta
                            if (question.correctAnswer) {
                              return (
                                <p className="mb-3">
                                  {question.number !== undefined && (
                                    <span style={{ color: '#00776E', fontWeight: 'bold' }}>{question.number}. </span>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: question.correctAnswer }} />
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}

                      </>
                    }

                  />
                </div>
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[15]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[16]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Questão intercalada no conteúdo */}
                <QuestionRenderer
                  question={chapterQuestions.chapter2[17]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                  showResults={showTeacherView}
                />
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[15], chapterQuestions.chapter2[16], chapterQuestions.chapter2[17]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 29"
                    fileName="questoes-pagina-29.pdf"
                  />
                </div>

                <Pagination currentPage={30} />
                <ProducaoFinal />
                <p className="mb-4 indent-6">
                  Chegou o momento de criar sua própria fábula. Desenvolva uma narrativa original, curta e intencional. Os personagens devem ser animais que representem comportamentos humanos, e o enredo deve conduzir o leitor a refletir sobre um ensinamento, apresentado de maneira direta ou indireta.
                </p>
                <p className="mb-4 indent-6">
                  <strong>Preparação</strong>
                </p>
                <p className="mb-4 indent-6">
                  Siga os passos a seguir para organizar o seu texto.
                </p>
                <ol className="list-decimal marker:text-[#832c87] ml-6 mb-4">
                  <li><strong>Escolha a moral da sua fábula</strong>
                  </li>
                  <p className="mb-4 indent-6">
                    A moral é a mensagem que a sua história vai transmitir. Por isso, ela precisa ser escolhida logo no início do planejamento. Você pode criar a sua própria moral ou escolher uma das
                    sugestões listadas a seguir.
                  </p>
                  <ul className="list-disc marker:text-[#832c87] ml-6 mb-4">
                    <li>"Nem todo elogio é sincero."</li>
                    <li>"A pressa é inimiga da perfeição."</li>
                    <li>"Gentileza gera gentileza."</li>
                    <li>"Quem pouco ouve, muito erra."</li>
                    <li>"Só se colhe o que se planta."</li>
                    <li>"Às vezes, o menor gesto faz a maior diferença."</li>
                  </ul>
                  <li><strong>Defina os personagens simbólicos</strong></li>
                  <p className="mb-4 indent-6">
                    Toda fábula tem personagens que simbolizam ideias, atitudes e sentimentos humanos. Esses personagens geralmente são animais, mas também podem ser objetos ou outros seres com papel secundário na história. Portanto, reflita: Qual animal vai representar cada comportamento humano na sua fábula?
                  </p>
                  <li><strong>Planeje o enredo da sua fábula</strong></li>
                  <p className="mb-4 indent-6">
                    Use o quadro abaixo para organizar o que vai acontecer no início, no meio e no fim da sua fábula. Lembre-se de que a moral precisa estar conectada ao que acontece na história. Ela pode ser escrita de maneira direta no final do texto ou apenas sugerida pelas atitudes dos personagens.
                  </p>
                  {/* Questão intercalada no conteúdo */}
                  <QuestionRenderer
                    question={chapterQuestions.chapter2[18]}
                    userAnswers={userAnswers}
                    onAnswerChange={handleAnswerChange}
                    showResults={showTeacherView}
                  />

                </ol>
                {/* Botão de download das questões */}
                <div className="my-6">
                  <DownloadQuestionsButton
                    questions={[chapterQuestions.chapter2[18]]}
                    userAnswers={userAnswers}
                    title="Questões da Página 30"
                    fileName="questoes-pagina-30.pdf"
                  />
                </div>
                <Pagination currentPage={31} />
                <p className="mb-4 indent-6">É hora de escrever sua fábula. Produza um texto original que apresente:</p>
                <ul className="list-disc marker:text-[#832c87] ml-6 mb-4">
                  <li>enredo curto com começo, meio e fim;</li>
                  <li>personagens simbólicos que se comportam como seres humanos;</li>
                  <li>problema ou desafio que dá origem ao conflito da história;</li>
                  <li>lição apresentada no final do texto ou sugerida pelas atitudes dos personagens.</li>
                </ul>
                <p className="mb-4 indent-6">Para isso, use:</p>
                <ul className="list-disc marker:text-[#832c87] ml-6 mb-4">
                  <li>verbos no passado para contar as ações concluídas;</li>
                  <li>marcadores temporais que organizem a narrativa, como “um dia”, “então” e “enquanto isso”;</li>
                  <li>linguagem expressiva e coerente com o gênero.</li>
                </ul>
                <p className="mb-4 indent-6">Represente seu texto com imagens. Você pode:</p>
                <ul className="list-disc marker:text-[#832c87] ml-6 mb-4">
                  <li>fazer um desenho dos personagens principais em um momento importante da história;</li>
                  <li>criar uma cena que destaque o conflito ou a moral da história;</li>
                  <li>produzir uma colagem com recortes ou buscar imagens <em>on-line</em> que combinem com o que você escreveu.</li>
                </ul>
                <p className="mb-4 indent-6"><strong>Avaliação</strong></p>
                <p className="mb-4 indent-6">Antes de finalizar a sua fábula, confira o <em>checklist</em> a seguir para aprimorá-la.</p>
                {/* Tabela de Critérios de Avaliação */}
                <CriteriosAvaliacao
                  instanceId="producao_final_pag31"
                  criterios={[
                    {
                      id: 'criterio_titulo',
                      nome: 'Estrutura do gênero',
                      pergunta: 'O texto tem uma situação inicial, um conflito e um desfecho?',
                    },
                    {
                      id: 'criterio_linha_fina',
                      nome: 'Personagens simbólicos',
                      pergunta: 'Os personagens representam atitudes ou sentimentos humanos reconhecíveis?',
                    },
                    {
                      id: 'criterio_lide',
                      nome: 'Coerência narrativa',
                      pergunta: 'As ações fazem sentido? A consequência final está conectada com o que veio antes?',
                    },
                    {
                      id: 'criterio_corpo',
                      nome: 'Expressividade',
                      pergunta: 'A história provoca reflexão ou emoção? Os pensamentos e as ações dos personagens geram sentido simbólico?',
                    },
                    {
                      id: 'criterio_linguagem',
                      nome: 'Linguagem e clareza',
                      pergunta: 'O texto está bem escrito, com vocabulário e pontuação adequados?',
                    },
                    {
                      id: 'criterio_foco',
                      nome: 'Ilustração como parte da criação',
                      pergunta: 'A ilustração escolhida representa os personagens ou uma cena importante da fábula?',
                    },
                    {
                      id: 'autoria_criacao',
                      nome: 'Originalidade',
                      pergunta: 'A história tem ideias inéditas?',
                    },
                    {
                      id: 'moral',
                      nome: 'Moral',
                      pergunta: 'A moral da história está presente, ainda que de maneira implícita',
                    },
                  ]}
                  userAnswers={userAnswers}
                  onAnswerChange={handleAnswerChange}
                />
                <Pagination currentPage={32} />
                <ProducaoTextoFabula />
              </>
            }
          />
        </div>

        {/* <footer className="bg-slate-100 py-6 px-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            © 2025 - Todos os direitos reservados
          </p>
        </footer> */}
      </div>

      {currentPage >= 12 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-1 right-6 z-40 bg-gradient-to-r text-white p-3 rounded-full hover:scale-110 transition-all"
          title="Voltar ao início do livro"
        >
          <img src="/images/setaTopo.png" alt="Voltar ao início do livro" />
        </button>
      )}
    </div>
  );
}

export default Book;
