// extra-eng.js — English lessons (ADVANCED, written in English to raise difficulty) +47 -> English total 55
// Loaded after data.js so OTHER_TOPICS exists, then appended to OTHER_TOPICS.eng

(function () {
  const EXTRA_ENG = [
    {
      id: 'eng-h01', tag: 'Lesson · English (Advanced)', title: 'Subject-Verb Agreement with Collective Nouns',
      sub: 'Choose the verb that agrees with the true subject, not the nearest noun',
      explain: [
        'A collective noun (team, police, committee) can take singular or plural depending on whether the group acts as one unit or as individuals',
        'In American English collective nouns are usually singular; in British English they may be plural when the members act individually'
      ],
      example: { problem: 'The police ___ investigating the case. (choose a form)', steps: [{ t: 'police refers to a body of officers acting', c: '' }, { t: 'use the plural are', c: '' }], answer: 'are' },
      tip: ['Find the true subject before choosing the verb', 'Do not be fooled by the nearest noun'],
      practice: [
        { q: 'The committee ___ divided on the issue. (acting as individuals)', a: 'were', hint: 'plural when members differ' },
        { q: 'The team ___ winning the championship. (acting as one unit)', a: 'is', hint: 'singular for one unit' },
        { q: 'Which noun is the true subject in "The list of items is long"', a: 'list', hint: 'not items' },
        { q: '"The number of applicants ___ high." choose verb form', a: 'is', hint: 'the number = singular' }
      ]
    },
    {
      id: 'eng-h02', tag: 'Lesson · English (Advanced)', title: 'Articles: A, An, The and Zero Article',
      sub: 'Use the right article based on specificity and countable/uncountable status',
      explain: [
        'Use "a/an" for a single countable noun mentioned for the first time; use "the" for something already known or unique',
        'Do not use an article before plural general nouns or uncountable nouns used in a general sense (zero article)'
      ],
      example: { problem: '___ honesty is the best policy. (choose article or none)', steps: [{ t: 'honesty is an uncountable general concept', c: '' }, { t: 'use zero article', c: '' }], answer: '(no article)' },
      tip: ['General uncountable = no article', 'Unique things = the'],
      practice: [
        { q: 'She is ___ engineer. (first mention, singular countable)', a: 'an', hint: 'engineer starts with vowel sound' },
        { q: '___ sun rises in the east. (unique)', a: 'The', hint: 'unique celestial body' },
        { q: 'I drink ___ water every day. (uncountable general)', a: '(no article)', hint: 'general uncountable' },
        { q: 'He went to ___ hospital to visit her. (specific building)', a: 'the', hint: 'specific' }
      ]
    },
    {
      id: 'eng-h03', tag: 'Lesson · English (Advanced)', title: 'Conditional Sentences (All Types)',
      sub: 'Match the condition type to the correct tense pattern',
      explain: [
        'Type 1 (real): if + present, will + base. Type 2 (hypothetical): if + past, would + base',
        'Type 3 (past unreal): if + past perfect, would have + past participle. Mixed: past condition, present result'
      ],
      example: { problem: 'If he ___ (study) harder, he would pass. (choose form)', steps: [{ t: 'hypothetical present, use past', c: '' }, { t: 'studied', c: '' }], answer: 'studied' },
      tip: ['Type 2 uses past tense in the if-clause', 'Type 3 uses past perfect'],
      practice: [
        { q: 'If it rains, we ___ cancel. (real condition)', a: 'will', hint: 'Type 1' },
        { q: 'If I ___ you, I would apologize. (hypothetical)', a: 'were', hint: 'Type 2 subjunctive' },
        { q: 'If she had left earlier, she ___ missed the train. (past unreal)', a: 'would not have', hint: 'Type 3' },
        { q: 'If he had studied, he ___ the exam now. (mixed)', a: 'would pass', hint: 'past condition, present result' }
      ]
    },
    {
      id: 'eng-h04', tag: 'Lesson · English (Advanced)', title: 'Inversion After Negative Adverbials',
      sub: 'Invert subject and auxiliary after phrases like "never", "seldom", "not only"',
      explain: [
        'When a negative or restrictive adverbial begins the sentence, the auxiliary precedes the subject (inversion)',
        'Examples: Never have I seen... / Not only did he complain but...'
      ],
      example: { problem: 'Rewrite: "He had never seen such a case." (start with Never)', steps: [{ t: 'negative adverbial first triggers inversion', c: '' }, { t: 'Never had he seen such a case.', c: '' }], answer: 'Never had he seen such a case.' },
      tip: ['Negative first = invert', 'Auxiliary moves before subject'],
      practice: [
        { q: 'Start with "Seldom": "She rarely attends meetings."', a: 'Seldom does she attend meetings.', hint: 'invert with does' },
        { q: 'Start with "Not only": "He finished the report but he presented it."', a: 'Not only did he finish the report but he presented it.', hint: 'invert first clause' },
        { q: 'Which sentence shows correct inversion', a: 'Rarely do they complain.', hint: 'auxiliary before subject' },
        { q: 'Why do we invert after "never"', a: 'negative adverbial fronting', hint: 'grammar rule' }
      ]
    },
    {
      id: 'eng-h05', tag: 'Lesson · English (Advanced)', title: 'Cleft Sentences for Emphasis',
      sub: 'Use "It is/was ... that" to focus on one element',
      explain: [
        'A cleft sentence splits one clause into two to emphasize a particular part',
        'Structure: It + be + focused element + that/who + rest'
      ],
      example: { problem: 'Emphasize "the sergeant" in "The sergeant arrested the suspect."', steps: [{ t: 'place focus before that', c: '' }, { t: 'It was the sergeant that arrested the suspect.', c: '' }], answer: 'It was the sergeant that arrested the suspect.' },
      tip: ['Focus comes right after be', 'Use that/who after the focus'],
      practice: [
        { q: 'Emphasize "yesterday": "He left yesterday."', a: 'It was yesterday that he left.', hint: 'focus time' },
        { q: 'Emphasize "the witness": "The witness called the police."', a: 'It was the witness who called the police.', hint: 'focus person' },
        { q: 'Cleft sentences are used for', a: 'emphasis', hint: 'focus' },
        { q: 'After "It was the officer", use which word', a: 'that or who', hint: 'relative' }
      ]
    },
    {
      id: 'eng-h06', tag: 'Lesson · English (Advanced)', title: 'Passive Voice Transformation',
      sub: 'Convert active to passive keeping tense and meaning',
      explain: [
        'Passive structure: be + past participle. The object of the active becomes the subject of the passive',
        'Use "by" to keep the agent only when it adds important information'
      ],
      example: { problem: 'Change to passive: "The officer arrested the suspect."', steps: [{ t: 'suspect becomes subject', c: '' }, { t: 'The suspect was arrested by the officer.', c: '' }], answer: 'The suspect was arrested by the officer.' },
      tip: ['Object moves to subject', 'Keep the tense of be'],
      practice: [
        { q: 'Passive of "They built the station in 1990."', a: 'The station was built in 1990.', hint: 'past passive' },
        { q: 'Passive of "Someone stole the documents."', a: 'The documents were stolen.', hint: 'agent optional' },
        { q: 'In passive, the original object becomes the', a: 'subject', hint: 'moves front' },
        { q: 'Passive of "The court will announce the verdict."', a: 'The verdict will be announced by the court.', hint: 'future passive' }
      ]
    },
    {
      id: 'eng-h07', tag: 'Lesson · English (Advanced)', title: 'Reported Speech Backshift',
      sub: 'Shift tenses one step back when reporting past speech',
      explain: [
        'In reported speech, present becomes past, past becomes past perfect, will becomes would',
        'Time and place expressions also shift (now -> then, here -> there)'
      ],
      example: { problem: 'Report: "I am investigating the case." (he said)', steps: [{ t: 'present am -> past was', c: '' }, { t: 'He said he was investigating the case.', c: '' }], answer: 'He said he was investigating the case.' },
      tip: ['Shift tense back one step', 'Change now/here'],
      practice: [
        { q: 'Report: "We will arrive soon." (they said)', a: 'They said they would arrive soon.', hint: 'will -> would' },
        { q: 'Report: "I saw the suspect." (she said)', a: 'She said she had seen the suspect.', hint: 'past -> past perfect' },
        { q: '"now" in reported speech becomes', a: 'then', hint: 'time shift' },
        { q: 'Report: "He is here." (she said)', a: 'She said he was there.', hint: 'here -> there' }
      ]
    },
    {
      id: 'eng-h08', tag: 'Lesson · English (Advanced)', title: 'Modals of Deduction',
      sub: 'Use must, can\'t, may, might for logical certainty',
      explain: [
        'Must means the speaker is certain something is true; can\'t means certain it is false',
        'May/might express possibility, not certainty'
      ],
      example: { problem: 'The lights are on, so he ___ be home. (certainty)', steps: [{ t: 'evidence suggests certainty', c: '' }, { t: 'must', c: '' }], answer: 'must' },
      tip: ['must = sure yes', 'can\'t = sure no'],
      practice: [
        { q: 'He is not at his desk, so he ___ be in a meeting. (likely)', a: 'may', hint: 'possibility' },
        { q: 'The suspect was in another city, so he ___ have committed the crime here. (impossible)', a: 'can\'t', hint: 'certain no' },
        { q: 'The ground is wet, so it ___ have rained. (certainty)', a: 'must', hint: 'sure yes' },
        { q: 'Which modal shows the weakest certainty', a: 'might', hint: 'lowest probability' }
      ]
    },
    {
      id: 'eng-h09', tag: 'Lesson · English (Advanced)', title: 'Gerunds vs Infinitives',
      sub: 'Know which verbs take -ing and which take to + base',
      explain: [
        'Some verbs take gerunds (enjoy, avoid, suggest); some take infinitives (decide, promise, refuse)',
        'A few take either with a change in meaning (stop, remember, try)'
      ],
      example: { problem: 'He avoided ___ (answer) the question. (form)', steps: [{ t: 'avoid takes gerund', c: '' }, { t: 'answering', c: '' }], answer: 'answering' },
      tip: ['avoid + ing', 'decide + to'],
      practice: [
        { q: 'She decided ___ (leave) early.', a: 'to leave', hint: 'decide + to' },
        { q: 'They enjoyed ___ (watch) the parade.', a: 'watching', hint: 'enjoy + ing' },
        { q: 'He suggested ___ (call) the station.', a: 'calling', hint: 'suggest + ing' },
        { q: 'We promised ___ (help) them.', a: 'to help', hint: 'promise + to' }
      ]
    },
    {
      id: 'eng-h10', tag: 'Lesson · English (Advanced)', title: 'Relative Clauses',
      sub: 'Use who, which, that, whose correctly; know when to omit',
      explain: [
        'Who refers to people; which to things; that to either; whose shows possession',
        'Omit the relative pronoun when it is the object of the clause'
      ],
      example: { problem: 'The officer ___ caught the thief was praised. (subject)', steps: [{ t: 'refers to a person as subject', c: '' }, { t: 'who or that', c: '' }], answer: 'who' },
      tip: ['Subject -> keep pronoun', 'Object -> can omit'],
      practice: [
        { q: 'The report ___ you wrote was clear. (object)', a: 'that', hint: 'can omit too' },
        { q: 'The man ___ car was stolen reported it. (possession)', a: 'whose', hint: 'possession' },
        { q: 'The book ___ is on the desk belongs to me. (subject, thing)', a: 'which', hint: 'thing subject' },
        { q: 'We met the scientist ___ discovered the cure. (subject, person)', a: 'who', hint: 'person subject' }
      ]
    },
    {
      id: 'eng-h11', tag: 'Lesson · English (Advanced)', title: 'Phrasal Verbs in Context',
      sub: 'Match multi-word verbs to their meanings',
      explain: [
        'Phrasal verbs combine a verb with a particle and often change meaning (look up = search; look into = investigate)',
        'In law enforcement contexts, set phrases like "carry out", "look into", "draw up" are common'
      ],
      example: { problem: 'The detective will ___ the complaint. (investigate)', steps: [{ t: 'investigate as phrasal verb', c: '' }, { t: 'look into', c: '' }], answer: 'look into' },
      tip: ['learn common pairs', 'context decides meaning'],
      practice: [
        { q: 'Please ___ the form. (complete/write)', a: 'fill out', hint: 'form' },
        { q: 'They will ___ the investigation. (conduct)', a: 'carry out', hint: 'conduct' },
        { q: '"turn down" means', a: 'reject', hint: 'refuse' },
        { q: 'The officer ___ the suspect at the station. (took into custody)', a: 'picked up', hint: 'colloquial custody' }
      ]
    },
    {
      id: 'eng-h12', tag: 'Lesson · English (Advanced)', title: 'Collocations with Make, Do, Take',
      sub: 'Use the correct verb in fixed word partnerships',
      explain: [
        'Make is used for creating or producing (make a decision, make an arrest)',
        'Do is used for tasks and activities (do the paperwork, do an investigation)',
        'Take is used for actions requiring effort (take action, take notes)'
      ],
      example: { problem: 'The officer will ___ an arrest. (choose verb)', steps: [{ t: 'arrest pairs with make', c: '' }, { t: 'make an arrest', c: '' }], answer: 'make' },
      tip: ['make an arrest', 'do the work'],
      practice: [
        { q: 'We must ___ a decision soon.', a: 'make', hint: 'decision' },
        { q: 'She will ___ the report tonight.', a: 'do', hint: 'task' },
        { q: 'Please ___ notes during the briefing.', a: 'take', hint: 'notes' },
        { q: 'They ___ an effort to improve.', a: 'make', hint: 'effort' }
      ]
    },
    {
      id: 'eng-h13', tag: 'Lesson · English (Advanced)', title: 'Prepositions of Time and Place',
      sub: 'Choose at, in, on, by correctly',
      explain: [
        'Use at for precise points (at 9am, at the station); on for surfaces and days (on Monday, on the table)',
        'Use in for enclosed spaces and longer periods (in the room, in 2024); by for deadlines'
      ],
      example: { problem: 'The meeting is ___ Monday. (choose)', steps: [{ t: 'days use on', c: '' }, { t: 'on Monday', c: '' }], answer: 'on' },
      tip: ['days -> on', 'deadlines -> by'],
      practice: [
        { q: 'Submit the form ___ Friday. (deadline)', a: 'by', hint: 'before a time' },
        { q: 'The suspect waited ___ the lobby. (enclosed space)', a: 'in', hint: 'inside' },
        { q: 'The briefing starts ___ 8 a.m. (precise time)', a: 'at', hint: 'point' },
        { q: 'The report was filed ___ 2024. (year)', a: 'in', hint: 'period' }
      ]
    },
    {
      id: 'eng-h14', tag: 'Lesson · English (Advanced)', title: 'Tense Consistency',
      sub: 'Keep tenses consistent within a narrative unless time changes',
      explain: [
        'When telling a past story, stay in past tense; shift only when the timeframe shifts',
        'Mixing present and past without reason confuses the timeline'
      ],
      example: { problem: 'Fix: "He enters the room and saw the evidence."', steps: [{ t: 'saw is past, enters should match', c: '' }, { t: 'He entered the room and saw the evidence.', c: '' }], answer: 'He entered the room and saw the evidence.' },
      tip: ['Match surrounding tenses', 'Shift only on time change'],
      practice: [
        { q: 'Fix: "She writes the report and submitted it."', a: 'She wrote the report and submitted it.', hint: 'past both' },
        { q: 'Fix: "They arrest him and he escapes." (past story)', a: 'They arrested him and he escaped.', hint: 'past both' },
        { q: 'Inconsistent tense makes the', a: 'timeline unclear', hint: 'confuses reader' },
        { q: 'When may you shift tense', a: 'when time changes', hint: 'new timeframe' }
      ]
    },
    {
      id: 'eng-h15', tag: 'Lesson · English (Advanced)', title: 'Parallelism',
      sub: 'Balance grammatical structures in a list',
      explain: [
        'Items in a series should share the same grammatical form (all nouns, all -ing, all infinitives)',
        'Faulty parallelism weakens clarity and style'
      ],
      example: { problem: 'Fix: "He likes reading, to write, and jogging."', steps: [{ t: 'mix of forms; make all -ing', c: '' }, { t: 'reading, writing, and jogging', c: '' }], answer: 'reading, writing, and jogging' },
      tip: ['Same form in a list', 'check conjunctions'],
      practice: [
        { q: 'Fix: "She is smart, kind, and works hard."', a: 'She is smart, kind, and hardworking.', hint: 'all adjectives' },
        { q: 'Parallel: "We came to learn, to teach, and ___"', a: 'to help', hint: 'infinitive' },
        { q: 'Faulty parallelism harms', a: 'clarity', hint: 'clearness' },
        { q: 'Fix: "He enjoys swimming and to run."', a: 'He enjoys swimming and running.', hint: 'both -ing' }
      ]
    },
    {
      id: 'eng-h16', tag: 'Lesson · English (Advanced)', title: 'Dangling Modifiers',
      sub: 'Place modifiers next to the word they describe',
      explain: [
        'A modifier must clearly attach to a subject in the main clause',
        'A dangling modifier has no logical subject, creating nonsense'
      ],
      example: { problem: 'Fix: "Walking to the station, the rain started."', steps: [{ t: 'rain cannot walk; attach to a person', c: '' }, { t: 'Walking to the station, he felt the rain start.', c: '' }], answer: 'Walking to the station, he felt the rain start.' },
      tip: ['Modifier needs a subject', 'place it close'],
      practice: [
        { q: 'Fix: "Having finished the report, the computer shut down."', a: 'Having finished the report, he shut down the computer.', hint: 'person finished' },
        { q: 'A dangling modifier lacks a', a: 'logical subject', hint: 'no noun' },
        { q: 'Fix: "Born in 1990, the school honored her."', a: 'Born in 1990, she was honored by the school.', hint: 'she was born' },
        { q: 'Good modifiers are placed', a: 'near the word described', hint: 'close' }
      ]
    },
    {
      id: 'eng-h17', tag: 'Lesson · English (Advanced)', title: 'Word Formation',
      sub: 'Use correct prefix and suffix to change part of speech',
      explain: [
        'Add -ment, -tion, -ity to form nouns; -ize, -ify to form verbs; un-, dis-, in- for negatives',
        'Spelling often changes at the boundary (e.g., care -> careful -> carefully)'
      ],
      example: { problem: 'Form a noun from "investigate".', steps: [{ t: 'verb to noun', c: '' }, { t: 'investigation', c: '' }], answer: 'investigation' },
      tip: ['know common suffixes', 'watch spelling shifts'],
      practice: [
        { q: 'Noun from "decide"', a: 'decision', hint: 'decis' },
        { q: 'Negative of "likely"', a: 'unlikely', hint: 'un' },
        { q: 'Adverb from "careful"', a: 'carefully', hint: 'add ly' },
        { q: 'Verb from "modern"', a: 'modernize', hint: 'ize' }
      ]
    },
    {
      id: 'eng-h18', tag: 'Lesson · English (Advanced)', title: 'Academic Vocabulary',
      sub: 'Use formal academic verbs accurately',
      explain: [
        'Academic writing favors precise verbs: analyze, assess, establish, indicate, reveal',
        'Avoid vague verbs like "shows" when a precise one fits'
      ],
      example: { problem: 'Replace vague "The data shows a trend." with a precise verb', steps: [{ t: 'indicate is more precise', c: '' }, { t: 'The data indicate a trend.', c: '' }], answer: 'The data indicate a trend.' },
      tip: ['prefer precise verbs', 'match register'],
      practice: [
        { q: 'Choose: "The study ___ a link between the factors."', a: 'established', hint: 'found firmly' },
        { q: 'Formal synonym of "look at"', a: 'examine', hint: 'study closely' },
        { q: 'Which is most precise: "says", "suggests", "claims"', a: 'suggests', hint: 'cautious' },
        { q: '"The results ___ that the method works."', a: 'demonstrate', hint: 'prove clearly' }
      ]
    },
    {
      id: 'eng-h19', tag: 'Lesson · English (Advanced)', title: 'Law Enforcement Vocabulary',
      sub: 'Key terms: warrant, custody, suspect, evidence, testimony',
      explain: [
        'A warrant is a court order; custody is detention; a suspect is a person believed involved',
        'Evidence supports facts; testimony is spoken evidence under oath'
      ],
      example: { problem: 'The officer obtained a ___ to search the building. (court order)', steps: [{ t: 'court order to search', c: '' }, { t: 'warrant', c: '' }], answer: 'warrant' },
      tip: ['warrant = court order', 'custody = detention'],
      practice: [
        { q: 'Spoken evidence under oath is called', a: 'testimony', hint: 'in court' },
        { q: 'A person held by police is in', a: 'custody', hint: 'detained' },
        { q: 'A person believed to be involved is a', a: 'suspect', hint: 'not yet proven' },
        { q: 'Physical proof is', a: 'evidence', hint: 'supports facts' }
      ]
    },
    {
      id: 'eng-h20', tag: 'Lesson · English (Advanced)', title: 'Formal vs Informal Register',
      sub: 'Adjust tone to the audience',
      explain: [
        'Formal writing uses full forms, passive where appropriate, and precise vocabulary',
        'Informal uses contractions, phrasal verbs, and personal tone'
      ],
      example: { problem: 'Which is more formal: "can\'t" or "cannot"', steps: [{ t: 'contractions are informal', c: '' }, { t: 'cannot is formal', c: '' }], answer: 'cannot' },
      tip: ['avoid contractions in reports', 'use precise words'],
      practice: [
        { q: 'Formal version of "find out"', a: 'determine', hint: 'precise' },
        { q: 'In a police report, use', a: 'formal register', hint: 'official' },
        { q: 'Contraction "it\'s" is appropriate in', a: 'informal writing', hint: 'not reports' },
        { q: 'Formal synonym of "get"', a: 'obtain', hint: 'receive' }
      ]
    },
    {
      id: 'eng-h21', tag: 'Lesson · English (Advanced)', title: 'Punctuation: Comma and Semicolon',
      sub: 'Use commas and semicolons to separate clauses correctly',
      explain: [
        'Use a comma before a coordinating conjunction joining two independent clauses',
        'Use a semicolon to join closely related independent clauses without a conjunction'
      ],
      example: { problem: 'Punctuate: "The suspect confessed and the case closed."', steps: [{ t: 'two independent clauses with and', c: '' }, { t: 'The suspect confessed, and the case closed.', c: '' }], answer: 'The suspect confessed, and the case closed.' },
      tip: ['comma + and', 'semicolon joins two clauses'],
      practice: [
        { q: 'Join with semicolon: "It was late; ___"', a: 'they went home', hint: 'second clause' },
        { q: 'Comma before which word: "He ran but he fell."', a: 'but', hint: 'coordinator' },
        { q: 'Semicolon can replace', a: 'a coordinating conjunction', hint: 'between clauses' },
        { q: 'Use a comma after an introductory phrase: "___ the rain stopped, they left."', a: 'After', hint: 'introductory' }
      ]
    },
    {
      id: 'eng-h22', tag: 'Lesson · English (Advanced)', title: 'Sentence Combining',
      sub: 'Merge short sentences without losing meaning',
      explain: [
        'Combine ideas using subordination, coordination, or relative clauses',
        'Avoid comma splices by using conjunctions or punctuation correctly'
      ],
      example: { problem: 'Combine: "The officer arrived. The crowd dispersed."', steps: [{ t: 'cause-effect relation', c: '' }, { t: 'When the officer arrived, the crowd dispersed.', c: '' }], answer: 'When the officer arrived, the crowd dispersed.' },
      tip: ['show the relation', 'avoid splice'],
      practice: [
        { q: 'Combine: "He was tired. He kept working."', a: 'Although he was tired, he kept working.', hint: 'contrast' },
        { q: 'A comma splice is', a: 'two clauses joined by only a comma', hint: 'error' },
        { q: 'Combine: "The suspect fled. Police caught him."', a: 'The suspect fled, but police caught him.', hint: 'contrast' },
        { q: 'Which tool shows cause: "because" or "however"', a: 'because', hint: 'reason' }
      ]
    },
    {
      id: 'eng-h23', tag: 'Lesson · English (Advanced)', title: 'Paraphrasing',
      sub: 'Restate ideas in your own words without changing meaning',
      explain: [
        'Paraphrasing keeps the meaning but changes words and structure',
        'Do not copy long phrases; use synonyms and reorder'
      ],
      example: { problem: 'Paraphrase: "The rapid rise in crime worried citizens."', steps: [{ t: 'change words and order', c: '' }, { t: 'Citizens were concerned by the quick increase in crime.', c: '' }], answer: 'Citizens were concerned by the quick increase in crime.' },
      tip: ['change structure', 'keep meaning'],
      practice: [
        { q: 'Paraphrase: "Officers responded immediately."', a: 'The police acted at once.', hint: 'synonyms' },
        { q: 'Paraphrasing must not change the', a: 'meaning', hint: 'core idea' },
        { q: 'Paraphrase: "The law was approved by the council."', a: 'The council approved the law.', hint: 'active form' },
        { q: 'Copying exact phrases is', a: 'not paraphrasing', hint: 'plagiarism' }
      ]
    },
    {
      id: 'eng-h24', tag: 'Lesson · English (Advanced)', title: 'Identifying the Main Idea',
      sub: 'Find the central point of a paragraph',
      explain: [
        'The main idea is the point the whole paragraph supports, often in the topic sentence',
        'Details support it but are not the main idea themselves'
      ],
      example: { problem: 'Paragraph: "Exercise improves mood. It lowers stress. It boosts energy. Overall, activity benefits health." Main idea?', steps: [{ t: 'last sentence sums it up', c: '' }, { t: 'Physical activity benefits health.', c: '' }], answer: 'Physical activity benefits health.' },
      tip: ['look for the summary', 'ignore minor details'],
      practice: [
        { q: 'Where is the main idea often found', a: 'first or last sentence', hint: 'topic sentence' },
        { q: 'Details in a paragraph do what', a: 'support the main idea', hint: 'back it up' },
        { q: 'Main idea of "Cats are independent. They groom themselves. They need little care."', a: 'Cats are low-maintenance pets.', hint: 'summary' },
        { q: 'A detail is', a: 'not the central point', hint: 'supporting' }
      ]
    },
    {
      id: 'eng-h25', tag: 'Lesson · English (Advanced)', title: 'Making Inferences',
      sub: 'Read between the lines using evidence',
      explain: [
        'An inference is a logical conclusion supported by the text but not stated directly',
        'Base inferences on evidence, not personal assumption'
      ],
      example: { problem: 'Text: "He wiped his hands and avoided eye contact." What can you infer?', steps: [{ t: 'behavior suggests discomfort', c: '' }, { t: 'He may feel guilty or nervous.', c: '' }], answer: 'He may feel guilty or nervous.' },
      tip: ['evidence first', 'do not assume'],
      practice: [
        { q: 'Text: "The streets were empty and shops closed." Infer', a: 'it was a holiday or late night', hint: 'evidence' },
        { q: 'An inference is', a: 'a supported conclusion', hint: 'not stated' },
        { q: 'Text: "She rushed out without her coat." Infer', a: 'she was in a hurry', hint: 'behavior' },
        { q: 'Poor inferences rely on', a: 'assumption', hint: 'not evidence' }
      ]
    },
    {
      id: 'eng-h26', tag: 'Lesson · English (Advanced)', title: 'Tone and Attitude',
      sub: 'Detect the author\'s feeling toward the subject',
      explain: [
        'Tone is the attitude shown by word choice: critical, neutral, supportive, alarmed',
        'Adjectives and verbs reveal tone more than facts'
      ],
      example: { problem: 'Which tone: "The flawed plan disastrously failed again."', steps: [{ t: 'words flawed, disastrously show disapproval', c: '' }, { t: 'critical', c: '' }], answer: 'critical' },
      tip: ['scan adjectives', 'note loaded words'],
      practice: [
        { q: 'Tone of "The team commendably completed the task."', a: 'praise', hint: 'commendably' },
        { q: 'Neutral tone avoids', a: 'loaded words', hint: 'bias' },
        { q: 'Tone of "The crisis alarmingly grew."', a: 'alarmed', hint: 'alarm' },
        { q: 'Word choice reveals', a: 'attitude', hint: 'tone' }
      ]
    },
    {
      id: 'eng-h27', tag: 'Lesson · English (Advanced)', title: 'Vocabulary in Context',
      sub: 'Guess meaning from surrounding words',
      explain: [
        'Unknown words can be decoded by contrast, example, or cause-effect nearby',
        'Do not guess from isolated letters; use the sentence'
      ],
      example: { problem: '"Unlike his gregarious sister, he was reserved." Gregarious means?', steps: [{ t: 'unlike signals opposite', c: '' }, { t: 'sociable', c: '' }], answer: 'sociable' },
      tip: ['use contrast clues', 'use examples'],
      practice: [
        { q: '"The arid land produced no crops." Arid means', a: 'dry', hint: 'no crops' },
        { q: '"She was elated, jumping with joy." Elated means', a: 'very happy', hint: 'joy' },
        { q: 'Context clue "unlike" shows', a: 'opposite', hint: 'contrast' },
        { q: '"The frugal man wasted nothing." Frugal means', a: 'thrifty', hint: 'wasted nothing' }
      ]
    },
    {
      id: 'eng-h28', tag: 'Lesson · English (Advanced)', title: 'Synonyms and Antonyms',
      sub: 'Choose words with the right degree of meaning',
      explain: [
        'Synonyms are similar but not identical; register and intensity differ',
        'Antonyms are opposite in meaning; watch prefixes like un-, dis-, in-'
      ],
      example: { problem: 'Antonym of "expand"', steps: [{ t: 'opposite of grow larger', c: '' }, { t: 'contract or shrink', c: '' }], answer: 'contract' },
      tip: ['check intensity', 'watch negative prefixes'],
      practice: [
        { q: 'Synonym of "assist"', a: 'help', hint: 'support' },
        { q: 'Antonym of "visible"', a: 'invisible', hint: 'in' },
        { q: 'Synonym of "rapid" with stronger tone', a: 'swift', hint: 'fast' },
        { q: 'Antonym of "increase"', a: 'decrease', hint: 'opposite' }
      ]
    },
    {
      id: 'eng-h29', tag: 'Lesson · English (Advanced)', title: 'Idioms and Fixed Expressions',
      sub: 'Understand non-literal phrases',
      explain: [
        'Idioms mean more than the sum of their words (e.g., "under the weather" = ill)',
        'Learn them as fixed units; literal translation fails'
      ],
      example: { problem: '"The suspect was caught red-handed." means', steps: [{ t: 'red-handed is idiomatic', c: '' }, { t: 'caught in the act', c: '' }], answer: 'caught in the act' },
      tip: ['learn as units', 'do not translate literally'],
      practice: [
        { q: '"Break the ice" means', a: 'ease tension', hint: 'start talking' },
        { q: '"Under the weather" means', a: 'feeling ill', hint: 'not literal' },
        { q: 'Idioms should be learned as', a: 'fixed expressions', hint: 'units' },
        { q: '"Spill the beans" means', a: 'reveal a secret', hint: 'tell' }
      ]
    },
    {
      id: 'eng-h30', tag: 'Lesson · English (Advanced)', title: 'Conjunctions and Transitions',
      sub: 'Pick the linker that shows the right logical relation',
      explain: [
        'Cause: because, since; Contrast: although, however; Addition: moreover, furthermore',
        'Wrong transitions break logic between sentences'
      ],
      example: { problem: 'Choose: "He was tired. ___ he kept working."', steps: [{ t: 'contrast relation', c: '' }, { t: 'However', c: '' }], answer: 'However' },
      tip: ['match relation', 'avoid mismatch'],
      practice: [
        { q: 'Cause linker: "___ it rained, the match stopped."', a: 'Because', hint: 'reason' },
        { q: 'Addition linker', a: 'Furthermore', hint: 'also' },
        { q: 'Contrast linker: "He is poor. ___ he is happy."', a: 'Yet', hint: 'opposite' },
        { q: 'A wrong transition harms', a: 'logic', hint: 'relation' }
      ]
    },
    {
      id: 'eng-h31', tag: 'Lesson · English (Advanced)', title: 'Quantifiers',
      sub: 'Use few/little/much/many/a few/a little accurately',
      explain: [
        'Few/a few with countable plural; little/a little with uncountable',
        'Few and little are negative in sense; a few and a little are positive'
      ],
      example: { problem: 'We have ___ time left. (uncountable, negative)', steps: [{ t: 'uncountable negative', c: '' }, { t: 'little', c: '' }], answer: 'little' },
      tip: ['countable -> few', 'uncountable -> little'],
      practice: [
        { q: 'There are ___ apples in the basket. (countable positive)', a: 'a few', hint: 'some' },
        { q: 'He has ___ money. (uncountable positive)', a: 'a little', hint: 'some' },
        { q: '___ people came, so the room was empty. (countable negative)', a: 'Few', hint: 'almost none' },
        { q: 'Many is used with', a: 'countable plural', hint: 'nouns' }
      ]
    },
    {
      id: 'eng-h32', tag: 'Lesson · English (Advanced)', title: 'Countable and Uncountable Nouns',
      sub: 'Decide agreement and articles by noun type',
      explain: [
        'Countable nouns take plural forms and "a/an"; uncountable take singular and no article in general',
        'Some nouns are uncountable in English but countable in other languages (information, advice, evidence)'
      ],
      example: { problem: 'Which is correct: "much informations" or "much information"', steps: [{ t: 'information is uncountable', c: '' }, { t: 'much information', c: '' }], answer: 'much information' },
      tip: ['information is uncount', 'advice is uncount'],
      practice: [
        { q: 'Correct: "an advice" or "some advice"', a: 'some advice', hint: 'uncountable' },
        { q: '"The evidences show..." is', a: 'incorrect (evidence is uncount)', hint: 'no s' },
        { q: 'Countable noun example', a: 'book', hint: 'can pluralize' },
        { q: 'Uncountable noun needing singular verb', a: 'water', hint: 'mass noun' }
      ]
    },
    {
      id: 'eng-h33', tag: 'Lesson · English (Advanced)', title: 'Comparatives and Superlatives',
      sub: 'Form comparisons correctly with -er/-est or more/most',
      explain: [
        'Short adjectives take -er/-est; long adjectives take more/most',
        'Irregular forms: good/better/best, bad/worse/worst, far/further/farthest'
      ],
      example: { problem: 'Compare: "This case is ___ (serious) than that one."', steps: [{ t: 'two items, long adjective', c: '' }, { t: 'more serious', c: '' }], answer: 'more serious' },
      tip: ['long -> more', 'irregular forms'],
      practice: [
        { q: 'Superlative of "bad"', a: 'worst', hint: 'irregular' },
        { q: '"He is the ___ (tall) in the class."', a: 'tallest', hint: 'short adjective' },
        { q: 'Comparative of "careful"', a: 'more careful', hint: 'long' },
        { q: 'Superlative of "good"', a: 'best', hint: 'irregular' }
      ]
    },
    {
      id: 'eng-h34', tag: 'Lesson · English (Advanced)', title: 'Emphasis with Do/Does/Did',
      sub: 'Use auxiliary emphasis in positive statements',
      explain: [
        'Do/does/did before a base verb adds emphasis in positive sentences',
        'The tense of the auxiliary matches the sentence tense'
      ],
      example: { problem: 'Emphasize: "He came."', steps: [{ t: 'past emphasis uses did', c: '' }, { t: 'He did come.', c: '' }], answer: 'He did come.' },
      tip: ['did for past', 'does for present'],
      practice: [
        { q: 'Emphasize: "She goes."', a: 'She does go.', hint: 'present' },
        { q: 'Emphasize: "They finished."', a: 'They did finish.', hint: 'past' },
        { q: 'Auxiliary emphasis appears in', a: 'positive statements', hint: 'not questions' },
        { q: 'Tense of "do" matches the', a: 'sentence tense', hint: 'agreement' }
      ]
    },
    {
      id: 'eng-h35', tag: 'Lesson · English (Advanced)', title: 'Discourse Markers',
      sub: 'Signal structure: first, meanwhile, as a result',
      explain: [
        'Discourse markers guide the reader through sequence and logic',
        'Examples: first, then, meanwhile, consequently, in conclusion'
      ],
      example: { problem: 'Which marker shows result: "___, the suspect was arrested."', steps: [{ t: 'result linker', c: '' }, { t: 'As a result', c: '' }], answer: 'As a result' },
      tip: ['sequence words', 'result words'],
      practice: [
        { q: 'Marker for sequence start', a: 'First', hint: 'begin' },
        { q: 'Marker for conclusion', a: 'In conclusion', hint: 'end' },
        { q: '"Meanwhile" shows', a: 'simultaneous action', hint: 'at same time' },
        { q: 'Markers help the reader follow', a: 'structure', hint: 'logic' }
      ]
    },
    {
      id: 'eng-h36', tag: 'Lesson · English (Advanced)', title: 'Hedging Language',
      sub: 'Soften claims with cautious wording',
      explain: [
        'Hedging uses words like "may", "appear", "suggest", "likely" to avoid overclaiming',
        'Academic and official writing prefers hedging for uncertain claims'
      ],
      example: { problem: 'Soften: "The policy fails."', steps: [{ t: 'add caution', c: '' }, { t: 'The policy appears to fail.', c: '' }], answer: 'The policy appears to fail.' },
      tip: ['use may/appear', 'avoid absolutes'],
      practice: [
        { q: 'Hedged version of "He is guilty."', a: 'He appears guilty.', hint: 'cautious' },
        { q: 'Hedging shows', a: 'uncertainty', hint: 'caution' },
        { q: 'Which is strongest: "must", "may", "seems"', a: 'must', hint: 'certainty' },
        { q: 'Official reports often use hedging for', a: 'uncertain claims', hint: 'care' }
      ]
    },
    {
      id: 'eng-h37', tag: 'Lesson · English (Advanced)', title: 'Nominalization',
      sub: 'Turn verbs/adjectives into nouns for formal style',
      explain: [
        'Nominalization replaces clauses with noun phrases (decide -> decision; analyze -> analysis)',
        'It makes writing denser and more formal'
      ],
      example: { problem: 'Nominalize: "They decided to act."', steps: [{ t: 'verb to noun', c: '' }, { t: 'Their decision to act...', c: '' }], answer: 'Their decision to act' },
      tip: ['verb -> noun', 'formal density'],
      practice: [
        { q: 'Noun from "analyze"', a: 'analysis', hint: 'sis' },
        { q: 'Nominalize "They refused"', a: 'Their refusal', hint: 'noun' },
        { q: 'Nominalization makes text', a: 'more formal', hint: 'denser' },
        { q: 'Noun from "arrive"', a: 'arrival', hint: 'al' }
      ]
    },
    {
      id: 'eng-h38', tag: 'Lesson · English (Advanced)', title: 'Avoiding Redundancy',
      sub: 'Cut repeated or empty words',
      explain: [
        'Redundancy uses more words than needed (e.g., "past history", "free gift")',
        'Tight writing improves clarity'
      ],
      example: { problem: 'Fix: "The new innovation was introduced."', steps: [{ t: 'innovation is already new', c: '' }, { t: 'The innovation was introduced.', c: '' }], answer: 'The innovation was introduced.' },
      tip: ['drop repeated meaning', 'one word enough'],
      practice: [
        { q: 'Redundant phrase: "advance planning" or "planning"', a: 'advance planning', hint: 'planning suffices' },
        { q: 'Fix: "The reason is because..."', a: 'The reason is that...', hint: 'because repeats reason' },
        { q: '"ATM machine" is redundant because', a: 'M stands for machine', hint: 'repeat' },
        { q: 'Tight writing improves', a: 'clarity', hint: 'clear' }
      ]
    },
    {
      id: 'eng-h39', tag: 'Lesson · English (Advanced)', title: 'Common Confusables',
      sub: 'Distinguish affect/effect, principle/principal, than/then',
      explain: [
        'Affect is usually a verb (to influence); effect is usually a noun (result)',
        'Principal is a person or main; principle is a rule'
      ],
      example: { problem: 'Choose: "The law will ___ many citizens."', steps: [{ t: 'influence as verb', c: '' }, { t: 'affect', c: '' }], answer: 'affect' },
      tip: ['affect = verb', 'effect = noun'],
      practice: [
        { q: 'Noun result: "The ___ was clear."', a: 'effect', hint: 'outcome' },
        { q: 'Head of school: "the ___ "', a: 'principal', hint: 'person' },
        { q: 'A rule or belief: "a basic ___ "', a: 'principle', hint: 'standard' },
        { q: 'Compare: "He is taller ___ his brother."', a: 'than', hint: 'comparison' }
      ]
    },
    {
      id: 'eng-h40', tag: 'Lesson · English (Advanced)', title: 'Spelling Patterns',
      sub: 'Apply common English spelling rules',
      explain: [
        'Doubling: stop -> stopped (short vowel + consonant before suffix)',
        'Silent e: make -> making (drop e before vowel); argue -> argument (drop e before consonant)'
      ],
      example: { problem: 'Spell: "occur" + "ed"', steps: [{ t: 'short stressed vowel + consonant', c: '' }, { t: 'occurred', c: '' }], answer: 'occurred' },
      tip: ['double after short vowel', 'drop e before vowel'],
      practice: [
        { q: 'Spell: "write" + "ing"', a: 'writing', hint: 'drop e' },
        { q: 'Spell: "plan" + "ed"', a: 'planned', hint: 'double n' },
        { q: 'Spell: "argue" + "ment"', a: 'argument', hint: 'drop e before consonant' },
        { q: 'Spell: "big" + "er"', a: 'bigger', hint: 'double g' }
      ]
    },
    {
      id: 'eng-h41', tag: 'Lesson · English (Advanced)', title: 'Skimming and Scanning',
      sub: 'Use the right reading technique for the task',
      explain: [
        'Skimming gives the general idea by reading headings and first sentences',
        'Scanning locates specific facts like names, dates, numbers'
      ],
      example: { problem: 'You need the date of an event fast. Use?', steps: [{ t: 'specific fact search', c: '' }, { t: 'scanning', c: '' }], answer: 'scanning' },
      tip: ['skim for gist', 'scan for facts'],
      practice: [
        { q: 'To get the main topic, use', a: 'skimming', hint: 'overview' },
        { q: 'To find a phone number, use', a: 'scanning', hint: 'specific' },
        { q: 'Skimming reads', a: 'headings and key sentences', hint: 'not all' },
        { q: 'Scanning ignores', a: 'most of the text', hint: 'seeks detail' }
      ]
    },
    {
      id: 'eng-h42', tag: 'Lesson · English (Advanced)', title: 'Summarizing',
      sub: 'Condense to the essential points only',
      explain: [
        'A summary keeps the main idea and key support, dropping examples and repetition',
        'It is shorter than the original and in your own words'
      ],
      example: { problem: 'Summarize in one line: "The new law took effect. It raised fines. It aimed to reduce speeding."', steps: [{ t: 'keep core: law, fines, goal', c: '' }, { t: 'The new law raised fines to reduce speeding.', c: '' }], answer: 'The new law raised fines to reduce speeding.' },
      tip: ['keep main idea', 'drop examples'],
      practice: [
        { q: 'A summary should be', a: 'shorter than the original', hint: 'condensed' },
        { q: 'Drop from a summary', a: 'minor examples', hint: 'not essential' },
        { q: 'Summarize: "The suspect fled. He was caught. He confessed."', a: 'The suspect fled, was caught, and confessed.', hint: 'core events' },
        { q: 'Use your own words when', a: 'summarizing', hint: 'not quoting' }
      ]
    },
    {
      id: 'eng-h43', tag: 'Lesson · English (Advanced)', title: 'Argument Structure',
      sub: 'Identify claim, reason, and evidence',
      explain: [
        'An argument has a claim (position), reasons (why), and evidence (support)',
        'A weak argument lacks evidence or has a gap between reason and claim'
      ],
      example: { problem: 'Which is evidence: "Studies show a 20% drop" or "Crime is bad"', steps: [{ t: 'evidence is factual support', c: '' }, { t: 'Studies show a 20% drop', c: '' }], answer: 'Studies show a 20% drop' },
      tip: ['claim = position', 'evidence = fact'],
      practice: [
        { q: 'The position stated is the', a: 'claim', hint: 'thesis' },
        { q: '"Because it saves money" is a', a: 'reason', hint: 'why' },
        { q: 'A claim without evidence is', a: 'weak', hint: 'unsupported' },
        { q: 'Statistics are a form of', a: 'evidence', hint: 'support' }
      ]
    },
    {
      id: 'eng-h44', tag: 'Lesson · English (Advanced)', title: 'Fact vs Opinion',
      sub: 'Separate verifiable statements from beliefs',
      explain: [
        'A fact can be checked and proven; an opinion is a judgment or preference',
        'Words like "should", "best", "beautiful" often signal opinion'
      ],
      example: { problem: 'Which is a fact: "The law passed on May 1" or "The law is fair"', steps: [{ t: 'verifiable date', c: '' }, { t: 'The law passed on May 1', c: '' }], answer: 'The law passed on May 1' },
      tip: ['fact = checkable', 'opinion = judgment'],
      practice: [
        { q: '"Chocolate is the best flavor" is', a: 'opinion', hint: 'best = judgment' },
        { q: '"The population is 70 million" is', a: 'fact', hint: 'verifiable' },
        { q: 'Word signaling opinion', a: 'should', hint: 'judgment' },
        { q: 'Distinguishing fact/opinion helps', a: 'evaluate sources', hint: 'critical reading' }
      ]
    },
    {
      id: 'eng-h45', tag: 'Lesson · English (Advanced)', title: 'Bias and Tone in News',
      sub: 'Detect slant in reporting',
      explain: [
        'Bias appears through word choice, omission, and framing',
        'Compare sources to see what is emphasized or left out'
      ],
      example: { problem: 'Two reports: one calls a group "freedom fighters", another "rebels". What differs?', steps: [{ t: 'same facts, different labels', c: '' }, { t: 'tone and framing show bias', c: '' }], answer: 'tone and framing show bias' },
      tip: ['watch labels', 'check omissions'],
      practice: [
        { q: 'Calling a protest "riot" may show', a: 'bias', hint: 'loaded label' },
        { q: 'To detect bias, do', a: 'compare sources', hint: 'multiple' },
        { q: 'Framing means', a: 'how facts are presented', hint: 'angle' },
        { q: 'Omitting key context is a form of', a: 'bias', hint: 'slant' }
      ]
    },
    {
      id: 'eng-h46', tag: 'Lesson · English (Advanced)', title: 'Multiple-Meaning Words',
      sub: 'Pick the right sense from context',
      explain: [
        'Many English words have several meanings (e.g., "charge" = accuse, cost, attack)',
        'Only context decides which sense fits'
      ],
      example: { problem: '"The officer will charge him." Charge means?', steps: [{ t: 'legal context', c: '' }, { t: 'accuse formally', c: '' }], answer: 'accuse formally' },
      tip: ['read whole sentence', 'list possible senses'],
      practice: [
        { q: '"The battery has no charge." Charge means', a: 'electricity', hint: 'power' },
        { q: '"There is no charge for entry." Charge means', a: 'fee', hint: 'cost' },
        { q: 'Multiple meanings resolved by', a: 'context', hint: 'situation' },
        { q: '"The knight made a charge." Charge means', a: 'attack', hint: 'military' }
      ]
    },
    {
      id: 'eng-h47', tag: 'Lesson · English (Advanced)', title: 'Synthesizing Across Texts',
      sub: 'Combine information from two passages',
      explain: [
        'Synthesis draws a joint conclusion from separate sources',
        'It goes beyond summary by connecting ideas across texts'
      ],
      example: { problem: 'Source A: crime rose. Source B: patrols increased. Synthesis?', steps: [{ t: 'connect cause and response', c: '' }, { t: 'Patrols were increased in response to rising crime.', c: '' }], answer: 'Patrols were increased in response to rising crime.' },
      tip: ['find relation', 'state joint point'],
      practice: [
        { q: 'Synthesis differs from summary by', a: 'connecting sources', hint: 'across texts' },
        { q: 'Source A: rains came. Source B: river rose. Synthesis?', a: 'The river rose because of the rains.', hint: 'cause' },
        { q: 'Synthesis requires', a: 'at least two sources', hint: 'more than one' },
        { q: 'A good synthesis states a', a: 'joint conclusion', hint: 'combined idea' }
      ]
    }
  ];

  if (typeof OTHER_TOPICS !== 'undefined' && OTHER_TOPICS.eng) {
    OTHER_TOPICS.eng = OTHER_TOPICS.eng.concat(EXTRA_ENG);
  }
})();
