# Integrador

# Comandos Básicos de Git

## 1. Clonar el Repositorio

Para descargar el proyecto, ejecuta el siguiente comando:

```bash
git clone https://github.com/DEPREMU/Integrador.git
```

## 2. Agregar Cambios

Para agregar archivos al área de preparación (staging):

```bash
git add FileName/      # Agrega un archivo específico
git add .              # Agrega todos los cambios en el proyecto
```

## 3. Confirmar Cambios

Realiza un commit de los cambios agregados:

```bash
git commit             # Abre un editor para que escribas el mensaje del commit
```

O bien, si prefieres hacerlo en una línea:

```bash
git commit -m "Mensaje de el/los cambio/s"
```

## 4. Verificar Estado del Repositorio

Para ver el estado de los archivos y detectar cambios no comprometidos:

```bash
git status
```

## 5. Actualizar desde el Repositorio Remoto

Antes de realizar nuevos cambios, asegúrate de tener la última versión del proyecto:

```bash
git pull
```

## 6. Crear y posicionarse en la rama

Para subir updates y que se verifique antes de agregarse al main:

```bash
git checkout -b nombreDeRama
```

## 7. Subir cambios al Repositorio Remoto en una Rama

Para enviar tus cambios a la rama y evitar posibles problemas en el Main:

```bash
git push origin nombreDeRama
```

---

# Configuración del Proyecto

## 1. Instalar Node.js

Asegúrate de tener Node.js instalado (versión >= 22). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

## 2. Instalar Dependencias

Navega a la ruta del proyecto y ejecuta los siguientes comandos:

```bash
npm install            # Instala las dependencias del proyecto
npm install -g expo    # Instala Expo CLI globalmente
npm install -g eas-cli # Instala EAS CLI globalmente
```

## 3. Verificar Instalaciones (Opcional)

Para confirmar que Expo y EAS están instalados correctamente, ejecuta:

```bash
expo --version
eas --version
```

## 4. Instalar Expo Go

Para ver la aplicación en funcionamiento, instala Expo Go en tu dispositivo (Android y/o iPhone).

---

# Configuración de Variables de Entorno

1. Copia el archivo `.env.example` y renómbralo como `.env`.
2. Abre el archivo `.env` y agrega tus propias claves y configuraciones.

### Variables necesarias dentro de .env:

- `supabaseUrl`: La URL de tu proyecto de Supabase.
- `supabaseKey`: La clave pública (anon) de tu proyecto de Supabase.

# Extensiones que recomiendo para trabajar en este proyecto:

1. Auto Rename Tag
2. Better Comments
3. Error Lens
4. Prettier - Code formatter
5. ES7+ React...
6. Image preview
7. Path Intellisense
8. React Native Tools
9. Indent-rainbow
10. Javascript Auto Backticks
11. npm Insellisense
12. Version Lens
