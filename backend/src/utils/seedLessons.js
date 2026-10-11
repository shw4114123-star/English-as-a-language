import { db } from "../db/mongodb.js";

const sampleLessons = [
    {
        title: "Everyday Greetings & Introductions",
        description: "Learn how to introduce yourself and greet people politely in casual and formal settings.",
        level: "Beginner",
        words: [
            { word: "Hello", translation: "שלום", meaning: "Used as a greeting", example: "Hello, how are you today?" },
            { word: "Pleasure", translation: "תענוג", meaning: "A feeling of happy satisfaction and enjoyment", example: "It is a pleasure to meet you." },
            { word: "Colleague", translation: "עמית לעבודה", meaning: "A person with whom one works in a profession or business", example: "This is my colleague, Sarah." },
            { word: "Welcome", translation: "ברוך הבא", meaning: "Greet someone arriving in a polite or friendly way", example: "Welcome to our English class!" }
        ],
        questions: [
            {
                question: "Which of the following is a polite formal greeting?",
                options: ["What's up dude?", "Good morning, pleased to meet you.", "Later!", "Hey you!"],
                answer: 1
            },
            {
                question: "What does 'Colleague' mean?",
                options: ["A pet animal", "A person you work with", "A vehicle", "A type of food"],
                answer: 1
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Food, Ordering & Dining Out",
        description: "Essential restaurant vocabulary and practical conversational phrases for ordering food.",
        level: "Beginner",
        words: [
            { word: "Menu", translation: "תפריט", meaning: "A list of dishes available in a restaurant", example: "Could we see the dessert menu, please?" },
            { word: "Delicious", translation: "טעים מאוד", meaning: "Highly pleasing to the sense of taste", example: "This soup is absolutely delicious." },
            { word: "Beverage", translation: "משקה", meaning: "A drink, especially one other than water", example: "Would you like a hot or cold beverage?" },
            { word: "Receipt", translation: "קבלה / חשבון", meaning: "A printed statement acknowledging payment", example: "Could I have the bill and a receipt?" }
        ],
        questions: [
            {
                question: "What do you ask for when you want to choose your food?",
                options: ["The receipt", "The menu", "The kitchen", "The luggage"],
                answer: 1
            },
            {
                question: "Which word means 'pleasing to the taste'?",
                options: ["Delicious", "Disaster", "Dry", "Doubtful"],
                answer: 0
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Travel & Navigating the Airport",
        description: "Key terminology for flights, boarding passes, luggage, and asking for directions.",
        level: "Intermediate",
        words: [
            { word: "Departure", translation: "המראה / יציאה", meaning: "The action of leaving, especially to start a journey", example: "Our departure time is scheduled for 8:00 AM." },
            { word: "Destination", translation: "יעד", meaning: "The place to which someone or something is going", example: "What is your final flight destination?" },
            { word: "Luggage", translation: "מטען / מזוודות", meaning: "Suitcases or other bags in which to pack personal belongings", example: "Please place your hand luggage in the overhead bin." },
            { word: "Passport", translation: "דרכון", meaning: "An official government document certifying identity", example: "Keep your passport and boarding pass ready." }
        ],
        questions: [
            {
                question: "Where do you look to see when airplanes are leaving?",
                options: ["Arrivals board", "Departures board", "Restroom sign", "Parking meter"],
                answer: 1
            },
            {
                question: "What document is required for international travel?",
                options: ["Passport", "Library card", "Receipt", "Menu"],
                answer: 0
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Professional Workplace & Business Meetings",
        description: "Advanced idioms, negotiation terms, and presentation vocabulary for professional careers.",
        level: "Advanced",
        words: [
            { word: "Negotiate", translation: "לשאת ולתת", meaning: "Try to reach an agreement or compromise by discussion", example: "We will negotiate the contract terms tomorrow." },
            { word: "Feasible", translation: "ישים / בר ביצוע", meaning: "Possible to do easily or conveniently", example: "Is this deadline feasible for our development team?" },
            { word: "Consensus", translation: "קונצנזוס / הסכמה רחבה", meaning: "A general agreement among a group", example: "The committee reached a consensus on the new policy." },
            { word: "Benchmark", translation: "מדד ייחוס", meaning: "A standard or point of reference against which things may be compared", example: "We used their performance as a benchmark for excellence." }
        ],
        questions: [
            {
                question: "What does 'Feasible' mean in project planning?",
                options: ["Impossible", "Workable and realistic to execute", "Overpriced", "Delayed"],
                answer: 1
            },
            {
                question: "When a team reaches general agreement, what have they achieved?",
                options: ["Conflict", "Consensus", "Confusion", "Cancellation"],
                answer: 1
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export async function seedLessonsIfEmpty() {
    try {
        const lessonsCollection = db.collection("lessons");
        const count = await lessonsCollection.countDocuments();
        if (count === 0) {
            await lessonsCollection.insertMany(sampleLessons);
            console.log("Seeded initial English lessons successfully!");
        }
    } catch (err) {
        console.error("Error seeding initial lessons:", err.message);
    }
}
