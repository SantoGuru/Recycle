````markdown
# 📱 Guia de Inicialização do Projeto Mobile

## ✅ Requisitos
- **Node.js** (versão LTS recomendada)  
- **npm** ou **yarn**  
- **Expo CLI** instalado globalmente (`npm install -g expo-cli`)  
- **Git**  
- Para emuladores:  
  - **Android Studio** (com SDK configurado)  
  - **Xcode** (apenas macOS, para iOS)  

---

## 🚀 Inicialização com Expo (Dispositivo Real)
1. Clone o repositório:  
   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
````

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```
3. Inicie o servidor Expo:

   ```bash
   npx expo start
   ```
4. Baixe o aplicativo **Expo Go** no celular (Android/iOS).
5. Escaneie o QR Code exibido no terminal ou navegador.

### É necessário configurar o IP para acessar o backend 
1. Acesse o prompt e digite ipconfig
2. Copie o ipv4 da sua máquina
3. Altere o ip em config.ts

---

## 💻 Inicialização em Emulador Android

1. Abra o **Android Studio** e inicialize um dispositivo virtual (AVD).
2. No projeto, execute:

   ```bash
   npx expo start
   ```
3. Pressione **a** no terminal para abrir no emulador Android.

---

## 🍏 Inicialização em Simulador iOS (macOS)

1. Certifique-se de ter o **Xcode** instalado e atualizado.
2. No projeto, execute:

   ```bash
   npx expo start
   ```
3. Pressione **i** no terminal para abrir no simulador iOS.

---

## 📂 Estrutura do Projeto

* **/app** – Telas e rotas do aplicativo
* **/components** – Componentes reutilizáveis
* **/constants** – Cores, temas e variáveis globais
* **/hooks** – Hooks customizados
* **/assets** – Imagens, ícones e fontes


