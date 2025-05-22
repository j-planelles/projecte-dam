# Ultra Workout Manager

Aquest és el meu projecte de final de grau pel Cicle Formatiu de Grau Superior de Desenvolupament d'Aplicacions Multiplataforma (DAM), cursat a l'Institut de Palamós.

## Instal·lació de Clients

Els clients per a escriptori i mòbil estan disponibles com a fitxers precompilats. Aquests es poden descarregar des de la secció "Releases" del repositori de GitHub.

Es proporcionen els següents formats:

* Un paquet `.apk` per a dispositius Android.
* Un instal·lador `.msi` i `.exe` per a sistemes Windows. Cal tenir instal·lat [WebView2](https://developer.microsoft.com/es-es/microsoft-edge/webview2) per al correcte funcionament.
* Un paquet `.deb` per a distribucions Linux basades en Debian.
* Un paquet `.rpm` per a distribucions Linux compatibles amb el format RedHat.
* Un executable `.AppImage` per a qualsevol sistema Linux. Aquest format és portable i no requereix instal·lació.

## Instal·lació del Servidor

La instal·lació del servidor es pot realitzar mitjançant un script instal·lador automatitzat. Aquest script requereix un entorn Linux amb `git` i `docker` instal·lats.

Per dur a terme la instal·lació, executeu una de les següents ordres en el directori on desitgeu instal·lar el servidor:

```bash
curl -s https://raw.githubusercontent.com/j-planelles/projecte-dam/refs/heads/main/server/installer.sh | bash
```

o bé

```bash
wget -qO- https://raw.githubusercontent.com/j-planelles/projecte-dam/refs/heads/main/server/installer.sh | bash
```

Un cop finalitzada l'execució de l'instal·lador, inicieu el servei executant `docker compose up` des de la carpeta d'instal·lació.
Podeu editar la configuració del servidor modificant el fitxer `.env`. Dins d’aquest fitxer podreu configurar el port que s’exposa el servei, la configuració de la base de dades, la clau per encriptar els tokens JWT i el nom del servidor per mostrar a la pantalla d’inici de sessió.

### Importar Joc de Proves

He desenvolupat un script en Python per entrar de manera massiva dades d'exemple per demostrar les capacitats de la meva aplicació.

Un cop instal·lat el servidor, ens dirigim a la carpeta `projecte-dam/server`.
Primer de tot, crearem un entorn virtual (`venv`) per instal·lar les dependències de Python.

`python3 -m venv venv`

Un cop creat, l'activem.

`source venv/bin/activate`

Tot seguit, instal·lem les dependències de Python.

`pip install -r requirements.txt`

Finalment, podem executar l'script `joc_de_proves.py`. Aquest rebrà com a argument la URL del servidor d'Ultra.

`python3 joc_de_proves.py http://localhost:8002`

## Compilació de l'Aplicació Mòbil

1. **Instal·lació de Prerequisits:** Assegureu-vos de tenir instal·lats `git`, `npm`, `pnpm` (opcional, però recomanat), les Android Platform Tools per a `adb` i Android Studio.

2. **Clonar el Projecte:** Cloneu el repositori del projecte i navegueu al directori `mobile`.

```bash
git clone https://github.com/j-planelles/projecte-dam.git && cd projecte-dam/mobile
```

3. **Instal·lació de Dependències:** Instal·leu les dependències del projecte.

```bash
pnpm install
```

4. **Compilació de l'Aplicació:** Abans d'executar l'ordre de compilació, connecteu un dispositiu Android via USB i configureu la depuració USB. Si no es detecta cap dispositiu connectat, s'iniciarà un emulador.

```bash
pnpx expo run:android --no-bundler --variant release
```

El fitxer `.apk` compilat es trobarà a la següent ruta: `projecte-dam/mobile/android/app/build/outputs/apk/release/app-release.apk`.

## Compilació de l'Aplicació d'Escriptori

1. **Instal·lació de Prerequisits:** Assegureu-vos de tenir instal·lats `git`, `npm` i `pnpm` (opcional, però recomanat).

    Així mateix, instal·leu les dependències necessàries per a Tauri, les quals es detallen a la següent URL: <https://v2.tauri.app/start/prerequisites/>

2. **Clonació del Projecte i Navegació al Directori:** Cloneu el repositori del projecte i navegueu al directori `desktop`.

```bash
git clone https://github.com/j-planelles/projecte-dam.git && cd projecte-dam/desktop
```

3. **Instal·lació de Dependències del Projecte:** Instal·leu les dependències del projecte.

```bash
pnpm install
```

4. **Compilació de l'Aplicació:** Tingueu en compte que l'script de compilació generarà instal·ladors exclusivament per al sistema operatiu en el qual s'executi.

    En alguns casos a Linux, podria ser necessari definir la variable d'entorn `NO_STRIP=true` per compilar un fitxer AppImage.

    A continuació es detallen els formats generats per a cada sistema operatiu:

    * **Linux:**
        * Un paquet `.deb`
        * Un paquet `.rpm`
        * Un executable `.AppImage`

    * **Windows:**
        * Un instal·lador `.msi`
        * Un instal·lador `.exe`

    Executeu l'ordre de compilació:

```bash
NO_STRIP=true pnpm tauri build
```

Els fitxers de sortida es localitzaran al directori: `projecte-dam/desktop/src-tauri/target/release/bundle/`.ython.

`pip install -r requirements.txt`

Finalment, podem executar l'script `joc_de_proves.py`. Aquest rebrà com a argument la URL del servidor d'Ultra.

`python3 joc_de_proves.py http://localhost:8002`
