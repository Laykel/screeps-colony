type Mode = 'container' | 'source' | 'game_start' | 'static_mining';
type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder' | 'operator' | 'miner';

// This gets filled in at the very start of the first tick
interface Memory {
  startingTick: number;
  mode: Mode;

  firstSpawnName: string;
  firstRoomName: string;

  // TODO When going multi-room, this needs to be per-room
  sourceIds: Id<Source>[];
  towerIds: Id<StructureTower>[];
  mainStorageId?: Id<StructureContainer>;
}

// TODO Use discriminated unions
interface CreepMemory {
  role: CreepRole;
  recharging: boolean;
  sourceId?: Id<Source>;
}

// interface RoomMemory {}

// interface FlagMemory {}
// interface SpawnMemory {}
