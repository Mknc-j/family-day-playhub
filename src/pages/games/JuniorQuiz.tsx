import { QuizGame, QuizQuestion } from "@/components/QuizGame";

const questions: QuizQuestion[] = [
  {
    q: 'You receive a message: "Your account will be deleted today. Login here." What is the biggest warning sign?',
    options: ["It sounds urgent", "It has a login link", "It threatens a bad result", "All of the above"],
    correct: 3,
    why: "Phishing often uses urgency, fear, and fake links to push people into mistakes.",
  },
  {
    q: "Which is the best password habit?",
    options: [
      "Use the same password everywhere",
      "Use your pet's name",
      "Use unique passwords for important accounts",
      "Write your password in your public profile",
    ],
    correct: 2,
    why: "If one account is hacked, reused passwords can let attackers access other accounts.",
  },
  {
    q: "What is two-factor authentication, also called MFA?",
    options: [
      "A second step to prove it is really you",
      "A faster Wi-Fi setting",
      "A type of video game",
      "A way to delete passwords",
    ],
    correct: 0,
    why: "MFA adds another layer of protection beyond the password.",
  },
  {
    q: 'A friend sends you a link saying, "Look at this embarrassing photo of you." What should you do first?',
    options: [
      "Click immediately",
      "Ask the friend outside the app if they really sent it",
      "Forward it",
      "Enter your password to view it",
    ],
    correct: 1,
    why: "Your friend's account may have been hacked.",
  },
  {
    q: "What should you check before downloading a new app?",
    options: [
      "The app permissions",
      "The developer name",
      "Reviews and whether it is from an official app store",
      "All of the above",
    ],
    correct: 3,
    why: "Fake or unsafe apps may collect data or damage your device.",
  },
  {
    q: "Why are software updates important?",
    options: [
      "They only change icons",
      "They can fix security holes",
      "They always delete your data",
      "They make hackers stronger",
    ],
    correct: 1,
    why: "Updates often patch vulnerabilities. Enable updates on phones, tablets, laptops, apps, browsers, and operating systems.",
  },
  {
    q: "What is oversharing?",
    options: [
      "Posting too much private information online",
      "Sending homework to a teacher",
      "Playing games with friends",
      "Changing your profile picture",
    ],
    correct: 0,
    why: "Posts can reveal your location, school, routine, or identity.",
  },
  {
    q: "Which message is most suspicious?",
    options: [
      "Can you send me the homework?",
      "Your package is blocked. Pay here now.",
      "Do you want to play later?",
      "Class starts at 9.",
    ],
    correct: 1,
    why: "Fake delivery messages are common scam patterns: urgency, payment, and a link.",
  },
  {
    q: "What should you do when using public Wi-Fi?",
    options: [
      "Log into every important account",
      "Avoid sensitive activity unless protected",
      "Share your password with nearby users",
      "Turn off your lock screen",
    ],
    correct: 1,
    why: "Public networks can be less trustworthy than home or school networks.",
  },
  {
    q: "You accidentally clicked a suspicious link. What should you do?",
    options: [
      "Hide it",
      "Keep clicking to see what happens",
      "Tell a trusted adult or teacher quickly",
      "Delete all your friends",
    ],
    correct: 2,
    why: "Fast reporting helps limit damage.",
  },
];

const JuniorQuiz = () => (
  <QuizGame
    gameId="junior-quiz"
    station={5}
    title={{ en: "Internet Defense Challenge", ja: "インターネット防衛チャレンジ" }}
    prompt={{ en: "Junior High School Quiz", ja: "中学生クイズ" }}
    questions={questions}
    tiers={[
      { min: 8, label: "Internet Defender" },
      { min: 5, label: "Security Trainee" },
      { min: 0, label: "Needs Defense Training" },
    ]}
  />
);

export default JuniorQuiz;
