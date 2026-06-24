import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import TeacherButton from './TeacherButton';
import { chapterQuestions } from '../data/questions';
import { UserAnswers, Question } from '../types/questions';
import { loadAnswers, saveAnswers } from '../utils/storage';
import Pagination from './Pagination';
import PaginationDupla from './PaginationDupla';
import ParaFamilia from './ParaFamilia';
import CaixaTexto from './CaixaTexto';
import DescobertasCard from './DescobertasCard';
import RelembrarAventurasCard from './RelembrarAventurasCard';
import CoracoesPintar from './CoracoesPintar';
import TeacherButtonContentHeading from './TeacherButtonContentHeading';
import BolaDeMeiaQuestion from './BolaDeMeiaQuestion';
import CabriolaTituloInterativo from './CabriolaTituloInterativo';
import MatchConnectQuestion, { type MatchConnectItem } from './MatchConnectQuestion';
import ImageFillQuestion, { type ImageFillItem } from './ImageFillQuestion';
import GameModal from './GameModal';
import AreaDesenho from './AreaDesenho';
import ContagemQuadrados from './ContagemQuadrados';
import PalavrasBambolhe from './PalavrasBambolhe';
const pag16Img = (n: number) => `/images/pag16_img${n}.png`;

const BolaCaption = ({ tipo, color }: { tipo: string; color: string }) => (
  <span
    className="inline-block rounded-lg border-2 bg-white px-3 py-1 text-sm font-bold uppercase text-[#4B4B4B] md:text-base"
    style={{ borderColor: color }}
  >
    Bola de <span style={{ color }}>{tipo}</span>
  </span>
);

const MATCH_PAG16_CAPTIONS = [
  { tipo: 'Basquete', color: '#3498db' },
  { tipo: 'Futebol', color: '#2C7049' },
  { tipo: 'Tênis', color: '#e67e22' },
];

const MATCH_PAG16_LEFT: MatchConnectItem[] = [1, 2, 3].map((n) => ({
  id: `pag16-left-${n}`,
  imageSrc: pag16Img(n),
  alt: '',
  caption: (
    <BolaCaption
      tipo={MATCH_PAG16_CAPTIONS[n - 1].tipo}
      color={MATCH_PAG16_CAPTIONS[n - 1].color}
    />
  ),
}));

/** Ordem fixa na coluna da direita (embaralhada em relação à esquerda). */
const MATCH_PAG16_RIGHT_ORDER = [4, 5, 6] as const;

const MATCH_PAG16_RIGHT: MatchConnectItem[] = MATCH_PAG16_RIGHT_ORDER.map((imgNum, i) => ({
  id: `pag16-right-${i}`,
  imageSrc: pag16Img(imgNum),
  alt: '',
}));

const FILL_PAG17_ITEMS: ImageFillItem[] = [
  {
    id: 'pag17-1',
    imageSrc: '/images/pag17_img1.png',
    alt: '',
    labelPrefix: 'BOLA DE',
    imageClassName: 'max-h-16 md:max-h-20',
  },
  {
    id: 'pag17-2',
    imageSrc: '/images/pag17_img2.png',
    alt: '',
    labelPrefix: 'BOLA DE',
    imageClassName: 'max-h-24 md:max-h-32',
  },
  {
    id: 'pag17-3',
    imageSrc: '/images/pag17_img3.png',
    alt: '',
    labelPrefix: 'BOLA DE',
    imageClassName: 'max-h-28 md:max-h-40',
  },
  {
    id: 'pag17-4',
    imageSrc: '/images/pag17_img4.png',
    alt: '',
    labelPrefix: 'BOLA DE',
    imageClassName: 'max-h-28 md:max-h-40',
  },
];

const FILL_PAG21_ITEMS: ImageFillItem[] = [1, 2, 3].map((n) => ({
  id: `pag21-${n}`,
  imageSrc: `/images/pag21_img${n}.png`,
  alt: '',
  imageClassName: 'max-h-28 md:max-h-40',
}));

const pag26Img = (n: number) => `/images/pag26_img${n}.png`;

const MATCH_PAG26_LEFT: MatchConnectItem[] = [
  { id: 'pag26-left-1', label: 'BATATA QUENTE' },
  { id: 'pag26-left-2', label: 'CABRIOLA, CADÊ A BOLA?' },
  { id: 'pag26-left-3', label: 'PEGA-PEGA SOMBRAS' },
  { id: 'pag26-left-4', label: 'PASSANDO O BAMBOLÊ' },
];

/** Ordem embaralhada na coluna da direita (corrida, roda, bambolê, bola). */
const MATCH_PAG26_RIGHT_ORDER = [1, 4, 3, 2] as const;

const MATCH_PAG26_RIGHT: MatchConnectItem[] = MATCH_PAG26_RIGHT_ORDER.map((imgNum, i) => ({
  id: `pag26-right-${i}`,
  imageSrc: pag26Img(imgNum),
  alt: '',
}));

