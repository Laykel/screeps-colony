type CreepRole = 'harvester' | 'transporter' | 'upgrader' | 'builder';

// interface Memory {}

interface CreepMemory {
  role: CreepRole;
  building?: boolean;
  upgrading?: boolean;
}

// interface FlagMemory {}
// interface SpawnMemory {}
// interface RoomMemory {}
