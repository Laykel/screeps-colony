type Mode = 'container' | 'source';
type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder' | 'operator' | 'miner';

interface Memory {
  mode?: Mode;
}

interface CreepMemory {
  role: CreepRole;
  recharging?: boolean;
  building?: boolean;
  upgrading?: boolean;
}

// interface RoomMemory {}

// interface FlagMemory {}
// interface SpawnMemory {}
