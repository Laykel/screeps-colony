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
  mode: Mode;

  firstSpawnName: string;
  firstRoomName: string;
}

interface RoomMemory {
  sources: Id<Source>[];

  mainStorage?: Id<StructureContainer>;

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
}

// TODO Set up the spawn queue (weighted queue?)
// TODO Make sure an item is added early (based on distance and movement speed)
// interface SpawnMemory {}
