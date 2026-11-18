# S.I.A.F. — Sistema Integrado de Acompanhamento Fitológico

> **Inteligência fitológica para compreender alterações antes que se tornem visíveis.**

## Sobre o projeto

O **S.I.A.F. (Sistema Integrado de Acompanhamento Fitológico)** é uma proposta de plataforma de inteligência fitológica voltada à agricultura de precisão. Seu objetivo é auxiliar produtores e profissionais do setor agrícola a identificar possíveis alterações fisiológicas nas plantas antes que seus efeitos se tornem visualmente evidentes.

A solução combina o monitoramento de sinais eletrofisiológicos vegetais, variáveis ambientais, histórico individual das plantas e inteligência artificial para oferecer uma visão mais completa das condições de cada indivíduo.

Diferentemente dos métodos tradicionais, que se concentram principalmente nas condições ambientais e na identificação visual de sintomas, o S.I.A.F. busca compreender também como cada planta responde fisiologicamente ao ambiente em que está inserida.

## Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- npm
- Git

### 1. Instale as dependências

```bash
npm install
```

### 2. Execute o projeto

```bash
npm run dev
```

### 3. Acesse a aplicação

Após iniciar o servidor de desenvolvimento, acesse o endereço exibido no terminal:

```text
http://localhost:[porta citada no terminal]
```

Para encerrar a execução, pressione `Ctrl + C` no terminal.

## Problema identificado

Grande parte do monitoramento agrícola depende de inspeções visuais, medições ambientais pontuais e observações realizadas em intervalos.

Entretanto, fatores como temperatura, umidade do solo, luminosidade e precipitação não demonstram, isoladamente, como cada planta está respondendo às condições ambientais.

Além disso, quando os sintomas se tornam visíveis, determinadas alterações fisiológicas podem já estar estabelecidas, dificultando uma intervenção antecipada.

O S.I.A.F. propõe investigar como a combinação de sinais elétricos vegetais e informações ambientais pode contribuir para um acompanhamento mais precoce e individualizado.

## Nossa solução

A plataforma integra três perspectivas fundamentais:

- **Resposta da planta:** captação e análise de sinais eletrofisiológicos.
- **Contexto ambiental:** monitoramento das condições ao redor da planta.
- **Histórico individual:** comparação das medições atuais com o comportamento anterior de cada indivíduo.

Com essas informações, o sistema busca identificar alterações, estimar possíveis condições fisiológicas e apresentar evidências que auxiliem na tomada de decisão.

## Principais funcionalidades

- **Cadastro de plantas:** identificação de propriedades, áreas, cultivos, espécies, variedades e estágios de desenvolvimento.
- **Monitoramento ambiental:** acompanhamento de umidade do solo, temperatura, umidade do ar, luminosidade e condutividade elétrica.
- **Monitoramento eletrofisiológico:** registro e acompanhamento das variações elétricas das plantas.
- **Histórico individual:** armazenamento de medições, eventos, intervenções e alterações identificadas.
- **Análise inteligente:** identificação de anomalias e estimativa de possíveis condições fisiológicas.
- **Alertas:** sinalização de alterações persistentes, anomalias e problemas na qualidade das medições.
- **Painel de acompanhamento:** visualização individual e coletiva das plantas monitoradas.
- **Relatórios:** apresentação de evidências, hipóteses e recomendações contextualizadas.

## Como funciona

O funcionamento proposto para o S.I.A.F. segue um fluxo integrado:

1. **Aquisição:** sensores e eletrodos coletam sinais eletrofisiológicos e variáveis ambientais.
2. **Processamento:** os dados são capturados, organizados e preparados para análise.
3. **Armazenamento:** as informações são associadas à planta correspondente e registradas historicamente.
4. **Análise:** o S.I.A.F. Intelligence Engine analisa os dados e compara as medições com a linha de base individual.
5. **Interpretação:** a plataforma apresenta possíveis condições fisiológicas, evidências e níveis estimados de confiança.
6. **Acompanhamento:** o produtor verifica as informações, registra observações e intervenções, permitindo acompanhar a resposta da planta ao longo do tempo.

## S.I.A.F. Intelligence Engine

O mecanismo de inteligência do projeto tem como finalidade analisar padrões eletrofisiológicos e ambientais para identificar alterações potencialmente relevantes.

A proposta considera:

