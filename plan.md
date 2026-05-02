# Lantern Hollow — Fusion Plan

A cozy browser-based multiplayer ASCII game about building a quiet town and taking short lantern-lit extraction trips into strange caves.

---

## Pitch

Lantern Hollow is a top-down ASCII multiplayer game where players live in a calm overworld village built around an old lantern tree. By day, they prepare, craft, decorate, and contribute to town projects. When ready, they enter nearby caves to gather resources, discover relics, find seeds, and return before their lantern fades.

The core feeling is:

> "I'm going into the moss cave for copper and glowcaps. I'll be back before the lantern burns out."

The central tension is:

> "Do I have enough lantern left to check one more room?"

---

## Genre

- Cozy extraction-lite
- Top-down ASCII adventure
- Light town-building
- Multiplayer resource gathering
- Calm overworld + mysterious dungeons

---

## Inspirations

Pulls ideas from: Core Keeper, Stardew Valley, Caves of Qud, Dwarf Fortress Adventure Mode, Minecraft, Terraria, Starbound, Songs of Syx, Regions of Ruin, Forager.

Should avoid feeling like: Dwarf Fortress Fortress Mode, RimWorld, Oxygen Not Included, Age of Empires, The Sims.

---

## Comparable Game Complaint Lessons

Closest comparable games suggest the main risks are not the premise; they are friction and pacing. Lantern Hollow should explicitly avoid:

- **Grind without fresh decisions:** resources should support goals, not become a long material treadmill.
- **Unclear progression:** the town board must always tell players what matters next and why it matters.
- **Inventory/storage busywork:** returning from a cave should feel like relief and payoff, not chest sorting.
- **Rare RNG bottlenecks:** upgrade-critical resources must be guaranteed somewhere in a valid cave.
- **Procedural sameness:** caves need landmarks, route shapes, and risk/reward pockets, not only shuffled walls.
- **Solo/co-op imbalance:** solo should be viable; co-op should add shared discovery and split-route choices, not just faster hauling.
- **Weak long-term motivation:** even MVP should point toward a visible horizon, starting with the Lantern Workshop and later the Bell Tower.

Design response: keep the first upgrade short, make every project visibly change town, make cave runs vary by decisions rather than loot rarity, and treat UI friction as a balance problem.

---

## Core Pillars

### 1. Calm Overworld

The overworld is safe, readable, and cozy.

Players can:

- walk around town
- deposit resources
- craft simple tools
- decorate shared spaces
- contribute to town projects
- prepare for cave runs
- chat and plan with other players

Town should feel like home, not a management sim. Without NPCs in MVP, warmth comes through spatial changes: layout, player traces, signs, visible project progress, small rituals like preparing lanterns and checking the board.

### 2. Lantern Runs

Caves are short extraction-like dungeons. Players enter with a lantern, gather what they can, and return before the light fades.

The lantern acts as:

- a timer
- a vision radius
- a safety meter
- an extraction pressure mechanic

When the lantern runs low:

- vision shrinks
- cave danger increases
- navigation gets harder
- greed becomes tempting

**Failure should be gentle** — but gentle failure cannot be meaningless. Players do not permanently die. Instead, they may:

- lose some carried loot
- wake up back in town
- damage one item
- create a small town event

Gentle failures must have an upper bound so they don't stack into punishment: never lose equipped lantern, item damage is one tier only (cracked, not destroyed), town event should add atmosphere rather than penalize, and permanent town progress is never rolled back.

**Lantern tuning is the central mechanic.** Too short = stressful, not cozy. Too long = no extraction tension. The lantern should be tuned in real playtests before other systems are balanced around it.

### 3. Shared Town Growth

Town grows from what players bring back. Players contribute gathered resources to shared projects:

- Lantern Workshop
- Mushroom Kitchen
- Cartographer's Porch
- Old Well
- Bridge Repair
- Tool Shed
- Glow Garden
- Bell Tower
- Cave Lift

Town projects unlock new options without heavy simulation or micromanagement. Each early project should produce a **visible spatial change** and a **small mechanical unlock** — not just stat boosts.