function Book() {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showTeacherView, setShowTeacherView] = useState(false);
  const [currentPage, setCurrentPage] = useState(10);
  const [pag18ShowContorno, setPag18ShowContorno] = useState(false);
  const [pag19ShowContorno, setPag19ShowContorno] = useState(false);
  const [pag25ShowContorno, setPag25ShowContorno] = useState(false);
  const [pag21ShowResposta, setPag21ShowResposta] = useState(false);
  const [pag25ObjetosCount, setPag25ObjetosCount] = useState(() => {
    try {
      return localStorage.getItem('livro:pag25-objetos-count') ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    setUserAnswers(loadAnswers());
  }, []);

  useEffect(() => {
    localStorage.setItem('livro:pag25-objetos-count', pag25ObjetosCount);
  }, [pag25ObjetosCount]);

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
        <div className="px-8 pb-8 pt-2 md:px-12 md:pb-12 md:pt-3">
          {/* Paginação */}
          <PaginationDupla firstPage={10} secondPage={11} />
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
                  <a href="https://go.sae.digital/OtvnHy" target="_blank">https://go.sae.digital/OtvnHy</a>
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
                border: '4px dashed #832c87',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#00A99D',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 700,
                  fontSize: '30px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
                QUANTA ENERGIA EU TENHO
                <br />
                <span style={{ fontSize: '30px' }}>PARA BRINCAR!</span>
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
          <PaginationDupla firstPage={12} secondPage={13} />
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
                  <a href="https://go.sae.digital/OtvnHy" target="_blank">https://go.sae.digital/OtvnHy</a>
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
                border: '3px dashed #00A99D',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#832c87',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 700,
                  fontSize: '30px',
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
            text={`NESTA UNIDADE, VOCE VAI CONHECER ALGUMAS BRINCADEIRAS TRADICIONAIS
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
                  <a href="https://go.sae.digital/OtvnHy" target="_blank">https://go.sae.digital/OtvnHy</a>

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
          <img src="/images/icons-2j.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <CaixaTexto
            title={
              <span className="inline-flex items-center justify-center gap-3">
                Bola de meia
                <img src="/images/pag14_img1.png" alt="" className="inline-block max-h-16 w-auto" />
              </span>
            }
            centered
          >
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
          <img src="/images/icons-2a.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
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
          <img src="/images/icones_registros.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <div className="my-8">
            <MatchConnectQuestion
              leftItems={MATCH_PAG16_LEFT}
              rightItems={MATCH_PAG16_RIGHT}
              storageKey="livro:ligar-pag16-bolas-jogos"
              hint="Clique em uma imagem da esquerda: a linha segue o mouse ou o dedo. Depois clique na imagem correspondente à direita para fechar a ligação."
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-2">Imagens: Lustre Art Group/stock.adobe.com; vectorsanta/stock.adobe.com
          </p>
          <Pagination currentPage={17} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-3">
                    Respostas:
                  </p>
                  <p>Bola de tênis</p>
                  <p>Bola de boliche</p>
                  <p>Bola de futebol</p>
                  <p>Bola de basquete</p>
                </>
              }

            />
          </div>
          <p className="mb-4 indent-6">
            VOCÊ VIU QUE CADA BRINCADEIRA OU JOGO USA UM TIPO DE BOLA.
          </p>
          <p className="mb-4 indent-6">
            OBSERVE AS BOLAS E IDENTIFIQUE EM QUAL JOGO ELAS SÃO
            USADAS. DEPOIS, ESCREVA COMO SOUBER O NOME DO JOGO NOS
            ESPAÇOS CORRETOS.
          </p>
          <img src="/images/icones_registros.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <div className="my-6">
            <ImageFillQuestion
              items={FILL_PAG17_ITEMS}
              storageKey="livro:preencher-pag17-bolas"
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-2">Imagens: NikahGeh/stock.adobe.com; Rawf8/stock.adobe.com; Alec/stock.adobe.com; Rawpixel.com/stock.adobe.com
          </p>
          <ParaFamilia
            text="PARA DAR INÍCIO À UNIDADE “AS BRINCADEIRAS E SUAS REGRAS”, AS CRIANÇAS FORAM CONVIDADAS A COMPARTILHAR EXPERIÊNCIAS RELACIONADAS A BRINCADEIRAS COM BOLA. DEPOIS, OUVIRAM A LEITURA DE UM TEXTO INSTRUCIONAL, EM QUE IMAGENS SOBRE COMO FAZER UMA BOLA DE MEIA FORAM DESTACADAS DO MATERIAL DE APOIO E ORGANIZADAS EM SEQUÊNCIA. EM SEGUIDA, AS CRIANÇAS CONFECCIONARAM SUA PRÓPRIA BOLA DE MEIA. AO TERMINAREM A ATIVIDADE, AS CRIANÇAS PARTICIPARAM DE DUAS BRINCADEIRAS: BATATA QUENTE E CABRIOLA, CADÊ A BOLA? DEPOIS DE CONHECER ALGUNS TIPOS DIFERENTES DE BOLAS, AS CRIANÇAS FORAM CONVIDADAS A FAZER UMA ESCRITA ESPONTÂNEA DOS NOMES DE ALGUNS JOGOS QUE UTILIZAM BOLA."
          />

          <Pagination currentPage={18} />
          {/* Conteúdo do botão do professor - Tabela comparativa */}
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
                  <p className="mb-4 indent-6">EI03EO01; EI03EO03; EI03EO07;
                    EI03CG01; EI03CG05; EI03TS02;
                    EI03EF01; EI03EF02; EI03EF03;
                    EI03EF07; EI03EF08.</p>
                  <TeacherButtonContentHeading>Expectativas de
                    aprendizagem</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Compreender e respeitar os
                      combinados do grupo.</li>
                    <li>Demonstrar atitudes solidárias e
                      colaborativas junto ao grupo em
                      diferentes situações cotidianas.</li>
                    <li>Ter iniciativa para escolher brincadeiras, atividades e grupos.</li>
                    <li>Cumprir as regras estabelecidas.</li>
                    <li>Ampliar os movimentos direcionados que o próprio corpo
                      pode realizar.</li>
                    <li>Desenvolver ações motoras
                      combinadas para impulsão
                      (saltitar, saltar e pular).</li>
                    <li>Participar da criação de movimentos em diferentes contextos.</li>
                    <li>Controlar voluntariamente as
                      ações motoras.</li>
                    <li>Ampliar a habilidade motora
                      fina por meio de atividades de
                      recorte (segurar a tesoura de
                      forma correta e recortar livremente) e de colagem (abrir e
                      fechar o tubo de cola e dosar o
                      líquido adequadamente).</li>
                    <li>Ampliar a habilidade motora
                      fina por meio de atividades de
                      desenho e pintura (na totalidade
                      e respeitando o limite da figura).</li>
                    <li>Expressar-se livremente fazendo
                      uso de diferentes linguagens.</li>
                    <li>Opinar sobre assuntos abordados em assembleia e/ou nas
                      rodas de conversa.</li>
                    <li>Brincar com a sonoridade das
                      palavras em situações diversas.</li>
                    <li>Realizar uma pseudoleitura.</li>
                    <li>Conhecer diferentes gêneros
                      textuais.</li>
                    <li>Levantar hipóteses sobre diferentes gêneros textuais observando suas características.</li>
                    <li>Participar de momentos de leitura de diferentes gêneros textuais.</li>
                  </ul>
                  <TeacherButtonContentHeading>Você precisa de...</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Cola colorida. </li>
                    <li>Cartolina ou papel Kraft. </li>
                    <li>Caneta hidrocor preta. </li>
                    <li>Riscantes diversos, tais como: lápis de cor, giz de cera e caneta hidrocor. </li>
                    <li>Lápis-grafite (1 por criança). </li>
                    <li>Conteúdo digital: contação da história “O gato e os ratos”. </li>
                  </ul>
                  <TeacherButtonContentHeading>Desenvolvimento das
                    atividades</TeacherButtonContentHeading>
                  <ol className="list-decimal marker:text-[#832c87] marker:font-bold ml-6">
                    <li>Após as atividades de rotina, com as crianças sentadas em roda, convide-as a observar, na <strong>página 18</strong> do Livro do aluno, a imagem das crianças brincando. Depois
                      de um tempo de observação, pergunte se alguém conhece essa brincadeira e se
                      sabe o nome dela. Acolha as observações das crianças e conte que a brincadeira
                      se chama Pega-pega. </li>
                    <li>Pergunte às crianças se gostam de brincar de Pega-pega e como é realizada essa
                      brincadeira. As perguntas presentes na página podem direcionar a conversa, mas
                      considere que existem variações do Pega-pega. Depois, leve as crianças a uma
                      área externa, onde poderão brincar de Pega-pega e, após a brincadeira, peça que
                      registrem como foi esse momento na <strong>página 18</strong> do Livro do aluno. </li>
                    <li>Diga às crianças que existe uma brincadeira muito parecida com o Pega-pega,
                      chamada de Pega-pega sombras. Antes de explicar as regras da brincadeira, pergunte: <em>Como essa brincadeira funciona? Qual é a diferença entre o Pega-pega
                        que conhecemos e o Pega-pega sombras?</em> Explique que, na versão com sombras, o
                      pegador não toca nos participantes para capturá-los; em vez disso, ele deve pisar
                      na sombra de outro jogador fazendo com que esse se torne o novo pegador.</li>
                    <li>Na sequência, leve as crianças novamente a uma área ao ar livre e proponha
                      que brinquem de Pega-pega sombras. Certifique-se de que haja sol ou uma luz
                      que possa fazer sombras enquanto as crianças correm. Combine com elas quem
                      será o pegador e quem poderá ser pego, lembrando que os papéis podem se
                      alternar durante a brincadeira.  </li>
                    <li>De volta à sala, convide as crianças a identificar e marcar, na <strong>página 19</strong> do Livro
                      do aluno, a imagem que representa a brincadeira da qual acabaram de participar.
                      Aproveite a oportunidade para perguntar à turma: <em>E as demais crianças que não são
                        o pegador, o que devem fazer?</em> Esse questionamento é importante porque ajuda a
                      perceber que as ações são diferentes (pegar/fugir) e que os objetivos da brincadeira
                      também divergem dependendo do papel assumido (quem pega e quem não pega). </li>
                    <li>Em seguida, com as crianças sentadas em roda, convide-as a conhecer um texto que
                      traz uma brincadeira de “perseguição” na qual os gatos devem capturar um rato. </li>
                    <li>Faça, então, a leitura do texto com entonação e questione: <em>Quais animais participaram dessa história? Trata-se de uma brincadeira ou era outro tipo de ação?</em></li>
                    <li>Acolha os comentários das crianças e auxilie-as no entendimento completo do texto. É
                      importante garantir a compreensão de que o objetivo do gato era tentar capturar o rato.  </li>
                    <li>Chame a atenção das crianças para a estrutura do texto. Trata-se de uma narrativa
                      feita com rimas, como é possível identificar com os termos <strong>gato</strong> e <strong>rato</strong>. Além disso, as frases são curtas, com palavras simples e estruturas que se
                      repetem, como no paralelismo:
                      “Onde o gato está?” / “Onde o
                      rato está?”.  </li>
                    <li>Na sequência, as crianças vão
                      conhecer uma fábula na qual os
                      animais gato e rato fazem parte
                      da narrativa. Reproduza o vídeo e acolha as percepções das
                      crianças sobre a história.   </li>
                    <li>Convide as crianças a escolher
                      três cores de lápis de cor e a
                      localizar, no texto da <strong>página 20</strong>
                      do Livro do aluno, as palavras
                      <strong>gato</strong>, <strong>rato</strong> e <strong>galo</strong> e a pintá-las.
                      Depois, elas vão pintar no gráfico a quantidade de palavras
                      que encontrou. Aproveite esse
                      momento para trabalhar comparações entre as quantidades
                      encontradas, como quais palavras encontradas têm a mesma
                      quantidade, qual delas é a menor de todas, quantos quadradinhos as palavras <strong>gato</strong> e <strong>rato</strong>
                      têm a mais que <strong>galo</strong>. </li>
                    <li>Releia o texto para a turma e
                      solicite às crianças que prestem atenção aos animais que
                      fazem parte da brincadeira. Na
                      <strong>página 21</strong> do Livro do aluno,
                      peça que pintem a ilustração
                      do animal que não está participando da brincadeira – o galo,
                      que apenas é mencionado ao
                      final do texto. Depois, peça às
                      crianças que escrevam, como
                      souberem, o nome dos animais
                      das imagens.  </li>
                    <li>Retome o assunto sobre o Pega-pega sombras a fim de que as
                      crianças ajudem a montar um
                      cartaz da brincadeira. Para isso,
                      incentive-as a relembrar e citar as regras do jogo durante a
                      proposta. É importante que elas
                      vejam o(a) professor(a) escrevendo, por isso, se possível, use
                      uma letra grande e leia em voz
                      alta enquanto escreve. </li>
                    <li>Por fim, convide as crianças a
                      criar juntas uma nova regra para
                      o Pega-pega sombras. Caso elas
                      apresentem dificuldade, dê algumas sugestões: o fugitivo ficar
                      parado quando é pego; o pegador correr em linha reta; o fugitivo
                      se abaixar quando é pego; o fu
                      gitivo se tornar mais um pegador
                      quando é pego; quem for pego
                      deve correr em dupla, entre outras possibilidades. Assim que a
                      nova regra for definida, é necessário registrá-la, da maneira que
                      preferirem, no cartaz de regras. </li>
                  </ol>
                  <TeacherButtonContentHeading>Conteúdo digital</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">No <em>link</em>, você encontra a
                    seção “Observação ativa” e outras sugestões para enriquecer
                    a prática pedagógica.</p>
                  <a href="https://go.sae.digital/OtvnHy" target="_blank">https://go.sae.digital/OtvnHy</a>

                  <p className="mb-4 indent-6">
                    <strong>Resposta atividade:</strong>
                  </p>
                  <img src="/images/64.png" alt="" className="noborder" style={{ cursor: 'default' }} />
                  <p className="mb-4 indent-6">
                    Desenho: Resposta pessoal.
                  </p>
                </>
              }
            />
          </div>
          <img src="/images/icons-2j.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">OBSERVE A IMAGEM. DO QUE AS CRIANÇAS ESTÃO BRINCANDO?</p>{/* Imagem */}
          <div className="flex flex-col items-center my-6">
            <img
              src={pag18ShowContorno ? '/images/pag18_img2.png' : '/images/pag18_img1.png'}
              alt=""
              className="max-w-[60%]"
            />
            <p className="text-[10px] text-slate-600 mt-2">ninefar/stock.adobe.com
            </p>
          </div>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>VOCÊ JÁ BRINCOU DE PEGA-PEGA? </li>
            <li>COMO É ESSA BRINCADEIRA?  </li>
            <li>COM COLA COLORIDA, CONTORNE NA IMAGEM QUEM É O PEGADOR
              DA BRINCADEIRA. </li>
          </ul>
          <button
            type="button"
            className="my-5 ml-6 rounded-lg border-2 border-[#832c87] bg-white px-5 py-2.5 text-sm font-medium text-[#832c87] transition hover:bg-[#faf8fc]"
            onClick={() => setPag18ShowContorno((v) => !v)}
          >
            {pag18ShowContorno ? 'Voltar à imagem original' : 'Mostrar quem é o pegador'}
          </button>
          <p className="mb-4 indent-6">QUE TAL BRINCAR DE PEGA-PEGA COM OS COLEGAS? DECIDAM JUNTOS
            QUEM SERÁ O PEGADOR E DIVIRTAM-SE. DEPOIS, NO QUADRO ABAIXO,
            FAÇA UM DESENHO DESSE MOMENTO.</p>

          <AreaDesenho storageKey="livro:pag18-desenho-pega-pega" />

          <Pagination currentPage={19} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-4 indent-6"><strong>Resposta atividade:</strong></p><img src="/images/66.png" alt="" className="noborder" style={{ cursor: 'default' }} />

                </>
              }
            />
          </div>
          <img src="/images/icons-2c.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">
            VOCÊ JÁ OUVIU FALAR DE <strong>PEGA-PEGA SOMBRAS</strong>? OUÇA
            A EXPLICAÇÃO QUE O(A) PROFESSOR(A) VAI DAR SOBRE
            ESSA BRINCADEIRA E DIVIRTA-SE COM OS COLEGAS. DEPOIS,
            MARQUE, COMO DESEJAR, A IMAGEM QUE SE PARECE COM
            ESSA BRINCADEIRA.
          </p>
          {/* Imagem */}
          <div className="flex flex-col items-center my-6">
            <img
              src={pag19ShowContorno ? '/images/66.png' : '/images/19.png'}
              alt=""
              className="max-w-[60%]"
            />
            <p className="text-[10px] text-slate-600 mt-2">SAE Digital
            </p>
          </div>
          <button
            type="button"
            className="my-5 ml-6 rounded-lg border-2 border-[#832c87] bg-white px-4 py-2 text-sm font-medium text-[#832c87] transition hover:bg-[#faf8fc]"
            onClick={() => setPag19ShowContorno((v) => !v)}
          >
            {pag19ShowContorno ? 'Voltar à imagem original' : 'Mostrar a imagem que se parece com a brincadeira'}
          </button>
          <p className="mb-4 indent-6">DEPOIS DE SE DIVERTIR BRINCANDO
            DE <strong>PEGA-PEGA SOMBRAS</strong>, QUE TAL
            CONHECER UM JOGO QUE TAMBÉM
            TEM TUDO A VER COM SOMBRAS?</p>
          <div className="flex w-full justify-center">
            <GameModal
              thumbnailSrc="images/thumbDigi.svg"
              thumbnailAlt="Abrir objeto digital de aprendizagem"
              introHint="Clique para jogar."
            >
              <div className="relative h-full w-full bg-black">
                <iframe
                  src="https://go.sae.digital/2V2RNC"
                  title="Objeto digital de aprendizagem"
                  className="h-full w-full border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
                <a
                  href="https://go.sae.digital/2V2RNC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-3 top-3 z-[65] inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#80298F] shadow hover:bg-white sm:left-4 sm:top-4"
                  aria-label="Abrir objeto digital de aprendizagem em nova aba"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M14 3v2h3.59l-9.3 9.3 1.41 1.41 9.3-9.3V10h2V3h-7zM5 5h6V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-2v6H5V5z"
                    />
                  </svg>
                  Abrir em nova aba
                </a>
              </div>
            </GameModal>
          </div>

          <Pagination currentPage={20} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-4 indent-6"><strong>Resposta atividade:</strong></p><img src="/images/res_pag20.png" alt="" className="noborder" style={{ cursor: 'default' }} />

                </>
              }
            />
          </div>
          <img src="/images/icons-2e.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">OUÇA A LEITURA DE UM TEXTO QUE LEMBRA A BRINCADEIRA <strong>PEGA-PEGA</strong>. DEPOIS, FAÇA O QUE SE PEDE.</p>
          <CaixaTexto title="GATO E RATO" centered>
            <div>
              <p className="mb-4">O GATO ENTRA POR ALI</p>
              <p className="mb-4">O RATO SAI POR ACOLÁ</p>
              <br />
              <p className="mb-4">ONDE O GATO ESTÁ?</p>
              <p className="mb-4">ONDE O RATO ESTÁ? </p>
              <br />
              <p className="mb-4">O GATO ESTÁ SEMPRE ATRÁS DO RATO</p>
              <p className="mb-4">ATÉ O SOL RAIAR...</p>
              <p className="mb-4">BEM NA HORA DO GALO CANTAR!</p>
            </div>
          </CaixaTexto>
          <div className="flex w-full justify-center">
            <GameModal
              thumbnailSrc="images/thumbDigi.svg"
              thumbnailAlt="Abrir vídeo Escola Digital"
              introHint="Clique para assistir a videoaula."
            >
              <div className="relative h-full w-full bg-black">
                <iframe
                  src="https://go.sae.digital/ZuI25j"
                  title="Videoaula Escola Digital"
                  className="h-full w-full border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
                <a
                  href="https://go.sae.digital/ZuI25j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-3 top-3 z-[65] inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#80298F] shadow hover:bg-white sm:left-4 sm:top-4"
                  aria-label="Abrir videoaula em nova aba"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M14 3v2h3.59l-9.3 9.3 1.41 1.41 9.3-9.3V10h2V3h-7zM5 5h6V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-2v6H5V5z"
                    />
                  </svg>
                  Abrir em nova aba
                </a>
              </div>
            </GameModal>
          </div>
          <p className="mb-4 indent-6">ESCOLHA TRÊS CORES DIFERENTES DE LÁPIS DE COR: UMA PARA A
            PALAVRA <strong>GATO</strong>, UMA PARA A PALAVRA <strong>RATO</strong>, E OUTRA PARA A PALAVRA <strong>GALO</strong>. DEPOIS, ENCONTRE ESSAS TRÊS PALAVRAS NO TEXTO ACIMA
            E PINTE CADA UMA DELAS COM AS CORES QUE VOCÊ ESCOLHEU.</p>
          <p className="mb-4 indent-6">QUANTAS VEZES AS PALAVRAS <strong>GATO</strong>, <strong>RATO</strong> E <strong>GALO</strong> APARECEM NO TEXTO?
            PINTE OS QUADRINHOS QUE REPRESENTAM CADA QUANTIDADE. </p>

          <ContagemQuadrados storageKey="livro:pag20-contagem-gato-rato-galo" />
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>QUAL PALAVRA APARECE MAIS VEZES NO TEXTO? </li>
            <p>QUAL PALAVRA APARECE MENOS VEZES NO TEXTO?</p>
          </ul>
          <Pagination currentPage={21} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-4 indent-6"><strong>Resposta atividade:</strong></p>
                  <img src="/images/67.png" alt="" className="noborder" style={{ cursor: 'default' }} />
                  <p>Espera-se que as
                    crianças pintem a
                    imagem do galo.</p>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Espera-se que
                      as crianças
                      percebam que
                      as palavras
                      têm a mesma
                      quantidade de letras; que todas elas terminam com a
                      letra O; que as palavras gato e rato rimam.</li>

                  </ul>
                </>
              }
            />
          </div>
          <img src="/images/icons-2j.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">PINTE A FIGURA DO ÚNICO ANIMAL QUE NÃO ESTAVA BRINCANDO NA
            HISTÓRIA <strong>GATO E RATO</strong>. DEPOIS, ESCREVA, COMO SOUBER, O NOME DOS
            ANIMAIS QUE APARECEM NAS ILUSTRAÇÕES ABAIXO.
          </p>
          <button
            type="button"
            className="my-5 rounded-lg border-2 border-[#832c87] bg-white px-5 py-2.5 text-sm font-medium text-[#832c87] transition hover:bg-[#faf8fc]"
            onClick={() => setPag21ShowResposta((v) => !v)}
          >
            {pag21ShowResposta ? 'Voltar à imagem original' : 'Revelar resposta'}
          </button>
          <div className="my-6">
            <ImageFillQuestion
              items={FILL_PAG21_ITEMS.map((item) =>
                item.id === 'pag21-3'
                  ? {
                    ...item,
                    imageSrc: pag21ShowResposta
                      ? '/images/pag21_img4.png'
                      : '/images/pag21_img3.png',
                  }
                  : item,
              )}
              storageKey="livro:preencher-pag21-animais"
            />

          </div>
          <p className="text-[10px] text-slate-600 mt-2">fa5/Shutterstock
          </p>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>VOCÊ PERCEBEU ALGO DE PARECIDO ENTRE ESSAS PALAVRAS?
              CONVERSE COM SEUS COLEGAS E O(A) PROFESSOR(A).  </li>
            <p>VOCÊ LEMBRA QUAIS SÃO AS REGRAS DO <strong>PEGA-PEGA SOMBRAS</strong>? </p>
            <li>CONVERSE COM OS COLEGAS E O(A) PROFESSOR(A) PARA VOCÊS
              CONSTRUÍREM JUNTOS UM CARTAZ COM AS REGRAS DA BRINCADEIRA.  </li>
            <li>QUE TAL CRIAR UMA REGRA DIFERENTE PARA O PEGA-PEGA
              SOMBRAS? DEPOIS QUE TODOS DECIDIREM QUAL SERÁ A NOVA
              REGRA, REGISTRE-A NO CARTAZ QUE VOCÊS PRODUZIRAM!  </li>
          </ul>

          
          <ParaFamilia
            text="AS CRIANÇAS FORAM CONVIDADAS A SE DIVERTIREM COM BRINCADEIRAS QUE EXIGEM VELOCIDADE E ATENÇÃO. 
           
            ELAS COMEÇARAM COM O TRADICIONAL PEGA-PEGA E, EM SEGUIDA, SE AVENTURARAM NO PEGA-PEGA SOMBRAS. 
           
            ELAS CONSTRUÍRAM COLETIVAMENTE UM CARTAZ COM AS REGRAS DO PEGA-PEGA SOMBRAS E FORAM 
           
            CONVIDADAS A CRIAR UMA REGRA PARA ESSA BRINCADEIRA. POR FIM, EXPLORARAM A HISTÓRIA “GATO E RATO”."
          />



          <Pagination currentPage={22} />
          {/* Conteúdo do botão do professor - Tabela comparativa */}
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
                  <p className="mb-4 indent-6">EI03EO01; EI03EO02; EI03EO03;
                    EI03EO04; EI03EO07; EI03CG01;
                    EI03CG02; EI03CG03; EI03CG05;
                    EI03EF01; EI03EF03; EI03EF07;
                    EI03EF08; EI03ET01; EI03ET04.</p>
                  <TeacherButtonContentHeading>Expectativas de
                    aprendizagem</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Compreender e respeitar os
                      combinados do grupo. </li>
                    <li>Reconhecer as próprias conquistas e limitações com a
                      ajuda de um adulto. </li>
                    <li>Demonstrar atitudes solidárias e colaborativas junto ao
                      grupo em diferentes situações
                      cotidianas. </li>
                    <li>Expressar os próprios sentimentos com clareza. </li>
                    <li>Utilizar palavras novas em
                      situações comunicativas. </li>
                    <li>Cumprir as regras
                      estabelecidas. </li>
                    <li>Ampliar os movimentos direcionados que o próprio corpo
                      pode realizar. </li>
                    <li>Participar da criação de
                      movimentos em diferentes
                      contextos. </li>
                    <li>Identificar a posição das partes do corpo em relação aos
                      objetos. </li>
                    <li>Executar diversas possibilidades de movimentos, em diferentes direções, sem modelos
                      (em frente, atrás, para o lado,
                      para cima e para baixo). </li>
                    <li>Controlar voluntariamente as
                      ações motoras. </li>
                    <li>Ampliar a habilidade motora
                      fina por meio de atividades de
                      recorte (segurar a tesoura de
                      forma correta e recortar livremente) e de colagem (abrir e
                      fechar o tubo de cola e dosar o
                      líquido adequadamente). </li>
                    <li>Opinar sobre assuntos abordados em assembleia e/ou rodas
                      de conversa. </li>
                    <li>Realizar uma pseudoleitura. </li>
                    <li>Identificar a orientação da escrita (da esquerda para a direita, de cima para baixo). </li>
                    <li>Identificar letras conhecidas. </li>
                    <li>Conhecer diferentes gêneros textuais. </li>
                    <li>Levantar hipóteses sobre diferentes gêneros textuais observando suas
                      características. </li>
                    <li>Participar de momentos de leitura de diferentes gêneros textuais. </li>
                    <li>Identificar objetos que se assemelham às formas geométricas.  </li>
                    <li>Fazer tentativas de escrita de números.  </li>

                  </ul>
                  <TeacherButtonContentHeading>Você precisa de...</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Imagens e vídeos do esporte Ginástica Rítmica. </li>
                    <li>Bambolês (1 por criança). </li>
                    <li>Cola colorida. </li>
                    <li>Lápis de cor. </li>
                    <li>Bandejas com areia. </li>
                    <li>Gravetos. </li>
                    <li>Folhas de papel de diferentes tamanhos e gramaturas. </li>
                    <li>Tinta guache de diferentes cores. </li>
                    <li>Dado das Emoções. </li>

                  </ul>
                  <TeacherButtonContentHeading>Desenvolvimento das
                    atividades</TeacherButtonContentHeading>
                  <ol className="list-decimal marker:text-[#832c87] marker:font-bold ml-6">
                    <li>Com as crianças em roda, retome as propostas já realizadas ao longo da unidade, tanto as brincadeiras com bola quanto as de Pega-pega. Depois, convide-as
                      a conhecer outro brinquedo que, além de popular, pode ser utilizado em muitas
                      brincadeiras: o bambolê. Na sequência, pergunte: <em>Vocês já brincaram de bambolê?
                        Como podemos brincar com ele?</em> Acolha os comentários e as vivências das crianças
                      em relação às brincadeiras com o bambolê. Depois, disponibilize-o e deixe que a
                      turma o explore livremente.   </li>
                    <li>Na sequência, convide as crianças a observar atentamente a ilustração da
                      <strong>página 22</strong> do Livro do aluno, em que Toni e Laura aparecem brincando com um
                      bambolê. Após um tempo de observação, incentive-as a contar em qual parte do
                      corpo dos personagens o bambolê está apoiado. Assim que houver consenso sobre o bambolê estar apoiado na barriga, leia as palavras que estão na página 22
                      para as crianças e peça que pintem a palavra <strong>barriga</strong>. Chame a atenção delas para
                      que comparem as palavras <strong>bambolê</strong> e <strong>barriga</strong> e permita que façam as analogias
                      de acordo com suas perspectivas. Aproveite para destacar as letras que as pala
                      vras têm em comum, em especial a letra inicial.   </li>
                    <li> Para desenvolver a motricidade fina, convide as crianças a representar a letra B da
                      palavra <strong>bambolê</strong> em diferentes suportes, como na areia (em bandejas com areia,
                      areia do parque, areia colorida etc.), com os próprios dedos ou gravetos; na lousa,
                      com caneta apropriada; em folhas de papel de diferentes tamanhos e gramaturas, com lápis e canetinhas; no azulejo, com tinta; entre outros. Em seguida, peça a elas que se reúnam em roda
                      novamente e pensem em palavras que começam com a letra B
                      (bola, boliche, bilboquê, boneca, baldinho, bicicleta). Depois,
                      cada criança deve compartilhar
                      com a turma a palavra em que
                      pensou. Nesse momento, é importante respeitar caso alguma
                      criança não queira falar, seja por
                      dificuldade de identificar a letra
                      B em uma palavra, seja por não
                      se sentir confortável.   </li>
                    <li>Depois, incentive a turma a conhecer o poema sobre o bambolê, disponível na <strong>página 23</strong>
                      do Livro do aluno. Esse poema,
                      chamado “Bambolê”, foi escrito
                      por Sônia Barros e retoma uma
                      das ações feitas com o bambolê quando colocado na cintura
                      (rebolar), um movimento que
                      requer prática, dada a sua dificuldade de execução. Esse ato,
                      no poema, também é nomeado
                      como “dança dos quadris”, já
                      que é o quadril que notadamente se mexe, ainda que outras
                      partes do corpo também se movimentem. No poema, o bambolê é personificado, como se
                      tivesse “vontade própria” para
                      “ficar cansado e cair”. Não há
                      muitas rimas no texto (apenas
                      no primeiro e segundo versos –
                      “cá” e “lá”) e ele é composto de
                      duas estrofes: a primeira com
                      quatro versos, e a segunda com
                      seis versos.  </li>
                    <li>Em seguida, ensine uma va
                      riação da brincadeira. Leve as
                      crianças a um espaço externo e
                      faça a leitura das regras.  </li>
                    <CaixaTexto title='Passando o bambolê'>
                      <p className="mb-4 indent-6"><strong>Material:</strong></p>
                      <p className="mb-4 indent-6">- 1 ou 2 bambolês.</p>
                      <p className="mb-4 indent-6"><strong>Como brincar:</strong></p>
                      <p className="mb-4 indent-6">Essa brincadeira poderá ser realizada com um grupo de crianças
                        ou com a turma organizada em
                        duas equipes. Caso a brincadeira seja realizada com apenas um grupo, será necessário
                        um bambolê; caso tenham dois
                        grupos, serão necessários dois
                        bambolês. Todas as crianças devem ficar em pé, de mãos dadas
                        e em roda para iniciar a brincadeira. Entre duas crianças, pelo
                        braço, deverá ser colocado um
                        bambolê, que deve ser passado
                        pelo corpo de todas as crianças
                        e retornar ao mesmo local, sem
                        que a roda se desfaça. Se a roda
                        se desfizer, o bambolê deverá
                        retornar ao ponto de partida e a
                        brincadeira recomeça.</p>
                    </CaixaTexto>
                    <li>De volta à sala,  com o apoio do
                      Dado das Emoções, incentive as
                      crianças a se expressarem, co
                      mentando como foi brincar de
                      <strong>Passando o bambolê:</strong> <em>O que foi
                        mais desafiador? O que foi mais
                        fácil? As regras foram bem compreendidas? O que podemos fazer para chegar mais rapidamente
                        ao final da roda com o bambolê?
                        Algo na brincadeira deixou vocês
                        tristes? E empolgados?</em> </li>
                    <li>Retome a brincadeira de bambolê e convide as crianças a
                      refletir sobre suas regras, de
                      modo a levá-las a perceber
                      que, diferentemente das ou
                      tras brincadeiras, essa não tem
                      uma regra específica. Apesar
                      disso, podem ser estabelecidos
                      combinados, como cuidar do
                      bambolê e tentar não acertar o
                      brinquedo nos colegas.   </li>
                    <li>Na sequência, pergunte: <em>Vocês
                      viram o bambolê em brincadeiras e jogos, mas de que outras
                      formas ele pode ser usado?</em> Acolha as hipóteses das crianças
                      e, depois, conte que, apesar de o
                      bambolê ser um objeto bastante
                      utilizado em brincadeiras e jogos
                      infantis, existe uma modalidade
                      esportiva que também faz uso
                      desse objeto. Peça às crianças
                      que abram a <strong>página 24</strong> do Livro
                      do aluno e observem a imagem.
                      Depois, pergunte: <em>Alguém conhece esse esporte? O que parece ser feito com os bambolês
                        que as atletas da foto estão segurando? Alguém já assistiu a
                        alguma apresentação que tinha
                        algo parecido com a imagem?</em> </li>
                    <li>Explique à turma que a foto mostra atletas de uma modalidade
                      esportiva chamada de Ginástica
                      Rítmica, que pode ser competida no formato individual ou em
                      grupo de cinco pessoas. Nesse
                      esporte, as participantes apre
                      sentam coreografias de balé,
                      dança e ginástica, utilizando objetos para deixar a apresentação
                      mais dinâmica, como bola, fitas
                      e bambolê. Mostre às crianças
                      outras imagens ou algum vídeo
                      em que o bambolê está sendo
                      usado em uma apresentação.  </li>
                    <li>Para enriquecer ainda mais o
                      conhecimento sobre o esporte,
                      conte à turma que na Ginástica
                      Rítmica o bambolê é chamado
                      de arco. Depois, inspiradas no
                      esporte que acabaram de conhecer, convide as crianças para um
                      desafio em que elas devem escolher uma parte do corpo (braço,
                      pé, pescoço ou cintura) para brincar de girar o bambolê.   </li>
                    <li>Chame a turma para uma roda da conversa, mostre novamente o bambolê e pergunte: <em>Que formato tem esse bambolê? Espera-se que as crianças respondam
                      redondo ou circular. Continue: Quem conhece outros objetos ou brinquedos que
                      tenham o mesmo formato circular que o bambolê?</em>A ideia é fazer com que as
                      crianças associem o bambolê a outros objetos redondos, mas permita a elas que
                      encontrem essa resposta sozinhas. Caso você perceba que as crianças estão com
                      dificuldades de identificar o formato, estimule: <em>Que outro objeto redondo existe? </em> </li>
                    <li>Após a conversa, peça às crianças que abram a <strong>página 25</strong> do Livro do aluno, procurem as imagens que representam objetos de formato circular – como o de um
                      bambolê – e pintem como desejar. Depois, peça que contem quantos objetos pin
                      taram e escrevam o número no lugar indicado.  </li>

                  </ol>
                  <TeacherButtonContentHeading>Conteúdo digital</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">No <em>link</em>, você encontra a
                    seção “Observação ativa” e outras sugestões para enriquecer
                    a prática pedagógica.</p>
                  <a href="https://go.sae.digital/OtvnHy" target="_blank">https://go.sae.digital/OtvnHy</a>

                  <p className="mb-4 indent-6">
                    <strong>Resposta atividade:</strong>
                  </p>

                  <p className="mb-4 indent-6">
                    Barriga.
                  </p>
                </>
              }
            />
          </div>
          <img src="/images/icons-2j.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>VOCÊ CONHECE O <strong>BAMBOLÊ</strong>?</li>
            <li>JÁ PARTICIPOU DE ALGUMA BRINCADEIRA COM
              ESSE OBJETO?</li>
          </ul>
          <p className="mb-4 indent-6">DIVIRTA-SE MOSTRANDO AOS COLEGAS COMO VOCÊ BRINCA DE BAMBOLÊ. </p>
          <p className="mb-4 indent-6">A TURMINHA SAE TAMBÉM ADORA ESSA BRINCADEIRA! OBSERVE COMO
            LAURA, TONI E NINA BRINCAM COM O BAMBOLÊ. </p>
          <img src="/images/31.png" alt="" className="noborder" style={{ cursor: 'default' }} />
          <p className="text-[10px] text-slate-600 mt-2">SAE DIGITAL S/A
          </p>
          <p className="mb-4 indent-6">COM AJUDA DO(A) PROFESSOR(A), LEIA AS PALAVRAS ABAIXO. DEPOIS,
            PINTE O NOME DA PARTE DO CORPO QUE LAURA, TONI E NINA ESTÃO
            USANDO PARA BRINCAR COM O BAMBOLÊ. </p>

          <PalavrasBambolhe />

          <p className="mb-4 indent-6">BAMBOLÊ COMEÇA COM A LETRA <strong>B</strong>. VOCÊ CONHECE OUTRAS PALAVRAS
            QUE COMECEM COM ESSA LETRA? CONVERSE COM OS COLEGAS E
            O(A) PROFESSOR(A). </p>

          <Pagination currentPage={23} />
          <img src="/images/icons-2h.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">BRINCAR DE BAMBOLÊ É UM JEITO DIVERTIDO DE GASTAR ENERGIA,
            NÃO É MESMO? OUÇA A LEITURA DO POEMA <strong>BAMBOLÊ</strong>. </p>
          <CaixaTexto title="BAMBOLÊ" centered>
            <div>
              <p className="mb-4">BAMBOLÊ PRA CÁ,</p>
              <p className="mb-4">BAMBOLÊ PRA LÁ.</p>
              <p className="mb-4">A MENINA NÃO CONSEGUE
                PARAR DE REBOLAR.</p>
              <br />
              <p className="mb-4">SERÁ QUE É ELA QUEM SEGURA </p>
              <p className="mb-4">O QUANTO QUER O SEU BRINQUEDO</p>
              <p className="mb-4">NA DANÇA DOS QUADRIS?</p>
              <p className="mb-4">OU É ELE QUEM LHE DIZ</p>
              <p className="mb-4">QUE ESTÁ CANSADO</p>
              <p className="mb-4">E VAI CAIR?</p>
            </div>
            <p className="mt-2 mb-6" style={{ fontFamily: 'Ubuntu, sans-serif', color: 'rgb(0, 0, 0)', fontSize: '10px' }}>BARROS, SÔNIA. BAMBOLÊ. <em>IN</em>: <strong>CIRANDA MÁGICA E
              OUTROS POEMAS</strong>. SÃO PAULO: POSITIVO, 2009.</p>
          </CaixaTexto>
          <p className="mb-4 indent-6">QUE TAL BRINCAR COM O BAMBOLÊ EM GRUPO? </p>
          <p className="mb-4 indent-6">O(A) PROFESSOR(A) VAI APRESENTAR UM JEITO DIFERENTE DE BRINCAR
            COM O BAMBOLÊ. COM OS COLEGAS, OUÇA A LEITURA DAS REGRAS DA
            BRINCADEIRA <strong>PASSANDO O BAMBOLÊ</strong> E DIVIRTAM-SE JUNTOS! DEPOIS,
            COM O APOIO DO DADO DAS EMOÇÕES, COMPARTILHE COM A TURMA
            SE VOCÊ GOSTOU DE PARTICIPAR DA BRINCADEIRA. </p>
          <img src="/images/pag23_img1.png" alt="" className="noborder" style={{ cursor: 'default' }} />
          <p className="text-[10px] text-slate-600 mt-2">SAE DIGITAL S/A
          </p>
          <Pagination currentPage={24} />
          <img src="/images/icons-22.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">VOCÊ SABIA QUE O BAMBOLÊ NÃO É USADO APENAS EM BRINCADEIRAS?
            ELE TAMBÉM É USADO EM UM ESPORTE. OBSERVE A IMAGEM ABAIXO.</p>
          <img src="/images/pag24_img1.png" alt="" className="noborder" style={{ cursor: 'default' }} />
          <p className="text-[10px] text-slate-600 mt-2">Seventyfour/stock.adobe.com
          </p>
          <p className="mb-4 indent-6">VOCÊ CONHECE ESSE ESPORTE? ELE SE CHAMA <strong>GINÁSTICA RÍTMICA</strong>.
            NESSA GINÁSTICA, AS ATLETAS DANÇAM E USAM ALGUNS OBJETOS
            ENQUANTO SE MOVIMENTAM, COMO BAMBOLÊ, BOLA E FITA. ISSO
            DEIXA A APRESENTAÇÃO AINDA MAIS LEGAL! VOCÊ SABIA QUE, NESSA
            GINÁSTICA, O BAMBOLÊ SE CHAMA <strong>ARCO</strong>? </p>
          <ul className="list-disc marker:text-[#832c87] ml-6">
            <li>QUE TAL CONVIDAR
              SEUS COLEGAS PARA
              UM DESAFIO? ESCOLHA
              UMA PARTE DO CORPO
              PARA BRINCAR COM O
              BAMBOLÊ E DESCUBRA
              QUEM CONSEGUE
              FAZER ELE GIRAR
              POR MAIS TEMPO.</li>
          </ul>
          <img src="/images/pag24_img2.png" alt="" className="noborder" style={{ cursor: 'default' }} />
          <p className="text-[10px] text-slate-600 mt-2">Robert Kneschke/stock.adobe.com
          </p>

          <Pagination currentPage={25} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-4 indent-6"><strong>Resposta atividade:</strong></p>
                  <p className="mb-4 indent-6">Espera-se que as crianças pintem: pneu, anel,
                    boia, rosquinha, volante e roda de bicicleta.</p>
                  <p>CONTE QUANTOS OBJETOS VOCÊ PINTOU: 6.</p>
                </>
              }
            />
          </div>
          <img src="/images/icons-2m.png" alt="" className="noborder" style={{ cursor: 'default', width: '10%', height: 'auto' }} />
          <p className="mb-4 indent-6">OBSERVE A IMAGEM ABAIXO E PINTE OS OBJETOS QUE TÊM
            O FORMATO CIRCULAR, COMO O BAMBOLÊ.</p>
          {/* Imagem */}
          <div className="flex flex-col items-center my-6">
            <img
              src={pag25ShowContorno ? '/images/pag25_img1.png' : '/images/58.png'}
              alt=""
              className="max-w-[60%]"
            />
            <p className="text-[10px] text-slate-600 mt-2">Shajamal,Tom,Ali/stock.adobe.com
            </p>
          </div>
          <button
            type="button"
            className="my-5 ml-6 rounded-lg border-2 border-[#832c87] bg-white px-4 py-2 text-sm font-medium text-[#832c87] transition hover:bg-[#faf8fc]"
            onClick={() => setPag25ShowContorno((v) => !v)}
          >
            {pag25ShowContorno ? 'Voltar à imagem original' : 'Mostrar os objetos que têm formato circular.'}
          </button>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <p className="indent-6 md:flex-1">
              CONTE QUANTOS OBJETOS VOCÊ PINTOU.
              DEPOIS, COMO SOUBER, ESCREVA O
              NÚMERO NO QUADRO AO LADO.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={pag25ObjetosCount}
              onChange={(e) => setPag25ObjetosCount(e.target.value)}
              className="w-24 shrink-0 rounded-2xl border-2 border-[#0FA7A0] bg-transparent px-4 py-3 text-center text-3xl text-[#ED168F] outline-none focus:ring-2 focus:ring-[#0FA7A0]/30 md:w-28 md:py-4"
              aria-label="Quantidade de objetos pintados"
            />
          </div>
          <ParaFamilia text="DANDO CONTINUIDADE ÀS EXPLORAÇÕES SOBRE BRINCADEIRAS E SUAS REGRAS, AS CRIANÇAS FORAM 
APRESENTADAS AO BAMBOLÊ, UM BRINQUEDO USADO EM BRINCADEIRAS TRADICIONAIS. ELE FOI UTILIZADO 
EM JOGOS INDIVIDUAIS E COLETIVOS, PROMOVENDO INTERAÇÃO E COLABORAÇÃO ENTRE AS CRIANÇAS. 
ELAS TAMBÉM OUVIRAM O POEMA “BAMBOLÊ”, DE SÔNIA BARROS, E PARTICIPARAM DE ATIVIDADES 
RELACIONADAS AO TEXTO. ALÉM DISSO, CONHECERAM A GINÁSTICA RÍTMICA, UMA MODALIDADE OLÍMPICA 
QUE UTILIZA O BAMBOLÊ NAS APRESENTAÇÕES." />

          <Pagination currentPage={26} />
          {/* Conteúdo do botão do professor - Tabela comparativa */}
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
                  <p className="mb-4 indent-6">EI03EO01; EI03EO02; EI03EO04;
                    EI03EO07; EI03CG05; EI03TS02;
                    EI03EF01; EI03EF03; EI03EF09;
                    EI03ET02; EI03ET08.</p>
                  <TeacherButtonContentHeading>Expectativas de
                    aprendizagem</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Respeitar as produções dos
                      colegas.  </li>
                    <li>Compreender e respeitar os
                      combinados do grupo.  </li>
                    <li>Reconhecer as próprias
                      conquistas e limitações com
                      a ajuda de um adulto.  </li>
                    <li>Expressar os próprios sentimentos com clareza.  </li>
                    <li>Relatar gostos e necessidades.  </li>
                    <li>Cumprir as regras
                      estabelecidas.  </li>
                    <li>Controlar voluntariamente as
                      ações motoras.  </li>
                    <li>Ampliar a habilidade motora
                      fina por meio de atividades de
                      recorte (segurar a tesoura de
                      forma correta e recortar livremente) e de colagem (abrir e
                      fechar o tubo de cola e dosar
                      o líquido adequadamente).  </li>
                    <li>Executar habilidades manuais
                      utilizando diferentes recursos e
                      suportes, de variados tamanhos,
                      texturas, gramaturas e materiais.  </li>
                    <li>Utilizar diferentes materiais nas
                      produções artísticas.  </li>
                    <li>Expressar-se livremente
                      fazendo uso de diferentes
                      linguagens.  </li>
                    <li>Utilizar nas produções elementos básicos das formas artísticas: linhas (retas e curvas) e
                      cores (primárias e secundárias).  </li>
                    <li>Opinar sobre assuntos abordados em assembleia e/ou nas
                      rodas de conversa.  </li>
                    <li>Realizar uma pseudoleitura.  </li>
                    <li>Reconhecer ilustração e escrita
                      e diferenciá-las.  </li>
                    <li>Participar de situações coletivas de coleta e interpretação de dados.  </li>
                    <li>Construir gráficos de barras com elementos concretos (pequenas quantidades).  </li>
                  </ul>
                  <TeacherButtonContentHeading>Você precisa de...</TeacherButtonContentHeading>
                  <ul className="list-disc marker:text-[#832c87] ml-6">
                    <li>Riscantes diversos, tais como: lápis de cor, giz de cera e caneta hidrocor.</li>
                    <li>Cola.</li>
                    <li>Tesouras de pontas arredondadas (1 por criança).</li>
                    <li>Materiais artísticos diversos, tais como: retalhos de papéis coloridos, botões, barbante, revistas e retalhos de tecidos.</li>

                  </ul>
                  <TeacherButtonContentHeading>Desenvolvimento das
                    atividades</TeacherButtonContentHeading>
                  <ol className="list-decimal marker:text-[#832c87] marker:font-bold ml-6">
                    <li> Reúna as crianças em roda e relembre, oralmente, tudo o que foi visto ao longo desta unidade. Acolha as falas espontâneas das crianças e faça algumas intervenções
                      para que elas retomem as propostas que envolveram as brincadeiras com bola e
                      com bambolê e os tipos de Pega-pega. As propostas mais significativas e marcantes
                      são aquelas que, provavelmente, as crianças lembraram com maior frequência. Elas
                      podem ser mencionadas em razão das explorações e vivências, ao caráter lúdico ou
                      pelo fato de terem sido registradas de alguma forma no Livro do aluno.  </li>
                    <li> Após relembrar as brincadeiras, proponha à turma que relacione o nome de cada uma
                      das brincadeiras às ilustrações presentes na <strong>página 26</strong> do Livro do aluno. Trata-se de
                      duas brincadeiras para a “categoria” bola (Batata quente e Cabriola, cadê a bola?), uma
                      para Pega-pega (Pega-pega sombras) e uma para bambolê (Passando o bambolê).  </li>
                    <li> Inicialmente, leia o nome de cada uma das brincadeiras, um por vez, a fim de que
                      as crianças possam localizar, na coluna da direita, as ilustrações correspondentes.
                      Observe com atenção as crianças relacionando as colunas, para perceber quais
                      estratégias de leitura elas usam para fazer a correspondência imagem-palavra.  </li>
                    <li> Eleja com as crianças, entre as brincadeiras ilustradas, qual é a preferida da turma.
                      Faça um gráfico coletivamente para que a brincadeira mais votada fique evidente.
                      Depois, proponha que brinquem mais uma vez com a opção escolhida.  </li>
                    <li> Em seguida, convide as crianças a folhear o Livro do aluno a fim de recordar as
                      propostas e definir quais acharam mais significativas. Depois, motive-as a registrar, na <strong>página 27</strong> do Livro do aluno, a atividade de que mais gostaram. Para isso,
                      disponibilize retalhos de papéis coloridos, cola, tesoura de pontas arredondadas,
                      botões, barbante, revistas, retalhos de tecidos e riscantes diversos.  </li>
                    <li> Assim que finalizarem o registro, reúna as crianças em roda e convide-as a compartilhar com os colegas as produções, ou seja, mostrar qual foi a proposta ou
                      vivência desenhada e quais materiais escolheram utilizar.  </li>
                  </ol>
                  <TeacherButtonContentHeading>Conteúdo digital</TeacherButtonContentHeading>
                  <p className="mb-4 indent-6">No <em>link</em>, você encontra a
                    seção “Observação ativa” e outras sugestões para enriquecer
                    a prática pedagógica.</p>
                  <a href="https://go.sae.digital/OtvnHy" target="_blank">https://go.sae.digital/OtvnHy</a>

                  <p className="mb-4 indent-6">
                    <strong>Resposta atividade:</strong>
                  </p>

                  <img src="/images/res_pag26.png" alt="" className="noborder" style={{ cursor: 'default' }} />
                </>
              }
            />
          </div>

          <RelembrarAventurasCard />

          <p className="mb-4 indent-6">AGORA QUE VOCÊ JÁ CONHECEU DIFERENTES BRINCADEIRAS E
            SUAS REGRAS, LIGUE O NOME DAS BRINCADEIRAS ÀS IMAGENS
            CORRESPONDENTES.</p>

          <div className="my-8">
            <MatchConnectQuestion
              leftItems={MATCH_PAG26_LEFT}
              rightItems={MATCH_PAG26_RIGHT}
              storageKey="livro:ligar-pag26-brincadeiras"
              hint="Clique em uma frase da esquerda: a linha segue o mouse ou o dedo. Depois clique na imagem correspondente à direita para fechar a ligação."
            />
          </div>

          <p className="text-[10px] text-slate-600 mt-2">SAE DIGITAL S/A
          </p>
          <Pagination currentPage={27} />
          {/* Conteúdo do botão do professor */}
          <div className="my-6">
            <TeacherButton
              content={
                <>
                  <p className="mb-4 indent-6"><strong>Resposta atividade:</strong></p>
                  <p className="mb-4 indent-6">Resposta pessoal.</p>
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
                backgroundColor: '#832c87',
                border: '4px solid #832c87',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#FFFFFF',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
                Nesta unidade, você descobriu muitas coisas!

              </p>
            </div>
          </div>
          <p>PINTE A QUANTIDADE DE CORAÇÕES 
            QUE REPRESENTA O QUANTO VOCÊ QUE REPRESENTA O QUANTO VOCÊ
            GOSTOU DAS VIVÊNCIAS AO LONGO GOSTOU DAS VIVÊNCIAS AO LONGO
            DA UNIDADE. </p>

          <CoracoesPintar storageKey="livro:pag27-coracoes" />
          <div className="flex flex-col items-center mb-4">
            <div
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                borderRadius: '999px',
                backgroundColor: '#dbcde4',
                border: '4px solid #dbcde4',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#000000',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: 300,
                  fontSize: '18px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
               RELEMBRE AS EXPERIÊNCIAS VIVENCIADAS AO LONGO RELEMBRE AS EXPERIÊNCIAS VIVENCIADAS AO LONGO 
DA UNIDADE. DEPOIS, REGISTRE ABAIXO A VIVÊNCIA DE DA UNIDADE. DEPOIS, REGISTRE ABAIXO A VIVÊNCIA DE 
QUE VOCÊ MAIS GOSTOU.

              </p>
            </div>
          </div>
          <AreaDesenho storageKey="livro:pag27-desenho-final" />
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
          <img src="/images/setaTopo.svg" alt="Voltar ao início do livro" />
        </button>
      )}
    </div>
  );
}

export default Book;
