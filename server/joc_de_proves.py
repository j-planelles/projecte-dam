import base64
import itertools
import random
import sys
import unicodedata
import uuid
from datetime import datetime, timedelta

import requests
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

# URL base de l'API
base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8002"

# Password per defecte per tots els usuaris
PASSWORD = "12341234"

NOMS_USUARIS = [
    "Nil",
    "Júlia",
    "Arnau",
    "Laia",
    "Pau",
    "Mar",
    "Roger",
    "Clàudia",
    "Jan",
    "Aina",
    "Oriol",
    "Ivet",
    "Pol",
    "Gisela",
    "Guillem",
    "Mireia",
    "Èric",
    "Núria",
    "Marc",
    "Carla",
]

COGNOMS_USUARIS = [
    "Serra",
    "Vilà",
    "Ribas",
    "Ferrer",
    "Pujol",
    "Solé",
    "Camps",
    "Casas",
    "Font",
    "Cortés",
    "Moreno",
    "Roca",
    "Martí",
    "Puig",
    "Sala",
    "Costa",
    "Roig",
    "Mas",
    "Grau",
    "Vendrell",
]

DESCRIPCIONS_USUARIS = [
    "Game over inside 🖤💀, respawn never.",
    "Lost in pixels, found in shadows 🌑🎮.",
    "No save point for my soul 😔🕹️.",
    "Lagging in life, top frag in pain 😶‍🌫️🔫.",
    "Respawned but still broken 💔🔄.",
    "Ctrl+Alt+Del my feelings 🖱️😢.",
    "Muted mic, loud thoughts 🎧🖤.",
    "Glitched heart, endless night 🌒💔.",
    "Loading sadness... 99% ⏳😞.",
    "Disconnected from reality 🌌🔌.",
    "Low HP, high anxiety 💉😬.",
    "Noob in happiness, pro in sadness 😔🏆.",
    "Alt+F4 my dreams 💻💤.",
    "Shadow banned from joy 🕶️🚫.",
    "XP in pain, level up in tears 😢⬆️.",
    "Gamepad, but no control in life 🎮😶.",
    "Press F to pay respects to my mood 🕹️🕯️.",
    "Achievement unlocked: sadness 🏅😭.",
    "Solo queue in the void 🌑👤.",
    "AFK from happiness, online in sorrow 😞🌐.",
]

# Noms d'exemple per rutines
NOMS_RUTINES = [
    "Chest Workout",
    "Arms Workout",
    "Legs Workout",
    "Feet Workout",
    "Back Workout",
    "Shoulders Workout",
    "Abs Workout",
    "Cardio Routine",
    "Full Body Workout",
    "Upper Body Workout",
    "Lower Body Workout",
    "HIIT Session",
    "Stretching Routine",
    "Core Strength",
    "Glutes Workout",
    "Biceps Blast",
    "Triceps Toning",
    "Calves Workout",
    "Mobility Routine",
    "Balance Training",
    "Endurance Circuit",
    "Powerlifting Session",
    "Yoga Flow",
    "Pilates Routine",
]

# Descripcions d'exemple
DESCRIPCIONS_RUTINES = [
    "Rutina per enfortir el pit amb exercicis com press de banca i flexions.",
    "Entrenament centrat en bíceps i tríceps per augmentar la força dels braços.",
    "Sessió per treballar quàdriceps, isquiotibials i glutis.",
    "Exercicis específics per enfortir i estirar els peus.",
    "Rutina per desenvolupar l'esquena amb dominades i rems.",
    "Entrenament per tonificar i enfortir les espatlles.",
    "Sessió d'abdominals per reforçar el core i la zona mitja.",
    "Entrenament cardiovascular per millorar la resistència.",
    "Rutina completa que treballa tot el cos en una sola sessió.",
    "Entrenament enfocat a la part superior del cos.",
    "Sessió per potenciar la part inferior del cos.",
    "Entrenament d'alta intensitat per cremar greixos ràpidament.",
    "Rutina d'estiraments per millorar la flexibilitat.",
    "Entrenament per enfortir la zona central del cos.",
    "Sessió per tonificar i enfortir els glutis.",
    "Entrenament intensiu per als bíceps.",
    "Rutina per definir i enfortir els tríceps.",
    "Sessió específica per treballar els bessons.",
    "Entrenament per millorar la mobilitat articular.",
    "Rutina per desenvolupar l'equilibri corporal.",
    "Circuit per augmentar la resistència física.",
    "Sessió de força centrada en powerlifting.",
    "Rutina de ioga per relaxar i estirar el cos.",
    "Sessió de pilates per millorar la postura i el to muscular.",
]