**Soft long-term goal:** complete the Bell Tower. The Bell Tower is not required for MVP implementation, but it is the visible horizon the town board can tease from the start: "Bring enough light home to wake the bell." This gives repeated cave runs a purpose beyond stockpiling.

---

## Main Game Loop

```
Wake in town
  ↓
Check town board
  ↓
Prepare lantern, tools, and food
  ↓
Enter cave
  ↓
Gather, explore, and discover
  ↓
Extract before lantern fades
  ↓
Deposit resources
  ↓
Upgrade town
  ↓
Unlock new cave paths
  ↓
Repeat
```

**Town board spec:** the board is the goal surface. It shows the active project, exact missing resources, recent deposits/contributions, the unlock effect, and the visible town change. It also gives one next recommended action such as "need copper", "deposit at D", or "workshop complete".

---

## Multiplayer

Ideal player count: 1–4 MVP, 2–8 long-term.

Players share: town storage, discovered cave maps, town projects, signs and map markers, unlocked cave regions.

Players should naturally specialize without formal job systems. Examples: one player mines, one maps, one gathers mushrooms, one decorates town, one prepares food and lanterns.

Soft specialization should emerge from tool choice, inventory limits, lantern upgrades, and map-marker abilities — not job labels.

Co-op must not be only a speed multiplier. Multiplayer cave runs should add shared reveal, visible teammate discoveries, marker placement, and split-route decisions that are meaningfully different from solo play.

**The town-only player problem:** The decoration/prep role risks feeling like a waiting room if town-side activities lack their own engagement loop. Players staying in town need meaningful actions without turning the overworld into a management sim.

### Architecture Decision

MVP uses **WebSockets with socket.io**. WebRTC is not appropriate for the authoritative shared-state model.

**Server authority is non-negotiable for:**

- Lantern timer (client-side timer = desync + trivial cheat)
- Cave tile reveals (server authoritative or players desync on shared map)
- Shared storage writes (two players depositing simultaneously need locking or last-write-wins)
- Town project contributions (concurrent resource increments need atomic ops)

**Disconnect behavior:** auto-extract immediately. The player keeps carried loot and returns to town. This is less dramatic than a rescue marker, but it avoids blocked passages, orphaned cave bodies, and punishment for network instability.

---

## Shared Discovery

Cave map remembers what players find. Shared map data can include:

- discovered rooms
- ore veins
- blocked tunnels
- mushroom groves
- strange doors
- danger zones
- shortcut ropes
- extraction points
- player-made signs

Example cave map:

```
Mosswound Cave

###########
#..g...?..#
#..###....#
#..#L#..o.#
#..###....#
#....>....#
###########

g = glowcap patch
? = unknown shrine
L = lantern mark
o = copper vein
> = deeper stairs
```

**Map persistence vs procedural freshness:** 
MVP caves are instanced per run. Shared discovery exists inside the active cave instance only. Long-term shared map data should track "known cave patterns" or named landmarks, not stale exact ore positions from regenerated caves.

**Automatic full-reveal may kill mystery for others.** Manual notes and signs are more social but require good UI.

---

## Cave State Lifecycle

MVP uses **instanced caves per run**.

Rules:

- Each cave entry creates a fresh instance, or joins a fresh group instance if another player entered within the short join window.
- Exact map reveal, resource depletion, markers, and hazards live only for that cave instance.
- Town progress persists; cave loot and markers do not become long-term chores.
- Future cartographer systems should remember landmarks, cave names, and player-authored notes with trust levels, not exact regenerated resource positions.

---

## ASCII Style

The game uses a readable top-down ASCII style.

Example overworld:

```
~~~~~~~~~~~~~~~~~~~~
~~~~....^^^^....~~~~
~~~...TTTTTTT...~~~~
~~...TTT...TTT...~~~
~~..TT..H..TTT...~~~
~~..T..###..T....~~~
~~.....#L#.......~~~
~~..T..###..T....~~~
~~~...cave....~~~~~~
~~~~~~~~~~~~~~~~~~~~
```

Legend:

```
~ water    . grass    ^ hills    T trees
H homes    # stone    L lantern tree
```

**Rendering decision:** MVP uses **rot.js**. It is purpose-built for ASCII/roguelike rendering, FOV, noise, and pathfinding.

