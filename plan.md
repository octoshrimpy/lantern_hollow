# Lantern Hollow

A cozy browser-based multiplayer ASCII game about building a quiet town and taking short lantern-lit extraction trips into strange caves.

## Pitch

Lantern Hollow is a top-down ASCII multiplayer game where players live in a calm overworld village built around an old lantern tree. By day, they prepare, craft, decorate, and contribute to town projects. When ready, they enter nearby caves to gather resources, discover relics, find seeds, and return before their lantern fades.

The core feeling is:

> "I'm going into the moss cave for copper and glowcaps. I'll be back before the lantern burns out."

## Genre

- Cozy extraction-lite
- Top-down ASCII adventure
- Light town-building
- Multiplayer resource gathering
- Calm overworld + mysterious dungeons

## Inspirations

Lantern Hollow pulls ideas from:

- Core Keeper
- Stardew Valley
- Caves of Qud
- Dwarf Fortress Adventure Mode
- Minecraft
- Terraria
- Starbound
- Songs of Syx
- Regions of Ruin
- Forager

It should avoid feeling like:

- Dwarf Fortress Fortress Mode
- RimWorld
- Oxygen Not Included
- Age of Empires
- The Sims

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

The town should feel like home, not a management sim.

### 2. Lantern Runs

Caves are short extraction-like dungeons.

Players enter with a lantern, gather what they can, and return before the light fades.

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

Failure should be gentle.

Players do not permanently die. Instead, they may:

- lose some carried loot
- wake up back in town
- leave a rescue marker
- damage one item
- create a small town event

### 3. Shared Town Growth

The town grows from what players bring back.

Players contribute gathered resources to shared projects such as:

- Lantern Workshop
- Mushroom Kitchen
- Cartographer's Porch
- Old Well
- Bridge Repair
- Tool Shed
- Glow Garden
- Bell Tower
- Cave Lift

Town projects unlock new options without requiring heavy simulation or micromanagement.

## Main Game Loop

```text
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

## Multiplayer Focus

Lantern Hollow should support small, friendly multiplayer sessions.

Ideal player count:

* 1-4 players for MVP
* 2-8 players long-term

Players share:

* town storage
* discovered cave maps
* town projects
* signs and map markers
* unlocked cave regions

Players should be able to naturally specialize without formal job systems.

Examples:

* one player mines
* one player maps
* one player gathers mushrooms
* one player decorates town
* one player prepares food and lanterns

## Shared Discovery

The cave map remembers what players find.

Shared map data can include:

* discovered rooms
* ore veins
* blocked tunnels
* mushroom groves
* strange doors
* danger zones
* shortcut ropes
* extraction points
* player-made signs

Example cave map:

```text
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

## ASCII Style

The game should use a readable top-down ASCII style.

Example overworld:

```text
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

```text
~ water
. grass
^ hills
T trees
H homes
# stone
L lantern tree
```

## Tone

Lantern Hollow should feel:

* cozy
* mysterious
* slow
* readable
* lightly risky
* multiplayer-friendly
* session-friendly

It should avoid:

* brutal permadeath
* heavy colony management
* high-speed combat
* stressful survival meters
* large automation chains
* PvP focus
* overwhelming crafting trees

The central tension should be:

> "Do I have enough lantern left to check one more room?"

## MVP Scope

The first playable prototype should be small.

### Required MVP Features

* Browser-based multiplayer
* Top-down ASCII movement
* One shared town map
* One cave entrance
* Procedural cave rooms
* Lantern timer
* Basic gathering
* Basic mining
* Extraction point
* Shared town storage
* One town upgrade: Lantern Workshop

### Avoid in MVP

Do not start with:

* farming
* NPC schedules
* complex crafting
* combat systems
* weather
* seasons
* hunger
* large overworld generation
* economy systems
* automation

The MVP should prove:

> Walk around, enter cave, gather resources, extract, upgrade town.

## First Town Upgrade

### Lantern Workshop

The Lantern Workshop is the first upgrade because it directly supports the core loop.

It can unlock:

* longer lantern duration
* wider lantern radius
* colored lanterns
* cave markers
* deeper cave access
* improved extraction safety

Example resource cost:

```text
Lantern Workshop
Requires:
- 30 stone
- 20 wood
- 10 copper
- 5 glowcaps
```

## Possible Cave Biomes

Future cave regions could include:

* Mosswound Cave
* Glowcap Grotto
* Copperroot Tunnels
* Crystal Vein
* Buried Orchard
* Old Aqueduct
* Ashwarm Depths
* Starless Ruins
* Lanternless Deep

Each biome should introduce a small number of new resources, hazards, and discoveries.

## Resource Examples

Early resources:

* wood
* stone
* copper
* glowcaps
* cave moss
* clay
* fiber
* old coins
* cracked relics
* lantern oil

## Design Rule

Every system should answer at least one of these questions:

* Does this make town feel more like home?
* Does this make cave runs more interesting?
* Does this help players share discoveries?
* Does this create a meaningful reason to bring resources back?

If not, cut it or delay it.

## Working Taglines

* A cozy ASCII extraction game about bringing light home.
* Build the hollow. Brave the dark. Bring something back.
* A quiet town above a hungry dark.
* Bring back what the lantern shows you.
