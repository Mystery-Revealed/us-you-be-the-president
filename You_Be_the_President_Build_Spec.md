# "You Be the President" — Build Specification
### Unit 4 Game · 8th Grade U.S. History · Early Republic and Age of Jackson

**Purpose:** A build-ready spec to paste into Claude (Fable, Opus, Sonnet): build, deploy on Render via GitHub, embed in Wix. Engine, Command Center, and workflow per the **US History Common Build Standards**; this spec covers only what's unique.

> **Reading-level rule (everything the student sees):** 8th grade content at a **5th grade reading level**. Short sentences, common words, define hard terms on first use.

> **Data method:** the **shared Socket.IO engine, solo mode**. One adapter: `usYouBeThePresident.js` (`gameId: 'us-you-be-the-president'`).

> **The design's engine:** seven real crises in order, **Washington through Jackson**, three choices each. A choice is "right" when it matches **what the real president actually decided** — then a "What Really Happened" card reveals his decision, reasons, and outcome. Accuracy means knowing the history, not agreeing with it. Some accurate choices go badly (the Embargo); that split is the lesson.

---

## 1. Game at a Glance

| Field | Value |
|---|---|
| **Title** | You Be the President |
| **Unit** | 4 — Early Republic and Age of Jackson (1789–1837) |
| **TEKS** | 8.5A–H (one bullet per crisis, Whiskey Rebellion through Nullification), 8.17B (federal supremacy), 8.22A (leadership), 8.31B (problem solving) |
| **Pick** | **None — one class-wide group** |
| **Type** | Solo decision game — 7 crises × 1 decision = **7 graded actions** |
| **Playtime** | 8–12 minutes; replayable |
| **Platform / tracking** | Shared engine solo mode; Teacher Command Center; session-only data |
| **Art style** | Semi-realistic / cinematic, cool navy grading |

**One-sentence pitch:** Take the oath seven times — face the Whiskey Rebellion, the XYZ bribe, Napoleon's land offer, the Embargo, the vote for war, the Missouri crisis, and South Carolina's defiance — and learn whether your instincts match the men who sat in the chair.

---

## 2. Historical Content Bank

The spine, from the unit source doc:

| # | Year | President | Crisis | The real decision |
|---|---|---|---|---|
| 1 | 1794 | Washington | Whiskey Rebellion — farmers resist the excise tax | Led 12,950 militia west; rebellion collapsed without a shot |
| 2 | 1797–98 | Adams | XYZ Affair — agents demand a ~$250,000 bribe + loan | Refused; built a navy; fought the Quasi-War at sea while seeking peace (won: Convention of 1800) |
| 3 | 1803 | Jefferson | Napoleon offers ALL of Louisiana — 827,000 sq mi, $15M, ~4¢/acre; the Constitution is silent on buying land | Bought it; drafted an amendment, then dropped it |
| 4 | 1807 | Jefferson | Impressment; the *Chesapeake–Leopard* attack; war fever | Embargo Act — halted ALL foreign trade; failed, repealed 1809; factories grew |
| 5 | 1812 | Madison | Impressment continues; Britain arms Tecumseh's confederacy; War Hawks demand action | Asked Congress to declare war on Britain |
| 6 | 1819–20 | Monroe | Missouri as a slave state breaks the 11–11 Senate balance | Signed Clay's compromise: Missouri slave + Maine free + no slavery north of 36°30′ |
| 7 | 1832–33 | Jackson | South Carolina nullifies the tariff, threatens secession | Warships + Force Bill AND Clay's compromise tariff; South Carolina backed down |

