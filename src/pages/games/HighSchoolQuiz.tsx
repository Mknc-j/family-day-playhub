import { QuizGame, QuizQuestion } from "@/components/QuizGame";

const questions: QuizQuestion[] = [
  {
    q: "What is phishing?",
    options: [
      "A message designed to trick people into sharing information or clicking something harmful",
      "A password manager",
      "A safe browser update",
      "A Wi-Fi speed test",
    ],
    correct: 0,
    why: "Phishing uses convincing messages that trick users into opening harmful links, downloading malware, or sharing sensitive information.",
  },
  {
    q: "Which password strategy is strongest?",
    options: [
      "Same strong password everywhere",
      "Different strong passwords for each important account",
      "Your name plus birth year",
      "A short password with one symbol",
    ],
    correct: 1,
    why: "Password reuse is dangerous because one breach can expose multiple accounts.",
  },
  {
    q: "What is the main purpose of a password manager?",
    options: [
      "To make passwords public",
      "To store and generate strong unique passwords",
      "To remove the need for account security",
      "To make games load faster",
    ],
    correct: 1,
    why: "Password managers help you use strong, unique passwords for every account.",
  },
  {
    q: "Which is the best first response to a suspicious login alert?",
    options: [
      "Ignore it",
      "Change your password using the official app or website",
      "Click the link in the alert immediately",
      "Reply with your password",
    ],
    correct: 1,
    why: "Do not trust links in suspicious messages. Go directly to the official service.",
  },
  {
    q: "What does MFA protect against?",
    options: [
      "Every cyberattack",
      "Some account takeover attempts even if the password is stolen",
      "Broken phone screens",
      "Slow Wi-Fi",
    ],
    correct: 1,
    why: "MFA is not perfect, but it makes account theft harder.",
  },
  {
    q: "Which is the best example of social engineering?",
    options: [
      "A hacker guesses your Wi-Fi speed",
      "Someone tricks you into giving information by pretending to be trusted",
      "A computer installs a normal update",
      "A phone battery runs out",
    ],
    correct: 1,
    why: "Social engineering attacks the human decision, not just the device.",
  },
  {
    q: "You are selling an old phone. What should you do first?",
    options: [
      "Hand it over unlocked",
      "Remove accounts, back up needed data, and factory reset it",
      "Delete one app",
      "Change the wallpaper",
    ],
    correct: 1,
    why: "Old devices can contain photos, messages, saved logins, and personal data.",
  },
  {
    q: "Why is location sharing risky?",
    options: [
      "It can reveal where you are, where you live, or when you are away",
      "It improves every app",
      "It makes passwords stronger",
      "It blocks phishing",
    ],
    correct: 0,
    why: "Location data can expose real-world routines and safety risks.",
  },
  {
    q: "What is malware?",
    options: [
      "Software designed to harm, spy, steal, or disrupt",
      "A normal phone case",
      "A safe school website",
      "A type of charger",
    ],
    correct: 0,
    why: "Malware can steal information, spy on activity, encrypt files, or damage systems.",
  },
  {
    q: "A website asks for camera, microphone, contacts, and location access, but it is only a calculator app. What is the best conclusion?",
    options: [
      "The permissions may be excessive",
      "All apps need all permissions",
      "The app is definitely safe",
      "Permissions do not matter",
    ],
    correct: 0,
    why: "App permissions should match what the app actually needs.",
  },
  {
    q: "What is the safest way to handle a QR code posted in a public place?",
    options: [
      "Scan and trust it",
      "Check where it leads before entering information",
      "Enter your password immediately",
      "Share it with everyone",
    ],
    correct: 1,
    why: "QR codes can send users to fake or malicious websites.",
  },
  {
    q: "What is the most mature security mindset?",
    options: [
      "I am too smart to be scammed.",
      "Security is only for IT people.",
      "I slow down, verify, and report suspicious activity.",
      "I click first and fix later.",
    ],
    correct: 2,
    why: "Good security behavior is not paranoia. It is disciplined verification.",
  },
];

const HighSchoolQuiz = () => (
  <QuizGame
    gameId="highschool-quiz"
    station={6}
    title={{ en: "Cyber Risk Analyst", ja: "サイバーリスクアナリスト" }}
    prompt={{ en: "High School Quiz", ja: "高校生クイズ" }}
    questions={questions}
    perPlay={10}
    tiers={[
      { min: 10, label: "Cyber Risk Analyst" },
      { min: 7, label: "Security Aware" },
      { min: 4, label: "Needs More Practice" },
      { min: 0, label: "High Risk Clicker" },
    ]}
  />
);

export default HighSchoolQuiz;
