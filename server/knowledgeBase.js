const knowledgeBase = [
  {
    intent: 'greetings',
    examples: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    response: 'Hello! How can I assist you today?'
},
{
    intent: 'farewell',
    examples: ['bye', 'goodbye', 'see you later', 'take care', 'have a nice day', 'farewell'],
    response: 'Goodbye! Have a great day!'
},
{
    intent: 'thanks',
    examples: ['thank you', 'thanks a lot', 'much appreciated', 'thanks so much', 'thanks for your help'],
    response: 'You\'re welcome! Feel free to ask if you need further assistance.'
},
{
    intent: 'help',
    examples: ['help', 'assist', 'support', 'need help', 'help me'],
    response: 'Sure, I\'m here to help. What do you need assistance with?'
},
{
    intent: 'yes',
    examples: ['yes', 'yeah', 'yep', 'sure', 'okay', 'absolutely'],
    response: 'Great!'
},
{
    intent: 'no',
    examples: ['no', 'nope', 'nah', 'not really', 'negative'],
    response: 'Okay, no problem.'
},
{
    intent: 'questions',
    examples: ['what', 'why', 'how', 'when', 'where'],
    response: 'I can help answer your questions.'
},
{
    intent: 'weather',
    examples: ['what\'s the weather like today?', 'is it going to rain?', 'weather forecast'],
    response: 'Let me check the weather for you.'
},
{
    intent: 'time',
    examples: ['what time is it?', 'current time', 'what\'s the time now?'],
    response: 'It\'s currently XX:XX AM/PM.'
},
{
    intent: 'thanks',
    examples: ['thank you', 'thanks a lot', 'much appreciated', 'thanks so much', 'thanks for your help'],
    response: 'You\'re welcome! Feel free to ask if you need further assistance.'
},
{
    intent: 'goodbye',
    examples: ['bye', 'see you later', 'farewell', 'take care', 'have a nice day'],
    response: 'Goodbye! Have a great day!'
},
{
    intent: 'about',
    examples: ['what are you?', 'who created you?', 'tell me about yourself'],
    response: 'I am a virtual assistant designed to help you with various tasks.'
},
{
    intent: 'age',
    examples: ['how old are you?', 'what\'s your age?', 'when were you created?'],
    response: 'I am an AI and do not have an age.'
},
{
    intent: 'location',
    examples: ['where are you?', 'what\'s your location?', 'where do you live?'],
    response: 'I exist in the digital realm.'
},
{
    intent: 'favorites',
    examples: ['what\'s your favorite color?', 'do you have any hobbies?', 'what do you like?'],
    response: 'I do not have personal preferences or hobbies as I am an AI.'
},
{
    intent: 'music',
    examples: ['play some music', 'what\'s your favorite song?', 'can you sing?'],
    response: 'I can\'t play music or sing, but I can help you find music recommendations.'
},
{
    intent: 'jokes',
    examples: ['tell me a joke', 'do you know any jokes?', 'make me laugh'],
    response: 'Sure, here\'s a joke: Why don\'t scientists trust atoms? Because they make up everything!'
},
{
    intent: 'insults',
    examples: ['you\'re stupid', 'you\'re useless', 'you\'re boring'],
    response: 'I apologize if I have disappointed you. My goal is to assist you as best I can.'
},
{
    intent: 'compliments',
    examples: ['you\'re smart', 'you\'re helpful', 'you\'re awesome'],
    response: 'Thank you! I\'m here to assist you.'
},
{
    intent: 'random',
    examples: ['tell me something random', 'give me a random fact', 'surprise me'],
    response: 'Did you know that the shortest war in history was between Britain and Zanzibar in 1896? It lasted only 38 minutes!'
}
];

function findResponse(userInput) {
  const input = userInput.toLowerCase();

  const entry = knowledgeBase.find(entry => entry.examples.some(example => input.includes(example)));

  return entry ? entry.response : "NO RELATED DATA FOUND";
}

// Function to add data to knowledge base
function addToKnowledgeBase(intent, examples, response, manager) {
    knowledgeBase.push({ intent, examples, response })
    // console.log(knowledgeBase)
    examples.forEach(example => {
        manager.addDocument('en', example, intent);
    });
    manager.addAnswer('en', intent, response);
    manager.train();
}

module.exports = {knowledgeBase, findResponse, addToKnowledgeBase}