**People for the cards:** Hamilton, Pinckney, Monroe & Livingston, Tecumseh, Henry Clay (compromiser, twice), Calhoun (War Hawk turned nullifier — Jackson's own VP).

**Vocabulary (define on first use):** *excise tax* — a tax on a product made at home. *tribute* — money paid to avoid trouble. *embargo* — a government stop on trade. *impressment* — kidnapping sailors into a navy. *nullification* — a state claiming it can cancel a federal law.

---

## 3. Core Mechanics

**Meters (0–100, start 50):** **Approval** 📣 (the people's mood) · **Union** 🏛️ (holding together) · **Peace** 🕊️ (distance from war and ruin).

**Structure:** 7 crises in order, one three-choice decision each = **7 graded actions**. Right = 1, partial = 0.5, wrong = 0; accuracy = points ÷ 7 × 100, server-side. Round flow: crisis brief (date, situation, advisor whispers) → choice → verdict + effects + feedback → **"What Really Happened" reveal card** → next.

**Endings:** meter sum → **"A Steady Hand"** (≥180) / **"The Republic Survives You"** (100–179) / **"A Rough Term in Office"** (<100), then the accuracy debrief, crisis by crisis. Closing line: the office Washington invented on "untrodden ground" had become, by Jackson, a weapon of the popular will — and Jefferson's fire bell still rang.

**Honest-scoring note:** meters are drama; accuracy is the grade. Choosing the Embargo is *right* and still tanks Approval — the game says so out loud.

---

## 4. Reference Content — the Answer Key (all 7 steps)

Feedback voice: a dry, loyal chief clerk; text models the 5th grade level.

### Crisis 1 — The Whiskey Rebellion (Washington, 1794)
*Farmers in western Pennsylvania attack tax collectors over the whiskey tax. Under the Articles, Shays' rebels went unanswered. All eyes on you.*
- **A) Call up an overwhelming militia and lead it west yourself.** ✅ (Union +15, Approval +5) — *"Exactly Washington: 12,950 men, the President on horseback. The rebellion melted without a shot. Federal law is real now."*
- **B) Send peace commissioners and wait.** ⚠️ (Union −5, Peace +5) — *"Half right — Washington did send talkers first. When talk failed, he marched. History remembers the march."*
- **C) Repeal the tax — not worth blood.** ❌ (Union −15, Approval +5) — *"Back down and every unpopular law becomes optional. (The tax did die later, under Jefferson.)"*

### Crisis 2 — The XYZ Affair (Adams, 1797)
*Agents "X, Y, and Z" demand a $250,000 bribe and a loan before France will talk. French ships are already seizing ours.*
- **A) Refuse. Build a navy. Fight at sea if forced — but keep the peace door open.** ✅ (Peace +5, Union +10) — *"Adams's path. 'Millions for defense, but not one cent for tribute!' The Quasi-War stayed at sea; in 1800 he got his peace — his proudest act."*
- **B) Pay quietly — cheaper than warships.** ❌ (Approval −15, Union −10) — *"Pinckney answered for the country: 'No, no, not a sixpence!' Tribute invites every empire to shake you down."*
- **C) Ask Congress for full war on France.** ⚠️ (Peace −15, Approval +10) — *"Most of Adams's own party roared for this. He refused — knowing he held back is the point."*

### Crisis 3 — The Louisiana Offer (Jefferson, 1803)
*You sent Monroe to buy New Orleans for $10 million. Napoleon — broke, beaten by the revolution in Haiti — counters: ALL of Louisiana for $15 million. Your career rests on the Constitution's exact words; it never mentions buying land.*
- **A) Buy it all, now, before he changes his mind.** ✅ (Union +15, Approval +10) — *"Jefferson swallowed his doubts and doubled the country for about four cents an acre — 'a fugitive occurrence' that would not come twice."*
- **B) Draft a constitutional amendment first.** ⚠️ (Union +5) — *"He actually wrote one! Then advisors warned Napoleon might pull the deal. He dropped it and took the land."*
- **C) Refuse — your orders said New Orleans only.** ❌ (Approval −10, Union −10) — *"Principled — and it parks a French empire on your border. Nobody is remembered for the land he didn't buy."*