**ASCII readability is fragile.** Multiple entities on one tile (player, resource, marker, light radius, hazard, dropped item, terrain) can become hard to parse. Color will carry significant meaning — colorblind-safe choices and non-color cues matter. Players need in-game inspect/hover/tooltips or a compact legend to avoid memorization friction.

---

## Procedural Cave Generation

Algorithm needed. Common options:

- **BSP (binary space partitioning)**: predictable rooms + corridors, easy to implement
- **Cellular automata**: organic cave feel — fits biome aesthetic better, needs flood-fill connectivity pass to guarantee reachability
- **Drunkard's walk**: simple, winding tunnels, sparse rooms

If MVP scope is tight, consider a **hand-authored cave** for the first prototype. One fixed cave layout to prove the loop. Swap in procedural generation after the loop is fun.

"Procedural cave rooms" in the MVP list implies:

- Room generation algorithm
- Connectivity guarantee
- Resource placement logic
- Extraction point placement
- Shared reveal/sync

That is a non-trivial feature disguised as one bullet.

Anti-repetition requirements:

- Every valid cave must include at least two lightweight landmarks, such as a shrine, rope shortcut, glowcap pocket, collapsed bridge, or unusual room shape.
- Every valid cave must include all MVP upgrade-critical resources somewhere reachable.
- Cave generation should label each run with one variety tag: "rich but distant", "shortcut-heavy", "hazard-heavy", or "wide loop".
- A five-run playtest should produce at least three runs players can describe distinctly.

---

## Persistence Layer

Town state must survive server restarts. MVP uses **SQLite** because shared storage and project contributions need atomic writes without adding an external service.

---

## Player Identity

MVP uses anonymous players with a name prompt and session cookie. Names persist in SQLite so deposits and contributions can be attributed without full auth.

---

## Shared Storage

MVP shared storage is **deposit-only**. No withdrawals, sorting, permissions, or ownership rules in MVP.

This avoids the common shared-storage complaint where players spend more time managing chests than playing. Depositing should be one action, project contribution should be one board action, and all writes must be atomic SQLite transactions.

---

## Lantern Sharing in Caves

MVP uses **independent lantern timers**. This keeps co-op flexible, supports split-route exploration, and avoids the UX problem of one player's timer punishing the group.

Post-MVP can add an optional shared-lantern mode if the independent model feels too loose.

---

## Rescue Mechanic

Cut from MVP. Burnout means: wake in town, lose some carried loot, keep permanent progress. Rescue can return post-MVP only if it creates a clear cooperative objective without punishing solo players.

---

## Cave Hazards (No Combat)

MVP avoids combat systems — fits the tone. Caves still need danger. Hazards must carry the tension without combat.

Early hazards should be navigational or lantern-related rather than health-related: darkness, getting lost, blocked paths, fragile bridges, spores, cave-ins, moving shadows, resource greed.

If hazards only slow the player down, they become annoyances instead of decisions. If hazards damage the player, the game drifts toward survival expectations.

Good hazard test: a player should be able to say "I chose the risky shortcut" or "I turned back because the route was unstable." If the player only says "that wasted my time," cut or redesign the hazard.

---

## Resource Economy

Early resources:

- wood, stone, copper, glowcaps, cave moss, clay, fiber, old coins, cracked relics, lantern oil

For MVP: stone, wood, copper, and glowcaps are enough.

**Too many resources dilute player goals.** Required upgrade resources can create bottlenecks where everyone repeats the same cave run. Rare resources can frustrate when procedural generation is streaky.

Resource economy rules:

- No MVP upgrade depends on rare random-only drops.
- Glowcaps can be uncommon, but every valid cave must contain a reachable glowcap pocket.
- First upgrade must complete in 2-4 successful solo runs with average play.
- Group scaling should increase requirements gently, capped so co-op still feels helpful.
- Inventory pressure should create "what do I carry?" choices, not long sorting sessions.

---

## First Town Upgrade: Lantern Workshop

Directly supports the core loop. Resource cost:

```
Lantern Workshop
Solo baseline:
- 18 stone
- 12 wood
- 6 copper
- 3 glowcaps

Group-scaled cap:
- 30 stone
- 20 wood
- 10 copper
- 5 glowcaps
```

