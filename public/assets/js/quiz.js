const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const activeChatKey = 'phish_ai_active_chat';
const DEPLOY_FRONTEND_ORIGINS = new Set([
    'https://phishnetai.netlify.app',
    'https://pishnetai.vercel.app'
]);
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';
const coreQuizIds = [
    'url-basics',
    'message-red-flags',
    'after-clicking',
    'login-page-clues',
    'qr-link-safety',
    'social-media-scams'
];
const skillBuilderQuizIds = [
    'sender-source-checks',
    'attachment-download-safety',
    'account-recovery-traps',
    'form-data-requests',
    'payment-delivery-scams',
    'support-impersonation'
];
const challengerQuizIds = [
    'scholarship-bait',
    'document-sharing-traps',
    'mobile-alert-deception',
    'event-registration-risks',
    'marketplace-meetup-scams',
    'multi-step-phish-cases'
];
const advancedSeriesQuizIds = [
    'campus-portal-spoofs',
    'urgent-admin-fraud',
    'cloud-drive-compromise',
    'internship-hiring-scams',
    'verification-chain-attacks',
    'phishing-scenarios'
];
const masterySeriesQuizIds = [
    'executive-impersonation',
    'breach-followup-scams',
    'recovery-flow-attacks',
    'financial-approval-fraud',
    'cross-channel-takeovers',
    'best-practices'
];
const masteryPrepQuizIds = masterySeriesQuizIds.filter((quizId) => quizId !== 'best-practices');
const advancedQuizRules = {
    'sender-source-checks': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'attachment-download-safety': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'account-recovery-traps': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'form-data-requests': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'payment-delivery-scams': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'support-impersonation': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'scholarship-bait': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'document-sharing-traps': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'mobile-alert-deception': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'event-registration-risks': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'marketplace-meetup-scams': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'multi-step-phish-cases': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'campus-portal-spoofs': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'urgent-admin-fraud': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'cloud-drive-compromise': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'internship-hiring-scams': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'verification-chain-attacks': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'phishing-scenarios': {
        requiresQuizIds: [...coreQuizIds, ...skillBuilderQuizIds, ...challengerQuizIds],
        label: 'Unlocks after you complete the Core, Skill Builder, and Challenger series.'
    },
    'best-practices': {
        requiresQuizIds: [...masteryPrepQuizIds],
        minimumAttempts: 4,
        minimumAverageScore: 70,
        label: 'Unlocks after the earlier Mastery sets plus 4 saved attempts and a 70% average.'
    },
    'executive-impersonation': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'breach-followup-scams': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'recovery-flow-attacks': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'financial-approval-fraud': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'cross-channel-takeovers': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    }
};

