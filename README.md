# Crypto Visualizer

  

Um sistema de monitoramento de preços de criptomoedas em tempo real desenvolvido com Next.js e TypeScript.

  

## Descrição

  

O **Crypto Visualizer** é uma aplicação que exibe os preços das principais criptomoedas (Bitcoin, Ethereum, Dogecoin, Ripple, Solana, Litecoin) em tempo real utilizando a API WebSocket da Binance. Ao clicar em cada ativo, um modal é exibido com detalhes e gráficos de histórico de preços.

  

## Tecnologias Utilizadas

  

-  **Next.js** – Framework React com suporte a SSR e SSG.

-  **TypeScript** – Tipagem estática para maior segurança e manutenção.

-  **WebSockets** – Comunicação em tempo real com a API da Binance.

-  **Tailwind CSS** – Estilização rápida e responsiva.

-  **Recharts** – Exibição de gráficos interativos.

-  **Radix UI / ShadCN UI** – Componentes de interface.

  

## Funcionalidades

  

- Monitoramento em tempo real dos preços das principais criptomoedas.

- Página com gráficos detalhados do histórico de preços.

- Alteração da cor do preço (verde para alta, vermelho para queda) com base em comparações de valores.

- Atualizações controladas para evitar renderizações excessivas (por exemplo, atualizações a cada 2 segundos).

  

## Instalação

  

1.  **Clone o repositório:**

  

```bash
	git clone https://github.com/seu-usuario/crypto-visualizer.git
	cd crypto-monitor
```

2.  **Instale as dependências**

```bash
	npm install
```
ou  
```bash
	yarn  install
```
3.  **Configurar  TailwindCSS**
```bash
	npx tailwindcss init -p
```
4. **Execução do Projeto**
	- Para rodar o projeto em ambiente de desenvolvimento:
```bash
	npm run dev
```
ou
```bash
	yarn dev
```
## Passo a Passo para Contribuir

1. **Fork o repositório**
   - Clique no botão "Fork" no canto superior direito da página do repositório para criar uma cópia na sua conta do GitHub.

2. **Clone seu fork localmente**
   - Abra o terminal e clone o seu repositório:
     ```bash
     git clone https://github.com/seu-usuario/crypto-visualizer.git
     ```
   - Entre no diretório do projeto:
     ```bash
     cd crypto-monitor
     ```

3. **Crie uma branch para sua feature ou correção**
   - Crie uma nova branch com um nome descritivo:
     ```bash
     git checkout -b minha-feature
     ```
   - Certifique-se de que sua branch esteja atualizada com a branch principal:
     ```bash
     git pull origin main
     ```

4. **Implemente suas alterações**
   - Faça as modificações ou adições necessárias ao código.
   - Teste suas alterações para garantir que tudo funcione como esperado.

5. **Commit suas alterações**
   - Adicione os arquivos modificados:
     ```bash
     git add .
     ```
   - Faça um commit com uma mensagem clara e descritiva:
     ```bash
     git commit -m "Descrição clara da feature ou correção"
     ```

6. **Envie suas alterações para o GitHub**
   - Faça push da sua branch para o seu fork:
     ```bash
     git push origin minha-feature
     ```

7. **Abra um Pull Request**
   - No GitHub, acesse a página do seu repositório e clique no botão "Compare & pull request".
   - Revise suas alterações e adicione uma descrição detalhada do que foi modificado.
   - Clique em "Create pull request" para submeter sua contribuição.

## Padrões de Código e Boas Práticas

- **Escreva código limpo e legível:** Utilize nomes de variáveis e funções descritivos.
- **Mantenha os testes atualizados:** Se adicionar novas funcionalidades, crie ou atualize os testes existentes.
- **Documente suas alterações:** Atualize o README e outros documentos se suas alterações afetarem a utilização do projeto.
- **Siga o padrão de commit:** Utilize mensagens de commit claras e objetivas que expliquem o propósito das alterações.