Unlocks for MVP: longer lantern duration (+25%), cave markers, and a visible workshop glyph in town.

Post-MVP possible unlocks: wider lantern radius, colored lanterns, deeper cave access, improved extraction safety.

---

## Possible Cave Biomes (Future)

- Mosswound Cave
- Glowcap Grotto
- Copperroot Tunnels
- Crystal Vein
- Buried Orchard
- Old Aqueduct
- Ashwarm Depths
- Starless Ruins
- Lanternless Deep

Each biome should introduce one new idea at a time, reusing systems heavily.

**Deeper caves require town upgrades — pacing trap:** If early caves run out of interesting content before the first upgrade is complete, players stall. MVP has one cave with no depth progression — that one cave must carry the entire upgrade arc.

---

## Tone

Should feel: cozy, mysterious, slow, readable, lightly risky, multiplayer-friendly, session-friendly.

Should avoid: brutal permadeath, heavy colony management, high-speed combat, stressful survival meters, large automation chains, PvP focus, overwhelming crafting trees.

---

## Session Length

A full loop (town prep + cave run + deposit + upgrade) must fit a reasonable session. If a full loop takes too long, players quit mid-run or skip town interactions. If too short, progression feels thin. Multiplayer groups need natural join/leave points.

**MVP target: 5–10 minutes for a complete cave run** — worth testing early.

The first full upgrade arc should fit a short evening: learn town, run caves, deposit, complete Lantern Workshop. If testers describe it as "grindy" before the first upgrade, the resource costs are too high or cave decisions are too thin.

---

## Design Rule

Every system should answer at least one of:

- Does this make town feel more like home?
- Does this make cave runs more interesting?
- Does this help players share discoveries?
- Does this create a meaningful reason to bring resources back?
- Does this reduce friction without removing an interesting decision?

If not, cut it or delay it.

---

## MVP Scope

### Required Features

- Browser-based multiplayer
- Top-down ASCII movement
- One shared town map
- One cave entrance
- Procedural cave rooms (or hand-authored for initial prototype)
- Lantern timer with shrinking vision
- Basic gathering
- Basic mining
- Extraction point
- Shared town storage (deposit box, not full inventory system)
- One town upgrade: Lantern Workshop
- One or two player map markers
- Town board with current goal, missing resources, recent contributions, and next action

### Avoid in MVP

- farming
- NPC schedules
- complex crafting
- combat systems
- weather / seasons / hunger
- large overworld generation
- economy systems
- automation
- item durability system (use one-tier damage only if needed)
- decoration placement
- player-made signs (unless trivially simple)
- rare-drop progression gates
- withdrawal permissions and storage ownership

### MVP Proof Statement

> Walk around, enter cave, gather resources, extract, upgrade town.
> Is it fun to leave town, gather in the dark, and decide whether to push one more room before returning?
> Can players complete the first town upgrade without feeling like the game became a material grind?

---

## Scope Watchlist

Features likely to expand beyond apparent size — introduce deliberately:

- Shared storage (race conditions, permissions, sorting)
- Inventory UI (can become one of the largest tasks)
- Cave map persistence (tile mutations, ore veins, markers, room data)
- Procedural generation tooling (rules, tables, landmarks, balance)
- Multiplayer reconnects (especially mid-run)
- Lighting and visibility
- Town upgrade effects (spatial changes, not just stat boosts)
- Player-made signs and markers
- Extraction failure states
- Item durability
- Decoration placement

---

## MVP Decisions Locked

| Decision | MVP Choice |
|---|---|
| Multiplayer architecture | WebSockets with socket.io |
| Cave state lifecycle | Instanced per run |
| Rendering library | rot.js |
| Persistence layer | SQLite |
| Player identity | Anonymous name + session cookie |
| Disconnect behavior | Auto-extract |
| Lantern sharing model | Independent timers |
| Rescue mechanic | Cut from MVP |

---

## Working Taglines

- A cozy ASCII extraction game about bringing light home.
- Build the hollow. Brave the dark. Bring something back.
- A quiet town above a hungry dark.
- Bring back what the lantern shows you.
