# TODO

- Crear repositori github
- Implementar camp descripció als exercicis
- Adaptar tipus de TypeScript
- Implementar totes les Funcionalitats de nivell alt abans de passar a fer el backend
- Implementar diferents temes
- Dissenyar icona
- Abans de fer el backend, revisió de l'esquema de la base de dades

# Funcionalitats app mòbil (classificades per importància)

- Escollir servidor, Login, Register - Gestió del token (ALT)
- Workout (ALT)
  - Tracker (varis unitats de pes i distància, varis tipus d'exercicis (repeticions, pes assistit, temps)), historial de workouts (càlcul historial d'exercicis i pesos), llistat d'exercicis (ALT)
  - Templates per usuari (poder-les editar i eliminar) (ALT)
  - Persistir configuració usuari, historial de workouts, exercicis i templates (ALT)
    Aquest s'utilitzarà com a cache per si no hi ha connexió amb el servidor. Caldrà implementar lògica addicional per saber quins camps s'han desat al servidor.
  - Separació entre exercicis custom (per usuari o globals, pensar-ho) i exercicis normals (mitjà)
  - Workout ongoing persisteixi a LocalStorage (mitjà)
  - Notificació (mitjà)
  - Especificar a quin gimnàs s'han fet les rutines (baix)
  - Equipament als gimnasos i relacionar-ho amb exercicis (baix)
  - Workouts per setmana i calendari (baix)
  - Cronometre a la pantalla de workout pels exercicis de temps (baix)
  - Importació exportació dades, importació strong (baix)
  - Varis idiomes (baix)
- Community (ALT)
  - Publicar templates (ALT)
  - Buscar templates (ALT)
  - Compartir templates per codi QR (baix)
- Trainer (mitjà)
  - Onboarding i administració (implementar el concepte de Likes) (mitjà)
  - Recomanació workouts (mitjà)
  - Chat (baix)
  - Descobrir entrenadors per un mapa (baix)
  - Connectar-se amb un entrenador per QR (baix)

# Idees

- Pensar connexió entre usuari i entrenador personal abans de connectar-se: Posar un quadre de cerca en que es poden filtrar per les activitats que es fan. També connexió per QR.

# Tecnologies

- Practicar fetching de dades
  ~- Fetching bàsic (Crear app amb backend d'exemple)~
  ~- React Query~
  ~- Cache~
  - Mutations -> FALTA UTILITZAR EL HOOK useMutation
  - Optimistic
  - Infinite Queries -> Mirar com fer-ho amb una API
- Considerar local storage -> Encrypted storage pels tokens i AsyncStorage. Implementar amb Zustand.
- Mirar OpenAPI
- Mirar tècniques pel Git: branches, pull requests...
