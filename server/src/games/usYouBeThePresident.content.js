// usYouBeThePresident.content.js — THE ANSWER KEY. Seven real crises,
// Washington through Jackson, three choices each (spec §4). This file holds
// everything that decides a GRADE: the prompt, the three labels, the verdict,
// the meter effects, the feedback line, and the "What Really Happened" reveal
// card. Scene-setting prose lives in usYouBeThePresident.copy.js, deliberately
// separated so a polish pass on the writing can never drift the grading.
//
// THE RULE THAT DEFINES "RIGHT" (spec §0): a choice is right when it matches
// what the real president ACTUALLY DECIDED — not when it is the kindest, the
// bravest, or the one that worked. Crisis 4 is the proof: choosing the Embargo
// scores a full point AND costs 15 Approval, because Jefferson chose it and it
// was a disaster. Accuracy means knowing the history, not agreeing with it.
//
// Every verdict, effect, and feedback line below is transcribed from spec §4;
// the reveal cards are new writing built on spec §2's table. Reading level:
// 8th-grade content at a 5th-grade level (Common Standards §3).

// Every crisis carries a `reveal` — the two-beat payoff (your call, then
// history's call). It hangs on the CRISIS, not the choice: the real president
// made one real decision, so a student who missed it sees the same card as a
// student who matched it. `note` is an optional accuracy aside — the small
// true thing that corrects a famous half-truth, or names a cost the headline
// leaves out.

