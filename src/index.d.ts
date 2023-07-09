type Mode = 'container' | 'source';
type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder';

interface Memory {
  mode?: Mode;
}

interface CreepMemory {
  role: CreepRole;
  building?: boolean;
  upgrading?: boolean;
}

// interface RoomMemory {}

// interface FlagMemory {}
// interface SpawnMemory {}