- Processamento e análise de sinais.
- Identificação de anomalias.
- Comparação com linhas de base individuais.
- Utilização de modelos de Machine Learning.
- Associação entre sinais elétricos e condições ambientais.
- Apresentação de hipóteses acompanhadas de evidências e incertezas.

**Importante:** as análises representam hipóteses sobre possíveis condições fisiológicas, e não diagnósticos definitivos. A interpretação deve considerar a qualidade dos dados e a necessidade de verificação no cultivo.

## Tecnologias e arquitetura

A arquitetura tecnológica proposta para o projeto contempla as seguintes tecnologias:

| Camada                  | Tecnologias                                  |
| ----------------------- | -------------------------------------------- |
| Frontend                | React, TypeScript e Vite                     |
| Interface               | Material UI                                  |
| Visualização de dados   | Apache ECharts                               |
| Backend / API           | Python e FastAPI                             |
| Banco de dados          | PostgreSQL                                   |
| Comunicação IoT         | MQTT                                         |
| Inteligência Artificial | NumPy, SciPy, pandas, scikit-learn e PyTorch |
| Hardware                | ESP32                                        |
| Infraestrutura          | Docker, GitHub e GitHub Actions              |

A plataforma foi concebida para oferecer uma interface responsiva, com possibilidade de acesso por computadores, tablets e dispositivos móveis.

_Observação: a lista representa a stack tecnológica prevista no projeto e não necessariamente todas as tecnologias já integradas ao protótipo._

## Público-alvo

O S.I.A.F. foi pensado principalmente para:

- Pequenos e médios produtores rurais.
- Gestores de estufas, viveiros e cultivos de alto valor.
- Cooperativas agrícolas.
- Equipes de assistência técnica.
- Pesquisadores e instituições de pesquisa em fisiologia vegetal e agricultura de precisão.

## Fundamentação científica

O projeto parte do conhecimento de que plantas apresentam atividade elétrica associada à comunicação e às respostas a estímulos e condições ambientais.

Pesquisas recentes investigam a utilização desses sinais em conjunto com sensores e técnicas de aprendizado de máquina para caracterizar respostas fisiológicas vegetais.

Entre as referências consideradas no desenvolvimento conceitual estão:

- Kozlova et al. (2025).
- Terral et al. (2026).
- Zhou et al. (2025).

O S.I.A.F. não pressupõe a existência de um padrão elétrico universal para todas as plantas. A interpretação dos sinais depende de fatores como espécie, tecido, estágio de desenvolvimento, condições ambientais e método de medição.

## Limitações e desafios

O desenvolvimento de uma solução desse tipo apresenta desafios científicos e tecnológicos que precisam ser considerados:

- Estabilidade do contato entre sensores e tecidos vegetais.
- Interferências ambientais e elétricas.
- Ruídos e possíveis desvios nas medições.
- Diferenças fisiológicas entre espécies e estágios de desenvolvimento.
- Necessidade de conjuntos de dados padronizados e devidamente identificados.
- Validação experimental das relações entre padrões elétricos e condições fisiológicas.
- Generalização dos modelos para diferentes plantas e ambientes.

Por esse motivo, o projeto prevê desenvolvimento progressivo, experimentos controlados e apresentação explícita das incertezas.

## Objetivo do protótipo

Este repositório reúne o protótipo do S.I.A.F., desenvolvido no contexto do projeto acadêmico de inovação em Agricultura de Precisão.

O protótipo tem como finalidade demonstrar a proposta da solução, sua interface e os conceitos envolvidos no acompanhamento fitológico integrado.

A implementação e a integração dos diferentes componentes da arquitetura fazem parte da evolução da solução.

## Equipe de desenvolvimento

Projeto desenvolvido por:

- Ana Caroline Nascimento Silva — RM 564599
- Beatriz Camargo Serafini — RM 565050
- Lucas da Silveira Araujo — RM 97616
- Pedro Henrique Miranda de Vasconcelos — RM 562682
- Sandra Eduarda Mendes da Silva — RM 563434

## Contexto acadêmico

**Projeto:** Global Solution — 2º Semestre  
**Área:** Agricultura de Precisão  
**Solução:** Sistema Integrado de Acompanhamento Fitológico (S.I.A.F.)

---

_Projeto acadêmico de inovação tecnológica. O S.I.A.F. é uma proposta de apoio à tomada de decisão e não substitui a avaliação técnica especializada ou a verificação das condições reais de cultivo._
