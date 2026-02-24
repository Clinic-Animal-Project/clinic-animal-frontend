# 🔐 CREDENCIALES DE ACCESO - Clínica Veterinaria

## 📋 Usuarios de Prueba

La aplicación cuenta con 3 usuarios de prueba con diferentes roles:

---

### 👑 ADMINISTRADOR
**Email:** `admin@clinica.com`  
**Contraseña:** `admin123`  
**Permisos:** Acceso completo a todas las funcionalidades

**Usuario:**
- Nombre: Juan Administrador
- Rol: Administrador
- ID: usr_001

---

### 🩺 VETERINARIO
**Email:** `veterinario@clinica.com`  
**Contraseña:** `vet123`  
**Permisos:** Gestión de pacientes, historiales médicos, citas

**Usuario:**
- Nombre: María Veterinaria
- Rol: Veterinario
- ID: usr_002

---

### 📋 RECEPCIONISTA
**Email:** `recepcion@clinica.com`  
**Contraseña:** `recep123`  
**Permisos:** Agendar citas, gestión de dueños

**Usuario:**
- Nombre: Ana Recepcionista
- Rol: Recepcionista
- ID: usr_003

---

## 🚀 Cómo Usar

1. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

2. **Abrir el navegador:**
   ```
   http://localhost:4200
   ```

3. **Iniciar sesión:**
   - Serás redirigido automáticamente a `/auth/login`
   - Ingresa uno de los correos y contraseñas de arriba
   - Click en "Iniciar Sesión"

4. **Probar la aplicación:**
   - Luego del login, serás redirigido al Dashboard
   - El menú lateral te permite navegar entre:
     - 📊 Dashboard
     - 🐾 Pacientes (Mascotas)
     - 👥 Dueños
     - 📅 Citas
     - 📋 Historial Médico
     - 💊 Inventario
     - 💰 Facturación

---

## ⚠️ IMPORTANTE

**Esta es una autenticación SIMULADA (MOCK)**

- **NO hay backend real** conectado
- Los datos se guardan en `localStorage` del navegador
- Las credenciales están hardcodeadas en el código
- Es **SOLO para desarrollo y pruebas**

**Para producción:**
1. Conectar con un backend real (Node.js, Spring Boot, etc.)
2. Implementar autenticación JWT real
3. Cambiar `loginMock()` por `login()` en el LoginComponent
4. Configurar las URLs en `environments/environment.production.ts`

---

## 🔄 Funcionalidades Implementadas

✅ **Sistema de Login:**
- Validación de credenciales
- Manejo de errores
- Loading states
- Persistencia en localStorage

✅ **Protección de Rutas:**
- Guard de autenticación
- Redireccionamiento automático
- Verificación de token

✅ **Gestión de Sesión:**
- Información del usuario en el header
- Botón de cerrar sesión
- Signal reactivo del usuario actual

✅ **Interceptores:**
- Token automático en todas las peticiones HTTP
- Manejo global de errores

---

## 🛠️ Troubleshooting

### No puedo iniciar sesión
- Verifica que estés usando las credenciales exactas (con mayúsculas/minúsculas)
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que el formulario sea válido (email formato correcto)

### Me redirige al login constantemente
- Presiona F12 y ve a Application > Local Storage
- Verifica que exista `auth_token` y `current_user`
- Si no existen, el problema está en el `setSession()`

### Los cambios no se reflejan
- Haz un hard refresh: Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
- Limpia el localStorage: F12 > Application > Local Storage > Clear All

---

## 📞 Contacto

Para más información sobre la estructura del proyecto, revisa:
- `ESTRUCTURA.md` - Documentación completa de la arquitectura
- `README.md` - Información general del proyecto

---

**Fecha de actualización:** 16 de febrero de 2026  
**Versión:** 1.0.0
