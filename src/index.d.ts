type Mode = 'game_start' | 'static_mining';

type CreepRole =
  | 'harvester'
  | 'miner'
  | 'transporter'
  | 'operator'
  | 'missionner'
  | 'upgrader'
  | 'builder';

type RoomState = {
  sources: Id<Source>[];
  towers: Id<StructureTower>[];
  fortificationsMaxHits: number;

  mainStorage?: Id<StructureContainer>;
  containerLink?: Id<StructureLink>;
};

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
  role: CreepRole;
  recharging: boolean;
  sourceId?: Id<Source>;
}

// interface FlagMemory {}
// interface SpawnMemory {}
