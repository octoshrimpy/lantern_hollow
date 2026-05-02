# Lantern Hollow — Implementation Sprints

Decisions locked before Sprint 0 begins. All 8 open decisions resolved here to unblock implementation.

---

## Pre-Sprint: Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Multiplayer | WebSockets (socket.io) | Server authority required for lantern timer, storage, cave reveals |
| Cave lifecycle | Instanced per run | Safest for MVP; shared map tracks "known layouts" only |
| Rendering | rot.js | Purpose-built for ASCII, FOV, noise, pathfinding |
| Persistence | SQLite | Single file, ACID, right-sized for MVP |
| Player identity | Anonymous + name prompt | Session cookie for reconnect; name persists in SQLite |
| Disconnect behavior | Auto-extract | Character removed from cave, loot preserved, no rescue needed |
| Lantern sharing | Independent timers | Simpler, players can split up; shared timer post-MVP |
| Rescue mechanic | Cut | "Wake in town, lose some carried loot." No rescue system in MVP. |

---

## Complaint Guardrails

These are implementation requirements, not flavor. Closest comparable games often get complaints about grind, repetition, unclear progression, inventory friction, RNG bottlenecks, and weak long-term motivation.

| Risk | Guardrail |
|---|---|
| Repetitive resource errands | Every cave run must contain at least one variable choice beyond "collect nearest ore": route risk, landmark, hazard, marker, or distant richer pocket |
| Grindy progression | First upgrade target: solo completion in 2-4 successful runs; 2-player completion in 1-3 successful runs |
| Unclear goals | Town board always shows current project, exact missing resources, unlock effect, and next visible town change |
| Inventory friction | MVP inventory stays flat, sortable only by fixed resource order, with one-action deposit-all |
| Rare RNG bottlenecks | No MVP upgrade requires rare random-only drops; glowcaps are uncommon but guaranteed per valid cave |
| Weak reason to keep playing | Each completed project must add a visible town glyph/area plus one mechanical unlock |
| Multiplayer is just faster solo | Group cave runs must create shared reveal, markers, or split-route decisions that solo play cannot produce |
| Punishing failure | Burnout costs carried loot only; never removes permanent progress, town resources, upgrades, or the lantern |

---

## Sprint 0 — Foundation

**Goal:** Running client/server skeleton. Nothing visible yet except a blank canvas.

### Tasks
- [ ] Init Node.js project (ESM, no framework)
- [ ] Install: `socket.io`, `rot-js`, `better-sqlite3`, `vite` (dev)
- [ ] `server/index.js` — HTTP + socket.io attach
- [ ] `client/index.html` — canvas mount point
- [ ] `client/main.js` — rot.js `Display` init, blank render loop
- [ ] SQLite schema: `players`, `town_state`, `cave_instances`, `town_storage`, `project_contributions`
- [ ] Socket.io connect/disconnect logging
- [ ] Dev proxy (vite → node)
- [ ] `npm run dev` starts both

### Done when
Client connects, server logs it, blank rot.js display renders in browser.

---

## Sprint 1 — Overworld Walkabout

**Goal:** Single player walks around a visible town. No server state yet, just rendering + input.

### Tasks
- [ ] Hand-author town map as 2D tile array (`~`, `.`, `^`, `T`, `H`, `#`, `L`)
- [ ] rot.js tile renderer with color map per glyph
- [ ] Player glyph (`@`) renders on map
- [ ] Arrow key / WASD movement with collision detection
- [ ] Viewport scrolls to keep player centered
- [ ] Compact in-screen legend (bottom bar)
- [ ] Town board (`B`), deposit box (`D`), cave entrance (`C`), and lantern tree (`L`) are visible from the starting route
- [ ] `server/state.js` — player registry (id → {name, x, y})
- [ ] Socket events: `player:join`, `player:move`, `player:leave`
- [ ] Broadcast positions; render all connected players

### Done when
Two browser tabs, two `@` glyphs walk around town independently, and a new player can see the cave entrance, deposit box, and board without wandering.

---

## Sprint 2 — Cave Entry + Lantern

**Goal:** Player enters cave, lantern ticks, vision shrinks, player extracts. One player, no gathering.

### Tasks
- [ ] Hand-author cave map (`#` walls, `.` floor, `>` extraction point, `E` entrance)
- [ ] Cave entrance tile on town map triggers `cave:enter` event
- [ ] Server creates cave instance for player, sends cave map + entry position
- [ ] Client switches renderer to cave map on `cave:enter`
- [ ] `server/lantern.js` — per-player timer, ticks server-side, emits `lantern:tick`
- [ ] Client renders lantern radius as FOV via rot.js `FOV.PreciseShadowcasting`
- [ ] Lantern radius shrinks as timer decreases (3 stages: full / half / dim)
- [ ] Timer UI shows both time remaining and current light stage in plain language
- [ ] Extraction point `>` tile: player moves onto it → `cave:extract` event
- [ ] Server ends instance, returns player to town position, preserves inventory
- [ ] Lantern burnout: timer hits 0 → `cave:burnout` → player loses 30% inventory, wakes in town
- [ ] Client shows lantern timer UI (bar or numeric, top corner)

