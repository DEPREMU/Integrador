# Integrador

# Comandos Básicos de Git

## 1. Clonar el Repositorio
Para descargar el proyecto, ejecuta el siguiente comando:
```
git clone https://github.com/DEPREMU/Integrador.git
```

## 2. Agregar Cambios
Para agregar archivos al área de preparación (staging):
```
git add FileName/      # Agrega un archivo específico
git add .              # Agrega todos los cambios en el proyecto
```

## 3. Confirmar Cambios
Realiza un commit de los cambios agregados:
```
git commit             # Abre un editor para que escribas el mensaje del commit
```
O bien, si prefieres hacerlo en una línea:
```
git commit -m "Mensaje de el/los cambio/s"
```

## 4. Verificar Estado del Repositorio
Para ver el estado de los archivos y detectar cambios no comprometidos:
```
git status
```

## 5. Actualizar desde el Repositorio Remoto
Antes de realizar nuevos cambios, asegúrate de tener la última versión del proyecto:
```
git pull
```

## 6. Subir Cambios al Repositorio Remoto
Para enviar tus cambios al repositorio remoto:
```
git push
```

---

# Configuración del Proyecto

## 1. Instalar Node.js
Asegúrate de tener Node.js instalado (versión >= 22). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

## 2. Instalar Dependencias
Navega a la ruta del proyecto y ejecuta los siguientes comandos:
```
npm install            # Instala las dependencias del proyecto
npm install -g expo    # Instala Expo CLI globalmente
npm install -g eas-cli # Instala EAS CLI globalmente
```

## 3. Verificar Instalaciones (Opcional)
Para confirmar que Expo y EAS están instalados correctamente, ejecuta:
```
expo --version
eas --version
```

## 4. Instalar Expo Go
Para ver la aplicación en funcionamiento, instala Expo Go en tu dispositivo (Android y/o iPhone).