const quizzes = {
    'url-basics': {
        title: 'URL Basics',
        description: 'Practice checking links and recognizing URL patterns that are often used in phishing attempts.',
        questions: [
            {
                topic: 'Link inspection',
                prompt: 'You receive a message asking you to verify your school account through `lcc-campus-login-support.com`. What is the best first reaction?',
                options: [
                    'Open it immediately because it mentions the school name.',
                    'Check the full domain first before trusting the link.',
                    'Reply with your password instead of clicking.',
                    'Ignore the spelling because support pages use many subdomains.'
                ],
                answer: 1,
                explanation: 'A suspicious domain name is a common phishing sign. Always inspect the exact website name before trusting the page.'
            },
            {
                topic: 'Shortened URLs',
                prompt: 'A classmate sends a shortened URL and says it leads to a scholarship form. What is the safest move?',
                options: [
                    'Open it right away if the message sounds urgent.',
                    'Ask where it leads or preview the destination first.',
                    'Share it with more classmates before checking.',
                    'Trust it because shortened links are normal.'
                ],
                answer: 1,
                explanation: 'Shortened links hide the real destination. It is safer to preview or verify them before opening.'
            },
            {
                topic: 'Secure domains',
                prompt: 'A page uses HTTPS but the website name looks slightly misspelled. What should you do?',
                options: [
                    'Trust it because HTTPS always means safe.',
                    'Continue only if the logo looks official.',
                    'Treat it with caution because HTTPS alone is not enough.',
                    'Enter your account details to test if it is real.'
                ],
                answer: 2,
                explanation: 'HTTPS only means the connection is encrypted. A fake website can still use HTTPS and steal information.'
            },
            {
                topic: 'URL structure',
                prompt: 'Which link is more suspicious for a login page?',
                options: [
                    'https://accounts.lcc.edu/login',
                    'https://lcc.edu.verify-user-access.net/login',
                    'https://portal.lcc.edu/student',
                    'https://lcc.edu/helpdesk'
                ],
                answer: 1,
                explanation: 'The real domain is at the end. In that suspicious link, `verify-user-access.net` is the actual website, not `lcc.edu`.'
            },
            {
                topic: 'Lookalike domains',
                prompt: 'You are about to open `https://lcc-portal.co/login` after searching for your school portal. What should you do first?',
                options: [
                    'Open it because the address still includes `lcc` and `portal`.',
                    'Compare it with the real school domain before using it.',
                    'Trust it if the page loads with a lock icon.',
                    'Sign in once and leave if the design looks unusual.'
                ],
                answer: 1,
                explanation: 'Lookalike domains often use believable words. It is safer to compare the full address with the official domain first.'
            }
        ]
    },
    'message-red-flags': {
        title: 'Message Red Flags',
        description: 'Learn how to notice warning signs in emails, texts, and chat messages before they put your account or information at risk.',
        questions: [
            {
                topic: 'Urgency',
                prompt: 'You receive a message saying your student portal will be locked in 10 minutes unless you confirm your account through a link. Which detail is the strongest warning sign?',
                options: [
                    'The message sounds formal and mentions your account.',
                    'The urgent deadline is pushing you to act fast.',
                    'The sender included a support contact below.',
                    'The message uses short sentences throughout.'
                ],
                answer: 1,
                explanation: 'Phishing messages often create panic so people react without checking the details first.'
            },
            {
                topic: 'Sender check',
                prompt: 'An email claims to be from the registrar and includes your full name, but the sender address ends in a free email domain. What is the safest response?',
                options: [
                    'Trust it because it includes personal details about you.',
                    'Reply to the same email and ask if it is legitimate.',
                    'Verify it through an official school contact or portal.',
                    'Open the attachment first, then decide if it feels real.'
                ],
                answer: 2,
                explanation: 'If the sender address does not match the official source, verify through a trusted contact before responding.'
            },
            {
                topic: 'Requests for secrets',
                prompt: 'Which message should raise the strongest phishing concern?',
                options: [
                    'A department post reminding students about office hours.',
                    'A campus office asking for your password by email.',
                    'A class representative posting a room change tomorrow.',
                    'A teacher sharing a deadline update in the class chat.'
                ],
                answer: 1,
                explanation: 'Legitimate organizations should not ask for passwords through email or chat.'
            },
            {
                topic: 'Attachments',
                prompt: 'You get an unexpected attachment labeled "account-update-form" from someone claiming to be campus support. What is the safest next step?',
                options: [
                    'Open it in preview mode first to inspect it safely.',
                    'Verify the request through an official school channel.',
                    'Download it, but wait before opening the file.',
                    'Reply and ask why the file is needed first.'
                ],
                answer: 1,
                explanation: 'Unexpected files can carry malware or phishing forms. Verify first before opening anything.'
            },
            {
                topic: 'Link pressure',
                prompt: 'A message says, "Use this link only today or your account request will be cancelled." Which response is safest?',
                options: [
                    'Open the link quickly so the request does not expire.',
                    'Ask someone else to open it for you first.',
                    'Verify the request from the official website or office.',
                    'Reply to the sender and wait for a second link.'
                ],
                answer: 2,
                explanation: 'Urgent link pressure is a common phishing tactic. A safer move is to verify through an official source you already trust.'
            }
        ]
    },
    'after-clicking': {
        title: 'After Clicking: What to Do?',
        description: 'Review the right steps to take after clicking a suspicious link or sharing personal details on an unsafe page.',
        questions: [
            {
                topic: 'Immediate action',
                prompt: 'You clicked a suspicious link but did not enter any information. What should you do first?',
                options: [
                    'Ignore it because nothing was submitted.',
                    'Close the page and monitor for unusual activity.',
                    'Share the link with others to confirm.',
                    'Log out of all your accounts immediately without checking anything else.'
                ],
                answer: 1,
                explanation: 'Closing the page and watching for anything unusual is a practical first response when no information was entered.'
            },
            {
                topic: 'Password response',
                prompt: 'You accidentally entered your password on a suspicious page. What is the best next step?',
                options: [
                    'Wait to see if anything happens.',
                    'Change your password right away on the real site.',
                    'Send another email to the attacker asking them to delete it.',
                    'Reuse the same password on another account to test it.'
                ],
                answer: 1,
                explanation: 'If a password may be exposed, change it immediately on the official website.'
            },
            {
                topic: 'Reporting',
                prompt: 'After receiving a phishing message that targets students, what is the most helpful thing to do?',
                options: [
                    'Delete it quietly and tell nobody.',
                    'Report it through the proper school or platform channel.',
                    'Reply angrily to the sender.',
                    'Post the full malicious link publicly without warning.'
                ],
                answer: 1,
                explanation: 'Reporting helps protect others and allows the incident to be reviewed through proper channels.'
            },
            {
                topic: 'Device safety',
                prompt: 'You downloaded a suspicious file from a fake page. What is the safest response?',
                options: [
                    'Keep using the device and hope nothing happens.',
                    'Run a security check and avoid opening the file again.',
                    'Rename the file so it becomes safe.',
                    'Move the file into another folder and ignore it.'
                ],
                answer: 1,
                explanation: 'A suspicious download should be treated carefully. Run a security check and avoid reopening the file.'
            },
            {
                topic: 'Account recovery',
                prompt: 'You are not sure whether you entered your student number on a fake page. What is the safest next step?',
                options: [
                    'Do nothing unless you notice a problem later.',
                    'Check your real account for unusual changes and secure it if needed.',
                    'Open the suspicious page again to confirm what you typed.',
                    'Post the link in a group chat and ask if others tried it.'
                ],
                answer: 1,
                explanation: 'When information may have been exposed, it is safer to check the real account directly and secure it if anything looks unusual.'
            }
        ]
    },
    'login-page-clues': {
        title: 'Login Page Clues',
        description: 'Practice checking login pages for warning signs before entering your school or personal account details.',
        questions: [
            {
                topic: 'Page checks',
                prompt: 'A login page looks polished and uses your school colors, but the address ends in `.secure-help.net`. What matters most?',
                options: [
                    'The familiar school colors on the page.',
                    'Whether the address matches the official domain.',
                    'Whether the button style looks updated.',
                    'Whether the page loads without errors.'
                ],
                answer: 1,
                explanation: 'Attackers can copy a school design. The full website address is a stronger trust check than the page style.'
            },
            {
                topic: 'Form requests',
                prompt: 'A page asks for your school email, password, and backup phone number before you can continue. What should you notice first?',
                options: [
                    'The page is asking for more information than expected.',
                    'The form uses neat spacing and aligned labels.',
                    'The password box hides the characters properly.',
                    'The page asks for details in one step only.'
                ],
                answer: 0,
                explanation: 'A login page that asks for extra personal details can be a sign that the form is collecting more than it should.'
            },
            {
                topic: 'Urgency on page',
                prompt: 'A login page says your account will be closed today unless you sign in again right now. What is the strongest warning sign?',
                options: [
                    'The page uses large bold text near the top.',
                    'The warning creates pressure to act immediately.',
                    'The form appears in the center of the page.',
                    'The message mentions your account status.'
                ],
                answer: 1,
                explanation: 'Pressure and urgency are common phishing tactics used to stop users from checking the page carefully.'
            },
            {
                topic: 'Support details',
                prompt: 'A login page tells you to contact `support@verify-portal-mail.net` if you have problems signing in. What should you do?',
                options: [
                    'Use the support address if the page looks official enough.',
                    'Check if the support contact belongs to the real organization.',
                    'Trust it if the email uses the word `support`.',
                    'Ignore the contact details and focus only on the logo.'
                ],
                answer: 1,
                explanation: 'Fake pages often include support contacts that look believable but do not belong to the official organization.'
            },
            {
                topic: 'Safer move',
                prompt: 'You are unsure if a login page is real. What is the safest next step?',
                options: [
                    'Try signing in once to see where the page redirects.',
                    'Open the real website or app you already trust instead.',
                    'Send the page to a friend and ask them to test it.',
                    'Refresh the page and see if the warning disappears.'
                ],
                answer: 1,
                explanation: 'When a login page feels off, it is safer to use the official website or app you already know instead of trusting the page.'
            }
        ]
    },
    'qr-link-safety': {
        title: 'QR & Link Safety',
        description: 'Learn how hidden destinations in QR codes and links can lead to risky pages even when they look harmless at first.',
        questions: [
            {
                topic: 'QR destination',
                prompt: 'You scan a QR code on a school bulletin board and it opens a shortened login link. What should you do first?',
                options: [
                    'Open it because the QR code came from campus.',
                    'Check where the link leads before trusting it.',
                    'Sign in quickly before the page expires.',
                    'Share it with classmates to confirm it works.'
                ],
                answer: 1,
                explanation: 'QR codes and shortened links can hide the real destination, so it is safer to check the target first.'
            },
            {
                topic: 'Shortened links',
                prompt: 'A message says a shortened link leads to an updated school form. Which reaction is safest?',
                options: [
                    'Trust it if the message came from a familiar group.',
                    'Preview or verify the destination before opening it.',
                    'Open it on mobile because the risk is lower there.',
                    'Save it for later and open it after class.'
                ],
                answer: 1,
                explanation: 'A shortened link hides the real site, so it is safer to preview or verify it before opening.'
            },
            {
                topic: 'Login after scan',
                prompt: 'A QR code leads to a sign-in page that asks for your school account. What matters most before you enter anything?',
                options: [
                    'Whether the page loads quickly after the scan.',
                    'Whether the page uses the official school domain.',
                    'Whether the QR code looked professionally printed.',
                    'Whether the form only asks for two fields.'
                ],
                answer: 1,
                explanation: 'The printed code or page speed does not prove trust. The official domain is the stronger check.'
            },
            {
                topic: 'Urgent QR notice',
                prompt: 'A QR code poster says "Scan now to keep your student access active today." What should you notice?',
                options: [
                    'The message is creating urgency to push quick action.',
                    'The poster uses a clean and modern layout.',
                    'The instruction is short and easy to follow.',
                    'The message mentions your student access.'
                ],
                answer: 0,
                explanation: 'Urgent wording is often used to pressure people into reacting before they verify where the QR code leads.'
            },
            {
                topic: 'Safer route',
                prompt: 'You are unsure whether a QR code or link is legitimate. What is the safest option?',
                options: [
                    'Go to the official site directly instead of using it.',
                    'Try it once and leave if anything looks unusual.',
                    'Ask another student to open it first.',
                    'Take a screenshot and scan it again later.'
                ],
                answer: 0,
                explanation: 'Using the official site or app directly is safer than relying on an unknown QR code or link.'
            }
        ]
    },
    'social-media-scams': {
        title: 'Social Media Scams',
        description: 'Practice spotting phishing and impersonation tactics that often appear in social media posts, chats, and direct messages.',
        questions: [
            {
                topic: 'Impersonation',
                prompt: 'A classmate account sends you a login link and says the school page is broken unless you use this one. What should you do?',
                options: [
                    'Use it if the account name looks familiar.',
                    'Verify with the classmate through another trusted contact.',
                    'Open it in a private tab to be safer.',
                    'Trust it because the message sounds personal.'
                ],
                answer: 1,
                explanation: 'A familiar account can still be impersonated or compromised. It is safer to verify through another channel you trust.'
            },
            {
                topic: 'Prize bait',
                prompt: 'A social media post says the first 50 students to sign in through a link will receive free load. Which sign is most suspicious?',
                options: [
                    'The post mentions a reward for quick action.',
                    'The post includes a bright image and headline.',
                    'The post uses short text with a direct link.',
                    'The post has many comments under it.'
                ],
                answer: 0,
                explanation: 'Prize bait and urgency are often used together to push users into opening risky links without checking them.'
            },
            {
                topic: 'Direct messages',
                prompt: 'A direct message says, "Is this you in the photo?" and includes a shortened link. What is the safest response?',
                options: [
                    'Open it because the message is short and common.',
                    'Check with the sender first before touching the link.',
                    'Open it only if the sender is on your friends list.',
                    'Save it and come back to it after a few hours.'
                ],
                answer: 1,
                explanation: 'Compromised accounts often send simple bait messages with hidden links. It is safer to verify with the sender first.'
            },
            {
                topic: 'Fake announcements',
                prompt: 'A page uses your school logo and posts an urgent login announcement in a student group. What should you verify first?',
                options: [
                    'Whether the wording matches the school tone.',
                    'Whether the linked domain is the real official one.',
                    'Whether the page has a large number of followers.',
                    'Whether the announcement looks professionally designed.'
                ],
                answer: 1,
                explanation: 'Fake pages can copy branding and attract followers. The linked domain is still the stronger trust check.'
            },
            {
                topic: 'Safer action',
                prompt: 'A suspicious social media message asks you to log in to confirm your account. What is the safest move?',
                options: [
                    'Go to the official website or app on your own.',
                    'Reply first and wait for another explanation.',
                    'Try the link only if it uses HTTPS.',
                    'Open the link on another device to compare it.'
                ],
                answer: 0,
                explanation: 'Going directly to the official platform yourself is safer than trusting a login link from a social media message.'
            }
        ]
    },
    'sender-source-checks': {
        title: 'Sender & Source Checks',
        description: 'Build stronger habits for checking who sent a message and whether the source really matches the organization it claims to be.',
        questions: [
            {
                topic: 'Display name mismatch',
                prompt: 'An email shows the name "LCC Finance Office," but the sender address is `alerts-finance@outlookmail.com`. What should matter most?',
                options: [
                    'The displayed sender name at the top.',
                    'The actual email address behind the message.',
                    'The formal tone used in the message.',
                    'The school-related subject line.'
                ],
                answer: 1,
                explanation: 'A display name can be copied easily. The actual sender address is a much stronger trust check.'
            },
            {
                topic: 'Message source',
                prompt: 'A text about a grade issue comes from an unknown number and includes a portal link. What is the safest first step?',
                options: [
                    'Open the link because the topic sounds important.',
                    'Check the portal directly using your usual route.',
                    'Reply and ask for more details in the same thread.',
                    'Save the number first before deciding.'
                ],
                answer: 1,
                explanation: 'When the source is unfamiliar, it is safer to use the official portal or contact route you already trust.'
            },
            {
                topic: 'Compromised contact',
                prompt: 'A familiar classmate account asks you to review a file through a login link. Which detail should raise concern first?',
                options: [
                    'The request feels unusual for that account.',
                    'The file name sounds short and generic.',
                    'The message was sent after class hours.',
                    'The sender used your nickname.'
                ],
                answer: 0,
                explanation: 'A familiar account can still be compromised. An unusual request is a strong reason to verify before trusting it.'
            },
            {
                topic: 'Copied branding',
                prompt: 'A message includes the school logo and footer, but the reply-to address points to another domain. What should you do?',
                options: [
                    'Trust the branding because the footer looks official.',
                    'Check whether the reply-to matches the real organization.',
                    'Focus only on whether the grammar looks polished.',
                    'Forward it to friends first to compare opinions.'
                ],
                answer: 1,
                explanation: 'Copied branding does not prove legitimacy. A mismatched reply-to address is a stronger warning sign.'
            },
            {
                topic: 'Cross-checking',
                prompt: 'You receive a password reset notice you did not request. What is the best response?',
                options: [
                    'Open the message and inspect the reset flow there.',
                    'Go to the official account page directly and check there.',
                    'Reply and ask why the reset was triggered.',
                    'Ignore it and keep using the same password.'
                ],
                answer: 1,
                explanation: 'If a reset notice was unexpected, it is safer to check your account from the official site directly instead of trusting the message.'
            }
        ]
    },
    'attachment-download-safety': {
        title: 'Attachment & Download Safety',
        description: 'Practice safer decisions when messages include unexpected files, downloads, or documents that ask you to open them quickly.',
        questions: [
            {
                topic: 'Unexpected file',
                prompt: 'An email claims to contain an updated tuition statement as a zip file you did not expect. What is the safest first reaction?',
                options: [
                    'Extract it first and inspect the contents after.',
                    'Verify the request through an official school contact.',
                    'Open it on a phone because that is safer.',
                    'Rename the file before opening it.'
                ],
                answer: 1,
                explanation: 'Unexpected downloads should be verified first, especially when the file type can hide malware.'
            },
            {
                topic: 'Shared document',
                prompt: 'A direct message says "View your schedule update" and includes a file download instead of a normal document link. What should you notice?',
                options: [
                    'The file arrived through an unusual channel.',
                    'The message uses a short sentence only.',
                    'The file name includes the word `schedule`.',
                    'The sender used a polite tone.'
                ],
                answer: 0,
                explanation: 'A download arriving through an unusual channel should be treated carefully, especially if you were not expecting it.'
            },
            {
                topic: 'Executable files',
                prompt: 'A message says you must install a file to keep your student account active. Which response is safest?',
                options: [
                    'Install it if the message includes your full name.',
                    'Avoid the file and verify the claim from the official portal.',
                    'Open it only after disabling Wi-Fi first.',
                    'Download it and wait until later to run it.'
                ],
                answer: 1,
                explanation: 'Legitimate account updates should not require random file installs from messages. Verify the claim through the official portal.'
            },
            {
                topic: 'Macros and forms',
                prompt: 'A document asks you to enable editing or content before you can read it. What should you do?',
                options: [
                    'Enable the feature so the document loads properly.',
                    'Treat the file as suspicious and avoid enabling it.',
                    'Move the file to another folder and open it again.',
                    'Print it first to see if it becomes safer.'
                ],
                answer: 1,
                explanation: 'Prompting users to enable extra document features is a common tactic used to trigger malicious content.'
            },
            {
                topic: 'Safer file handling',
                prompt: 'You are unsure whether a downloaded file is legitimate. What is the safest move?',
                options: [
                    'Send it to a friend and ask them to open it first.',
                    'Avoid opening it until the request is confirmed.',
                    'Open it offline so it cannot do harm.',
                    'Upload it back to the sender for checking.'
                ],
                answer: 1,
                explanation: 'If the file is suspicious, the safest move is to avoid opening it until the request itself has been verified.'
            }
        ]
    },
    'account-recovery-traps': {
        title: 'Account Recovery Traps',
        description: 'Learn how phishing messages abuse password resets, verification steps, and account recovery claims to steal account access.',
        questions: [
            {
                topic: 'Recovery pressure',
                prompt: 'A message says your recovery request must be approved through a link in the next 15 minutes. What is the biggest concern?',
                options: [
                    'The short deadline is pressuring you to act fast.',
                    'The message mentions account recovery directly.',
                    'The wording is brief and to the point.',
                    'The notice includes a case number.'
                ],
                answer: 0,
                explanation: 'Urgent recovery notices are often used to create panic before you have time to verify the request properly.'
            },
            {
                topic: 'Unexpected reset',
                prompt: 'You receive a recovery code by text even though you did not try to reset anything. What should you do?',
                options: [
                    'Share the code if the sender claims to be support.',
                    'Keep the code private and secure the real account if needed.',
                    'Enter the code into any page that mentions your account.',
                    'Reply with the code to stop the alerts.'
                ],
                answer: 1,
                explanation: 'Unexpected recovery codes should never be shared. They may mean someone is trying to access your account.'
            },
            {
                topic: 'Verification prompts',
                prompt: 'A page asks for your password and then your one-time code to "confirm recovery." What should you notice?',
                options: [
                    'The page is collecting multiple sensitive credentials.',
                    'The page uses a familiar account color theme.',
                    'The code field appears after the password field.',
                    'The page provides a help link below the form.'
                ],
                answer: 0,
                explanation: 'A fake recovery page often asks for both your password and verification code so attackers can take over the account immediately.'
            },
            {
                topic: 'Support impersonation',
                prompt: 'Someone claims they are helping with your recovery case and asks you to read back a verification code. What is the safest response?',
                options: [
                    'Read it back if they already know your email address.',
                    'Do not share the code and verify support independently.',
                    'Give only part of the code to stay safe.',
                    'Wait until they explain the full process in chat.'
                ],
                answer: 1,
                explanation: 'Verification codes should not be shared with people messaging you directly. Real support can be checked through official channels.'
            },
            {
                topic: 'Safer recovery route',
                prompt: 'Which recovery step is safest when you truly need to reset an account?',
                options: [
                    'Use the reset flow from the official site or app directly.',
                    'Follow the latest reset link sent to your messages.',
                    'Ask social media pages to handle it for you.',
                    'Use the first recovery page from search results.'
                ],
                answer: 0,
                explanation: 'The safest recovery route is the official website or app you already trust, not a link that arrived through a message.'
            }
        ]
    },
    'form-data-requests': {
        title: 'Form & Data Requests',
        description: 'Practice noticing when a page or message is asking for more information than a legitimate process usually needs.',
        questions: [
            {
                topic: 'Too much information',
                prompt: 'A scholarship form asks for your password, student ID, and recovery email on one page. What is the strongest warning sign?',
                options: [
                    'The form is asking for credentials it should not need.',
                    'The form uses several fields on one screen.',
                    'The form collects contact details together.',
                    'The form places the submit button at the bottom.'
                ],
                answer: 0,
                explanation: 'A legitimate form should not ask for account passwords as part of a normal information request.'
            },
            {
                topic: 'External forms',
                prompt: 'A message says you must complete a form immediately, but the page opens on a domain unrelated to the school. What should you do?',
                options: [
                    'Continue if the form mentions your department name.',
                    'Verify why the form is hosted on another domain first.',
                    'Trust it if the page still uses HTTPS.',
                    'Fill only the non-sensitive fields and submit.'
                ],
                answer: 1,
                explanation: 'An unrelated form domain is a reason to verify the request before sharing any information.'
            },
            {
                topic: 'Sensitive verification',
                prompt: 'A page asks for your mobile number, date of birth, and one-time code to keep your access active. What should you notice?',
                options: [
                    'The page is combining identity details with a security code.',
                    'The page clearly labels each field for the user.',
                    'The page uses a secure lock icon in the browser.',
                    'The code field appears last in the form.'
                ],
                answer: 0,
                explanation: 'Combining identity details with a one-time code is often a sign that the form is collecting enough data to misuse your account.'
            },
            {
                topic: 'Submission pressure',
                prompt: 'A form warns that your request will be cancelled if you leave any field blank. What should you do first?',
                options: [
                    'Complete every field so the request is not lost.',
                    'Check whether the form and request are really official.',
                    'Refresh the page and try again from the start.',
                    'Enter placeholder data in the extra fields.'
                ],
                answer: 1,
                explanation: 'Pressure to complete every field can be used to push people into sharing unnecessary or sensitive information.'
            },
            {
                topic: 'Safer habit',
                prompt: 'A form request seems important but slightly unusual. Which habit is safest?',
                options: [
                    'Pause and confirm the request before submitting anything.',
                    'Submit the form once and edit it later if needed.',
                    'Complete only the first half of the form for now.',
                    'Use the same answers you gave on another site.'
                ],
                answer: 0,
                explanation: 'Pausing to verify the request first is a safer habit than submitting information and hoping the form is legitimate.'
            }
        ]
    },
    'payment-delivery-scams': {
        title: 'Payment & Delivery Scams',
        description: 'Strengthen your judgment around phishing attempts that involve fees, deliveries, billing problems, and fake payment requests.',
        questions: [
            {
                topic: 'Small fee trick',
                prompt: 'A message says your parcel is waiting but you must pay a small fee through a link. What is the safest reaction?',
                options: [
                    'Pay it because the amount is small anyway.',
                    'Check the courier or seller through the official app first.',
                    'Open the page if the message includes a tracking number.',
                    'Use another card so the main account stays safe.'
                ],
                answer: 1,
                explanation: 'Small-fee delivery scams rely on urgency and low amounts. It is safer to verify the claim through the real courier or seller.'
            },
            {
                topic: 'Billing notice',
                prompt: 'An email says your subscription failed and asks you to update payment details through a message link. What should you do first?',
                options: [
                    'Open the link and check whether the amount looks right.',
                    'Go to the official service directly instead of the link.',
                    'Reply and ask whether cash payment is possible.',
                    'Trust it if the logo and colors seem correct.'
                ],
                answer: 1,
                explanation: 'Billing notices can be copied easily. Going to the official service directly is safer than trusting the message link.'
            },
            {
                topic: 'Fake order issue',
                prompt: 'A message says there is a problem with your order and asks you to confirm your card number to avoid cancellation. What should you notice?',
                options: [
                    'The message is asking for payment data unsafely.',
                    'The message includes an order issue explanation.',
                    'The request is written in short sentences.',
                    'The message was sent outside business hours.'
                ],
                answer: 0,
                explanation: 'Requests for card details through messages or suspicious pages are a major warning sign.'
            },
            {
                topic: 'Refund bait',
                prompt: 'A page promises a fast refund if you verify your login and bank details right away. What is the safest move?',
                options: [
                    'Avoid the page and contact the service from the official site.',
                    'Continue if the refund amount matches your purchase.',
                    'Use the page only if it loads with HTTPS.',
                    'Enter partial details first to test the process.'
                ],
                answer: 0,
                explanation: 'Refund bait is often used to collect both account and payment details. Use the official service instead of the page.'
            },
            {
                topic: 'Safer payment habit',
                prompt: 'Which habit lowers the risk of payment-related phishing the most?',
                options: [
                    'Checking issues from the official app or site.',
                    'Using message links when they look professional.',
                    'Responding quickly so orders are not delayed.',
                    'Saving all payment links in one note.'
                ],
                answer: 0,
                explanation: 'Using the official app or site directly is a much safer habit than following payment or delivery links from messages.'
            }
        ]
    },
    'support-impersonation': {
        title: 'Support Impersonation',
        description: 'Spot the tricks used by fake support staff, helpdesk pages, and urgent technical notices that try to steal trust and account access.',
        questions: [
            {
                topic: 'Helpdesk urgency',
                prompt: 'A helpdesk message says your account shows suspicious activity and you must verify it through a link today. What should you notice first?',
                options: [
                    'The message is using urgency to push fast action.',
                    'The message mentions suspicious activity directly.',
                    'The message includes a ticket number.',
                    'The message gives a support signature.'
                ],
                answer: 0,
                explanation: 'Urgent technical warnings are often used to stop users from verifying whether the support request is real.'
            },
            {
                topic: 'Fake agent chat',
                prompt: 'A chat popup says an agent can secure your account if you confirm your email and password right away. What is the safest response?',
                options: [
                    'Do not provide credentials and leave the chat.',
                    'Share the email first, then decide about the password.',
                    'Ask the agent to prove they work for support.',
                    'Continue only if the page uses a branded logo.'
                ],
                answer: 0,
                explanation: 'Real support should not ask for your password in a chat. Sharing credentials there is risky.'
            },
            {
                topic: 'Remote access bait',
                prompt: 'Someone claiming to be support asks you to install a remote tool so they can "clean up" your account issue. What should you do?',
                options: [
                    'Install it if they mention a specific problem.',
                    'Refuse the tool and verify support independently.',
                    'Install it only after changing your password.',
                    'Let them explain longer before deciding.'
                ],
                answer: 1,
                explanation: 'Unexpected remote support requests are risky. Verify support from a trusted official channel instead.'
            },
            {
                topic: 'Ticket portals',
                prompt: 'A support email links to a ticket page on a domain you have never seen before. What should you do first?',
                options: [
                    'Sign in once to check the ticket details.',
                    'Compare the domain with the official support site.',
                    'Reply and ask the sender if the page is safe.',
                    'Trust it if the email includes your correct name.'
                ],
                answer: 1,
                explanation: 'Fake support portals often use believable but unfamiliar domains. Compare the domain with the official support site first.'
            },
            {
                topic: 'Safer support check',
                prompt: 'Which support-related habit is safest when a message claims there is an urgent problem with your account?',
                options: [
                    'Use the official help center or contact route you know.',
                    'Open the message link first and inspect the page there.',
                    'Answer the support message before the case closes.',
                    'Rely on the support badge shown in the email or chat.'
                ],
                answer: 0,
                explanation: 'The safest habit is to contact support through the official route you already trust, not through the urgent message link.'
            }
        ]
    },
    'scholarship-bait': {
        title: 'Scholarship Bait',
        description: 'Work through higher-pressure scholarship and grant scams that mix urgency, prestige, and fake verification steps.',
        questions: [
            {
                topic: 'Prestige bait',
                prompt: 'A message says you were shortlisted for an exclusive grant and must sign in through a provided link before midnight. What matters most?',
                options: [
                    'The exclusive language used in the message.',
                    'Whether the link belongs to the real scholarship provider.',
                    'Whether the amount offered looks realistic.',
                    'Whether the email includes your full name.'
                ],
                answer: 1,
                explanation: 'Prestige and urgency can distract from the real issue. The actual domain still matters most.'
            },
            {
                topic: 'Verification trap',
                prompt: 'A scholarship form asks for your portal password to confirm your identity. What should you assume first?',
                options: [
                    'It is collecting a credential it should never need.',
                    'It is using a stronger verification method.',
                    'It is connected to your school account system.',
                    'It is trying to speed up the review process.'
                ],
                answer: 0,
                explanation: 'A legitimate scholarship form should not require your account password as part of normal verification.'
            },
            {
                topic: 'Forwarded opportunity',
                prompt: 'A class group forwards a scholarship link that many students are praising. What is still the safest step?',
                options: [
                    'Trust it because several students already shared it.',
                    'Verify the opportunity from the real source yourself.',
                    'Open it but avoid entering personal details first.',
                    'Use it only on a different device.'
                ],
                answer: 1,
                explanation: 'A widely shared link can still be fake. Independent verification is still safer than relying on group momentum.'
            },
            {
                topic: 'Fast deadline',
                prompt: 'A page warns that your scholarship slot will disappear if you leave the form unfinished. What should you notice?',
                options: [
                    'The form includes an account deadline at the top.',
                    'The page is pressuring you to submit without checking.',
                    'The page uses short instructions to guide you.',
                    'The message appears before the form fields.'
                ],
                answer: 1,
                explanation: 'Pressure and scarcity are common phishing tactics because they push people to skip verification.'
            },
            {
                topic: 'Safer route',
                prompt: 'Which response is safest when a scholarship message feels both exciting and slightly suspicious?',
                options: [
                    'Verify it from the official organization or campus office.',
                    'Open it once and decide based on the page design.',
                    'Submit only the non-sensitive details first.',
                    'Reply and ask the sender to reassure you.'
                ],
                answer: 0,
                explanation: 'When a high-reward message feels off, a trusted official source is the safest place to verify it.'
            }
        ]
    },
    'document-sharing-traps': {
        title: 'Document Sharing Traps',
        description: 'Spot the riskier sharing tricks that use shared files, document comments, and access requests to lure users into fake sign-ins.',
        questions: [
            {
                topic: 'Shared access request',
                prompt: 'A shared document notice says you need to sign in again to view comments from a teacher. What should you verify first?',
                options: [
                    'Whether the comment count seems believable.',
                    'Whether the sign-in page uses the real service domain.',
                    'Whether the notice came during class hours.',
                    'Whether the document title matches your course.'
                ],
                answer: 1,
                explanation: 'Shared document phishing often copies real notifications. The domain is the stronger check.'
            },
            {
                topic: 'Comment bait',
                prompt: 'A document notification says you were mentioned in feedback and includes a login prompt. What is the safest move?',
                options: [
                    'Open the login prompt if the file name looks familiar.',
                    'Go to the document service directly and check there.',
                    'Reply to the sender and ask if they tagged you.',
                    'Open it on mobile because it is a document, not a site.'
                ],
                answer: 1,
                explanation: 'Accessing the service directly is safer than trusting a login prompt from the notification.'
            },
            {
                topic: 'Fake collaboration',
                prompt: 'A class project file invites you to enable editing after a second sign-in. What should you notice?',
                options: [
                    'The file is part of a collaboration workflow.',
                    'The extra sign-in may be a fake credential prompt.',
                    'The project title uses your course code.',
                    'The page offers multiple access options.'
                ],
                answer: 1,
                explanation: 'A second sign-in prompt can be a fake layer added to steal credentials.'
            },
            {
                topic: 'Unusual host',
                prompt: 'A shared file link opens on a domain that resembles a document service but adds extra words. What is the safest response?',
                options: [
                    'Trust it if the layout looks identical to the real service.',
                    'Treat it as suspicious and compare the full domain.',
                    'Use it only if the file preview loads quickly.',
                    'Sign in once and leave if the content is missing.'
                ],
                answer: 1,
                explanation: 'Lookalike document domains are a common phishing method. Compare the full address before trusting it.'
            },
            {
                topic: 'Safer collaboration habit',
                prompt: 'Which habit best reduces shared-document phishing risk?',
                options: [
                    'Opening shared files from the official app or saved workspace.',
                    'Trusting links that arrive from classmates you know.',
                    'Using incognito mode before opening shared links.',
                    'Previewing the page and signing in only if needed.'
                ],
                answer: 0,
                explanation: 'Opening files from the official app or service you already trust reduces reliance on message links.'
            }
        ]
    },
    'mobile-alert-deception': {
        title: 'Mobile Alert Deception',
        description: 'Handle mobile-style phishing cases that use push alerts, SMS warnings, and account notices designed for fast phone reactions.',
        questions: [
            {
                topic: 'Push urgency',
                prompt: 'A phone alert says your account was locked and you must tap to restore access immediately. What is the safest response?',
                options: [
                    'Tap it quickly before the lock becomes permanent.',
                    'Open the real app or site yourself instead.',
                    'Tap it once and stop if the design looks unusual.',
                    'Wait for the same alert to appear again.'
                ],
                answer: 1,
                explanation: 'Urgent push alerts are designed for fast reactions. Opening the real app yourself is safer.'
            },
            {
                topic: 'SMS warning',
                prompt: 'A text says your SIM or banking access will be suspended today unless you verify through a shortened link. What should you notice?',
                options: [
                    'The warning uses suspension pressure and a hidden destination.',
                    'The message uses a realistic customer service tone.',
                    'The message mentions a same-day deadline clearly.',
                    'The link is short enough to fit on mobile.'
                ],
                answer: 0,
                explanation: 'Urgency plus a shortened link is a strong mobile phishing combination.'
            },
            {
                topic: 'App store bait',
                prompt: 'A mobile page says you need a security update and offers a direct download button. What is the safest move?',
                options: [
                    'Use the page if it matches your phone theme.',
                    'Get updates only from the official app store or source.',
                    'Download it now and install it after checking later.',
                    'Take a screenshot and come back when you have Wi-Fi.'
                ],
                answer: 1,
                explanation: 'Security updates should come from the official app store or trusted source, not a random page.'
            },
            {
                topic: 'Overlay login',
                prompt: 'A mobile page overlays a login prompt on top of a familiar service screen. What should you suspect?',
                options: [
                    'The overlay may be a fake prompt placed over copied content.',
                    'The service is using a faster mobile sign-in flow.',
                    'The page is loading an account check in two steps.',
                    'The service is simplifying the mobile interface.'
                ],
                answer: 0,
                explanation: 'Copied mobile screens with fake overlays are used to trick people into entering credentials quickly.'
            },
            {
                topic: 'Safer mobile habit',
                prompt: 'Which habit is best when a security alert appears on your phone?',
                options: [
                    'Verify the alert from the official app or settings directly.',
                    'Open the alert once to confirm whether it feels real.',
                    'Reply to the text and ask what triggered the alert.',
                    'Forward the alert to a friend before acting.'
                ],
                answer: 0,
                explanation: 'Verifying through the official app or settings is safer than trusting the alert itself.'
            }
        ]
    },
    'event-registration-risks': {
        title: 'Event Registration Risks',
        description: 'Practice spotting riskier event and registration scams that use limited slots, fake organizers, and payment or sign-in pressure.',
        questions: [
            {
                topic: 'Limited slots',
                prompt: 'An event page says only the first 20 students who sign in through a link can reserve a seat. What should stand out?',
                options: [
                    'The event is using scarcity to rush decisions.',
                    'The event clearly explains how seating works.',
                    'The page includes a matching event title.',
                    'The page offers a quick reservation process.'
                ],
                answer: 0,
                explanation: 'Scarcity is often used to pressure students into acting before verifying the event or the page.'
            },
            {
                topic: 'Fake organizer',
                prompt: 'A registration page uses campus branding but is hosted on a domain unrelated to the school. What should you do?',
                options: [
                    'Register if the branding looks current enough.',
                    'Verify the event from an official school source first.',
                    'Use the page only if no payment is required.',
                    'Fill in only your name and see what happens next.'
                ],
                answer: 1,
                explanation: 'A mismatched event domain should be verified through the official organizer before sharing information.'
            },
            {
                topic: 'Fee request',
                prompt: 'A student workshop page suddenly asks for a processing fee through a direct payment link. What is the safest move?',
                options: [
                    'Pay it if the fee seems small and reasonable.',
                    'Confirm the fee from the official organizer directly.',
                    'Use another account so the payment is isolated.',
                    'Complete the registration first, then decide.'
                ],
                answer: 1,
                explanation: 'Unexpected fee requests should be confirmed directly with the real organizer before any payment is made.'
            },
            {
                topic: 'Sign-in requirement',
                prompt: 'A simple RSVP form unexpectedly sends you to a login page asking for your school account. What should you notice?',
                options: [
                    'The registration process changed into a credential prompt.',
                    'The event uses account-based registration only.',
                    'The organizer wants to reduce duplicate signups.',
                    'The form may need stronger identity checks.'
                ],
                answer: 0,
                explanation: 'When a simple registration flow suddenly asks for account credentials, it can be a phishing sign.'
            },
            {
                topic: 'Safer registration habit',
                prompt: 'Which habit best lowers the risk of event registration phishing?',
                options: [
                    'Confirming the event through official campus pages or offices.',
                    'Joining quickly if several classmates already did.',
                    'Using the link only during school hours.',
                    'Saving the registration link for later use.'
                ],
                answer: 0,
                explanation: 'Official campus pages or offices are safer verification points than forwarded event links.'
            }
        ]
    },
    'marketplace-meetup-scams': {
        title: 'Marketplace & Meetup Scams',
        description: 'Handle phishing-style scam cases that mix payment pressure, fake buyer support, and identity checks in peer-to-peer deals.',
        questions: [
            {
                topic: 'Buyer confirmation',
                prompt: 'A buyer sends a page that says you must log in to confirm payment before shipping an item. What is the safest response?',
                options: [
                    'Use it if the buyer already sent screenshots.',
                    'Check the real marketplace or payment app directly.',
                    'Open it only if the buyer sounds genuine.',
                    'Continue if the payment amount matches your listing.'
                ],
                answer: 1,
                explanation: 'Screenshots and payment claims can be faked. It is safer to check the real platform or payment app directly.'
            },
            {
                topic: 'Fake support payment',
                prompt: 'A message says marketplace support requires you to verify your card before a sale can be released. What should you notice?',
                options: [
                    'The message is trying to collect payment data through a pressure tactic.',
                    'The message includes a support explanation for the sale.',
                    'The card check is linked to buyer protection.',
                    'The process is part of the release workflow.'
                ],
                answer: 0,
                explanation: 'Fake support messages often invent payment checks to steal card details from sellers.'
            },
            {
                topic: 'External checkout',
                prompt: 'A seller or buyer asks you to move to another page because the in-app process is "down." What is safest?',
                options: [
                    'Use the external page if the deal seems urgent.',
                    'Stay inside the real platform or stop the transaction.',
                    'Move to the page but avoid chatting there.',
                    'Ask them to lower the price first.'
                ],
                answer: 1,
                explanation: 'Moving outside the real platform removes safer checks and is a common setup for scams.'
            },
            {
                topic: 'Identity request',
                prompt: 'A meetup deal asks you to upload an ID and account login before confirming a pickup slot. What should you do?',
                options: [
                    'Proceed if the buyer also shares an ID photo.',
                    'Treat it as suspicious and avoid the request.',
                    'Upload only the front part of the ID first.',
                    'Blur some details and wait for a reply.'
                ],
                answer: 1,
                explanation: 'Combining identity documents with account access requests is a strong sign that the process is unsafe.'
            },
            {
                topic: 'Safer selling habit',
                prompt: 'Which habit best reduces marketplace phishing risk?',
                options: [
                    'Keeping payments and messages inside the official platform.',
                    'Moving to private chat once the deal feels serious.',
                    'Using any payment page that loads with HTTPS.',
                    'Accepting urgency if the buyer has good timing.'
                ],
                answer: 0,
                explanation: 'The official platform usually provides safer payment and messaging flows than external pages or private links.'
            }
        ]
    },
    'multi-step-phish-cases': {
        title: 'Multi-Step Phish Cases',
        description: 'Work through chained phishing cases where several believable steps appear before the real credential theft attempt happens.',
        questions: [
            {
                topic: 'Layered setup',
                prompt: 'A message first asks you to confirm a notice, then sends a follow-up login form, then requests a one-time code. What does that pattern suggest?',
                options: [
                    'The process is using multiple steps to look legitimate.',
                    'The sender is fixing an account issue carefully.',
                    'The system is verifying your identity thoroughly.',
                    'The service has a slower support workflow.'
                ],
                answer: 0,
                explanation: 'Multi-step phishing flows are designed to feel legitimate by gradually asking for more sensitive information.'
            },
            {
                topic: 'Escalation pressure',
                prompt: 'Each message in a thread becomes more urgent and asks for more account data than the last one. What is the safest interpretation?',
                options: [
                    'The issue is becoming more serious in real time.',
                    'The sender is escalating pressure to force compliance.',
                    'The system needs more data because the first step failed.',
                    'The account recovery process is almost complete.'
                ],
                answer: 1,
                explanation: 'Escalating urgency and data requests are often signs that the sender is trying to force a rushed mistake.'
            },
            {
                topic: 'Mixed channels',
                prompt: 'An email starts the process, then a text continues it, then a page asks for login details. What should you do first?',
                options: [
                    'Continue because the flow is consistent across channels.',
                    'Pause and verify the whole issue from an official source.',
                    'Use only the latest step because it is most updated.',
                    'Reply to the text and ask for clarification.'
                ],
                answer: 1,
                explanation: 'Using multiple channels can make a fake process feel real. A trusted official source is the safer place to verify it.'
            },
            {
                topic: 'Credential stacking',
                prompt: 'A case asks for your password, then recovery email, then one-time code across separate steps. What should you notice?',
                options: [
                    'The process is collecting layered credentials for takeover.',
                    'The process is repairing a complex account problem.',
                    'The service is confirming account ownership carefully.',
                    'The final code step makes the flow more trustworthy.'
                ],
                answer: 0,
                explanation: 'Attackers often stack credential requests across steps to avoid looking suspicious all at once.'
            },
            {
                topic: 'Best response',
                prompt: 'Which response is safest when a phishing attempt uses several believable steps across time?',
                options: [
                    'Stop responding and verify everything from the official source.',
                    'Finish the process once so you know what it wants.',
                    'Skip the first step and answer only the final one.',
                    'Continue if each step individually looks reasonable.'
                ],
                answer: 0,
                explanation: 'A multi-step flow can be dangerous even if each step seems mild on its own. The safest move is to stop and verify externally.'
            }
        ]
    },
    'campus-portal-spoofs': {
        title: 'Campus Portal Spoofs',
        description: 'Analyze more deceptive portal copies that mix familiar campus details with cloned login and update prompts.',
        questions: [
            {
                topic: 'Cloned portal',
                prompt: 'A page mirrors your school portal closely, but the domain adds `student-access-center` before a different ending. What matters most?',
                options: [
                    'How closely the page matches the real portal design.',
                    'Whether the full domain still belongs to the school.',
                    'Whether the portal shows the right campus color scheme.',
                    'How complete the page navigation looks.'
                ],
                answer: 1,
                explanation: 'A cloned design can look very convincing. The full domain is still the stronger trust check.'
            },
            {
                topic: 'Portal update notice',
                prompt: 'A portal login says you must re-verify today because of a system update, then asks for password and recovery email. What should you notice?',
                options: [
                    'The page is collecting more than a normal login should need.',
                    'The portal is trying to complete account migration steps.',
                    'The school is likely improving identity verification.',
                    'The update flow is more detailed than before.'
                ],
                answer: 0,
                explanation: 'A portal login that requests extra account recovery data is a strong sign the page is unsafe.'
            },
            {
                topic: 'Search result risk',
                prompt: 'You searched for the student portal and the top result leads to a page that asks for a fresh sign-in. What is safest?',
                options: [
                    'Use it if it appears first in search results.',
                    'Compare it with the official bookmarked portal first.',
                    'Try it once and stop if the dashboard looks different.',
                    'Trust it if the title includes the school name.'
                ],
                answer: 1,
                explanation: 'Search results can still lead to spoofed pages. A saved or known official portal is safer.'
            },
            {
                topic: 'Portal support link',
                prompt: 'A portal clone includes a help link that opens another unfamiliar domain for account verification. What does that suggest?',
                options: [
                    'The portal is using separate services correctly.',
                    'The spoof is extending the trap across more than one page.',
                    'The school now uses outsourced login support tools.',
                    'The support page is likely more secure than the portal.'
                ],
                answer: 1,
                explanation: 'Some phishing flows use more than one convincing-looking page to build false trust.'
            },
            {
                topic: 'Best response',
                prompt: 'Which response is safest when a school portal page feels almost right, but not fully trustworthy?',
                options: [
                    'Use the official portal you already know instead.',
                    'Retry the same page from another browser tab.',
                    'Ask a classmate whether the page worked for them.',
                    'Submit only your email to test the first step.'
                ],
                answer: 0,
                explanation: 'A familiar portal is still not trustworthy if key details feel off. The official route is safer.'
            }
        ]
    },
    'urgent-admin-fraud': {
        title: 'Urgent Admin Fraud',
        description: 'Handle deceptive admin-style messages that imitate registrar, finance, or IT notices with stronger authority pressure.',
        questions: [
            {
                topic: 'Authority pressure',
                prompt: 'A message claims to be from the registrar and says non-compliance today may affect enrollment records. What should stand out?',
                options: [
                    'The message uses authority and consequences to force speed.',
                    'The registrar office is clearly named in the message.',
                    'The notice explains the policy in formal language.',
                    'The message uses a serious administrative tone.'
                ],
                answer: 0,
                explanation: 'Authority plus consequences is a common phishing pattern because it pushes people to react before checking.'
            },
            {
                topic: 'Finance notice',
                prompt: 'A finance warning asks you to verify your account through a message link or risk late penalties. What is safest?',
                options: [
                    'Use the link quickly so the penalties do not apply.',
                    'Check the real finance portal or office directly.',
                    'Reply and ask for more billing details first.',
                    'Use the link if the amount shown looks familiar.'
                ],
                answer: 1,
                explanation: 'Penalty pressure is often used in finance-themed phishing. Verify the issue from the real portal or office.'
            },
            {
                topic: 'IT enforcement',
                prompt: 'An IT notice says device access will be revoked unless you sign in through a provided reset page. What should you notice?',
                options: [
                    'The message is turning a login prompt into an emergency task.',
                    'The IT team is protecting access across campus devices.',
                    'The reset page is part of routine security maintenance.',
                    'The notice is written clearly for students to follow.'
                ],
                answer: 0,
                explanation: 'Emergency-style login prompts are a common way to pressure users into trusting fake reset pages.'
            },
            {
                topic: 'Multiple admin names',
                prompt: 'A notice switches between registrar, records, and finance in the same message. What should that suggest?',
                options: [
                    'Several offices are working together on one issue.',
                    'The message may be copying authority cues without accuracy.',
                    'The process is more official because more offices are named.',
                    'The sender is giving extra detail to be helpful.'
                ],
                answer: 1,
                explanation: 'Fake administrative messages often stack official-sounding names without a coherent process behind them.'
            },
            {
                topic: 'Safer admin check',
                prompt: 'Which habit is best when a message claims immediate action is required by an admin office?',
                options: [
                    'Verify it using the official office page or contact route.',
                    'Follow the message first and verify afterward.',
                    'Ask classmates whether they got the same notice.',
                    'Wait to see if another warning arrives tomorrow.'
                ],
                answer: 0,
                explanation: 'The safest response is to verify the issue through the official office contact you already trust.'
            }
        ]
    },
    'cloud-drive-compromise': {
        title: 'Cloud Drive Compromise',
        description: 'Work through advanced file-sharing cases where fake storage notices, access errors, and permission prompts hide credential theft.',
        questions: [
            {
                topic: 'Drive error bait',
                prompt: 'A storage page says the file cannot load until you sign in again because your session token expired. What should you verify first?',
                options: [
                    'Whether the storage domain is the real official service.',
                    'Whether the file title matches your subject.',
                    'Whether the error message looks technically detailed.',
                    'Whether the file owner name is familiar.'
                ],
                answer: 0,
                explanation: 'A fake cloud-drive page often uses realistic errors. The domain still matters most.'
            },
            {
                topic: 'Permission request',
                prompt: 'A shared folder prompt asks for your password to confirm permission changes. What should you conclude first?',
                options: [
                    'The page is requesting a credential it should not need there.',
                    'The folder owner added a stricter access policy.',
                    'The service now uses direct account confirmation.',
                    'The folder may have been secured after recent issues.'
                ],
                answer: 0,
                explanation: 'A permission check should not require your password inside a suspicious or unfamiliar prompt.'
            },
            {
                topic: 'Multiple redirects',
                prompt: 'A file link first opens a fake preview, then redirects to a login page, then to a code prompt. What does that pattern suggest?',
                options: [
                    'A complicated but legitimate storage workflow.',
                    'A staged phishing flow designed to feel believable.',
                    'A broken document link that needs repeated login.',
                    'A secure process using layered access checks.'
                ],
                answer: 1,
                explanation: 'Layered redirects and repeated sign-ins are often used to make a phishing flow feel more legitimate.'
            },
            {
                topic: 'Shared ownership',
                prompt: 'A file claims to be shared by a teacher, but the real owner address does not match their usual account. What is safest?',
                options: [
                    'Trust it if the file contents seem class-related.',
                    'Verify the share through the teacher or official class channel.',
                    'Open it only in preview mode and avoid editing.',
                    'Download it first and inspect it later.'
                ],
                answer: 1,
                explanation: 'If the owner identity does not match what you expect, verify it through a trusted class channel before interacting.'
            },
            {
                topic: 'Best habit',
                prompt: 'Which habit best reduces cloud-drive phishing risk?',
                options: [
                    'Opening important files from the official workspace or app.',
                    'Trusting shared links when the file title sounds familiar.',
                    'Using preview mode before entering login details.',
                    'Checking only the logo and account avatar.'
                ],
                answer: 0,
                explanation: 'Using the official app or saved workspace is safer than relying on shared links that may be spoofed.'
            }
        ]
    },
    'internship-hiring-scams': {
        title: 'Internship Hiring Scams',
        description: 'Practice tougher hiring-related phishing cases involving fake recruiters, application portals, and job verification traps.',
        questions: [
            {
                topic: 'Recruiter urgency',
                prompt: 'A recruiter message says your internship spot is reserved only if you finish an account check today. What should you notice?',
                options: [
                    'The recruiter is using urgency to control your next step.',
                    'The role is probably in high demand.',
                    'The message is trying to keep hiring efficient.',
                    'The employer has a strict onboarding policy.'
                ],
                answer: 0,
                explanation: 'Urgency is often used in fake hiring messages to stop applicants from verifying the process.'
            },
            {
                topic: 'Application portal',
                prompt: 'A hiring page asks you to log in with your school account before you can upload a resume. What is safest?',
                options: [
                    'Use it because schools often connect with recruiters.',
                    'Verify the employer and portal independently first.',
                    'Upload the resume first and skip the login later.',
                    'Use it if the recruiter already knows your course.'
                ],
                answer: 1,
                explanation: 'A job application should not be trusted just because it mentions school-linked access. Verify the employer and portal independently.'
            },
            {
                topic: 'Document + login',
                prompt: 'An internship form asks for both your resume and your portal password. What does that suggest?',
                options: [
                    'The employer is combining two different processes improperly.',
                    'The employer needs stronger identity checks for applicants.',
                    'The company is screening applicants more carefully.',
                    'The form is part of an integrated hiring system.'
                ],
                answer: 0,
                explanation: 'A legitimate hiring process should not require your portal password just to accept an application.'
            },
            {
                topic: 'Interview bait',
                prompt: 'A message says an interview slot is waiting, but you must verify by entering a one-time code through a linked page. What is safest?',
                options: [
                    'Complete it if the interview company sounds real.',
                    'Verify the company and invitation through official channels.',
                    'Enter only the code and skip the other fields.',
                    'Try it once to avoid losing the interview slot.'
                ],
                answer: 1,
                explanation: 'Interview pressure can be used to steal verification codes. Verify the invitation independently.'
            },
            {
                topic: 'Best hiring habit',
                prompt: 'Which habit best reduces internship phishing risk?',
                options: [
                    'Checking hiring messages against the company’s real site or contact.',
                    'Replying quickly before opportunities disappear.',
                    'Trusting messages that include job titles and logos.',
                    'Using any portal that loads with HTTPS.'
                ],
                answer: 0,
                explanation: 'A real employer’s official site or contact channel is safer than trusting a hiring link from a message.'
            }
        ]
    },
    'verification-chain-attacks': {
        title: 'Verification Chain Attacks',
        description: 'Work through the hardest verification flows where attackers chain links, forms, and codes together to reach full account takeover.',
        questions: [
            {
                topic: 'Code chaining',
                prompt: 'A login page accepts your password, then sends you to a separate page asking for a code, then another asking for backup email. What does that suggest?',
                options: [
                    'A sophisticated but legitimate security check.',
                    'A chained phishing flow designed to gather layered access.',
                    'A temporary issue with the normal login sequence.',
                    'A system migration requiring additional confirmation.'
                ],
                answer: 1,
                explanation: 'Chained pages that keep collecting more sensitive account details are a strong sign of account takeover intent.'
            },
            {
                topic: 'Cross-channel verification',
                prompt: 'An email starts the process, a text continues it, and a chat message reminds you to finish verification. What is the safest interpretation?',
                options: [
                    'The service is using every channel for reliability.',
                    'The attacker is reinforcing pressure across channels.',
                    'The process is urgent because the account is exposed.',
                    'The platform is making sure you see the warning.'
                ],
                answer: 1,
                explanation: 'Using several channels together can make the flow feel more legitimate while increasing pressure to comply.'
            },
            {
                topic: 'Credential escalation',
                prompt: 'A case begins with email confirmation, then asks for login, then asks for recovery info, then asks for payment details. What should you conclude?',
                options: [
                    'The process is expanding far beyond a normal verification task.',
                    'The service uses one flow to update all account data.',
                    'The account has several unrelated issues at once.',
                    'The platform is resolving multiple warnings in one session.'
                ],
                answer: 0,
                explanation: 'When a process keeps expanding into more unrelated sensitive data, it is likely a phishing chain rather than a real verification flow.'
            },
            {
                topic: 'Partial trust trap',
                prompt: 'The first two steps of a flow look normal, but the third step asks for information no real system should need. What is safest?',
                options: [
                    'Continue because the earlier steps already looked real.',
                    'Treat the whole flow as compromised and stop there.',
                    'Finish the third step only if the page still uses HTTPS.',
                    'Retry the flow from the first step to compare it again.'
                ],
                answer: 1,
                explanation: 'A phishing flow can build trust gradually. One clearly unsafe step is enough reason to stop the whole process.'
            },
            {
                topic: 'Best response',
                prompt: 'Which response is strongest when a phishing attempt uses several believable verification steps?',
                options: [
                    'Stop the process and secure the real account from official channels.',
                    'Complete it quickly so you can review the account afterward.',
                    'Ask the sender to shorten the process before you continue.',
                    'Save screenshots and proceed if nothing looks obviously fake.'
                ],
                answer: 0,
                explanation: 'The safest response is to stop the chain and secure or verify the real account from trusted official channels.'
            }
        ]
    },
    'phishing-scenarios': {
        title: 'Phishing Scenarios',
        description: 'Go through realistic situations that test how well you can identify and respond to possible phishing attempts.',
        questions: [
            {
                topic: 'Campus scenario',
                prompt: 'A student receives a "tuition balance" email with an urgent payment link, but the message also includes correct school branding and a student number. What is the safest response?',
                options: [
                    'Use the payment link since the details look accurate.',
                    'Verify the balance through the official portal first.',
                    'Reply to the email and ask if the warning is real.',
                    'Wait for another message before taking action.'
                ],
                answer: 1,
                explanation: 'Payment-related urgency is a common phishing tactic. Verify through the official portal before taking action.'
            },
            {
                topic: 'Social media',
                prompt: 'A login page shared in a student group chat uses your school logo and says your session expired. What should you verify first?',
                options: [
                    'Whether the page colors match the usual school design.',
                    'Whether the button layout looks professional enough.',
                    'Whether the website address is the official domain.',
                    'Whether other students said the page worked for them.'
                ],
                answer: 2,
                explanation: 'Visual design can be copied easily. The actual domain is a far better trust check.'
            },
            {
                topic: 'QR code scam',
                prompt: 'You scan a QR code posted on campus that opens a login form for a "network upgrade." The page looks polished and uses HTTPS. What is the safest move?',
                options: [
                    'Enter your credentials if the page looks secure.',
                    'Verify the destination through an official source first.',
                    'Trust it because it was posted on school grounds.',
                    'Check the logo first, then continue if it looks real.'
                ],
                answer: 1,
                explanation: 'QR codes can hide suspicious destinations the same way shortened links can.'
            },
            {
                topic: 'Impersonation',
                prompt: 'A chat message from a "school officer" says they are helping restore student access and asks for the one-time code sent to your phone. What is the safest response?',
                options: [
                    'Share the code if the issue they mention sounds real.',
                    'Do not share it and verify the request independently.',
                    'Ask them to prove who they are before sharing it.',
                    'Wait a few minutes and send it if they follow up.'
                ],
                answer: 1,
                explanation: 'One-time codes should never be shared casually. Attackers often use impersonation to steal them.'
            },
            {
                topic: 'Fake support page',
                prompt: 'A support page says your school mailbox is full and asks you to sign in again to keep messages from being deleted. Which step matters most?',
                options: [
                    'Check whether the page uses the official school domain.',
                    'Check whether the logo looks clear and updated.',
                    'Check whether the form loads quickly on your phone.',
                    'Check whether the warning appears in bold red text.'
                ],
                answer: 0,
                explanation: 'A copied logo and urgent message can be faked. The official domain is the stronger trust check.'
            }
        ]
    },
    'executive-impersonation': {
        title: 'Executive Impersonation',
        description: 'Handle high-pressure messages that pretend to come from school leaders, administrators, or decision-makers.',
        questions: [
            {
                topic: 'Authority pressure',
                prompt: 'You receive a message claiming to be from the school president asking you to urgently review a private document through a link. What matters most first?',
                options: [
                    'Whether the request sounds important enough.',
                    'Whether the sender uses the official school channel.',
                    'Whether the message mentions your full name.',
                    'Whether the attachment opens on your phone.'
                ],
                answer: 1,
                explanation: 'Authority-based phishing often relies on urgency and title. The sender and channel should be verified first.'
            },
            {
                topic: 'Urgent payment',
                prompt: 'A department head asks you to keep a request confidential and buy digital vouchers immediately. Which signal is the biggest warning sign?',
                options: [
                    'The request sounds urgent and secretive.',
                    'The message is short and direct.',
                    'The sender uses polite language.',
                    'The item requested is digital.'
                ],
                answer: 0,
                explanation: 'Urgency plus secrecy is a classic impersonation pattern used to stop people from verifying the request.'
            },
            {
                topic: 'Message verification',
                prompt: 'A dean sends a late-night email asking you to click a link and approve a document before morning. What is the safest step?',
                options: [
                    'Approve it quickly if the message sounds formal.',
                    'Open the link on another device first.',
                    'Verify the request through an official contact route.',
                    'Reply to the same email and wait for confirmation.'
                ],
                answer: 2,
                explanation: 'Verification should happen through a trusted route you already know, not through the suspicious message itself.'
            },
            {
                topic: 'Copied identity',
                prompt: 'A message uses the name and profile picture of a real administrator, but the contact number is unfamiliar. What should you assume first?',
                options: [
                    'It is safe because the name and image match.',
                    'It may be impersonation and should be verified.',
                    'It is fine if the tone sounds professional.',
                    'It is real if it references a current event.'
                ],
                answer: 1,
                explanation: 'Names and profile photos are easy to copy. An unfamiliar contact route should be treated carefully.'
            },
            {
                topic: 'Approval request',
                prompt: 'A senior staff account asks you to approve access to a cloud file immediately using a shared link. What is the safest response?',
                options: [
                    'Use the link if it includes the correct office name.',
                    'Wait for someone else to approve first.',
                    'Open the file preview before deciding.',
                    'Go to the official platform directly and check there.'
                ],
                answer: 3,
                explanation: 'Using the official platform directly is safer than trusting a link sent in a pressured message.'
            }
        ]
    },
    'breach-followup-scams': {
        title: 'Breach Follow-Up Scams',
        description: 'Practice spotting fake breach warnings that try to exploit fear after a supposed security incident.',
        questions: [
            {
                topic: 'Account scare',
                prompt: 'You receive a message saying your school account was found in a data breach and must be reset through an attached link. What is the safest reaction?',
                options: [
                    'Use the provided reset link before the access window closes.',
                    'Check the official school portal or IT office notice first.',
                    'Reply and ask whether your classmates got the same alert.',
                    'Save the message in case you need it later.'
                ],
                answer: 1,
                explanation: 'Breach warnings can be faked. Verify through official sources before using any reset link.'
            },
            {
                topic: 'Fear-based messaging',
                prompt: 'Which message detail most strongly suggests a breach-themed phishing attempt?',
                options: [
                    'It says your account may be at risk.',
                    'It urges immediate action through one included link.',
                    'It includes a support footer with a case number.',
                    'It mentions account security in the subject line.'
                ],
                answer: 1,
                explanation: 'Attackers often mix fear and urgency with a single action path to push fast decisions.'
            },
            {
                topic: 'Password reset pressure',
                prompt: 'A text says your credentials leaked and tells you to sign in through a "secure recovery page." What should you do?',
                options: [
                    'Sign in if the page uses HTTPS.',
                    'Wait a few minutes and try the same link again.',
                    'Use the official website or app to check your account.',
                    'Forward the text to friends and ask if it looks real.'
                ],
                answer: 2,
                explanation: 'Official login routes are safer than links provided inside alarming messages.'
            },
            {
                topic: 'Follow-up scam',
                prompt: 'After a public news story about hacked school accounts, an email asks you to confirm your identity with your current password. Why is this risky?',
                options: [
                    'Real incidents do not justify sending your password.',
                    'It arrived after normal office hours.',
                    'It uses too many technical terms.',
                    'It references a current event too directly.'
                ],
                answer: 0,
                explanation: 'Attackers often piggyback on real events, but legitimate support should not ask for your password through email.'
            },
            {
                topic: 'Credential safety',
                prompt: 'A warning email says your account will stay exposed unless you "verify your current password" to prove ownership. What is the best response?',
                options: [
                    'Never provide the password through the email workflow.',
                    'Provide only part of the password for safety.',
                    'Change the password after sending it once.',
                    'Reply asking whether a shorter password is allowed.'
                ],
                answer: 0,
                explanation: 'A verification process that asks for your current password in a message flow should be treated as unsafe.'
            }
        ]
    },
    'recovery-flow-attacks': {
        title: 'Recovery Flow Attacks',
        description: 'Learn to recognize suspicious account recovery steps, one-time-code traps, and takeover attempts.',
        questions: [
            {
                topic: 'Recovery email',
                prompt: 'A page says your account recovery request has been started and asks you to enter your one-time code to cancel it. What is the biggest concern?',
                options: [
                    'The page may be trying to steal the one-time code.',
                    'The page uses a short recovery deadline.',
                    'The message mentions account protection often.',
                    'The design looks too simple for a school page.'
                ],
                answer: 0,
                explanation: 'Recovery scams often try to capture one-time codes to complete an account takeover.'
            },
            {
                topic: 'Unexpected reset',
                prompt: 'You did not request a password reset, but a message says someone else did and you must sign in now to stop it. What is safest?',
                options: [
                    'Use the included link to protect the account quickly.',
                    'Go to the official sign-in page yourself and review activity there.',
                    'Reply first and wait for an explanation.',
                    'Ignore it completely even if more alerts arrive.'
                ],
                answer: 1,
                explanation: 'If the alert is real, checking through the official platform is safer than trusting the message link.'
            },
            {
                topic: 'One-time code request',
                prompt: 'Someone claiming to be support says they sent a code to help restore your access and asks you to read it back. What should you do?',
                options: [
                    'Share it if they already know your full name.',
                    'Share it only if the request sounds urgent.',
                    'Do not share it and verify support separately.',
                    'Share the code but change your password later.'
                ],
                answer: 2,
                explanation: 'One-time codes should not be shared casually. Attackers use them to finish account takeovers.'
            },
            {
                topic: 'Cancel request page',
                prompt: 'A link says "Cancel unauthorized password reset" and opens a login form that asks for your current password. What should you check first?',
                options: [
                    'Whether the school logo matches the real site.',
                    'Whether the domain is the official account provider.',
                    'Whether the page loads quickly enough.',
                    'Whether the warning text appears in red.'
                ],
                answer: 1,
                explanation: 'A convincing design can be copied. The official domain matters more than visual polish.'
            },
            {
                topic: 'Takeover prevention',
                prompt: 'What is the best habit when you receive account recovery notices you did not trigger?',
                options: [
                    'Handle them through the official app or website only.',
                    'Open the message links on a safer device.',
                    'Ask the sender whether the notice is routine.',
                    'Wait for a second reminder before acting.'
                ],
                answer: 0,
                explanation: 'Using the official route reduces the chance of reacting inside a phishing-controlled recovery flow.'
            }
        ]
    },
    'financial-approval-fraud': {
        title: 'Financial Approval Fraud',
        description: 'Spot convincing approval requests involving reimbursements, invoices, budgets, and last-minute payments.',
        questions: [
            {
                topic: 'Invoice pressure',
                prompt: 'A message says an invoice must be approved immediately or a school service will be suspended today. What is the safest first move?',
                options: [
                    'Approve it first because service impact is serious.',
                    'Check the request through the official finance process.',
                    'Download the invoice and inspect it on your phone.',
                    'Reply asking if a smaller payment is possible.'
                ],
                answer: 1,
                explanation: 'Financial phishing often uses urgent consequences. Verification should happen through the official workflow.'
            },
            {
                topic: 'Bank details',
                prompt: 'An email says a supplier changed bank details and asks you to update the payment record using an attached form. Why is this risky?',
                options: [
                    'Bank detail changes should be verified directly.',
                    'Attached forms are always unsafe by default.',
                    'Emails about payments should only be short.',
                    'Suppliers should never send account updates.'
                ],
                answer: 0,
                explanation: 'Payment redirection scams often rely on fake change-of-bank notices.'
            },
            {
                topic: 'Approval chain',
                prompt: 'A finance request arrives from a familiar name, but the sender asks you to skip the usual approval process because of urgency. What should you do?',
                options: [
                    'Follow the normal process and verify the request.',
                    'Approve it once if the amount is small enough.',
                    'Send the request to another office without checking.',
                    'Wait until the sender becomes more specific.'
                ],
                answer: 0,
                explanation: 'Urgent requests to bypass normal controls are a strong fraud sign.'
            },
            {
                topic: 'Digital voucher request',
                prompt: 'A senior office message asks you to buy prepaid vouchers for an urgent event expense. What is the strongest red flag?',
                options: [
                    'The amount requested is unusually specific.',
                    'The payment method is hard to reverse or trace.',
                    'The message arrived outside office hours.',
                    'The request uses short sentences.'
                ],
                answer: 1,
                explanation: 'Irreversible payment methods are often preferred by scammers because they are harder to recover.'
            },
            {
                topic: 'Approval page',
                prompt: 'You are sent to an "approval portal" asking for your account password before you can release funds. What should you assume first?',
                options: [
                    'It is normal if the portal uses HTTPS.',
                    'It may be a credential theft page.',
                    'It is safe if the amount matches a real invoice.',
                    'It is legitimate if the sender follows up quickly.'
                ],
                answer: 1,
                explanation: 'A fake approval portal can be used to steal credentials and continue the fraud.'
            }
        ]
    },
    'cross-channel-takeovers': {
        title: 'Cross-Channel Takeovers',
        description: 'Work through attacks that jump across email, text, chat, and calls to feel more believable.',
        questions: [
            {
                topic: 'Linked channels',
                prompt: 'You get an email about account verification, then a text telling you to complete the same step quickly. Why is this still suspicious?',
                options: [
                    'Multiple channels can be used to increase pressure.',
                    'Texts are always less trustworthy than email.',
                    'Real support never contacts users twice.',
                    'A second message means the first one was fake.'
                ],
                answer: 0,
                explanation: 'Attackers often use multiple channels together so the request feels more urgent and legitimate.'
            },
            {
                topic: 'Follow-up call',
                prompt: 'After ignoring a login warning email, you receive a phone call telling you to read a code to "secure" the account. What is safest?',
                options: [
                    'Provide the code because the caller references the email.',
                    'End the call and verify using official support details.',
                    'Ask the caller to wait while you open the link.',
                    'Send the code by text instead of saying it aloud.'
                ],
                answer: 1,
                explanation: 'A follow-up call does not make the request trustworthy. Verification should use official contact details.'
            },
            {
                topic: 'Chat handoff',
                prompt: 'A support chat tells you to continue account verification through a new site shared by SMS. What is the best response?',
                options: [
                    'Switch channels and continue if both messages match.',
                    'Use only the official support site you already know.',
                    'Open the SMS link first, then go back to the chat.',
                    'Wait for a third message before deciding.'
                ],
                answer: 1,
                explanation: 'A channel handoff can be part of a coordinated phishing flow. Staying on official routes is safer.'
            },
            {
                topic: 'Trust layering',
                prompt: 'An attacker first sends a harmless-looking alert, then later follows up with a login page and a call. What tactic is being used?',
                options: [
                    'Building trust and pressure over multiple steps.',
                    'Testing whether your phone can open forms.',
                    'Confirming your school schedule before asking more.',
                    'Reducing the chance of technical problems.'
                ],
                answer: 0,
                explanation: 'Layered contact is used to make the attack feel more convincing and harder to dismiss.'
            },
            {
                topic: 'Safe habit',
                prompt: 'What is the strongest defense against cross-channel phishing attempts?',
                options: [
                    'Comparing the style of each message carefully.',
                    'Sticking to official websites and support routes only.',
                    'Responding on the channel that feels most formal.',
                    'Waiting for at least two messages before acting.'
                ],
                answer: 1,
                explanation: 'Using official routes removes much of the attacker’s control over the interaction.'
            }
        ]
    },
    'best-practices': {
        title: 'Best Practices',
        description: 'Strengthen your everyday safety habits with practical best practices for accounts, messages, and suspicious websites.',
        questions: [
            {
                topic: 'Password habits',
                prompt: 'Which habit does the most to limit damage if one of your accounts is compromised through phishing?',
                options: [
                    'Using one strong password for related school accounts.',
                    'Using different passwords for important accounts.',
                    'Keeping password screenshots in a private chat.',
                    'Changing only your email password regularly.'
                ],
                answer: 1,
                explanation: 'Different passwords reduce the damage if one account is exposed through phishing.'
            },
            {
                topic: 'Verification',
                prompt: 'When a message warns you about an account issue and provides a direct link, what is the best practice?',
                options: [
                    'Use the link quickly before the problem gets worse.',
                    'Use the official website or app you already know.',
                    'Open the link in another browser first.',
                    'Reply first, then decide if the sender sounds real.'
                ],
                answer: 1,
                explanation: 'Going directly to the official site is safer than trusting links from messages.'
            },
            {
                topic: 'Sharing links',
                prompt: 'A friend asks whether a suspicious link is safe because it "looks normal." What is the best response?',
                options: [
                    'Tell them to try it in incognito mode first.',
                    'Tell them not to open it until it is verified.',
                    'Ask more people in the group chat what they think.',
                    'Tell them it is probably fine if it uses HTTPS.'
                ],
                answer: 1,
                explanation: 'It is safer to pause and verify suspicious links before anyone interacts with them.'
            },
            {
                topic: 'Awareness habit',
                prompt: 'Which everyday habit most improves phishing awareness over time?',
                options: [
                    'Checking links, sender details, and requests first.',
                    'Reading messages quickly so you do not miss updates.',
                    'Trusting familiar names unless the writing looks bad.',
                    'Opening attachments first, then deciding later.'
                ],
                answer: 0,
                explanation: 'Consistently checking details before acting builds strong phishing awareness over time.'
            },
            {
                topic: 'Safer routine',
                prompt: 'Which routine makes it easier to avoid phishing mistakes during busy days?',
                options: [
                    'Handling urgent messages first before checking the details.',
                    'Using one trusted route to sign in instead of message links.',
                    'Opening suspicious pages on a different browser window.',
                    'Keeping risky messages unread until the next day.'
                ],
                answer: 1,
                explanation: 'A consistent habit of using the official site or app instead of message links reduces the chance of reacting to phishing pressure.'
            }
        ]
    }
};