### Done when
Enter cave, walk around in shrinking light, step on `>` to return. Let lantern die to test loss state.

---

## Sprint 3 — Gathering + Storage

**Goal:** Resources exist in cave. Player picks them up. Player deposits in town. Loop closes.

### Tasks
- [ ] `server/resources.js` — resource type registry (`stone`, `wood`, `copper`, `glowcap`)
- [ ] Place resources on hand-authored cave map at fixed positions
- [ ] Guarantee at least one of each MVP resource exists in every test cave; no upgrade-critical rare drop can be absent
- [ ] `cave:gather` event: player moves onto resource tile, resource added to inventory, tile cleared
- [ ] Player inventory: flat 12-slot resource stacks, server-authoritative, fixed display order (`stone`, `wood`, `copper`, `glowcap`)
- [ ] Client renders inventory as sidebar or bottom panel
- [ ] Town deposit box tile (`D`) on overworld
- [ ] `town:deposit` event: one-action deposit-all into shared SQLite `town_storage` table
- [ ] Town storage panel: shows current stockpile counts
- [ ] `town:withdraw` blocked in MVP (deposit only)

### Done when
Enter cave → gather 3 copper → extract → walk to deposit box → deposit once → storage shows copper count increased. Inventory management takes no sorting or chest juggling.

---

## Sprint 4 — Town Board + First Upgrade

**Goal:** Lantern Workshop project visible, contributable, completable. Town changes visually on completion.

### Tasks
- [ ] `server/projects.js` — project registry, required resources, current contributions
- [ ] SQLite `projects` table: `(id, name, requirements JSON, contributed JSON, complete bool)`
- [ ] Town board tile (`B`) on overworld
- [ ] `town:board` event returns active project list + contribution totals
- [ ] Client renders board as overlay panel (open/close on interact)
- [ ] `town:contribute` event: move N resources from storage into project contributions (atomic SQLite transaction)
- [ ] Lantern Workshop solo baseline: `{stone:18, wood:12, copper:6, glowcap:3}`
- [ ] Scale Lantern Workshop requirements by active contributor count, capped at `{stone:30, wood:20, copper:10, glowcap:5}`
- [ ] Board shows missing resources, completion percentage, unlock effect, and visible town change before contribution
- [ ] Board shows last 5 deposits/contributions by player name
- [ ] Project completion check after every contribution
- [ ] On Lantern Workshop complete: server patches town map (add workshop glyph `W`), broadcasts `town:mapUpdate`
- [ ] Unlock effect: lantern timer duration +25% and marker placement for all players (server-side constants)
- [ ] Board shows completion state and unlock description

### Done when
Gather enough over 2-4 solo runs, contribute at board, workshop glyph appears, next cave run lasts longer, and the next goal is clear.

---

## Sprint 5 — Multiplayer Cave

**Goal:** Multiple players in same cave instance. Shared map reveal. Map markers.

### Tasks
- [ ] Cave instance supports multiple players (shared instance if entering same cave within 10s, else own)
- [ ] `cave:playerJoin` / `cave:playerLeave` broadcast within instance
- [ ] Each player's FOV reveal merged into shared instance fog-of-war
- [ ] `cave:revealSync` — server sends full revealed tile set on join, diffs after
- [ ] Player glyphs in cave use different colors per player
- [ ] `cave:mark` event: place marker glyph (`!` danger, `*` resource) on tile
- [ ] Markers stored in cave instance, broadcast to all players in instance
- [ ] Shared reveal panel or minimap strip indicates newly revealed rooms by teammate activity
- [ ] Resource placement includes at least one optional branch where splitting up can reveal more before extraction
- [ ] Disconnect mid-cave: auto-extract immediately (inventory preserved), instance cleaned up if empty
- [ ] Other players see disconnected player's last position flash and disappear

### Done when
Two players enter same cave, see each other move, place markers, reveal different branches, and one disconnects cleanly.

---

## Sprint 6 — Procedural Caves

**Goal:** Replace hand-authored cave with generated caves. Each instance is fresh.

### Tasks
- [ ] `server/cavegen.js` — cellular automata generator
  - Fill grid randomly (45% wall)
  - Run 4–5 smoothing passes (neighbor count rule)
  - Flood-fill connectivity check; fill isolated regions
  - Guarantee entrance and extraction point reachable
- [ ] Resource placement: scatter resources weighted by distance from entrance
- [ ] Resource placement guarantees required MVP resources are reachable in every cave
- [ ] Extraction point placement: far from entrance (min distance threshold)
- [ ] Add 2-3 lightweight landmarks per cave (`?` shrine, `r` rope shortcut, `p` glowcap pocket) with inspect text
- [ ] Add run variety tags: at least one of "rich but distant", "shortcut-heavy", "hazard-heavy", or "wide loop" per generated cave
- [ ] Cave size scales to biome constant (single biome: Mosswound Cave for MVP)
- [ ] Each `cave:enter` generates fresh instance; seed stored for debug replay
- [ ] Smoke test: generate 100 caves, assert all have valid paths entrance → exit
- [ ] Smoke test: generate 100 caves, assert each has all MVP resources, at least 2 landmarks, and no single-tile mandatory choke blocked by hazards

