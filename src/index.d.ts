type Mode = 'container' | 'source' | 'game_start' | 'static_mining';
type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder' | 'operator' | 'miner';

interface Memory {
  mode?: Mode;
  state?: {
    storedEnergy: number;
  };
}

interface CreepMemory {
  role: CreepRole;
  recharging?: boolean;
  sourceId?: Id<Source>; // This should become not-undefined
}

// interface RoomMemory {}

// interface FlagMemory {}
// interface SpawnMemory {}