# Eliminar accents
def elimina_accents(text):
    return "".join(
        c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn"
    )


# Funció per obtenir la clau pública del servidor
def get_public_key():
    response = requests.get(f"{base_url}/auth/publickey")
    if response.status_code == 200:
        return response.json()
    return None


# Funció per encriptar un missatge amb la clau pública
def encrypt_message(message, public_key_pem):
    public_key = RSA.import_key(public_key_pem)
    encryptor = PKCS1_OAEP.new(public_key, hashAlgo=SHA256)

    message_bytes = message.encode("utf-8")
    encrypted_bytes = encryptor.encrypt(message_bytes)
    encrypted_message = base64.b64encode(encrypted_bytes).decode("utf-8")

    return encrypted_message


# Funció per registrar un usuari
def register_user(username, password, public_key_pem):
    encrypted_password = encrypt_message(password, public_key_pem)
    response = requests.post(
        f"{base_url}/auth/register",
        params={"username": username, "password": encrypted_password},
    )
    return response.status_code == 200


# Funció per obtenir un token d'autenticació
def get_token(username, password, public_key_pem):
    encrypted_password = encrypt_message(password, public_key_pem)
    response = requests.post(
        f"{base_url}/auth/token",
        data={
            "username": username,
            "password": encrypted_password,
            "grant_type": "password",
        },
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None


# Funció per actualitzar el perfil d'un usuari
def update_profile(token, full_name, biography):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/auth/profile",
        headers=headers,
        json={"full_name": full_name, "biography": biography},
    )
    return response.status_code == 200


# Funció per obtenir els exercicis per defecte
def get_default_exercises(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/default-exercises", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per crear un exercici
def create_exercise(token, exercise_data):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/user/exercises", headers=headers, json=exercise_data
    )
    return response.status_code == 200


# Funció per obtenir els exercicis de l'usuari
def get_user_exercises(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/user/exercises", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per crear una rutina (workout)
def create_workout(token, workout_data):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/user/workouts", headers=headers, json=workout_data
    )
    return response.status_code == 200


# Funció per crear una plantilla (template)
def create_template(token, template_data):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/user/templates", headers=headers, json=template_data
    )
    if response.status_code == 200:
        return response.json()
    return None


