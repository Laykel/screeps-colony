type Mode = 'game_start' | 'static_mining';

type CreepRole =
  | 'harvester'
  | 'miner'
  | 'transporter'
  | 'operator'
  | 'missionner'
  | 'upgrader'
  | 'builder';

// ------------------------------------------------------------------------------
// This gets filled in at the very start of the first tick
interface Memory {
  startingTick: number;

  firstSpawnName: string;
  firstRoomName: string;
}

interface RoomMemory {
  mode: Mode;
  sources: Id<Source>[];

  mainStorage: Id<StructureContainer> | null;

  towers: Id<StructureTower>[];
  links: Id<StructureLink>[];

  fortificationsMaxHits: number;
}

// TODO Use discriminated unions
interface CreepMemory {
  room: string;
  role: CreepRole;
  recharging: boolean;
  sourceId?: Id<Source>;
  counter?: number;
}

// TODO Set up the spawn queue (weighted queue?)
// TODO Make sure an item is added early (based on distance and movement speed)
// interface SpawnMemory {}