const quizPointValues = {
    'url-basics': 80,
    'login-page-clues': 100,
    'message-red-flags': 110,
    'after-clicking': 90,
    'qr-link-safety': 110,
    'social-media-scams': 120,
    'sender-source-checks': 130,
    'attachment-download-safety': 130,
    'account-recovery-traps': 140,
    'form-data-requests': 140,
    'payment-delivery-scams': 150,
    'support-impersonation': 150,
    'scholarship-bait': 160,
    'document-sharing-traps': 160,
    'mobile-alert-deception': 170,
    'event-registration-risks': 170,
    'marketplace-meetup-scams': 180,
    'multi-step-phish-cases': 190,
    'campus-portal-spoofs': 200,
    'urgent-admin-fraud': 210,
    'cloud-drive-compromise': 220,
    'internship-hiring-scams': 220,
    'verification-chain-attacks': 230,
    'phishing-scenarios': 240,
    'executive-impersonation': 250,
    'breach-followup-scams': 260,
    'recovery-flow-attacks': 270,
    'financial-approval-fraud': 280,
    'cross-channel-takeovers': 290,
    'best-practices': 320,
    'lab-login-page-check': 100
};

const loginPageLabAttemptId = 'lab-login-page-check';
const loginPageLabAttemptTitle = 'Login Page Check Lab';