export const CRISES = [
  // -------------------------------------------------------------------------
  {
    id: 'whiskey',
    title: 'The Whiskey Rebellion',
    date: '1794',
    image: 'crisis_whiskey.webp',
    president: 'George Washington',
    prompt: 'Western Pennsylvania is in open revolt against the whiskey tax. What do you do?',
    choices: [
      {
        label: 'Call up an overwhelming militia and lead it west yourself.',
        verdict: 'right',
        effects: { union: 15, approval: 5 },
        feedback: 'Exactly Washington. He called up 12,950 men and rode out at the head of them. The rebellion melted without a shot. Federal law is real now.',
      },
      {
        label: 'Send peace commissioners and wait.',
        verdict: 'partial',
        effects: { union: -5, peace: 5 },
        feedback: 'Half right — Washington did send talkers first. When talk failed, he marched. History remembers the march.',
      },
      {
        label: 'Repeal the tax. It is not worth blood.',
        verdict: 'wrong',
        effects: { union: -15, approval: 5 },
        feedback: 'Back down and every unpopular law becomes optional. (The tax did die later, under Jefferson — but by a vote, not by a riot.)',
      },
    ],
    reveal: {
      president: 'George Washington',
      years: '1789–1797',
      initials: 'GW',
      decision: 'He called up 12,950 militia — more soldiers than he ever commanded in the Revolution — and rode west with them himself.',
      reason: 'He had already tried talking. Peace commissioners went out and came back with nothing. Washington believed a law nobody has to obey is not a law at all, and that this brand-new government had to prove it could act.',
      outcome: 'The rebellion melted away before the army arrived. Not one shot was fired. About twenty men were arrested and two were convicted. Washington pardoned them both.',
      note: 'He rode west as far as Bedford, Pennsylvania, reviewed the army there, and handed command to General Henry Lee. No president has led troops in the field since.',
    },
  },

  // -------------------------------------------------------------------------
  {
    id: 'xyz',
    title: 'The XYZ Affair',
    date: '1797',
    image: 'crisis_xyz.webp',
    president: 'John Adams',
    prompt: 'France demands a bribe before it will even talk. French ships are seizing ours. What do you do?',
    choices: [
      {
        label: 'Refuse. Build a navy. Fight at sea if forced — but keep the peace door open.',
        verdict: 'right',
        effects: { peace: 5, union: 10 },
        feedback: 'Adams\'s path. The country shouted "Millions for defense, but not one cent for tribute!" The Quasi-War stayed at sea, and in 1800 he got his peace — the act he was proudest of.',
      },
      {
        label: 'Pay quietly. It is cheaper than warships.',
        verdict: 'wrong',
        effects: { approval: -15, union: -10 },
        feedback: 'Pinckney answered for the country in that Paris room: "No, no, not a sixpence!" Pay tribute once and every empire lines up to shake you down.',
      },
      {
        label: 'Ask Congress for full war on France.',
        verdict: 'partial',
        effects: { peace: -15, approval: 10 },
        feedback: 'Most of Adams\'s own party roared for exactly this. He refused. Knowing that he held back is the point.',
      },
    ],
    reveal: {
      president: 'John Adams',
      years: '1797–1801',
      initials: 'JA',
      decision: 'He refused to pay, published the whole insulting report for everyone to read, and built a real navy — but he never asked for war.',
      reason: 'Adams thought a country that pays once will be asked forever. He also knew America could not win a land war against France. So he chose both things at once: fight at sea if forced, and keep talking the entire time.',
      outcome: 'The Quasi-War stayed at sea for two years. Then Adams sent new envoys to France, against his own party\'s wishes, and won the Convention of 1800. It probably cost him a second term. He called it the proudest act of his life.',
      note: 'That famous line — "Millions for defense, but not one cent for tribute!" — was a toast raised at a dinner back home, not something Pinckney said in Paris. What he actually said was shorter: "No, no, not a sixpence!"',
    },
  },

  // -------------------------------------------------------------------------
  {
    id: 'louisiana',
    title: 'The Louisiana Offer',
    date: '1803',
    image: 'crisis_louisiana.webp',
    president: 'Thomas Jefferson',
    prompt: 'Napoleon offers all of Louisiana for $15 million. The Constitution never mentions buying land. What do you do?',
    choices: [
      {
        label: 'Buy it all, now, before he changes his mind.',
        verdict: 'right',
        effects: { union: 15, approval: 10 },
        feedback: 'Jefferson swallowed his doubts and doubled the country for about four cents an acre. He called the offer "a fugitive occurrence" — a chance that would not come twice.',
      },
      {
        label: 'Draft a constitutional amendment first.',
        verdict: 'partial',
        effects: { union: 5 },
        feedback: 'He actually wrote one! Then advisors warned that Napoleon might pull the deal. He dropped the amendment and took the land.',
      },
      {
        label: 'Refuse. Your orders to Monroe said New Orleans only.',
        verdict: 'wrong',
        effects: { approval: -10, union: -10 },
        feedback: 'Principled — and it parks a French empire on your border. Nobody is remembered for the land he did not buy.',
      },
    ],
    reveal: {
      president: 'Thomas Jefferson',
      years: '1801–1809',
      initials: 'TJ',
      decision: 'He bought all of it — about 827,000 square miles for $15 million — and let the constitutional question go.',
      reason: 'He really did write a constitutional amendment first, because he believed he needed one. Then word came that Napoleon was having second thoughts. Jefferson called the offer "a fugitive occurrence" — a chance that runs past you once — and let the amendment drop.',
      outcome: 'The Senate approved the treaty in October 1803. The country doubled in size for about four cents an acre. It also handed the next forty years a much harder question: would slavery be allowed in all that new land? Crisis six is that question arriving.',
      note: 'Napoleon sold cheap because his army in Haiti had been destroyed — by yellow fever and by the enslaved people who fought and freed themselves there. Louisiana was a bargain because Haiti was not.',
    },
  },

  // -------------------------------------------------------------------------
  {
    id: 'embargo',
    title: 'The Embargo Question',
    date: '1807',
    image: 'crisis_embargo.webp',
    president: 'Thomas Jefferson',
    prompt: 'The country is shouting for war. Your navy is not ready. What do you do?',
    choices: [
      {
        label: 'Stop ALL American trade until they respect us.',
        verdict: 'right',
        effects: { peace: 10, approval: -15 },
        feedback: 'The Embargo Act — Jefferson called it "peaceable coercion." You scored the point, because he chose it. It was also a disaster: New England\'s ports went silent and Britain barely noticed. Accurate is not the same as wise.',
      },
      {
        label: 'Declare war on Britain now.',
        verdict: 'wrong',
        effects: { peace: -20 },
        feedback: 'Jefferson refused a war the country could not fight in 1807. His successor got that war anyway — five years later.',
      },
      {
        label: 'Cut off trade with Britain and France only.',
        verdict: 'partial',
        effects: { approval: 5 },
        feedback: 'Exactly what Congress switched to in 1809, after the full embargo flopped. You are two years early — half credit.',
      },
    ],
    reveal: {
      president: 'Thomas Jefferson',
      years: '1801–1809',
      initials: 'TJ',
      decision: 'He chose the Embargo Act. In December 1807 he stopped every American ship from trading with any foreign country at all.',
      reason: 'He called it "peaceable coercion" — squeezing Britain and France with money instead of guns. He believed they needed American food and cotton badly enough to back down, and he knew sixteen warships could not beat the Royal Navy.',
      outcome: 'It failed. Britain hardly felt it. New England harbors filled with ships that could not sail, and sailors, dockworkers, and merchants lost everything. Smuggling exploded. Congress repealed it in March 1809. One thing did grow: American factories, because Americans could no longer buy British goods.',
      note: 'This is the crisis that shows what accuracy means here. Matching Jefferson earns a full point AND costs you Approval. Knowing what a president really did is not the same as saying he was right.',
    },
  },

  // -------------------------------------------------------------------------
  {
    id: 'war1812',
    title: 'The War Question',
    date: '1812',
    image: 'crisis_war1812.webp',
    president: 'James Madison',
    prompt: 'Britain will not stop taking American sailors. What do you ask Congress to do?',
    choices: [
      {
        label: 'Ask Congress to declare war on Great Britain.',
        verdict: 'right',
        effects: { approval: 10, peace: -15 },
        feedback: 'Madison\'s choice, June 1812 — the first declared war in United States history. It brings the burning of this house, then Fort McHenry and New Orleans, and a country that finally feels like one country.',
      },
      {
        label: 'Try one more round of trade pressure.',
        verdict: 'partial',
        effects: { peace: 5, approval: -10 },
        feedback: 'Madison spent three years on trade tricks — this really was his instinct. By 1812 the cupboard was bare.',
      },
      {
        label: 'Ally with Napoleon\'s France against Britain.',
        verdict: 'wrong',
        effects: { union: -15 },
        feedback: 'Washington\'s Farewell Address warned against exactly this. No president ever chained the republic to Napoleon.',
      },
    ],
    reveal: {
      president: 'James Madison',
      years: '1809–1817',
      initials: 'JM',
      decision: 'He asked Congress to declare war on Great Britain. On June 18, 1812, Congress said yes.',
      reason: 'He had spent three years trying to win with trade pressure — the embargo, then other trade laws — and none of it worked. Madison said the country had to choose between fighting and giving up its rights at sea for good.',
      outcome: 'It was the closest war vote in American history: 79 to 49 in the House, 19 to 13 in the Senate. British troops burned this house in 1814. Then came Fort McHenry and the song written there, and Andrew Jackson at New Orleans. On paper the war settled almost nothing. It left Americans feeling like one country for the first time.',
      note: 'Two costs the headline hides. Britain had already cancelled the Orders in Council on June 23, five days after the vote. The news had to cross the ocean by sailing ship, and the ship was too slow. And Tecumseh was killed in battle in 1813. With him died the best hope for a Native homeland east of the Mississippi.',
    },
  },

  // -------------------------------------------------------------------------
  {
    id: 'missouri',
    title: 'The Missouri Crisis',
    date: '1820',
    image: 'crisis_missouri.webp',
    president: 'James Monroe',
    prompt: 'The Senate is tied and members are talking about leaving the Union. What do you do?',
    choices: [
      {
        label: 'Back Clay\'s package: Missouri with slavery, Maine free, slavery banned north of 36°30′.',
        verdict: 'right',
        effects: { union: 15, approval: 5 },
        feedback: 'Monroe signed it. The Union held — for thirty years. Old Jefferson said the news woke him "like a fire bell in the night." The deal pushed the question of slavery down the road. It could not answer it.',
      },
      {
        label: 'Back the Tallmadge plan: Missouri enters only if slavery there is put on the road to ending.',
        verdict: 'partial',
        effects: { union: -10, approval: -5 },
        feedback: 'The House passed exactly this — and the Senate killed it. A moral stand, but never a bill Monroe could sign.',
      },
      {
        label: 'Veto anything touching slavery. It is not the president\'s business.',
        verdict: 'wrong',
        effects: { union: -15 },
        feedback: 'Hiding solves nothing, and silence is its own answer. Monroe engaged, and signed.',
      },
    ],
    reveal: {
      president: 'James Monroe',
      years: '1817–1825',
      initials: 'JM',
      decision: 'He signed Henry Clay\'s compromise in March 1820. Missouri came in as a slave state and Maine came in free. In the rest of the Louisiana Purchase, slavery was banned north of the line 36°30′.',
      reason: 'Monroe believed the Union would break apart without a deal, and he did not believe a president had the power to end slavery inside a state. He counted the votes and signed.',
      outcome: 'The Senate stayed balanced and the country held together for thirty more years. Nothing was solved. Slavery was not ended anywhere it already existed, and the tens of thousands of men, women, and children held in it stayed held. Thomas Jefferson, old now, read the news in Virginia and said it woke him "like a fire bell in the night." He was right. Congress erased the line in 1854, and the argument became the Civil War.',
      note: 'Do not read 36°30′ as a happy ending. It was a deal about people\'s lives, made by men who mostly agreed not to talk about it.',
    },
  },

  // -------------------------------------------------------------------------
  {
    id: 'nullification',
    title: 'Nullification',
    date: '1832',
    image: 'crisis_nullification.webp',
    president: 'Andrew Jackson',
    prompt: 'South Carolina says it can cancel a federal law and leave the Union. What do you do?',
    choices: [
      {
        label: 'Show force AND deal: warships to Charleston and a Force Bill, while accepting Clay\'s slow tariff cut.',
        verdict: 'right',
        effects: { union: 20 },
        feedback: 'Both of Jackson\'s fists at once. South Carolina took the deal. "Our Federal Union: It must be preserved!" No state may cancel a federal law — a question that comes back in 1861.',
      },
      {
        label: 'Let South Carolina ignore the tariff. States can judge the Union\'s laws.',
        verdict: 'wrong',
        effects: { union: -20 },
        feedback: 'Jackson was a states\' rights man his whole life, and he called this treason. Lose here and the Union is only a suggestion.',
      },
      {
        label: 'March the army in and hang the nullifiers.',
        verdict: 'partial',
        effects: { union: 5, peace: -15 },
        feedback: 'Jackson TALKED like this — in private he threatened to hang Calhoun himself. What he did was smarter: force in one hand, compromise in the other. Bluster is not policy.',
      },
    ],
    reveal: {
      president: 'Andrew Jackson',
      years: '1829–1837',
      initials: 'AJ',
      decision: 'Both at once. He sent warships to Charleston and asked Congress for the Force Bill — permission to use the army to collect the tariff. At the very same time he let Henry Clay write a compromise tariff that would drop a little every year.',
      reason: 'Jackson believed in states\' rights his whole life. He did not believe a state could cancel a federal law or walk out of the Union. He also knew that shooting at South Carolina would be a catastrophe. So he offered a fist and a ladder together.',
      outcome: 'He signed the Force Bill and the compromise tariff on the same day in March 1833. South Carolina took the deal and cancelled its own nullification. John C. Calhoun had already resigned as vice president to fight it from the Senate. The question did not go away. In 1861, South Carolina left first.',
      note: 'Jackson really did talk about hanging people. In private he said he would hang Calhoun "as high as Haman." What he actually did was smarter than what he said.',
    },
  },
];

// The engine validates shape at startup, but these two are worth failing on
// loudly and immediately: seven crises, and exactly one right / one partial /
// one wrong in every set of three (spec §3 — right = 1, partial = 0.5,
// wrong = 0, so a duplicate verdict would quietly break the grade).
export const TOTAL_CRISES = CRISES.length;

for (const c of CRISES) {
  const counts = { right: 0, partial: 0, wrong: 0 };
  for (const ch of c.choices) counts[ch.verdict] = (counts[ch.verdict] ?? 0) + 1;
  if (counts.right !== 1 || counts.partial !== 1 || counts.wrong !== 1) {
    throw new Error(`usYouBeThePresident: crisis "${c.id}" must have exactly one right, one partial, and one wrong choice`);
  }
}