### Done when
Every cave run is unique, connected, readable, and contains enough guaranteed resources/landmarks that progression cannot stall on bad RNG.

---

## Sprint 7 — Feel + Balance

**Goal:** Lantern feels right. Failure is gentle but not meaningless. Solo pacing works.

### Tasks
- [ ] Playtest target: 5–10 min complete cave run
- [ ] Tune lantern timer (start with 8 min, adjust via playtests)
- [ ] Tune cave size to match timer (too big = always burns out)
- [ ] Tune resource density (solo: can fill 12 slots in 5 min without rushing)
- [ ] Solo scaling: if active contributor count is 1, use Lantern Workshop solo baseline cost
- [ ] Contribution pacing test: first upgrade completion never requires more than 4 successful solo runs with average play
- [ ] Burnout loot loss: lose top 30% of inventory by quantity (not equipped lantern, never)
- [ ] Item damage: on burnout, one random item marked `cracked` (cosmetic only in MVP)
- [ ] Cave hazard pass: add 2 navigational hazards
  - `S` spore cloud: slows movement (3 tile radius, visible as dim overlay)
  - `~` unstable floor: collapses after 3 steps, becomes wall — blocks backtrack
- [ ] Hazards must force a decision, not just annoyance — validate in playtest
- [ ] Repetition test: after 5 consecutive runs, player can name what made at least 3 of them different
- [ ] Inventory friction test: deposit and contribute flow takes under 20 seconds after returning to town

### Done when
A solo 8-minute cave run feels tense at the end, not stressful from the start, and the first upgrade feels like a short objective rather than a grind.

---

## Sprint 8 — MVP Polish

**Goal:** Playable by someone who has never seen the game. Readable, legible, complete loop.

### Tasks
- [ ] Colorblind-safe palette audit (no red/green meaning pairs without shape cues)
- [ ] Tile inspect: hover or `?` key over any tile shows tooltip (glyph, name, description)
- [ ] In-screen legend always visible (bottom strip, not obscuring map)
- [ ] Town board shows: active project, contributions needed, who contributed recently (last 5)
- [ ] Town board shows the next recommended action after every state: "need copper", "deposit at D", "workshop complete", etc.
- [ ] Name prompt on first connect (modal, stored in SQLite + session cookie)
- [ ] Name persists on reconnect via cookie
- [ ] Loading state: show "Connecting…" before socket ready
- [ ] Error state: show "Lost connection. Reconnecting…" with auto-retry
- [ ] `README.md`: how to run locally, how to connect
- [ ] Manual playtest checklist: solo run, 2-player run, disconnect mid-cave, burnout, full upgrade arc, 5-run repetition check, inventory friction check

### Done when
A fresh user can open browser, enter name, walk around, enter cave, gather, extract, deposit, contribute to workshop — without asking for help.

---

## Scope Watchlist (Do Not Expand in MVP)

These will pull scope if touched — stay disciplined:

- Shared storage permissions / sorting / ownership
- Inventory UI beyond flat slot grid
- Cave map persistence between instances
- Procedural generation tuning tools
- Multiplayer reconnect mid-cave (auto-extract handles it)
- Decoration placement
- Player-made signs
- Item durability beyond one-tier cosmetic
- Any second cave biome

---

## Post-MVP Backlog (Ordered)

1. Shared lantern timer option (toggle per cave instance)
2. Second town upgrade (Mushroom Kitchen or Cartographer's Porch)
3. Second cave biome (Glowcap Grotto — reuse all systems, one new tile type)
4. Soft long-term goal: Bell Tower (big project, unlocks end-state feeling)
5. Player-made signs (text on tile, persists in instance)
6. Cartographer specialization (auto-marks resource tiles on reveal)
7. Cave map persistence across resets for layout-only data
8. Rescue mechanic (define: rescuer enters, finds marker tile, extracts it — reward: split recovered loot)

---

## Sprint Sequence Summary

| Sprint | Theme | Key Output |
|---|---|---|
| 0 | Foundation | Running skeleton, blank canvas |
| 1 | Overworld | Town renders, players walk, multiplayer positions sync |
| 2 | Cave + Lantern | Cave entry, FOV shrinks, extract or burn out |
| 3 | Gathering + Storage | Full deposit loop, inventory, storage panel |
| 4 | Town Board + Upgrade | Lantern Workshop completable, town changes |
| 5 | Multiplayer Cave | Shared instances, map reveal, markers, disconnect |
| 6 | Procedural Caves | Generated caves, connectivity guaranteed |
| 7 | Feel + Balance | Lantern tuned, hazards, gentle failure |
| 8 | MVP Polish | Readable, inspectable, complete by a stranger |
