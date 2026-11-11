window.bancoPreguntas = [
        // --- THIS / THAT / THESE / THOSE (Afirmativas) ---
        { antes: "Look at", despues: "ring on my finger!", opciones: ["this", "these", "those"], correcta: "this" },
        { antes: "Can you pass me", despues: "books over there on the shelf?", opciones: ["those", "these", "that"], correcta: "those" },
        { antes: "", despues: "shoes I am wearing right now are super comfortable.", opciones: ["These", "This", "That"], correcta: "These" },
        { antes: "Look up in the sky!", despues: "bird is huge!", opciones: ["That", "This", "Those"], correcta: "That" },
        { antes: "I really like", despues: "apple I'm eating.", opciones: ["this", "these", "those"], correcta: "this" },
        { antes: "", despues: "cookies in the jar across the room look delicious.", opciones: ["Those", "These", "That"], correcta: "Those" },
        { antes: "Hold", despues: "boxes here while I open the door.", opciones: ["these", "this", "that"], correcta: "these" },
        { antes: "Who lives in", despues: "house at the end of the street?", opciones: ["that", "these", "those"], correcta: "that" },

        // --- THIS / THAT / THESE / THOSE (Negativas) ---
        { antes: "", despues: "shirt in my hand isn't my size.", opciones: ["This", "These", "Those"], correcta: "This" },
        { antes: "I don't know", despues: "people standing by the gate.", opciones: ["those", "these", "that"], correcta: "those" },
        { antes: "", despues: "keys right here on the table are not mine.", opciones: ["These", "This", "That"], correcta: "These" },
        { antes: "", despues: "car parked across the street doesn't belong to us.", opciones: ["That", "Those", "These"], correcta: "That" },
        { antes: "We can't buy", despues: "glasses here; they are too expensive.", opciones: ["these", "this", "that"], correcta: "these" },
        { antes: "", despues: "idea you mentioned yesterday won't work.", opciones: ["That", "These", "Those"], correcta: "That" },

        // --- THIS / THAT / THESE / THOSE (Preguntas) ---
        { antes: "Excuse me, is", despues: "seat next to you taken?", opciones: ["this", "these", "those"], correcta: "this" },
        { antes: "Are", despues: "your bags over there by the exit?", opciones: ["those", "this", "that"], correcta: "those" },
        { antes: "How much are", despues: "earrings here in the display case?", opciones: ["these", "this", "that"], correcta: "these" },
        { antes: "What is", despues: "noise coming from outside?", opciones: ["that", "these", "those"], correcta: "that" },
        { antes: "Do you like", despues: "photos I have on my phone?", opciones: ["these", "this", "that"], correcta: "these" },
        { antes: "Whose jacket is", despues: "hanging on the far wall?", opciones: ["that", "these", "those"], correcta: "that" },

        // --- THERE IS / THERE ARE (Afirmativas) ---
        { antes: "", despues: "a spider on the ceiling!", opciones: ["There is", "There are", "There"], correcta: "There is" },
        { antes: "", despues: "three apples in the fridge.", opciones: ["There are", "There is", "Is there"], correcta: "There are" },
        { antes: "", despues: "some milk left in the bottle.", opciones: ["There is", "There are", "Are there"], correcta: "There is" },
        { antes: "", despues: "many people waiting in line today.", opciones: ["There are", "There is", "Is there"], correcta: "There are" },
        { antes: "", despues: "an urgent message for you on your desk.", opciones: ["There is", "There are", "Are there"], correcta: "There is" },
        { antes: "", despues: "two bathrooms in this apartment.", opciones: ["There are", "There is", "Is there"], correcta: "There are" },
        { antes: "", despues: "a lot of traffic on the highway right now.", opciones: ["There is", "There are", "Are there"], correcta: "There is" },

        // --- THERE ISN'T / THERE AREN'T (Negativas) ---
        { antes: "", despues: "any sugar left in the bowl.", opciones: ["There isn't", "There aren't", "There are"], correcta: "There isn't" },
        { antes: "", despues: "any chairs available in the meeting room.", opciones: ["There aren't", "There isn't", "There is"], correcta: "There aren't" },
        { antes: "", despues: "a bank near my house.", opciones: ["There isn't", "There aren't", "Are there"], correcta: "There isn't" },
        { antes: "", despues: "many clouds in the sky today.", opciones: ["There aren't", "There isn't", "Is there"], correcta: "There aren't" },
        { antes: "", despues: "enough time to finish the project today.", opciones: ["There isn't", "There aren't", "There are"], correcta: "There isn't" },
        { antes: "", despues: "any students in the classroom yet.", opciones: ["There aren't", "There isn't", "Is there"], correcta: "There aren't" },
        { antes: "", despues: "a problem with your reservation.", opciones: ["There isn't", "There aren't", "There are"], correcta: "There isn't" },

        // --- IS THERE / ARE THERE (Preguntas) ---
        { antes: "", despues: "a pharmacy close to here?", opciones: ["Is there", "Are there", "There is"], correcta: "Is there" },
        { antes: "", despues: "any eggs in the kitchen?", opciones: ["Are there", "Is there", "There are"], correcta: "Are there" },
        { antes: "How many days", despues: "in a leap year?", opciones: ["are there", "is there", "there are"], correcta: "are there" },
        { antes: "", despues: "any water in the fridge?", opciones: ["Is there", "Are there", "There is"], correcta: "Is there" },
        { antes: "", despues: "any good movies on TV tonight?", opciones: ["Are there", "Is there", "There are"], correcta: "Are there" },
        { antes: "Excuse me,", despues: "a Wi-Fi password for guests?", opciones: ["is there", "are there", "there is"], correcta: "is there" },

        // --- COMBINADAS (Para distinguir contexto) ---
        { antes: "Look at", despues: "two dogs playing over there.", opciones: ["those", "these", "that"], correcta: "those" },
        { antes: "", despues: "a cat sleeping on", despues2: "sofa right here.", opciones: ["There is", "There are", "These"], correcta: "There is" },
        { antes: "I don't think", despues: "is the right road.", opciones: ["this", "these", "those"], correcta: "this" },
        { antes: "", despues: "no reason to worry about", despues2: "exam.", opciones: ["There is", "There are", "Those"], correcta: "There is" },
        { antes: "Why are", despues: "boxes still here on the floor?", opciones: ["these", "this", "that"], correcta: "these" },
        { antes: "", despues: "five missed calls on your phone.", opciones: ["There are", "There is", "This is"], correcta: "There are" },
        { antes: "Is", despues: "your sister standing across the street?", opciones: ["that", "these", "those"], correcta: "that" },
        { antes: "", despues: "any coffee left in the pot?", opciones: ["Is there", "Are there", "These are"], correcta: "Is there" },
        { antes: "Take", despues: "documents here and put them in", despues2: "cabinet over there.", opciones: ["these", "this", "that"], correcta: "these" },
        { antes: "", despues: "many reasons why I love", despues2: "city.", opciones: ["There are", "There is", "This is"], correcta: "There are" }
    ];
