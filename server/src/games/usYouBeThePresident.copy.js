// usYouBeThePresident.copy.js — every student-facing word that does NOT decide
// a grade: the crisis briefs, the advisors whispering in your ear, the three
// endings, the closing debrief, and the tap-for-plain-words vocabulary.
//
// Kept separate from usYouBeThePresident.content.js on purpose (the pattern
// Ratify It! established): a polish pass on the prose can never accidentally
// move a verdict or a meter.
//
// Voice: a dry, loyal chief clerk who has seen four administrations and is not
// impressed by any of them (spec §4). Reading level: 8th-grade content at a
// 5th-grade reading level — short sentences, common words, hard terms defined
// on first use (Common Standards §3).

export const COPY = {
  tagline: 'Seven crises. Seven real presidents. Your call first.',

  // -------------------------------------------------------------------------
  // The crisis briefs — the event card at the top of each round. Date, the
  // situation, and then the advisors, who disagree on purpose. No advisor is
  // simply "the right answer wearing a wig": in five of seven crises the loudest
  // voice in the room lost.
  // -------------------------------------------------------------------------
  briefs: {
    whiskey: {
      text: 'Congress put an excise tax on whiskey. Out past the mountains, farmers turn their corn into whiskey because a barrel is far easier to haul to market than a wagon of corn. They call the tax a robbery. Now they are attacking tax collectors and burning barns. Eight years ago, when farmers rebelled in Massachusetts, the old government could do nothing at all. Every eye in America is on you.',
      advisors: [
        { name: 'Alexander Hamilton', role: 'Secretary of the Treasury', line: 'It is my tax, sir, and it is the law. If they may ignore this one, they may ignore every word Congress writes.' },
        { name: 'Edmund Randolph', role: 'Attorney General', line: 'Send commissioners first. An army marching on farmers is what a king does.' },
      ],
    },
    xyz: {
      text: 'France is furious that we made peace with Britain, and French ships have seized hundreds of ours. You send three men to Paris to fix it. French agents meet them in secret and name a price: about $250,000 handed over, plus millions more as a loan, before France will even sit down. That is tribute — money paid to avoid trouble. The agents refuse to give their names, so your report to Congress calls them X, Y, and Z. When it is printed, the country goes wild.',
      advisors: [
        { name: 'Timothy Pickering', role: 'Secretary of State', line: 'War, sir. Your own party is begging for it and the people would carry you through the streets.' },
        { name: 'Elbridge Gerry', role: 'Envoy, writing from Paris', line: 'Stay at the table. Leave now and you get a war. Give me one more month and I may get you peace.' },
      ],
    },
    louisiana: {
      text: 'You sent James Monroe to Paris to join Robert Livingston. Their orders were narrow: buy New Orleans, the port every western farmer needs, for up to $10 million. Napoleon says no to that. He offers something else. All of Louisiana — about 827,000 square miles — for $15 million. That is roughly four cents an acre, and it would double the United States. There is one problem, and it is yours. You have spent your whole life saying the government may only do what the Constitution says it may do. The Constitution says nothing about buying land.',
      advisors: [
        { name: 'Albert Gallatin', role: 'Secretary of the Treasury', line: 'The treaty power is right there in the Constitution, sir. A treaty may buy land. Sign it.' },
        { name: 'Robert Livingston', role: 'Minister to France, writing from Paris', line: 'He is broke this week. Haiti destroyed his army and emptied his treasury. Next week he may not be broke, and this offer will be gone.' },
      ],
    },
    embargo: {
      text: 'For years British warships have stopped American ships at sea and dragged sailors off to serve in the British navy. That is impressment. Now it is worse. In June the British warship Leopard fired on the USS Chesapeake — a ship of our own navy — killing three men and carrying four more away. Crowds are burning British flags in every port. The country wants war. You count your warships. You have sixteen. Britain has hundreds.',
      advisors: [
        { name: 'James Madison', role: 'Secretary of State', line: 'Trade is our weapon, sir. They need our food and cotton more than we need their cloth. Squeeze them and they will bend.' },
        { name: 'Albert Gallatin', role: 'Secretary of the Treasury', line: 'I must say it plainly, sir. A total stop on trade will be very hard to enforce. It will hurt our own people long before it hurts theirs.' },
      ],
    },
    war1812: {
      text: 'Impressment never stopped. British rules called the Orders in Council are strangling our trade. In the west, British guns are reaching Tecumseh\'s confederacy — an alliance of Native nations defending their homelands from settlers pushing in. In Congress, a group of young members called the War Hawks, led by Henry Clay of Kentucky, pound the table every day. Your army is small. Your navy is sixteen ships.',
      advisors: [
        { name: 'Henry Clay', role: 'Speaker of the House', line: 'Give me the militia of Kentucky alone, sir, and we will lay Canada at your feet before the snow.' },
        { name: 'The New England Federalists', role: 'in Congress', line: 'Our ships are the ones that will burn. Vote this war and we will not pay for it.' },
      ],
    },
    missouri: {
      text: 'Missouri asks to join the United States as a slave state. Right now the Senate is exactly even — eleven free states and eleven slave states — and Missouri would break the tie. Congress has argued for more than a year. Representative James Tallmadge of New York says Missouri may come in only if slavery there is put on a path to ending. Southern members answer that Congress has no such power, and some of them say out loud that their states will leave the Union. Behind every speech are real people: tens of thousands of enslaved men, women, and children whose lives this argument decides.',
      advisors: [
        { name: 'Henry Clay', role: 'Speaker of the House', line: 'Two states at once, sir — Missouri and Maine, one for each side. Then draw a line across the rest of the west and be done.' },
        { name: 'John Quincy Adams', role: 'Secretary of State', line: 'I will support the deal, and I will not pretend it is right. We are writing the first page of a very long tragedy.' },
      ],
    },
    nullification: {
      text: 'A tariff is a tax on goods coming in from other countries. It protects northern factories, and southern planters pay for it. South Carolina says this tariff is so unfair that the state may simply cancel it. In November the state declares the federal tariff null and void inside its borders. That is nullification. South Carolina adds a warning: send soldiers or ships, and the state will leave the Union. The man leading the nullifiers is John C. Calhoun. He is your own vice president.',
      advisors: [
        { name: 'Martin Van Buren', role: 'Secretary of State', line: 'Go carefully, General. Fire on Charleston and you hand them a martyr and the rest of the South with him.' },
        { name: 'Henry Clay', role: 'Senator from Kentucky', line: 'Let me write them a tariff that falls a little every year. Give a proud man a ladder and he will climb down it.' },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // Endings — by the sum of the three meters (spec §3). The tier is about how
  // the country FEELS at the end of your seven terms; the accuracy score right
  // below it is about what you actually knew. The game says so out loud.
  // -------------------------------------------------------------------------
  endings: {
    steady: {
      title: 'A Steady Hand',
      text: 'You leave the office stronger than you found it. The Union held through a tax revolt, a bribe, a war, and a state that swore it would walk out. People argued with you the whole way — that is the job — but nobody doubted there was a government. Washington called this ground "untrodden," meaning nobody had ever walked it. You walked it well.',
    },
    survives: {
      title: 'The Republic Survives You',
      text: 'The country is still here. That is not nothing — most new republics in 1789 did not last a generation. You made hard calls and some of them cost you. Ports went quiet, tempers stayed hot, and a few problems got handed to the next man instead of solved. Every real president did the same.',
    },
    rough: {
      title: 'A Rough Term in Office',
      text: 'You held the chair and the chair held. But the country is tired, the Union is thin, and the men who come after you inherit your unfinished business. Look at the table below before you judge yourself too hard. Sometimes a president loses the room and is still right. And sometimes, like Jefferson in 1807, he does exactly what history records and it still goes badly.',
    },
  },

  // -------------------------------------------------------------------------
  // The closing debrief (spec §3's closing line, at a 5th grade level) plus the
  // standing sensitivity note (spec §11.2 / Common Standards §10.3): the game
  // grades KNOWING what Jackson did in 1833 — it does not applaud what he did
  // in 1830, and it does not gamify it at all.
  // -------------------------------------------------------------------------
  debrief: {
    text: 'Washington said he was walking on "untrodden ground" — ground nobody had ever walked. There was no rulebook for being president, so each of these seven men wrote a little of it. By Jackson\'s day the office had changed shape. The president was no longer a quiet servant of Congress; he was the loudest voice of the people, and he used it like a weapon. Six of these seven crises got settled, one way or another. The seventh did not. Jefferson\'s fire bell was still ringing.',
    note: 'One thing this game does not score. The same Andrew Jackson who held the Union together in 1833 signed the Indian Removal Act in 1830. It forced the Cherokee, Muscogee, Choctaw, Chickasaw, and Seminole nations off their homelands. Thousands of people died on that road. It is not a decision to play with, so it is not in here. It has its own app: The Trail Where They Cried.',
  },

  // -------------------------------------------------------------------------
  // Tap-for-plain-words vocabulary (spec §2, Common Standards §3). The five
  // terms the spec names, plus `tariff` and `militia`, which the crisis briefs
  // cannot avoid.
  // -------------------------------------------------------------------------
  vocab: {
    'excise tax': 'A tax on something made right here at home, like whiskey.',
    tribute: 'Money paid to a stronger country so it will leave you alone.',
    embargo: 'A government order that stops trade with other countries.',
    impressment: 'Grabbing sailors off ships and forcing them into another country\'s navy.',
    nullification: 'A state claiming it can cancel a federal law inside its own borders.',
    tariff: 'A tax on goods brought in from another country.',
    militia: 'Ordinary citizens called up to serve as soldiers for a short time.',
  },
};