### Crisis 4 — The Embargo Question (Jefferson, 1807)
*A British warship fired on the USS Chesapeake — three dead, four dragged off. The country wants war. The navy isn't ready.*
- **A) Stop ALL American trade until they respect us.** ✅ (Peace +10, Approval −15) — *"The Embargo Act — 'peaceable coercion.' You scored the point: he chose it. It was also a disaster — New England's ports went silent; Britain barely noticed. Accurate is not the same as wise."*
- **B) Declare war on Britain now.** ❌ (Peace −20) — *"Jefferson refused a war the nation couldn't fight in 1807. His successor got it anyway — five years later."*
- **C) Cut off trade with Britain and France only.** ⚠️ (Approval +5) — *"Exactly what Congress switched to in 1809, after the full embargo flopped. Two years early — half credit."*

### Crisis 5 — The War Question (Madison, 1812)
*Impressment never stopped. Orders in Council strangle trade; British guns arm Tecumseh's confederacy. Clay's War Hawks pound the table.*
- **A) Ask Congress to declare war on Great Britain.** ✅ (Approval +10, Peace −15) — *"Madison's choice, June 1812 — the first declared war in U.S. history. It brings the burning of this house, then Fort McHenry, New Orleans, and a nation that finally feels like one."*
- **B) Try one more round of trade pressure.** ⚠️ (Peace +5, Approval −10) — *"Madison spent three years on trade tricks. By 1812 the cupboard was bare — but this was at least his instinct."*
- **C) Ally with Napoleon's France against Britain.** ❌ (Union −15) — *"Washington's Farewell Address warned against exactly this. No president chained the republic to Napoleon."*

### Crisis 6 — The Missouri Crisis (Monroe, 1820)
*Missouri wants in as a slave state. The Senate stands 11 free, 11 slave. Congress is deadlocked; members talk disunion.*
- **A) Back Clay's package: Missouri with slavery, Maine free, slavery banned north of 36°30′.** ✅ (Union +15, Approval +5) — *"Monroe signed it. The Union held — for thirty years. Old Jefferson heard 'a fire bell in the night.' The deal postponed the question of slavery; it could not answer it."*
- **B) Back the Tallmadge plan: Missouri enters only if slavery there is put on the road to ending.** ⚠️ (Union −10, Approval −5) — *"The House passed exactly this — and the Senate killed it. A moral stand, but never a bill Monroe could sign."*
- **C) Veto anything touching slavery — not the president's business.** ❌ (Union −15) — *"Hiding solves nothing. Monroe engaged, and signed."*

### Crisis 7 — Nullification (Jackson, 1832)
*South Carolina declares the federal tariff "null and void" and threatens to leave the Union. The nullifiers' champion: your own vice president, Calhoun.*
- **A) Show force AND deal: warships to Charleston and a Force Bill, while accepting Clay's slow tariff cut.** ✅ (Union +20) — *"Both of Jackson's fists. South Carolina took the deal. 'Our Federal Union: It must be preserved!' No state may cancel federal law — a question that returns in 1861."*
- **B) Let South Carolina ignore the tariff — states can judge the Union's laws.** ❌ (Union −20) — *"Jackson, a states' rights man, called this treason. Lose here and the Union is a suggestion."*
- **C) March the army in and hang the nullifiers.** ⚠️ (Union +5, Peace −15) — *"Jackson TALKED like this — he privately threatened to hang Calhoun. What he did was smarter: force in one hand, compromise in the other. Bluster isn't policy."*

---

## 5. Screens & UI Flow