const quizStartButtons = document.querySelectorAll('.quiz-start-btn[data-quiz]');
const labStartButtons = document.querySelectorAll('.quiz-start-btn[data-start-lab]');
const quizSidebar = document.getElementById('quizSidebar');
const quizSidebarOverlay = document.getElementById('quizSidebarOverlay');
const quizSidebarToggle = document.getElementById('quizSidebarToggle');
const quizSidebarBackBtn = document.querySelector('.quiz-sidebar-back-btn');
const quizSidebarStartBtn = document.getElementById('quizSidebarStartBtn');
const quizSidebarLogoutBtn = document.getElementById('quizSidebarLogoutBtn');
const quizSidebarProfileBtn = document.getElementById('quizSidebarProfileBtn');
const quizSidebarLabel = document.getElementById('quizSidebarLabel');
const quizSidebarName = document.getElementById('quizSidebarName');
const quizSidebarEmail = document.getElementById('quizSidebarEmail');
const quizSidebarAuthActions = document.getElementById('quizSidebarAuthActions');
const quizSidebarNavLinks = [...document.querySelectorAll('[data-quiz-nav-link]')];
const quizMobileTopbar = document.getElementById('quizMobileTopbar');
const quizMobileTopbarLabel = document.getElementById('quizMobileTopbarLabel');
const quizBadgesPanel = document.getElementById('quizBadgesPanel');
const quizBadgesGuestPrompt = document.getElementById('quizBadgesGuestPrompt');
const quizBadgesList = document.getElementById('quizBadgesList');
const quizBadgesEmpty = document.getElementById('quizBadgesEmpty');
const quizBadgeUnlockedCount = document.getElementById('quizBadgeUnlockedCount');
const quizBadgeHardCount = document.getElementById('quizBadgeHardCount');
const quizBadgeTotalCount = document.getElementById('quizBadgeTotalCount');
const quizProfilePanel = document.getElementById('quizProfilePanel');
const quizProfileGrid = document.querySelector('#quizProfilePanel .quiz-profile-grid');
const quizLogoutConfirmOverlay = document.getElementById('quizLogoutConfirmOverlay');
const quizLogoutCancelBtn = document.getElementById('quizLogoutCancelBtn');
const quizLogoutConfirmBtn = document.getElementById('quizLogoutConfirmBtn');
const quizProfileName = document.getElementById('quizProfileName');
const quizProfileEmail = document.getElementById('quizProfileEmail');
const quizProfileAttempts = document.getElementById('quizProfileAttempts');
const quizProfileAverage = document.getElementById('quizProfileAverage');
const quizProfileBest = document.getElementById('quizProfileBest');
const quizProfileRank = document.getElementById('quizProfileRank');
const quizProfileRankProgressFill = document.getElementById('quizProfileRankProgressFill');
const quizProfileRankProgressText = document.getElementById('quizProfileRankProgressText');
const quizAchievementStack = document.getElementById('quizAchievementStack');
const quizProfileCompletedSets = document.getElementById('quizProfileCompletedSets');
const quizProfileNoteInput = document.getElementById('quizProfileNoteInput');
const quizProfileNoteCount = document.getElementById('quizProfileNoteCount');
const quizProfileNoteStatus = document.getElementById('quizProfileNoteStatus');
const quizProfileNoteDisplay = document.getElementById('quizProfileNoteDisplay');
const quizProfileNoteEditor = document.getElementById('quizProfileNoteEditor');
const quizProfileNoteText = document.getElementById('quizProfileNoteText');
const quizProfileNoteEditBtn = document.getElementById('quizProfileNoteEditBtn');
const quizProfileNoteSaveBtn = document.getElementById('quizProfileNoteSaveBtn');
const quizProfileBadgeList = document.getElementById('quizProfileBadgeList');
const quizProfileBadgeEmpty = document.getElementById('quizProfileBadgeEmpty');
const quizProfileUnlockedBadgeCount = document.getElementById('quizProfileUnlockedBadgeCount');
const quizHistoryPanelSection = document.getElementById('quizHistoryPanel');
const quizHistoryGuestPrompt = document.getElementById('quizHistoryGuestPrompt');
const quizHistoryList = document.getElementById('quizHistoryList');
const quizHistoryEmpty = document.getElementById('quizHistoryEmpty');
const quizHistoryToggleBtn = document.getElementById('quizHistoryToggleBtn');
const quizLeaderboardPanel = document.getElementById('quizLeaderboardPanel');
const labsPanel = document.getElementById('labsPanel');
const loginPageLab = document.getElementById('loginPageLab');
const loginPageLabClose = document.getElementById('loginPageLabClose');
const loginPageLabSelectionCount = document.getElementById('loginPageLabSelectionCount');
const loginPageLabSubmit = document.getElementById('loginPageLabSubmit');
const loginPageLabReset = document.getElementById('loginPageLabReset');
const loginPageLabFeedback = document.getElementById('loginPageLabFeedback');
const loginPageLabSpotTargets = [...document.querySelectorAll('.lab-spot-target[data-lab-spot]')];
const quizLeaderboardList = document.getElementById('quizLeaderboardList');
const quizLeaderboardEmpty = document.getElementById('quizLeaderboardEmpty');
const quizProfileGuestPrompt = document.getElementById('quizProfileGuestPrompt');
const quizPublicProfileOverlay = document.getElementById('quizPublicProfileOverlay');
const quizPublicProfileClose = document.getElementById('quizPublicProfileClose');
const quizPublicProfileBody = document.getElementById('quizPublicProfileBody');
const quizAttemptReviewOverlay = document.getElementById('quizAttemptReviewOverlay');
const quizAttemptReviewClose = document.getElementById('quizAttemptReviewClose');
const quizAttemptReviewBody = document.getElementById('quizAttemptReviewBody');
const quizSectionTitle = document.getElementById('quizSectionTitle');
const quizSectionDescription = document.getElementById('quizSectionDescription');
const quizPagination = document.getElementById('quizPagination');
const labsPagination = document.getElementById('labsPagination');
const quizzesSection = document.getElementById('quizzes');
const quizWorkspace = document.getElementById('quizWorkspace');
const quizSessionTitle = document.getElementById('quizSessionTitle');
const quizSessionDesc = document.getElementById('quizSessionDesc');
const quizQuestionCounter = document.getElementById('quizQuestionCounter');
const quizProgressFill = document.getElementById('quizProgressFill');
const quizQuestionTopic = document.getElementById('quizQuestionTopic');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizQuestionCard = document.getElementById('quizQuestionCard');
const quizResultCard = document.getElementById('quizResultCard');
const quizResultScore = document.getElementById('quizResultScore');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultSummary = document.getElementById('quizResultSummary');
const quizCorrectCount = document.getElementById('quizCorrectCount');
const quizResultQuizName = document.getElementById('quizResultQuizName');
const guestQuizPrompt = document.getElementById('guestQuizPrompt');
const quizRetryBtn = document.getElementById('quizRetryBtn');
const quizChooseAnotherBtn = document.getElementById('quizChooseAnotherBtn');
const quizExitBtn = document.getElementById('quizExitBtn');
const quizGrid = document.getElementById('quizzesGrid');
const quizCards = [...document.querySelectorAll('.quiz-card[data-quiz-card]')];
const labsGrid = document.getElementById('labsGrid');
const labCards = [...document.querySelectorAll('.quiz-card[data-lab-card]')];

let currentQuizId = null;
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let score = 0;
let answers = [];
let signedInQuizAttempts = [];
let hasInitializedBadgeUnlocks = false;
let unlockedBadgeSnapshot = new Set();
let achievementToastQueue = [];
let activeAchievementToast = null;
let currentQuizPage = 1;
let currentLabPage = 1;
let lockedQuizSidebarScrollY = 0;
const loginPageLabCorrectSpots = new Set(['domain', 'urgency', 'support']);
let quizSidebarTouchStartY = 0;
const guestQuizCardsPreviewCount = 6;
const maxAdaptiveQuizCardsPerPage = 6;
const totalQuizPages = 10;
const totalLabPages = 10;

function getGuestPreviewCard(gridType = 'quizzes') {
    const grid = gridType === 'labs' ? labsGrid : quizGrid;
    if (!grid) return null;

    const cardId = gridType === 'labs' ? 'labsGuestPreviewCard' : 'quizzesGuestPreviewCard';
    let card = document.getElementById(cardId);
    if (card) return card;

    const kicker = gridType === 'labs' ? 'Labs Locked' : 'Training Locked';
    const title = gridType === 'labs' ? 'Sign in to unlock more hands-on labs' : 'Sign in to unlock more training sets';
    const description = gridType === 'labs'
        ? 'Your saved lab progress, more hands-on phishing practice, and future lab activities will appear here once you sign in.'
        : 'More training sets, saved progress, badges, and full training access will appear here once you sign in.';

    card = document.createElement('div');
    card.id = cardId;
    card.className = 'quiz-guest-preview-card';
    card.innerHTML = `
        <div class="quiz-locked-panel">
            <p class="quiz-dashboard-kicker">${kicker}</p>
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="quiz-locked-panel-actions">
                <a href="/login?returnTo=/quiz" class="quiz-sidebar-auth-btn is-signin">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Sign In</span>
                </a>
                <a href="/signup?returnTo=/quiz" class="quiz-sidebar-auth-btn is-signup">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Sign Up</span>
                </a>
            </div>
        </div>
    `;

    grid.appendChild(card);
    return card;
}

