import { QuizGame, QuizQuestion } from "@/components/QuizGame";

const questions: QuizQuestion[] = [
  {
    q: "What should you do if a stranger online asks for your real name and school?",
    options: [
      "Tell them because they asked nicely",
      "Ask them for their name first",
      "Do not share it and tell a trusted adult",
      "Send them a funny picture",
    ],
    correct: 2,
    why: "Your name, school, address, and phone number are private information.",
  },
  {
    q: "Which password is safer?",
    options: ["123456", "password", "BlueTigerMoon72!", "Your birthday"],
    correct: 2,
    why: "Long, hard-to-guess passwords are safer than common words, birthdays, or simple numbers.",
  },
  {
    q: 'Your tablet says, "Update available." What should you do?',
    options: [
      "Ignore it forever",
      "Ask a parent or teacher to help update it",
      "Throw the tablet away",
      "Turn off Wi-Fi",
    ],
    correct: 1,
    why: "Updates help fix security problems and keep devices safer.",
  },
  {
    q: 'You win "free game coins" from a website you do not know. It asks for your login. What should you do?',
    options: [
      "Enter your username and password",
      "Ask a trusted adult first",
      "Share it with all your friends",
      "Use your parent's password",
    ],
    correct: 1,
    why: "Fake prizes are often tricks to steal accounts.",
  },
  {
    q: "What is personal information?",
    options: ["Your favorite color", "Your home address", "Your favorite animal", "Your favorite superhero"],
    correct: 1,
    why: "Personal information can identify where you live or who you are.",
  },
  {
    q: 'Someone sends you a scary message saying, "Click now or your game account will disappear!" What should you do?',
    options: ["Click quickly", "Reply with your password", "Stop and ask an adult", "Send it to everyone"],
    correct: 2,
    why: "Scary urgent messages can be phishing. Phishing tries to trick people into clicking harmful links or sharing information.",
  },
  {
    q: "Is it okay to share your password with your best friend?",
    options: [
      "Yes, if they are your best friend",
      "Yes, if they promise not to tell",
      "No, passwords should stay private",
      "Only during school holidays",
    ],
    correct: 2,
    why: "A password protects your account. Sharing it removes your protection.",
  },
  {
    q: "You see a mean comment online. What is the best action?",
    options: [
      "Join in",
      "Screenshot it and tell a trusted adult",
      "Send a worse comment back",
      "Delete your whole device",
    ],
    correct: 1,
    why: "You should not escalate. Save evidence and ask for help.",
  },
  {
    q: "Why should you lock your phone or tablet?",
    options: [
      "To make it look cool",
      "To stop other people from opening it",
      "To make games faster",
      "To use more battery",
    ],
    correct: 1,
    why: "A screen lock helps protect your games, photos, and messages.",
  },
  {
    q: "What makes you a Cyber Safety Hero?",
    options: [
      "Clicking every link fast",
      "Sharing passwords",
      "Stopping, thinking, and asking for help",
      "Talking to strangers online",
    ],
    correct: 2,
    why: "The best security habit is to pause before acting.",
  },
];

const PrimaryQuiz = () => (
  <QuizGame
    gameId="primary-quiz"
    station={4}
    title={{ en: "Cyber Safety Heroes", ja: "サイバーセーフティ・ヒーロー" }}
    prompt={{ en: "Primary School Quiz", ja: "小学生クイズ" }}
    questions={questions}
    tiers={[
      { min: 8, label: "Cyber Safety Hero" },
      { min: 5, label: "Cyber Apprentice" },
      { min: 0, label: "Needs More Training" },
    ]}
  />
);

export default PrimaryQuiz;