# Funció per registrar-se com a entrenador
def register_as_trainer(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{base_url}/auth/register/trainer", headers=headers)
    return response.status_code == 200


# Funció per buscar entrenadors
def search_trainers(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/user/trainer/search", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per crear una petició a un entrenador
def create_trainer_request(token, trainer_uuid):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/user/trainer/request",
        headers=headers,
        params={"trainer_uuid": trainer_uuid},
    )
    return response.status_code == 200


# Funció per obtenir les peticions d'entrenador
def get_trainer_requests(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/trainer/requests", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per processar una petició d'entrenador
def handle_trainer_request(token, user_uuid, action):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/trainer/requests/{user_uuid}",
        headers=headers,
        params={"action": action},
    )
    return response.status_code == 200


# Funció per obtenir els usuaris enllaçats a un entrenador
def get_paired_users(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/trainer/users", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per assignar una recomanació a un usuari
def create_recommendation(token, user_uuid, workout_uuid):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/trainer/users/{user_uuid}/recommendation",
        headers=headers,
        params={"workout_uuid": workout_uuid},
    )
    return response.status_code == 200


# Funció per obtenir el perfil de l'usuari
def get_user_profile(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/auth/profile", headers=headers)
    if response.status_code == 200:
        return response.json()
    return None


# Funció per obtenir les plantilles de l'usuari
def get_user_templates(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/user/templates", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per obtenir els interessos disponibles
def get_interests(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/user/trainer/interests", headers=headers)
    if response.status_code == 200:
        return response.json()
    return []


# Funció per actualitzar els interessos de l'usuari
def update_interests(token, interest_uuids):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{base_url}/user/trainer/interests", headers=headers, json=interest_uuids
    )
    return response.status_code == 200


# Funció principal
def main():
    print(f"Conectant a: {base_url}")

    # Obtenir la clau pública del servidor
    public_key_pem = get_public_key()
    if not public_key_pem:
        print("Error en obtenir la clau pública del servidor")
        return

    print("Clau pública obtinguda correctament")

    # Llista d'usuaris a crear
    users = []

    for nom, cognom in itertools.product(NOMS_USUARIS, COGNOMS_USUARIS):
        descripcio = random.choice(DESCRIPCIONS_USUARIS)
        users.append([nom, cognom, descripcio])

    # Llista per emmagatzemar les dades dels usuaris
    user_data = []

    # Registrar i configurar usuaris
    for user_info in users:
        first_name, last_name, bio = user_info
        username = f"{elimina_accents(first_name.lower())}.{elimina_accents(last_name.lower().split(' ')[0])}"
        # password = "password123"

        print(f"Registrant usuari: {username}")
        if register_user(username, PASSWORD, public_key_pem):
            token = get_token(username, PASSWORD, public_key_pem)
            if token:
                full_name = f"{first_name} {last_name}"
                update_profile(token, full_name, bio)

                # Guardar les dades de l'usuari
                user_profile = get_user_profile(token)
                user_data.append(
                    {
                        "username": username,
                        "password": PASSWORD,
                        "token": token,
                        "profile": user_profile,
                        "exercises": [],
                        "workouts": [],
                        "templates": [],
                    }
                )
                print(
                    f"Usuari {username} registrat correctament amb UUID: {user_profile['uuid']}"
                )

                # Obtenir i establir interessos
                interests = get_interests(token)
                if interests and len(interests) > 0:
                    # Seleccionar el primer interès
                    selected_interest_uuid = [interests[0]["uuid"]]
                    if update_interests(token, selected_interest_uuid):
                        # print(
                        #     f"Interès '{interests[0]['name']}' establert per a {username}"
                        # )
                        pass
                    else:
                        print(f"Error en establir l'interès per a {username}")
            else:
                print(f"Error en obtenir el token per a {username}")
        else:
            print(f"Error en registrar l'usuari {username}")

    # Per a cada usuari, crear exercicis, rutines i plantilles
    for user in user_data:
        token = user["token"]
        print(f"\nProcessant usuari: {user['username']}")

        # Obtenir exercicis per defecte
        default_exercises = get_default_exercises(token)
        # print(f"Obtinguts {len(default_exercises)} exercicis per defecte")

        # Crear exercicis personalitzats basats en els exercicis per defecte
        num_exercises = random.randint(5, 15)
        for i in range(num_exercises):
            default_exercise = random.choice(default_exercises)
            default_exercises.remove(default_exercise)
            exercise_data = {
                "uuid": str(uuid.uuid4()),
                "name": default_exercise["name"],
                "description": f"Versió personalitzada de {default_exercise['name']}.\n{default_exercise['description']}",
                "body_part": default_exercise["body_part"],
                "type": default_exercise["type"],
                "default_exercise_uuid": default_exercise["uuid"],
            }

            if create_exercise(token, exercise_data):
                user["exercises"].append(exercise_data)
                # print(f"Exercici creat: {exercise_data['name']}")
            else:
                print(f"Error en crear l'exercici {exercise_data['name']}")

        # Obtenir tots els exercicis de l'usuari
        user_exercises = get_user_exercises(token)
        print(f"L'usuari té {len(user_exercises)} exercicis disponibles")

        # Crear rutines (workouts)
        num_workouts = random.randint(20, 150)
        print(f"Creant {num_workouts} rutines...")

        for i in range(num_workouts):
            # Generar timestamp (actual menys entre 0 i 56 dies)
            days_ago = random.randint(0, 56)
            timestamp = int(
                (datetime.now() - timedelta(days=days_ago)).timestamp() * 1000
            )

            # Seleccionar entre 3 i 10 exercicis aleatoris
            num_exercises_in_workout = random.randint(3, 10)
            selected_exercises = random.sample(
                user_exercises, min(num_exercises_in_workout, len(user_exercises))
            )

            # Crear les entrades de la rutina
            entries = []
            for exercise in selected_exercises:
                # Crear entre 1 i 5 sèries per exercici
                num_sets = random.randint(1, 5)
                sets = []

                for j in range(num_sets):
                    set_data = {
                        "reps": random.randint(5, 20),
                        "weight": round(random.uniform(5, 100), 1),
                        "set_type": random.choice(["normal", "dropset", "failture"]),
                    }
                    sets.append(set_data)

                entry = {
                    "exercise": {
                        "uuid": exercise["uuid"],
                        "name": exercise["name"],
                        "body_part": exercise["body_part"],
                        "type": exercise["type"],
                    },
                    "sets": sets,
                    "rest_countdown_duration": random.randint(30, 120),
                    "weight_unit": random.choice(["metric", "imperial"]),
                }
                entries.append(entry)

            # Crear la rutina
            workout_data = {
                "uuid": str(uuid.uuid4()),
                "name": random.choice(NOMS_RUTINES),
                "description": f"Descripció de la rutina {i + 1} {random.choice(DESCRIPCIONS_RUTINES)}",
                "instance": {
                    "timestamp_start": timestamp,
                    "duration": random.randint(
                        1800, 7200
                    ),  # Entre 30 min i 2 hores en s
                },
                "entries": entries,
            }

            if create_workout(token, workout_data):
                user["workouts"].append(workout_data)
                # print(f"Rutina creada: {workout_data['name']}")
            else:
                print(f"Error en crear la rutina {workout_data['name']}")

        # Crear plantilles (templates)
        num_templates = random.randint(1, 10)
        print(f"Creant {num_templates} plantilles...")

        for i in range(num_templates):
            # Seleccionar entre 3 i 10 exercicis aleatoris
            num_exercises_in_template = random.randint(3, 10)
            selected_exercises = random.sample(
                user_exercises, min(num_exercises_in_template, len(user_exercises))
            )

            # Crear les entrades de la plantilla
            entries = []
            for exercise in selected_exercises:
                # Crear entre 1 i 5 sèries per exercici
                num_sets = random.randint(1, 5)
                sets = []

                for j in range(num_sets):
                    set_data = {
                        "reps": random.randint(5, 20),
                        "weight": round(random.uniform(5, 100), 1),
                        "set_type": random.choice(["normal", "dropset", "failture"]),
                    }
                    sets.append(set_data)

                entry = {
                    "exercise": {
                        "uuid": exercise["uuid"],
                        "name": exercise["name"],
                        "body_part": exercise["body_part"],
                        "type": exercise["type"],
                    },
                    "sets": sets,
                    "rest_countdown_duration": random.randint(30, 120),
                    "weight_unit": random.choice(["metric", "imperial"]),
                }
                entries.append(entry)

            # Crear la plantilla
            template_data = {
                "uuid": str(uuid.uuid4()),
                "name": random.choice(NOMS_RUTINES),
                "description": f"Descripció de la plantilla {i + 1} {random.choice(DESCRIPCIONS_RUTINES)}",
                "entries": entries,
            }

            template_response = create_template(token, template_data)
            if template_response:
                user["templates"].append(template_response)
                # print(f"Plantilla creada: {template_data['name']}")
            else:
                print(f"Error en crear la plantilla {template_data['name']}")

    # Registrar alguns usuaris com a entrenadors
    trainers = []
    for user in user_data:
        if random.random() < 0.25:
            token = user["token"]
            if register_as_trainer(token):
                trainers.append(user)
                print(f"\nUsuari {user['username']} registrat com a entrenador")
            else:
                print(f"\nError en registrar {user['username']} com a entrenador")

    # Crear peticions d'entrenador
    for user in user_data:
        # Si l'usuari no és entrenador, pot fer una petició
        if user not in trainers:
            token = user["token"]

            # Buscar entrenadors disponibles
            available_trainers = search_trainers(token)
            if available_trainers:
                # Seleccionar un entrenador aleatori
                trainer = random.choice(available_trainers)

                # Crear una petició
                if create_trainer_request(token, trainer["uuid"]):
                    print(
                        f"\nUsuari {user['username']} ha creat una petició a l'entrenador {trainer['username']}"
                    )
                else:
                    print(
                        f"\nError en crear la petició de {user['username']} a l'entrenador {trainer['username']}"
                    )
            else:
                print(
                    f"\nNo s'han trobat entrenadors disponibles per a {user['username']}"
                )

    # Processar les peticions d'entrenador
    accepted_users = []
    for trainer in trainers:
        token = trainer["token"]

        # Obtenir les peticions
        requests = get_trainer_requests(token)
        print(f"\nEntrenador {trainer['username']} té {len(requests)} peticions")

        # Processar cada petició
        for request in requests:
            if random.random() < 0.75:
                # Del 75% que es processen, 25% es deneguen i 75% s'accepten
                if random.random() < 0.25:
                    action = "deny"
                else:
                    action = "accept"

                user_uuid = request["user"]["uuid"]
                if handle_trainer_request(token, user_uuid, action):
                    print(
                        f"Petició de {request['user']['username']} {'acceptada' if action == 'accept' else 'denegada'} per {trainer['username']}"
                    )
                    if action == "accept":
                        accepted_users.append(request["user"])
                else:
                    print(
                        f"Error en processar la petició de {request['user']['username']}"
                    )

    # Assignar rutines als usuaris enllaçats
    for trainer in trainers:
        token = trainer["token"]

        # Obtenir els usuaris enllaçats
        paired_users = get_paired_users(token)
        print(
            f"\nEntrenador {trainer['username']} té {len(paired_users)} usuaris enllaçats"
        )

        # Obtenir les plantilles de l'entrenador
        trainer_templates = get_user_templates(token)

        # Per a cada usuari enllaçat, assignar algunes plantilles
        for user in paired_users:
            user_uuid = user["uuid"]

            # Seleccionar algunes plantilles aleatòries
            num_templates_to_assign = min(random.randint(1, 5), len(trainer_templates))
            selected_templates = random.sample(
                trainer_templates, num_templates_to_assign
            )

            # Assignar cada plantilla
            for template in selected_templates:
                if create_recommendation(token, user_uuid, template["uuid"]):
                    print(
                        f"Plantilla {template['name']} assignada a {user['username']} per {trainer['username']}"
                    )
                else:
                    print(
                        f"Error en assignar la plantilla {template['name']} a {user['username']}"
                    )

    # Imprimir resum per pantalla
    print("\nUsuaris entrenadors:")
    for trainer in trainers:
        print(f"  - {trainer['username']}")

    print("\nUsuaris normals amb un entrenador associat:")
    for user in accepted_users:
        print(f"  - {user['username']}")

    print(
        f'\nJoc de dades creat correctament. Per entrar a qualsevol usuari, escriu el seu nom d\'usuari i entra la contrasenya "{PASSWORD}".\n'
    )


if __name__ == "__main__":
    main()