function getQuizCardsPerPage() {
    return 6;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

createPlaceholderQuizCards();
createPlaceholderLabCards();
reorderQuizCardsForPagination();
updateQuizCardTierLabels();
renderQuizPagination();
renderLabsPagination();
applyQuizPageState();

function getStoredAuthToken() {
    return localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey) || '';
}

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (DEPLOY_FRONTEND_ORIGINS.has(origin)) return RENDER_API_BASE;
    return origin;
}

async function apiFetch(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getStoredAuthToken();

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'Request failed.');
    }

    return data;
}

function getStoredUser() {
    const rawUser = localStorage.getItem(authUserKey) || sessionStorage.getItem(authUserKey);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return { name: rawUser };
    }
}

function setStoredUser(user) {
    if (!user) return;

    [localStorage, sessionStorage].forEach((storage) => {
        const existingRaw = storage.getItem(authUserKey);
        if (!existingRaw) return;

        try {
            const existingUser = JSON.parse(existingRaw);
            storage.setItem(authUserKey, JSON.stringify({
                ...existingUser,
                ...user
            }));
        } catch {
            storage.setItem(authUserKey, JSON.stringify(user));
        }
    });
}

function syncQuizProfileNoteUi(note = '', statusText = 'Keep it short and clear.', forceEdit = false) {
    const normalizedNote = String(note || '').slice(0, 120);
    const showSavedView = Boolean(normalizedNote) && !forceEdit;

    if (quizProfileNoteInput) {
        quizProfileNoteInput.value = normalizedNote;
        quizProfileNoteInput.disabled = !isLoggedIn();
    }

    if (quizProfileNoteCount) {
        quizProfileNoteCount.textContent = `${normalizedNote.length} / 120`;
    }

    if (quizProfileNoteStatus) {
        quizProfileNoteStatus.textContent = statusText;
    }

    if (quizProfileNoteText) {
        quizProfileNoteText.textContent = normalizedNote;
    }

    if (quizProfileNoteDisplay) {
        quizProfileNoteDisplay.hidden = !showSavedView;
    }

    if (quizProfileNoteEditor) {
        quizProfileNoteEditor.hidden = showSavedView;
    }

    if (quizProfileNoteSaveBtn) {
        quizProfileNoteSaveBtn.disabled = !isLoggedIn();
    }

    if (quizProfileNoteEditBtn) {
        quizProfileNoteEditBtn.hidden = !isLoggedIn();
    }
}

function isLoggedIn() {
    return Boolean(getStoredAuthToken());
}

function clearStoredAuth() {
    [localStorage, sessionStorage].forEach((storage) => {
        storage.removeItem(authTokenKey);
        storage.removeItem(authUserKey);
        storage.removeItem(activeChatKey);
    });
}

async function handleQuizLogout() {
    try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Quiz logout request failed', error);
    }

    clearStoredAuth();
    hasInitializedBadgeUnlocks = false;
    unlockedBadgeSnapshot = new Set();
    achievementToastQueue = [];
    if (activeAchievementToast) {
        activeAchievementToast.remove();
        activeAchievementToast = null;
    }
    closePublicQuizProfile();
    resetQuizWorkspace();
    applyQuizPageState();
    window.location.href = '/quiz';
}

function openQuizLogoutConfirm() {
    if (quizLogoutConfirmOverlay) {
        quizLogoutConfirmOverlay.hidden = false;
    }
    quizLogoutConfirmBtn?.focus();
}

function closeQuizLogoutConfirm() {
    if (quizLogoutConfirmOverlay) {
        quizLogoutConfirmOverlay.hidden = true;
    }
}

function getCompletedQuizIds(attempts = []) {
    const completedQuizIds = new Set();

    attempts.forEach((attempt) => {
        const quizId = String(attempt?.quizId || '').trim();
        const percentage = Number(attempt?.percentage || 0);

        if (quizId && percentage >= 75) {
            completedQuizIds.add(quizId);
        }
    });

    return completedQuizIds;
}

function getFinishedQuizIds(attempts = []) {
    const finishedQuizIds = new Set();

    attempts.forEach((attempt) => {
        const quizId = String(attempt?.quizId || '').trim();
        if (quizId) {
            finishedQuizIds.add(quizId);
        }
    });

    return finishedQuizIds;
}

function getEarnedQuizPoints(attempts = []) {
    return [...getCompletedQuizIds(attempts)].reduce((total, quizId) => total + Number(quizPointValues[quizId] || 0), 0);
}

function getStrongQuizCount(attempts = [], minimumScore = 85) {
    const bestByQuizId = new Map();

    attempts.forEach((attempt) => {
        const quizId = String(attempt?.quizId || '').trim();
        const percentage = Number(attempt?.percentage || 0);
        if (!quizId) return;
        bestByQuizId.set(quizId, Math.max(bestByQuizId.get(quizId) || 0, percentage));
    });

    return [...bestByQuizId.values()].filter((score) => score >= minimumScore).length;
}

function getQuizUnlockState(quizId, attempts = []) {
    const rule = advancedQuizRules[quizId];
    if (!rule) {
        return {
            locked: false,
            reason: '',
            cta: 'Start Set'
        };
    }

    if (!isLoggedIn()) {
        return {
            locked: true,
            reason: 'Sign in to start advanced quiz sets and save your progress.',
            cta: 'Sign In to Unlock',
            action: 'login'
        };
    }

    const attemptsCount = attempts.length;
    const uniqueTopics = new Set(attempts.map((attempt) => attempt.quizId)).size;
    const averageScore = attemptsCount
        ? Math.round(attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attemptsCount)
        : 0;
    const finishedQuizIds = getFinishedQuizIds(attempts);
    const requiredQuizIds = Array.isArray(rule.requiresQuizIds) ? rule.requiresQuizIds : [];
    const missingQuizTitles = requiredQuizIds
        .filter((requiredQuizId) => !finishedQuizIds.has(requiredQuizId))
        .map((requiredQuizId) => quizzes[requiredQuizId]?.title || requiredQuizId);
    const hasRequiredQuizIds = requiredQuizIds.every((requiredQuizId) => finishedQuizIds.has(requiredQuizId));

    const getSeriesUnlockNote = () => {
        if (!requiredQuizIds.length) return rule.label || '';
        if (requiredQuizIds.every((requiredQuizId) => coreQuizIds.includes(requiredQuizId))) {
            return 'Finish Core Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => skillBuilderQuizIds.includes(requiredQuizId))) {
            return 'Finish Skill Builder Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => challengerQuizIds.includes(requiredQuizId))) {
            return 'Finish Challenger Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => advancedSeriesQuizIds.includes(requiredQuizId))) {
            return 'Finish Advanced Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => masteryPrepQuizIds.includes(requiredQuizId))) {
            return 'Finish the earlier Mastery sets first.';
        }
        return rule.label || '';
    };

    const unlocked =
        hasRequiredQuizIds &&
        attemptsCount >= (rule.minimumAttempts || 0) &&
        uniqueTopics >= (rule.minimumUniqueTopics || 0) &&
        averageScore >= (rule.minimumAverageScore || 0);

    let reason = '';
    if (!unlocked) {
        if (missingQuizTitles.length) {
            reason = getSeriesUnlockNote();
        } else if (attemptsCount < (rule.minimumAttempts || 0)) {
            reason = `Save ${rule.minimumAttempts} attempts first.`;
        } else if (uniqueTopics < (rule.minimumUniqueTopics || 0)) {
            reason = `Finish ${rule.minimumUniqueTopics} sets first.`;
        } else if (averageScore < (rule.minimumAverageScore || 0)) {
            reason = `Reach a ${rule.minimumAverageScore}% average first.`;
        } else {
            reason = rule.label;
        }
    }

    return {
        locked: !unlocked,
        reason,
        cta: unlocked ? 'Start Set' : 'Locked for Now',
        action: unlocked ? 'start' : 'locked'
    };
}

function updateQuizUnlockStates(attempts = []) {
    const completedQuizIds = getCompletedQuizIds(attempts);

    quizStartButtons.forEach((button) => {
        const quizId = button.dataset.quiz;
        const card = button.closest('[data-quiz-card]');
        let note = document.getElementById(`quizUnlockNote-${quizId}`) || card?.querySelector('.quiz-unlock-note.quiz-dynamic-unlock-note') || null;
        const completedChip = document.getElementById(`quizCompletedChip-${quizId}`);
        const state = getQuizUnlockState(quizId, attempts);
        const isCompleted = completedQuizIds.has(quizId);

        button.dataset.lockedAction = state.action || 'start';
        button.textContent = state.cta;
        button.disabled = state.locked && state.action !== 'login';

        if (card) {
            card.classList.toggle('is-locked', state.locked);
            card.classList.toggle('is-completed', isCompleted);
        }

        if (!note && card) {
            note = document.createElement('p');
            note.className = 'quiz-unlock-note quiz-dynamic-unlock-note';
            const buttonWrap = card.querySelector('.quiz-start-btn');
            if (buttonWrap) {
                card.insertBefore(note, buttonWrap);
            } else {
                card.appendChild(note);
            }
        }

        if (note) {
            note.hidden = !state.locked;
            note.textContent = state.reason;
        }

        if (completedChip) {
            completedChip.hidden = !isCompleted;
        }
    });
}

function getRecommendedQuizId(attempts = []) {
    const completedQuizIds = getCompletedQuizIds(attempts);

    for (const quizId of coreQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of skillBuilderQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of challengerQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of advancedSeriesQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of masterySeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    const summaryByQuizId = new Map();
    attempts.forEach((attempt) => {
        const existing = summaryByQuizId.get(attempt.quizId) || {
            quizId: attempt.quizId,
            bestScore: -1,
            latestAttemptAt: ''
        };

        existing.bestScore = Math.max(existing.bestScore, Number(attempt.percentage || 0));
        existing.latestAttemptAt = existing.latestAttemptAt > attempt.createdAt
            ? existing.latestAttemptAt
            : attempt.createdAt;

        summaryByQuizId.set(attempt.quizId, existing);
    });

    const fallbackOrder = [...coreQuizIds, ...skillBuilderQuizIds, ...challengerQuizIds, ...advancedSeriesQuizIds, ...masterySeriesQuizIds];
    const reviewCandidate = [...summaryByQuizId.values()]
        .sort((left, right) => {
            if (left.bestScore !== right.bestScore) return left.bestScore - right.bestScore;
            if (left.latestAttemptAt !== right.latestAttemptAt) return left.latestAttemptAt.localeCompare(right.latestAttemptAt);
            return fallbackOrder.indexOf(left.quizId) - fallbackOrder.indexOf(right.quizId);
        })[0];

    return reviewCandidate?.quizId || coreQuizIds[0];
}

function updateQuizCardTierLabels() {
    const tierMap = {
        'url-basics': { badge: 'Core Series', difficulty: 'Beginner', accent: 'core', difficultyClass: 'easy' },
        'login-page-clues': { badge: 'Core Series', difficulty: 'Beginner', accent: 'core', difficultyClass: 'easy' },
        'message-red-flags': { badge: 'Core Series', difficulty: 'Intermediate', accent: 'core', difficultyClass: 'medium' },
        'after-clicking': { badge: 'Core Series', difficulty: 'Beginner', accent: 'core', difficultyClass: 'easy' },
        'qr-link-safety': { badge: 'Core Series', difficulty: 'Intermediate', accent: 'core', difficultyClass: 'medium' },
        'social-media-scams': { badge: 'Core Series', difficulty: 'Intermediate', accent: 'core', difficultyClass: 'medium' },
        'sender-source-checks': { badge: 'Skill Builder Series', difficulty: 'Intermediate', accent: 'skill-builder', difficultyClass: 'medium' },
        'attachment-download-safety': { badge: 'Skill Builder Series', difficulty: 'Intermediate', accent: 'skill-builder', difficultyClass: 'medium' },
        'account-recovery-traps': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'form-data-requests': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'payment-delivery-scams': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'support-impersonation': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'scholarship-bait': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'document-sharing-traps': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'mobile-alert-deception': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'event-registration-risks': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'marketplace-meetup-scams': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'multi-step-phish-cases': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'campus-portal-spoofs': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'urgent-admin-fraud': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'cloud-drive-compromise': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'internship-hiring-scams': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'verification-chain-attacks': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'phishing-scenarios': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'executive-impersonation': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'breach-followup-scams': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'recovery-flow-attacks': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'financial-approval-fraud': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'cross-channel-takeovers': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'best-practices': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' }
    };

    Object.entries(tierMap).forEach(([quizId, config]) => {
        const card = document.querySelector(`[data-quiz-card="${quizId}"]`);
        if (!card) return;

        const badge = card.querySelector('.quiz-badge');
        const difficulty = card.querySelector('.difficulty');

        if (badge) {
            badge.textContent = config.badge;
        }

        if (difficulty) {
            difficulty.textContent = config.difficulty;
            difficulty.classList.remove('easy', 'medium', 'hard', 'advanced', 'mastery');
            if (config.difficultyClass) {
                difficulty.classList.add(config.difficultyClass);
            }
        }

        card.classList.remove('is-core', 'is-beginner', 'is-intermediate', 'is-skill-builder', 'is-challenger', 'is-advanced', 'is-mastery');
        if (config.accent) {
            card.classList.add(`is-${config.accent}`);
        }
    });
}

function setActiveQuizSidebarLink(targetId = '') {
    const normalizedTargetId = targetId === 'loginPageLab' ? 'labsPanel' : targetId;
    quizSidebarNavLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const isActive = href === `#${normalizedTargetId}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function shouldUseQuizSidebarDrawer() {
    return window.innerWidth <= 1024;
}

function syncQuizSidebarToggleState(isOpen) {
    if (quizSidebarToggle) {
        quizSidebarToggle.setAttribute('aria-expanded', String(isOpen));
        quizSidebarToggle.setAttribute('aria-label', isOpen ? 'Close quiz navigation' : 'Open quiz navigation');
    }
}

function isQuizSidebarDrawerOpen() {
    return document.body.classList.contains('quiz-sidebar-open') && shouldUseQuizSidebarDrawer();
}

function getQuizSidebarScrollableAncestor(target) {
    if (!(target instanceof Element) || !quizSidebar) return null;

    let current = target.closest('.quiz-sidebar-section, .quiz-sidebar');

    while (current && quizSidebar.contains(current)) {
        if (current.scrollHeight > current.clientHeight + 1) {
            return current;
        }
        current = current.parentElement?.closest('.quiz-sidebar-section, .quiz-sidebar') || null;
    }

    return null;
}

function handleQuizSidebarTouchStart(event) {
    if (!isQuizSidebarDrawerOpen()) return;
    quizSidebarTouchStartY = event.touches?.[0]?.clientY || 0;
}

function handleQuizSidebarTouchMove(event) {
    if (!isQuizSidebarDrawerOpen()) return;

    const target = event.target;
    if (!(target instanceof Element)) {
        event.preventDefault();
        return;
    }

    if (!quizSidebar?.contains(target)) {
        event.preventDefault();
        return;
    }

    const scrollableAncestor = getQuizSidebarScrollableAncestor(target);
    if (!scrollableAncestor) {
        event.preventDefault();
        return;
    }

    const currentY = event.touches?.[0]?.clientY || 0;
    const deltaY = currentY - quizSidebarTouchStartY;
    const atTop = scrollableAncestor.scrollTop <= 0;
    const atBottom = scrollableAncestor.scrollTop + scrollableAncestor.clientHeight >= scrollableAncestor.scrollHeight - 1;

    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        event.preventDefault();
    }
}

function lockQuizSidebarBackgroundScroll() {
    if (!shouldUseQuizSidebarDrawer()) return;

    lockedQuizSidebarScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('quiz-sidebar-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedQuizSidebarScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
}

function unlockQuizSidebarBackgroundScroll() {
    const scrollY = lockedQuizSidebarScrollY;

    document.documentElement.classList.remove('quiz-sidebar-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';

    if (scrollY > 0) {
        window.scrollTo(0, scrollY);
    }

    lockedQuizSidebarScrollY = 0;
}

function closeQuizSidebarDrawer() {
    document.body.classList.remove('quiz-sidebar-open');
    unlockQuizSidebarBackgroundScroll();
    syncQuizSidebarToggleState(false);
}

function openQuizSidebarDrawer() {
    if (!shouldUseQuizSidebarDrawer()) return;
    lockQuizSidebarBackgroundScroll();
    document.body.classList.add('quiz-sidebar-open');
    syncQuizSidebarToggleState(true);
}

function toggleQuizSidebarDrawer() {
    if (document.body.classList.contains('quiz-sidebar-open')) {
        closeQuizSidebarDrawer();
        return;
    }

    openQuizSidebarDrawer();
}

function handleQuizSidebarCloseControl(event) {
    event.preventDefault();
    event.stopPropagation();
    closeQuizSidebarDrawer();
}

function setQuizAppView(view = 'quiz-library') {
    const signedIn = isLoggedIn();
    const quizLibraryOnly = view === 'quiz-library';
    const labsOnly = view === 'labs';
    const currentLabOnly = view === 'current-lab';
    const leaderboardOnly = view === 'leaderboard';
    const profileOnly = view === 'profile';
    const badgesOnly = view === 'badges';
    const historyOnly = view === 'history';
    const currentQuizOnly = view === 'current-quiz';

    if (quizProfilePanel) quizProfilePanel.hidden = !profileOnly;
    if (quizBadgesPanel) quizBadgesPanel.hidden = !badgesOnly;
    if (quizHistoryPanelSection) quizHistoryPanelSection.hidden = !historyOnly;
    if (quizLeaderboardPanel) quizLeaderboardPanel.hidden = !leaderboardOnly;
    if (quizzesSection) quizzesSection.hidden = !quizLibraryOnly;
    if (labsPanel) labsPanel.hidden = !labsOnly;
    if (loginPageLab) loginPageLab.hidden = !currentLabOnly;
    if (quizWorkspace) quizWorkspace.hidden = !currentQuizOnly || !currentQuizId;

    if (quizHistoryGuestPrompt) quizHistoryGuestPrompt.hidden = !historyOnly || signedIn;
    if (quizBadgesGuestPrompt) quizBadgesGuestPrompt.hidden = !badgesOnly || signedIn;
    if (quizProfileGuestPrompt) quizProfileGuestPrompt.hidden = !profileOnly || signedIn;
    if (quizHistoryList) quizHistoryList.hidden = historyOnly && !signedIn;
    if (quizHistoryEmpty) quizHistoryEmpty.hidden = historyOnly && !signedIn ? true : quizHistoryEmpty.hidden;
    if (quizHistoryToggleBtn) quizHistoryToggleBtn.hidden = true;
    if (quizHistoryPanelSection) {
        quizHistoryPanelSection.classList.toggle('is-guest-locked', historyOnly && !signedIn);
    }
    if (quizBadgesPanel) {
        quizBadgesPanel.classList.toggle('is-guest-locked', badgesOnly && !signedIn);
    }
    if (quizProfilePanel) {
        quizProfilePanel.classList.toggle('is-guest-locked', profileOnly && !signedIn);
    }
    if (quizProfileGrid) quizProfileGrid.hidden = profileOnly && !signedIn;
    if (quizBadgesList) quizBadgesList.hidden = badgesOnly && !signedIn;
}

function scrollToQuizSection(targetId, behavior = 'smooth') {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    if (isLoggedIn()) {
        if (targetId === 'quizLeaderboardPanel') {
            setQuizAppView('leaderboard');
        } else if (targetId === 'quizBadgesPanel') {
            setQuizAppView('badges');
        } else if (targetId === 'quizProfilePanel') {
            setQuizAppView('profile');
        } else if (targetId === 'quizHistoryPanel') {
            setQuizAppView('history');
        } else if (targetId === 'labsPanel') {
            setQuizAppView('labs');
        } else if (targetId === 'loginPageLab') {
            setQuizAppView('current-lab');
        } else if (targetId === 'quizWorkspace') {
            setQuizAppView('current-quiz');
        } else {
            setQuizAppView('quiz-library');
        }
    } else {
        if (targetId === 'quizLeaderboardPanel') {
            setQuizAppView('leaderboard');
        } else if (targetId === 'quizBadgesPanel') {
            setQuizAppView('badges');
        } else if (targetId === 'quizProfilePanel') {
            setQuizAppView('profile');
        } else if (targetId === 'quizHistoryPanel') {
            setQuizAppView('history');
        } else if (targetId === 'labsPanel') {
            setQuizAppView('labs');
        } else if (targetId === 'loginPageLab') {
            setQuizAppView('current-lab');
        } else if (targetId === 'quizWorkspace') {
            setQuizAppView('current-quiz');
        } else {
            setQuizAppView('quiz-library');
        }
    }

    setActiveQuizSidebarLink(targetId);
    target.scrollIntoView({ behavior, block: 'start' });
}

function syncQuizViewFromHash(behavior = 'auto') {
    const hash = String(window.location.hash || '').trim();
    if (!hash.startsWith('#')) return;

    const targetId = hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    scrollToQuizSection(targetId, behavior);
}

function bindQuizSidebarNavigation() {
    if (!quizSidebarNavLinks.length) return;

    quizSidebarNavLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            const targetId = href.slice(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            event.preventDefault();
            if (window.location.hash !== `#${targetId}`) {
                history.replaceState(null, '', `#${targetId}`);
            }
            scrollToQuizSection(targetId);
            closeQuizSidebarDrawer();
        });
    });
}

