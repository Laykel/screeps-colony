type Mode = 'container' | 'source' | 'game_start' | 'static_mining';
type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder' | 'operator' | 'miner';

// This gets filled in at the very start of the first tick
// TODO Will need refactor when going multi-room
interface Memory {
  firstSpawnName: string;
  firstRoomName: string;

  startingTick: number;
  mode: Mode;

  sourceIds: Id<Source>[];
  mainStorageId?: Id<StructureContainer>;
}

// TODO Use discriminated unions
interface CreepMemory {
  role: CreepRole;
  recharging: boolean;
  sourceId?: Id<Source>; // This should become not-undefined
}

// interface RoomMemory {}

// interface FlagMemory {}
// interface SpawnMemory {}
