type Mode = 'game_start' | 'static_mining';

type CreepRole =
  | 'harvester'
  | 'miner'
  | 'transporter'
  | 'operator'
  | 'missionner'
  | 'upgrader'
  | 'builder';

type SourceMemory = {
  id: Id<Source>;
  link?: Id<StructureLink>; // TODO Populate if empty and link is at one distance
};

type TowerMemory = {
  id: Id<StructureTower>;
};

type LinkMemory = {
  id: Id<StructureLink>;
  target: Id<StructureLink> | null; // Note: currently manual
};

// ------------------------------------------------------------------------------
// This gets filled in at the very start of the first tick
interface Memory {
  startingTick: number;
}

interface RoomMemory {
  mode: Mode;
  sources: SourceMemory[];

  // TODO Instead of this, use a function?
  mainStorage: Id<StructureContainer> | Id<StructureStorage> | null;

  // containers:
  towers: TowerMemory[];
  links: LinkMemory[];

  fortificationsMaxHits: number;
}

// TODO Use discriminated unions?
interface CreepMemory {
  room: string;
  role: CreepRole;
  recharging: boolean;
  counter: number;
  sourceId: Id<Source> | null;
}

// TODO Set up the spawn queue (weighted queue?)
// TODO Make sure an item is added early (based on distance and movement speed)
// interface SpawnMemory {}