function applyQuizPageState() {
    const signedIn = isLoggedIn();
    const user = getStoredUser();
    const firstName =
        user?.name?.split?.(' ')?.[0] ||
        user?.username?.split?.(' ')?.[0] ||
        user?.email?.split?.('@')?.[0] ||
        'Student';
    const fullLabel = user?.name || user?.username || firstName;
    const compactLabel = firstName || fullLabel;
    const secondaryLabel = user?.email || 'Quiz account';

    document.body.classList.add('quiz-signed-in');

    if (signedIn) {
        if (quizSidebarLabel) quizSidebarLabel.textContent = 'Signed in as';
        if (quizSidebarName) quizSidebarName.textContent = compactLabel;
        if (quizSidebarEmail) quizSidebarEmail.textContent = secondaryLabel;
        if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = compactLabel;
        if (quizProfileName) quizProfileName.textContent = fullLabel;
        if (quizProfileEmail) quizProfileEmail.textContent = secondaryLabel;
        syncQuizProfileNoteUi(user?.profileNote || '');
        if (quizSidebar) quizSidebar.hidden = false;
        if (quizMobileTopbar) quizMobileTopbar.hidden = false;
        if (quizSidebarAuthActions) quizSidebarAuthActions.hidden = true;
        if (quizSidebarLogoutBtn) quizSidebarLogoutBtn.hidden = false;
        if (quizSidebarProfileBtn) quizSidebarProfileBtn.disabled = false;

        if (quizSectionTitle) quizSectionTitle.textContent = 'Available Training';
        if (quizSectionDescription) {
            quizSectionDescription.textContent = 'Choose a quiz set and strengthen your phishing awareness one topic at a time.';
        }

        loadSignedInQuizData();
        setQuizAppView('quiz-library');
        updateQuizUnlockStates();
        renderQuizPagination();
        renderLabsPagination();
    } else {
        if (quizSidebarLabel) quizSidebarLabel.textContent = 'Guest access';
        if (quizSidebarName) quizSidebarName.textContent = 'Guest User';
        if (quizSidebarEmail) quizSidebarEmail.textContent = 'Sign in to save progress';
        if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = 'Guest mode';
        if (quizProfileName) quizProfileName.textContent = 'Guest User';
        if (quizProfileEmail) quizProfileEmail.textContent = 'Sign in to save progress';
        syncQuizProfileNoteUi('', 'Sign in to save a short profile note.');
        if (quizSidebar) quizSidebar.hidden = false;
        if (quizMobileTopbar) quizMobileTopbar.hidden = false;
        if (quizSidebarAuthActions) quizSidebarAuthActions.hidden = false;
        if (quizSidebarLogoutBtn) quizSidebarLogoutBtn.hidden = true;
        if (quizSidebarProfileBtn) quizSidebarProfileBtn.disabled = false;
        closeQuizSidebarDrawer();

        if (quizSectionTitle) quizSectionTitle.textContent = 'Available Training';
        if (quizSectionDescription) {
            quizSectionDescription.textContent = 'Choose a quiz set and strengthen your phishing awareness one topic at a time.';
        }

        signedInQuizAttempts = [];
        renderQuizHistory([], {
            listElement: quizHistoryList,
            emptyElement: quizHistoryEmpty,
            limit: 100
        });
        populateQuizProfile([]);
        loadPublicQuizLeaderboard();
        setQuizAppView('quiz-library');
        updateQuizUnlockStates();
        renderQuizPagination();
        renderLabsPagination();
    }

}

async function loadPublicQuizLeaderboard() {
    try {
        const data = await apiFetch('/api/quiz/public-leaderboard');
        renderQuizLeaderboard(Array.isArray(data?.leaderboard) ? data.leaderboard : [], '', 2);
    } catch (error) {
        console.warn('Public quiz leaderboard fallback:', error.message || error);
        renderQuizLeaderboard([], '', 2);
    }
}

async function loadSignedInQuizData() {
    if (!isLoggedIn()) return;

    try {
        const [attemptData, leaderboardData, authData] = await Promise.all([
            apiFetch('/api/quiz/attempts'),
            apiFetch('/api/quiz/leaderboard'),
            apiFetch('/api/auth/me')
        ]);

        if (authData?.user) {
            setStoredUser(authData.user);

            const fullLabel = authData.user.name || authData.user.username || 'Student';
            const secondaryLabel = authData.user.email || 'Quiz account';

            if (quizSidebarName) quizSidebarName.textContent = fullLabel;
            if (quizSidebarEmail) quizSidebarEmail.textContent = secondaryLabel;
            if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = fullLabel;
            if (quizProfileName) quizProfileName.textContent = fullLabel;
            if (quizProfileEmail) quizProfileEmail.textContent = secondaryLabel;
            syncQuizProfileNoteUi(authData.user.profileNote || '');
        }

        signedInQuizAttempts = Array.isArray(attemptData?.attempts) ? attemptData.attempts : [];
        syncBadgeUnlockToasts(signedInQuizAttempts);
        renderQuizHistory(signedInQuizAttempts, {
            listElement: quizHistoryList,
            emptyElement: quizHistoryEmpty,
            limit: 100
        });
        populateQuizProfile(signedInQuizAttempts);
        updateQuizUnlockStates(signedInQuizAttempts);
        renderQuizLeaderboard(
            Array.isArray(leaderboardData?.leaderboard) ? leaderboardData.leaderboard : [],
            leaderboardData?.currentUserId || '',
            leaderboardData?.minimumAttempts || 2
        );
        renderQuizPagination();
        renderLabsPagination();
    } catch (error) {
        console.warn('Quiz dashboard data fallback:', error.message || error);
        signedInQuizAttempts = [];
        hasInitializedBadgeUnlocks = false;
        unlockedBadgeSnapshot = new Set();
        renderQuizHistory([], {
            listElement: quizHistoryList,
            emptyElement: quizHistoryEmpty,
            limit: 100
        });
        populateQuizProfile([]);
        updateQuizUnlockStates([]);
        renderQuizLeaderboard([], '', 2);
        renderQuizPagination();
        renderLabsPagination();
    }
}

async function saveSignedInAttempt(result) {
    if (!isLoggedIn()) return null;

    const response = await apiFetch('/api/quiz/attempts', {
        method: 'POST',
        body: JSON.stringify(result)
    });

    return response?.attempt || null;
}

async function saveQuizProfileNote() {
    if (!isLoggedIn() || !quizProfileNoteInput) return;

    const profileNote = quizProfileNoteInput.value.trim().slice(0, 120);
    syncQuizProfileNoteUi(profileNote, 'Saving note...', true);
    if (quizProfileNoteSaveBtn) quizProfileNoteSaveBtn.disabled = true;

    try {
        const response = await apiFetch('/api/auth/profile-note', {
            method: 'PATCH',
            body: JSON.stringify({ profileNote })
        });

        if (response?.user) {
            setStoredUser(response.user);
        }

        syncQuizProfileNoteUi(profileNote, profileNote ? 'Profile note saved.' : 'Profile note cleared.');
    } catch (error) {
        syncQuizProfileNoteUi(profileNote, error.message || 'Could not save profile note.', true);
    } finally {
        if (quizProfileNoteSaveBtn) quizProfileNoteSaveBtn.disabled = !isLoggedIn();
    }
}

function buildQuizAttemptReviewData(quiz, answerRecords = []) {
    return quiz.questions.map((question, questionIndex) => {
        const answerRecord = answerRecords.find((entry) => entry.questionIndex === questionIndex) || {};
        const selectedIndex = Number.isInteger(answerRecord.selected) ? answerRecord.selected : null;
        const correctIndex = Number.isInteger(question.answer) ? question.answer : null;

        return {
            questionIndex,
            topic: question.topic,
            prompt: question.prompt,
            options: Array.isArray(question.options) ? question.options : [],
            selectedIndex,
            correctIndex,
            selectedAnswer: selectedIndex !== null ? question.options[selectedIndex] || '' : '',
            correctAnswer: correctIndex !== null ? question.options[correctIndex] || '' : '',
            isCorrect: selectedIndex !== null && selectedIndex === correctIndex,
            explanation: question.explanation || ''
        };
    });
}

function populateSignedInDashboard(attempts = []) {
    renderQuizHistory(attempts, {
        listElement: quizHistoryList,
        emptyElement: quizHistoryEmpty,
        limit: 100
    });
    populateQuizProfile(attempts);
}

function getQuizRankMeta(pointsCount = 0, averageScore = 0, completedSetsCount = 0) {
    const totalQuizCount = Object.keys(quizzes).length;
    const rankTiers = [
        {
            label: 'Newcomer',
            requirements: []
        },
        {
            label: 'Aware User',
            requirements: [
                { label: 'points', current: pointsCount, target: 80 },
                { label: 'average score', current: averageScore, target: 70 }
            ]
        },
        {
            label: 'Threat Spotter',
            requirements: [
                { label: 'points', current: pointsCount, target: 300 },
                { label: 'completed sets', current: completedSetsCount, target: 4 },
                { label: 'average score', current: averageScore, target: 80 }
            ]
        },
        {
            label: 'Awareness Expert',
            requirements: [
                { label: 'points', current: pointsCount, target: 500 },
                { label: 'average score', current: averageScore, target: 88 }
            ]
        },
        {
            label: 'PhishNet Guardian',
            requirements: [
                { label: 'completed sets', current: completedSetsCount, target: totalQuizCount }
            ]
        }
    ];

    let currentTierIndex = 0;
    for (let index = rankTiers.length - 1; index >= 0; index -= 1) {
        const tier = rankTiers[index];
        const earned = tier.requirements.every((requirement) => requirement.current >= requirement.target);
        if (earned) {
            currentTierIndex = index;
            break;
        }
    }

    const currentTier = rankTiers[currentTierIndex];
    const nextTier = rankTiers[currentTierIndex + 1] || null;
    const progressValue = nextTier
        ? Math.round(
            nextTier.requirements.reduce((total, requirement) => total + Math.min(requirement.current / requirement.target, 1), 0)
            / nextTier.requirements.length
            * 100
        )
        : 100;

    const progressText = !nextTier
        ? 'This user reached the highest awareness rank in the training system.'
        : `Working toward ${nextTier.label}.`;

    return {
        currentTier,
        nextTier,
        progressValue,
        progressText
    };
}

function populateQuizProfile(attempts = []) {
    const earnedPoints = getEarnedQuizPoints(attempts);

    if (quizProfileAttempts) {
        quizProfileAttempts.textContent = String(earnedPoints);
    }
    renderQuizBadges(attempts);
    renderQuizProfileBadges(attempts);

    if (!attempts.length) {
        if (quizProfileAverage) quizProfileAverage.textContent = '--';
        if (quizProfileBest) quizProfileBest.textContent = '0';
        if (quizProfileRank) quizProfileRank.textContent = 'Newcomer';
        if (quizProfileRankProgressFill) quizProfileRankProgressFill.style.width = '0%';
        if (quizProfileRankProgressText) {
            quizProfileRankProgressText.textContent = 'Complete signed-in training sets to begin earning awareness points and rank progress.';
        }
        if (quizProfileCompletedSets) quizProfileCompletedSets.textContent = '0';
        return;
    }

    const averageScore = Math.round(
        attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attempts.length
    );
    const strongResults = getStrongQuizCount(attempts, 85);
    const completedQuizIds = getCompletedQuizIds(attempts);
    if (quizProfileAverage) quizProfileAverage.textContent = `${averageScore}%`;
    if (quizProfileBest) quizProfileBest.textContent = String(strongResults);
    if (quizProfileCompletedSets) {
        quizProfileCompletedSets.textContent = String(completedQuizIds.size);
    }
    const rankMeta = getQuizRankMeta(earnedPoints, averageScore, completedQuizIds.size);

    if (quizProfileRank) {
        quizProfileRank.textContent = rankMeta.currentTier.label;
    }

    if (quizProfileRankProgressFill) {
        quizProfileRankProgressFill.style.width = `${rankMeta.progressValue}%`;
    }

    if (quizProfileRankProgressText) {
        if (!rankMeta.nextTier) {
            quizProfileRankProgressText.textContent = 'You reached the highest awareness rank in the training system.';
        } else {
            const requirementCopy = rankMeta.nextTier.requirements
                .map((requirement) => {
                    if (requirement.label === 'points') return `${requirement.target} points`;
                    if (requirement.label === 'average score') return `${requirement.target}% average`;
                    if (requirement.label === 'completed sets') return `${requirement.target} completed training sets`;
                    return `${requirement.target} ${requirement.label}`;
                })
                .join(' and ');

            quizProfileRankProgressText.textContent = `Work toward ${rankMeta.nextTier.label} by reaching ${requirementCopy}.`;
        }
    }
}

function renderQuizProfileBadges(attempts = []) {
    if (!quizProfileBadgeList) return;

    const unlockedBadges = getQuizBadgeDefinitions(attempts).filter((badge) => badge.earned);

    if (quizProfileUnlockedBadgeCount) {
        quizProfileUnlockedBadgeCount.textContent = `${unlockedBadges.length} unlocked`;
    }

    quizProfileBadgeList.querySelectorAll('.quiz-profile-badge').forEach((item) => item.remove());

    if (!unlockedBadges.length) {
        if (quizProfileBadgeEmpty) quizProfileBadgeEmpty.hidden = false;
        return;
    }

    if (quizProfileBadgeEmpty) quizProfileBadgeEmpty.hidden = true;

    unlockedBadges.forEach((badge) => {
        const item = document.createElement('article');
        item.className = 'quiz-profile-badge is-earned';
        item.innerHTML = `
            <div class="quiz-profile-badge-top">
                <div class="quiz-profile-badge-icon" aria-hidden="true">${badge.icon}</div>
                <div class="quiz-profile-badge-main">
                    <strong>${badge.title}</strong>
                    <span>${badge.difficulty}</span>
                </div>
            </div>
            <p class="quiz-profile-badge-note">${badge.detail}</p>
        `;
        quizProfileBadgeList.appendChild(item);
    });
}

function getQuizBadgeDefinitions(attempts = []) {
    const averageScore = attempts.length
        ? Math.round(attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attempts.length)
        : 0;
    const bestScore = attempts.reduce((best, attempt) => (
        Number(attempt.percentage || 0) > best ? Number(attempt.percentage || 0) : best
    ), 0);
    const uniqueTopics = new Set(attempts.map((attempt) => attempt.quizId)).size;
    const completedQuizIds = getCompletedQuizIds(attempts);
    const earnedPoints = getEarnedQuizPoints(attempts);
    const advancedCompleted = completedQuizIds.has('phishing-scenarios');
    const masteryCompleted = completedQuizIds.has('best-practices');
    const strongAttempts = getStrongQuizCount(attempts, 85);
    const needsReviewCleared = completedQuizIds.size;
    const allQuizIds = Object.keys(quizzes);

    return [
        {
            id: 'first-step',
            title: 'First Step',
            detail: 'Complete your first credited quiz set.',
            earned: completedQuizIds.size >= 1,
            difficulty: 'Starter',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 7v6c0 5 3.84 9.74 9 11 5.16-1.26 9-6 9-11V7l-9-5Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z"/></svg>'
        },
        {
            id: 'practice-streak',
            title: 'Practice Streak',
            detail: 'Earn at least 180 training points.',
            earned: earnedPoints >= 180,
            difficulty: 'Starter',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>'
        },
        {
            id: 'steady-learner',
            title: 'Steady Learner',
            detail: 'Earn at least 300 training points.',
            earned: earnedPoints >= 300,
            difficulty: 'Starter',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14v2H5V4Zm0 7h10v2H5v-2Zm0 7h14v2H5v-2Zm12-8h2v8h-2v-8Z"/></svg>'
        },
        {
            id: 'sharp-eye',
            title: 'Sharp Eye',
            detail: 'Reach a best score of 90% or higher.',
            earned: bestScore >= 90,
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.6Z"/></svg>'
        },
        {
            id: 'steady-awareness',
            title: 'Steady Awareness',
            detail: 'Maintain an average score of 75% or higher after earning points from at least 2 quiz sets.',
            earned: averageScore >= 75 && completedQuizIds.size >= 2,
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h3v4H3v-4Zm5-7h3v11H8V10Zm5 3h3v8h-3v-8Zm5-10h3v18h-3V3Z"/></svg>'
        },
        {
            id: 'topic-explorer',
            title: 'Topic Explorer',
            detail: 'Try at least 3 different quiz sets.',
            earned: uniqueTopics >= 3,
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"/></svg>'
        },
        {
            id: 'full-coverage',
            title: 'Full Coverage',
            detail: 'Complete the full core quiz path.',
            earned: coreQuizIds.every((quizId) => completedQuizIds.has(quizId)),
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.41-1.41L11 9.17l4.59-4.58L17 6l-6 6Z"/></svg>'
        },
        {
            id: 'strong-finisher',
            title: 'Strong Finisher',
            detail: 'Earn at least 3 strong quiz results of 85% or higher.',
            earned: strongAttempts >= 3,
            difficulty: 'Advanced',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 9.5 7.2 4 8l4 3.9-.94 5.5L12 14.9l4.94 2.5-.94-5.5 4-3.9-5.5-.8L12 2Z"/></svg>'
        },
        {
            id: 'review-crusher',
            title: 'Review Crusher',
            detail: 'Earn credit in all 30 quiz sets.',
            earned: needsReviewCleared >= 30,
            difficulty: 'Advanced',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5H5v14h14V5Zm-8 11-4-4 1.4-1.4 2.6 2.58 4.6-4.59L17 10l-6 6Z"/></svg>'
        },
        {
            id: 'scenario-survivor',
            title: 'Scenario Survivor',
            detail: 'Finish the Phishing Scenarios quiz set.',
            earned: advancedCompleted,
            difficulty: 'Advanced',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3h-2V2Zm6.36 2.64 1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM4.22 6.05l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM12 7a5 5 0 0 0-5 5c0 1.74.89 3.27 2.23 4.17L8 22h8l-1.23-5.83A4.98 4.98 0 0 0 17 12a5 5 0 0 0-5-5Z"/></svg>'
        },
        {
            id: 'mastery-unlocked',
            title: 'Mastery Unlocked',
            detail: 'Finish the Best Practices capstone set.',
            earned: masteryCompleted,
            difficulty: 'Hard',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-4Zm3.54 8.46-4.25 4.25-2.12-2.12-1.41 1.41 3.53 3.54 5.66-5.66-1.41-1.42Z"/></svg>'
        },
        {
            id: 'guardian-grade',
            title: 'Guardian Grade',
            detail: 'Maintain an average score of 88% or higher after earning at least 500 training points.',
            earned: averageScore >= 88 && earnedPoints >= 500,
            difficulty: 'Hard',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.25 3.44 10.14 8 11.76 4.56-1.62 8-6.51 8-11.76V5l-8-3Zm-1 15-3.5-3.5 1.41-1.41L11 14.17l4.59-4.58L17 11l-6 6Z"/></svg>'
        },
        {
            id: 'phishnet-complete',
            title: 'PhishNet Complete',
            detail: 'Save at least one completed attempt for every quiz set in the library.',
            earned: allQuizIds.every((quizId) => completedQuizIds.has(quizId)),
            difficulty: 'Hard',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 8.16-4.08A3 3 0 0 1 21 10.4V17h-2v-5.6l-7 3.5L2 10v7l10 5 6-3v2.2L12 24 0 18V7l12-5Z"/></svg>'
        }
    ];
}

function getQuizBadgeIconMarkup(badgeId = '') {
    const iconMap = {
        'first-step': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 7v6c0 5 3.84 9.74 9 11 5.16-1.26 9-6 9-11V7l-9-5Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z"/></svg>',
        'practice-streak': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
        'sharp-eye': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.6Z"/></svg>',
        'steady-awareness': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h3v4H3v-4Zm5-7h3v11H8V10Zm5 3h3v8h-3v-8Zm5-10h3v18h-3V3Z"/></svg>',
        'steady-learner': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14v2H5V4Zm0 7h10v2H5v-2Zm0 7h14v2H5v-2Zm12-8h2v8h-2v-8Z"/></svg>',
        'topic-explorer': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"/></svg>',
        'full-coverage': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.41-1.41L11 9.17l4.59-4.58L17 6l-6 6Z"/></svg>',
        'strong-finisher': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 9.5 7.2 4 8l4 3.9-.94 5.5L12 14.9l4.94 2.5-.94-5.5 4-3.9-5.5-.8L12 2Z"/></svg>',
        'review-crusher': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5H5v14h14V5Zm-8 11-4-4 1.4-1.4 2.6 2.58 4.6-4.59L17 10l-6 6Z"/></svg>',
        'scenario-survivor': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3h-2V2Zm6.36 2.64 1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM4.22 6.05l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM12 7a5 5 0 0 0-5 5c0 1.74.89 3.27 2.23 4.17L8 22h8l-1.23-5.83A4.98 4.98 0 0 0 17 12a5 5 0 0 0-5-5Z"/></svg>',
        'mastery-unlocked': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-4Zm3.54 8.46-4.25 4.25-2.12-2.12-1.41 1.41 3.53 3.54 5.66-5.66-1.41-1.42Z"/></svg>',
        'guardian-grade': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.25 3.44 10.14 8 11.76 4.56-1.62 8-6.51 8-11.76V5l-8-3Zm-1 15-3.5-3.5 1.41-1.41L11 14.17l4.59-4.58L17 11l-6 6Z"/></svg>',
        'phishnet-complete': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 8.16-4.08A3 3 0 0 1 21 10.4V17h-2v-5.6l-7 3.5L2 10v7l10 5 6-3v2.2L12 24 0 18V7l12-5Z"/></svg>'
    };

    return iconMap[badgeId] || '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z"/></svg>';
}

function getUnlockedBadgeMap(attempts = []) {
    return new Map(
        getQuizBadgeDefinitions(attempts)
            .filter((badge) => badge.earned)
            .map((badge) => [badge.id, badge])
    );
}

function showNextAchievementToast() {
    if (!quizAchievementStack || activeAchievementToast || !achievementToastQueue.length) return;

    const badge = achievementToastQueue.shift();
    const toast = document.createElement('article');
    toast.className = 'quiz-achievement-toast';
    toast.innerHTML = `
        <div class="quiz-achievement-icon" aria-hidden="true">${badge.icon || getQuizBadgeIconMarkup(badge.id)}</div>
        <div class="quiz-achievement-copy">
            <span class="quiz-achievement-kicker">Badge Unlocked</span>
            <strong>${badge.title}</strong>
            <p>${badge.detail}</p>
        </div>
    `;

    quizAchievementStack.appendChild(toast);
    activeAchievementToast = toast;

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });

    window.setTimeout(() => {
        toast.classList.remove('is-visible');
        window.setTimeout(() => {
            toast.remove();
            if (activeAchievementToast === toast) {
                activeAchievementToast = null;
            }
            showNextAchievementToast();
        }, 220);
    }, 4200);
}

function queueBadgeUnlockToasts(badges = []) {
    if (!Array.isArray(badges) || !badges.length) return;
    achievementToastQueue.push(...badges);
    showNextAchievementToast();
}