1. **Title** — the President's desk at night; federal navy gradient (`#1B2A4A → #10203C`), brass-gold seal accent (`#C9A227`). Tagline: "Seven crises. Seven real presidents. Your call first."
2. **Join** — standard code + name flow.
3. **Crisis loop** — white card on cool paper white (`#F5F7FA`): date stamp, crisis art, brief, three steel-blue (`#2E74B5`) choice buttons; meters as labeled bars.
4. **Resolution** — verdict flash (deep green `#2F7D4F` / gold partial / crimson `#B23A48`), feedback, then the **reveal card**: portrait chip, real decision, reason, outcome. The two-beat rhythm (your call → history's call) is the money moment.
5. **Ending** — tier title, meters, accuracy debrief table (crisis · your call · his call), replay button.

**Union Blue throughout; no tan/parchment UI.** Parchment only *inside* illustrations.

## 6. Engine Integration

- **Adapter:** `server/src/games/usYouBeThePresident.js` via `createStepGame`; register in `games/index.js`. **Mode: solo**, no variants, `totalActions: 7`, meters `{ approval, union, peace }` start 50.
- Each resolution carries `feedback` **plus a `reveal` field** (the What-Really-Happened copy). If the factory passes only `feedback`, concatenate with a delimiter the client splits — or extend the step schema (flag Opus).
- Everything else is stock engine.

## 7. Visual & Audio Assets (Higgsfield MCP)

**Art direction (prepend):** *Semi-realistic cinematic historical illustration, 1789–1837 America. Cool natural light, painterly, dignified, era-correct. No text, no logos. 16:9.*

| # | Asset | Prompt sketch |
|---|---|---|
| 1 | Title / hero | "A president's writing desk by candlelight, dispatch box, quill, folded map, tall night window." |
| 2 | Crisis 1 | "Militia columns and a general on a white horse crossing rainy Pennsylvania hills, 1794 — no combat." |
| 3 | Crisis 2 | "Three American envoys in a gilded Paris antechamber, shadowy officials beyond a cracked door, 1797." |
| 4 | Crisis 3 | "An enormous map of Louisiana unrolled across a table, hands and magnifying glass, 1803." |
| 5 | Crisis 4 | "American merchant ships idle at a New England wharf, sails furled, gray morning, 1807." |
| 6 | Crisis 5 | "The Capitol under storm clouds, messengers hurrying up the steps, 1812." |
| 7 | Crisis 6 | "The Senate mid-debate, maps of Missouri and Maine, divided benches, 1820 — no caricature." |
| 8 | Crisis 7 | "Charleston harbor at dawn, U.S. warships at anchor beyond the palmettos, 1832." |
| 9 | *(Optional)* ambience | Quill-scratch, distant harbor bells; muted by default. |

## 8. Model Workflow

Standard order (Fable → Opus → Higgsfield → Sonnet). Deltas: **Fable-heavy on the seven reveal cards** — they carry the teaching load; **Opus** adds the `reveal` pass-through and debrief table.

## 9. Teacher Command Center

Standard; one class-wide group. PDF: Students (Name · Status · Accuracy %) + **per-crisis class accuracy** (which crisis fooled the class — discussion fuel). Footer: "Made for 8th Grade U.S. History · TEKS 8.5A–H, 8.17B, 8.22A, 8.31B."

## 10. Build Checklist & Test Plan (delta)

- [ ] All 7 steps match Section 4; verdicts cross-checked against Section 2
- [ ] Reveal card renders after every resolution, right or wrong
- [ ] Embargo case: choosing A scores 1.0 while Approval drops — meters and grade diverge
- [ ] All-right = 100%, all-wrong = 0% server-verified
- [ ] Per-crisis class accuracy in Command Center + PDF
- [ ] Chronology locked 1→7
- [ ] Palette check: zero tan surfaces; verdict colors per Standards §2

## 11. Teacher / Sensitivity Notes

- **Crisis 6 is about slavery and says so plainly.** The card names enslaved people as people, not a "balance" abstraction; the reveal says the Compromise postponed, not solved. Never present 36°30′ as a happy ending.
- **Accuracy ≠ endorsement** (Standards §10.3): students earn the point for knowing Jackson's dual-track answer while the debrief notes the same era produced Indian Removal — see the unit's Trail app, which this game does not gamify.
- War choices graded soberly; no glory language or combat imagery (Standards §6).

---
*Companion to the Unit 4 apps (Hall of the First Seven Presidents, Precedent Maker, Supreme Court Case Files, War of 1812 Story Map, The Trail Where They Cried) and games (Corps of Discovery, Cabinet Battle, Jackson: Hero or Villain?). Shared engine, Union Blue palette, same GitHub → Render/Pages → Wix workflow.*