function syncBadgeUnlockToasts(attempts = []) {
    const unlockedBadgeMap = getUnlockedBadgeMap(attempts);
    const currentUnlockedIds = new Set(unlockedBadgeMap.keys());

    if (!hasInitializedBadgeUnlocks) {
        unlockedBadgeSnapshot = currentUnlockedIds;
        hasInitializedBadgeUnlocks = true;
        return;
    }

    const newlyUnlockedBadges = [...currentUnlockedIds]
        .filter((badgeId) => !unlockedBadgeSnapshot.has(badgeId))
        .map((badgeId) => unlockedBadgeMap.get(badgeId))
        .filter(Boolean);

    unlockedBadgeSnapshot = currentUnlockedIds;

    if (newlyUnlockedBadges.length) {
        queueBadgeUnlockToasts(newlyUnlockedBadges);
    }
}

function createPlaceholderQuizCards() {
    if (!quizGrid) return;

    const desiredCardCount = totalQuizPages * maxAdaptiveQuizCardsPerPage;
    const placeholdersNeeded = Math.max(0, desiredCardCount - quizCards.length);
    const placeholderSeries = Array.from({ length: placeholdersNeeded }, (_, index) => (
        index < 6
            ? {
                label: 'Elite Series',
                accentClass: 'is-elite',
                title: 'Elite Set',
                difficulty: 'Elite'
            }
            : index < 12
            ? {
                label: 'Expert Series',
                accentClass: 'is-expert',
                title: 'Expert Set',
                difficulty: 'Expert'
            }
            : index < 18
            ? {
                label: 'Pro Series',
                accentClass: 'is-pro',
                title: 'Pro Set',
                difficulty: 'Pro'
            }
            : index < 24
            ? {
                label: 'Legend Series',
                accentClass: 'is-legend',
                title: 'Legend Set',
                difficulty: 'Legend'
            }
            : {
                label: 'Apex Series',
                accentClass: 'is-apex',
                title: 'Apex Set',
                difficulty: 'Apex'
            }
    ));

    for (let index = 0; index < placeholdersNeeded; index += 1) {
        const seriesConfig = placeholderSeries[index] || {
            label: 'Coming Soon',
            accentClass: '',
            title: 'Upcoming Quiz Set',
            difficulty: 'Soon'
        };
        const placeholderId = `placeholder-extra-${index + 1}`;
        const card = document.createElement('article');
        card.className = `quiz-card quiz-card-placeholder is-locked ${seriesConfig.accentClass}`.trim();
        card.dataset.quizCard = placeholderId;
        card.innerHTML = `
            <div class="quiz-card-header">
                <span class="quiz-badge">${seriesConfig.label}</span>
            </div>
            <h3>${seriesConfig.title} ${index + 1}</h3>
            <p>Higher-tier phishing challenge sets will appear here as the training path expands into tougher, prestige-level stages.</p>
            <div class="quiz-meta">
                <span>New Set</span>
                <span>Preview</span>
                <span class="difficulty">${seriesConfig.difficulty}</span>
            </div>
            <button type="button" class="quiz-start-btn" disabled>Coming Soon</button>
        `;
        quizGrid.appendChild(card);
        quizCards.push(card);
    }
}

function createPlaceholderLabCards() {
    if (!labsGrid) return;

    const cardsPerPage = maxAdaptiveQuizCardsPerPage;
    const desiredCardCount = totalLabPages * cardsPerPage;
    const placeholdersNeeded = Math.max(0, desiredCardCount - labCards.length);
    const placeholderSeries = Array.from({ length: placeholdersNeeded }, (_, index) => {
        if (index < 5) {
            return {
                label: 'Core Lab',
                accentClass: 'is-core',
                title: 'Upcoming Core Lab',
                difficulty: 'Beginner'
            };
        }

        if (index < 11) {
            return {
                label: 'Skill Builder Lab',
                accentClass: 'is-skill-builder',
                title: 'Upcoming Skill Builder Lab',
                difficulty: 'Intermediate'
            };
        }

        if (index < 17) {
            return {
                label: 'Challenger Lab',
                accentClass: 'is-challenger',
                title: 'Upcoming Challenger Lab',
                difficulty: 'Hard'
            };
        }

        if (index < 23) {
            return {
                label: 'Advanced Lab',
                accentClass: 'is-advanced',
                title: 'Upcoming Advanced Lab',
                difficulty: 'Advanced'
            };
        }

        if (index < 29) {
            return {
                label: 'Mastery Lab',
                accentClass: 'is-mastery',
                title: 'Upcoming Mastery Lab',
                difficulty: 'Mastery'
            };
        }

        if (index < 35) {
            return {
                label: 'Elite Lab',
                accentClass: 'is-elite',
                title: 'Upcoming Elite Lab',
                difficulty: 'Elite'
            };
        }

        if (index < 41) {
            return {
                label: 'Expert Lab',
                accentClass: 'is-expert',
                title: 'Upcoming Expert Lab',
                difficulty: 'Expert'
            };
        }

        if (index < 47) {
            return {
                label: 'Pro Lab',
                accentClass: 'is-pro',
                title: 'Upcoming Pro Lab',
                difficulty: 'Pro'
            };
        }

        if (index < 53) {
            return {
                label: 'Legend Lab',
                accentClass: 'is-legend',
                title: 'Upcoming Legend Lab',
                difficulty: 'Legend'
            };
        }

        return {
            label: 'Apex Lab',
            accentClass: 'is-apex',
            title: 'Upcoming Apex Lab',
            difficulty: 'Apex'
        };
    });

    for (let index = 0; index < placeholdersNeeded; index += 1) {
        const seriesConfig = placeholderSeries[index] || {
            label: 'Lab Coming Soon',
            accentClass: '',
            title: 'Upcoming Lab',
            difficulty: 'Soon'
        };
        const placeholderId = `placeholder-lab-${index + 1}`;
        const card = document.createElement('article');
        card.className = `quiz-card quiz-card-placeholder is-locked ${seriesConfig.accentClass}`.trim();
        card.dataset.labCard = placeholderId;
        card.innerHTML = `
            <div class="quiz-card-header">
                <span class="quiz-badge">${seriesConfig.label}</span>
            </div>
            <h3>${seriesConfig.title} ${index + 1}</h3>
            <p>More hands-on phishing labs will appear here as we expand the practical training path with guided scenarios and inspection challenges.</p>
            <div class="quiz-meta">
                <span>New Lab</span>
                <span>Preview</span>
                <span class="difficulty ${seriesConfig.difficulty.toLowerCase().replace(/\s+/g, '-')}">${seriesConfig.difficulty}</span>
            </div>
            <button type="button" class="quiz-start-btn" disabled>Coming Soon</button>
        `;
        labsGrid.appendChild(card);
        labCards.push(card);
    }
}

function reorderQuizCardsForPagination() {
    if (!quizGrid || !quizCards.length) return;

    const priorityOrder = [
        'url-basics',
        'login-page-clues',
        'message-red-flags',
        'after-clicking',
        'qr-link-safety',
        'social-media-scams',
        'sender-source-checks',
        'attachment-download-safety',
        'account-recovery-traps',
        'form-data-requests',
        'payment-delivery-scams',
        'support-impersonation',
        'scholarship-bait',
        'document-sharing-traps',
        'mobile-alert-deception',
        'event-registration-risks',
        'marketplace-meetup-scams',
        'multi-step-phish-cases',
        'campus-portal-spoofs',
        'urgent-admin-fraud',
        'cloud-drive-compromise',
        'internship-hiring-scams',
        'verification-chain-attacks',
        'phishing-scenarios',
        'executive-impersonation',
        'breach-followup-scams',
        'recovery-flow-attacks',
        'financial-approval-fraud',
        'cross-channel-takeovers',
        'best-practices'
    ];

    const orderedCards = [];
    const seen = new Set();

    priorityOrder.forEach((cardId) => {
        const card = quizCards.find((item) => item.dataset.quizCard === cardId);
        if (card) {
            orderedCards.push(card);
            seen.add(card);
        }
    });

    quizCards.forEach((card) => {
        if (!seen.has(card)) {
            orderedCards.push(card);
        }
    });

    quizCards.length = 0;
    orderedCards.forEach((card) => {
        quizCards.push(card);
        quizGrid.appendChild(card);
    });
}

function hasCompletedCoreQuizPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return coreQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function hasCompletedSkillBuilderPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return skillBuilderQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function hasCompletedChallengerPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return challengerQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function hasCompletedAdvancedPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return advancedSeriesQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function getHighestAccessibleQuizPage(attempts = []) {
    if (!hasCompletedCoreQuizPath(attempts)) return 1;
    if (!hasCompletedSkillBuilderPath(attempts)) return 2;
    if (!hasCompletedChallengerPath(attempts)) return 3;
    if (!hasCompletedAdvancedPath(attempts)) return 4;
    return totalQuizPages;
}

function renderQuizPagination() {
    if (!quizPagination || !quizCards.length) return;
    const quizLibraryToolbar = document.getElementById('quizLibraryToolbar');
    const cardsPerPage = getQuizCardsPerPage();
    const guestPreviewCard = getGuestPreviewCard('quizzes');

    if (!isLoggedIn()) {
        quizCards.forEach((card, index) => {
            card.hidden = index >= guestQuizCardsPreviewCount;
        });
        if (guestPreviewCard) guestPreviewCard.hidden = false;
        quizPagination.innerHTML = '';
        quizPagination.hidden = true;
        if (quizLibraryToolbar) quizLibraryToolbar.hidden = true;
        return;
    }

    if (guestPreviewCard) guestPreviewCard.hidden = true;
    quizPagination.hidden = false;
    if (quizLibraryToolbar) quizLibraryToolbar.hidden = false;

    const totalPages = Math.max(totalQuizPages, Math.ceil(quizCards.length / cardsPerPage));
    currentQuizPage = Math.min(Math.max(currentQuizPage, 1), totalPages);

    quizCards.forEach((card, index) => {
        const pageNumber = Math.floor(index / cardsPerPage) + 1;
        card.hidden = pageNumber !== currentQuizPage;
    });

    quizPagination.innerHTML = '';

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `quiz-page-tab${pageNumber === currentQuizPage ? ' is-active' : ''}`;
        button.textContent = String(pageNumber);
        button.setAttribute('aria-label', `Show quiz page ${pageNumber}`);
        if (pageNumber === currentQuizPage) {
            button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
            currentQuizPage = pageNumber;
            renderQuizPagination();
            quizzesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        quizPagination.appendChild(button);
    }
}

function renderLabsPagination() {
    if (!labsPagination || !labCards.length) return;
    const labsLibraryToolbar = document.getElementById('labsLibraryToolbar');
    const cardsPerPage = getQuizCardsPerPage();
    const guestPreviewCard = getGuestPreviewCard('labs');

    if (!isLoggedIn()) {
        labCards.forEach((card, index) => {
            card.hidden = index >= guestQuizCardsPreviewCount;
        });
        if (guestPreviewCard) guestPreviewCard.hidden = false;
        labsPagination.innerHTML = '';
        labsPagination.hidden = true;
        if (labsLibraryToolbar) labsLibraryToolbar.hidden = true;
        return;
    }

    if (guestPreviewCard) guestPreviewCard.hidden = true;
    const totalPages = Math.max(totalLabPages, Math.ceil(labCards.length / cardsPerPage));
    currentLabPage = Math.min(Math.max(currentLabPage, 1), totalPages);

    labCards.forEach((card, index) => {
        const pageNumber = Math.floor(index / cardsPerPage) + 1;
        card.hidden = pageNumber !== currentLabPage;
    });

    labsPagination.hidden = false;
    if (labsLibraryToolbar) labsLibraryToolbar.hidden = false;
    labsPagination.innerHTML = '';

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `quiz-page-tab${pageNumber === currentLabPage ? ' is-active' : ''}`;
        button.textContent = String(pageNumber);
        button.setAttribute('aria-label', `Show lab page ${pageNumber}`);
        if (pageNumber === currentLabPage) {
            button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
            currentLabPage = pageNumber;
            renderLabsPagination();
            labsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        labsPagination.appendChild(button);
    }
}

function renderQuizBadges(attempts = []) {
    if (!quizBadgesList) return;

    const badges = getQuizBadgeDefinitions(attempts);
    const unlockedCount = badges.filter((badge) => badge.earned).length;
    const hardCount = badges.filter((badge) => badge.difficulty === 'Hard' && badge.earned).length;

    if (quizBadgeUnlockedCount) quizBadgeUnlockedCount.textContent = String(unlockedCount);
    if (quizBadgeHardCount) quizBadgeHardCount.textContent = String(hardCount);
    if (quizBadgeTotalCount) quizBadgeTotalCount.textContent = String(badges.length);

    quizBadgesList.querySelectorAll('.quiz-profile-badge').forEach((item) => item.remove());

    if (!badges.some((badge) => badge.earned)) {
        if (quizBadgesEmpty) quizBadgesEmpty.hidden = false;
    } else if (quizBadgesEmpty) {
        quizBadgesEmpty.hidden = true;
    }

    badges.forEach((badge) => {
        const item = document.createElement('article');
        item.className = `quiz-profile-badge ${badge.earned ? 'is-earned' : 'is-locked'}`;
        item.innerHTML = `
            <div class="quiz-profile-badge-top">
                <div class="quiz-profile-badge-icon" aria-hidden="true">${badge.icon}</div>
                <div class="quiz-profile-badge-main">
                    <strong>${badge.title}</strong>
                    <span>${badge.earned ? 'Unlocked' : 'Locked'} · ${badge.difficulty}</span>
                </div>
            </div>
            <p class="quiz-profile-badge-note">${badge.detail}</p>
        `;
        quizBadgesList.appendChild(item);
    });
}

function renderQuizHistory(attempts, options = {}) {
    const {
        badgeElement = null,
        listElement = quizHistoryList,
        emptyElement = quizHistoryEmpty,
        limit = 6,
        compact = false
    } = options;

    if (!listElement) return;

    if (badgeElement) {
        badgeElement.textContent = `${attempts.length} attempt${attempts.length === 1 ? '' : 's'}`;
    }

    if (!attempts.length) {
        if (emptyElement) emptyElement.hidden = false;
        listElement.querySelectorAll('.quiz-history-item').forEach((item) => item.remove());
        if (listElement === quizHistoryList) {
            if (quizHistoryToggleBtn) quizHistoryToggleBtn.hidden = true;
        }
        return;
    }

    if (emptyElement) emptyElement.hidden = true;
    listElement.querySelectorAll('.quiz-history-item').forEach((item) => item.remove());

    attempts.slice(0, limit).forEach((attempt) => {
        const percentage = Math.round(Number(attempt.percentage || 0));
        const statusLabel = percentage >= 90
            ? 'Strong'
            : percentage >= 75
                ? 'Improving'
                : 'Needs Review';
        const item = document.createElement('article');
        const historyBandClass = percentage >= 90
            ? 'is-strong'
            : percentage >= 75
                ? 'is-improving'
                : 'is-needs-review';
        item.className = `quiz-history-item is-clickable ${historyBandClass}`;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.innerHTML = `
            <div class="quiz-history-main">
                <strong>${attempt.quizTitle}</strong>
                <span>${new Date(attempt.createdAt).toLocaleDateString()} - ${attempt.score}/${attempt.totalQuestions} correct</span>
            </div>
            <div class="quiz-history-side">
                <span class="quiz-history-status ${statusLabel.toLowerCase().replace(/\s+/g, '-')}">${statusLabel}</span>
                ${compact ? '' : '<span class="quiz-history-review-hint">View Review</span>'}
                <div class="quiz-history-score-wrap">
                    <span class="quiz-history-score">${percentage}%</span>
                    ${compact ? '' : '<span class="quiz-history-arrow" aria-hidden="true">&rsaquo;</span>'}
                </div>
            </div>
        `;
        item.addEventListener('click', () => openQuizAttemptReview(attempt.id));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openQuizAttemptReview(attempt.id);
            }
        });
            listElement.appendChild(item);
        });

    if (listElement === quizHistoryList && quizHistoryToggleBtn) {
        quizHistoryToggleBtn.hidden = true;
    }
}

async function openQuizAttemptReview(attemptId) {
    if (!attemptId || !quizAttemptReviewOverlay || !quizAttemptReviewBody) return;

    quizAttemptReviewOverlay.hidden = false;
    document.body.classList.add('modal-open');
    quizAttemptReviewBody.innerHTML = `
        <div class="quiz-history-empty">
            <strong>Loading attempt</strong>
            <p>Please wait while we load the quiz review.</p>
        </div>
    `;

    try {
        const data = await apiFetch(`/api/quiz/attempts/${attemptId}`);
        renderQuizAttemptReview(data?.attempt || null);
    } catch (error) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Could not load attempt</strong>
                <p>${escapeHtml(error.message || 'Please try again.')}</p>
            </div>
        `;
    }
}

function closeQuizAttemptReview() {
    if (!quizAttemptReviewOverlay) return;
    quizAttemptReviewOverlay.hidden = true;
    document.body.classList.remove('modal-open');
}

function renderQuizAttemptReview(attempt) {
    if (!quizAttemptReviewBody) return;
    if (!attempt) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Attempt not available</strong>
                <p>The quiz review could not be loaded right now.</p>
            </div>
        `;
        return;
    }

    const reviewData = Array.isArray(attempt.reviewData) ? attempt.reviewData : [];
    if (!reviewData.length) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>No review data for this attempt</strong>
                <p>This attempt was saved before answer review was enabled. New attempts will show full right and wrong breakdowns here.</p>
            </div>
        `;
        return;
    }

    quizAttemptReviewBody.innerHTML = `
        <div class="quiz-attempt-review-summary">
            <div class="quiz-attempt-review-score">
                <span class="quiz-attempt-review-score-label">Score</span>
                <strong>${escapeHtml(Math.round(attempt.percentage))}%</strong>
            </div>
            <div class="quiz-attempt-review-copy">
                <p class="quiz-dashboard-kicker">Saved Result</p>
                <h4>${escapeHtml(attempt.quizTitle)}</h4>
                <p>${escapeHtml(`${attempt.score}/${attempt.totalQuestions} correct`)}</p>
                <span class="quiz-attempt-review-date">${escapeHtml(new Date(attempt.createdAt).toLocaleDateString())}</span>
            </div>
        </div>
        <div class="quiz-attempt-review-list">
            ${reviewData.map((item, index) => `
                <article class="quiz-attempt-review-item ${item.isCorrect ? 'is-correct' : 'is-incorrect'}">
                    <div class="quiz-attempt-review-head">
                        <div>
                            <p class="quiz-dashboard-kicker">Question ${index + 1}${item.topic ? ` - ${escapeHtml(item.topic)}` : ''}</p>
                            <h5>${escapeHtml(item.prompt || 'Question')}</h5>
                        </div>
                        <span class="quiz-attempt-review-status">${item.isCorrect ? 'Correct' : 'Review Needed'}</span>
                    </div>
                    <div class="quiz-attempt-review-answer-grid">
                        <div class="quiz-attempt-review-answer-card is-selected">
                            <span class="quiz-attempt-review-answer-label">Your Answer</span>
                            <strong>${escapeHtml(
                                Array.isArray(item.options) && Number.isInteger(item.selectedIndex)
                                    ? item.options[item.selectedIndex] || 'No answer selected'
                                    : 'No answer selected'
                            )}</strong>
                        </div>
                        <div class="quiz-attempt-review-answer-card is-correct">
                            <span class="quiz-attempt-review-answer-label">Correct Answer</span>
                            <strong>${escapeHtml(
                                Array.isArray(item.options) && Number.isInteger(item.correctIndex)
                                    ? item.options[item.correctIndex] || 'Correct answer unavailable'
                                    : 'Correct answer unavailable'
                            )}</strong>
                        </div>
                    </div>
                    ${item.explanation ? `
                        <div class="quiz-attempt-review-explanation">
                            <span class="quiz-attempt-review-answer-label">Why</span>
                            <p>${escapeHtml(item.explanation)}</p>
                        </div>
                    ` : ''}
                </article>
            `).join('')}
        </div>
    `;
}

function renderQuizLeaderboard(entries, currentUserId, minimumAttempts = 2) {
    if (!quizLeaderboardList) return;

    if (!entries.length) {
        if (quizLeaderboardEmpty) quizLeaderboardEmpty.hidden = false;
        const heading = quizLeaderboardEmpty.querySelector('strong');
        const copy = quizLeaderboardEmpty.querySelector('p');
        if (heading) heading.textContent = 'No leaderboard data yet';
        if (copy) copy.textContent = `The leaderboard appears once users have at least ${minimumAttempts} saved quiz attempts.`;
        quizLeaderboardList.querySelectorAll('.quiz-leaderboard-item').forEach((item) => item.remove());
        return;
    }

    if (quizLeaderboardEmpty) quizLeaderboardEmpty.hidden = true;
    quizLeaderboardList.querySelectorAll('.quiz-leaderboard-item').forEach((item) => item.remove());

    entries.forEach((entry) => {
        const item = document.createElement('article');
        item.className = 'quiz-leaderboard-item is-clickable';
        if (entry.rank === 1) item.classList.add('is-rank-1');
        if (entry.rank === 2) item.classList.add('is-rank-2');
        if (entry.rank === 3) item.classList.add('is-rank-3');
        if (currentUserId && entry.userId === currentUserId) {
            item.classList.add('is-current-user');
        }
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        item.innerHTML = `
            <div class="quiz-leaderboard-rank">#${entry.rank}</div>
            <div class="quiz-leaderboard-main">
                <strong>${entry.name}</strong>
                <span>${entry.earnedPoints || 0} pts - ${entry.completedSetsCount || 0} completed</span>
            </div>
            <div class="quiz-leaderboard-score-wrap">
                <span class="quiz-leaderboard-score-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3 9.5 8H4l4.2 4.1-.99 5.79L12 15.2l4.79 2.69L15.8 12 20 8h-5.5L12 3Z"/>
                    </svg>
                </span>
                <div class="quiz-leaderboard-score-block">
                    <span class="quiz-leaderboard-score-label">Average Score</span>
                    <div class="quiz-leaderboard-score">${Math.round(entry.averageScore)}%</div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => openPublicQuizProfile(entry.userId));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPublicQuizProfile(entry.userId);
            }
        });
        quizLeaderboardList.appendChild(item);
    });
}

async function openPublicQuizProfile(userId) {
    if (!quizPublicProfileOverlay || !quizPublicProfileBody || !userId) return;

    quizPublicProfileOverlay.hidden = false;
    document.body.classList.add('modal-open');
    quizPublicProfileBody.innerHTML = `
        <div class="quiz-history-empty">
            <strong>Loading profile</strong>
            <p>Please wait while we load the public quiz stats.</p>
        </div>
    `;

    try {
        const data = await apiFetch(`/api/quiz/public-profile/${userId}`);
        renderPublicQuizProfile(data?.profile || null);
    } catch (error) {
        quizPublicProfileBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Could not load profile</strong>
                <p>${escapeHtml(error.message || 'Please try again.')}</p>
            </div>
        `;
    }
}

function closePublicQuizProfile() {
    if (!quizPublicProfileOverlay) return;
    quizPublicProfileOverlay.hidden = true;
    document.body.classList.remove('modal-open');
}

function renderPublicQuizProfile(profile) {
    if (!quizPublicProfileBody) return;
    if (!profile) {
        quizPublicProfileBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Profile not available</strong>
                <p>The public quiz profile could not be loaded right now.</p>
            </div>
        `;
        return;
    }

    const lastAttempt = profile.lastAttemptAt
        ? new Date(profile.lastAttemptAt).toLocaleDateString()
        : 'No attempts yet';

    const badges = Array.isArray(profile.badges) ? profile.badges : [];
    const unlockedBadges = badges.filter((badge) => badge.earned);
    const topics = Array.isArray(profile.topics) ? profile.topics : [];
    const completedSetsCount = topics.length;
    const rankMeta = getQuizRankMeta(profile.earnedPoints || 0, Math.round(profile.averageScore || 0), completedSetsCount);
    const note = String(profile.profileNote || '').trim();
    const shouldCollapseBadges = unlockedBadges.length > 6;

    quizPublicProfileBody.innerHTML = `
        <div class="quiz-public-profile-grid">
            <div class="quiz-public-profile-summary">
                <section class="quiz-public-profile-hero">
                    <div class="quiz-public-profile-top">
                        <div class="quiz-public-profile-head">
                            <div class="quiz-public-profile-avatar" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="quiz-dashboard-kicker">Public Profile</p>
                                <h4>${escapeHtml(profile.name)}</h4>
                                <p class="quiz-public-profile-subtext">Last saved attempt: ${escapeHtml(lastAttempt)}</p>
                            </div>
                        </div>
                        <span class="quiz-public-profile-rank-chip">${escapeHtml(rankMeta.currentTier.label)}</span>
                    </div>

                    <div class="quiz-public-profile-rank-meter">
                        <div class="quiz-public-profile-rank-meter-bar" aria-hidden="true">
                            <span style="width: ${Math.max(0, Math.min(100, rankMeta.progressValue))}%"></span>
                        </div>
                        <p class="quiz-public-profile-rank-copy">${escapeHtml(rankMeta.progressText)}</p>
                    </div>

                    <div class="quiz-public-profile-note">
                        <span class="quiz-public-profile-note-label">About</span>
                        <p>${escapeHtml(note || 'This user has not added a public profile note yet.')}</p>
                    </div>

                        <div class="quiz-public-profile-stat-grid">
                            <div class="quiz-public-profile-stat">
                                <span>Earned Points</span>
                                <strong>${escapeHtml(profile.earnedPoints || 0)}</strong>
                            </div>
                        <div class="quiz-public-profile-stat">
                            <span>Average Score</span>
                            <strong>${escapeHtml(Math.round(profile.averageScore || 0))}%</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>85%+ Results</span>
                            <strong>${escapeHtml(profile.strongResultsCount || 0)}</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>Complete</span>
                            <strong>${escapeHtml(completedSetsCount || 0)}</strong>
                        </div>
                    </div>
                </section>

                <section class="quiz-public-profile-card">
                    <div class="quiz-history-heading">
                        <div>
                            <p class="quiz-dashboard-kicker">Earned Badges</p>
                            <h3>Awareness Milestones</h3>
                        </div>
                        <span class="quiz-history-badge">${unlockedBadges.length} unlocked</span>
                    </div>
                    <div class="quiz-public-profile-badges ${shouldCollapseBadges ? 'is-collapsed' : ''}" id="quizPublicProfileBadges">
                        ${unlockedBadges.length ? unlockedBadges.map((badge) => `
                            <article
                                class="quiz-public-profile-badge ${badge.earned ? 'is-earned' : ''}"
                                title="${escapeHtml(`${badge.title} - ${badge.earned ? 'Unlocked' : 'Locked'}`)}"
                                aria-label="${escapeHtml(`${badge.title} - ${badge.earned ? 'Unlocked' : 'Locked'}`)}"
                            >
                                <span class="quiz-public-profile-badge-icon" aria-hidden="true">${getQuizBadgeIconMarkup(badge.id)}</span>
                            </article>
                        `).join('') : `
                            <div class="quiz-history-empty">
                                <strong>No public badges yet</strong>
                                <p>This user has not unlocked any public awareness badges yet.</p>
                            </div>
                        `}
                    </div>
                    ${shouldCollapseBadges ? `
                        <div class="quiz-public-profile-badge-actions">
                            <button type="button" class="quiz-history-toggle-btn" id="quizPublicProfileBadgesToggleBtn">See More</button>
                        </div>
                    ` : ''}
                </section>
            </div>
        </div>
    `;

    const badgesToggleBtn = document.getElementById('quizPublicProfileBadgesToggleBtn');
    const badgesWrap = document.getElementById('quizPublicProfileBadges');

    badgesToggleBtn?.addEventListener('click', () => {
        const isExpanded = badgesWrap?.classList.toggle('is-expanded');
        badgesToggleBtn.textContent = isExpanded ? 'Show Less' : 'See More';
    });
}

function getScoreSummary(percentage) {
    if (percentage >= 90) {
        return 'Strong awareness. You consistently noticed the safer choices in these phishing-related situations.';
    }
    if (percentage >= 75) {
        return 'Good awareness overall. You caught most of the warning signs, but a few situations still need more caution.';
    }
    if (percentage >= 50) {
        return 'Fair start. You noticed some phishing signals, but more practice will help you react more safely.';
    }
    return 'This quiz needs another pass. Focus on checking links carefully, verifying requests, and slowing down before acting.';
}

function getQuizGradeClass(grade) {
    return `grade-${String(grade || 'f').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function updateWorkspaceVisibility(showResults = false) {
    if (!quizWorkspace) return;
    quizWorkspace.hidden = false;
    quizQuestionCard.hidden = showResults;
    quizResultCard.hidden = !showResults;
}

function scrollToWorkspace() {
    scrollToQuizSection('quizWorkspace');
}

function renderQuestion() {
    const quiz = quizzes[currentQuizId];
    const question = quiz?.questions[currentQuestionIndex];
    if (!quiz || !question) return;

    selectedAnswerIndex = null;
    quizSessionTitle.textContent = quiz.title;
    quizSessionDesc.textContent = quiz.description;
    quizQuestionTopic.textContent = `${quiz.title} - ${question.topic}`;
    quizQuestionText.textContent = question.prompt;
    quizQuestionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
    quizProgressFill.style.width = `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`;
    quizFeedback.hidden = true;
    quizFeedback.innerHTML = '';
    quizNextBtn.disabled = true;
    quizNextBtn.textContent = currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question';

    quizOptions.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';
        button.innerHTML = `
            <span class="quiz-option-key">${String.fromCharCode(65 + optionIndex)}</span>
            <span class="quiz-option-text">${option}</span>
        `;
        button.addEventListener('click', () => handleAnswerSelection(optionIndex));
        quizOptions.appendChild(button);
    });

    updateWorkspaceVisibility(false);
}

function handleAnswerSelection(optionIndex) {
    if (selectedAnswerIndex !== null) return;

    const quiz = quizzes[currentQuizId];
    const question = quiz.questions[currentQuestionIndex];
    const optionButtons = [...quizOptions.querySelectorAll('.quiz-option')];
    selectedAnswerIndex = optionIndex;

    const isCorrect = optionIndex === question.answer;
    if (isCorrect) score += 1;

    answers.push({
        questionIndex: currentQuestionIndex,
        selected: optionIndex,
        correct: question.answer,
        isCorrect
    });

    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.answer) {
            button.classList.add('is-correct');
        }
        if (index === optionIndex && !isCorrect) {
            button.classList.add('is-incorrect');
        }
        if (index === optionIndex) {
            button.classList.add('is-selected');
        }
    });

    quizFeedback.hidden = false;
    quizFeedback.innerHTML = `<strong>${isCorrect ? 'Correct.' : 'Not quite.'}</strong> ${question.explanation}`;
    quizNextBtn.disabled = false;
}

function showResults() {
    const quiz = quizzes[currentQuizId];
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    quizResultScore.textContent = `${percentage}%`;
    quizResultTitle.textContent = percentage >= 75 ? 'Good phishing awareness result' : 'Keep building your phishing awareness';
    quizResultSummary.textContent = getScoreSummary(percentage);
    quizCorrectCount.textContent = `${score} / ${totalQuestions}`;
    quizResultQuizName.textContent = quiz.title;
    if (quizResultCard) {
        quizResultCard.classList.remove(
            'grade-a-plus',
            'grade-a',
            'grade-b-plus',
            'grade-b',
            'grade-c-plus',
            'grade-c',
            'grade-d',
            'grade-f'
        );
        if (percentage >= 95) quizResultCard.classList.add(getQuizGradeClass('A+'));
        else if (percentage >= 90) quizResultCard.classList.add(getQuizGradeClass('A'));
        else if (percentage >= 85) quizResultCard.classList.add(getQuizGradeClass('B+'));
        else if (percentage >= 80) quizResultCard.classList.add(getQuizGradeClass('B'));
        else if (percentage >= 75) quizResultCard.classList.add(getQuizGradeClass('C+'));
        else if (percentage >= 70) quizResultCard.classList.add(getQuizGradeClass('C'));
        else if (percentage >= 65) quizResultCard.classList.add(getQuizGradeClass('D'));
        else quizResultCard.classList.add(getQuizGradeClass('F'));
    }

    if (isLoggedIn()) {
        guestQuizPrompt.hidden = true;
        saveSignedInAttempt({
            quizId: currentQuizId,
            quizTitle: quiz.title,
            score,
            totalQuestions,
            percentage,
            reviewData: buildQuizAttemptReviewData(quiz, answers)
        }).then(() => {
            loadSignedInQuizData();
        }).catch((error) => {
            console.warn('Quiz attempt save failed:', error.message || error);
        });
    } else {
        guestQuizPrompt.hidden = false;
    }

    updateWorkspaceVisibility(true);
    scrollToWorkspace();
}

function startQuiz(quizId) {
    if (!quizzes[quizId]) return;

    currentQuizId = quizId;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    setQuizAppView('current-quiz');

    renderQuestion();
    scrollToWorkspace();
}

function resetQuizWorkspace() {
    currentQuizId = null;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    if (quizWorkspace) quizWorkspace.hidden = true;
    if (quizFeedback) {
        quizFeedback.hidden = true;
        quizFeedback.innerHTML = '';
    }

    setQuizAppView('quiz-library');
}

function resetLoginPageLabState() {
    if (loginPageLabSpotTargets.length) {
        loginPageLabSpotTargets.forEach((button) => {
            button.classList.remove('is-selected');
            button.setAttribute('aria-pressed', 'false');
        });
    }

    if (loginPageLabSelectionCount) {
        loginPageLabSelectionCount.textContent = '0 / 3';
    }

    if (loginPageLabFeedback) {
        loginPageLabFeedback.hidden = true;
        loginPageLabFeedback.className = 'lab-feedback-card';
        loginPageLabFeedback.innerHTML = '';
    }

    if (loginPageLabSubmit) {
        loginPageLabSubmit.hidden = false;
        loginPageLabSubmit.disabled = false;
    }
    if (loginPageLabReset) loginPageLabReset.hidden = true;
}

function openLoginPageLab() {
    if (!loginPageLab) return;
    resetLoginPageLabState();
    setQuizAppView('current-lab');
    history.replaceState(null, '', '#loginPageLab');
    loginPageLab.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeLoginPageLab() {
    if (!loginPageLab) return;
    resetLoginPageLabState();
    setQuizAppView('labs');
    setActiveQuizSidebarLink('labsPanel');
    history.replaceState(null, '', '#labsPanel');
    labsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getLoginPageLabSelections() {
    return loginPageLabSpotTargets
        .filter((button) => button.classList.contains('is-selected'))
        .map((button) => button.dataset.labSpot);
}

function renderLoginPageLabFeedback(selectedSpots) {
    if (!loginPageLabFeedback) return;
    const correctSelections = selectedSpots.filter((spot) => loginPageLabCorrectSpots.has(spot));
    const missedSpots = [...loginPageLabCorrectSpots].filter((spot) => !selectedSpots.includes(spot));
    const wrongSelections = selectedSpots.filter((spot) => !loginPageLabCorrectSpots.has(spot));
    const perfectMatch = correctSelections.length === loginPageLabCorrectSpots.size && wrongSelections.length === 0;

    const explanationMap = {
        domain: 'The URL does not clearly match the official school domain, which is a strong phishing signal.',
        urgency: 'The suspension warning pressures the user to act fast instead of verifying first.',
        support: 'The support contact uses a suspicious helpdesk-style domain unrelated to the school.',
        brand: 'A copied logo or school name is not enough proof that a page is legitimate.',
        submit: 'A submit button by itself is not the strongest red flag; the surrounding context matters more.'
    };

    const notes = [
        ...missedSpots.map((spot) => `<li><strong>Missed:</strong> ${explanationMap[spot]}</li>`),
        ...wrongSelections.map((spot) => `<li><strong>Weak pick:</strong> ${explanationMap[spot]}</li>`)
    ].join('');

    loginPageLabFeedback.className = `lab-feedback-card ${perfectMatch ? 'is-success' : 'is-warning'}`;
    const pointsNote = perfectMatch
        ? (isLoggedIn()
            ? `<p><strong>Points earned:</strong> ${quizPointValues[loginPageLabAttemptId]} training points.</p>`
            : '<p><strong>Nice catch.</strong> Sign in if you want this lab result and its points to count toward your progress.</p>')
        : (isLoggedIn()
            ? '<p><strong>No points yet.</strong> You need all 3 strongest red flags to earn points from this lab.</p>'
            : '');

    loginPageLabFeedback.innerHTML = `
        <strong>${perfectMatch ? 'Nice catch.' : 'Good try.'}</strong>
        <p>${perfectMatch
            ? 'You found the strongest phishing signals on the page: the suspicious domain, the urgent scare tactic, and the fake support contact.'
            : 'The best red flags here are the suspicious domain, the urgency message, and the unrelated support contact.'}</p>
        ${pointsNote}
        ${notes ? `<ul>${notes}</ul>` : ''}
    `;
    loginPageLabFeedback.hidden = false;

    if (loginPageLabSubmit) loginPageLabSubmit.hidden = true;
    if (loginPageLabReset) loginPageLabReset.hidden = false;
}

async function saveLoginPageLabAttempt(selectedSpots = []) {
    if (!isLoggedIn()) return null;

    const totalQuestions = loginPageLabCorrectSpots.size;
    const correctSelections = selectedSpots.filter((spot) => loginPageLabCorrectSpots.has(spot)).length;
    const percentage = Math.round((correctSelections / totalQuestions) * 100);

    return saveSignedInAttempt({
        quizId: loginPageLabAttemptId,
        quizTitle: loginPageLabAttemptTitle,
        score: correctSelections,
        totalQuestions,
        percentage,
        reviewData: []
    });
}

quizStartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const action = button.dataset.lockedAction || 'start';
        if (action === 'login') {
            window.location.href = '/login?returnTo=/quiz';
            return;
        }
        if (action === 'locked') {
            return;
        }
        startQuiz(button.dataset.quiz);
    });
});

labStartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const labId = button.dataset.startLab;
        if (labId === 'login-page-check') {
            openLoginPageLab();
        }
    });
});

loginPageLabSpotTargets.forEach((button) => {
    button.addEventListener('click', () => {
        const isSelected = button.classList.contains('is-selected');
        const currentSelections = getLoginPageLabSelections();

        if (!isSelected && currentSelections.length >= 3) {
            return;
        }

        button.classList.toggle('is-selected');
        button.setAttribute('aria-pressed', button.classList.contains('is-selected') ? 'true' : 'false');

        if (loginPageLabSelectionCount) {
            loginPageLabSelectionCount.textContent = `${getLoginPageLabSelections().length} / 3`;
        }
    });
});

loginPageLabSubmit?.addEventListener('click', () => {
    const selections = getLoginPageLabSelections();
    if (!selections.length) {
        if (loginPageLabFeedback) {
            loginPageLabFeedback.className = 'lab-feedback-card is-warning';
            loginPageLabFeedback.innerHTML = `
                <strong>Inspect the page first.</strong>
                <p>Click the suspicious parts of the fake login page before checking your findings.</p>
            `;
            loginPageLabFeedback.hidden = false;
        }
        return;
    }

    renderLoginPageLabFeedback(selections);

    if (isLoggedIn()) {
        saveLoginPageLabAttempt(selections)
            .then(() => {
                loadSignedInQuizData();
            })
            .catch((error) => {
                console.warn('Lab attempt save failed:', error.message || error);
            });
    }
});

loginPageLabReset?.addEventListener('click', () => {
    resetLoginPageLabState();
});

loginPageLabClose?.addEventListener('click', () => {
    closeLoginPageLab();
});

quizNextBtn?.addEventListener('click', () => {
    const quiz = quizzes[currentQuizId];
    if (!quiz || selectedAnswerIndex === null) return;

    if (currentQuestionIndex === quiz.questions.length - 1) {
        showResults();
        return;
    }

    currentQuestionIndex += 1;
    renderQuestion();
});

quizRetryBtn?.addEventListener('click', () => {
    if (!currentQuizId) return;
    startQuiz(currentQuizId);
});

quizChooseAnotherBtn?.addEventListener('click', () => {
    resetQuizWorkspace();
    document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizExitBtn?.addEventListener('click', () => {
    resetQuizWorkspace();
    document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizSidebarStartBtn?.addEventListener('click', () => {
    const recommendedQuizId = getRecommendedQuizId(signedInQuizAttempts);
    startQuiz(recommendedQuizId);
    closeQuizSidebarDrawer();
});

quizSidebarProfileBtn?.addEventListener('click', () => {
    setQuizAppView('profile');
    closeQuizSidebarDrawer();
    quizProfilePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizSidebarLogoutBtn?.addEventListener('click', () => {
    openQuizLogoutConfirm();
});

quizSidebarToggle?.addEventListener('click', () => {
    toggleQuizSidebarDrawer();
});

quizSidebarBackBtn?.addEventListener('click', handleQuizSidebarCloseControl);
quizSidebarBackBtn?.addEventListener('pointerup', handleQuizSidebarCloseControl);
quizSidebarBackBtn?.addEventListener('touchend', handleQuizSidebarCloseControl, { passive: false });

quizSidebarOverlay?.addEventListener('click', () => {
    closeQuizSidebarDrawer();
});

quizProfileNoteInput?.addEventListener('input', () => {
    const note = quizProfileNoteInput.value.slice(0, 120);
    if (quizProfileNoteInput.value !== note) {
        quizProfileNoteInput.value = note;
    }

    syncQuizProfileNoteUi(note, isLoggedIn() ? 'Save your note when you are ready.' : 'Sign in to save a short profile note.', true);
});

quizProfileNoteSaveBtn?.addEventListener('click', () => {
    saveQuizProfileNote();
});

quizProfileNoteEditBtn?.addEventListener('click', () => {
    const note = quizProfileNoteInput?.value || quizProfileNoteText?.textContent || '';
    syncQuizProfileNoteUi(note, 'Edit your note anytime.', true);
    quizProfileNoteInput?.focus();
});

document.querySelector('.quiz-sidebar-header')?.addEventListener('click', (event) => {
    const closeButton = event.target instanceof Element ? event.target.closest('.quiz-sidebar-back-btn') : null;
    if (!closeButton) return;
    handleQuizSidebarCloseControl(event);
});

quizPublicProfileClose?.addEventListener('click', () => {
    closePublicQuizProfile();
});

quizPublicProfileOverlay?.addEventListener('click', (event) => {
    if (event.target === quizPublicProfileOverlay) {
        closePublicQuizProfile();
    }
});

quizAttemptReviewClose?.addEventListener('click', () => {
    closeQuizAttemptReview();
});

quizAttemptReviewOverlay?.addEventListener('click', (event) => {
    if (event.target === quizAttemptReviewOverlay) {
        closeQuizAttemptReview();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('quiz-sidebar-open')) {
        closeQuizSidebarDrawer();
    }
    if (event.key === 'Escape' && quizPublicProfileOverlay && !quizPublicProfileOverlay.hidden) {
        closePublicQuizProfile();
    }
    if (event.key === 'Escape' && quizAttemptReviewOverlay && !quizAttemptReviewOverlay.hidden) {
        closeQuizAttemptReview();
    }
    if (event.key === 'Escape' && quizLogoutConfirmOverlay && !quizLogoutConfirmOverlay.hidden) {
        closeQuizLogoutConfirm();
    }
});

quizLogoutCancelBtn?.addEventListener('click', () => {
    closeQuizLogoutConfirm();
});

quizLogoutConfirmBtn?.addEventListener('click', async () => {
    closeQuizLogoutConfirm();
    await handleQuizLogout();
});

quizLogoutConfirmOverlay?.addEventListener('click', (event) => {
    if (event.target === quizLogoutConfirmOverlay) {
        closeQuizLogoutConfirm();
    }
});

document.addEventListener('touchstart', handleQuizSidebarTouchStart, { passive: true });
document.addEventListener('touchmove', handleQuizSidebarTouchMove, { passive: false });

window.addEventListener('resize', () => {
    if (!shouldUseQuizSidebarDrawer()) {
        closeQuizSidebarDrawer();
    }

    renderQuizPagination();
    renderLabsPagination();
  });

bindQuizSidebarNavigation();
window.addEventListener('hashchange', () => syncQuizViewFromHash('smooth'));

if (isLoggedIn()) {
    setActiveQuizSidebarLink('quizzes');
}

syncQuizViewFromHash();




